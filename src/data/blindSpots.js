// ============================================================
// CINEMATIC BLIND SPOTS REGISTRY - Phase 3.6
//
// Each blind spot defines a cinematic territory that may be
// underexplored in a user's profile. Matching is calculated
// by measuring the user's LOW scores in dominantDimensions.
// Higher gap = stronger blind spot.
//
// Dimensions must match keys in TRAIT_LABELS:
//   imagination, wonder, complexity, atmosphere, emotionality,
//   realism, ambiguity, optimism, darkness, spectacle,
//   characterFocus, philosophical, density, intimacy,
//   worldbuilding, moralComplexity, narrativeExperimentation,
//   psychologicalIntensity, humanism, mythicScale
// ============================================================

export const BLIND_SPOTS = [
  {
    id: 'poetic_cinema',
    name: 'Poetic Cinema',
    description:
      'Your profile shows very little engagement with films that prioritize atmosphere, observation, and emotional suggestion over plot mechanics. Poetic cinema operates through image and feeling rather than narrative drive - a vast territory that remains largely unexplored within your taste map.',
    dominantDimensions: ['atmosphere', 'ambiguity', 'wonder', 'imagination'],
    whyMissingDims: ['ambiguity', 'atmosphere', 'narrativeExperimentation'],
    entryFilms: [
      { id: 50014, title: 'Yi Yi', year: 2000, director: 'Edward Yang' },
      { id: 12477, title: 'Grave of the Fireflies', year: 1988, director: 'Isao Takahata' },
      { id: 11531, title: 'The Tree of Life', year: 2011, director: 'Terrence Malick' },
    ],
    colorTheme: { primary: 'rgba(120,180,220,0.9)', accent: 'rgba(90,150,200,0.15)', border: 'rgba(120,180,220,0.2)' },
  },
  {
    id: 'experimental_storytelling',
    name: 'Experimental Storytelling',
    description:
      'Films that challenge the conventions of narrative itself - fractured timelines, unreliable narration, non-linear structures - represent a largely unexplored territory in your selections. This is cinema that questions how stories are told, not just what they say.',
    dominantDimensions: ['narrativeExperimentation', 'ambiguity', 'complexity', 'imagination'],
    whyMissingDims: ['narrativeExperimentation', 'ambiguity', 'complexity'],
    entryFilms: [
      { id: 281, title: 'Mulholland Drive', year: 2001, director: 'David Lynch' },
      { id: 503919, title: 'Synecdoche, New York', year: 2008, director: 'Charlie Kaufman' },
      { id: 185, title: 'Memento', year: 2000, director: 'Christopher Nolan' },
    ],
    colorTheme: { primary: 'rgba(200,140,240,0.9)', accent: 'rgba(160,100,210,0.12)', border: 'rgba(180,120,230,0.2)' },
  },
  {
    id: 'optimistic_humanism',
    name: 'Optimistic Humanism',
    description:
      'Your profile leans away from films that celebrate warmth, connection, and the redemptive capacity of ordinary human experience. This territory - cinema that finds profound meaning in hope and kindness - remains largely unrepresented in your selections.',
    dominantDimensions: ['optimism', 'humanism', 'emotionality', 'intimacy'],
    whyMissingDims: ['optimism', 'humanism', 'emotionality'],
    entryFilms: [
      { id: 129757, title: 'Tokyo Story', year: 1953, director: 'Yasujiro Ozu' },
      { id: 8392, title: 'My Neighbor Totoro', year: 1988, director: 'Hayao Miyazaki' },
      { id: 396535, title: 'Paddington 2', year: 2017, director: 'Paul King' },
    ],
    colorTheme: { primary: 'rgba(255,200,80,0.9)', accent: 'rgba(255,180,60,0.1)', border: 'rgba(255,200,80,0.2)' },
  },
  {
    id: 'visual_formalism',
    name: 'Visual Formalism',
    description:
      'Cinema as pure visual composition - where symmetry, color palette, and precise framing carry the emotional weight - is a territory that rarely appears in your profile. These are films where how something is shown becomes inseparable from what is being said.',
    dominantDimensions: ['spectacle', 'atmosphere', 'imagination', 'wonder'],
    whyMissingDims: ['spectacle', 'atmosphere', 'imagination'],
    entryFilms: [
      { id: 120467, title: 'The Grand Budapest Hotel', year: 2014, director: 'Wes Anderson' },
      { id: 496243, title: 'Parasite', year: 2019, director: 'Bong Joon-ho' },
      { id: 14982, title: 'In the Mood for Love', year: 2000, director: 'Wong Kar-wai' },
    ],
    colorTheme: { primary: 'rgba(255,140,100,0.9)', accent: 'rgba(220,110,80,0.12)', border: 'rgba(240,130,90,0.2)' },
  },
  {
    id: 'mythic_fantasy',
    name: 'Mythic Fantasy',
    description:
      'Stories rooted in legend, folklore, and archetypal journeys occupy a very small space in your cinematic profile. This is cinema that draws its power from myth - the hero\'s quest, the magical threshold, the timeless battle between light and dark.',
    dominantDimensions: ['mythicScale', 'wonder', 'imagination', 'worldbuilding'],
    whyMissingDims: ['mythicScale', 'wonder', 'worldbuilding'],
    entryFilms: [
      { id: 120, title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001, director: 'Peter Jackson' },
      { id: 129, title: 'Spirited Away', year: 2001, director: 'Hayao Miyazaki' },
      { id: 348, title: 'Excalibur', year: 1981, director: 'John Boorman' },
    ],
    colorTheme: { primary: 'rgba(100,200,160,0.9)', accent: 'rgba(70,170,130,0.12)', border: 'rgba(90,190,150,0.2)' },
  },
  {
    id: 'cosmic_wonder',
    name: 'Cosmic Wonder',
    description:
      'Films that situate the human experience within a larger cosmic or existential frame - evoking awe at the scale of the universe, the mystery of existence, or the smallness of individual life - are rarely represented in your selections.',
    dominantDimensions: ['wonder', 'imagination', 'philosophical', 'mythicScale'],
    whyMissingDims: ['wonder', 'philosophical', 'imagination'],
    entryFilms: [
      { id: 157336, title: 'Interstellar', year: 2014, director: 'Christopher Nolan' },
      { id: 62, title: '2001: A Space Odyssey', year: 1968, director: 'Stanley Kubrick' },
      { id: 348350, title: 'First Man', year: 2018, director: 'Damien Chazelle' },
    ],
    colorTheme: { primary: 'rgba(80,160,255,0.9)', accent: 'rgba(60,130,220,0.12)', border: 'rgba(80,160,255,0.2)' },
  },
  {
    id: 'romantic_intimacy',
    name: 'Romantic Intimacy',
    description:
      'The cinema of romantic love - its complications, tenderness, and transformative power - is a territory that barely registers in your profile. Films built around the interior life of romantic attachment and emotional vulnerability represent an underexplored region of your taste.',
    dominantDimensions: ['intimacy', 'emotionality', 'humanism', 'optimism'],
    whyMissingDims: ['intimacy', 'emotionality', 'optimism'],
    entryFilms: [
      { id: 558, title: 'Before Sunrise', year: 1995, director: 'Richard Linklater' },
      { id: 14982, title: 'In the Mood for Love', year: 2000, director: 'Wong Kar-wai' },
      { id: 38365, title: 'Eternal Sunshine of the Spotless Mind', year: 2004, director: 'Michel Gondry' },
    ],
    colorTheme: { primary: 'rgba(255,130,160,0.9)', accent: 'rgba(220,100,130,0.1)', border: 'rgba(240,120,150,0.2)' },
  },
  {
    id: 'quiet_minimalism',
    name: 'Quiet Minimalism',
    description:
      'Cinema of restraint - long takes, minimal dialogue, slow-burning observation of everyday life - seldom appears in your selections. This territory values what is left unsaid, finding emotional resonance in silence and the spaces between events.',
    dominantDimensions: ['atmosphere', 'realism', 'intimacy', 'ambiguity'],
    whyMissingDims: ['atmosphere', 'realism', 'ambiguity'],
    entryFilms: [
      { id: 389, title: 'Jeanne Dielman', year: 1975, director: 'Chantal Akerman' },
      { id: 218956, title: 'Paterson', year: 2016, director: 'Jim Jarmusch' },
      { id: 287, title: 'Yi Yi', year: 2000, director: 'Edward Yang' },
    ],
    colorTheme: { primary: 'rgba(180,200,180,0.9)', accent: 'rgba(150,175,150,0.1)', border: 'rgba(170,195,170,0.2)' },
  },
  {
    id: 'political_cinema',
    name: 'Political Cinema',
    description:
      'Films that engage directly with systems of power, social injustice, or collective struggle represent a largely unexplored region of your cinematic profile. This is cinema that sees the political as inseparable from the personal and refuses to look away.',
    dominantDimensions: ['moralComplexity', 'realism', 'humanism', 'ambiguity'],
    whyMissingDims: ['moralComplexity', 'realism', 'humanism'],
    entryFilms: [
      { id: 15164, title: 'Bicycle Thieves', year: 1948, director: 'Vittorio De Sica' },
      { id: 7232, title: 'The Battle of Algiers', year: 1966, director: 'Gillo Pontecorvo' },
      { id: 424, title: "Schindler's List", year: 1993, director: 'Steven Spielberg' },
    ],
    colorTheme: { primary: 'rgba(220,100,80,0.9)', accent: 'rgba(190,70,60,0.1)', border: 'rgba(210,90,75,0.2)' },
  },
  {
    id: 'absurdist_satire',
    name: 'Absurdist Satire',
    description:
      'Films that use dark comedy, absurdism, or satirical exaggeration to expose the contradictions of modern life occupy a very limited space in your selections. This territory finds truth through distortion and often says the most serious things while being very funny.',
    dominantDimensions: ['ambiguity', 'moralComplexity', 'narrativeExperimentation', 'optimism'],
    whyMissingDims: ['ambiguity', 'narrativeExperimentation', 'moralComplexity'],
    entryFilms: [
      { id: 935, title: 'Dr. Strangelove', year: 1964, director: 'Stanley Kubrick' },
      { id: 263115, title: 'The Lobster', year: 2015, director: 'Yorgos Lanthimos' },
      { id: 493922, title: 'Hereditary', year: 2018, director: 'Ari Aster' },
    ],
    colorTheme: { primary: 'rgba(255,210,60,0.9)', accent: 'rgba(220,175,40,0.1)', border: 'rgba(240,200,55,0.2)' },
  },
  {
    id: 'documentary_realism',
    name: 'Documentary Realism',
    description:
      'Non-fiction cinema - the documentary tradition and its influence on narrative filmmaking - is largely absent from your profile. Films that derive their power from the texture of real events, real faces, and real places represent a significant unexplored territory.',
    dominantDimensions: ['realism', 'humanism', 'intimacy', 'characterFocus'],
    whyMissingDims: ['realism', 'humanism', 'characterFocus'],
    entryFilms: [
      { id: 283993, title: 'Amy', year: 2015, director: 'Asif Kapadia' },
      { id: 14537, title: 'Man on Wire', year: 2008, director: 'James Marsh' },
      { id: 375262, title: 'Faces Places', year: 2017, director: 'Agnes Varda and JR' },
    ],
    colorTheme: { primary: 'rgba(160,200,220,0.9)', accent: 'rgba(130,175,200,0.1)', border: 'rgba(150,190,215,0.2)' },
  },
  {
    id: 'musical_expression',
    name: 'Musical Expression',
    description:
      'Cinema where song, dance, and musical structure become the primary expressive language is a territory that rarely surfaces in your selections. This is film at its most formally distinctive: emotion made literal through performance.',
    dominantDimensions: ['emotionality', 'spectacle', 'wonder', 'optimism'],
    whyMissingDims: ['emotionality', 'spectacle', 'optimism'],
    entryFilms: [
      { id: 11975, title: 'Singin in the Rain', year: 1952, director: 'Stanley Donen' },
      { id: 313369, title: 'La La Land', year: 2016, director: 'Damien Chazelle' },
      { id: 7299, title: 'Dancer in the Dark', year: 2000, director: 'Lars von Trier' },
    ],
    colorTheme: { primary: 'rgba(240,160,100,0.9)', accent: 'rgba(210,130,75,0.1)', border: 'rgba(230,150,90,0.2)' },
  },
  {
    id: 'spiritual_cinema',
    name: 'Spiritual Cinema',
    description:
      'Films that engage with transcendence, grace, faith, and the search for meaning beyond the material are seldom present in your profile. This is art that asks the largest questions without demanding definitive answers.',
    dominantDimensions: ['philosophical', 'wonder', 'ambiguity', 'atmosphere'],
    whyMissingDims: ['philosophical', 'ambiguity', 'atmosphere'],
    entryFilms: [
      { id: 9377, title: 'Ordet', year: 1955, director: 'Carl Theodor Dreyer' },
      { id: 5765, title: 'Andrei Rublev', year: 1966, director: 'Andrei Tarkovsky' },
      { id: 11531, title: 'The Tree of Life', year: 2011, director: 'Terrence Malick' },
    ],
    colorTheme: { primary: 'rgba(200,180,140,0.9)', accent: 'rgba(170,150,110,0.1)', border: 'rgba(190,170,130,0.2)' },
  },
  {
    id: 'epic_worldbuilding',
    name: 'Epic Worldbuilding',
    description:
      'Cinema that constructs entirely realized alternative worlds - with their own history, geography, cultures, and internal logic - is an underrepresented territory in your selections. These are films where the act of world-creation is itself an artistic statement.',
    dominantDimensions: ['worldbuilding', 'mythicScale', 'imagination', 'spectacle'],
    whyMissingDims: ['worldbuilding', 'imagination', 'mythicScale'],
    entryFilms: [
      { id: 120, title: 'The Lord of the Rings: The Two Towers', year: 2002, director: 'Peter Jackson' },
      { id: 438631, title: 'Dune', year: 2021, director: 'Denis Villeneuve' },
      { id: 205, title: 'Lawrence of Arabia', year: 1962, director: 'David Lean' },
    ],
    colorTheme: { primary: 'rgba(100,180,150,0.9)', accent: 'rgba(70,150,120,0.1)', border: 'rgba(90,170,140,0.2)' },
  },
  {
    id: 'avant_garde',
    name: 'Avant-Garde Narrative',
    description:
      'The most formally radical cinema - where story structure, time, character, and causality are dismantled and reassembled in unexpected ways - is almost entirely absent from your profile. This territory rewards viewers willing to surrender conventional narrative expectations.',
    dominantDimensions: ['narrativeExperimentation', 'ambiguity', 'imagination', 'philosophical'],
    whyMissingDims: ['narrativeExperimentation', 'ambiguity', 'philosophical'],
    entryFilms: [
      { id: 281, title: 'Mulholland Drive', year: 2001, director: 'David Lynch' },
      { id: 33065, title: 'Hiroshima Mon Amour', year: 1959, director: 'Alain Resnais' },
      { id: 8985, title: 'Last Year at Marienbad', year: 1961, director: 'Alain Resnais' },
    ],
    colorTheme: { primary: 'rgba(180,120,220,0.9)', accent: 'rgba(150,90,190,0.1)', border: 'rgba(165,105,210,0.2)' },
  },
];
