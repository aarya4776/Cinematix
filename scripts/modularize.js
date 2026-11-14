/**
 * Step 30: Modularize directorEngine.js
 * Extracts large data/utility blocks into separate files.
 * Run with: node scripts/modularize.js
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const enginePath = path.join(root, 'src', 'services', 'directorEngine.js');

const content = fs.readFileSync(enginePath, 'utf8');
const lines = content.split('\n');

// ── Helpers ────────────────────────────────────────────────────────────────────

function findLine(pattern) {
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(pattern)) return i; // 0-indexed
  }
  return -1;
}

/**
 * Extracts from startIdx (0-indexed) until the top-level closing '};' is found.
 * Also captures any comment lines immediately above startIdx.
 */
function extractBlock(startIdx, withComment = true) {
  // Walk back to capture the section comment above
  let commentStart = startIdx;
  if (withComment) {
    for (let i = startIdx - 1; i >= 0; i--) {
      const l = lines[i].trim();
      if (l.startsWith('//') || l === '') {
        commentStart = i;
      } else {
        break;
      }
    }
  }

  // Walk forward to find matching closing '};'
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < lines.length; i++) {
    const l = lines[i];
    for (const ch of l) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
    }
    if (depth === 0 && i > startIdx) {
      endIdx = i;
      break;
    }
  }

  return {
    commentStart,
    blockStart: startIdx,
    blockEnd: endIdx,
    commentLines: lines.slice(commentStart, startIdx),
    blockLines: lines.slice(startIdx, endIdx + 1),
  };
}

/**
 * Extracts an arrow function const from startIdx until its closing '};'
 */
function extractArrowFn(startIdx) {
  let commentStart = startIdx;
  for (let i = startIdx - 1; i >= 0; i--) {
    const l = lines[i].trim();
    if (l.startsWith('//') || l === '') commentStart = i;
    else break;
  }

  let depth = 0;
  let endIdx = startIdx;
  let started = false;
  for (let i = startIdx; i < lines.length; i++) {
    const l = lines[i];
    for (const ch of l) {
      if (ch === '{') { depth++; started = true; }
      if (ch === '}') depth--;
    }
    if (started && depth === 0) { endIdx = i; break; }
  }

  return {
    commentStart,
    blockStart: startIdx,
    blockEnd: endIdx,
    commentLines: lines.slice(commentStart, startIdx),
    blockLines: lines.slice(startIdx, endIdx + 1),
  };
}

// ── Ensure directories exist ───────────────────────────────────────────────────

const dirs = [
  path.join(root, 'src', 'engine'),
  path.join(root, 'src', 'data'),
  path.join(root, 'src', 'scoring'),
  path.join(root, 'src', 'utils'),
  path.join(root, 'src', 'validation'),
];

for (const d of dirs) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
    console.log(`Created: ${path.relative(root, d)}`);
  } else {
    console.log(`Exists:  ${path.relative(root, d)}`);
  }
}

// ── Locate blocks ──────────────────────────────────────────────────────────────

const ecoIdx        = findLine(/^const CINEMA_ECOSYSTEMS = \{/);
const worldviewIdx  = findLine(/^const DIRECTOR_WORLDVIEW = \{/);
const grammarIdx    = findLine(/^const CINEMATIC_GRAMMAR = \{/);
const inferEcoIdx   = findLine(/^const inferDynamicEcosystem = /);

console.log('\nFound blocks at (0-indexed):');
console.log(`  CINEMA_ECOSYSTEMS:      line ${ecoIdx + 1}`);
console.log(`  DIRECTOR_WORLDVIEW:     line ${worldviewIdx + 1}`);
console.log(`  CINEMATIC_GRAMMAR:      line ${grammarIdx + 1}`);
console.log(`  inferDynamicEcosystem:  line ${inferEcoIdx + 1}`);

// ── Extract each block ─────────────────────────────────────────────────────────

const ecoBlock       = extractBlock(ecoIdx);
const worldviewBlock = extractBlock(worldviewIdx);
const grammarBlock   = extractBlock(grammarIdx);
const inferEcoBlock  = extractArrowFn(inferEcoIdx);

// Also extract getWorldviewTags (arrow fn after DIRECTOR_WORLDVIEW)
const wvTagIdx = findLine(/^const getWorldviewTags = /);
const wvTagBlock = extractArrowFn(wvTagIdx);

// Also extract getGrammarTags (arrow fn after CINEMATIC_GRAMMAR)
const gramTagIdx = findLine(/^const getGrammarTags = /);
const gramTagBlock = extractArrowFn(gramTagIdx);

// ── Write new module files ─────────────────────────────────────────────────────

function joinBlock(info) {
  return [...info.commentLines, ...info.blockLines].join('\n');
}

// src/data/ecosystems.js
const ecoContent = `// ─── Cinema Ecosystems Data ─────────────────────────────────────────────────
// Extracted from directorEngine.js — Step 30B

${joinBlock(ecoBlock).replace(/^const CINEMA_ECOSYSTEMS/, 'export const CINEMA_ECOSYSTEMS')}
`;
fs.writeFileSync(path.join(root, 'src', 'data', 'ecosystems.js'), ecoContent, 'utf8');
console.log('\nWrote: src/data/ecosystems.js');

// src/data/worldviews.js
const worldviewContent = `// ─── Director Worldview / Cinematic DNA Data ────────────────────────────────
// Extracted from directorEngine.js — Step 30C

${joinBlock(worldviewBlock).replace(/^const DIRECTOR_WORLDVIEW/, 'export const DIRECTOR_WORLDVIEW')}

${joinBlock(wvTagBlock).replace(/^const getWorldviewTags/, 'export const getWorldviewTags')}
`;
fs.writeFileSync(path.join(root, 'src', 'data', 'worldviews.js'), worldviewContent, 'utf8');
console.log('Wrote: src/data/worldviews.js');

// src/data/grammar.js
const grammarContent = `// ─── Cinematic Grammar / Form Language Data ─────────────────────────────────
// Extracted from directorEngine.js — Step 30D

${joinBlock(grammarBlock).replace(/^const CINEMATIC_GRAMMAR/, 'export const CINEMATIC_GRAMMAR')}

${joinBlock(gramTagBlock).replace(/^const getGrammarTags/, 'export const getGrammarTags')}
`;
fs.writeFileSync(path.join(root, 'src', 'data', 'grammar.js'), grammarContent, 'utf8');
console.log('Wrote: src/data/grammar.js');

// src/utils/inferDynamicEcosystem.js
const inferEcoContent = `// ─── Dynamic Ecosystem Inference ────────────────────────────────────────────
// Extracted from directorEngine.js — Step 30G

${joinBlock(inferEcoBlock).replace(/^const inferDynamicEcosystem/, 'export const inferDynamicEcosystem')}
`;
fs.writeFileSync(path.join(root, 'src', 'utils', 'inferDynamicEcosystem.js'), inferEcoContent, 'utf8');
console.log('Wrote: src/utils/inferDynamicEcosystem.js');

// ── Patch directorEngine.js ────────────────────────────────────────────────────

// Collect all ranges to remove (sorted descending so we can splice without index drift)
const toRemove = [
  { start: ecoBlock.commentStart, end: ecoBlock.blockEnd },
  { start: worldviewBlock.commentStart, end: worldviewBlock.blockEnd },
  { start: wvTagBlock.commentStart, end: wvTagBlock.blockEnd },
  { start: grammarBlock.commentStart, end: grammarBlock.blockEnd },
  { start: gramTagBlock.commentStart, end: gramTagBlock.blockEnd },
  { start: inferEcoBlock.commentStart, end: inferEcoBlock.blockEnd },
].sort((a, b) => b.start - a.start);

const patchedLines = [...lines];

for (const range of toRemove) {
  patchedLines.splice(range.start, range.end - range.start + 1);
}

// Add imports after line 1 (after the existing import)
const importBlock = [
  `import { CINEMA_ECOSYSTEMS } from '../data/ecosystems';`,
  `import { DIRECTOR_WORLDVIEW, getWorldviewTags } from '../data/worldviews';`,
  `import { CINEMATIC_GRAMMAR, getGrammarTags } from '../data/grammar';`,
  `import { inferDynamicEcosystem } from '../utils/inferDynamicEcosystem';`,
  '',
];

// Find first import line and insert after it
let lastImportIdx = 0;
for (let i = 0; i < patchedLines.length; i++) {
  if (patchedLines[i].startsWith('import ')) lastImportIdx = i;
  else if (lastImportIdx > 0 && !patchedLines[i].startsWith('import ')) break;
}
patchedLines.splice(lastImportIdx + 1, 0, ...importBlock);

// Also fix any remaining `const` references that should now be imported
// (getWorldviewTags and getGrammarTags were already exported from their modules)

const patched = patchedLines.join('\n');
fs.writeFileSync(enginePath, patched, 'utf8');
console.log('Patched: src/services/directorEngine.js');

console.log('\n✅ Modularization complete!');
console.log('Run: npm run build   to verify');
