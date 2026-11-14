import directorGraph from '../data/directorGraph.json' with { type: 'json' };
import { CINEMA_ECOSYSTEMS } from '../data/ecosystems.js';
import { getWorldviewTags } from '../data/worldviews.js';
import { getGrammarTags } from '../data/grammar.js';
import { inferDynamicEcosystem } from '../utils/inferDynamicEcosystem.js';
import { PROSE_TEMPLATES } from '../data/proseTemplates.js';
import { DISCOVERY_BRIDGES } from '../data/discoveryBridges.js';
import { cleanName, compactName } from '../utils/nameNormalization.js';


// ─── Resilient Graph Loading & Validation ──────────────────────────────────────
let validatedGraph = [];
try {
  if (directorGraph && Array.isArray(directorGraph)) {
    validatedGraph = directorGraph.filter(node => {
      if (!node || typeof node !== 'object') return false;
      if (!node.id || !node.name) return false;
      if (!node.dna || typeof node.dna !== 'object') return false;
      return true;
    });
    console.log(`[DirectorEngine] directorGraph successfully loaded and validated: ${validatedGraph.length} / ${directorGraph.length} nodes are fully valid.`);
  } else {
    console.warn('[DirectorEngine] Loaded directorGraph is empty or not a valid array.');
  }
} catch (err) {
  console.error('[DirectorEngine] Critical failure validating directorGraph.json:', err);
}

// ─── Centralized Compatibility Normalization Layer ──────────────────────────────
export const normalizeRecommendationShape = (rawOutput) => {
  const safeData = rawOutput || {};
  
  const regional = Array.isArray(safeData.regional) 
    ? safeData.regional 
    : (Array.isArray(safeData.regionalVoices) ? safeData.regionalVoices : []);
    
  const relatives = Array.isArray(safeData.relatives) 
    ? safeData.relatives 
    : (Array.isArray(safeData.emotionalRelatives) ? safeData.emotionalRelatives : []);
    
  const global = Array.isArray(safeData.global) 
    ? safeData.global 
    : (Array.isArray(safeData.globalConnections) ? safeData.globalConnections : []);
    
  const unexpected = Array.isArray(safeData.unexpected) 
    ? safeData.unexpected 
    : (Array.isArray(safeData.hiddenDiscoveries) ? safeData.hiddenDiscoveries : []);

  const filmography = Array.isArray(safeData.filmography) 
    ? safeData.filmography 
    : (Array.isArray(safeData.allFilms) ? safeData.allFilms : []);

  const directorProfile = safeData.directorProfile && typeof safeData.directorProfile === 'object'
    ? safeData.directorProfile 
    : (safeData.profile && typeof safeData.profile === 'object' ? safeData.profile : {});

  return {
    regional,
    relatives,
    global,
    unexpected,
    
    regionalVoices: regional,
    globalConnections: global,
    hiddenDiscoveries: unexpected,
    emotionalRelatives: relatives,
    
    filmography,
    directorProfile
  };
};

// ─── Utilities ────────────────────────────────────────────────────────────────

export const norm = cleanName;

// Session tracking to prevent recommendation loops
const sessionSeen = new Set();
export const trackSeen = id => {
  if (id !== undefined && id !== null) {
    sessionSeen.add(String(id));
  }
};
export const clearSession = () => sessionSeen.clear();

// ─── Region Maps ──────────────────────────────────────────────────────────────

const REGIONAL_LABELS = {
  'en': 'English-Language', 'ko': 'Korean', 'ja': 'Japanese',
  'zh': 'Chinese', 'cn': 'Chinese', 'fr': 'French', 'es': 'Spanish',
  'it': 'Italian', 'de': 'German', 'ru': 'Russian', 'hi': 'Hindi',
  'ta': 'Tamil', 'te': 'Telugu', 'ml': 'Malayalam', 'fa': 'Iranian',
  'sv': 'Scandinavian', 'da': 'Danish', 'pt': 'Portuguese', 'pl': 'Polish',
  'tr': 'Turkish', 'ar': 'Arabic', 'th': 'Thai', 'bn': 'Bengali',
  'kn': 'Kannada', 'mr': 'Marathi', 'pa': 'Punjabi', 'gu': 'Gujarati',
  'el': 'Greek', 'hu': 'Hungarian'
};

const ECOSYSTEM_MAP = {
  'ko': 'korean', 'ja': 'japanese', 'zh': 'chinese', 'cn': 'chinese',
  'fr': 'french', 'es': 'spanish', 'it': 'italian', 'de': 'german',
  'ru': 'russian', 'hi': 'hindi', 'ta': 'tamil', 'te': 'telugu',
  'ml': 'malayalam', 'kn': 'kannada', 'fa': 'iranian',
  'sv': 'scandinavian', 'da': 'scandinavian', 'nb': 'scandinavian',
  'nn': 'scandinavian', 'no': 'scandinavian', 'pt': 'portuguese',
  'pl': 'polish', 'tr': 'turkish', 'ar': 'arabic', 'en': 'english',
  'th': 'thai', 'bn': 'bengali', 'el': 'greek', 'hu': 'hungarian',
  'mr': 'marathi', 'pa': 'punjabi', 'gu': 'gujarati', 'as': 'assamese',
  'or': 'odia', 'ms': 'malaysian', 'id': 'indonesian', 'vi': 'vietnamese'
};

const ECOSYSTEM_TOKEN_ALIASES = {
  cn: 'chinese',
  zh: 'chinese',
  hk: 'hong-kong',
  'hong-kong': 'hong-kong',
  hongkong: 'hong-kong',
  'south-indian': 'south-indian',
  southindian: 'south-indian',
  'english-language': 'english',
  englishlanguage: 'english',
  th: 'thai',
  fa: 'iranian',
  bn: 'bengali',
  el: 'greek',
  hu: 'hungarian'
};

const ECOSYSTEM_PREFIX_ALIASES = {
  hk: 'hong-kong',
  tamil: 'tamil',
  telugu: 'telugu',
  malayalam: 'malayalam',
  kannada: 'kannada',
  hindi: 'hindi',
  bengali: 'bengali',
  marathi: 'marathi',
  punjabi: 'punjabi',
  gujarati: 'gujarati',
  assamese: 'assamese',
  odia: 'odia',
  bhojpuri: 'bhojpuri',
  kashmiri: 'kashmiri',
  manipuri: 'manipuri',
  japanese: 'japanese',
  korean: 'korean',
  taiwanese: 'taiwanese',
  chinese: 'chinese',
  thai: 'thai',
  vietnamese: 'vietnamese',
  filipino: 'filipino',
  indonesian: 'indonesian',
  malaysian: 'malaysian',
  singaporean: 'singaporean',
  iranian: 'iranian',
  arab: 'arabic',
  arabic: 'arabic',
  palestinian: 'palestinian',
  turkish: 'turkish',
  american: 'english',
  british: 'english',
  canadian: 'english',
  australian: 'english',
  irish: 'english',
  scottish: 'english',
  classical: 'english',
  golden: 'english',
  new: 'english',
  nordic: 'scandinavian',
  swedish: 'scandinavian',
  danish: 'scandinavian',
  finnish: 'scandinavian',
  french: 'french',
  spanish: 'spanish',
  italian: 'italian',
  german: 'german',
  austrian: 'german',
  russian: 'russian',
  soviet: 'russian',
  polish: 'polish',
  portuguese: 'portuguese',
  greek: 'greek',
  hungarian: 'hungarian',
  romanian: 'romanian',
  czech: 'czech',
  balkan: 'balkan',
  dutch: 'dutch',
  belgian: 'belgian',
  mexican: 'mexican',
  argentine: 'argentine',
  brazilian: 'brazilian',
  latin: 'latin-american',
  african: 'african',
  transnational: 'transnational',
  diasporic: 'transnational',
  southeast: 'southeast-asian',
  eastern: 'east-asian'
};

const ECOSYSTEM_UMBRELLAS = {
  tamil: ['south-indian', 'indian', 'asian'],
  telugu: ['south-indian', 'indian', 'asian'],
  malayalam: ['south-indian', 'indian', 'asian'],
  kannada: ['south-indian', 'indian', 'asian'],
  'south-indian': ['indian', 'asian'],
  hindi: ['indian', 'asian'],
  bengali: ['indian', 'asian'],
  marathi: ['indian', 'asian'],
  punjabi: ['indian', 'asian'],
  gujarati: ['indian', 'asian'],
  assamese: ['indian', 'asian'],
  odia: ['indian', 'asian'],
  bhojpuri: ['indian', 'asian'],
  kashmiri: ['indian', 'asian'],
  manipuri: ['indian', 'asian'],
  japanese: ['east-asian', 'asian'],
  korean: ['east-asian', 'asian'],
  chinese: ['chinese-language', 'east-asian', 'asian'],
  'hong-kong': ['chinese-language', 'east-asian', 'asian'],
  taiwanese: ['chinese-language', 'east-asian', 'asian'],
  thai: ['southeast-asian', 'asian'],
  vietnamese: ['southeast-asian', 'asian'],
  filipino: ['southeast-asian', 'asian'],
  indonesian: ['southeast-asian', 'asian'],
  malaysian: ['southeast-asian', 'asian'],
  singaporean: ['southeast-asian', 'asian'],
  iranian: ['west-asian', 'asian'],
  turkish: ['west-asian'],
  arabic: ['west-asian'],
  palestinian: ['west-asian'],
  english: ['english-language'],
  french: ['european'],
  spanish: ['european'],
  italian: ['european'],
  german: ['european'],
  russian: ['european'],
  scandinavian: ['european'],
  polish: ['european'],
  portuguese: ['european'],
  greek: ['european'],
  hungarian: ['european'],
  romanian: ['european'],
  czech: ['european'],
  balkan: ['european'],
  dutch: ['european'],
  belgian: ['european'],
  mexican: ['latin-american'],
  argentine: ['latin-american'],
  brazilian: ['latin-american']
};

const ECOSYSTEM_LANGUAGE_BY_FAMILY = {
  english: 'en',
  korean: 'ko',
  japanese: 'ja',
  chinese: 'zh',
  'hong-kong': 'zh',
  taiwanese: 'zh',
  french: 'fr',
  spanish: 'es',
  italian: 'it',
  german: 'de',
  russian: 'ru',
  hindi: 'hi',
  tamil: 'ta',
  telugu: 'te',
  malayalam: 'ml',
  kannada: 'kn',
  'south-indian': 'ta',
  iranian: 'fa',
  scandinavian: 'sv',
  portuguese: 'pt',
  polish: 'pl',
  turkish: 'tr',
  arabic: 'ar',
  thai: 'th',
  bengali: 'bn',
  greek: 'el',
  hungarian: 'hu',
  marathi: 'mr',
  punjabi: 'pa',
  gujarati: 'gu',
  assamese: 'as',
  odia: 'or',
  malaysian: 'ms',
  indonesian: 'id',
  vietnamese: 'vi'
};

const ECOSYSTEM_ADJACENCY = {
  tamil: ['malayalam', 'telugu', 'kannada', 'hindi', 'bengali'],
  telugu: ['tamil', 'malayalam', 'kannada', 'hindi'],
  malayalam: ['tamil', 'telugu', 'kannada', 'bengali'],
  kannada: ['tamil', 'telugu', 'malayalam'],
  hindi: ['tamil', 'telugu', 'malayalam', 'bengali', 'marathi', 'punjabi'],
  bengali: ['hindi', 'tamil', 'malayalam', 'marathi'],
  japanese: ['korean', 'chinese', 'hong-kong', 'taiwanese'],
  korean: ['japanese', 'chinese', 'hong-kong'],
  chinese: ['hong-kong', 'taiwanese', 'japanese', 'korean'],
  'hong-kong': ['chinese', 'taiwanese', 'japanese', 'korean'],
  taiwanese: ['chinese', 'hong-kong', 'japanese'],
  thai: ['vietnamese', 'filipino', 'indonesian', 'malaysian', 'singaporean', 'hong-kong'],
  iranian: ['turkish', 'arabic', 'palestinian']
};

const BROAD_REGIONAL_UMBRELLAS = new Set(['asian', 'european', 'transnational']);

const normalizeEcosystemToken = (value = 'english') => {
  const cleaned = cleanName(String(value)).replace(/\s+/g, '-');
  if (!cleaned) return 'english';

  const compact = cleaned.replace(/-/g, '');
  return ECOSYSTEM_TOKEN_ALIASES[cleaned] ||
    ECOSYSTEM_TOKEN_ALIASES[compact] ||
    cleaned;
};

const getEcosystem = (lang = 'en') => normalizeEcosystemToken(ECOSYSTEM_MAP[lang] || lang);

const getFamilyFromEcosystemKey = (ecosystemKey = '') => {
  const [prefix = ''] = cleanName(ecosystemKey).split(' ');
  return normalizeEcosystemToken(ECOSYSTEM_PREFIX_ALIASES[prefix] || prefix);
};

const getEcosystemUmbrellas = (family = '') => {
  const canonicalFamily = normalizeEcosystemToken(family);
  return new Set([canonicalFamily, ...(ECOSYSTEM_UMBRELLAS[canonicalFamily] || [])]);
};

const sharesEcosystemUmbrella = (a = '', b = '') => {
  const aUmbrellas = getEcosystemUmbrellas(a);
  const bUmbrellas = getEcosystemUmbrellas(b);
  return [...aUmbrellas].some(value => bUmbrellas.has(value));
};

const addDirectorEcosystemIndexEntry = (index, directorName, ecosystemKey) => {
  const keys = [cleanName(directorName), compactName(directorName)].filter(Boolean);
  keys.forEach(key => {
    if (!index.has(key)) index.set(key, new Set());
    index.get(key).add(ecosystemKey);
  });
};

const DIRECTOR_ECOSYSTEM_INDEX = (() => {
  const index = new Map();
  Object.entries(CINEMA_ECOSYSTEMS || {}).forEach(([ecosystemKey, directors]) => {
    if (!Array.isArray(directors)) return;
    directors.forEach(directorName => addDirectorEcosystemIndexEntry(index, directorName, ecosystemKey));
  });
  return index;
})();

const getDirectorEcosystemKeys = (directorName = '') => {
  const keys = new Set();
  [cleanName(directorName), compactName(directorName)]
    .filter(Boolean)
    .forEach(key => {
      const indexed = DIRECTOR_ECOSYSTEM_INDEX.get(key);
      if (indexed) indexed.forEach(value => keys.add(value));
    });
  return [...keys];
};

const resolveDirectorEcosystemMeta = (directorName = '', dna = {}) => {
  const ecosystemKeys = [
    ...new Set([
      ...getDirectorEcosystemKeys(directorName),
      ...(Array.isArray(dna?.ecosystemKeys) ? dna.ecosystemKeys : []),
      ...(Array.isArray(dna?.ontologyEcosystems) ? dna.ontologyEcosystems : [])
    ])
  ];
  const keyFamilies = ecosystemKeys.map(getFamilyFromEcosystemKey).filter(Boolean);
  const dnaEco = normalizeEcosystemToken(dna?.ecosystem || getEcosystem(dna?.primaryLanguage || 'en'));
  const languageEco = getEcosystem(dna?.primaryLanguage || 'en');
  const familySet = new Set([...keyFamilies, dnaEco, languageEco].filter(Boolean));
  const directLanguageMatch = keyFamilies.find(family => family === languageEco || family === dnaEco);
  const regionalLanguageMatch = keyFamilies.find(family => (
    family !== 'english' &&
    languageEco !== 'english' &&
    sharesEcosystemUmbrella(family, languageEco)
  ));
  const nonEnglishFamily = keyFamilies.find(family => family !== 'english' && family !== 'transnational');
  const canonical = directLanguageMatch ||
    regionalLanguageMatch ||
    nonEnglishFamily ||
    dnaEco ||
    languageEco ||
    'english';
  const umbrellaSet = new Set();
  const regionalKeySet = new Set();
  const regionalFamilySet = new Set([canonical]);

  familySet.forEach(family => {
    getEcosystemUmbrellas(family).forEach(value => umbrellaSet.add(value));
    const familyUmbrellaIntersection = [...getEcosystemUmbrellas(family)]
      .filter(value => getEcosystemUmbrellas(canonical).has(value));
    const sharesSpecificUmbrella = familyUmbrellaIntersection
      .some(value => !BROAD_REGIONAL_UMBRELLAS.has(value));
    if (family === canonical || sharesSpecificUmbrella) {
      regionalFamilySet.add(family);
    }
  });
  getEcosystemUmbrellas(canonical).forEach(value => umbrellaSet.add(value));
  ecosystemKeys.forEach(key => {
    const family = getFamilyFromEcosystemKey(key);
    if (family === canonical || sharesEcosystemUmbrella(family, canonical)) {
      regionalKeySet.add(key);
    }
  });

  const regionalUmbrellaSet = new Set();
  regionalFamilySet.forEach(family => {
    getEcosystemUmbrellas(family).forEach(value => {
      if (!BROAD_REGIONAL_UMBRELLAS.has(value)) regionalUmbrellaSet.add(value);
    });
  });

  return {
    canonical,
    families: familySet,
    regionalFamilies: regionalFamilySet,
    umbrellas: umbrellaSet,
    regionalUmbrellas: regionalUmbrellaSet,
    keys: new Set(ecosystemKeys),
    regionalKeys: regionalKeySet
  };
};

const getEcosystemAffinity = (sourceMeta, candidateMeta) => {
  if (!sourceMeta || !candidateMeta) return 0;

  const sourceRegionalKeys = sourceMeta.regionalKeys?.size ? sourceMeta.regionalKeys : sourceMeta.keys;
  const candidateRegionalKeys = candidateMeta.regionalKeys?.size ? candidateMeta.regionalKeys : candidateMeta.keys;
  const sharedFineKey = [...sourceRegionalKeys].some(key => candidateRegionalKeys.has(key));
  if (sharedFineKey) return 100;

  if (sourceMeta.canonical && sourceMeta.canonical === candidateMeta.canonical) return 95;

  const sourceRegionalFamilies = sourceMeta.regionalFamilies?.size ? sourceMeta.regionalFamilies : sourceMeta.families;
  const candidateRegionalFamilies = candidateMeta.regionalFamilies?.size ? candidateMeta.regionalFamilies : candidateMeta.families;
  const sharedFamily = [...sourceRegionalFamilies].some(family => candidateRegionalFamilies.has(family));
  if (sharedFamily) return 82;

  const sourceRegionalUmbrellas = sourceMeta.regionalUmbrellas?.size ? sourceMeta.regionalUmbrellas : sourceMeta.umbrellas;
  const candidateRegionalUmbrellas = candidateMeta.regionalUmbrellas?.size ? candidateMeta.regionalUmbrellas : candidateMeta.umbrellas;
  const sharedUmbrella = [...sourceRegionalUmbrellas].some(umbrella => candidateRegionalUmbrellas.has(umbrella));
  if (sharedUmbrella) return 64;

  const adjacent = [...sourceRegionalFamilies].some(family => {
    const adjacentFamilies = ECOSYSTEM_ADJACENCY[family] || [];
    return [...candidateRegionalFamilies].some(candidateFamily => adjacentFamilies.includes(candidateFamily));
  });

  return adjacent ? 46 : 0;
};

const getEcosystemPoolStats = (sourceMeta, enrichedCandidates) => {
  const regionalPoolSize = enrichedCandidates.filter(c => c._regionalAffinity > 0).length;
  const exactFamilySize = enrichedCandidates.filter(c => (
    c._regionalAffinity >= 82 ||
    (sourceMeta?.canonical && c._ecoMeta?.canonical === sourceMeta.canonical)
  )).length;

  return {
    regionalPoolSize,
    exactFamilySize,
    isSparse: regionalPoolSize < 6 || exactFamilySize < 3
  };
};

const getAdaptiveRegionalThreshold = (poolStats) => {
  let threshold = REGIONAL_CINEMA_THRESHOLD;
  if (poolStats.exactFamilySize < 3) threshold -= 14;
  if (poolStats.regionalPoolSize < 6) threshold -= 8;
  if (poolStats.regionalPoolSize < 3) threshold -= 8;
  return Math.max(38, threshold);
};

const getAdaptiveWorldviewFloor = (poolStats) => {
  if (poolStats.regionalPoolSize < 3) return -50;
  if (poolStats.isSparse) return -42;
  return -30;
};

// ─── Curated Auteur Registry & Archetypes ──────────────────────────────────────

let recommendationGraphCache = null;

const buildOntologyCandidateNode = (directorName, ecosystemKeys = []) => {
  const family = getFamilyFromEcosystemKey(ecosystemKeys[0] || '');
  const primaryLanguage = ECOSYSTEM_LANGUAGE_BY_FAMILY[family] || 'en';

  return {
    id: cleanName(directorName),
    name: directorName,
    dna: {
      languages: { [primaryLanguage]: 1 },
      countries: {},
      genres: {},
      decades: {},
      topGenres: [],
      totalFilms: 1,
      primaryLanguage,
      ecosystem: family || getEcosystem(primaryLanguage),
      confidence: 'ontology',
      pacing: 'methodical',
      tone: 'balanced',
      ecosystemKeys,
      ontologyEcosystems: ecosystemKeys
    },
    ontologyOnly: true
  };
};

const getRecommendationGraph = () => {
  if (recommendationGraphCache) return recommendationGraphCache;

  const byName = new Map();

  const addNode = (node, ecosystemKeys = [], ontologyOnly = false) => {
    const name = node?.name || node?.id || '';
    const key = compactName(name);
    if (!key) return;

    const incomingDna = { ...(node?.dna || {}) };
    const incomingKeys = new Set([
      ...ecosystemKeys,
      ...(Array.isArray(incomingDna.ecosystemKeys) ? incomingDna.ecosystemKeys : []),
      ...(Array.isArray(incomingDna.ontologyEcosystems) ? incomingDna.ontologyEcosystems : [])
    ]);

    if (byName.has(key)) {
      const existing = byName.get(key);
      const existingKeys = new Set([
        ...(Array.isArray(existing.dna?.ecosystemKeys) ? existing.dna.ecosystemKeys : []),
        ...(Array.isArray(existing.dna?.ontologyEcosystems) ? existing.dna.ontologyEcosystems : [])
      ]);
      incomingKeys.forEach(value => existingKeys.add(value));

      existing.dna = {
        ...incomingDna,
        ...existing.dna,
        ecosystemKeys: [...existingKeys],
        ontologyEcosystems: [...existingKeys]
      };
      existing.ontologyOnly = existing.ontologyOnly && ontologyOnly;
      return;
    }

    byName.set(key, {
      ...node,
      id: node?.id || cleanName(name),
      name,
      dna: {
        ...incomingDna,
        ecosystemKeys: [...incomingKeys],
        ontologyEcosystems: [...incomingKeys]
      },
      ontologyOnly
    });
  };

  validatedGraph.forEach(node => addNode(node, getDirectorEcosystemKeys(node.name), false));

  Object.entries(CINEMA_ECOSYSTEMS || {}).forEach(([ecosystemKey, directors]) => {
    if (!Array.isArray(directors)) return;
    directors.forEach(directorName => {
      addNode(buildOntologyCandidateNode(directorName, [ecosystemKey]), [ecosystemKey], true);
    });
  });

  recommendationGraphCache = [...byName.values()].map(node => {
    const dna = { ...(node.dna || {}) };
    const meta = resolveDirectorEcosystemMeta(node.name, dna);
    const primaryLanguage = dna.primaryLanguage || ECOSYSTEM_LANGUAGE_BY_FAMILY[meta.canonical] || 'en';

    return {
      ...node,
      dna: {
        ...dna,
        totalFilms: Math.max(dna.totalFilms || 1, 1),
        primaryLanguage,
        ecosystem: meta.canonical,
        ecosystemFamily: meta.canonical,
        ecosystemFamilies: [...meta.families],
        ecosystemUmbrellas: [...meta.umbrellas],
        ecosystemKeys: [...meta.keys],
        ontologyEcosystems: [...meta.keys]
      }
    };
  });

  return recommendationGraphCache;
};

const AUTEUR_ARCHETYPES = {
  // 1. Contemplative Austerity & Poetic Observation
  'yasujiro ozu': 'Contemplative Austerity & Poetic Observation',
  'yasujirō ozu': 'Contemplative Austerity & Poetic Observation',
  'hou hsiao hsien': 'Contemplative Austerity & Poetic Observation',
  'lee chang dong': 'Contemplative Austerity & Poetic Observation',
  'hong sang soo': 'Contemplative Austerity & Poetic Observation',
  'andrei tarkovsky': 'Contemplative Austerity & Poetic Observation',
  'andrei zvyagintsev': 'Contemplative Austerity & Poetic Observation',
  'andrey zvyagintsev': 'Contemplative Austerity & Poetic Observation',
  'krzysztof kieslowski': 'Contemplative Austerity & Poetic Observation',
  'krzysztof kieślowski': 'Contemplative Austerity & Poetic Observation',
  'pawel pawlikowski': 'Contemplative Austerity & Poetic Observation',
  'paweł pawlikowski': 'Contemplative Austerity & Poetic Observation',
  'pawe pawlikowski': 'Contemplative Austerity & Poetic Observation',
  'bela tarr': 'Contemplative Austerity & Poetic Observation',
  'béla tarr': 'Contemplative Austerity & Poetic Observation',
  'apichatpong weerasethakul': 'Contemplative Austerity & Poetic Observation',
  'terrence malick': 'Contemplative Austerity & Poetic Observation',
  'abbas kiarostami': 'Contemplative Austerity & Poetic Observation',
  'jafar panahi': 'Contemplative Austerity & Poetic Observation',
  'kelly reichardt': 'Contemplative Austerity & Poetic Observation',
  'chloe zhao': 'Contemplative Austerity & Poetic Observation',
  'chloé zhao': 'Contemplative Austerity & Poetic Observation',
  'barry jenkins': 'Contemplative Austerity & Poetic Observation',
  'claire denis': 'Contemplative Austerity & Poetic Observation',
  'pablo larrain': 'Contemplative Austerity & Poetic Observation',
  'pablo larraín': 'Contemplative Austerity & Poetic Observation',
  'jim jarmusch': 'Contemplative Austerity & Poetic Observation',
  'lynne ramsay': 'Contemplative Austerity & Poetic Observation',
  'paul thomas anderson': 'Contemplative Austerity & Poetic Observation',
  'ingmar bergman': 'Contemplative Austerity & Poetic Observation',

  // 2. Visceral Stylization & Cinematic Violence
  'park chan wook': 'Visceral Stylization & Cinematic Violence',
  'na hong jin': 'Visceral Stylization & Cinematic Violence',
  'kim jee woon': 'Visceral Stylization & Cinematic Violence',
  'ryoo seung wan': 'Visceral Stylization & Cinematic Violence',
  'takashi miike': 'Visceral Stylization & Cinematic Violence',
  'johnnie to': 'Visceral Stylization & Cinematic Violence',
  'anurag kashyap': 'Visceral Stylization & Cinematic Violence',
  'vetrimaaran': 'Visceral Stylization & Cinematic Violence',
  'martin scorsese': 'Visceral Stylization & Cinematic Violence',
  'quentin tarantino': 'Visceral Stylization & Cinematic Violence',
  'david fincher': 'Visceral Stylization & Cinematic Violence',
  'michael mann': 'Visceral Stylization & Cinematic Violence',
  'jean pierre melville': 'Visceral Stylization & Cinematic Violence',
  'gaspar noé': 'Visceral Stylization & Cinematic Violence',
  'alejandro gonzalez inarritu': 'Visceral Stylization & Cinematic Violence',
  'alejandro g inarritu': 'Visceral Stylization & Cinematic Violence',
  'alejandro g. iñárritu': 'Visceral Stylization & Cinematic Violence',
  'jacques audiard': 'Visceral Stylization & Cinematic Violence',

  // 3. Humanist Realism & Social Observationalism
  'hirokazu kore eda': 'Humanist Realism & Social Observationalism',
  'isao takahata': 'Humanist Realism & Social Observationalism',
  'satyajit ray': 'Humanist Realism & Social Observationalism',
  'asghar farhadi': 'Humanist Realism & Social Observationalism',
  'richard linklater': 'Humanist Realism & Social Observationalism',
  'alfonso cuaron': 'Humanist Realism & Social Observationalism',
  'alfonso cuarón': 'Humanist Realism & Social Observationalism',
  'fernando meirelles': 'Humanist Realism & Social Observationalism',
  'thomas vinterberg': 'Humanist Realism & Social Observationalism',
  'greta gerwig': 'Humanist Realism & Social Observationalism',
  'noah baumbach': 'Humanist Realism & Social Observationalism',
  'spike lee': 'Humanist Realism & Social Observationalism',

  // 3b. Classical Humanism & Redemptive Drama
  'frank darabont': 'Classical Humanism & Redemptive Drama',
  'rob reiner': 'Classical Humanism & Redemptive Drama',
  'frank capra': 'Classical Humanism & Redemptive Drama',
  'giuseppe tornatore': 'Classical Humanism & Redemptive Drama',

  // 3c. Ethical Humanism & Moral Epic Realism
  'masaki kobayashi': 'Ethical Humanism & Moral Epic Realism',
  'kenji mizoguchi': 'Ethical Humanism & Moral Epic Realism',

  // 4. Spectacle Philosophy & Epic Cinematic Grammar
  'akira kurosawa': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'ss rajamouli': 'Spectacle Philosophy & Epic Cinematic Grammar',
  's s rajamouli': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'ridley scott': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'james cameron': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'peter jackson': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'steven spielberg': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'christopher nolan': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'denis villeneuve': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'stanley kubrick': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'michael bay': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'roland emmerich': 'Spectacle Philosophy & Epic Cinematic Grammar',

  // 5. Gothic Fantasy & Surreal/Atmospheric Horror
  'guillermo del toro': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'david lynch': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'hideo nakata': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'jordan peele': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'ari aster': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'james wan': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'eli roth': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'mike flanagan': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'darren aronofsky': 'Gothic Fantasy & Surreal/Atmospheric Horror',

  // 6. Poetic Melancholy & Romantic Sensualism
  'wong kar wai': 'Poetic Melancholy & Romantic Sensualism',
  'sofia coppola': 'Poetic Melancholy & Romantic Sensualism',
  'mani ratnam': 'Poetic Melancholy & Romantic Sensualism',
  'imtiaz ali': 'Poetic Melancholy & Romantic Sensualism',

  // 7. Existential Absurdity & Satirical Cruelty
  'bong joon ho': 'Existential Absurdity & Satirical Cruelty',
  'michael haneke': 'Existential Absurdity & Satirical Cruelty',
  'yorgos lanthimos': 'Existential Absurdity & Satirical Cruelty',
  'ruben ostlund': 'Existential Absurdity & Satirical Cruelty',
  'ruben östlund': 'Existential Absurdity & Satirical Cruelty',
  'lars von trier': 'Existential Absurdity & Satirical Cruelty',
  'roy andersson': 'Existential Absurdity & Satirical Cruelty',

  // 8. Whimsical Melodrama & Stylized Eccentricity
  'pedro almodovar': 'Whimsical Melodrama & Stylized Eccentricity',
  'pedro almodóvar': 'Whimsical Melodrama & Stylized Eccentricity',
  'wes anderson': 'Whimsical Melodrama & Stylized Eccentricity',
  'sanjay leela bhansali': 'Whimsical Melodrama & Stylized Eccentricity',
  'xavier dolan': 'Whimsical Melodrama & Stylized Eccentricity',

  // 9. Visionary Animation & Speculative Worlds
  'hayao miyazaki': 'Visionary Animation & Speculative Worlds',
  'makoto shinkai': 'Visionary Animation & Speculative Worlds',
  'satoshi kon': 'Visionary Animation & Speculative Worlds',
  'mamoru hosoda': 'Visionary Animation & Speculative Worlds',
  'alex garland': 'Visionary Animation & Speculative Worlds',

  // ── Japanese Cinema ─────────────────────────────────────
  'shohei imamura': 'Humanist Realism & Social Observationalism',
  'nagisa oshima': 'Political & Philosophical Realism',
  'kiyoshi kurosawa': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'naomi kawase': 'Contemplative Austerity & Poetic Observation',
  'ryusuke hamaguchi': 'Humanist Realism & Social Observationalism',
  'kaneto shindo': 'Ethical Humanism & Moral Epic Realism',
  'mikio naruse': 'Poetic Melancholy & Romantic Sensualism',
  'seijun suzuki': 'Visceral Stylization & Cinematic Violence',
  'shinya tsukamoto': 'Visceral Stylization & Cinematic Violence',

  // ── Korean Cinema ─────────────────────────────────────
  'lee chang-dong': 'Humanist Realism & Social Observationalism',
  'kim ki-duk': 'Existential Absurdity & Satirical Cruelty',
  'hong sang-soo': 'Contemplative Austerity & Poetic Observation',
  'na hong-jin': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'kim jee-woon': 'Visceral Stylization & Cinematic Violence',
  'im kwon-taek': 'Ethical Humanism & Moral Epic Realism',

  // ── French Cinema ─────────────────────────────────────
  'robert bresson': 'Contemplative Austerity & Poetic Observation',
  'jacques tati': 'Whimsical Melodrama & Stylized Eccentricity',
  'leos carax': 'Poetic Melancholy & Romantic Sensualism',
  'agnes varda': 'Humanist Realism & Social Observationalism',
  'eric rohmer': 'Poetic Melancholy & Romantic Sensualism',
  'jacques rivette': 'Existential Absurdity & Satirical Cruelty',
  'claude chabrol': 'Psychological Moral Decay & Bourgeois Cruelty',
  'gaspar noe': 'Visceral Stylization & Cinematic Violence',
  'julia ducournau': 'Gothic Fantasy & Surreal/Atmospheric Horror',

  // ── Italian Cinema ─────────────────────────────────────
  'federico fellini': 'Whimsical Melodrama & Stylized Eccentricity',
  'michelangelo antonioni': 'Contemplative Austerity & Poetic Observation',
  'roberto rossellini': 'Ethical Humanism & Moral Epic Realism',
  'vittorio de sica': 'Humanist Realism & Social Observationalism',
  'pier paolo pasolini': 'Political & Philosophical Realism',
  'dario argento': 'Gothic Fantasy & Surreal/Atmospheric Horror',
  'sergio leone': 'Mythic Heroism & Tragic Grandeur',

  // ── Chinese / HK / Taiwan Cinema ─────────────────────
  'hou hsiao-hsien': 'Contemplative Austerity & Poetic Observation',
  'edward yang': 'Humanist Realism & Social Observationalism',
  'jia zhangke': 'Political & Philosophical Realism',
  'bi gan': 'Existential Absurdity & Satirical Cruelty',
  'john woo': 'Mythic Heroism & Tragic Grandeur',
  'tsui hark': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'ann hui': 'Humanist Realism & Social Observationalism',
  'fruit chan': 'Political & Philosophical Realism',
  'wong jing': 'Spectacle Philosophy & Epic Cinematic Grammar',
  'zhang yimou': 'Mythic Heroism & Tragic Grandeur'
};

const ARCHETYPE_DETAILS = {
  'Contemplative Austerity & Poetic Observation': {
    label: 'Contemplative Austerity & Poetic Observation',
    territory: 'existential isolation, memory, and the quiet dignity of everyday life',
    tradition: 'transcendental cinema and minimalist realism',
    rhythm: 'deliberate, meditative storytelling tempo',
    spirituality: 'they find deep spiritual resonance in silence and observation rather than narrative drama'
  },
  'Visceral Stylization & Cinematic Violence': {
    label: 'Visceral Stylization & Cinematic Violence',
    territory: 'moral ambiguity, guilt, vengeance, and characters pushed to extreme psychological limits',
    tradition: 'neo-noir and stylized masculine realism',
    rhythm: 'kinetic, highly choreographed visual tempo',
    spirituality: 'they use violence and stylized pressure-cooker tension to lay bare the human soul'
  },
  'Humanist Realism & Social Observationalism': {
    label: 'Humanist Realism & Social Observationalism',
    territory: 'domestic intimacy, class dynamics, and the fragile beauty of human connection',
    tradition: 'neorealism and empathetic social observation',
    rhythm: 'naturalistic, dialogue-driven pacing',
    spirituality: 'they capture the poetic truth of life through deep empathy and unembellished realism'
  },
  'Classical Humanism & Redemptive Drama': {
    label: 'Classical Humanism & Redemptive Drama',
    territory: 'moral resilience, redemptive storytelling, institutional realism, and hope overcoming oppressive systems',
    tradition: 'classical Hollywood humanism and emotionally restorative drama',
    rhythm: 'earnest, character-driven storytelling pace',
    spirituality: 'they build profound emotional catharsis and highlight the warmth of the human spirit in times of struggle'
  },
  'Spectacle Philosophy & Epic Cinematic Grammar': {
    label: 'Spectacle Philosophy & Epic Cinematic Grammar',
    territory: 'mythic struggles, legacy, and historical or speculative scale',
    tradition: 'epic world-building and philosophical spectacle',
    rhythm: 'grand, sweeping narrative momentum',
    spirituality: 'they explore profound human struggles through the lens of mythic scale and visual grammar'
  },
  'Gothic Fantasy & Surreal/Atmospheric Horror': {
    label: 'Gothic Fantasy & Surreal/Atmospheric Horror',
    territory: 'subconscious dread, psychological trauma, and the uncanny borders of reality',
    tradition: 'expressionist gothic horror and surrealism',
    rhythm: 'deliberately unsettling, dreamlike pacing',
    spirituality: 'they manifest internal psychological states into haunting, surreal, and gothic visual realms'
  },
  'Poetic Melancholy & Romantic Sensualism': {
    label: 'Poetic Melancholy & Romantic Sensualism',
    territory: 'longing, unrequited love, passage of time, and sensory memory',
    tradition: 'poetic sensualism and mood-driven lyrical cinema',
    rhythm: 'fluid, hypnotic visual rhythm',
    spirituality: 'they prioritize mood, color, and texture over plot to evoke deep emotional resonance'
  },
  'Existential Absurdity & Satirical Cruelty': {
    label: 'Existential Absurdity & Satirical Cruelty',
    territory: 'societal hypocrisy, the absurdity of modern systems, and cold human behavior',
    tradition: 'cynical satire and clinical existentialism',
    rhythm: 'rigid, dryly calculated storytelling rhythm',
    spirituality: 'they use dark humor and clinical distance to confront the uncomfortable realities of human nature'
  },
  'Whimsical Melodrama & Stylized Eccentricity': {
    label: 'Whimsical Melodrama & Stylized Eccentricity',
    territory: 'heightened emotion, eccentric families, identity, and vibrant melodrama',
    tradition: 'stylized theatricality and color-blocked melodrama',
    rhythm: 'playful, operatic narrative flow',
    spirituality: 'they embrace aesthetic maximalism and stylized eccentricity to highlight deep emotional truths'
  },
  'Visionary Animation & Speculative Worlds': {
    label: 'Visionary Animation & Speculative Worlds',
    territory: 'existential awe, environmental/societal collapse, and the nature of consciousness',
    tradition: 'speculative world-building and philosophical allegory',
    rhythm: 'imaginative, deeply atmospheric rhythm',
    spirituality: 'they build intricate speculative worlds to hold a mirror to our own collective psychology'
  },
  'Ethical Humanism & Moral Epic Realism': {
    label: 'Ethical Humanism & Moral Epic Realism',
    territory: 'moral endurance, institutional cruelty, sacrifice, and human dignity under oppressive systems',
    tradition: 'post-war moral realism and philosophical epic humanism',
    rhythm: 'measured, emotionally restrained dramatic escalation',
    spirituality: 'they confront violence and historical trauma through ethical inquiry and profound human compassion'
  }
};

export const getAuteurArchetype = (node) => {
  if (!node) return inferDynamicAuteurArchetype({}, {});

  if (typeof node === 'string') {
    const clean = cleanName(node);
    const cleanId = norm(node);

    const seeded =
      AUTEUR_ARCHETYPES[cleanId] ||
      AUTEUR_ARCHETYPES[clean];

    if (seeded) return seeded;

    return inferDynamicAuteurArchetype(
      { name: node },
      {}
    );
  }

  const id = node.id || '';
  const name = node.name || '';
  const cleanId = norm(id);
  const cleanNameVal = cleanName(name);

  const seeded =
    AUTEUR_ARCHETYPES[cleanId] ||
    AUTEUR_ARCHETYPES[cleanNameVal];

  if (seeded) return seeded;

  return inferDynamicAuteurArchetype(
    node,
    node.dna || {}
  );
};

const inferDynamicAuteurArchetype = (node = {}, dna = {}) => {
  const genres = dna.genres || {};
  const totalFilms = Math.max(dna.totalFilms || 1, 1);

  const genreRatio = (id) => (genres[id] || 0) / totalFilms;

  const drama = genreRatio(18);
  const thriller = genreRatio(53);
  const horror = genreRatio(27);
  const action = genreRatio(28);
  const sciFi = genreRatio(878);
  const fantasy = genreRatio(14);
  const animation = genreRatio(16);
  const romance = genreRatio(10749);
  const crime = genreRatio(80);
  const war = genreRatio(10752);

  const pacing = dna.pacing || 'measured';
  const tone = dna.tone || 'balanced';

  // Humanist realism
  if (
    drama > 0.45 &&
    action < 0.15 &&
    horror < 0.08 &&
    pacing !== 'kinetic'
  ) {
    return 'Humanist Realism & Social Observationalism';
  }

  // Contemplative slow cinema
  if (
    drama > 0.35 &&
    pacing === 'slow' &&
    action < 0.10 &&
    horror < 0.05
  ) {
    return 'Contemplative Austerity & Poetic Observation';
  }

  // Psychological dread / horror
  if (
    horror > 0.20 ||
    (thriller > 0.35 && tone === 'dark')
  ) {
    return 'Gothic Fantasy & Surreal/Atmospheric Horror';
  }

  // Violent realism
  if (
    crime > 0.25 &&
    action > 0.15 &&
    tone === 'dark'
  ) {
    return 'Visceral Stylization & Cinematic Violence';
  }

  // Epic spectacle
  if (
    action > 0.30 ||
    fantasy > 0.20 ||
    sciFi > 0.20 ||
    war > 0.15
  ) {
    return 'Spectacle Philosophy & Epic Cinematic Grammar';
  }

  // Romantic lyricism
  if (
    romance > 0.25 &&
    drama > 0.25
  ) {
    return 'Poetic Melancholy & Romantic Sensualism';
  }

  // Animation / fantasy
  if (
    animation > 0.30 ||
    (animation > 0.10 && fantasy > 0.15)
  ) {
    return 'Visionary Animation & Speculative Worlds';
  }

  // Dynamic ecosystem inference before generic fallback
  const inferredEco = inferDynamicEcosystem(node);
  if (inferredEco) {
    return inferredEco;
  }

  // Default intelligent fallback
  return 'Humanist Realism & Social Observationalism';
};


// ─── Continuous Weighted Worldview Spectrum Layer ────────────────────────────────

export const SEED_WORLDVIEW_MAP = {
  // Oppressive Psychological Dread (OPD) Dominant
  'park chan wook': { erh: 0.20, opd: 0.90, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'na hong jin': { erh: 0.10, opd: 0.95, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'kim jee woon': { erh: 0.25, opd: 0.85, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'ryoo seung wan': { erh: 0.30, opd: 0.75, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'takashi miike': { erh: 0.15, opd: 0.90, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'hideo nakata': { erh: 0.10, opd: 0.95, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'anurag kashyap': { erh: 0.30, opd: 0.85, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'vetrimaaran': { erh: 0.35, opd: 0.80, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'david fincher': { erh: 0.15, opd: 0.95, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'gaspar noé': { erh: 0.05, opd: 0.98, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'alejandro gonzalez inarritu': { erh: 0.40, opd: 0.85, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'alejandro g inarritu': { erh: 0.40, opd: 0.85, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'alejandro g. iñárritu': { erh: 0.40, opd: 0.85, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'michael haneke': { erh: 0.10, opd: 0.95, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'yorgos lanthimos': { erh: 0.25, opd: 0.85, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'ruben ostlund': { erh: 0.30, opd: 0.80, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'ruben östlund': { erh: 0.30, opd: 0.80, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'lars von trier': { erh: 0.15, opd: 0.95, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'darren aronofsky': { erh: 0.20, opd: 0.90, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'david lynch': { erh: 0.30, opd: 0.85, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'jordan peele': { erh: 0.30, opd: 0.85, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'ari aster': { erh: 0.10, opd: 0.95, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'james wan': { erh: 0.15, opd: 0.90, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'eli roth': { erh: 0.05, opd: 0.96, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'michael bay': { erh: 0.25, opd: 0.72, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'roland emmerich': { erh: 0.30, opd: 0.68, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'mike flanagan': { erh: 0.45, opd: 0.80, primary: 'OPD', secondary: 'ERH', confidence: 'high' }, // Warm emotional core under horror
  'lynne ramsay': { erh: 0.25, opd: 0.85, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'andrey zvyagintsev': { erh: 0.20, opd: 0.90, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'andrei zvyagintsev': { erh: 0.20, opd: 0.90, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'bela tarr': { erh: 0.15, opd: 0.90, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'béla tarr': { erh: 0.15, opd: 0.90, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'christian mungiu': { erh: 0.30, opd: 0.80, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },

  // Emotionally Restorative Humanism (ERH) Dominant
  'yasujiro ozu': { erh: 0.95, opd: 0.15, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'yasujirō ozu': { erh: 0.95, opd: 0.15, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'satyajit ray': { erh: 0.95, opd: 0.20, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'hirokazu kore eda': { erh: 0.90, opd: 0.25, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'hirokazu kore-eda': { erh: 0.90, opd: 0.25, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'isao takahata': { erh: 0.90, opd: 0.35, primary: 'ERH', secondary: 'OPD', confidence: 'high' },
  'asghar farhadi': { erh: 0.75, opd: 0.40, primary: 'ERH', secondary: 'OPD', confidence: 'high' },
  'richard linklater': { erh: 0.90, opd: 0.15, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'alfonso cuaron': { erh: 0.80, opd: 0.35, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'alfonso cuarón': { erh: 0.80, opd: 0.35, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'greta gerwig': { erh: 0.90, opd: 0.15, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'noah baumbach': { erh: 0.80, opd: 0.25, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'spike lee': { erh: 0.70, opd: 0.45, primary: 'ERH', secondary: 'OPD', confidence: 'high' },
  'fernando meirelles': { erh: 0.70, opd: 0.50, primary: 'ERH', secondary: 'OPD', confidence: 'high' },
  'thomas vinterberg': { erh: 0.75, opd: 0.45, primary: 'ERH', secondary: 'OPD', confidence: 'high' }, // Cathartic humanist resolution
  'hayao miyazaki': { erh: 0.95, opd: 0.25, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'makoto shinkai': { erh: 0.90, opd: 0.20, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'mamoru hosoda': { erh: 0.90, opd: 0.20, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'abbas kiarostami': { erh: 0.90, opd: 0.20, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'jafar panahi': { erh: 0.85, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'terrence malick': { erh: 0.90, opd: 0.20, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'kelly reichardt': { erh: 0.85, opd: 0.25, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'chloe zhao': { erh: 0.90, opd: 0.20, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'chloé zhao': { erh: 0.90, opd: 0.20, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'barry jenkins': { erh: 0.90, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'krzysztof kieslowski': { erh: 0.85, opd: 0.35, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'krzysztof kieślowski': { erh: 0.85, opd: 0.35, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'pawel pawlikowski': { erh: 0.80, opd: 0.35, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'paweł pawlikowski': { erh: 0.80, opd: 0.35, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'steven spielberg': { erh: 0.90, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'sofia coppola': { erh: 0.80, opd: 0.25, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'pedro almodovar': { erh: 0.85, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'pedro almodóvar': { erh: 0.85, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'xavier dolan': { erh: 0.85, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'mani ratnam': { erh: 0.85, opd: 0.25, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'imtiaz ali': { erh: 0.90, opd: 0.20, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'sanjay leela bhansali': { erh: 0.85, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'apichatpong weerasethakul': { erh: 0.85, opd: 0.25, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'roy andersson': { erh: 0.50, opd: 0.60, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'frank darabont': { erh: 0.95, opd: 0.25, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' }, // Restorative Hollywood Humanism
  'rob reiner': { erh: 0.95, opd: 0.15, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'frank capra': { erh: 0.98, opd: 0.10, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'giuseppe tornatore': { erh: 0.95, opd: 0.15, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },

  'masaki kobayashi': { erh: 0.92, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },

  // Nuanced/Existential Dualist Filmmakers
  'akira kurosawa': { erh: 0.85, opd: 0.40, primary: 'ERH', secondary: 'OPD', confidence: 'high' }, // Deep hope vs intense existential battle
  'hou hsiao hsien': { erh: 0.85, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'andrei tarkovsky': { erh: 0.80, opd: 0.45, primary: 'ERH', secondary: 'OPD', confidence: 'high' },
  'bong joon ho': { erh: 0.50, opd: 0.70, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'christopher nolan': { erh: 0.55, opd: 0.60, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'denis villeneuve': { erh: 0.50, opd: 0.70, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'stanley kubrick': { erh: 0.30, opd: 0.80, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'martin scorsese': { erh: 0.50, opd: 0.65, primary: 'OPD', secondary: 'ERH', confidence: 'high' },
  'jean pierre melville': { erh: 0.45, opd: 0.65, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'quentin tarantino': { erh: 0.45, opd: 0.55, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'ridley scott': { erh: 0.45, opd: 0.60, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'james cameron': { erh: 0.75, opd: 0.40, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'peter jackson': { erh: 0.80, opd: 0.40, primary: 'ERH', secondary: 'OPD', confidence: 'high' },
  'ss rajamouli': { erh: 0.80, opd: 0.35, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  's s rajamouli': { erh: 0.80, opd: 0.35, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },
  'alex garland': { erh: 0.35, opd: 0.80, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'michael mann': { erh: 0.45, opd: 0.65, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'johnnie to': { erh: 0.50, opd: 0.60, primary: 'OPD', secondary: 'NEUTRAL', confidence: 'high' },
  'jim jarmusch': { erh: 0.75, opd: 0.30, primary: 'ERH', secondary: 'NEUTRAL', confidence: 'high' },

  // ── Japanese Humanism ─────────────────────────────────────
  'kenji mizoguchi': { erh:0.94, opd:0.20, primary:'ERH', secondary:'NEUTRAL', confidence:'high' },
  'shohei imamura': { erh:0.78, opd:0.42, primary:'PPR', secondary:'ERH', confidence:'high' },
  'nagisa oshima': { erh:0.52, opd:0.62, primary:'PPR', secondary:'AEA', confidence:'high' },
  'kiyoshi kurosawa': { erh:0.22, opd:0.92, primary:'OPD', secondary:'AEA', confidence:'high' },
  'naomi kawase': { erh:0.91, opd:0.12, primary:'EMS', secondary:'ERH', confidence:'high' },
  'ryusuke hamaguchi': { erh:0.88, opd:0.18, primary:'ERH', secondary:'RML', confidence:'high' },

  // ── Korean Cinema ─────────────────────────────────────
  'lee chang-dong': { erh:0.90, opd:0.30, primary:'ERH', secondary:'PPR', confidence:'high' },
  'kim ki-duk': { erh:0.20, opd:0.88, primary:'AEA', secondary:'OPD', confidence:'high' },
  'hong sang-soo': { erh:0.82, opd:0.18, primary:'RML', secondary:'ERH', confidence:'high' },
  'na hong-jin': { erh:0.12, opd:0.96, primary:'OPD', secondary:'AEA', confidence:'high' },
  'kim jee-woon': { erh:0.30, opd:0.80, primary:'OPD', secondary:'MHT', confidence:'high' },

  // ── French Cinema ─────────────────────────────────────
  'robert bresson': { erh:0.90, opd:0.10, primary:'EMS', secondary:'ERH', confidence:'high' },
  'jacques tati': { erh:0.88, opd:0.05, primary:'ERH', secondary:'RML', confidence:'high' },
  'leos carax': { erh:0.62, opd:0.42, primary:'RML', secondary:'AEA', confidence:'high' },
  'agnes varda': { erh:0.94, opd:0.08, primary:'ERH', secondary:'PPR', confidence:'high' },
  'eric rohmer': { erh:0.86, opd:0.12, primary:'RML', secondary:'ERH', confidence:'high' },
  'jacques rivette': { erh:0.40, opd:0.62, primary:'AEA', secondary:'EMS', confidence:'high' },
  'claude chabrol': { erh:0.32, opd:0.72, primary:'AEA', secondary:'OPD', confidence:'high' },
  'gaspar noe': { erh:0.05, opd:0.98, primary:'OPD', secondary:'AEA', confidence:'high' },

  // ── Italian Cinema ─────────────────────────────────────
  'federico fellini': { erh:0.70, opd:0.28, primary:'RML', secondary:'AEA', confidence:'high' },
  'michelangelo antonioni': { erh:0.62, opd:0.38, primary:'EMS', secondary:'AEA', confidence:'high' },
  'roberto rossellini': { erh:0.92, opd:0.12, primary:'ERH', secondary:'PPR', confidence:'high' },
  'vittorio de sica': { erh:0.95, opd:0.10, primary:'ERH', secondary:'RML', confidence:'high' },
  'pier paolo pasolini': { erh:0.42, opd:0.70, primary:'PPR', secondary:'AEA', confidence:'high' },
  'dario argento': { erh:0.08, opd:0.96, primary:'OPD', secondary:'AEA', confidence:'high' },
  'sergio leone': { erh:0.58, opd:0.45, primary:'MHT', secondary:'AEA', confidence:'high' },

  // ── Chinese / HK / Taiwan Cinema ─────────────────────
  'hou hsiao-hsien': { erh:0.90, opd:0.12, primary:'EMS', secondary:'ERH', confidence:'high' },
  'edward yang': { erh:0.92, opd:0.18, primary:'ERH', secondary:'RML', confidence:'high' },
  'jia zhangke': { erh:0.82, opd:0.42, primary:'PPR', secondary:'ERH', confidence:'high' },
  'bi gan': { erh:0.62, opd:0.38, primary:'EMS', secondary:'AEA', confidence:'high' },
  'john woo': { erh:0.52, opd:0.62, primary:'MHT', secondary:'AEA', confidence:'high' },
  'tsui hark': { erh:0.42, opd:0.58, primary:'MHT', secondary:'AEA', confidence:'high' },
  'ann hui': { erh:0.90, opd:0.15, primary:'ERH', secondary:'PPR', confidence:'high' },
  'fruit chan': { erh:0.60, opd:0.55, primary:'PPR', secondary:'AEA', confidence:'high' },
  'zhang yimou': { erh:0.70, opd:0.35, primary:'MHT', secondary:'RML', confidence:'high' }
};

// ─── Cinematic Profile Seed Map (grammar · scale · audience · stylization · pacing · ambiguity) ───
// grammar: classical-narrative | observational-realism | contemplative-minimalism | mythic-operatic
//          visceral-kinetic | psychological-dread | absurdist-satirical | lyrical-sensory | genre-hybrid
// scale:   0.0=intimate/domestic → 1.0=epic/spectacle
// audience: arthouse | crossover | commercial
// stylization: 0.0=naturalistic → 1.0=hyper-stylized
// pacing:  kinetic | measured | meditative
// ambiguity: 0.0=clarity/resolution → 1.0=open ambiguity

const SEED_CINEMATIC_PROFILE_MAP = {
  // ── Contemplative Minimalists ──────────────────────────────────────────────
  'yasujiro ozu':              { grammar:'contemplative-minimalism', scale:0.10, audienceMode:'arthouse',   stylization:0.25, pacingPhilosophy:'meditative', ambiguity:0.35 },
  'yasujirō ozu':              { grammar:'contemplative-minimalism', scale:0.10, audienceMode:'arthouse',   stylization:0.25, pacingPhilosophy:'meditative', ambiguity:0.35 },
  'andrei tarkovsky':          { grammar:'contemplative-minimalism', scale:0.30, audienceMode:'arthouse',   stylization:0.50, pacingPhilosophy:'meditative', ambiguity:0.85 },
  'bela tarr':                 { grammar:'contemplative-minimalism', scale:0.15, audienceMode:'arthouse',   stylization:0.45, pacingPhilosophy:'meditative', ambiguity:0.80 },
  'béla tarr':                 { grammar:'contemplative-minimalism', scale:0.15, audienceMode:'arthouse',   stylization:0.45, pacingPhilosophy:'meditative', ambiguity:0.80 },
  'apichatpong weerasethakul': { grammar:'contemplative-minimalism', scale:0.10, audienceMode:'arthouse',   stylization:0.35, pacingPhilosophy:'meditative', ambiguity:0.90 },
  'hou hsiao hsien':           { grammar:'contemplative-minimalism', scale:0.10, audienceMode:'arthouse',   stylization:0.20, pacingPhilosophy:'meditative', ambiguity:0.70 },
  'terrence malick':           { grammar:'contemplative-minimalism', scale:0.45, audienceMode:'crossover',  stylization:0.65, pacingPhilosophy:'meditative', ambiguity:0.80 },
  'kelly reichardt':           { grammar:'contemplative-minimalism', scale:0.10, audienceMode:'arthouse',   stylization:0.15, pacingPhilosophy:'meditative', ambiguity:0.60 },
  'jim jarmusch':              { grammar:'contemplative-minimalism', scale:0.10, audienceMode:'arthouse',   stylization:0.30, pacingPhilosophy:'meditative', ambiguity:0.65 },
  'chloe zhao':                { grammar:'contemplative-minimalism', scale:0.25, audienceMode:'crossover',  stylization:0.25, pacingPhilosophy:'meditative', ambiguity:0.55 },
  'chloé zhao':                { grammar:'contemplative-minimalism', scale:0.25, audienceMode:'crossover',  stylization:0.25, pacingPhilosophy:'meditative', ambiguity:0.55 },
  'claire denis':              { grammar:'contemplative-minimalism', scale:0.10, audienceMode:'arthouse',   stylization:0.35, pacingPhilosophy:'meditative', ambiguity:0.75 },
  'barry jenkins':             { grammar:'contemplative-minimalism', scale:0.20, audienceMode:'crossover',  stylization:0.55, pacingPhilosophy:'meditative', ambiguity:0.55 },
  'ingmar bergman':            { grammar:'contemplative-minimalism', scale:0.15, audienceMode:'arthouse',   stylization:0.40, pacingPhilosophy:'meditative', ambiguity:0.80 },
  'paul thomas anderson':      { grammar:'contemplative-minimalism', scale:0.30, audienceMode:'crossover',  stylization:0.55, pacingPhilosophy:'meditative', ambiguity:0.65 },
  'krzysztof kieslowski':      { grammar:'contemplative-minimalism', scale:0.15, audienceMode:'arthouse',   stylization:0.40, pacingPhilosophy:'meditative', ambiguity:0.75 },
  'krzysztof kieślowski':      { grammar:'contemplative-minimalism', scale:0.15, audienceMode:'arthouse',   stylization:0.40, pacingPhilosophy:'meditative', ambiguity:0.75 },
  'pawel pawlikowski':         { grammar:'contemplative-minimalism', scale:0.15, audienceMode:'arthouse',   stylization:0.45, pacingPhilosophy:'meditative', ambiguity:0.55 },
  'paweł pawlikowski':         { grammar:'contemplative-minimalism', scale:0.15, audienceMode:'arthouse',   stylization:0.45, pacingPhilosophy:'meditative', ambiguity:0.55 },
  'pablo larrain':             { grammar:'contemplative-minimalism', scale:0.20, audienceMode:'crossover',  stylization:0.60, pacingPhilosophy:'meditative', ambiguity:0.65 },
  'pablo larraín':             { grammar:'contemplative-minimalism', scale:0.20, audienceMode:'crossover',  stylization:0.60, pacingPhilosophy:'meditative', ambiguity:0.65 },
  'lee chang dong':            { grammar:'contemplative-minimalism', scale:0.15, audienceMode:'arthouse',   stylization:0.30, pacingPhilosophy:'meditative', ambiguity:0.70 },
  'hong sang soo':             { grammar:'observational-realism',   scale:0.05, audienceMode:'arthouse',   stylization:0.10, pacingPhilosophy:'measured',   ambiguity:0.65 },

  // ── Observational Realists ─────────────────────────────────────────────────
  'hirokazu kore eda':         { grammar:'observational-realism',   scale:0.10, audienceMode:'arthouse',   stylization:0.15, pacingPhilosophy:'meditative', ambiguity:0.45 },
  'hirokazu kore-eda':         { grammar:'observational-realism',   scale:0.10, audienceMode:'arthouse',   stylization:0.15, pacingPhilosophy:'meditative', ambiguity:0.45 },
  'hirokazu koreeda':          { grammar:'observational-realism',   scale:0.10, audienceMode:'arthouse',   stylization:0.15, pacingPhilosophy:'meditative', ambiguity:0.45 },
  'satyajit ray':              { grammar:'observational-realism',   scale:0.15, audienceMode:'arthouse',   stylization:0.10, pacingPhilosophy:'meditative', ambiguity:0.45 },
  'isao takahata':             { grammar:'observational-realism',   scale:0.20, audienceMode:'crossover',  stylization:0.20, pacingPhilosophy:'meditative', ambiguity:0.40 },
  'asghar farhadi':            { grammar:'observational-realism',   scale:0.10, audienceMode:'crossover',  stylization:0.10, pacingPhilosophy:'measured',   ambiguity:0.60 },
  'richard linklater':         { grammar:'observational-realism',   scale:0.10, audienceMode:'crossover',  stylization:0.15, pacingPhilosophy:'measured',   ambiguity:0.45 },
  'greta gerwig':              { grammar:'observational-realism',   scale:0.30, audienceMode:'crossover',  stylization:0.30, pacingPhilosophy:'measured',   ambiguity:0.35 },
  'noah baumbach':             { grammar:'observational-realism',   scale:0.10, audienceMode:'crossover',  stylization:0.15, pacingPhilosophy:'measured',   ambiguity:0.45 },
  'thomas vinterberg':         { grammar:'observational-realism',   scale:0.15, audienceMode:'crossover',  stylization:0.20, pacingPhilosophy:'measured',   ambiguity:0.40 },
  'fernando meirelles':        { grammar:'observational-realism',   scale:0.35, audienceMode:'crossover',  stylization:0.50, pacingPhilosophy:'kinetic',    ambiguity:0.35 },
  'alfonso cuaron':            { grammar:'observational-realism',   scale:0.45, audienceMode:'crossover',  stylization:0.45, pacingPhilosophy:'measured',   ambiguity:0.40 },
  'alfonso cuarón':            { grammar:'observational-realism',   scale:0.45, audienceMode:'crossover',  stylization:0.45, pacingPhilosophy:'measured',   ambiguity:0.40 },
  'abbas kiarostami':          { grammar:'observational-realism',   scale:0.10, audienceMode:'arthouse',   stylization:0.10, pacingPhilosophy:'meditative', ambiguity:0.75 },
  'jafar panahi':              { grammar:'observational-realism',   scale:0.10, audienceMode:'arthouse',   stylization:0.10, pacingPhilosophy:'measured',   ambiguity:0.60 },
  'spike lee':                 { grammar:'observational-realism',   scale:0.25, audienceMode:'crossover',  stylization:0.55, pacingPhilosophy:'measured',   ambiguity:0.45 },
  'sofia coppola':             { grammar:'lyrical-sensory',         scale:0.20, audienceMode:'crossover',  stylization:0.70, pacingPhilosophy:'meditative', ambiguity:0.65 },

  // ── Classical Narrative ────────────────────────────────────────────────────
  'frank darabont':            { grammar:'classical-narrative',     scale:0.45, audienceMode:'commercial', stylization:0.30, pacingPhilosophy:'measured',   ambiguity:0.15 },
  'rob reiner':                { grammar:'classical-narrative',     scale:0.35, audienceMode:'commercial', stylization:0.20, pacingPhilosophy:'measured',   ambiguity:0.10 },
  'frank capra':               { grammar:'classical-narrative',     scale:0.40, audienceMode:'commercial', stylization:0.25, pacingPhilosophy:'measured',   ambiguity:0.10 },
  'giuseppe tornatore':        { grammar:'classical-narrative',     scale:0.35, audienceMode:'commercial', stylization:0.40, pacingPhilosophy:'measured',   ambiguity:0.20 },
  'steven spielberg':          { grammar:'classical-narrative',     scale:0.90, audienceMode:'commercial', stylization:0.60, pacingPhilosophy:'measured',   ambiguity:0.15 },
  'hayao miyazaki':            { grammar:'classical-narrative',     scale:0.75, audienceMode:'crossover',  stylization:0.85, pacingPhilosophy:'measured',   ambiguity:0.30 },
  'makoto shinkai':            { grammar:'classical-narrative',     scale:0.55, audienceMode:'commercial', stylization:0.90, pacingPhilosophy:'measured',   ambiguity:0.35 },
  'mamoru hosoda':             { grammar:'classical-narrative',     scale:0.60, audienceMode:'commercial', stylization:0.75, pacingPhilosophy:'measured',   ambiguity:0.25 },
  'imtiaz ali':                { grammar:'lyrical-sensory',         scale:0.55, audienceMode:'commercial', stylization:0.70, pacingPhilosophy:'measured',   ambiguity:0.40 },
  'mani ratnam':               { grammar:'mythic-operatic',         scale:0.65, audienceMode:'commercial', stylization:0.80, pacingPhilosophy:'measured',   ambiguity:0.25 },
  'sanjay leela bhansali':     { grammar:'mythic-operatic',         scale:0.85, audienceMode:'commercial', stylization:0.95, pacingPhilosophy:'measured',   ambiguity:0.20 },
  'ss rajamouli':              { grammar:'mythic-operatic',         scale:0.98, audienceMode:'commercial', stylization:0.90, pacingPhilosophy:'kinetic',    ambiguity:0.10 },
  's s rajamouli':             { grammar:'mythic-operatic',         scale:0.98, audienceMode:'commercial', stylization:0.90, pacingPhilosophy:'kinetic',    ambiguity:0.10 },

  'masaki kobayashi': {
    grammar:'observational-realism',
    scale:0.70,
    audienceMode:'arthouse',
    stylization:0.35,
    pacingPhilosophy:'measured',
    ambiguity:0.35
  },

  'kenji mizoguchi': {
    grammar:'observational-realism',
    scale:0.60,
    audienceMode:'arthouse',
    stylization:0.20,
    pacingPhilosophy:'measured',
    ambiguity:0.35
  },

  'shohei imamura': {
    grammar:'observational-realism',
    scale:0.58,
    audienceMode:'arthouse',
    stylization:0.35,
    pacingPhilosophy:'measured',
    ambiguity:0.50
  },

  'nagisa oshima': {
    grammar:'political-fracture',
    scale:0.62,
    audienceMode:'arthouse',
    stylization:0.55,
    pacingPhilosophy:'volatile',
    ambiguity:0.65
  },

  'kiyoshi kurosawa': {
    grammar:'psychological-dread',
    scale:0.52,
    audienceMode:'arthouse',
    stylization:0.60,
    pacingPhilosophy:'slow',
    ambiguity:0.82
  },

  'naomi kawase': {
    grammar:'transcendental-minimalism',
    scale:0.40,
    audienceMode:'arthouse',
    stylization:0.18,
    pacingPhilosophy:'meditative',
    ambiguity:0.52
  },

  // ── Korean Cinema ─────────────────────────────────────
  'lee chang-dong': {
    grammar:'observational-realism',
    scale:0.60,
    audienceMode:'arthouse',
    stylization:0.25,
    pacingPhilosophy:'measured',
    ambiguity:0.45
  },

  'kim ki-duk': {
    grammar:'absurdist-fracture',
    scale:0.55,
    audienceMode:'arthouse',
    stylization:0.72,
    pacingPhilosophy:'volatile',
    ambiguity:0.75
  },

  'hong sang-soo': {
    grammar:'romantic-poeticism',
    scale:0.32,
    audienceMode:'arthouse',
    stylization:0.15,
    pacingPhilosophy:'measured',
    ambiguity:0.62
  },

  'na hong-jin': {
    grammar:'psychological-dread',
    scale:0.75,
    audienceMode:'mainstream',
    stylization:0.70,
    pacingPhilosophy:'volatile',
    ambiguity:0.48
  },

  // ── Mythic-Operatic ────────────────────────────────────────────────────────
  'akira kurosawa':            { grammar:'mythic-operatic',         scale:0.80, audienceMode:'crossover',  stylization:0.65, pacingPhilosophy:'measured',   ambiguity:0.30 },
  'peter jackson':             { grammar:'mythic-operatic',         scale:0.95, audienceMode:'commercial', stylization:0.80, pacingPhilosophy:'measured',   ambiguity:0.20 },
  'james cameron':             { grammar:'mythic-operatic',         scale:0.98, audienceMode:'commercial', stylization:0.85, pacingPhilosophy:'measured',   ambiguity:0.15 },
  'ridley scott':              { grammar:'mythic-operatic',         scale:0.80, audienceMode:'commercial', stylization:0.75, pacingPhilosophy:'measured',   ambiguity:0.25 },
  'michael bay':               { grammar:'mythic-operatic',         scale:1.00, audienceMode:'commercial', stylization:0.92, pacingPhilosophy:'kinetic',    ambiguity:0.05 },
  'roland emmerich':           { grammar:'mythic-operatic',         scale:1.00, audienceMode:'commercial', stylization:0.78, pacingPhilosophy:'kinetic',    ambiguity:0.08 },

  // ── Visceral-Kinetic ───────────────────────────────────────────────────────
  'park chan wook':            { grammar:'visceral-kinetic',        scale:0.50, audienceMode:'crossover',  stylization:0.85, pacingPhilosophy:'kinetic',    ambiguity:0.55 },
  'na hong jin':               { grammar:'visceral-kinetic',        scale:0.45, audienceMode:'crossover',  stylization:0.70, pacingPhilosophy:'kinetic',    ambiguity:0.50 },
  'kim jee woon':              { grammar:'visceral-kinetic',        scale:0.55, audienceMode:'commercial', stylization:0.80, pacingPhilosophy:'kinetic',    ambiguity:0.35 },
  'ryoo seung wan':            { grammar:'visceral-kinetic',        scale:0.60, audienceMode:'commercial', stylization:0.70, pacingPhilosophy:'kinetic',    ambiguity:0.25 },
  'takashi miike':             { grammar:'visceral-kinetic',        scale:0.55, audienceMode:'crossover',  stylization:0.80, pacingPhilosophy:'kinetic',    ambiguity:0.45 },
  'johnnie to':                { grammar:'visceral-kinetic',        scale:0.40, audienceMode:'crossover',  stylization:0.60, pacingPhilosophy:'measured',   ambiguity:0.45 },
  'anurag kashyap':            { grammar:'visceral-kinetic',        scale:0.45, audienceMode:'crossover',  stylization:0.65, pacingPhilosophy:'kinetic',    ambiguity:0.45 },
  'vetrimaaran':               { grammar:'visceral-kinetic',        scale:0.40, audienceMode:'commercial', stylization:0.55, pacingPhilosophy:'measured',   ambiguity:0.40 },
  'martin scorsese':           { grammar:'visceral-kinetic',        scale:0.55, audienceMode:'commercial', stylization:0.70, pacingPhilosophy:'kinetic',    ambiguity:0.40 },
  'quentin tarantino':         { grammar:'visceral-kinetic',        scale:0.50, audienceMode:'commercial', stylization:0.85, pacingPhilosophy:'kinetic',    ambiguity:0.35 },
  'michael mann':              { grammar:'visceral-kinetic',        scale:0.55, audienceMode:'commercial', stylization:0.75, pacingPhilosophy:'kinetic',    ambiguity:0.35 },
  'jean pierre melville':      { grammar:'visceral-kinetic',        scale:0.45, audienceMode:'arthouse',   stylization:0.55, pacingPhilosophy:'measured',   ambiguity:0.35 },
  'jacques audiard':           { grammar:'visceral-kinetic',        scale:0.35, audienceMode:'crossover',  stylization:0.55, pacingPhilosophy:'kinetic',    ambiguity:0.45 },

  // ── Psychological Dread ────────────────────────────────────────────────────
  'david fincher':             { grammar:'psychological-dread',     scale:0.55, audienceMode:'commercial', stylization:0.75, pacingPhilosophy:'measured',   ambiguity:0.25 },
  'darren aronofsky':          { grammar:'psychological-dread',     scale:0.30, audienceMode:'crossover',  stylization:0.80, pacingPhilosophy:'kinetic',    ambiguity:0.35 },
  'gaspar noé':                { grammar:'psychological-dread',     scale:0.15, audienceMode:'arthouse',   stylization:0.90, pacingPhilosophy:'kinetic',    ambiguity:0.70 },
  'ari aster':                 { grammar:'psychological-dread',     scale:0.25, audienceMode:'crossover',  stylization:0.80, pacingPhilosophy:'meditative', ambiguity:0.50 },
  'david lynch':               { grammar:'psychological-dread',     scale:0.25, audienceMode:'crossover',  stylization:0.85, pacingPhilosophy:'meditative', ambiguity:0.95 },
  'hideo nakata':              { grammar:'psychological-dread',     scale:0.25, audienceMode:'commercial', stylization:0.60, pacingPhilosophy:'measured',   ambiguity:0.60 },
  'james wan':                 { grammar:'psychological-dread',     scale:0.35, audienceMode:'commercial', stylization:0.65, pacingPhilosophy:'kinetic',    ambiguity:0.30 },
  'eli roth':                  { grammar:'psychological-dread',     scale:0.30, audienceMode:'commercial', stylization:0.82, pacingPhilosophy:'kinetic',    ambiguity:0.25 },
  'jordan peele':              { grammar:'psychological-dread',     scale:0.35, audienceMode:'commercial', stylization:0.70, pacingPhilosophy:'measured',   ambiguity:0.55 },
  'mike flanagan':             { grammar:'psychological-dread',     scale:0.30, audienceMode:'crossover',  stylization:0.65, pacingPhilosophy:'meditative', ambiguity:0.55 },
  'alex garland':              { grammar:'psychological-dread',     scale:0.35, audienceMode:'crossover',  stylization:0.70, pacingPhilosophy:'measured',   ambiguity:0.70 },
  'lynne ramsay':              { grammar:'psychological-dread',     scale:0.15, audienceMode:'arthouse',   stylization:0.65, pacingPhilosophy:'meditative', ambiguity:0.65 },
  'andrey zvyagintsev':        { grammar:'psychological-dread',     scale:0.30, audienceMode:'arthouse',   stylization:0.55, pacingPhilosophy:'meditative', ambiguity:0.75 },
  'andrei zvyagintsev':        { grammar:'psychological-dread',     scale:0.30, audienceMode:'arthouse',   stylization:0.55, pacingPhilosophy:'meditative', ambiguity:0.75 },
  'christian mungiu':          { grammar:'psychological-dread',     scale:0.15, audienceMode:'arthouse',   stylization:0.20, pacingPhilosophy:'measured',   ambiguity:0.55 },
  'guillermo del toro':        { grammar:'psychological-dread',     scale:0.65, audienceMode:'commercial', stylization:0.85, pacingPhilosophy:'measured',   ambiguity:0.40 },
  'satoshi kon':               { grammar:'psychological-dread',     scale:0.40, audienceMode:'crossover',  stylization:0.80, pacingPhilosophy:'kinetic',    ambiguity:0.80 },

  // ── Absurdist-Satirical ────────────────────────────────────────────────────
  'michael haneke':            { grammar:'absurdist-satirical',     scale:0.15, audienceMode:'arthouse',   stylization:0.35, pacingPhilosophy:'meditative', ambiguity:0.70 },
  'yorgos lanthimos':          { grammar:'absurdist-satirical',     scale:0.20, audienceMode:'crossover',  stylization:0.55, pacingPhilosophy:'measured',   ambiguity:0.75 },
  'ruben ostlund':             { grammar:'absurdist-satirical',     scale:0.25, audienceMode:'crossover',  stylization:0.45, pacingPhilosophy:'measured',   ambiguity:0.60 },
  'ruben östlund':             { grammar:'absurdist-satirical',     scale:0.25, audienceMode:'crossover',  stylization:0.45, pacingPhilosophy:'measured',   ambiguity:0.60 },
  'lars von trier':            { grammar:'absurdist-satirical',     scale:0.35, audienceMode:'crossover',  stylization:0.65, pacingPhilosophy:'measured',   ambiguity:0.80 },
  'roy andersson':             { grammar:'absurdist-satirical',     scale:0.10, audienceMode:'arthouse',   stylization:0.50, pacingPhilosophy:'meditative', ambiguity:0.75 },

  // ── Lyrical-Sensory ────────────────────────────────────────────────────────
  'wong kar wai':              { grammar:'lyrical-sensory',         scale:0.30, audienceMode:'crossover',  stylization:0.95, pacingPhilosophy:'meditative', ambiguity:0.70 },
  'xavier dolan':              { grammar:'lyrical-sensory',         scale:0.20, audienceMode:'crossover',  stylization:0.80, pacingPhilosophy:'kinetic',    ambiguity:0.55 },
  'pedro almodovar':           { grammar:'lyrical-sensory',         scale:0.25, audienceMode:'crossover',  stylization:0.85, pacingPhilosophy:'measured',   ambiguity:0.45 },
  'pedro almodóvar':           { grammar:'lyrical-sensory',         scale:0.25, audienceMode:'crossover',  stylization:0.85, pacingPhilosophy:'measured',   ambiguity:0.45 },
  'wes anderson':              { grammar:'lyrical-sensory',         scale:0.35, audienceMode:'crossover',  stylization:0.95, pacingPhilosophy:'measured',   ambiguity:0.30 },

  // ── Genre-Hybrid ───────────────────────────────────────────────────────────
  'bong joon ho':              { grammar:'genre-hybrid',            scale:0.60, audienceMode:'crossover',  stylization:0.65, pacingPhilosophy:'measured',   ambiguity:0.40 },
  'christopher nolan':         { grammar:'genre-hybrid',            scale:0.85, audienceMode:'commercial', stylization:0.70, pacingPhilosophy:'measured',   ambiguity:0.55 },
  'denis villeneuve':          { grammar:'genre-hybrid',            scale:0.80, audienceMode:'commercial', stylization:0.70, pacingPhilosophy:'meditative', ambiguity:0.50 },
  'alejandro gonzalez inarritu':{ grammar:'genre-hybrid',           scale:0.55, audienceMode:'crossover',  stylization:0.75, pacingPhilosophy:'kinetic',    ambiguity:0.45 },
  'alejandro g inarritu':      { grammar:'genre-hybrid',            scale:0.55, audienceMode:'crossover',  stylization:0.75, pacingPhilosophy:'kinetic',    ambiguity:0.45 },
  'stanley kubrick':           { grammar:'genre-hybrid',            scale:0.60, audienceMode:'crossover',  stylization:0.80, pacingPhilosophy:'meditative', ambiguity:0.65 },

  // ── French Cinema ─────────────────────────────────────
  'robert bresson': {
    grammar:'transcendental-minimalism',
    scale:0.30,
    audienceMode:'arthouse',
    stylization:0.10,
    pacingPhilosophy:'meditative',
    ambiguity:0.50
  },

  'jacques tati': {
    grammar:'humanist-comic-observation',
    scale:0.45,
    audienceMode:'arthouse',
    stylization:0.40,
    pacingPhilosophy:'measured',
    ambiguity:0.28
  },

  'leos carax': {
    grammar:'romantic-poeticism',
    scale:0.65,
    audienceMode:'arthouse',
    stylization:0.82,
    pacingPhilosophy:'volatile',
    ambiguity:0.72
  },

  'agnes varda': {
    grammar:'observational-realism',
    scale:0.45,
    audienceMode:'arthouse',
    stylization:0.18,
    pacingPhilosophy:'measured',
    ambiguity:0.42
  },

  'gaspar noe': {
    grammar:'surreal-nightmare',
    scale:0.75,
    audienceMode:'arthouse',
    stylization:0.92,
    pacingPhilosophy:'volatile',
    ambiguity:0.68
  },

  // ── Italian Cinema ─────────────────────────────────────
  'federico fellini': {
    grammar:'surreal-humanism',
    scale:0.72,
    audienceMode:'arthouse',
    stylization:0.88,
    pacingPhilosophy:'dreamlike',
    ambiguity:0.72
  },

  'michelangelo antonioni': {
    grammar:'transcendental-minimalism',
    scale:0.42,
    audienceMode:'arthouse',
    stylization:0.20,
    pacingPhilosophy:'slow',
    ambiguity:0.82
  },

  'vittorio de sica': {
    grammar:'observational-realism',
    scale:0.52,
    audienceMode:'arthouse',
    stylization:0.15,
    pacingPhilosophy:'measured',
    ambiguity:0.35
  },

  'dario argento': {
    grammar:'psychological-dread',
    scale:0.68,
    audienceMode:'cult',
    stylization:0.94,
    pacingPhilosophy:'volatile',
    ambiguity:0.55
  },

  'sergio leone': {
    grammar:'mythic-operatic',
    scale:0.92,
    audienceMode:'mainstream',
    stylization:0.85,
    pacingPhilosophy:'measured',
    ambiguity:0.30
  },

  // ── Chinese / HK / Taiwan Cinema ─────────────────────
  'hou hsiao-hsien': {
    grammar:'transcendental-minimalism',
    scale:0.38,
    audienceMode:'arthouse',
    stylization:0.18,
    pacingPhilosophy:'meditative',
    ambiguity:0.82
  },

  'edward yang': {
    grammar:'observational-realism',
    scale:0.48,
    audienceMode:'arthouse',
    stylization:0.22,
    pacingPhilosophy:'measured',
    ambiguity:0.62
  },

  'jia zhangke': {
    grammar:'political-fracture',
    scale:0.52,
    audienceMode:'arthouse',
    stylization:0.28,
    pacingPhilosophy:'slow',
    ambiguity:0.72
  },

  'bi gan': {
    grammar:'surreal-humanism',
    scale:0.55,
    audienceMode:'arthouse',
    stylization:0.82,
    pacingPhilosophy:'dreamlike',
    ambiguity:0.92
  },

  'john woo': {
    grammar:'mythic-operatic',
    scale:0.92,
    audienceMode:'mainstream',
    stylization:0.88,
    pacingPhilosophy:'kinetic',
    ambiguity:0.22
  },

  'tsui hark': {
    grammar:'mythic-operatic',
    scale:0.95,
    audienceMode:'mainstream',
    stylization:0.92,
    pacingPhilosophy:'kinetic',
    ambiguity:0.28
  },

  'ann hui': {
    grammar:'observational-realism',
    scale:0.42,
    audienceMode:'arthouse',
    stylization:0.15,
    pacingPhilosophy:'measured',
    ambiguity:0.48
  },

  'fruit chan': {
    grammar:'political-fracture',
    scale:0.58,
    audienceMode:'arthouse',
    stylization:0.45,
    pacingPhilosophy:'volatile',
    ambiguity:0.62
  },

  'zhang yimou': {
    grammar:'mythic-operatic',
    scale:0.85,
    audienceMode:'arthouse',
    stylization:0.72,
    pacingPhilosophy:'measured',
    ambiguity:0.42
  },
};

// Archetype → default grammar (for unknown directors)
const ARCHETYPE_GRAMMAR_MAP = {
  'Ethical Humanism & Moral Epic Realism':          'observational-realism',
  'Contemplative Austerity & Poetic Observation':  'contemplative-minimalism',
  'Visceral Stylization & Cinematic Violence':      'visceral-kinetic',
  'Humanist Realism & Social Observationalism':     'observational-realism',
  'Classical Humanism & Redemptive Drama':          'classical-narrative',
  'Spectacle Philosophy & Epic Cinematic Grammar':  'mythic-operatic',
  'Gothic Fantasy & Surreal/Atmospheric Horror':    'psychological-dread',
  'Poetic Melancholy & Romantic Sensualism':        'lyrical-sensory',
  'Existential Absurdity & Satirical Cruelty':      'absurdist-satirical',
  'Whimsical Melodrama & Stylized Eccentricity':    'lyrical-sensory',
  'Visionary Animation & Speculative Worlds':       'classical-narrative',
  'Contemporary Auteur':                            'genre-hybrid',
};

export const getDirectorWorldview = (name = '', archetype = '', dna = {}) => {
  const clean = cleanName(name);
  const cleanId = norm(name);

  // 1. Check curated seed map first for human-level precision
  if (SEED_WORLDVIEW_MAP[cleanId]) return SEED_WORLDVIEW_MAP[cleanId];
  if (SEED_WORLDVIEW_MAP[clean]) return SEED_WORLDVIEW_MAP[clean];

  // 2. Algorithmic fallback
  let erh = 0.5;
  let opd = 0.5;

  const arch = archetype || getAuteurArchetype({ id: cleanId, name });

  // Baseline scoring by archetype
  if (arch === 'Humanist Realism & Social Observationalism' || arch === 'Classical Humanism & Redemptive Drama') {
    erh = 0.85;
    opd = 0.25;
  } else if (arch === 'Contemplative Austerity & Poetic Observation' || arch === 'Poetic Melancholy & Romantic Sensualism') {
    erh = 0.75;
    opd = 0.35;
  } else if (arch === 'Visionary Animation & Speculative Worlds') {
    erh = 0.80;
    opd = 0.30;
  } else if (arch === 'Gothic Fantasy & Surreal/Atmospheric Horror') {
    erh = 0.20;
    opd = 0.85;
  } else if (arch === 'Visceral Stylization & Cinematic Violence') {
    erh = 0.25;
    opd = 0.80;
  } else if (arch === 'Existential Absurdity & Satirical Cruelty') {
    erh = 0.30;
    opd = 0.75;
  } else if (arch === 'Whimsical Melodrama & Stylized Eccentricity') {
    erh = 0.70;
    opd = 0.35;
  } else if (arch === 'Spectacle Philosophy & Epic Cinematic Grammar') {
    erh = 0.60;
    opd = 0.50;
  }

  // Refine by DNA tone if present
  if (dna && dna.tone) {
    if (dna.tone === 'dark') {
      opd = Math.min(0.95, opd + 0.15);
      erh = Math.max(0.05, erh - 0.15);
    } else if (dna.tone === 'lighthearted') {
      erh = Math.min(0.95, erh + 0.15);
      opd = Math.max(0.05, opd - 0.15);
    }
  }

  // Refine by DNA genre distribution
  if (dna && dna.genres) {
    const totalGenres = Object.values(dna.genres).reduce((a, b) => a + b, 0);
    if (totalGenres > 0) {
      const erhCount = (dna.genres[18] || 0) + (dna.genres[35] || 0) + (dna.genres[10751] || 0) + (dna.genres[10749] || 0);
      const opdCount = (dna.genres[27] || 0) + (dna.genres[53] || 0) + (dna.genres[80] || 0);

      const erhRatio = erhCount / totalGenres;
      const opdRatio = opdCount / totalGenres;

      erh = Math.min(0.95, Math.max(0.05, erh + (erhRatio - opdRatio) * 0.25));
      opd = Math.min(0.95, Math.max(0.05, opd + (opdRatio - erhRatio) * 0.25));
    }
  }

  const primary = erh > opd ? 'ERH' : (opd > erh ? 'OPD' : 'NEUTRAL');
  const secondary = Math.abs(erh - opd) < 0.2 ? (primary === 'ERH' ? 'OPD' : 'ERH') : 'NEUTRAL';
  const confidence = dna && dna.totalFilms > 3 ? 'medium' : 'low';

  return { erh, opd, primary, secondary, confidence };
};

// ─── Cinematic Profile Upgrades (9-Dimensional Ontology) ──────────────────────

const defaultWorldviewMap = {
  'contemplative-minimalism': 'existential',
  'observational-realism': 'humanist',
  'classical-narrative': 'humanist',
  'mythic-operatic': 'humanist',
  'visceral-kinetic': 'existential',
  'psychological-dread': 'existential',
  'absurdist-satirical': 'satirical',
  'lyrical-sensory': 'humanist',
  'genre-hybrid': 'existential',
};

const defaultViolenceTreatmentMap = {
  'contemplative-minimalism': 'none',
  'observational-realism': 'unembellished-realist',
  'classical-narrative': 'none',
  'mythic-operatic': 'spectacle',
  'visceral-kinetic': 'exploitation',
  'psychological-dread': 'horror',
  'absurdist-satirical': 'unembellished-realist',
  'lyrical-sensory': 'none',
  'genre-hybrid': 'tragedy',
};

const defaultEmotionalIntentMap = {
  'contemplative-minimalism': 'melancholic-longing',
  'observational-realism': 'restorative-warmth',
  'classical-narrative': 'cathartic-resolution',
  'mythic-operatic': 'cathartic-resolution',
  'visceral-kinetic': 'oppressive-dread',
  'psychological-dread': 'oppressive-dread',
  'absurdist-satirical': 'cerebral-alienation',
  'lyrical-sensory': 'melancholic-longing',
  'genre-hybrid': 'cathartic-resolution',
};

const defaultViewerExperienceMap = {
  'contemplative-minimalism': 'meditative-spiritual',
  'observational-realism': 'empathetic-emotional',
  'classical-narrative': 'empathetic-emotional',
  'mythic-operatic': 'visceral-kinetic',
  'visceral-kinetic': 'visceral-kinetic',
  'psychological-dread': 'intellectual-philosophical',
  'absurdist-satirical': 'intellectual-philosophical',
  'lyrical-sensory': 'meditative-spiritual',
  'genre-hybrid': 'empathetic-emotional',
};

const SEED_SEMANTIC_OVERRIDES = {
  'akira kurosawa': { worldview: 'humanist', violenceTreatment: 'tragedy', emotionalIntent: 'cathartic-resolution', viewerExperience: 'empathetic-emotional' },
  'satyajit ray': { worldview: 'humanist', violenceTreatment: 'tragedy', emotionalIntent: 'restorative-warmth', viewerExperience: 'empathetic-emotional' },
  'hirokazu kore eda': { worldview: 'humanist', violenceTreatment: 'none', emotionalIntent: 'restorative-warmth', viewerExperience: 'empathetic-emotional' },
  'hirokazu kore-eda': { worldview: 'humanist', violenceTreatment: 'none', emotionalIntent: 'restorative-warmth', viewerExperience: 'empathetic-emotional' },
  'hirokazu koreeda': { worldview: 'humanist', violenceTreatment: 'none', emotionalIntent: 'restorative-warmth', viewerExperience: 'empathetic-emotional' },
  'yasujiro ozu': { worldview: 'humanist', violenceTreatment: 'none', emotionalIntent: 'restorative-warmth', viewerExperience: 'meditative-spiritual' },
  'yasujirō ozu': { worldview: 'humanist', violenceTreatment: 'none', emotionalIntent: 'restorative-warmth', viewerExperience: 'meditative-spiritual' },
  'ss rajamouli': { worldview: 'humanist', violenceTreatment: 'spectacle', emotionalIntent: 'cathartic-resolution', viewerExperience: 'visceral-kinetic' },
  's s rajamouli': { worldview: 'humanist', violenceTreatment: 'spectacle', emotionalIntent: 'cathartic-resolution', viewerExperience: 'visceral-kinetic' },
  'peter jackson': { worldview: 'humanist', violenceTreatment: 'spectacle', emotionalIntent: 'cathartic-resolution', viewerExperience: 'visceral-kinetic' },
  'james cameron': { worldview: 'humanist', violenceTreatment: 'spectacle', emotionalIntent: 'cathartic-resolution', viewerExperience: 'visceral-kinetic' },
  'ridley scott': { worldview: 'existential', violenceTreatment: 'spectacle', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'steven spielberg': { worldview: 'humanist', violenceTreatment: 'tragedy', emotionalIntent: 'cathartic-resolution', viewerExperience: 'empathetic-emotional' },
  'denis villeneuve': { worldview: 'existential', violenceTreatment: 'tragedy', emotionalIntent: 'oppressive-dread', viewerExperience: 'intellectual-philosophical' },
  'christopher nolan': { worldview: 'existential', violenceTreatment: 'spectacle', emotionalIntent: 'cathartic-resolution', viewerExperience: 'intellectual-philosophical' },
  'stanley kubrick': { worldview: 'nihilistic', violenceTreatment: 'exploitation', emotionalIntent: 'cerebral-alienation', viewerExperience: 'intellectual-philosophical' },
  'david fincher': { worldview: 'nihilistic', violenceTreatment: 'horror', emotionalIntent: 'oppressive-dread', viewerExperience: 'intellectual-philosophical' },
  'ari aster': { worldview: 'nihilistic', violenceTreatment: 'horror', emotionalIntent: 'oppressive-dread', viewerExperience: 'intellectual-philosophical' },
  'jordan peele': { worldview: 'satirical', violenceTreatment: 'horror', emotionalIntent: 'oppressive-dread', viewerExperience: 'intellectual-philosophical' },
  'hideo nakata': { worldview: 'existential', violenceTreatment: 'horror', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'james wan': { worldview: 'existential', violenceTreatment: 'horror', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'eli roth': { worldview: 'nihilistic', violenceTreatment: 'exploitation', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'michael bay': { worldview: 'nihilistic', violenceTreatment: 'spectacle', emotionalIntent: 'cathartic-resolution', viewerExperience: 'visceral-kinetic' },
  'roland emmerich': { worldview: 'nihilistic', violenceTreatment: 'spectacle', emotionalIntent: 'cathartic-resolution', viewerExperience: 'visceral-kinetic' },
  'mike flanagan': { worldview: 'humanist', violenceTreatment: 'horror', emotionalIntent: 'cathartic-resolution', viewerExperience: 'empathetic-emotional' },
  'david lynch': { worldview: 'existential', violenceTreatment: 'horror', emotionalIntent: 'oppressive-dread', viewerExperience: 'meditative-spiritual' },
  'gaspar noe': { worldview: 'nihilistic', violenceTreatment: 'exploitation', emotionalIntent: 'existential-despair', viewerExperience: 'visceral-kinetic' },
  'gaspar noé': { worldview: 'nihilistic', violenceTreatment: 'exploitation', emotionalIntent: 'existential-despair', viewerExperience: 'visceral-kinetic' },
  'lars von trier': { worldview: 'nihilistic', violenceTreatment: 'exploitation', emotionalIntent: 'existential-despair', viewerExperience: 'intellectual-philosophical' },
  'michael haneke': { worldview: 'nihilistic', violenceTreatment: 'unembellished-realist', emotionalIntent: 'cerebral-alienation', viewerExperience: 'intellectual-philosophical' },
  'yorgos lanthimos': { worldview: 'satirical', violenceTreatment: 'unembellished-realist', emotionalIntent: 'cerebral-alienation', viewerExperience: 'intellectual-philosophical' },
  'ruben ostlund': { worldview: 'satirical', violenceTreatment: 'unembellished-realist', emotionalIntent: 'cerebral-alienation', viewerExperience: 'intellectual-philosophical' },
  'ruben östlund': { worldview: 'satirical', violenceTreatment: 'unembellished-realist', emotionalIntent: 'cerebral-alienation', viewerExperience: 'intellectual-philosophical' },
  'roy andersson': { worldview: 'satirical', violenceTreatment: 'none', emotionalIntent: 'cerebral-alienation', viewerExperience: 'meditative-spiritual' },
  'bong joon ho': { worldview: 'satirical', violenceTreatment: 'tragedy', emotionalIntent: 'cerebral-alienation', viewerExperience: 'intellectual-philosophical' },
  'martin scorsese': { worldview: 'existential', violenceTreatment: 'tragedy', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'quentin tarantino': { worldview: 'nihilistic', violenceTreatment: 'exploitation', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'park chan wook': { worldview: 'existential', violenceTreatment: 'exploitation', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'na hong jin': { worldview: 'nihilistic', violenceTreatment: 'exploitation', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'kim jee woon': { worldview: 'existential', violenceTreatment: 'exploitation', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'ryoo seung wan': { worldview: 'existential', violenceTreatment: 'spectacle', emotionalIntent: 'cathartic-resolution', viewerExperience: 'visceral-kinetic' },
  'john woo': { worldview: 'humanist', violenceTreatment: 'spectacle', emotionalIntent: 'cathartic-resolution', viewerExperience: 'visceral-kinetic' },
  'johnnie to': { worldview: 'existential', violenceTreatment: 'spectacle', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'anurag kashyap': { worldview: 'existential', violenceTreatment: 'exploitation', emotionalIntent: 'oppressive-dread', viewerExperience: 'visceral-kinetic' },
  'vetrimaaran': { worldview: 'existential', violenceTreatment: 'tragedy', emotionalIntent: 'oppressive-dread', viewerExperience: 'empathetic-emotional' },
  'asghar farhadi': { worldview: 'humanist', violenceTreatment: 'unembellished-realist', emotionalIntent: 'restorative-warmth', viewerExperience: 'empathetic-emotional' },
  'jafar panahi': { worldview: 'humanist', violenceTreatment: 'unembellished-realist', emotionalIntent: 'restorative-warmth', viewerExperience: 'empathetic-emotional' },
  'abbas kiarostami': { worldview: 'humanist', violenceTreatment: 'none', emotionalIntent: 'restorative-warmth', viewerExperience: 'meditative-spiritual' },
  'lee chang dong': { worldview: 'humanist', violenceTreatment: 'tragedy', emotionalIntent: 'existential-despair', viewerExperience: 'empathetic-emotional' },
  'lee chang-dong': { worldview: 'humanist', violenceTreatment: 'tragedy', emotionalIntent: 'existential-despair', viewerExperience: 'empathetic-emotional' },
  'frank darabont': { worldview: 'humanist', violenceTreatment: 'tragedy', emotionalIntent: 'cathartic-resolution', viewerExperience: 'empathetic-emotional' },
  'rob reiner': { worldview: 'humanist', violenceTreatment: 'none', emotionalIntent: 'restorative-warmth', viewerExperience: 'empathetic-emotional' },
  'frank capra': { worldview: 'humanist', violenceTreatment: 'none', emotionalIntent: 'restorative-warmth', viewerExperience: 'empathetic-emotional' },
  'giuseppe tornatore': { worldview: 'humanist', violenceTreatment: 'none', emotionalIntent: 'restorative-warmth', viewerExperience: 'empathetic-emotional' }
};

const inferBaseCinematicProfile = (name, arch, dna) => {
  const grammar = ARCHETYPE_GRAMMAR_MAP[arch] || 'genre-hybrid';

  // Scale: epic genres vs intimate genres
  const epicCount    = [28,12,10752,14,878].reduce((s,g) => s + (dna.genres?.[g]||0), 0);
  const intimateCount= [18,10749,99].reduce((s,g)       => s + (dna.genres?.[g]||0), 0);
  const scaleDenom   = epicCount + intimateCount || 1;
  let scale = Math.max(0.05, Math.min(0.95, epicCount / scaleDenom));
  if (arch.includes('Epic') || arch.includes('Spectacle'))   scale = Math.max(0.60, scale);
  if (arch.includes('Realism') || arch.includes('Contemplative') || arch.includes('Humanism')) scale = Math.min(0.40, scale);

  // AudienceMode
  const commCount = [28,35,12,14,878,10751].reduce((s,g) => s + (dna.genres?.[g]||0), 0);
  const commRatio = dna.totalFilms > 0 ? commCount / dna.totalFilms : 0;
  const arthouseArch = arch.includes('Contemplative') || arch.includes('Existential');
  let audienceMode;
  if      (commRatio > 0.50)                              audienceMode = 'commercial';
  else if (arthouseArch || (commRatio < 0.25 && dna.pacing === 'slow-burn')) audienceMode = 'arthouse';
  else                                                    audienceMode = 'crossover';

  // PacingPhilosophy from DNA
  const pacingPhilosophy = dna.pacing === 'kinetic' ? 'kinetic' : dna.pacing === 'slow-burn' ? 'meditative' : 'measured';

  // Stylization
  const styMap = { 'visceral-kinetic':0.70, 'mythic-operatic':0.70, 'psychological-dread':0.70,
                   'lyrical-sensory':0.70, 'absurdist-satirical':0.45, 'genre-hybrid':0.50,
                   'contemplative-minimalism':0.30, 'classical-narrative':0.30, 'observational-realism':0.15 };
  let stylization = styMap[grammar] ?? 0.40;
  if (dna.tone === 'dark') stylization = Math.min(0.90, stylization + 0.15);

  // Ambiguity
  const ambMap = { 'contemplative-minimalism':0.70, 'absurdist-satirical':0.70, 'psychological-dread':0.55,
                   'lyrical-sensory':0.60, 'observational-realism':0.45, 'genre-hybrid':0.45,
                   'visceral-kinetic':0.40, 'mythic-operatic':0.25, 'classical-narrative':0.15 };
  let ambiguity = ambMap[grammar] ?? 0.40;
  ambiguity += (dna.genres?.[9648] || 0) / Math.max(dna.totalFilms||1, 1) * 0.20;
  ambiguity = Math.max(0.05, Math.min(0.95, ambiguity));

  return { grammar, scale, audienceMode, stylization, pacingPhilosophy, ambiguity };
};

export const getCinematicProfile = (name = '', archetype = '', dna = {}) => {
  const cleanId = norm(name);
  const clean = cleanName(name);

  let base = null;
  if (SEED_CINEMATIC_PROFILE_MAP[cleanId]) base = { ...SEED_CINEMATIC_PROFILE_MAP[cleanId] };
  else if (SEED_CINEMATIC_PROFILE_MAP[clean])   base = { ...SEED_CINEMATIC_PROFILE_MAP[clean] };

  const arch = archetype || getAuteurArchetype({ name });

  if (!base) {
    base = inferBaseCinematicProfile(name, arch, dna);
  }

  const wv = getDirectorWorldview(name, arch, dna);

  const grammar = base.grammar || 'genre-hybrid';
  const realismVsStylization = base.stylization ?? base.realismVsStylization ?? 0.40;
  const spectacleVsIntimacy = base.scale ?? base.spectacleVsIntimacy ?? 0.50;
  
  const pacingPsychology = base.pacingPhilosophy === 'kinetic' ? 'kinetic-hyper' 
                         : base.pacingPhilosophy === 'meditative' ? 'meditative-transcendental' 
                         : 'deliberate-measured';
  
  const catharsisVsDread = wv.erh;
  const audienceMode = base.audienceMode || 'crossover';
  const ambiguity = base.ambiguity ?? 0.40;

  let worldview = defaultWorldviewMap[grammar];
  if (wv.primary === 'ERH' && wv.erh > 0.85) worldview = 'humanist';
  if (wv.primary === 'OPD' && wv.opd > 0.90) worldview = 'nihilistic';

  let violenceTreatment = defaultViolenceTreatmentMap[grammar];
  let emotionalIntent = defaultEmotionalIntentMap[grammar];
  let viewerExperience = defaultViewerExperienceMap[grammar];

  const cleanNameVal = cleanName(name);
  if (SEED_SEMANTIC_OVERRIDES[cleanNameVal]) {
    const ov = SEED_SEMANTIC_OVERRIDES[cleanNameVal];
    if (ov.worldview) worldview = ov.worldview;
    if (ov.violenceTreatment) violenceTreatment = ov.violenceTreatment;
    if (ov.emotionalIntent) emotionalIntent = ov.emotionalIntent;
    if (ov.viewerExperience) viewerExperience = ov.viewerExperience;
  }

  return {
    name,
    archetype: arch,
    dna,
    grammar,
    realismVsStylization,
    spectacleVsIntimacy,
    pacingPsychology,
    catharsisVsDread,
    audienceMode,
    ambiguity,
    worldview,
    violenceTreatment,
    emotionalIntent,
    viewerExperience
  };
};

// ─── Grammar Compatibility Matrix ─────────────────────────────────────────────

const GRAMMAR_ADJACENCY = {
  'classical-narrative':     { adjacent:['observational-realism','mythic-operatic','lyrical-sensory','genre-hybrid'],      opposing:['psychological-dread','absurdist-satirical','contemplative-minimalism'] },
  'observational-realism':   { adjacent:['classical-narrative','contemplative-minimalism','lyrical-sensory','genre-hybrid'], opposing:['visceral-kinetic','psychological-dread','mythic-operatic'] },
  'contemplative-minimalism':{ adjacent:['observational-realism','lyrical-sensory','absurdist-satirical','genre-hybrid'],    opposing:['visceral-kinetic','mythic-operatic','classical-narrative'] },
  'mythic-operatic':         { adjacent:['classical-narrative','visceral-kinetic','genre-hybrid'],                           opposing:['observational-realism','contemplative-minimalism','absurdist-satirical'] },
  'visceral-kinetic':        { adjacent:['mythic-operatic','psychological-dread','genre-hybrid'],                            opposing:['contemplative-minimalism','observational-realism','classical-narrative'] },
  'psychological-dread':     { adjacent:['visceral-kinetic','absurdist-satirical','lyrical-sensory','genre-hybrid'],         opposing:['classical-narrative','observational-realism','mythic-operatic'] },
  'absurdist-satirical':     { adjacent:['contemplative-minimalism','psychological-dread','genre-hybrid','lyrical-sensory'], opposing:['classical-narrative','mythic-operatic','visceral-kinetic'] },
  'lyrical-sensory':         { adjacent:['contemplative-minimalism','observational-realism','classical-narrative','psychological-dread','genre-hybrid'], opposing:['visceral-kinetic','mythic-operatic'] },
  'genre-hybrid':            { adjacent:['classical-narrative','observational-realism','mythic-operatic','visceral-kinetic','psychological-dread','absurdist-satirical','lyrical-sensory','contemplative-minimalism'], opposing:[] },
};

const scoreGrammarCompatibility = (srcG, candG) => {
  if (!srcG || !candG) return 0;
  if (srcG === candG) return 35;
  const info = GRAMMAR_ADJACENCY[srcG];
  if (!info) return 0;
  if (info.adjacent.includes(candG)) return 10;
  if (info.opposing.includes(candG)) return -45;
  return 0;
};

const inferCinematicGrammar = (dna = {}) => {
  return dna.grammar || 'genre-hybrid';
};

const getStorytellingAxis = (
  directorName,
  archetype,
  dna = {}
) => {
  const clean = cleanName(directorName || '');
  const profile =
    SEED_WORLDVIEW_MAP[clean];

  if (profile?.primary) {
    return profile.primary;
  }

  const grammar =
    dna.grammar ||
    inferCinematicGrammar(dna);

  const tone =
    dna.tone ||
    'balanced';

  // Horror / dread
  if (
    grammar === 'psychological-dread' ||
    grammar === 'surreal-nightmare'
  ) {
    return 'OPD';
  }

  // Spiritual / transcendental
  if (
    grammar === 'transcendental-minimalism' ||
    grammar === 'spiritual-realism'
  ) {
    return 'EMS';
  }

  // Romantic longing
  if (
    grammar === 'romantic-poeticism'
  ) {
    return 'RML';
  }

  // Political realism
  if (
    grammar === 'observational-realism' &&
    tone === 'political'
  ) {
    return 'PPR';
  }

  // Absurd alienation
  if (
    grammar === 'absurdist-fracture'
  ) {
    return 'AEA';
  }

  // Mythic tragic grandeur
  if (
    grammar === 'mythic-operatic'
  ) {
    return 'MHT';
  }

  // Humanist realism
  if (
    grammar === 'observational-realism'
  ) {
    return 'ERH';
  }

  return 'ERH';
};

export const isOntologicallyIncompatible = (src, cand) => {
  if (!src || !cand) return false;

  // 1. philosophical realism <-> psychological horror
  if ((src.grammar === 'observational-realism' && cand.grammar === 'psychological-dread') ||
      (cand.grammar === 'observational-realism' && src.grammar === 'psychological-dread')) {
    return true;
  }

  // 2. humanist tragedy <-> oppressive dread
  const isHumanistTragedy1 = src.worldview === 'humanist' && src.violenceTreatment === 'tragedy';
  const isHumanistTragedy2 = cand.worldview === 'humanist' && cand.violenceTreatment === 'tragedy';
  
  const isOppressiveDread1 = cand.emotionalIntent === 'oppressive-dread' || cand.grammar === 'psychological-dread';
  const isOppressiveDread2 = src.emotionalIntent === 'oppressive-dread' || src.grammar === 'psychological-dread';

  if ((isHumanistTragedy1 && isOppressiveDread1) || (isHumanistTragedy2 && isOppressiveDread2)) {
    return true;
  }

  // 3. ethical realism <-> supernatural horror
  if ((src.grammar === 'observational-realism' && cand.violenceTreatment === 'horror') ||
      (cand.grammar === 'observational-realism' && src.violenceTreatment === 'horror')) {
    return true;
  }

  // 4. restrained epic realism <-> uncanny terror grammar
  const isRestrainedEpic1 = (src.grammar === 'mythic-operatic' || src.grammar === 'classical-narrative') && src.worldview === 'humanist';
  const isRestrainedEpic2 = (cand.grammar === 'mythic-operatic' || cand.grammar === 'classical-narrative') && cand.worldview === 'humanist';

  const isUncannyTerror1 = cand.grammar === 'psychological-dread' || cand.violenceTreatment === 'horror';
  const isUncannyTerror2 = src.grammar === 'psychological-dread' || src.violenceTreatment === 'horror';

  if ((isRestrainedEpic1 && isUncannyTerror1) || (isRestrainedEpic2 && isUncannyTerror2)) {
    return true;
  }

  // 5. visceral kinetic stylization <-> psychological horror/dread
  if ((src.grammar === 'visceral-kinetic' && cand.grammar === 'psychological-dread') ||
      (cand.grammar === 'visceral-kinetic' && src.grammar === 'psychological-dread')) {
    return true;
  }

  const a = getStorytellingAxis(src.name, src.archetype, { ...src.dna, ...src });
  const b = getStorytellingAxis(cand.name, cand.archetype, { ...cand.dna, ...cand });

  if (
    (a === 'EMS' && b === 'OPD') ||
    (a === 'OPD' && b === 'EMS')
  ) return true;

  if (
    (a === 'RML' && b === 'OPD') ||
    (a === 'OPD' && b === 'RML')
  ) return true;

  if (
    (a === 'AEA' && b === 'ERH') ||
    (a === 'ERH' && b === 'AEA')
  ) return true;

  return false;
};

export const scoreCinematicAlignment = (src, cand) => {
  if (!src || !cand) return 0;
  let s = 0;

  s += scoreGrammarCompatibility(src.grammar, cand.grammar);

  if (typeof src.spectacleVsIntimacy === 'number' && typeof cand.spectacleVsIntimacy === 'number') {
    s += (1 - Math.abs(src.spectacleVsIntimacy - cand.spectacleVsIntimacy)) * 20;
  }

  if (typeof src.realismVsStylization === 'number' && typeof cand.realismVsStylization === 'number') {
    s += (1 - Math.abs(src.realismVsStylization - cand.realismVsStylization)) * 15;
  }

  if (typeof src.catharsisVsDread === 'number' && typeof cand.catharsisVsDread === 'number') {
    s += (1 - Math.abs(src.catharsisVsDread - cand.catharsisVsDread)) * 15;
  }

  if (typeof src.ambiguity === 'number' && typeof cand.ambiguity === 'number') {
    s += (1 - Math.abs(src.ambiguity - cand.ambiguity)) * 10;
  }

  if (src.audienceMode && cand.audienceMode) {
    if (src.audienceMode === cand.audienceMode)                              s += 20;
    else if (src.audienceMode === 'crossover' || cand.audienceMode === 'crossover') s += 8;
    else                                                                     s -= 15;
  }

  if (src.pacingPsychology && cand.pacingPsychology) {
    if (src.pacingPsychology === cand.pacingPsychology) s += 15;
    else if ((src.pacingPsychology === 'kinetic-hyper' && cand.pacingPsychology === 'meditative-transcendental') ||
             (src.pacingPsychology === 'meditative-transcendental' && cand.pacingPsychology === 'kinetic-hyper')) {
      s -= 25;
    }
  }

  if (src.viewerExperience && cand.viewerExperience) {
    if (src.viewerExperience === cand.viewerExperience) {
      s += 15;
    } else if ((src.viewerExperience === 'visceral-kinetic' && cand.viewerExperience === 'meditative-spiritual') ||
               (src.viewerExperience === 'meditative-spiritual' && cand.viewerExperience === 'visceral-kinetic')) {
      s -= 15;
    } else {
      s += 5;
    }
  }

  if (src.emotionalIntent && cand.emotionalIntent) {
    if (src.emotionalIntent === cand.emotionalIntent) s += 15;
    else s -= 10;
  }

  // ── Deep Philosophical & Ontological Penalties ──
  
  if (src.worldview && cand.worldview) {
    if ((src.worldview === 'humanist' && cand.worldview === 'nihilistic') ||
        (src.worldview === 'nihilistic' && cand.worldview === 'humanist')) {
      s -= 40;
    }
  }

  if (src.violenceTreatment && cand.violenceTreatment) {
    if (src.violenceTreatment !== cand.violenceTreatment) {
      const v1 = src.violenceTreatment;
      const v2 = cand.violenceTreatment;
      
      if ((v1 === 'tragedy' && (v2 === 'spectacle' || v2 === 'exploitation')) ||
          (v2 === 'tragedy' && (v1 === 'spectacle' || v1 === 'exploitation'))) {
        s -= 40;
      }
      
      if ((v1 === 'unembellished-realist' && v2 === 'exploitation') ||
          (v2 === 'unembellished-realist' && v1 === 'exploitation')) {
        s -= 40;
      }
      
      if ((v1 === 'horror' && v2 === 'none') ||
          (v2 === 'horror' && v1 === 'none')) {
        s -= 25;
      }
    }
  }

  if (isOntologicallyIncompatible(src, cand)) {
    s -= 200; // Hard semantic ontology penalty
  }

  return s;
};

export const scoreWorldviewAlignment = (srcWv, candWv) => {

  if (!srcWv || !candWv) return 0;

  let score = 0;

  // 1. Shared world-view alignment boost
  if (srcWv.primary === candWv.primary) {
    if (srcWv.primary === 'ERH') {
      // Proportional to the strength of shared humanism (up to +40)
      score += Math.min(srcWv.erh, candWv.erh) * 40;
    } else if (srcWv.primary === 'OPD') {
      // Proportional to the strength of shared dark tension (up to +30)
      score += Math.min(srcWv.opd, candWv.opd) * 30;
    }
  }

  // 2. Opposite worldview penalty
  // Proportional to opposite emotional poles product (up to -90)
  const opposeERHtoOPD = srcWv.erh * candWv.opd;
  const opposeOPDtoERH = srcWv.opd * candWv.erh;
  const penalty = Math.max(opposeERHtoOPD, opposeOPDtoERH) * 90;
  score -= penalty;

  return score;
};

// ─── DNA Computation ─────────────────────────────────────────────────────────

export const computeDirectorDNA = (movies = []) => {
  const safeMovies = Array.isArray(movies) ? movies : [];
  const dna = {
    languages: {}, countries: {}, genres: {}, decades: {},
    totalFilms: safeMovies.length,
    confidence: safeMovies.length > 3 ? 'high' : (safeMovies.length > 0 ? 'medium' : 'low')
  };

  safeMovies.forEach(m => {
    if (!m) return;
    if (m.original_language) {
      dna.languages[m.original_language] = (dna.languages[m.original_language] || 0) + 1;
    }
    if (Array.isArray(m.origin_country)) {
      m.origin_country.forEach(c => { if (c) dna.countries[c] = (dna.countries[c] || 0) + 1; });
    }
    if (Array.isArray(m.genre_ids)) {
      m.genre_ids.forEach(gid => { if (gid) dna.genres[gid] = (dna.genres[gid] || 0) + 1; });
    }
    if (m.release_date && typeof m.release_date === 'string') {
      const decade = Math.floor(parseInt(m.release_date.split('-')[0]) / 10) * 10;
      if (!isNaN(decade)) dna.decades[decade] = (dna.decades[decade] || 0) + 1;
    }
  });

  // Primary language — the most-used one
  dna.primaryLanguage = Object.keys(dna.languages)
    .sort((a, b) => dna.languages[b] - dna.languages[a])[0] || 'en';

  // Ecosystem — use language-based bucket since country data from TMDB is unreliable
  dna.ecosystem = getEcosystem(dna.primaryLanguage);

  // Top genres sorted by frequency
  const sortedGenres = Object.keys(dna.genres)
    .sort((a, b) => dna.genres[b] - dna.genres[a])
    .map(Number);
  dna.topGenres = sortedGenres.slice(0, 4);

  // Pacing & tone from genre frequencies
  const kineticScore = (dna.genres[28] || 0) + (dna.genres[53] || 0) + (dna.genres[80] || 0);
  const methodicScore = (dna.genres[18] || 0) + (dna.genres[36] || 0) + (dna.genres[99] || 0);
  const darkScore = (dna.genres[27] || 0) + (dna.genres[53] || 0) + (dna.genres[80] || 0);
  const lightScore = (dna.genres[35] || 0) + (dna.genres[10751] || 0) + (dna.genres[10749] || 0);

  dna.pacing = kineticScore > methodicScore
    ? 'kinetic' : (methodicScore > kineticScore * 2 ? 'slow-burn' : 'methodical');
  dna.tone = darkScore > lightScore
    ? 'dark' : (lightScore > darkScore ? 'lighthearted' : 'balanced');

  return dna;
};

// ─── Director Profile ─────────────────────────────────────────────────────────

export const getDirectorProfile = (name, movies = [], language = 'en') => {
  const safeName = name || 'Unknown Director';
  const safeMovies = Array.isArray(movies) ? movies : [];

  const dna = computeDirectorDNA(safeMovies);
  if (language && language !== 'en') dna.primaryLanguage = language;
  dna.ecosystem = resolveDirectorEcosystemMeta(safeName, {
    ...dna,
    ecosystem: getEcosystem(dna.primaryLanguage)
  }).canonical;

  const regionLabel = REGIONAL_LABELS[dna.primaryLanguage] || 'World';
  const archetype = getAuteurArchetype({ id: norm(safeName), name: safeName });

  const themes = [];
  if (dna.genres && dna.genres[18]) themes.push('Human Condition');
  if (dna.genres && dna.genres[28]) themes.push('Conflict');
  if (dna.genres && dna.genres[53]) themes.push('Tension');
  if (dna.genres && dna.genres[10749]) themes.push('Relationships');
  if (dna.genres && dna.genres[878]) themes.push('The Unknown');
  if (dna.genres && dna.genres[35]) themes.push('Absurdity');
  if (themes.length === 0) themes.push('Cinematic Expression');

  return {
    id: norm(safeName),
    name: safeName,
    language: dna.primaryLanguage,
    ecosystem: dna.ecosystem,
    ecosystemLabel: `${regionLabel} Cinema`,
    movement: 'contemporary',
    pacing: dna.pacing,
    tone: dna.tone,
    visualStyle: ['atmospheric', 'measured'],
    themes: themes.slice(0, 4),
    identity: archetype,
    signatureStyle: `Belongs to the cinematic lineage of ${archetype.toLowerCase()}.`,
    atmosphere: { 
      accent: '#7a8c9e', 
      glow: 'rgba(122,140,158,0.22)', 
      wash: 'rgba(32,42,52,0.74)', 
      mist: 'rgba(255,255,255,0.08)' 
    },
    dna
  };
};

// Backward compat
export const inferLanguageFromFilmography = (movies = [], fallback = 'en') => {
  try {
    return computeDirectorDNA(movies).primaryLanguage || fallback;
  } catch {
    return fallback;
  }
};

// ─── Discovery Bridge Scorer ─────────────────────────────────────────────────

const getDiscoveryBridgeScore = (sourceTags = [], candidateTags = []) => {
  let score = 0;
  sourceTags.forEach(tag => {
    const bridges = DISCOVERY_BRIDGES[tag] || [];
    bridges.forEach(bridge => {
      if (candidateTags.includes(bridge)) score += 14;
    });
  });
  return score;
};

// ─── Editorial Prose Generator ───────────────────────────────────────────────

const generateEditorialReason = (sourceWorldviews = [], candWorldviews = []) => {
  // Shared worldview tags = strongest signal
  const shared = sourceWorldviews.filter(t => candWorldviews.includes(t));
  const pool = shared.length ? shared : sourceWorldviews;

  const candidates = [];
  pool.forEach(tag => {
    if (PROSE_TEMPLATES[tag]) candidates.push(...PROSE_TEMPLATES[tag]);
  });

  if (!candidates.length) {
    return 'Their filmmaking philosophies occupy closely related emotional and cinematic territory.';
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
};

export const generateMatchReason = (sourceProfile, candProfile) => {
  try {
    const srcName  = sourceProfile?.name || 'this filmmaker';
    const candName = candProfile?.name   || 'this auteur';

    const srcWorldviews  = getWorldviewTags(srcName);
    const candWorldviews = getWorldviewTags(candName);

    // Primary: worldview-keyed editorial prose
    const editorialProse = generateEditorialReason(srcWorldviews, candWorldviews);
    if (editorialProse) return editorialProse;

    // Fallback: archetype-based prose
    const srcArchetype = getAuteurArchetype({ id: sourceProfile?.id, name: srcName });
    const candArchetype = getAuteurArchetype({ id: candProfile?.id, name: candName });
    const srcDetails  = ARCHETYPE_DETAILS[srcArchetype];
    const candDetails = ARCHETYPE_DETAILS[candArchetype];

    if (srcArchetype === candArchetype && srcDetails) {
      const templates = [
        `Kindred voices in ${srcDetails.tradition} — both explore ${srcDetails.territory} with a ${srcDetails.rhythm}.`,
        `Spiritually adjacent auteurs sharing a narrative obsession with ${srcDetails.territory}.`,
        `United by ${srcDetails.rhythm}, each constructs their visual grammar around ${srcDetails.territory}.`,
      ];
      return templates[(srcName.length + candName.length) % templates.length];
    }

    if (candDetails) {
      const candLang   = candProfile?.dna?.primaryLanguage || 'en';
      const candRegion = REGIONAL_LABELS[candLang] || 'World';
      const sameRegion = getEcosystemAffinity(
        resolveDirectorEcosystemMeta(srcName, sourceProfile?.dna || {}),
        resolveDirectorEcosystemMeta(candName, candProfile?.dna || {})
      ) >= 64;
      return sameRegion
        ? `Emerging from adjacent ${candRegion} cinematic soils, connected through ${candDetails.territory}.`
        : `Spiritually aligned across borders, exploring parallel visions of ${candDetails.territory}.`;
    }
  } catch (err) {
    console.error('[DirectorEngine] generateMatchReason error:', err);
  }
  return 'A thematic cross-border cinematic resonance.';
};


// ─── Main Discovery Engine ────────────────────────────────────────────────────


const REGIONAL_CINEMA_THRESHOLD = 60; // Strict dual gate for Closest Regional Voices

// 35B — Directors to mildly penalize for overexposure in mainstream recommendations
const OVEREXPOSED_DIRECTORS = [
  'christopher nolan', 'quentin tarantino', 'martin scorsese',
  'steven spielberg', 'david fincher', 'stanley kubrick'
];

export const getGroupedRecommendations = (sourceProfile, currentDirectorId, currentDirectorName = '', maxPerGroup = 4) => {
  const groups = { regional: [], relatives: [], global: [], unexpected: [] };

  try {
    const srcDna = sourceProfile?.dna;
    if (!srcDna) {
      console.warn('[DirectorEngine] Source profile has no DNA.');
      return normalizeRecommendationShape(groups);
    }

    const recommendationGraph = getRecommendationGraph();

    if (!recommendationGraph || recommendationGraph.length === 0) {
      console.warn('[DirectorEngine] recommendation graph is empty or missing.');
      return normalizeRecommendationShape(groups);
    }

    const currentNameNorm = norm(currentDirectorName);
    const currentNameCompact = compactName(currentDirectorName);
    const currentIdStr = String(currentDirectorId);

    const candidates = recommendationGraph
      .filter(c => {
        if (!c || !c.dna) return false;
        return norm(c.name) !== currentNameNorm &&
               compactName(c.name) !== currentNameCompact &&
               String(c.id) !== currentIdStr && 
               !sessionSeen.has(String(c.id));
      })
      .filter(c => c.dna && typeof c.dna === 'object' && c.dna.totalFilms > 0)
      .map(c => {
        const meta = resolveDirectorEcosystemMeta(c.name, c.dna);
        return {
          ...c,
          dna: {
            ...c.dna,
            ecosystem: meta.canonical,
            ecosystemFamily: meta.canonical,
            ecosystemFamilies: [...meta.families],
            ecosystemUmbrellas: [...meta.umbrellas],
            ecosystemKeys: [...meta.keys]
          }
        };
      });

    const srcEcoMeta = resolveDirectorEcosystemMeta(sourceProfile.name, srcDna);

    console.log(`[DirectorEngine] Source: ${sourceProfile.name} | ecosystem: ${srcEcoMeta.canonical} | lang: ${srcDna.primaryLanguage} | ${candidates.length} candidates`);

    const srcArchetype = getAuteurArchetype({ name: sourceProfile.name });
    const srcWv        = getDirectorWorldview(sourceProfile.name, srcArchetype, srcDna);
    const srcCinema    = getCinematicProfile(sourceProfile.name, srcArchetype, srcDna);

    // Pre-compute cinematic + worldview scores for every candidate once
    const enriched = candidates.map(c => {
      const cArch   = getAuteurArchetype({ name: c.name });
      const cWv     = getDirectorWorldview(c.name, cArch, c.dna);
      const cCinema = getCinematicProfile(c.name, cArch, c.dna);
      const cEcoMeta = resolveDirectorEcosystemMeta(c.name, c.dna);
      const cEco    = cEcoMeta.canonical;
      const wvScore = scoreWorldviewAlignment(srcWv, cWv);
      const ciScore = scoreCinematicAlignment(srcCinema, cCinema);
      const regionalAffinity = getEcosystemAffinity(srcEcoMeta, cEcoMeta);
      return {
        ...c,
        _cArch: cArch,
        _cEco: cEco,
        _ecoMeta: cEcoMeta,
        _regionalAffinity: regionalAffinity,
        _wvScore: wvScore,
        _ciScore: ciScore,
        _total: wvScore + ciScore + (regionalAffinity * 0.18)
      };
    });

    const usedIds        = new Set();
    const seenEcosystems = new Set(); // diversity stabilization
    const usedCountries  = new Set(); // 35A — country diversity cap
    const usedWorldviews = new Set(); // 35D — worldview saturation cap
    const maxVal  = typeof maxPerGroup === 'number' ? maxPerGroup : 4;

    // ── 1. CLOSEST REGIONAL VOICES  ────────────────────────────────────────────
    // Dual gate: same ecosystem, cinematic alignment ≥ threshold, and worldview alignment ≥ -30
    // with strict semantic exclusions (philosophy, grammar, and violence treatment must align)
    const regionalPool = enriched
      .filter(c => c._regionalAffinity > 0)
      .sort((a, b) => ((b._regionalAffinity * 4) + b._total) - ((a._regionalAffinity * 4) + a._total));
    const poolStats = getEcosystemPoolStats(srcEcoMeta, enriched);
    const regionalThreshold = getAdaptiveRegionalThreshold(poolStats);
    const worldviewFloor = getAdaptiveWorldviewFloor(poolStats);
    const getRegionalWorldviewFloorFor = (candidate, relaxed = false) => {
      let floor = relaxed ? worldviewFloor - 8 : worldviewFloor;
      if (candidate._regionalAffinity >= 82) floor = Math.min(floor, -78);
      else if (poolStats.isSparse && candidate._regionalAffinity >= 64) floor = Math.min(floor, -60);
      return floor;
    };

    const hasRegionalSemanticBlock = (candidate, strict = true) => {
      const cCinema = getCinematicProfile(candidate.name, candidate._cArch, candidate.dna);
      if (isOntologicallyIncompatible(srcCinema, cCinema)) return true;

      if (!strict) return false;

      if (GRAMMAR_ADJACENCY[srcCinema.grammar]?.opposing.includes(cCinema.grammar)) return true;

      if ((srcCinema.worldview === 'humanist' && cCinema.worldview === 'nihilistic') ||
          (srcCinema.worldview === 'nihilistic' && cCinema.worldview === 'humanist')) return true;

      if ((srcCinema.viewerExperience === 'visceral-kinetic' && cCinema.viewerExperience === 'meditative-spiritual') ||
          (srcCinema.viewerExperience === 'meditative-spiritual' && cCinema.viewerExperience === 'visceral-kinetic')) return true;

      const v1 = srcCinema.violenceTreatment;
      const v2 = cCinema.violenceTreatment;
      return (v1 === 'tragedy' && (v2 === 'spectacle' || v2 === 'exploitation')) ||
        (v2 === 'tragedy' && (v1 === 'spectacle' || v1 === 'exploitation'));
    };

    const regionalPass = regionalPool.filter(c => {
      // 1. Dual gate check
      if (c._ciScore < regionalThreshold || c._wvScore < getRegionalWorldviewFloorFor(c)) return false;

      // 2. Strict Semantic Exclusions (guarantees elite philosophical alignment)
      if (hasRegionalSemanticBlock(c, true)) return false;

      return true;
    }).sort((a, b) => ((b._regionalAffinity * 4) + b._total) - ((a._regionalAffinity * 4) + a._total));

    const regionalOver = regionalPool.filter(c => !regionalPass.includes(c));

    for (const c of regionalPass) {
      if (groups.regional.length >= maxVal) break;
      groups.regional.push(c);
      usedIds.add(String(c.tmdbId || c.id));
      seenEcosystems.add(c._cEco);
    }

    // Fallback: top up sparse regional graphs with same/adjacent ecosystem voices.
    const regionalTarget = poolStats.isSparse ? maxVal : Math.min(maxVal, 2);
    if (groups.regional.length < regionalTarget) {
      console.log('[DirectorEngine] Regional fallback: relaxing sparse-ecosystem threshold');
      for (const c of regionalPool) {
        if (groups.regional.length >= maxVal) break;
        if (usedIds.has(String(c.tmdbId || c.id))) continue;
        if (c._wvScore < getRegionalWorldviewFloorFor(c, true)) continue;
        if (hasRegionalSemanticBlock(c, false)) continue;

        groups.regional.push(c);
        usedIds.add(String(c.tmdbId || c.id));
        seenEcosystems.add(c._cEco);
      }
    }

    groups.regional.sort((a, b) => (
      ((b._regionalAffinity || 0) * 4 + (b._total || 0)) -
      ((a._regionalAffinity || 0) * 4 + (a._total || 0))
    ));


    // ── 2. EMOTIONAL & VISUAL RELATIVES ────────────────────────────────────────
    // Pool = regional overflow + ecosystem/worldview-routed cross-cinema candidates
    const crossEco = enriched.filter(c => c._regionalAffinity === 0);
    const relativesPool = [...regionalOver, ...crossEco]
      .filter(c => !usedIds.has(String(c.tmdbId || c.id)))
      .sort((a, b) => b._total - a._total);
    const ecosystemRepeatPenalty = poolStats.isSparse ? 8 : 18;
    const countryRepeatPenalty = poolStats.isSparse ? 3 : 8;
    const relativesThreshold = poolStats.isSparse ? -6 : 10;

    for (const c of relativesPool) {
      if (groups.relatives.length >= maxVal) break;
      const cWorldviews = getWorldviewTags(c.name);
      const worldviewSaturation = cWorldviews.filter(v => usedWorldviews.has(v)).length;
      const adjustedScore = c._total
        - (seenEcosystems.has(c._cEco) ? ecosystemRepeatPenalty : 0)
        - (worldviewSaturation * 4)
        - (usedCountries.has(c.dna?.primaryLanguage) ? countryRepeatPenalty : 0);
      if (adjustedScore >= relativesThreshold) {
        groups.relatives.push(c);
        usedIds.add(String(c.tmdbId || c.id));
        seenEcosystems.add(c._cEco);
        usedCountries.add(c.dna?.primaryLanguage);
        cWorldviews.forEach(v => usedWorldviews.add(v));
      }
    }
    if (groups.relatives.length === 0) {
      console.log('[DirectorEngine] Relatives fallback');
      for (const c of relativesPool.slice(0, maxVal)) {
        if (!usedIds.has(String(c.tmdbId || c.id))) {
          groups.relatives.push(c);
          usedIds.add(String(c.tmdbId || c.id));
        }
      }
    }

    // 35C — Discovery priority: small boost for obscure directors in global pool
    const globalPool = crossEco
      .filter(c => !usedIds.has(String(c.tmdbId || c.id)))
      .map(c => {
        const discoveryBoost = (c.dna?.popularity || 0) < 25 ? 6 : 0;
        const worldviewSaturation = getWorldviewTags(c.name).filter(v => usedWorldviews.has(v)).length;
        return { ...c, _globalScore: c._total + discoveryBoost - (worldviewSaturation * 4) };
      })
      .sort((a, b) => b._globalScore - a._globalScore);

    for (const c of globalPool) {
      if (groups.global.length >= maxVal) break;
      groups.global.push(c);
      usedIds.add(String(c.tmdbId || c.id));
      seenEcosystems.add(c._cEco);
      usedCountries.add(c.dna?.primaryLanguage);
      getWorldviewTags(c.name).forEach(v => usedWorldviews.add(v));
    }
    if (groups.global.length === 0) {
      for (const c of enriched.filter(c => !usedIds.has(String(c.tmdbId || c.id))).slice(0, maxVal)) {
        groups.global.push(c);
        usedIds.add(String(c.tmdbId || c.id));
      }
    }

    // ── 4. UNEXPECTED DISCOVERIES ──────────────────────────────────────────────
    // Bridge-score: rewards emotionally adjacent cross-cinema discovery
    // Randomness: prevents static outputs (+4 max, preserves ontology integrity)
    // Diversity cap: penalises repeated ecosystems (-25)
    const srcWorldviewsForBridge = getWorldviewTags(sourceProfile.name);
    const srcGrammarForBridge   = getGrammarTags(sourceProfile.name);

    const unexpectedPool = enriched
      .filter(c => !usedIds.has(String(c.tmdbId || c.id)))
      .map(c => {
        const grammarScore  = scoreGrammarCompatibility(srcCinema.grammar, c._ciScore >= 0 ? getCinematicProfile(c.name, c._cArch, c.dna).grammar : 'genre-hybrid');
        const candWorldviews = getWorldviewTags(c.name);
        const candGrammar    = getGrammarTags(c.name);
        const bridgeScore    = getDiscoveryBridgeScore([...srcWorldviewsForBridge, ...srcGrammarForBridge], [...candWorldviews, ...candGrammar]);
        const diversityPenalty = groups.unexpected.some(r => r._cEco === c._cEco) ? (poolStats.isSparse ? 12 : 25) : 0;
        const surpriseScore  = c._ciScore + c._wvScore + grammarScore + bridgeScore
                             - diversityPenalty
                             + (Math.random() * 4);
        return { ...c, _surpriseScore: surpriseScore };
      })
      .sort((a, b) => b._surpriseScore - a._surpriseScore);

    for (const c of unexpectedPool) {
      if (groups.unexpected.length >= maxVal) break;
      groups.unexpected.push(c);
      usedIds.add(String(c.tmdbId || c.id));
    }
    if (groups.unexpected.length === 0) {
      for (const c of enriched.filter(c => !usedIds.has(String(c.tmdbId || c.id))).slice(0, maxVal)) {
        groups.unexpected.push(c);
        usedIds.add(String(c.tmdbId || c.id));
      }
    }

    console.log(`[DirectorEngine] Groups: regional=${groups.regional.length} relatives=${groups.relatives.length} global=${groups.global.length} unexpected=${groups.unexpected.length}`);

  } catch (err) {
    console.error('[DirectorEngine] Failed to generate grouped recommendations:', err);
  }

  const normalized = normalizeRecommendationShape(groups);
  normalized.filmography    = sourceProfile?.dna?.movies || [];
  normalized.directorProfile = sourceProfile || {};
  return normalized;
};




// ─── TMDB Resolution ─────────────────────────────────────────────────────────

const buildCinemaProfile = (candNode) => {
  const lang = candNode?.dna?.primaryLanguage || 'en';
  const regionLabel = REGIONAL_LABELS[lang] || 'World';
  const archetype = getAuteurArchetype(candNode);
  return {
    identity: archetype,
    ecosystemLabel: `${regionLabel} Cinema`,
    pacing: candNode?.dna?.pacing || 'methodical',
    tone: candNode?.dna?.tone || 'balanced',
    dna: candNode?.dna,
    name: candNode?.name,
    id: candNode?.id,
  };
};

export const resolveToTMDBGrouped = async (groupedRecs, tmdbService, sourceProfile) => {
  const resolved = {
    regional: [],
    relatives: [],
    global: [],
    unexpected: []
  };

  try {
    const normalizedInput = normalizeRecommendationShape(groupedRecs);

    const validateSet = async (group) => {
      const safeGroup = Array.isArray(group) ? group : [];
      if (safeGroup.length === 0) return [];
      
      const promises = safeGroup.map(async (cand) => {
        try {
          if (!cand || !cand.name) return null;
          
          let match = null;

          // 1. If tmdbId is present in our verified local graph, retrieve details directly to guarantee 100% accuracy
          if (cand.tmdbId) {
            try {
              const details = await tmdbService.getDirectorDetails(cand.tmdbId);
              if (details && details.id) {
                // Verify the name is a reasonable match to prevent corruption from historic graph data
                const normalizedCandName = norm(cand.name);
                const normalizedDetailsName = norm(details.name);
                const isSimilarName = normalizedDetailsName.includes(normalizedCandName) || normalizedCandName.includes(normalizedDetailsName);
                
                if (isSimilarName || details.known_for_department === 'Directing') {
                  match = {
                    id: details.id,
                    name: details.name,
                    profile_path: details.profile_path,
                    known_for_department: details.known_for_department
                  };
                }
              }
            } catch (err) {
              console.warn(`[DirectorEngine] Direct tmdbId lookup failed for ${cand.name} (${cand.tmdbId}), falling back to search:`, err);
            }
          }

          // 2. Fallback to searching by name if direct lookup didn't succeed or tmdbId was missing
          if (!match) {
            const data = await tmdbService.searchPeople(cand.name);
            if (data?.results && Array.isArray(data.results) && data.results.length > 0) {
              // Strict matching criteria for search results
              const normalizedCandName = norm(cand.name);
              
              // Filter and score search candidates to avoid wrong-person matches (e.g. actor vs director with same name)
              const candidates = data.results
                .map(p => {
                  if (!p) return null;
                  const normalizedMatchName = norm(p.name);
                  // Calculate match score
                  let nameScore;
                  if (normalizedMatchName === normalizedCandName) {
                    nameScore = 3; // Perfect match
                  } else if (normalizedMatchName.includes(normalizedCandName) || normalizedCandName.includes(normalizedMatchName)) {
                    nameScore = 1; // Partial match
                  } else {
                    return null; // Name is completely different
                  }
                  
                  const isDirector = p.known_for_department === 'Directing';
                  return {
                    person: p,
                    score: nameScore + (isDirector ? 5 : 0) // Highly prioritize directors
                  };
                })
                .filter(Boolean)
                .sort((a, b) => b.score - a.score);

              if (candidates.length > 0 && candidates[0].score >= 3) { // Require at least a name match + decent department
                match = candidates[0].person;
              }
            }
          }

          if (!match || !match.id) {
            console.warn(`[DirectorEngine] Could not verify candidate director: ${cand.name}`);
            return null;
          }
          
          // Avoid self-recommendation or recommending the source director
          const sourceName = sourceProfile?.name || '';
          const sourceId = sourceProfile?.id || '';
          if (String(match.id) === String(sourceId) || norm(match.name) === norm(sourceName)) {
            return null;
          }

          const cinemaProfile = buildCinemaProfile(cand);

          return {
            id: match.id,
            name: match.name || cand.name,
            profile_path: match.profile_path,
            cinemaProfile,
            reason: generateMatchReason(sourceProfile, cinemaProfile),
          };
        } catch (err) {
          console.error(`[DirectorEngine] Error resolving candidate ${cand.name}:`, err);
          return null;
        }
      });

      const results = await Promise.allSettled(promises);
      return results
        .filter(r => r.status === 'fulfilled' && r.value !== null)
        .map(r => r.value);
    };

    const [reg, rel, glob, unex] = await Promise.allSettled([
      validateSet(normalizedInput.regional),
      validateSet(normalizedInput.relatives),
      validateSet(normalizedInput.global),
      validateSet(normalizedInput.unexpected),
    ]);

    if (reg.status === 'fulfilled') resolved.regional = reg.value || [];
    if (rel.status === 'fulfilled') resolved.relatives = rel.value || [];
    if (glob.status === 'fulfilled') resolved.global = glob.value || [];
    if (unex.status === 'fulfilled') resolved.unexpected = unex.value || [];

    console.log(`[DirectorEngine] Resolved: regional=${resolved.regional.length} relatives=${resolved.relatives.length} global=${resolved.global.length} unexpected=${resolved.unexpected.length}`);
  } catch (err) {
    console.error('[DirectorEngine] Failed to resolve TMDB grouped recommendations:', err);
  }

  const normalized = normalizeRecommendationShape(resolved);
  normalized.filmography = sourceProfile?.dna?.movies || [];
  normalized.directorProfile = sourceProfile || {};
  return normalized;
};

// ─── Generic Relationship Score ───────────────────────────────────────────────

export const scoreRelationship = (srcDna, candDna, srcName = '', candName = '') => {
  if (!srcDna || !candDna) return 0;
  let score = 0;

  // 1. Ecosystem match (highest ontology priority)
  const srcEcoMeta = resolveDirectorEcosystemMeta(srcName, srcDna);
  const candEcoMeta = resolveDirectorEcosystemMeta(candName, candDna);
  const ecosystemAffinity = getEcosystemAffinity(srcEcoMeta, candEcoMeta);
  if (ecosystemAffinity >= 95) score += 55;
  else if (ecosystemAffinity >= 82) score += 42;
  else if (ecosystemAffinity >= 64) score += 28;
  else if (ecosystemAffinity >= 46) score += 16;

  // 2. Worldview alignment (ERH/OPD axis)
  const srcArch = getAuteurArchetype({ name: srcName });
  const candArch = getAuteurArchetype({ name: candName });
  const srcWv = getDirectorWorldview(srcName, srcArch, srcDna);
  const candWv = getDirectorWorldview(candName, candArch, candDna);
  score += scoreWorldviewAlignment(srcWv, candWv);

  const srcCinema = getCinematicProfile(srcName, srcArch, srcDna);
  const candCinema = getCinematicProfile(candName, candArch, candDna);
  score += scoreGrammarCompatibility(srcCinema.grammar, candCinema.grammar);
  if (isOntologicallyIncompatible(srcCinema, candCinema)) {
    score -= 90;
  }
  if ((srcCinema.worldview === 'humanist' && candCinema.worldview === 'nihilistic') ||
      (srcCinema.worldview === 'nihilistic' && candCinema.worldview === 'humanist')) {
    score -= 40;
  }
  if ((srcCinema.viewerExperience === 'visceral-kinetic' && candCinema.viewerExperience === 'meditative-spiritual') ||
      (srcCinema.viewerExperience === 'meditative-spiritual' && candCinema.viewerExperience === 'visceral-kinetic')) {
    score -= 25;
  }

  // 3. Worldview tag overlap — cinematic philosophy (+20 per shared tag)
  const sourceWorldviews = getWorldviewTags(srcName);
  const candidateWorldviews = getWorldviewTags(candName);
  const worldviewOverlap = sourceWorldviews.filter(tag => candidateWorldviews.includes(tag)).length;
  score += worldviewOverlap * 20;

  // 4. Cinematic grammar overlap — formal language (+16 per shared tag)
  const sourceGrammar = getGrammarTags(srcName);
  const candidateGrammar = getGrammarTags(candName);
  const grammarOverlap = sourceGrammar.filter(tag => candidateGrammar.includes(tag)).length;
  score += grammarOverlap * 16;

  // 5. Genre overlap — reduced weight to prevent genre flooding (+6 per genre)
  const bridgeScore = getDiscoveryBridgeScore(sourceWorldviews, [
    ...candidateWorldviews,
    ...candidateGrammar
  ]);
  score += bridgeScore * 4;

  const sharedGenres = (srcDna.topGenres || []).filter(g => (candDna.topGenres || []).includes(g));
  score += sharedGenres.length * 6;

  // 6. Emotional rhythm — pacing and tone (reduced)
  if (srcDna.pacing === candDna.pacing) score += 5;
  if (srcDna.tone === candDna.tone) score += 5;

  // 7. Temporal adjacency — shared decades (minimal)
  const srcDecades = Object.keys(srcDna.decades || {});
  const candDecades = Object.keys(candDna.decades || {});
  score += srcDecades.filter(d => candDecades.includes(d)).length * 3;

  // 8. Popularity — heavily dampened to prevent mainstream flooding
  const popularity = candDna.popularity || 0;
  score += Math.min(popularity / 10, 8);

  // 35B — Overexposed directors penalty
  if (OVEREXPOSED_DIRECTORS.includes(cleanName(candName))) {
    score -= 6;
  }

  return score;
};
