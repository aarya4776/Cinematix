import { tmdb } from '../src/services/tmdb.js';

const BENCHMARKS = [
  {
    label: 'Sci-Fi + Cyberpunk',
    preferences: { genre: 'science-fiction', subgenre: 'Cyberpunk', language: 'any' },
    expected: [
      'Blade Runner',
      'Ghost in the Shell',
      'Ex Machina',
      'Upgrade',
      'Dark City',
      'Alita',
      'RoboCop',
      'Strange Days'
    ],
    antiExpected: ['Dune', 'Interstellar', 'Predator', 'Doctor Who']
  },
  {
    label: 'Crime + Noir',
    preferences: { genre: 'crime', subgenre: 'Noir', language: 'any' },
    expected: [
      'Double Indemnity',
      'Chinatown',
      'The Third Man',
      'L.A. Confidential',
      'Le Samouraï',
      'Touch of Evil',
      'The Maltese Falcon'
    ],
    antiExpected: ['Fast & Furious', 'Avengers']
  },
  {
    label: 'Drama + Slice of Life',
    preferences: { genre: 'drama', subgenre: 'Slice of Life', language: 'any' },
    expected: [
      'Perfect Days',
      'Shoplifters',
      'Still Walking',
      'After Life',
      'Little Forest',
      'Paterson',
      'Our Little Sister'
    ],
    antiExpected: ['Avengers', 'Fast & Furious']
  }
];

const RUNS = 10;

const normalize = (title) => (title || '').toLowerCase();

const matchesAny = (title, list) =>
  list.some((needle) => normalize(title).includes(normalize(needle)));

async function runBenchmark({ label, preferences, expected, antiExpected }) {
  const picks = [];
  const unique = new Set();

  for (let i = 0; i < RUNS; i++) {
    const pick = await tmdb.getTonightsPick(preferences, []);
    if (pick?.title) {
      picks.push(pick.title);
      unique.add(pick.title);
    }
    await new Promise((r) => setTimeout(r, 250));
  }

  const onTarget = picks.filter((title) => matchesAny(title, expected));
  const offTarget = picks.filter((title) => matchesAny(title, antiExpected));

  return {
    label,
    picks,
    unique: [...unique],
    onTargetRate: `${onTarget.length}/${RUNS}`,
    offTargetRate: `${offTarget.length}/${RUNS}`,
    onTargetTitles: [...new Set(onTarget)],
    offTargetTitles: [...new Set(offTarget)]
  };
}

console.log(`Running ${RUNS} picks per subgenre benchmark...\n`);

for (const bench of BENCHMARKS) {
  const result = await runBenchmark(bench);
  console.log(`=== ${result.label} ===`);
  console.log(`On-target rate: ${result.onTargetRate}`);
  console.log(`Off-target rate: ${result.offTargetRate}`);
  console.log(`Unique picks (${result.unique.length}): ${result.unique.join(' | ')}`);
  if (result.onTargetTitles.length) {
    console.log(`On-target hits: ${result.onTargetTitles.join(' | ')}`);
  }
  if (result.offTargetTitles.length) {
    console.log(`Off-target hits: ${result.offTargetTitles.join(' | ')}`);
  }
  console.log('');
}
