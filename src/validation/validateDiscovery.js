/**
 * src/validation/validateDiscovery.js
 *
 * Discovery Intelligence Validator
 * Tests that emotionally adjacent directors score ABOVE threshold —
 * confirming the discovery bridge system is working correctly.
 *
 * Run with: node --input-type=module < src/validation/validateDiscovery.js
 * Or import and call runDiscoveryValidation() at startup (dev only).
 */

import { getGroupedRecommendations, scoreRelationship } from '../services/directorEngine.js';
import { cleanName } from '../utils/nameNormalization.js';

// ── Expected Discovery Pairs ─────────────────────────────────────────────────
// Each entry: [source director, [candidates that SHOULD be discovered]]
const DISCOVERY_EXPECTATIONS = [

  // Poetic melancholy → romantic intimacy
  ['wong kar wai',      ['sofia coppola', 'richard linklater']],

  // Urban paranoia → noir stillness
  ['michael mann',      ['jean pierre melville']],

  // Observational humanism → lineage
  ['hirokazu koreeda',  ['yasujiro ozu']],

  // Cold precision → clinical dread
  ['david fincher',     ['michael haneke']],

  // Spiritual contemplation → slow cinema
  ['andrei tarkovsky',  ['bela tarr', 'nuri bilge ceylan']],

  // Surreal anxiety → dream logic
  ['david lynch',       ['apichatpong weerasethakul']],

];

// ── Threshold ───────────────────────────────────────────────────────────────
// Score must be ≥ this for a discovery pair to PASS
const DISCOVERY_THRESHOLD = 15;

// ── Runner ────────────────────────────────────────────────────────────────────
export const runDiscoveryValidation = () => {
  let passed = 0;
  let failed = 0;

  console.log('\n🔍 DISCOVERY INTELLIGENCE VALIDATION\n' + '─'.repeat(52));

  DISCOVERY_EXPECTATIONS.forEach(([source, expected]) => {
    console.log(`\n  Testing discovery graph for: ${source}`);

    expected.forEach(candidate => {
      const srcDna  = { topGenres: [], pacing: 'measured', tone: 'balanced', decades: {}, ecosystem: null, primaryLanguage: 'en' };
      const candDna = { topGenres: [], pacing: 'measured', tone: 'balanced', decades: {}, ecosystem: null, primaryLanguage: 'en' };

      const score = scoreRelationship(srcDna, candDna, source, candidate);

      if (score >= DISCOVERY_THRESHOLD) {
        console.log(`    ✅ PASS  ${source.padEnd(20)} discovers ${candidate} (score=${score})`);
        passed++;
      } else {
        console.error(`    ❌ FAIL  ${source.padEnd(20)} missed ${candidate} (score=${score}, need≥${DISCOVERY_THRESHOLD})`);
        failed++;
      }
    });
  });

  console.log(`\n${'─'.repeat(52)}`);
  console.log(`Result: ${passed} passed, ${failed} failed\n`);
  return { passed, failed };
};

const REGIONAL_VISIBILITY_EXPECTATIONS = [
  ['Tamil', 'Vetrimaaran', 'ta'],
  ['Malayalam', 'Adoor Gopalakrishnan', 'ml'],
  ['Korean', 'Bong Joon Ho', 'ko'],
  ['Japanese', 'Hirokazu Kore-eda', 'ja'],
  ['Iranian', 'Asghar Farhadi', 'fa'],
  ['Thai', 'Apichatpong Weerasethakul', 'th'],
  ['Hong Kong', 'Wong Kar-Wai', 'zh'],
  ['Taiwanese', 'Edward Yang', 'zh']
];

const createRegionalValidationProfile = (name, primaryLanguage) => ({
  id: cleanName(name),
  name,
  language: primaryLanguage,
  ecosystem: null,
  dna: {
    languages: { [primaryLanguage]: 6 },
    countries: {},
    genres: { 18: 4, 53: 1 },
    decades: { 2000: 2, 2010: 3 },
    topGenres: [18, 53],
    totalFilms: 6,
    primaryLanguage,
    ecosystem: null,
    pacing: 'methodical',
    tone: 'balanced',
    confidence: 'validation'
  }
});

export const runRegionalVisibilityValidation = () => {
  let passed = 0;
  let failed = 0;

  console.log('\nREGIONAL RECOMMENDATION VISIBILITY VALIDATION\n' + '-'.repeat(56));

  REGIONAL_VISIBILITY_EXPECTATIONS.forEach(([label, directorName, language]) => {
    const profile = createRegionalValidationProfile(directorName, language);
    const grouped = getGroupedRecommendations(profile, profile.id, directorName, 4);
    const regionalCount = grouped.regional?.length || 0;
    const relatedCount = (grouped.relatives?.length || 0) + (grouped.unexpected?.length || 0);

    if (regionalCount > 0 && relatedCount > 0) {
      console.log(`PASS ${label.padEnd(10)} ${directorName} regional=${regionalCount} related=${relatedCount}`);
      passed++;
    } else {
      console.error(`FAIL ${label.padEnd(10)} ${directorName} regional=${regionalCount} related=${relatedCount}`);
      failed++;
    }
  });

  console.log(`${'-'.repeat(56)}`);
  console.log(`Regional result: ${passed} passed, ${failed} failed\n`);
  return { passed, failed };
};
