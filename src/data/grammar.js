// ─── Cinematic Grammar / Form Language Data ──────────────────────────────────
// Extracted from directorEngine.js — Step 30D


// ─── Cinematic Grammar / Form Language Layer ─────────────────────────────────────

import { cleanName } from '../utils/nameNormalization.js';

export const CINEMATIC_GRAMMAR = {

  // Observational stillness — quiet, long takes, slow revelations
  observational_stillness: [
    'yasujiro ozu',
    'hirokazu koreeda',
    'abbas kiarostami',
    'hou hsiao hsien'
  ],

  // Operatic violence — choreographed brutality, stylized carnage
  operatic_violence: [
    'quentin tarantino',
    'park chan wook',
    'john woo',
    'takashi miike'
  ],

  // Cold precision — clinical camera, controlled dread, no mercy
  cold_precision: [
    'david fincher',
    'michael haneke',
    'stanley kubrick'
  ],

  // Dream logic — surreal flow, consciousness, unreal juxtaposition
  dream_logic: [
    'david lynch',
    'apichatpong weerasethakul',
    'federico fellini'
  ],

  // Poetic melancholy — visual longing, slow drift, beautiful sadness
  poetic_melancholy: [
    'wong kar wai',
    'sofia coppola',
    'terrence malick'
  ],

  // Spiritual contemplation — vast time, silence, the infinite
  spiritual_contemplation: [
    'andrei tarkovsky',
    'bela tarr',
    'nuri bilge ceylan'
  ],

  // Kinetic energy — propulsive editing, physical spectacle, momentum
  kinetic_energy: [
    'ss rajamouli',
    'george miller',
    'john woo'
  ],

  // Urban paranoia — city as threat, surveillance, moral erosion
  urban_paranoia: [
    'michael mann',
    'david fincher',
    'sidney lumet',
    'jean pierre melville'
  ],

  // Absurdist detachment — deadpan, alienated, darkly comic distance
  absurdist_detachment: [
    'yorgos lanthimos',
    'roy andersson',
    'aki kaurismaki'
  ],

  // Emotional intimacy — close observation, whispered truth, felt presence
  emotional_intimacy: [
    'richard linklater',
    'celine song',
    'hirokazu koreeda'
  ]

};


// Returns the cinematic grammar tags for a given director name
export const getGrammarTags = (directorName = '') => {
  const clean = cleanName(directorName);
  return Object.entries(CINEMATIC_GRAMMAR)
    .filter(([, directors]) => directors.includes(clean))
    .map(([tag]) => tag);
};
