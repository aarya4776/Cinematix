// ─── Director Worldview / Cinematic DNA Data ─────────────────────────────────
// Extracted from directorEngine.js — Step 30C


// ─── Director Worldview / Cinematic DNA Layer ────────────────────────────────────

import { cleanName } from '../utils/nameNormalization.js';

export const DIRECTOR_WORLDVIEW = {

  // Humanist — warmth, dignity, empathy as primary cinematic grammar
  humanist: [
    'yasujiro ozu',
    'hirokazu koreeda',
    'satyajit ray',
    'frank darabont',
    'steven spielberg',
    'vetrimaaran',
    'majid majidi'
  ],

  // Existential — mortality, meaning, the void
  existential: [
    'ingmar bergman',
    'andrei tarkovsky',
    'bela tarr',
    'nuri bilge ceylan',
    'abbas kiarostami'
  ],

  // Psychological dread — cold, suffocating, cerebral menace
  psychological_dread: [
    'david fincher',
    'michael haneke',
    'ari aster',
    'darren aronofsky',
    'roman polanski'
  ],

  // Operatic violence — heightened, stylized, mythic brutality
  operatic_violence: [
    'quentin tarantino',
    'john woo',
    'park chan wook',
    'takashi miike'
  ],

  // Spiritual transcendence — cinema as prayer, light, eternity
  spiritual_transcendence: [
    'andrei tarkovsky',
    'terrence malick',
    'apichatpong weerasethakul'
  ],

  // Romantic melancholy — longing, lost time, beautiful sadness
  romantic_melancholy: [
    'wong kar wai',
    'sofia coppola',
    'richard linklater',
    'shunji iwai'
  ],

  // Social realism — class, labor, systemic injustice
  social_realism: [
    'ken loach',
    'mike leigh',
    'vetrimaaran',
    'dardenne brothers'
  ],

  // Masculine melancholy — duty, silence, the weight of men
  masculine_melancholy: [
    'michael mann',
    'clint eastwood',
    'james gray'
  ],

  // Surreal anxiety — logic dissolving, identity fragmenting
  surreal_anxiety: [
    'david lynch',
    'charlie kaufman',
    'yorgos lanthimos'
  ],

  // Political realism — power, resistance, conscience
  political_realism: [
    'asghar farhadi',
    'jafar panahi',
    'costa gavras',
    'pablo larrain'
  ]

};


// Returns the worldview tags for a given director name
export const getWorldviewTags = (directorName = '') => {
  const clean = cleanName(directorName);
  return Object.entries(DIRECTOR_WORLDVIEW)
    .filter(([, directors]) => directors.includes(clean))
    .map(([tag]) => tag);
};
