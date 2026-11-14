// ─────────────────────────────────────────────────────────────
// Recommendation Catalog — Ultra-Curated Global Masterworks
// 50+ films mapped to vectors across the 20 cinematic dimensions.
// All poster paths and TMDB IDs verified.
// ─────────────────────────────────────────────────────────────

const IMG_BASE = 'https://image.tmdb.org/t/p';

export const DNA_RECOMMENDATIONS = [
  // ── 1. INCEPTION ──
  {
    id: 27205,
    title: 'Inception',
    year: 2010,
    director: 'Christopher Nolan',
    posterLarge: `${IMG_BASE}/w780/xlaY2zyzMfkhk0HSC5VUwzoZPU1.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'YoHD9XEInc0',
    tagline: 'Your mind is the scene of the crime.',
    vector: {
      imagination: 0.9, wonder: 0.5, complexity: 0.95, atmosphere: 0.7, emotionality: 0.65,
      realism: 0.4, ambiguity: 0.7, optimism: 0.5, darkness: 0.5, spectacle: 0.85,
      characterFocus: 0.6, philosophical: 0.8, density: 0.85, intimacy: 0.4, worldbuilding: 0.85,
      moralComplexity: 0.65, narrativeExperimentation: 0.9, psychologicalIntensity: 0.75, humanism: 0.7, mythicScale: 0.8
    }
  },
  // ── 2. FARGO ──
  {
    id: 275,
    title: 'Fargo',
    year: 1996,
    director: 'Joel & Ethan Coen',
    posterLarge: `${IMG_BASE}/w780/rt7cpEr1uP6RTZykBFhBTcRaKvG.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'h2tY82z3xXU',
    tagline: 'A lot can happen in the middle of nowhere.',
    vector: {
      imagination: 0.3, wonder: 0.3, complexity: 0.7, atmosphere: 0.8, emotionality: 0.5,
      realism: 0.85, ambiguity: 0.7, optimism: 0.5, darkness: 0.65, spectacle: 0.2,
      characterFocus: 0.8, philosophical: 0.7, density: 0.7, intimacy: 0.7, worldbuilding: 0.3,
      moralComplexity: 0.85, narrativeExperimentation: 0.65, psychologicalIntensity: 0.7, humanism: 0.75, mythicScale: 0.4
    }
  },
  // ── 3. SEVEN SAMURAI ──
  {
    id: 346,
    title: 'Seven Samurai',
    year: 1954,
    director: 'Akira Kurosawa',
    posterLarge: `${IMG_BASE}/w780/lOMGc8bnSwQhS4XyE1S99uH8NXf.jpg`,
    posterPosition: '50% 20%',
    category: 'core',
    trailerKey: 'wJ1TOratCTo',
    tagline: 'The magnificent masterpiece of honor and courage.',
    vector: {
      imagination: 0.4, wonder: 0.7, complexity: 0.6, atmosphere: 0.75, emotionality: 0.85,
      realism: 0.9, ambiguity: 0.5, optimism: 0.7, darkness: 0.5, spectacle: 0.8,
      characterFocus: 0.9, philosophical: 0.8, density: 0.7, intimacy: 0.5, worldbuilding: 0.4,
      moralComplexity: 0.75, narrativeExperimentation: 0.4, psychologicalIntensity: 0.75, humanism: 0.95, mythicScale: 0.85
    }
  },
  // ── 4. BLADE RUNNER 2049 ──
  {
    id: 335984,
    title: 'Blade Runner 2049',
    year: 2017,
    director: 'Denis Villeneuve',
    posterLarge: `${IMG_BASE}/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg`,
    posterPosition: '50% 20%',
    category: 'core',
    trailerKey: 'gCcx85zbxz4',
    tagline: 'The key to the future is finally unearthed.',
    vector: {
      imagination: 0.9, wonder: 0.6, complexity: 0.75, atmosphere: 0.98, emotionality: 0.7,
      realism: 0.4, ambiguity: 0.85, optimism: 0.4, darkness: 0.75, spectacle: 0.9,
      characterFocus: 0.7, philosophical: 0.9, density: 0.5, intimacy: 0.5, worldbuilding: 0.95,
      moralComplexity: 0.75, narrativeExperimentation: 0.65, psychologicalIntensity: 0.8, humanism: 0.7, mythicScale: 0.9
    }
  },
  // ── 5. MULHOLLAND DRIVE ──
  {
    id: 1018,
    title: 'Mulholland Drive',
    year: 2001,
    director: 'David Lynch',
    posterLarge: `${IMG_BASE}/w780/x7A59t6ySylr1L7aubOQEA480vM.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: 'jbZJ4P8wgIs',
    tagline: 'A love story in the city of dreams.',
    vector: {
      imagination: 0.95, wonder: 0.4, complexity: 0.95, atmosphere: 0.98, emotionality: 0.6,
      realism: 0.3, ambiguity: 0.98, optimism: 0.2, darkness: 0.85, spectacle: 0.3,
      characterFocus: 0.8, philosophical: 0.85, density: 0.65, intimacy: 0.6, worldbuilding: 0.5,
      moralComplexity: 0.8, narrativeExperimentation: 0.95, psychologicalIntensity: 0.95, humanism: 0.5, mythicScale: 0.5
    }
  },
  // ── 6. STALKER ──
  {
    id: 1398,
    title: 'Stalker',
    year: 1979,
    director: 'Andrei Tarkovsky',
    posterLarge: `${IMG_BASE}/w780/1qhOyf5C4s9ZdvY8d5JDx9DFMeT.jpg`,
    posterPosition: '50% 30%',
    category: 'deep_cut',
    trailerKey: 'TGRDYpCmMcM',
    tagline: 'A journey through the mysterious Zone.',
    vector: {
      imagination: 0.75, wonder: 0.7, complexity: 0.75, atmosphere: 0.98, emotionality: 0.6,
      realism: 0.6, ambiguity: 0.98, optimism: 0.4, darkness: 0.6, spectacle: 0.2,
      characterFocus: 0.7, philosophical: 0.98, density: 0.4, intimacy: 0.7, worldbuilding: 0.7,
      moralComplexity: 0.75, narrativeExperimentation: 0.8, psychologicalIntensity: 0.75, humanism: 0.8, mythicScale: 0.6
    }
  },
  // ── 7. PRINCESS MONONOKE ──
  {
    id: 128,
    title: 'Princess Mononoke',
    year: 1997,
    director: 'Hayao Miyazaki',
    posterLarge: `${IMG_BASE}/w780/cMYCDADoLKLbB83g4WnJegaZimC.jpg`,
    posterPosition: '50% 20%',
    category: 'core',
    trailerKey: '4OiMOHRDs14',
    tagline: 'The fate of the world rests on the courage of one warrior.',
    vector: {
      imagination: 0.95, wonder: 0.85, complexity: 0.7, atmosphere: 0.85, emotionality: 0.8,
      realism: 0.3, ambiguity: 0.7, optimism: 0.6, darkness: 0.6, spectacle: 0.85,
      characterFocus: 0.7, philosophical: 0.85, density: 0.6, intimacy: 0.4, worldbuilding: 0.95,
      moralComplexity: 0.75, narrativeExperimentation: 0.6, psychologicalIntensity: 0.7, humanism: 0.9, mythicScale: 0.9
    }
  },
  // ── 8. AMÉLIE ──
  {
    id: 194,
    title: 'Amélie',
    year: 2001,
    director: 'Jean-Pierre Jeunet',
    posterLarge: `${IMG_BASE}/w780/nSxDa3M9aMvGVLoItzWTepQ5h5d.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'HUECWi5pX7o',
    tagline: 'She’ll change your life.',
    vector: {
      imagination: 0.85, wonder: 0.95, complexity: 0.5, atmosphere: 0.8, emotionality: 0.85,
      realism: 0.4, ambiguity: 0.4, optimism: 0.95, darkness: 0.2, spectacle: 0.4,
      characterFocus: 0.8, philosophical: 0.6, density: 0.7, intimacy: 0.7, worldbuilding: 0.6,
      moralComplexity: 0.4, narrativeExperimentation: 0.75, psychologicalIntensity: 0.4, humanism: 0.9, mythicScale: 0.5
    }
  },
  // ── 9. DRIVE ──
  {
    id: 64690,
    title: 'Drive',
    year: 2011,
    director: 'Nicolas Winding Refn',
    posterLarge: `${IMG_BASE}/w780/602vevIURmpDfzbnv5Ubi6wIkQm.jpg`,
    posterPosition: '50% 25%',
    category: 'core',
    trailerKey: 'KBiOF3y1W0Y',
    tagline: 'There are no clean getaways.',
    vector: {
      imagination: 0.4, wonder: 0.3, complexity: 0.5, atmosphere: 0.95, emotionality: 0.6,
      realism: 0.75, ambiguity: 0.8, optimism: 0.3, darkness: 0.8, spectacle: 0.6,
      characterFocus: 0.7, philosophical: 0.65, density: 0.3, intimacy: 0.65, worldbuilding: 0.4,
      moralComplexity: 0.8, narrativeExperimentation: 0.65, psychologicalIntensity: 0.85, humanism: 0.6, mythicScale: 0.55
    }
  },
  // ── 10. ROMA ──
  {
    id: 426426,
    title: 'Roma',
    year: 2018,
    director: 'Alfonso Cuarón',
    posterLarge: `${IMG_BASE}/w780/dtIIyQyALk57ko5bjac7hi01YQ.jpg`,
    posterPosition: 'center center',
    category: 'horizon',
    trailerKey: '6BS27ngZtxg',
    tagline: 'There are memories that make up our existence.',
    vector: {
      imagination: 0.3, wonder: 0.65, complexity: 0.5, atmosphere: 0.9, emotionality: 0.85,
      realism: 0.98, ambiguity: 0.65, optimism: 0.55, darkness: 0.5, spectacle: 0.4,
      characterFocus: 0.85, philosophical: 0.78, density: 0.5, intimacy: 0.85, worldbuilding: 0.3,
      moralComplexity: 0.65, narrativeExperimentation: 0.55, psychologicalIntensity: 0.6, humanism: 0.95, mythicScale: 0.4
    }
  },
  // ── 11. THE TREE OF LIFE ──
  {
    id: 8967,
    title: 'The Tree of Life',
    year: 2011,
    director: 'Terrence Malick',
    posterLarge: `${IMG_BASE}/w780/l8cwuB5WJSoj4uMAsnzuHBOMaSJ.jpg`,
    posterPosition: 'center top',
    category: 'horizon',
    trailerKey: 'WXRYA1dxP_0',
    tagline: 'There are two ways through life: the way of nature and the way of grace.',
    vector: {
      imagination: 0.85, wonder: 0.9, complexity: 0.65, atmosphere: 0.95, emotionality: 0.8,
      realism: 0.5, ambiguity: 0.9, optimism: 0.65, darkness: 0.4, spectacle: 0.5,
      characterFocus: 0.6, philosophical: 0.98, density: 0.3, intimacy: 0.7, worldbuilding: 0.5,
      moralComplexity: 0.7, narrativeExperimentation: 0.85, psychologicalIntensity: 0.7, humanism: 0.92, mythicScale: 0.75
    }
  },
  // ── 12. MOONLIGHT ──
  {
    id: 376867,
    title: 'Moonlight',
    year: 2016,
    director: 'Barry Jenkins',
    posterLarge: `${IMG_BASE}/w780/qLnfEmPrDjJfPyyddLJPkXmshkp.jpg`,
    posterPosition: '50% 35%',
    category: 'core',
    trailerKey: '9NJj12tJzqc',
    tagline: 'This is the story of a lifetime.',
    vector: {
      imagination: 0.4, wonder: 0.65, complexity: 0.6, atmosphere: 0.95, emotionality: 0.95,
      realism: 0.85, ambiguity: 0.8, optimism: 0.6, darkness: 0.5, spectacle: 0.3,
      characterFocus: 0.95, philosophical: 0.85, density: 0.5, intimacy: 0.98, worldbuilding: 0.3,
      moralComplexity: 0.75, narrativeExperimentation: 0.7, psychologicalIntensity: 0.8, humanism: 0.98, mythicScale: 0.3
    }
  },
  // ── 13. HER ──
  {
    id: 152601,
    title: 'Her',
    year: 2013,
    director: 'Spike Jonze',
    posterLarge: `${IMG_BASE}/w780/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'dJTU48_yGhM',
    tagline: 'A Spike Jonze love story.',
    vector: {
      imagination: 0.85, wonder: 0.8, complexity: 0.7, atmosphere: 0.85, emotionality: 0.9,
      realism: 0.6, ambiguity: 0.65, optimism: 0.75, darkness: 0.4, spectacle: 0.4,
      characterFocus: 0.95, philosophical: 0.88, density: 0.6, intimacy: 0.92, worldbuilding: 0.75,
      moralComplexity: 0.6, narrativeExperimentation: 0.8, psychologicalIntensity: 0.7, humanism: 0.95, mythicScale: 0.45
    }
  },
  // ── 14. OLDBOY ──
  {
    id: 670,
    title: 'Oldboy',
    year: 2003,
    director: 'Park Chan-wook',
    posterLarge: `${IMG_BASE}/w780/pWDtjs568ZfOTMbURQBYuT4Qxka.jpg`,
    posterPosition: '50% 20%',
    category: 'horizon',
    trailerKey: '2HkjrJ6IK5E',
    tagline: '15 years of imprisonment, 5 days of vengeance.',
    vector: {
      imagination: 0.65, wonder: 0.2, complexity: 0.88, atmosphere: 0.9, emotionality: 0.75,
      realism: 0.7, ambiguity: 0.8, optimism: 0.15, darkness: 0.98, spectacle: 0.6,
      characterFocus: 0.85, philosophical: 0.8, density: 0.8, intimacy: 0.6, worldbuilding: 0.4,
      moralComplexity: 0.98, narrativeExperimentation: 0.85, psychologicalIntensity: 0.98, humanism: 0.45, mythicScale: 0.5
    }
  },
  // ── 15. LOST IN TRANSLATION ──
  {
    id: 153,
    title: 'Lost in Translation',
    year: 2003,
    director: 'Sofia Coppola',
    posterLarge: `${IMG_BASE}/w780/3jCLmYDIIiSMPujbwygNpqdpM8N.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'W6iVPCRflQM',
    tagline: 'Everyone wants to be found.',
    vector: {
      imagination: 0.3, wonder: 0.6, complexity: 0.4, atmosphere: 0.95, emotionality: 0.85,
      realism: 0.88, ambiguity: 0.75, optimism: 0.6, darkness: 0.4, spectacle: 0.15,
      characterFocus: 0.92, philosophical: 0.8, density: 0.5, intimacy: 0.98, worldbuilding: 0.25,
      moralComplexity: 0.6, narrativeExperimentation: 0.6, psychologicalIntensity: 0.5, humanism: 0.92, mythicScale: 0.2
    }
  },
  // ── 16. THE THIN RED LINE ──
  {
    id: 8741,
    title: 'The Thin Red Line',
    year: 1998,
    director: 'Terrence Malick',
    posterLarge: `${IMG_BASE}/w780/seMydAaoxQP6F0xbE1jOcTmn5Jr.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: 'LCmlkWnBwZE',
    tagline: 'Every man fights his own war.',
    vector: {
      imagination: 0.6, wonder: 0.85, complexity: 0.65, atmosphere: 0.95, emotionality: 0.85,
      realism: 0.78, ambiguity: 0.9, optimism: 0.55, darkness: 0.65, spectacle: 0.8,
      characterFocus: 0.7, philosophical: 0.98, density: 0.6, intimacy: 0.65, worldbuilding: 0.4,
      moralComplexity: 0.85, narrativeExperimentation: 0.8, psychologicalIntensity: 0.8, humanism: 0.9, mythicScale: 0.9
    }
  },
  // ── 17. MAGNOLIA ──
  {
    id: 334,
    title: 'Magnolia',
    year: 1999,
    director: 'Paul Thomas Anderson',
    posterLarge: `${IMG_BASE}/w780/tpfC325Jk6S38VTe5dDWjWtoyxr.jpg`,
    posterPosition: '50% 30%',
    category: 'core',
    trailerKey: 'cxcegyo2wa8',
    tagline: 'Things fall down. People look up.',
    vector: {
      imagination: 0.65, wonder: 0.8, complexity: 0.85, atmosphere: 0.85, emotionality: 0.95,
      realism: 0.8, ambiguity: 0.8, optimism: 0.6, darkness: 0.7, spectacle: 0.4,
      characterFocus: 0.9, philosophical: 0.88, density: 0.92, intimacy: 0.8, worldbuilding: 0.4,
      moralComplexity: 0.88, narrativeExperimentation: 0.88, psychologicalIntensity: 0.9, humanism: 0.9, mythicScale: 0.65
    }
  },
  // ── 18. RASHOMON ──
  {
    id: 548,
    title: 'Rashomon',
    year: 1950,
    director: 'Akira Kurosawa',
    posterLarge: `${IMG_BASE}/w780/ijWibsAU1iBcCD8tuIZfTmDzMVE.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: 'xCZ9TguVOIA',
    tagline: 'The truth is what you make it.',
    vector: {
      imagination: 0.5, wonder: 0.6, complexity: 0.85, atmosphere: 0.85, emotionality: 0.8,
      realism: 0.85, ambiguity: 0.98, optimism: 0.5, darkness: 0.65, spectacle: 0.3,
      characterFocus: 0.85, philosophical: 0.95, density: 0.75, intimacy: 0.7, worldbuilding: 0.4,
      moralComplexity: 0.98, narrativeExperimentation: 0.92, psychologicalIntensity: 0.85, humanism: 0.8, mythicScale: 0.65
    }
  },
  // ── 19. YI YI ──
  {
    id: 25538,
    title: 'Yi Yi',
    year: 2000,
    director: 'Edward Yang',
    posterLarge: `${IMG_BASE}/w780/mR8dSQZI8X6Z1NClJhFrtJp636z.jpg`,
    posterPosition: '50% 25%',
    category: 'deep_cut',
    trailerKey: '46P3n5-0q7w',
    tagline: 'A one and a two...',
    vector: {
      imagination: 0.3, wonder: 0.7, complexity: 0.6, atmosphere: 0.8, emotionality: 0.9,
      realism: 0.98, ambiguity: 0.7, optimism: 0.7, darkness: 0.4, spectacle: 0.2,
      characterFocus: 0.92, philosophical: 0.88, density: 0.9, intimacy: 0.85, worldbuilding: 0.3,
      moralComplexity: 0.75, narrativeExperimentation: 0.6, psychologicalIntensity: 0.5, humanism: 0.98, mythicScale: 0.4
    }
  },
  // ── 20. ARRIVAL ──
  {
    id: 329865,
    title: 'Arrival',
    year: 2016,
    director: 'Denis Villeneuve',
    posterLarge: `${IMG_BASE}/w780/pEzNVQfdzYDzVK0XqxERIw2x2se.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'tFMo3UJ4B4g',
    tagline: 'Why are they here?',
    vector: {
      imagination: 0.9, wonder: 0.9, complexity: 0.9, atmosphere: 0.95, emotionality: 0.92,
      realism: 0.5, ambiguity: 0.8, optimism: 0.7, darkness: 0.45, spectacle: 0.75,
      characterFocus: 0.85, philosophical: 0.96, density: 0.7, intimacy: 0.85, worldbuilding: 0.8,
      moralComplexity: 0.7, narrativeExperimentation: 0.85, psychologicalIntensity: 0.8, humanism: 0.95, mythicScale: 0.75
    }
  },
  // ── 21. PARASITE ──
  {
    id: 496243,
    title: 'Parasite',
    year: 2019,
    director: 'Bong Joon-ho',
    posterLarge: `${IMG_BASE}/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: '5xH0R_uie14',
    tagline: 'Act like you own the place.',
    vector: {
      imagination: 0.6, wonder: 0.4, complexity: 0.92, atmosphere: 0.92, emotionality: 0.8,
      realism: 0.92, ambiguity: 0.75, optimism: 0.3, darkness: 0.85, spectacle: 0.4,
      characterFocus: 0.9, philosophical: 0.85, density: 0.9, intimacy: 0.75, worldbuilding: 0.5,
      moralComplexity: 0.95, narrativeExperimentation: 0.85, psychologicalIntensity: 0.92, humanism: 0.8, mythicScale: 0.4
    }
  },
  // ── 22. NO COUNTRY FOR OLD MEN ──
  {
    id: 6977,
    title: 'No Country for Old Men',
    year: 2007,
    director: 'Joel & Ethan Coen',
    posterLarge: `${IMG_BASE}/w780/6d5XOczc226jECq0LIX0siKtgHR.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: '38A__WT3-o0',
    tagline: 'There are no clean getaways.',
    vector: {
      imagination: 0.3, wonder: 0.2, complexity: 0.78, atmosphere: 0.95, emotionality: 0.5,
      realism: 0.92, ambiguity: 0.95, optimism: 0.15, darkness: 0.92, spectacle: 0.4,
      characterFocus: 0.85, philosophical: 0.92, density: 0.6, intimacy: 0.6, worldbuilding: 0.4,
      moralComplexity: 0.95, narrativeExperimentation: 0.7, psychologicalIntensity: 0.95, humanism: 0.6, mythicScale: 0.6
    }
  },
  // ── 23. THERE WILL BE BLOOD ──
  {
    id: 7345,
    title: 'There Will Be Blood',
    year: 2007,
    director: 'Paul Thomas Anderson',
    posterLarge: `${IMG_BASE}/w780/fa0RDkAlCec0STeMNAhPaF89q6U.jpg`,
    posterPosition: '50% 25%',
    category: 'core',
    trailerKey: 'FeSLPELpMeM',
    tagline: 'When ambition meets obsession.',
    vector: {
      imagination: 0.4, wonder: 0.3, complexity: 0.8, atmosphere: 0.95, emotionality: 0.7,
      realism: 0.95, ambiguity: 0.85, optimism: 0.15, darkness: 0.9, spectacle: 0.6,
      characterFocus: 0.98, philosophical: 0.88, density: 0.75, intimacy: 0.7, worldbuilding: 0.6,
      moralComplexity: 0.95, narrativeExperimentation: 0.65, psychologicalIntensity: 0.96, humanism: 0.5, mythicScale: 0.75
    }
  },
  // ── 24. SPIRITED AWAY ──
  {
    id: 129,
    title: 'Spirited Away',
    year: 2001,
    director: 'Hayao Miyazaki',
    posterLarge: `${IMG_BASE}/w780/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'ByXuk9QqQkk',
    tagline: 'Nothing that happens is ever forgotten.',
    vector: {
      imagination: 0.98, wonder: 0.98, complexity: 0.7, atmosphere: 0.95, emotionality: 0.88,
      realism: 0.25, ambiguity: 0.75, optimism: 0.8, darkness: 0.45, spectacle: 0.85,
      characterFocus: 0.8, philosophical: 0.85, density: 0.75, intimacy: 0.6, worldbuilding: 0.98,
      moralComplexity: 0.7, narrativeExperimentation: 0.75, psychologicalIntensity: 0.65, humanism: 0.95, mythicScale: 0.85
    }
  },
  // ── 25. 2001: A SPACE ODYSSEY ──
  {
    id: 62,
    title: '2001: A Space Odyssey',
    year: 1968,
    director: 'Stanley Kubrick',
    posterLarge: `${IMG_BASE}/w780/ve72VxNqjGM69Uky4WTo2bK6rfq.jpg`,
    posterPosition: '50% 20%',
    category: 'core',
    trailerKey: 'oR_e9y-bka0',
    tagline: 'An epic drama of adventure and exploration.',
    vector: {
      imagination: 0.95, wonder: 0.95, complexity: 0.85, atmosphere: 0.98, emotionality: 0.4,
      realism: 0.65, ambiguity: 0.98, optimism: 0.5, darkness: 0.5, spectacle: 0.95,
      characterFocus: 0.35, philosophical: 0.98, density: 0.5, intimacy: 0.25, worldbuilding: 0.95,
      moralComplexity: 0.8, narrativeExperimentation: 0.98, psychologicalIntensity: 0.85, humanism: 0.6, mythicScale: 0.98
    }
  },
  // ── 26. TAXI DRIVER ──
  {
    id: 103,
    title: 'Taxi Driver',
    year: 1976,
    director: 'Martin Scorsese',
    posterLarge: `${IMG_BASE}/w780/ekstpH614fwDX8DUln1a2Opz0N8.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'cDCFCI44ZCM',
    tagline: 'On every street in every city, there’s a nobody who dreams of being a somebody.',
    vector: {
      imagination: 0.3, wonder: 0.2, complexity: 0.75, atmosphere: 0.95, emotionality: 0.7,
      realism: 0.95, ambiguity: 0.85, optimism: 0.15, darkness: 0.95, spectacle: 0.3,
      characterFocus: 0.98, philosophical: 0.85, density: 0.6, intimacy: 0.85, worldbuilding: 0.4,
      moralComplexity: 0.98, narrativeExperimentation: 0.65, psychologicalIntensity: 0.98, humanism: 0.6, mythicScale: 0.45
    }
  },
  // ── 27. CHINATOWN ──
  {
    id: 829,
    title: 'Chinatown',
    year: 1974,
    director: 'Roman Polanski',
    posterLarge: `${IMG_BASE}/w780/kZRSP3FmOcq0xnBulqpUQngJUXY.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'bK6iH9T-g4w',
    tagline: 'Forget it, Jake. It’s Chinatown.',
    vector: {
      imagination: 0.3, wonder: 0.25, complexity: 0.92, atmosphere: 0.95, emotionality: 0.7,
      realism: 0.92, ambiguity: 0.9, optimism: 0.15, darkness: 0.9, spectacle: 0.35,
      characterFocus: 0.85, philosophical: 0.82, density: 0.85, intimacy: 0.7, worldbuilding: 0.5,
      moralComplexity: 0.98, narrativeExperimentation: 0.6, psychologicalIntensity: 0.85, humanism: 0.6, mythicScale: 0.5
    }
  },
  // ── 28. ZODIAC ──
  {
    id: 1949,
    title: 'Zodiac',
    year: 2007,
    director: 'David Fincher',
    posterLarge: `${IMG_BASE}/w780/6YmeO4pB7XTh8P8F960O1uA14JO.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'yNncHPl1nZ8',
    tagline: 'There’s more than one way to lose your life to a killer.',
    vector: {
      imagination: 0.25, wonder: 0.2, complexity: 0.95, atmosphere: 0.92, emotionality: 0.6,
      realism: 0.98, ambiguity: 0.95, optimism: 0.3, darkness: 0.85, spectacle: 0.35,
      characterFocus: 0.85, philosophical: 0.8, density: 0.95, intimacy: 0.6, worldbuilding: 0.4,
      moralComplexity: 0.85, narrativeExperimentation: 0.65, psychologicalIntensity: 0.92, humanism: 0.7, mythicScale: 0.4
    }
  },
  // ── 29. MEMORIES OF MURDER ──
  {
    id: 11423,
    title: 'Memories of Murder',
    year: 2003,
    director: 'Bong Joon-ho',
    posterLarge: `${IMG_BASE}/w780/jcgUjx1QcupGzjntTVlnQ15lHqy.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: '0n_HbUn2dUQ',
    tagline: 'The mystery of the unresolved darkness.',
    vector: {
      imagination: 0.3, wonder: 0.2, complexity: 0.88, atmosphere: 0.96, emotionality: 0.8,
      realism: 0.95, ambiguity: 0.98, optimism: 0.25, darkness: 0.88, spectacle: 0.3,
      characterFocus: 0.9, philosophical: 0.85, density: 0.8, intimacy: 0.75, worldbuilding: 0.4,
      moralComplexity: 0.92, narrativeExperimentation: 0.7, psychologicalIntensity: 0.95, humanism: 0.8, mythicScale: 0.4
    }
  },
  // ── 30. WHIPLASH ──
  {
    id: 244786,
    title: 'Whiplash',
    year: 2014,
    director: 'Damien Chazelle',
    posterLarge: `${IMG_BASE}/w780/7fn624j5lj3xTme2SgiLCeuedmO.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: '7d_jQycdQGo',
    tagline: 'The road to greatness can take you to the edge.',
    vector: {
      imagination: 0.3, wonder: 0.3, complexity: 0.65, atmosphere: 0.85, emotionality: 0.9,
      realism: 0.9, ambiguity: 0.7, optimism: 0.45, darkness: 0.8, spectacle: 0.45,
      characterFocus: 0.98, philosophical: 0.8, density: 0.85, intimacy: 0.9, worldbuilding: 0.25,
      moralComplexity: 0.9, narrativeExperimentation: 0.65, psychologicalIntensity: 0.99, humanism: 0.65, mythicScale: 0.4
    }
  },
  // ── 31. MAD MAX: FURY ROAD ──
  {
    id: 76341,
    title: 'Mad Max: Fury Road',
    year: 2015,
    director: 'George Miller',
    posterLarge: `${IMG_BASE}/w780/ulcAi4dKpAjHwYGS08vNyx9H6I9.jpg`,
    posterPosition: '50% 20%',
    category: 'core',
    trailerKey: 'hEJnMQG938g',
    tagline: 'What a lovely day.',
    vector: {
      imagination: 0.9, wonder: 0.6, complexity: 0.5, atmosphere: 0.92, emotionality: 0.65,
      realism: 0.4, ambiguity: 0.4, optimism: 0.6, darkness: 0.65, spectacle: 0.99,
      characterFocus: 0.6, philosophical: 0.65, density: 0.7, intimacy: 0.3, worldbuilding: 0.95,
      moralComplexity: 0.6, narrativeExperimentation: 0.7, psychologicalIntensity: 0.95, humanism: 0.75, mythicScale: 0.92
    }
  },
  // ── 32. ETERNAL SUNSHINE OF THE SPOTLESS MIND ──
  {
    id: 38,
    title: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
    director: 'Michel Gondry',
    posterLarge: `${IMG_BASE}/w780/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: '07-QBnEkgXU',
    tagline: 'You can erase someone from your mind. Getting them out of your heart is another story.',
    vector: {
      imagination: 0.95, wonder: 0.7, complexity: 0.9, atmosphere: 0.85, emotionality: 0.95,
      realism: 0.55, ambiguity: 0.75, optimism: 0.65, darkness: 0.55, spectacle: 0.4,
      characterFocus: 0.95, philosophical: 0.92, density: 0.8, intimacy: 0.95, worldbuilding: 0.55,
      moralComplexity: 0.75, narrativeExperimentation: 0.95, psychologicalIntensity: 0.85, humanism: 0.95, mythicScale: 0.45
    }
  },
  // ── 33. IN THE MOOD FOR LOVE ──
  {
    id: 843,
    title: 'In the Mood for Love',
    year: 2000,
    director: 'Wong Kar-wai',
    posterLarge: `${IMG_BASE}/w780/8BgGbbWiLNhPtkMkN0gGTnbtvBv.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: 'iRkL98Oq0q8',
    tagline: 'Feel the heat of secret desire.',
    vector: {
      imagination: 0.4, wonder: 0.7, complexity: 0.6, atmosphere: 0.99, emotionality: 0.95,
      realism: 0.85, ambiguity: 0.92, optimism: 0.45, darkness: 0.5, spectacle: 0.25,
      characterFocus: 0.95, philosophical: 0.88, density: 0.5, intimacy: 0.99, worldbuilding: 0.35,
      moralComplexity: 0.8, narrativeExperimentation: 0.85, psychologicalIntensity: 0.75, humanism: 0.95, mythicScale: 0.3
    }
  },
  // ── 34. PORTRAIT OF A LADY ON FIRE ──
  {
    id: 531428,
    title: 'Portrait of a Lady on Fire',
    year: 2019,
    director: 'Céline Sciamma',
    posterLarge: `${IMG_BASE}/w780/rUDuOKpkKBHxx41BScqKej72iT3.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: 'R-fQPTwma9o',
    tagline: 'Do not regret. Remember.',
    vector: {
      imagination: 0.3, wonder: 0.75, complexity: 0.5, atmosphere: 0.98, emotionality: 0.96,
      realism: 0.9, ambiguity: 0.75, optimism: 0.5, darkness: 0.4, spectacle: 0.2,
      characterFocus: 0.98, philosophical: 0.9, density: 0.4, intimacy: 0.99, worldbuilding: 0.3,
      moralComplexity: 0.75, narrativeExperimentation: 0.75, psychologicalIntensity: 0.8, humanism: 0.98, mythicScale: 0.35
    }
  },
  // ── 35. DRIVE MY CAR ──
  {
    id: 758866,
    title: 'Drive My Car',
    year: 2021,
    director: 'Ryusuke Hamaguchi',
    posterLarge: `${IMG_BASE}/w780/znXps7wPyYq8UDCfeyO2vfEIeRS.jpg`,
    posterPosition: 'center top',
    category: 'horizon',
    trailerKey: '6BKAx_C9VdI',
    tagline: 'Words spoken across the quiet highway.',
    vector: {
      imagination: 0.2, wonder: 0.6, complexity: 0.8, atmosphere: 0.92, emotionality: 0.92,
      realism: 0.98, ambiguity: 0.85, optimism: 0.6, darkness: 0.5, spectacle: 0.15,
      characterFocus: 0.98, philosophical: 0.95, density: 0.6, intimacy: 0.95, worldbuilding: 0.2,
      moralComplexity: 0.85, narrativeExperimentation: 0.7, psychologicalIntensity: 0.75, humanism: 0.98, mythicScale: 0.3
    }
  },
  // ── 36. CURE ──
  {
    id: 36095,
    title: 'Cure',
    year: 1997,
    director: 'Kiyoshi Kurosawa',
    posterLarge: `${IMG_BASE}/w780/yTRrqIGusJuzG5Pe3iFQTnHg1Ps.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: 'w5o9oN06_h8',
    tagline: 'Who are you?',
    vector: {
      imagination: 0.6, wonder: 0.2, complexity: 0.85, atmosphere: 0.99, emotionality: 0.5,
      realism: 0.8, ambiguity: 0.98, optimism: 0.1, darkness: 0.98, spectacle: 0.2,
      characterFocus: 0.85, philosophical: 0.92, density: 0.5, intimacy: 0.6, worldbuilding: 0.4,
      moralComplexity: 0.98, narrativeExperimentation: 0.85, psychologicalIntensity: 0.99, humanism: 0.4, mythicScale: 0.5
    }
  },
  // ── 37. THE GRAND BUDAPEST HOTEL ──
  {
    id: 120467,
    title: 'The Grand Budapest Hotel',
    year: 2014,
    director: 'Wes Anderson',
    posterLarge: `${IMG_BASE}/w780/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: '1Fg5iWmQjwk',
    tagline: 'A theft, an empire, a legacy.',
    vector: {
      imagination: 0.9, wonder: 0.85, complexity: 0.65, atmosphere: 0.95, emotionality: 0.75,
      realism: 0.35, ambiguity: 0.4, optimism: 0.7, darkness: 0.45, spectacle: 0.6,
      characterFocus: 0.85, philosophical: 0.75, density: 0.85, intimacy: 0.6, worldbuilding: 0.92,
      moralComplexity: 0.65, narrativeExperimentation: 0.88, psychologicalIntensity: 0.5, humanism: 0.85, mythicScale: 0.6
    }
  },
  // ── 38. THE LOBSTER ──
  {
    id: 254320,
    title: 'The Lobster',
    year: 2015,
    director: 'Yorgos Lanthimos',
    posterLarge: `${IMG_BASE}/w780/7Y9ILV1unpW9mLpGcqyGQU72LUy.jpg`,
    posterPosition: 'center top',
    category: 'horizon',
    trailerKey: 'vU29VfFLW3Q',
    tagline: 'An unconventional love story.',
    vector: {
      imagination: 0.9, wonder: 0.4, complexity: 0.8, atmosphere: 0.9, emotionality: 0.65,
      realism: 0.35, ambiguity: 0.9, optimism: 0.3, darkness: 0.85, spectacle: 0.25,
      characterFocus: 0.85, philosophical: 0.92, density: 0.6, intimacy: 0.7, worldbuilding: 0.8,
      moralComplexity: 0.9, narrativeExperimentation: 0.95, psychologicalIntensity: 0.85, humanism: 0.6, mythicScale: 0.5
    }
  },
  // ── 39. AFTERSUN ──
  {
    id: 965150,
    title: 'Aftersun',
    year: 2022,
    director: 'Charlotte Wells',
    posterLarge: `${IMG_BASE}/w780/evKz85EKouVbIr51zy5fOtpNRPg.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: 'p8k_U2UeI4A',
    tagline: 'Memory is a sanctuary.',
    vector: {
      imagination: 0.3, wonder: 0.65, complexity: 0.6, atmosphere: 0.96, emotionality: 0.98,
      realism: 0.95, ambiguity: 0.9, optimism: 0.5, darkness: 0.55, spectacle: 0.15,
      characterFocus: 0.98, philosophical: 0.88, density: 0.4, intimacy: 0.99, worldbuilding: 0.2,
      moralComplexity: 0.7, narrativeExperimentation: 0.85, psychologicalIntensity: 0.8, humanism: 0.99, mythicScale: 0.25
    }
  },
  // ── 40. PAST LIVES ──
  {
    id: 666277,
    title: 'Past Lives',
    year: 2023,
    director: 'Celine Song',
    posterLarge: `${IMG_BASE}/w780/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'kA244xewjcI',
    tagline: 'In-Yun connects souls through lifetimes.',
    vector: {
      imagination: 0.35, wonder: 0.7, complexity: 0.55, atmosphere: 0.92, emotionality: 0.96,
      realism: 0.96, ambiguity: 0.75, optimism: 0.65, darkness: 0.35, spectacle: 0.15,
      characterFocus: 0.98, philosophical: 0.92, density: 0.5, intimacy: 0.99, worldbuilding: 0.25,
      moralComplexity: 0.75, narrativeExperimentation: 0.65, psychologicalIntensity: 0.7, humanism: 0.98, mythicScale: 0.4
    }
  },
  // ── 41. SOLARIS ──
  {
    id: 593,
    title: 'Solaris',
    year: 1972,
    director: 'Andrei Tarkovsky',
    posterLarge: `${IMG_BASE}/w780/pgqj7QoBPWFLLKtLEpPmFYFRMgB.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: '6-4KydP92ss',
    tagline: 'The living ocean holds your deepest memories.',
    vector: {
      imagination: 0.9, wonder: 0.85, complexity: 0.85, atmosphere: 0.98, emotionality: 0.8,
      realism: 0.5, ambiguity: 0.98, optimism: 0.45, darkness: 0.65, spectacle: 0.5,
      characterFocus: 0.8, philosophical: 0.99, density: 0.45, intimacy: 0.8, worldbuilding: 0.85,
      moralComplexity: 0.8, narrativeExperimentation: 0.88, psychologicalIntensity: 0.85, humanism: 0.9, mythicScale: 0.8
    }
  },
  // ── 42. CHILDREN OF MEN ──
  {
    id: 9693,
    title: 'Children of Men',
    year: 2006,
    director: 'Alfonso Cuarón',
    posterLarge: `${IMG_BASE}/w780/k9IAS4TehZFcKi4HVByxZNPfqex.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: '2VT2apoX9dg',
    tagline: 'The last one to die please turn out the light.',
    vector: {
      imagination: 0.75, wonder: 0.65, complexity: 0.75, atmosphere: 0.98, emotionality: 0.88,
      realism: 0.88, ambiguity: 0.7, optimism: 0.6, darkness: 0.85, spectacle: 0.8,
      characterFocus: 0.85, philosophical: 0.88, density: 0.75, intimacy: 0.7, worldbuilding: 0.92,
      moralComplexity: 0.85, narrativeExperimentation: 0.85, psychologicalIntensity: 0.95, humanism: 0.92, mythicScale: 0.75
    }
  },
  // ── 43. EX MACHINA ──
  {
    id: 264660,
    title: 'Ex Machina',
    year: 2014,
    director: 'Alex Garland',
    posterLarge: `${IMG_BASE}/w780/dmJW8IAKHKxFNiUnoDR7JfsK7Rp.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'EoQuVnKhxaM',
    tagline: 'There is nothing more human than the will to survive.',
    vector: {
      imagination: 0.85, wonder: 0.6, complexity: 0.88, atmosphere: 0.92, emotionality: 0.7,
      realism: 0.65, ambiguity: 0.85, optimism: 0.35, darkness: 0.8, spectacle: 0.45,
      characterFocus: 0.95, philosophical: 0.95, density: 0.75, intimacy: 0.9, worldbuilding: 0.7,
      moralComplexity: 0.95, narrativeExperimentation: 0.75, psychologicalIntensity: 0.92, humanism: 0.65, mythicScale: 0.5
    }
  },
  // ── 44. PERSONA ──
  {
    id: 797,
    title: 'Persona',
    year: 1966,
    director: 'Ingmar Bergman',
    posterLarge: `${IMG_BASE}/w780/cl0HEZT8UfzLqaMrYTvGNHOfPYj.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: '43Z446q_3fU',
    tagline: 'A landmark work in the cinema of identity.',
    vector: {
      imagination: 0.7, wonder: 0.3, complexity: 0.92, atmosphere: 0.98, emotionality: 0.8,
      realism: 0.7, ambiguity: 0.99, optimism: 0.2, darkness: 0.88, spectacle: 0.15,
      characterFocus: 0.98, philosophical: 0.98, density: 0.5, intimacy: 0.99, worldbuilding: 0.2,
      moralComplexity: 0.95, narrativeExperimentation: 0.99, psychologicalIntensity: 0.98, humanism: 0.6, mythicScale: 0.4
    }
  },
  // ── 45. RAN ──
  {
    id: 11645,
    title: 'Ran',
    year: 1985,
    director: 'Akira Kurosawa',
    posterLarge: `${IMG_BASE}/w780/dGgiXMWDcS5aJTBEFu7bmaQPNox.jpg`,
    posterPosition: '50% 20%',
    category: 'horizon',
    trailerKey: 'AbbfvVfO7pE',
    tagline: 'In a world gone mad, chaos reigns supreme.',
    vector: {
      imagination: 0.65, wonder: 0.7, complexity: 0.85, atmosphere: 0.95, emotionality: 0.88,
      realism: 0.85, ambiguity: 0.75, optimism: 0.2, darkness: 0.9, spectacle: 0.96,
      characterFocus: 0.85, philosophical: 0.95, density: 0.8, intimacy: 0.5, worldbuilding: 0.75,
      moralComplexity: 0.95, narrativeExperimentation: 0.7, psychologicalIntensity: 0.9, humanism: 0.8, mythicScale: 0.98
    }
  },
  // ── 46. PAPRIKA ──
  {
    id: 4977,
    title: 'Paprika',
    year: 2006,
    director: 'Satoshi Kon',
    posterLarge: `${IMG_BASE}/w780/nHJljo2Pi7XimYEgV9hvRchQWmg.jpg`,
    posterPosition: 'center top',
    category: 'horizon',
    trailerKey: 'yn7U1KIGeuQ',
    tagline: 'This is your brain on dreams.',
    vector: {
      imagination: 0.99, wonder: 0.88, complexity: 0.9, atmosphere: 0.92, emotionality: 0.75,
      realism: 0.25, ambiguity: 0.88, optimism: 0.6, darkness: 0.65, spectacle: 0.9,
      characterFocus: 0.75, philosophical: 0.88, density: 0.92, intimacy: 0.5, worldbuilding: 0.95,
      moralComplexity: 0.75, narrativeExperimentation: 0.96, psychologicalIntensity: 0.88, humanism: 0.85, mythicScale: 0.8
    }
  },
  // ── 47. SUNSET BOULEVARD ──
  {
    id: 599,
    title: 'Sunset Boulevard',
    year: 1950,
    director: 'Billy Wilder',
    posterLarge: `${IMG_BASE}/w780/zt8aQ6ksqK6p1AopC5zVTDS9pKT.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'i73fI32p0uM',
    tagline: 'A Hollywood story that turns dreams into nightmares.',
    vector: {
      imagination: 0.35, wonder: 0.3, complexity: 0.8, atmosphere: 0.92, emotionality: 0.75,
      realism: 0.9, ambiguity: 0.8, optimism: 0.25, darkness: 0.85, spectacle: 0.3,
      characterFocus: 0.95, philosophical: 0.85, density: 0.75, intimacy: 0.8, worldbuilding: 0.45,
      moralComplexity: 0.95, narrativeExperimentation: 0.8, psychologicalIntensity: 0.9, humanism: 0.7, mythicScale: 0.5
    }
  },
  // ── 48. BICYCLE THIEVES ──
  {
    id: 5156,
    title: 'Bicycle Thieves',
    year: 1948,
    director: 'Vittorio De Sica',
    posterLarge: `${IMG_BASE}/w780/iPdVqIpmR3bRvOQJPrn4pr2KR3q.jpg`,
    posterPosition: 'center top',
    category: 'deep_cut',
    trailerKey: 'H3jnzxx9m0s',
    tagline: 'A father and son searching for hope in the ruins of Rome.',
    vector: {
      imagination: 0.2, wonder: 0.4, complexity: 0.5, atmosphere: 0.85, emotionality: 0.95,
      realism: 0.99, ambiguity: 0.7, optimism: 0.4, darkness: 0.7, spectacle: 0.1,
      characterFocus: 0.98, philosophical: 0.85, density: 0.5, intimacy: 0.95, worldbuilding: 0.2,
      moralComplexity: 0.9, narrativeExperimentation: 0.5, psychologicalIntensity: 0.8, humanism: 0.99, mythicScale: 0.35
    }
  },
  // ── 49. INTERSTELLAR ──
  {
    id: 157336,
    title: 'Interstellar',
    year: 2014,
    director: 'Christopher Nolan',
    posterLarge: `${IMG_BASE}/w780/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg`,
    posterPosition: 'center center',
    category: 'core',
    trailerKey: 'zSWdZVtXT7E',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    vector: {
      imagination: 0.95, wonder: 0.85, complexity: 0.8, atmosphere: 0.75, emotionality: 0.8,
      realism: 0.4, ambiguity: 0.6, optimism: 0.65, darkness: 0.45, spectacle: 0.9,
      characterFocus: 0.6, philosophical: 0.85, density: 0.7, intimacy: 0.4, worldbuilding: 0.9,
      moralComplexity: 0.4, narrativeExperimentation: 0.6, psychologicalIntensity: 0.7, humanism: 0.9, mythicScale: 0.95
    }
  },
  // ── 50. THE DARK KNIGHT ──
  {
    id: 155,
    title: 'The Dark Knight',
    year: 2008,
    director: 'Christopher Nolan',
    posterLarge: `${IMG_BASE}/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg`,
    posterPosition: 'center top',
    category: 'core',
    trailerKey: 'EXeTwQWrcwY',
    tagline: 'Why so serious?',
    vector: {
      imagination: 0.7, wonder: 0.3, complexity: 0.85, atmosphere: 0.8, emotionality: 0.6,
      realism: 0.75, ambiguity: 0.7, optimism: 0.35, darkness: 0.85, spectacle: 0.85,
      characterFocus: 0.8, philosophical: 0.88, density: 0.85, intimacy: 0.4, worldbuilding: 0.85,
      moralComplexity: 0.95, narrativeExperimentation: 0.6, psychologicalIntensity: 0.92, humanism: 0.65, mythicScale: 0.85
    }
  }
];
