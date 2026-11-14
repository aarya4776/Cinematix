/**
 * src/validation/validateOntology.js
 *
 * Ontology Contamination Guard
 * Tests that humanist / poetic / spiritual directors
 * NEVER score positively against horror / nihilism / spectacle directors.
 *
 * Run with: node --input-type=module < src/validation/validateOntology.js
 * Or import and call runOntologyValidation() at startup (dev only).
 */

import { scoreRelationship } from '../services/directorEngine.js';

// ── Forbidden Pairs ─────────────────────────────────────────────────────────
// Each entry: [source director, [candidates that must be REJECTED]]
const TEST_CASES = [

  // Humanism vs Horror / Nihilism
  ['yasujiro ozu',        ['james wan', 'eli roth']],

  // Spiritual vs Hyperviolence / Spectacle
  ['andrei tarkovsky',    ['michael bay', 'takashi miike']],

  // Humanist realism vs torture nihilism
  ['abbas kiarostami',    ['eli roth', 'gaspar noe']],

  // Poetic realism vs disaster spectacle
  ['wong kar wai',        ['roland emmerich']],

  // Observational humanism vs operatic violence
  ['hirokazu koreeda',    ['quentin tarantino']],

  // Ethical realism vs supernatural horror
  ['asghar farhadi',      ['james wan']],

];

// ── Threshold ───────────────────────────────────────────────────────────────
// Score must be ≤ this for a pair to PASS (below this = correctly rejected)
const CONTAMINATION_THRESHOLD = 20;

// ── Runner ───────────────────────────────────────────────────────────────────
export const runOntologyValidation = () => {
  let passed = 0;
  let failed = 0;

  console.log('\n🎬 ONTOLOGY CONTAMINATION VALIDATION\n' + '─'.repeat(52));

  TEST_CASES.forEach(([source, forbidden]) => {
    forbidden.forEach(candidate => {
      // Minimal DNA stubs — validation checks name-based ontology only
      const srcDna  = { topGenres: [], pacing: 'measured', tone: 'balanced', decades: {}, ecosystem: null, primaryLanguage: 'en' };
      const candDna = { topGenres: [], pacing: 'fast',    tone: 'dark',    decades: {}, ecosystem: null, primaryLanguage: 'en' };

      const score = scoreRelationship(srcDna, candDna, source, candidate);

      if (score > CONTAMINATION_THRESHOLD) {
        console.error(`  ❌ FAIL  ${source.padEnd(22)} → ${candidate}`);
        console.error(`           score=${score} (threshold=${CONTAMINATION_THRESHOLD})`);
        failed++;
      } else {
        console.log(`  ✅ PASS  ${source.padEnd(22)} rejects ${candidate} (score=${score})`);
        passed++;
      }
    });
  });

  console.log(`\n${'─'.repeat(52)}`);
  console.log(`Result: ${passed} passed, ${failed} failed\n`);
  return { passed, failed };
};
