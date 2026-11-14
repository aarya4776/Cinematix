/**
 * Step 30: Modularize directorEngine.js
 * Run with: node scripts/modularize.cjs
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
    if (lines[i].match(pattern)) return i;
  }
  return -1;
}

function extractBlock(startIdx) {
  let commentStart = startIdx;
  for (let i = startIdx - 1; i >= 0; i--) {
    const l = lines[i].trim();
    if (l.startsWith('//') || l === '') commentStart = i;
    else break;
  }
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '{') depth++;
      if (ch === '}') depth--;
    }
    if (depth === 0 && i > startIdx) { endIdx = i; break; }
  }
  return { commentStart, blockStart: startIdx, blockEnd: endIdx,
           commentLines: lines.slice(commentStart, startIdx),
           blockLines: lines.slice(startIdx, endIdx + 1) };
}

function extractArrowFn(startIdx) {
  let commentStart = startIdx;
  for (let i = startIdx - 1; i >= 0; i--) {
    const l = lines[i].trim();
    if (l.startsWith('//') || l === '') commentStart = i;
    else break;
  }
  let depth = 0, started = false, endIdx = startIdx;
  for (let i = startIdx; i < lines.length; i++) {
    for (const ch of lines[i]) {
      if (ch === '{') { depth++; started = true; }
      if (ch === '}') depth--;
    }
    if (started && depth === 0) { endIdx = i; break; }
  }
  return { commentStart, blockStart: startIdx, blockEnd: endIdx,
           commentLines: lines.slice(commentStart, startIdx),
           blockLines: lines.slice(startIdx, endIdx + 1) };
}

// ── Create directories ─────────────────────────────────────────────────────────

const dirs = ['src/engine','src/data','src/scoring','src/utils','src/validation'];
for (const d of dirs) {
  const full = path.join(root, d);
  if (!fs.existsSync(full)) { fs.mkdirSync(full, { recursive: true }); console.log(`Created: ${d}`); }
  else { console.log(`Exists:  ${d}`); }
}

// ── Locate blocks ──────────────────────────────────────────────────────────────

const ecoIdx       = findLine(/^const CINEMA_ECOSYSTEMS = \{/);
const worldviewIdx = findLine(/^const DIRECTOR_WORLDVIEW = \{/);
const grammarIdx   = findLine(/^const CINEMATIC_GRAMMAR = \{/);
const wvTagIdx     = findLine(/^const getWorldviewTags = /);
const gramTagIdx   = findLine(/^const getGrammarTags = /);
const inferEcoIdx  = findLine(/^const inferDynamicEcosystem = /);

console.log('\nLocated (1-indexed):');
['CINEMA_ECOSYSTEMS','DIRECTOR_WORLDVIEW','CINEMATIC_GRAMMAR','getWorldviewTags','getGrammarTags','inferDynamicEcosystem']
  .forEach((n,i) => console.log(`  ${n}: line ${[ecoIdx,worldviewIdx,grammarIdx,wvTagIdx,gramTagIdx,inferEcoIdx][i]+1}`));

const ecoBlock       = extractBlock(ecoIdx);
const worldviewBlock = extractBlock(worldviewIdx);
const grammarBlock   = extractBlock(grammarIdx);
const wvTagBlock     = extractArrowFn(wvTagIdx);
const gramTagBlock   = extractArrowFn(gramTagIdx);
const inferEcoBlock  = extractArrowFn(inferEcoIdx);

// ── Write new module files ─────────────────────────────────────────────────────

function joinBlock(info) {
  return [...info.commentLines, ...info.blockLines].join('\n');
}

fs.writeFileSync(path.join(root,'src/data/ecosystems.js'),
`// ─── Cinema Ecosystems Data ─────────────────────────────────────────────────\n// Extracted from directorEngine.js — Step 30B\n\n` +
joinBlock(ecoBlock).replace(/^const CINEMA_ECOSYSTEMS/,'export const CINEMA_ECOSYSTEMS') + '\n');
console.log('\nWrote: src/data/ecosystems.js');

fs.writeFileSync(path.join(root,'src/data/worldviews.js'),
`// ─── Director Worldview / Cinematic DNA Data ─────────────────────────────────\n// Extracted from directorEngine.js — Step 30C\n\n` +
joinBlock(worldviewBlock).replace(/^const DIRECTOR_WORLDVIEW/,'export const DIRECTOR_WORLDVIEW') + '\n\n' +
joinBlock(wvTagBlock).replace(/^const getWorldviewTags/,'export const getWorldviewTags') + '\n');
console.log('Wrote: src/data/worldviews.js');

fs.writeFileSync(path.join(root,'src/data/grammar.js'),
`// ─── Cinematic Grammar / Form Language Data ──────────────────────────────────\n// Extracted from directorEngine.js — Step 30D\n\n` +
joinBlock(grammarBlock).replace(/^const CINEMATIC_GRAMMAR/,'export const CINEMATIC_GRAMMAR') + '\n\n' +
joinBlock(gramTagBlock).replace(/^const getGrammarTags/,'export const getGrammarTags') + '\n');
console.log('Wrote: src/data/grammar.js');

fs.writeFileSync(path.join(root,'src/utils/inferDynamicEcosystem.js'),
`// ─── Dynamic Ecosystem Inference ─────────────────────────────────────────────\n// Extracted from directorEngine.js — Step 30G\n\n` +
joinBlock(inferEcoBlock).replace(/^const inferDynamicEcosystem/,'export const inferDynamicEcosystem') + '\n');
console.log('Wrote: src/utils/inferDynamicEcosystem.js');

// ── Patch directorEngine.js ────────────────────────────────────────────────────

const toRemove = [
  { start: ecoBlock.commentStart,       end: ecoBlock.blockEnd },
  { start: worldviewBlock.commentStart, end: worldviewBlock.blockEnd },
  { start: wvTagBlock.commentStart,     end: wvTagBlock.blockEnd },
  { start: grammarBlock.commentStart,   end: grammarBlock.blockEnd },
  { start: gramTagBlock.commentStart,   end: gramTagBlock.blockEnd },
  { start: inferEcoBlock.commentStart,  end: inferEcoBlock.blockEnd },
].sort((a, b) => b.start - a.start);

const patched = [...lines];
for (const r of toRemove) {
  patched.splice(r.start, r.end - r.start + 1);
}

// Insert imports after last existing import line
const importBlock = [
  `import { CINEMA_ECOSYSTEMS } from '../data/ecosystems.js';`,
  `import { DIRECTOR_WORLDVIEW, getWorldviewTags } from '../data/worldviews.js';`,
  `import { CINEMATIC_GRAMMAR, getGrammarTags } from '../data/grammar.js';`,
  `import { inferDynamicEcosystem } from '../utils/inferDynamicEcosystem.js';`,
  '',
];

let lastImport = 0;
for (let i = 0; i < patched.length; i++) {
  if (patched[i].trimStart().startsWith('import ')) lastImport = i;
  else if (lastImport > 0 && !patched[i].trimStart().startsWith('import ') && patched[i].trim() !== '') break;
}
patched.splice(lastImport + 1, 0, ...importBlock);

fs.writeFileSync(enginePath, patched.join('\n'), 'utf8');
console.log('Patched: src/services/directorEngine.js');
console.log('\n✅ Done! Run: npm run build');
