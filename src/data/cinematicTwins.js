// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Cinematic Twin Registry â€” Phase 3.3
// 36 filmmaker personas mapped across the 20 cinematic dimensions.
// Dimensions mirror the DNA engine: imagination, wonder, complexity,
// atmosphere, emotionality, realism, ambiguity, optimism, darkness,
// spectacle, characterFocus, philosophical, density, intimacy,
// worldbuilding, moralComplexity, narrativeExperimentation,
// psychologicalIntensity, humanism, mythicScale
// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

// Gradient palettes â€” used for avatar rendering (no external images)
// Format: [colorA, colorB]
const TWIN_GRADIENTS = {
  scorsese:    ['#c0392b', '#8e1a11'],
  fincher:     ['#1a1a2e', '#4a4a7a'],
  nolan:       ['#0d2137', '#1e5080'],
  villeneuve:  ['#1c2340', '#3b4d7c'],
  kurosawa:    ['#2c1810', '#7a3a20'],
  bong:        ['#1a2c1a', '#2e6b2e'],
  miyazaki:    ['#0d4f6e', '#1a9e8a'],
  kubrick:     ['#0a0a0a', '#3a3a3a'],
  wongkarwai:  ['#3d1a4e', '#9b2e6b'],
  pta:         ['#2a1a0d', '#7a4a20'],
  coen:        ['#1a1a0d', '#4a4a2a'],
  gerwig:      ['#4e2a5e', '#c06080'],
  wesanderson: ['#3d2a1a', '#c07040'],
  malick:      ['#1a2e1a', '#4a8040'],
  parkchanwook:['#2e0a0a', '#8e2020'],
  coppola:     ['#1a0d0d', '#5a2020'],
  cuaron:      ['#0d1a2a', '#2a6080'],
  ridleyscott: ['#1a1a0d', '#4a3a20'],
  kaufman:     ['#2a0d3d', '#7a3a8e'],
  aronofsky:   ['#0d0d1a', '#3a2060'],
  sofiacoppola:['#2e1a2e', '#8a4a6e'],
  tarantino:   ['#1a0d0d', '#6a2a2a'],
  linklater:   ['#1a2a1a', '#4a7a5a'],
  lynch:       ['#0a0a1a', '#3a1a5a'],
  deltoro:     ['#1a0d2e', '#5a2a7a'],
  vonTrier:    ['#0a0a0a', '#4a1a1a'],
  tarkovsky:   ['#1a1a0d', '#6a6a40'],
  ozu:         ['#1a0d0d', '#6a4a3a'],
  gondry:      ['#1a2a3a', '#3a7a9a'],
  spikejonze:  ['#2a1a0d', '#7a4a30'],
  ariaster:    ['#0a0a0a', '#3a0a0a'],
  jordanpeele: ['#0a0a0a', '#3a2a0a'],
  eggers:      ['#0a0a0d', '#2a2a3a'],
  cameron:     ['#0d1a2a', '#1a5a6a'],
  spielberg:   ['#0d1a2e', '#2a4a7a'],
  schrader:    ['#0a0a0a', '#2a1a0a'],
};

export const CINEMATIC_TWINS = [
  {
    id: 'scorsese',
    name: 'Martin Scorsese',
    title: 'Observer of Obsession, Crime, and Human Frailty',
    description: `Your selections echo a deep investment in morally conflicted protagonists caught between desire and destruction. Scorsese's cinema is built on psychological intensity, institutional pressure, and the cost of ambition â€” the same tensions your choices reveal.`,
    gradient: TWIN_GRADIENTS.scorsese,
    signatureTraits: ['Moral Complexity', 'Psychological Intensity', 'Character Depth', 'Atmosphere'],
    signatureMovies: [
      { id: 769,   title: 'GoodFellas' },
      { id: 218,   title: 'The Departed' },
      { id: 334533,title: 'Raging Bull' },
      { id: 11216, title: 'Taxi Driver' },
    ],
    vector: {
      imagination: 0.5, wonder: 0.3, complexity: 0.85, atmosphere: 0.92,
      emotionality: 0.8, realism: 0.85, ambiguity: 0.7, optimism: 0.25,
      darkness: 0.92, spectacle: 0.65, characterFocus: 0.92, philosophical: 0.72,
      density: 0.8, intimacy: 0.6, worldbuilding: 0.5, moralComplexity: 0.97,
      narrativeExperimentation: 0.6, psychologicalIntensity: 0.95, humanism: 0.65, mythicScale: 0.6
    }
  },
  {
    id: 'fincher',
    name: 'David Fincher',
    title: 'Architect of Dread, Control, and Cold Precision',
    description: `You're drawn to cinema where darkness is rendered with surgical clarity. Fincher builds films like mechanisms â€” every frame deliberate, every character compromised. Your taste for psychological depth and controlled atmosphere mirrors his obsessive craftsmanship.`,
    gradient: TWIN_GRADIENTS.fincher,
    signatureTraits: ['Psychological Intensity', 'Atmosphere', 'Complexity', 'Darkness'],
    signatureMovies: [
      { id: 155,   title: 'Se7en' },
      { id: 550,   title: 'Fight Club' },
      { id: 37799, title: 'The Social Network' },
      { id: 414906,title: 'The Girl with the Dragon Tattoo' },
    ],
    vector: {
      imagination: 0.45, wonder: 0.2, complexity: 0.92, atmosphere: 0.97,
      emotionality: 0.6, realism: 0.78, ambiguity: 0.75, optimism: 0.15,
      darkness: 0.95, spectacle: 0.55, characterFocus: 0.82, philosophical: 0.7,
      density: 0.85, intimacy: 0.5, worldbuilding: 0.4, moralComplexity: 0.88,
      narrativeExperimentation: 0.72, psychologicalIntensity: 0.98, humanism: 0.4, mythicScale: 0.35
    }
  },
  {
    id: 'nolan',
    name: 'Christopher Nolan',
    title: 'Engineer of Time, Scale, and Cognitive Wonder',
    description: `Your selections repeatedly favored films where intellectual architecture carries the same weight as emotion. Nolan builds cinematic puzzles of extraordinary scale â€” dense, ambitious narratives that trust the audience's intelligence completely.`,
    gradient: TWIN_GRADIENTS.nolan,
    signatureTraits: ['Complexity', 'Worldbuilding', 'Spectacle', 'Philosophical Depth'],
    signatureMovies: [
      { id: 157336, title: 'Interstellar' },
      { id: 155,    title: 'The Dark Knight' },
      { id: 27205,  title: 'Inception' },
      { id: 37799,  title: 'The Prestige' },
    ],
    vector: {
      imagination: 0.88, wonder: 0.72, complexity: 0.97, atmosphere: 0.78,
      emotionality: 0.65, realism: 0.55, ambiguity: 0.6, optimism: 0.55,
      darkness: 0.7, spectacle: 0.92, characterFocus: 0.65, philosophical: 0.85,
      density: 0.95, intimacy: 0.4, worldbuilding: 0.88, moralComplexity: 0.72,
      narrativeExperimentation: 0.8, psychologicalIntensity: 0.78, humanism: 0.6, mythicScale: 0.85
    }
  },
  {
    id: 'villeneuve',
    name: 'Denis Villeneuve',
    title: 'Poet of Silence, Dread, and the Vast Unknown',
    description: `You're drawn to cinema that uses silence as a weapon and scale as a philosophical statement. Villeneuve creates films where atmosphere is the primary language â€” slow, deliberate, and deeply unsettling in the most beautiful way.`,
    gradient: TWIN_GRADIENTS.villeneuve,
    signatureTraits: ['Atmosphere', 'Philosophical Depth', 'Worldbuilding', 'Darkness'],
    signatureMovies: [
      { id: 335984, title: 'Blade Runner 2049' },
      { id: 438631, title: 'Dune' },
      { id: 131631, title: 'Prisoners' },
      { id: 188927, title: 'Arrival' },
    ],
    vector: {
      imagination: 0.88, wonder: 0.65, complexity: 0.78, atmosphere: 0.98,
      emotionality: 0.72, realism: 0.5, ambiguity: 0.82, optimism: 0.38,
      darkness: 0.82, spectacle: 0.85, characterFocus: 0.7, philosophical: 0.92,
      density: 0.6, intimacy: 0.55, worldbuilding: 0.95, moralComplexity: 0.75,
      narrativeExperimentation: 0.6, psychologicalIntensity: 0.85, humanism: 0.65, mythicScale: 0.9
    }
  },
  {
    id: 'kurosawa',
    name: 'Akira Kurosawa',
    title: 'Chronicler of Honor, Sacrifice, and the Human Spirit',
    description: `Your choices consistently favored films built on deep character investment, ethical struggle, and the dignity of ordinary people facing impossible odds. Kurosawa's cinema is the highest expression of humanist storytelling married to mythic grandeur.`,
    gradient: TWIN_GRADIENTS.kurosawa,
    signatureTraits: ['Humanism', 'Character Depth', 'Mythic Scale', 'Emotionality'],
    signatureMovies: [
      { id: 346,  title: 'Seven Samurai' },
      { id: 548,  title: 'Rashomon' },
      { id: 11230,title: 'Ran' },
      { id: 11398,title: 'Ikiru' },
    ],
    vector: {
      imagination: 0.45, wonder: 0.75, complexity: 0.68, atmosphere: 0.78,
      emotionality: 0.88, realism: 0.85, ambiguity: 0.55, optimism: 0.7,
      darkness: 0.6, spectacle: 0.82, characterFocus: 0.92, philosophical: 0.82,
      density: 0.7, intimacy: 0.55, worldbuilding: 0.5, moralComplexity: 0.78,
      narrativeExperimentation: 0.45, psychologicalIntensity: 0.78, humanism: 0.97, mythicScale: 0.88
    }
  },
  {
    id: 'bong',
    name: 'Bong Joon-ho',
    title: 'Satirist of Class, Power, and Social Collision',
    description: `You gravitate toward films that weaponize genre to expose social truth. Bong Joon-ho is a master of tonal collision â€” horror, black comedy, and genuine tragedy coexist in a single frame. His cinema reflects your appetite for complexity that refuses to be neatly resolved.`,
    gradient: TWIN_GRADIENTS.bong,
    signatureTraits: ['Moral Complexity', 'Atmosphere', 'Narrative Experimentation', 'Darkness'],
    signatureMovies: [
      { id: 496243, title: 'Parasite' },
      { id: 49026,  title: 'Snowpiercer' },
      { id: 60599,  title: 'The Host' },
      { id: 313369, title: 'Okja' },
    ],
    vector: {
      imagination: 0.72, wonder: 0.4, complexity: 0.88, atmosphere: 0.9,
      emotionality: 0.78, realism: 0.75, ambiguity: 0.8, optimism: 0.3,
      darkness: 0.82, spectacle: 0.65, characterFocus: 0.8, philosophical: 0.75,
      density: 0.78, intimacy: 0.55, worldbuilding: 0.55, moralComplexity: 0.95,
      narrativeExperimentation: 0.88, psychologicalIntensity: 0.75, humanism: 0.6, mythicScale: 0.4
    }
  },
  {
    id: 'miyazaki',
    name: 'Hayao Miyazaki',
    title: 'Dreamer of Living Worlds and Vanishing Innocence',
    description: `Your choices reveal a viewer who values imagination as a moral force. Miyazaki creates worlds of extraordinary visual invention where wonder is inseparable from ecological grief and the fragility of childhood. His cinema speaks to those who never fully accepted the world as it is.`,
    gradient: TWIN_GRADIENTS.miyazaki,
    signatureTraits: ['Imagination', 'Wonder', 'Worldbuilding', 'Humanism'],
    signatureMovies: [
      { id: 129,  title: 'Spirited Away' },
      { id: 128,  title: 'Princess Mononoke' },
      { id: 4934, title: 'Howl\'s Moving Castle' },
      { id: 37797,title: 'My Neighbor Totoro' },
    ],
    vector: {
      imagination: 0.98, wonder: 0.97, complexity: 0.65, atmosphere: 0.88,
      emotionality: 0.85, realism: 0.25, ambiguity: 0.65, optimism: 0.72,
      darkness: 0.55, spectacle: 0.88, characterFocus: 0.72, philosophical: 0.82,
      density: 0.55, intimacy: 0.5, worldbuilding: 0.98, moralComplexity: 0.72,
      narrativeExperimentation: 0.55, psychologicalIntensity: 0.6, humanism: 0.95, mythicScale: 0.92
    }
  },
  {
    id: 'kubrick',
    name: 'Stanley Kubrick',
    title: 'Cold Visionary of Power, Madness, and Human Futility',
    description: `You're drawn to cinema where detachment is a philosophical position and formal precision serves as a lens for human horror. Kubrick approached filmmaking as a scientist studying a broken species â€” his films are perfectly controlled environments for witnessing collapse.`,
    gradient: TWIN_GRADIENTS.kubrick,
    signatureTraits: ['Philosophical Depth', 'Psychological Intensity', 'Ambiguity', 'Darkness'],
    signatureMovies: [
      { id: 694,  title: '2001: A Space Odyssey' },
      { id: 380,  title: 'The Shining' },
      { id: 935,  title: 'Full Metal Jacket' },
      { id: 314,  title: 'A Clockwork Orange' },
    ],
    vector: {
      imagination: 0.85, wonder: 0.55, complexity: 0.9, atmosphere: 0.92,
      emotionality: 0.45, realism: 0.55, ambiguity: 0.88, optimism: 0.15,
      darkness: 0.92, spectacle: 0.72, characterFocus: 0.68, philosophical: 0.97,
      density: 0.78, intimacy: 0.35, worldbuilding: 0.78, moralComplexity: 0.88,
      narrativeExperimentation: 0.78, psychologicalIntensity: 0.95, humanism: 0.3, mythicScale: 0.8
    }
  },
  {
    id: 'wongkarwai',
    name: 'Wong Kar-wai',
    title: 'Elegist of Desire, Memory, and Time Slipping Away',
    description: `Your selections suggest a viewer tuned to emotional frequency over narrative logic. Wong Kar-wai constructs films from longing itself â€” blurred frames, fractured timelines, and feelings that refuse to resolve. This is cinema built for those who feel things before they understand them.`,
    gradient: TWIN_GRADIENTS.wongkarwai,
    signatureTraits: ['Atmosphere', 'Intimacy', 'Ambiguity', 'Emotionality'],
    signatureMovies: [
      { id: 11104, title: 'In the Mood for Love' },
      { id: 42288, title: 'Chungking Express' },
      { id: 3170,  title: 'Happy Together' },
      { id: 60899, title: '2046' },
    ],
    vector: {
      imagination: 0.72, wonder: 0.65, complexity: 0.65, atmosphere: 0.98,
      emotionality: 0.97, realism: 0.6, ambiguity: 0.95, optimism: 0.45,
      darkness: 0.55, spectacle: 0.4, characterFocus: 0.88, philosophical: 0.72,
      density: 0.45, intimacy: 0.98, worldbuilding: 0.35, moralComplexity: 0.6,
      narrativeExperimentation: 0.88, psychologicalIntensity: 0.72, humanism: 0.8, mythicScale: 0.35
    }
  },
  {
    id: 'pta',
    name: 'Paul Thomas Anderson',
    title: 'Student of Obsession, Family, and American Mythology',
    description: `You're attracted to ensemble complexity and the interior lives of people consumed by their own drives. PTA builds films around gravity â€” characters orbit each other with irresistible force, colliding in scenes of extraordinary emotional and dramatic density.`,
    gradient: TWIN_GRADIENTS.pta,
    signatureTraits: ['Character Depth', 'Emotionality', 'Moral Complexity', 'Density'],
    signatureMovies: [
      { id: 334,  title: 'Magnolia' },
      { id: 331,  title: 'There Will Be Blood' },
      { id: 1420, title: 'Boogie Nights' },
      { id: 65759,title: 'The Master' },
    ],
    vector: {
      imagination: 0.62, wonder: 0.72, complexity: 0.85, atmosphere: 0.85,
      emotionality: 0.97, realism: 0.82, ambiguity: 0.78, optimism: 0.55,
      darkness: 0.72, spectacle: 0.42, characterFocus: 0.95, philosophical: 0.85,
      density: 0.95, intimacy: 0.78, worldbuilding: 0.42, moralComplexity: 0.9,
      narrativeExperimentation: 0.82, psychologicalIntensity: 0.88, humanism: 0.88, mythicScale: 0.68
    }
  },
  {
    id: 'coen',
    name: 'Joel & Ethan Coen',
    title: 'Ironic Theologians of Fate and American Grotesque',
    description: `Your selections reveal a taste for moral ambiguity served cold. The Coens operate in the gap between genre and philosophy â€” noir, western, and black comedy become vehicles for questioning whether meaning exists at all. Their cinema rewards those who can sit with uncertainty.`,
    gradient: TWIN_GRADIENTS.coen,
    signatureTraits: ['Ambiguity', 'Moral Complexity', 'Atmosphere', 'Narrative Experimentation'],
    signatureMovies: [
      { id: 6977,  title: 'No Country for Old Men' },
      { id: 275,   title: 'Fargo' },
      { id: 1018,  title: 'The Big Lebowski' },
      { id: 45243, title: 'True Grit' },
    ],
    vector: {
      imagination: 0.65, wonder: 0.35, complexity: 0.85, atmosphere: 0.88,
      emotionality: 0.55, realism: 0.82, ambiguity: 0.97, optimism: 0.2,
      darkness: 0.85, spectacle: 0.45, characterFocus: 0.82, philosophical: 0.82,
      density: 0.72, intimacy: 0.55, worldbuilding: 0.48, moralComplexity: 0.97,
      narrativeExperimentation: 0.85, psychologicalIntensity: 0.75, humanism: 0.5, mythicScale: 0.55
    }
  },
  {
    id: 'gerwig',
    name: 'Greta Gerwig',
    title: 'Chronicler of Female Interiority and Honest Feeling',
    description: `You're drawn to films that locate the dramatic in the deeply personal â€” the interior worlds of characters caught between who they are and who they're expected to be. Gerwig makes cinema that refuses ironic distance, trusting sincerity as a radical act.`,
    gradient: TWIN_GRADIENTS.gerwig,
    signatureTraits: ['Intimacy', 'Humanism', 'Emotionality', 'Character Depth'],
    signatureMovies: [
      { id: 508439, title: 'Lady Bird' },
      { id: 331482, title: 'Little Women' },
      { id: 346698, title: 'Barbie' },
    ],
    vector: {
      imagination: 0.65, wonder: 0.78, complexity: 0.6, atmosphere: 0.72,
      emotionality: 0.95, realism: 0.82, ambiguity: 0.55, optimism: 0.72,
      darkness: 0.42, spectacle: 0.45, characterFocus: 0.95, philosophical: 0.72,
      density: 0.6, intimacy: 0.95, worldbuilding: 0.38, moralComplexity: 0.65,
      narrativeExperimentation: 0.65, psychologicalIntensity: 0.6, humanism: 0.95, mythicScale: 0.4
    }
  },
  {
    id: 'wesanderson',
    name: 'Wes Anderson',
    title: 'Curator of Melancholy, Symmetry, and Absurdist Grief',
    description: `Your selections suggest a viewer who finds emotional truth in constructed worlds. Anderson's cinema is a controlled paradise where every frame is a defense against chaos â€” style as emotional armor, whimsy as a way to approach unbearable sadness indirectly.`,
    gradient: TWIN_GRADIENTS.wesanderson,
    signatureTraits: ['Imagination', 'Atmosphere', 'Narrative Experimentation', 'Intimacy'],
    signatureMovies: [
      { id: 120467, title: 'The Grand Budapest Hotel' },
      { id: 38,     title: 'Rushmore' },
      { id: 14537,  title: 'Fantastic Mr. Fox' },
      { id: 108972, title: 'Moonrise Kingdom' },
    ],
    vector: {
      imagination: 0.95, wonder: 0.82, complexity: 0.6, atmosphere: 0.92,
      emotionality: 0.78, realism: 0.25, ambiguity: 0.6, optimism: 0.6,
      darkness: 0.5, spectacle: 0.65, characterFocus: 0.78, philosophical: 0.65,
      density: 0.68, intimacy: 0.82, worldbuilding: 0.72, moralComplexity: 0.55,
      narrativeExperimentation: 0.9, psychologicalIntensity: 0.45, humanism: 0.82, mythicScale: 0.42
    }
  },
  {
    id: 'malick',
    name: 'Terrence Malick',
    title: 'Transcendentalist of Nature, Grace, and Hidden Life',
    description: `You're drawn to cinema as meditation â€” films where narrative yields to image and image yields to feeling. Malick makes movies about the largest possible questions and refuses easy answers. His influence appears in any viewer who is moved by mystery before meaning.`,
    gradient: TWIN_GRADIENTS.malick,
    signatureTraits: ['Philosophical Depth', 'Atmosphere', 'Wonder', 'Ambiguity'],
    signatureMovies: [
      { id: 8967,  title: 'The Tree of Life' },
      { id: 8741,  title: 'The Thin Red Line' },
      { id: 1454,  title: 'Days of Heaven' },
      { id: 857,   title: 'Badlands' },
    ],
    vector: {
      imagination: 0.82, wonder: 0.92, complexity: 0.65, atmosphere: 0.97,
      emotionality: 0.82, realism: 0.55, ambiguity: 0.9, optimism: 0.65,
      darkness: 0.5, spectacle: 0.55, characterFocus: 0.62, philosophical: 0.98,
      density: 0.32, intimacy: 0.72, worldbuilding: 0.52, moralComplexity: 0.72,
      narrativeExperimentation: 0.85, psychologicalIntensity: 0.7, humanism: 0.92, mythicScale: 0.78
    }
  },
  {
    id: 'parkchanwook',
    name: 'Park Chan-wook',
    title: 'Sculptor of Vengeance, Beauty, and Moral Abyss',
    description: `Your selections favor cinema where moral order has collapsed and beauty becomes the language for describing the collapse. Park Chan-wook builds films of extraordinary visual sophistication around the most extreme human drives â€” revenge, obsession, desire, and disgust.`,
    gradient: TWIN_GRADIENTS.parkchanwook,
    signatureTraits: ['Moral Complexity', 'Psychological Intensity', 'Atmosphere', 'Darkness'],
    signatureMovies: [
      { id: 670,   title: 'Oldboy' },
      { id: 46738, title: 'The Handmaiden' },
      { id: 10344, title: 'Sympathy for Mr. Vengeance' },
      { id: 75564, title: 'Stoker' },
    ],
    vector: {
      imagination: 0.72, wonder: 0.28, complexity: 0.9, atmosphere: 0.95,
      emotionality: 0.78, realism: 0.65, ambiguity: 0.85, optimism: 0.15,
      darkness: 0.97, spectacle: 0.68, characterFocus: 0.85, philosophical: 0.82,
      density: 0.82, intimacy: 0.62, worldbuilding: 0.42, moralComplexity: 0.98,
      narrativeExperimentation: 0.88, psychologicalIntensity: 0.98, humanism: 0.45, mythicScale: 0.52
    }
  },
  {
    id: 'coppola',
    name: 'Francis Ford Coppola',
    title: 'Epic Chronicler of Power, Family, and American Tragedy',
    description: `You're drawn to films that operate at the intersection of the intimate and the mythic â€” family stories that become civilizational statements. Coppola's cinema treats loyalty and betrayal as forces as primal as nature, embedded in a world of almost operatic grandeur.`,
    gradient: TWIN_GRADIENTS.coppola,
    signatureTraits: ['Density', 'Moral Complexity', 'Character Depth', 'Mythic Scale'],
    signatureMovies: [
      { id: 238,  title: 'The Godfather' },
      { id: 240,  title: 'The Godfather Part II' },
      { id: 1579, title: 'Apocalypse Now' },
      { id: 11622,title: 'The Conversation' },
    ],
    vector: {
      imagination: 0.52, wonder: 0.55, complexity: 0.88, atmosphere: 0.88,
      emotionality: 0.82, realism: 0.8, ambiguity: 0.72, optimism: 0.3,
      darkness: 0.85, spectacle: 0.72, characterFocus: 0.88, philosophical: 0.75,
      density: 0.95, intimacy: 0.62, worldbuilding: 0.55, moralComplexity: 0.95,
      narrativeExperimentation: 0.58, psychologicalIntensity: 0.82, humanism: 0.72, mythicScale: 0.92
    }
  },
  {
    id: 'cuaron',
    name: 'Alfonso CuarÃ³n',
    title: 'Humanist of Loss, Survival, and the Body in the World',
    description: `Your selections consistently valued films grounded in physical and emotional authenticity. CuarÃ³n's cinema is defined by the body â€” people moving through space with weight and consequence. His films are profound precisely because they refuse to aestheticize suffering.`,
    gradient: TWIN_GRADIENTS.cuaron,
    signatureTraits: ['Realism', 'Humanism', 'Emotionality', 'Atmosphere'],
    signatureMovies: [
      { id: 426426, title: 'Roma' },
      { id: 402,    title: 'Children of Men' },
      { id: 9054,   title: 'Y Tu MamÃ¡ TambiÃ©n' },
      { id: 1995,   title: 'Gravity' },
    ],
    vector: {
      imagination: 0.5, wonder: 0.68, complexity: 0.6, atmosphere: 0.9,
      emotionality: 0.88, realism: 0.97, ambiguity: 0.62, optimism: 0.52,
      darkness: 0.55, spectacle: 0.68, characterFocus: 0.88, philosophical: 0.75,
      density: 0.58, intimacy: 0.88, worldbuilding: 0.45, moralComplexity: 0.68,
      narrativeExperimentation: 0.52, psychologicalIntensity: 0.65, humanism: 0.97, mythicScale: 0.55
    }
  },
  {
    id: 'tarantino',
    name: 'Quentin Tarantino',
    title: 'Maximalist of Genre, Dialogue, and Cinematic Memory',
    description: `You're drawn to cinema that operates as a love letter to cinema itself â€” movies that are aware of every film that came before them and remix that history into something thrillingly new. Tarantino's world is one where style, moral ambivalence, and sheer audacity coexist.`,
    gradient: TWIN_GRADIENTS.tarantino,
    signatureTraits: ['Narrative Experimentation', 'Ambiguity', 'Darkness', 'Moral Complexity'],
    signatureMovies: [
      { id: 680,  title: 'Pulp Fiction' },
      { id: 68718,title: 'Django Unchained' },
      { id: 400,  title: 'Jackie Brown' },
      { id: 301,  title: 'Kill Bill: Vol. 1' },
    ],
    vector: {
      imagination: 0.75, wonder: 0.42, complexity: 0.82, atmosphere: 0.82,
      emotionality: 0.62, realism: 0.68, ambiguity: 0.88, optimism: 0.38,
      darkness: 0.85, spectacle: 0.78, characterFocus: 0.82, philosophical: 0.65,
      density: 0.72, intimacy: 0.55, worldbuilding: 0.42, moralComplexity: 0.9,
      narrativeExperimentation: 0.95, psychologicalIntensity: 0.72, humanism: 0.48, mythicScale: 0.52
    }
  },
  {
    id: 'lynch',
    name: 'David Lynch',
    title: 'Surrealist of Dreams, Dread, and the American Uncanny',
    description: `Your selections suggest a viewer comfortable operating in the space where logic dissolves. Lynch makes cinema from the subconscious â€” images that feel remembered rather than invented, dread that arrives before its cause. His work rewards those who can hold meaning loosely.`,
    gradient: TWIN_GRADIENTS.lynch,
    signatureTraits: ['Ambiguity', 'Psychological Intensity', 'Atmosphere', 'Imagination'],
    signatureMovies: [
      { id: 1018,  title: 'Mulholland Drive' },
      { id: 722,   title: 'Blue Velvet' },
      { id: 2204,  title: 'Lost Highway' },
      { id: 10110, title: 'Eraserhead' },
    ],
    vector: {
      imagination: 0.97, wonder: 0.42, complexity: 0.92, atmosphere: 0.98,
      emotionality: 0.62, realism: 0.25, ambiguity: 0.98, optimism: 0.18,
      darkness: 0.88, spectacle: 0.38, characterFocus: 0.78, philosophical: 0.88,
      density: 0.6, intimacy: 0.62, worldbuilding: 0.52, moralComplexity: 0.78,
      narrativeExperimentation: 0.97, psychologicalIntensity: 0.97, humanism: 0.45, mythicScale: 0.55
    }
  },
  {
    id: 'tarkovsky',
    name: 'Andrei Tarkovsky',
    title: 'Philosopher of Time, Memory, and Spiritual Yearning',
    description: `You're drawn to cinema as a meditative practice â€” films that move at the speed of thought and demand a different kind of attention. Tarkovsky believed cinema's highest purpose was the sculpting of time itself. His work speaks to those who seek transcendence in the act of watching.`,
    gradient: TWIN_GRADIENTS.tarkovsky,
    signatureTraits: ['Philosophical Depth', 'Atmosphere', 'Ambiguity', 'Wonder'],
    signatureMovies: [
      { id: 1398,  title: 'Stalker' },
      { id: 11362, title: 'Solaris' },
      { id: 11399, title: 'Andrei Rublev' },
      { id: 55925, title: 'The Mirror' },
    ],
    vector: {
      imagination: 0.78, wonder: 0.75, complexity: 0.72, atmosphere: 0.98,
      emotionality: 0.65, realism: 0.62, ambiguity: 0.97, optimism: 0.42,
      darkness: 0.65, spectacle: 0.2, characterFocus: 0.7, philosophical: 0.98,
      density: 0.38, intimacy: 0.72, worldbuilding: 0.72, moralComplexity: 0.75,
      narrativeExperimentation: 0.82, psychologicalIntensity: 0.75, humanism: 0.82, mythicScale: 0.65
    }
  },
  {
    id: 'sofiacoppola',
    name: 'Sofia Coppola',
    title: 'Elegist of Disconnection, Privilege, and Quiet Longing',
    description: `Your selections suggest a viewer tuned to the eloquence of what goes unsaid. Coppola's cinema operates in the register of ennui â€” characters adrift in beautiful surroundings, unable to access the feeling they're searching for. This is cinema about the texture of emotional absence.`,
    gradient: TWIN_GRADIENTS.sofiacoppola,
    signatureTraits: ['Atmosphere', 'Intimacy', 'Ambiguity', 'Emotionality'],
    signatureMovies: [
      { id: 153,   title: 'Lost in Translation' },
      { id: 9292,  title: 'The Virgin Suicides' },
      { id: 9398,  title: 'Marie Antoinette' },
      { id: 115526,title: 'Somewhere' },
    ],
    vector: {
      imagination: 0.35, wonder: 0.62, complexity: 0.45, atmosphere: 0.95,
      emotionality: 0.88, realism: 0.88, ambiguity: 0.82, optimism: 0.52,
      darkness: 0.42, spectacle: 0.18, characterFocus: 0.92, philosophical: 0.72,
      density: 0.45, intimacy: 0.97, worldbuilding: 0.22, moralComplexity: 0.55,
      narrativeExperimentation: 0.58, psychologicalIntensity: 0.52, humanism: 0.88, mythicScale: 0.18
    }
  },
  {
    id: 'kaufman',
    name: 'Charlie Kaufman',
    title: 'Cartographer of Consciousness, Regret, and Self-Erasure',
    description: `You gravitate toward films that make the structure of consciousness itself the subject. Kaufman makes movies about the impossibility of the self â€” identity as performance, memory as fiction, love as a system that defeats itself. His cinema is for those who live too much inside their own heads.`,
    gradient: TWIN_GRADIENTS.kaufman,
    signatureTraits: ['Philosophical Depth', 'Narrative Experimentation', 'Ambiguity', 'Psychological Intensity'],
    signatureMovies: [
      { id: 38,    title: 'Eternal Sunshine of the Spotless Mind' },
      { id: 14574, title: 'Synecdoche, New York' },
      { id: 397,   title: 'Being John Malkovich' },
      { id: 508439,title: 'I\'m Thinking of Ending Things' },
    ],
    vector: {
      imagination: 0.92, wonder: 0.48, complexity: 0.95, atmosphere: 0.88,
      emotionality: 0.78, realism: 0.45, ambiguity: 0.97, optimism: 0.22,
      darkness: 0.75, spectacle: 0.25, characterFocus: 0.82, philosophical: 0.97,
      density: 0.7, intimacy: 0.72, worldbuilding: 0.55, moralComplexity: 0.72,
      narrativeExperimentation: 0.98, psychologicalIntensity: 0.92, humanism: 0.65, mythicScale: 0.35
    }
  },
  {
    id: 'aronofsky',
    name: 'Darren Aronofsky',
    title: 'Chronicler of Obsession, Bodily Collapse, and Transcendence',
    description: `Your selections favor cinema that locates the spiritual inside the physical â€” the body as battlefield for the soul. Aronofsky's films follow characters who pursue transcendence through destruction, their obsessions simultaneously a reaching toward the divine and a fall from it.`,
    gradient: TWIN_GRADIENTS.aronofsky,
    signatureTraits: ['Psychological Intensity', 'Darkness', 'Emotionality', 'Atmosphere'],
    signatureMovies: [
      { id: 4988,  title: 'Requiem for a Dream' },
      { id: 14019, title: 'Black Swan' },
      { id: 4133,  title: 'The Wrestler' },
      { id: 414,   title: 'Pi' },
    ],
    vector: {
      imagination: 0.72, wonder: 0.4, complexity: 0.78, atmosphere: 0.92,
      emotionality: 0.95, realism: 0.75, ambiguity: 0.72, optimism: 0.15,
      darkness: 0.95, spectacle: 0.62, characterFocus: 0.9, philosophical: 0.78,
      density: 0.72, intimacy: 0.65, worldbuilding: 0.38, moralComplexity: 0.82,
      narrativeExperimentation: 0.75, psychologicalIntensity: 0.98, humanism: 0.55, mythicScale: 0.62
    }
  },
  {
    id: 'linklater',
    name: 'Richard Linklater',
    title: 'Philosopher of Conversation, Time, and Everyday Life',
    description: `You're drawn to cinema that finds the infinite in the quotidian â€” films where a conversation becomes a meditation on what it means to be alive. Linklater's work rewards patience and a belief that ordinary experience contains the most important truths.`,
    gradient: TWIN_GRADIENTS.linklater,
    signatureTraits: ['Intimacy', 'Realism', 'Philosophical Depth', 'Humanism'],
    signatureMovies: [
      { id: 98,    title: 'Before Sunrise' },
      { id: 873,   title: 'Before Sunset' },
      { id: 481,   title: 'Dazed and Confused' },
      { id: 253885,title: 'Boyhood' },
    ],
    vector: {
      imagination: 0.38, wonder: 0.72, complexity: 0.55, atmosphere: 0.72,
      emotionality: 0.88, realism: 0.95, ambiguity: 0.68, optimism: 0.72,
      darkness: 0.35, spectacle: 0.18, characterFocus: 0.92, philosophical: 0.88,
      density: 0.45, intimacy: 0.97, worldbuilding: 0.25, moralComplexity: 0.58,
      narrativeExperimentation: 0.72, psychologicalIntensity: 0.48, humanism: 0.97, mythicScale: 0.28
    }
  },
  {
    id: 'deltoro',
    name: 'Guillermo del Toro',
    title: 'Mythmaker of Monsters, Magic, and Wounded Innocence',
    description: `You're drawn to cinema where the fantastical and the political coexist â€” where monsters are real and reality is monstrous. Del Toro builds worlds of extraordinary imagination in service of deep emotional truths about childhood, fascism, and the cost of leaving the fantastical world behind.`,
    gradient: TWIN_GRADIENTS.deltoro,
    signatureTraits: ['Imagination', 'Wonder', 'Darkness', 'Worldbuilding'],
    signatureMovies: [
      { id: 1634,  title: "Pan's Labyrinth" },
      { id: 399055,title: 'The Shape of Water' },
      { id: 8055,  title: "The Devil's Backbone" },
      { id: 36668, title: 'Crimson Peak' },
    ],
    vector: {
      imagination: 0.97, wonder: 0.88, complexity: 0.72, atmosphere: 0.92,
      emotionality: 0.82, realism: 0.28, ambiguity: 0.65, optimism: 0.55,
      darkness: 0.82, spectacle: 0.85, characterFocus: 0.72, philosophical: 0.75,
      density: 0.62, intimacy: 0.55, worldbuilding: 0.97, moralComplexity: 0.72,
      narrativeExperimentation: 0.58, psychologicalIntensity: 0.75, humanism: 0.82, mythicScale: 0.92
    }
  },
  {
    id: 'ozu',
    name: 'YasujirÅ Ozu',
    title: 'Master of Impermanence, Family, and Quiet Grief',
    description: `Your selections suggest a viewer drawn to the eloquence of stillness. Ozu's cinema is built on restraint â€” the most devastating moments happen off-screen, grief is communicated through a lowered gaze and a held cup of sake. This is cinema for those who understand that less is always more.`,
    gradient: TWIN_GRADIENTS.ozu,
    signatureTraits: ['Intimacy', 'Humanism', 'Realism', 'Character Depth'],
    signatureMovies: [
      { id: 12453,  title: 'Tokyo Story' },
      { id: 105733, title: 'Late Spring' },
      { id: 54406,  title: 'Good Morning' },
    ],
    vector: {
      imagination: 0.22, wonder: 0.65, complexity: 0.52, atmosphere: 0.75,
      emotionality: 0.92, realism: 0.98, ambiguity: 0.62, optimism: 0.62,
      darkness: 0.42, spectacle: 0.12, characterFocus: 0.97, philosophical: 0.78,
      density: 0.62, intimacy: 0.98, worldbuilding: 0.18, moralComplexity: 0.6,
      narrativeExperimentation: 0.35, psychologicalIntensity: 0.48, humanism: 0.98, mythicScale: 0.22
    }
  },
  {
    id: 'vonTrier',
    name: 'Lars von Trier',
    title: 'Provocateur of Suffering, Faith, and Cinema as Wound',
    description: `You gravitate toward cinema that refuses the comforts of resolution. Von Trier makes films that behave like open wounds â€” formally radical, emotionally punishing, and philosophically unanswerable. His work is for viewers who believe that art's highest purpose is to disturb.`,
    gradient: TWIN_GRADIENTS.vonTrier,
    signatureTraits: ['Darkness', 'Psychological Intensity', 'Narrative Experimentation', 'Ambiguity'],
    signatureMovies: [
      { id: 573,   title: 'Breaking the Waves' },
      { id: 10959, title: 'Dancer in the Dark' },
      { id: 58411, title: 'Melancholia' },
      { id: 71859, title: 'Nymphomaniac' },
    ],
    vector: {
      imagination: 0.65, wonder: 0.28, complexity: 0.82, atmosphere: 0.88,
      emotionality: 0.97, realism: 0.72, ambiguity: 0.88, optimism: 0.08,
      darkness: 0.98, spectacle: 0.45, characterFocus: 0.88, philosophical: 0.85,
      density: 0.65, intimacy: 0.72, worldbuilding: 0.35, moralComplexity: 0.88,
      narrativeExperimentation: 0.92, psychologicalIntensity: 0.97, humanism: 0.48, mythicScale: 0.52
    }
  },
  {
    id: 'spikejonze',
    name: 'Spike Jonze',
    title: 'Inventor of Tender, Weird, and Emotionally True Worlds',
    description: `Your selections suggest a viewer for whom emotional authenticity and conceptual audacity are not in conflict. Jonze makes films where the strangest premises become vehicles for the most honest feelings â€” technology, absence, and connection as surfaces for the same universal yearning.`,
    gradient: TWIN_GRADIENTS.spikejonze,
    signatureTraits: ['Imagination', 'Emotionality', 'Intimacy', 'Philosophical Depth'],
    signatureMovies: [
      { id: 152601,title: 'Her' },
      { id: 397,   title: 'Being John Malkovich' },
      { id: 22794, title: 'Where the Wild Things Are' },
    ],
    vector: {
      imagination: 0.9, wonder: 0.82, complexity: 0.68, atmosphere: 0.85,
      emotionality: 0.93, realism: 0.58, ambiguity: 0.65, optimism: 0.72,
      darkness: 0.42, spectacle: 0.42, characterFocus: 0.95, philosophical: 0.88,
      density: 0.6, intimacy: 0.92, worldbuilding: 0.72, moralComplexity: 0.62,
      narrativeExperimentation: 0.85, psychologicalIntensity: 0.72, humanism: 0.95, mythicScale: 0.45
    }
  },
  {
    id: 'ariaster',
    name: 'Ari Aster',
    title: 'Excavator of Grief, Dread, and Familial Rupture',
    description: `You're drawn to cinema where psychological horror is inseparable from emotional devastation. Aster makes films about what happens when grief has nowhere to go â€” they become forces that restructure reality itself, horror as the natural consequence of unbearable feeling.`,
    gradient: TWIN_GRADIENTS.ariaster,
    signatureTraits: ['Psychological Intensity', 'Darkness', 'Atmosphere', 'Ambiguity'],
    signatureMovies: [
      { id: 480530, title: 'Hereditary' },
      { id: 530385, title: 'Midsommar' },
      { id: 845111, title: 'Beau Is Afraid' },
    ],
    vector: {
      imagination: 0.72, wonder: 0.22, complexity: 0.82, atmosphere: 0.95,
      emotionality: 0.88, realism: 0.65, ambiguity: 0.88, optimism: 0.1,
      darkness: 0.97, spectacle: 0.55, characterFocus: 0.88, philosophical: 0.8,
      density: 0.72, intimacy: 0.65, worldbuilding: 0.52, moralComplexity: 0.82,
      narrativeExperimentation: 0.78, psychologicalIntensity: 0.98, humanism: 0.48, mythicScale: 0.62
    }
  },
  {
    id: 'jordanpeele',
    name: 'Jordan Peele',
    title: 'Engineer of Social Horror and Racial Allegory',
    description: `Your selections show an appetite for films where genre mechanics become vessels for social analysis. Peele uses horror to render visible what's already there â€” structural violence, psychic terror, systemic dehumanization â€” repackaged in a form that is impossible to look away from.`,
    gradient: TWIN_GRADIENTS.jordanpeele,
    signatureTraits: ['Psychological Intensity', 'Moral Complexity', 'Atmosphere', 'Ambiguity'],
    signatureMovies: [
      { id: 419430, title: 'Get Out' },
      { id: 560144, title: 'Us' },
      { id: 762504, title: 'Nope' },
    ],
    vector: {
      imagination: 0.72, wonder: 0.42, complexity: 0.82, atmosphere: 0.92,
      emotionality: 0.75, realism: 0.72, ambiguity: 0.85, optimism: 0.28,
      darkness: 0.88, spectacle: 0.68, characterFocus: 0.82, philosophical: 0.82,
      density: 0.68, intimacy: 0.55, worldbuilding: 0.52, moralComplexity: 0.92,
      narrativeExperimentation: 0.78, psychologicalIntensity: 0.92, humanism: 0.62, mythicScale: 0.55
    }
  },
  {
    id: 'eggers',
    name: 'Robert Eggers',
    title: 'Antiquarian of Dread, Folklore, and Historical Abyss',
    description: `You're drawn to cinema where atmosphere is architecture â€” worlds so completely realized that the horror feels inevitable rather than imposed. Eggers makes films about isolation and the uncanny, period pieces that feel like recovered documents from a past that never stopped being terrifying.`,
    gradient: TWIN_GRADIENTS.eggers,
    signatureTraits: ['Atmosphere', 'Darkness', 'Ambiguity', 'Worldbuilding'],
    signatureMovies: [
      { id: 318846, title: 'The Witch' },
      { id: 564559, title: 'The Lighthouse' },
      { id: 736073, title: 'The Northman' },
    ],
    vector: {
      imagination: 0.75, wonder: 0.35, complexity: 0.75, atmosphere: 0.98,
      emotionality: 0.72, realism: 0.65, ambiguity: 0.88, optimism: 0.12,
      darkness: 0.95, spectacle: 0.62, characterFocus: 0.78, philosophical: 0.82,
      density: 0.68, intimacy: 0.55, worldbuilding: 0.9, moralComplexity: 0.78,
      narrativeExperimentation: 0.65, psychologicalIntensity: 0.9, humanism: 0.42, mythicScale: 0.85
    }
  },
  {
    id: 'spielberg',
    name: 'Steven Spielberg',
    title: 'Master of Wonder, Spectacle, and Emotional Truth',
    description: `Your selections favor films that operate across the full emotional register â€” wonder and terror, spectacle and intimacy, myth and personal truth. Spielberg understands that the largest cinematic experiences are built from the smallest human feelings.`,
    gradient: TWIN_GRADIENTS.spielberg,
    signatureTraits: ['Wonder', 'Spectacle', 'Humanism', 'Mythic Scale'],
    signatureMovies: [
      { id: 578,   title: 'Schindler\'s List' },
      { id: 423,   title: 'Saving Private Ryan' },
      { id: 328,   title: 'E.T. the Extra-Terrestrial' },
      { id: 9693,  title: 'Jaws' },
    ],
    vector: {
      imagination: 0.78, wonder: 0.95, complexity: 0.65, atmosphere: 0.78,
      emotionality: 0.92, realism: 0.72, ambiguity: 0.48, optimism: 0.78,
      darkness: 0.6, spectacle: 0.95, characterFocus: 0.82, philosophical: 0.65,
      density: 0.62, intimacy: 0.72, worldbuilding: 0.72, moralComplexity: 0.72,
      narrativeExperimentation: 0.45, psychologicalIntensity: 0.68, humanism: 0.9, mythicScale: 0.92
    }
  },
  {
    id: 'schrader',
    name: 'Paul Schrader',
    title: 'Theologian of Guilt, Isolation, and Transcendence Through Suffering',
    description: `You're drawn to films built around a single consciousness consuming itself. Schrader's screenplays and films operate in the space between religious guilt and secular violence â€” his protagonists are men who have decided that the world is wrong about them, or vice versa.`,
    gradient: TWIN_GRADIENTS.schrader,
    signatureTraits: ['Psychological Intensity', 'Darkness', 'Philosophical Depth', 'Realism'],
    signatureMovies: [
      { id: 11216,title: 'Taxi Driver' },
      { id: 51994,title: 'First Reformed' },
      { id: 9568, title: 'American Gigolo' },
      { id: 10475,title: 'Hardcore' },
    ],
    vector: {
      imagination: 0.35, wonder: 0.22, complexity: 0.72, atmosphere: 0.88,
      emotionality: 0.78, realism: 0.88, ambiguity: 0.78, optimism: 0.12,
      darkness: 0.97, spectacle: 0.32, characterFocus: 0.92, philosophical: 0.95,
      density: 0.6, intimacy: 0.65, worldbuilding: 0.28, moralComplexity: 0.9,
      narrativeExperimentation: 0.52, psychologicalIntensity: 0.97, humanism: 0.42, mythicScale: 0.38
    }
  },
  {
    id: 'gondry',
    name: 'Michel Gondry',
    title: 'Handcraft Inventor of Memory, Love, and Tender Absurdism',
    description: `Your selections reveal a viewer who values emotional sincerity over formal coolness. Gondry makes films about the workings of memory and desire using techniques that feel handmade â€” lo-fi poetry where imagination substitutes for resources and feeling substitutes for explanation.`,
    gradient: TWIN_GRADIENTS.gondry,
    signatureTraits: ['Imagination', 'Wonder', 'Intimacy', 'Narrative Experimentation'],
    signatureMovies: [
      { id: 38,    title: 'Eternal Sunshine of the Spotless Mind' },
      { id: 40562, title: 'The Science of Sleep' },
      { id: 9340,  title: 'Be Kind Rewind' },
    ],
    vector: {
      imagination: 0.95, wonder: 0.9, complexity: 0.55, atmosphere: 0.8,
      emotionality: 0.92, realism: 0.38, ambiguity: 0.65, optimism: 0.78,
      darkness: 0.38, spectacle: 0.38, characterFocus: 0.88, philosophical: 0.72,
      density: 0.45, intimacy: 0.92, worldbuilding: 0.62, moralComplexity: 0.48,
      narrativeExperimentation: 0.92, psychologicalIntensity: 0.55, humanism: 0.92, mythicScale: 0.32
    }
  },
  {
    id: 'ridleyscott',
    name: 'Ridley Scott',
    title: 'World-Builder of Myth, Commerce, and Elegant Spectacle',
    description: `You're drawn to cinema where production design becomes a philosophical argument and genre becomes mythology. Scott builds immersive worlds with unparalleled conviction, films where the visual imagination operates at a scale few directors have attempted or achieved.`,
    gradient: TWIN_GRADIENTS.ridleyscott,
    signatureTraits: ['Worldbuilding', 'Atmosphere', 'Spectacle', 'Mythic Scale'],
    signatureMovies: [
      { id: 78,     title: 'Blade Runner' },
      { id: 348,    title: 'Alien' },
      { id: 1091,   title: 'Gladiator' },
      { id: 99861,  title: 'The Martian' },
    ],
    vector: {
      imagination: 0.88, wonder: 0.62, complexity: 0.65, atmosphere: 0.9,
      emotionality: 0.62, realism: 0.55, ambiguity: 0.55, optimism: 0.5,
      darkness: 0.72, spectacle: 0.95, characterFocus: 0.65, philosophical: 0.68,
      density: 0.62, intimacy: 0.42, worldbuilding: 0.97, moralComplexity: 0.65,
      narrativeExperimentation: 0.42, psychologicalIntensity: 0.68, humanism: 0.62, mythicScale: 0.92
    }
  },
];

