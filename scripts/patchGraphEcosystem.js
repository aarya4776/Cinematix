// scripts/patchGraphEcosystem.js
// One-time patch to backfill 'ecosystem' field into existing directorGraph.json nodes
// using language-to-ecosystem bucketing (avoids re-fetching TMDB data)

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ECOSYSTEM_MAP = {
  'ko': 'korean', 'ja': 'japanese', 'zh': 'chinese', 'cn': 'chinese',
  'fr': 'french', 'es': 'spanish', 'it': 'italian', 'de': 'german',
  'ru': 'russian', 'hi': 'hindi', 'ta': 'south-indian', 'te': 'south-indian',
  'ml': 'south-indian', 'fa': 'iranian', 'sv': 'scandinavian', 'da': 'scandinavian',
  'nb': 'scandinavian', 'pt': 'portuguese', 'pl': 'polish', 'tr': 'turkish',
  'ar': 'arabic', 'en': 'english'
};

const getEcosystem = (lang = 'en') => ECOSYSTEM_MAP[lang] || lang;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const graphPath = path.join(__dirname, '..', 'src', 'data', 'directorGraph.json');

const graph = JSON.parse(fs.readFileSync(graphPath, 'utf-8'));

let patched = 0;
let skipped = 0;

for (const node of graph) {
  if (!node.dna) continue;
  
  // Backfill ecosystem from primaryLanguage
  if (!node.dna.ecosystem) {
    node.dna.ecosystem = getEcosystem(node.dna.primaryLanguage || 'en');
    patched++;
  } else {
    skipped++;
  }

  // Ensure topGenres is numeric (was stored as strings in older graph builds)
  if (node.dna.topGenres) {
    node.dna.topGenres = node.dna.topGenres.map(Number);
  }
}

fs.writeFileSync(graphPath, JSON.stringify(graph, null, 2));
console.log(`Patched ${patched} nodes with ecosystem field. ${skipped} already had it.`);
console.log(`Total nodes in graph: ${graph.length}`);

// Print ecosystem distribution for validation
const ecosystemDist = {};
for (const node of graph) {
  const eco = node.dna?.ecosystem || 'unknown';
  ecosystemDist[eco] = (ecosystemDist[eco] || 0) + 1;
}
console.log('\nEcosystem distribution:');
Object.entries(ecosystemDist).sort((a, b) => b[1] - a[1]).forEach(([eco, count]) => {
  console.log(`  ${eco}: ${count}`);
});
