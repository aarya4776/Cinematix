import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Extract keys from the old P object provided in the user context
const SEED_DIRECTORS = ["bong joon ho","park chan wook","lee chang dong","na hong jin","kim jee woon","hong sang soo","ryoo seung wan","hayao miyazaki","makoto shinkai","satoshi kon","mamoru hosoda","isao takahata","hirokazu kore eda","takashi miike","yasujiro ozu","akira kurosawa","naomi kawase","hideo nakata","wong kar wai","john woo","johnnie to","hou hsiao hsien","edward yang","jia zhangke","zhang yimou","michael haneke","jacques audiard","claire denis","pedro almodovar","yorgos lanthimos","ruben ostlund","lars von trier","thomas vinterberg","ingmar bergman","roy andersson","gaspar noe","xavier dolan","mani ratnam","vetrimaaran","ss rajamouli","sanjay leela bhansali","anurag kashyap","imtiaz ali","satyajit ray","asghar farhadi","abbas kiarostami","jafar panahi","alfonso cuaron","alejandro gonzalez inarritu","guillermo del toro","fernando meirelles","pablo larrain","andrei tarkovsky","andrei zvyagintsev","krzysztof kieslowski","pawel pawlikowski","christian mungiu","bela tarr","apichatpong weerasethakul","terrence malick","richard linklater","jim jarmusch","kelly reichardt","chloe zhao","barry jenkins","david lynch","darren aronofsky","spike lee","lynne ramsay","christopher nolan","david fincher","martin scorsese","quentin tarantino","stanley kubrick","steven spielberg","paul thomas anderson","wes anderson","sofia coppola","greta gerwig","noah baumbach","denis villeneuve","alex garland","ridley scott","james cameron","jordan peele","ari aster","michael mann","james wan","mike flanagan","peter jackson"];

const ECOSYSTEM_MAP = {
  'ko': 'korean', 'ja': 'japanese', 'zh': 'chinese', 'cn': 'chinese',
  'fr': 'french', 'es': 'spanish', 'it': 'italian', 'de': 'german',
  'ru': 'russian', 'hi': 'hindi', 'ta': 'south-indian', 'te': 'south-indian',
  'ml': 'south-indian', 'fa': 'iranian', 'sv': 'scandinavian', 'da': 'scandinavian',
  'nb': 'scandinavian', 'pt': 'portuguese', 'pl': 'polish', 'tr': 'turkish',
  'ar': 'arabic', 'en': 'english'
};
const getEcosystem = (lang = 'en') => ECOSYSTEM_MAP[lang] || lang;

const API_KEY = "72a998dcbb7a2e67fe96f316866c8fdb";
const API_URL = "https://api.themoviedb.org/3";

const sleep = ms => new Promise(r => setTimeout(r, ms));

const computeDirectorDNA = (movies = []) => {
  const dna = { languages: {}, countries: {}, genres: {}, decades: {}, totalFilms: movies.length, confidence: movies.length > 3 ? 'high' : (movies.length > 0 ? 'medium' : 'low') };
  movies.forEach(m => {
    if (m.original_language) dna.languages[m.original_language] = (dna.languages[m.original_language] || 0) + 1;
    if (m.origin_country && m.origin_country.length > 0) m.origin_country.forEach(c => dna.countries[c] = (dna.countries[c] || 0) + 1);
    if (m.genre_ids) m.genre_ids.forEach(gid => dna.genres[gid] = (dna.genres[gid] || 0) + 1);
    if (m.release_date) {
      const decade = Math.floor(parseInt(m.release_date.split('-')[0]) / 10) * 10;
      if (!isNaN(decade)) dna.decades[decade] = (dna.decades[decade] || 0) + 1;
    }
  });

  dna.primaryLanguage = Object.keys(dna.languages).sort((a, b) => dna.languages[b] - dna.languages[a])[0] || 'en';
  dna.primaryCountry = Object.keys(dna.countries).sort((a, b) => dna.countries[b] - dna.countries[a])[0] || 'US';
  dna.topGenres = Object.keys(dna.genres).sort((a, b) => dna.genres[b] - dna.genres[a]).map(Number).slice(0, 3);

  let kineticScore = (dna.genres[28]||0) + (dna.genres[53]||0) + (dna.genres[80]||0);
  let methodicScore = (dna.genres[18]||0) + (dna.genres[36]||0) + (dna.genres[99]||0);
  let darkScore = (dna.genres[27]||0) + (dna.genres[53]||0) + (dna.genres[80]||0);
  let lightScore = (dna.genres[35]||0) + (dna.genres[10751]||0) + (dna.genres[10749]||0);

  dna.pacing = kineticScore > methodicScore ? 'kinetic' : (methodicScore > kineticScore * 2 ? 'slow-burn' : 'methodical');
  dna.tone = darkScore > lightScore ? 'dark' : (lightScore > darkScore ? 'lighthearted' : 'balanced');

  return dna;
};

async function buildGraph() {
  console.log("Starting dynamic graph generation...");
  const graph = [];

  for (const name of SEED_DIRECTORS) {
    try {
      const searchRes = await fetch(`${API_URL}/search/person?api_key=${API_KEY}&query=${encodeURIComponent(name)}`);
      const searchData = await searchRes.json();
      const person = searchData.results?.find(p => p.known_for_department === 'Directing') || searchData.results?.[0];
      
      if (!person) {
        console.warn(`Could not find ID for ${name}`);
        continue;
      }

      await sleep(100);

      const creditsRes = await fetch(`${API_URL}/person/${person.id}/movie_credits?api_key=${API_KEY}`);
      const creditsData = await creditsRes.json();
      
      const directedMovies = (creditsData.crew || []).filter(c => c.job === 'Director');
      const dna = computeDirectorDNA(directedMovies);

      graph.push({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(),
        tmdbId: person.id,
        name: person.name,
        dna
      });
      console.log(`Processed ${name}: ${directedMovies.length} films, Lang: ${dna.primaryLanguage}, Tone: ${dna.tone}`);

    } catch (err) {
      console.error(`Failed to process ${name}:`, err.message);
    }
  }

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const dataPath = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(dataPath)) fs.mkdirSync(dataPath, { recursive: true });

  fs.writeFileSync(path.join(dataPath, 'directorGraph.json'), JSON.stringify(graph, null, 2));
  console.log(`Successfully generated directorGraph.json with ${graph.length} directors.`);
}

buildGraph();
