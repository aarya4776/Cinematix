// ─────────────────────────────────────────────────────────────────────────────
// Cinematic Archetypes Library — Calibration Pass
//
// Each archetype is defined over 20 dimensions:
//   imagination, wonder, complexity, atmosphere, emotionality,
//   realism, ambiguity, optimism, darkness, spectacle,
//   characterFocus, philosophical, density, intimacy, worldbuilding,
//   moralComplexity, narrativeExperimentation, psychologicalIntensity,
//   humanism, mythicScale
//
// Calibration rules applied:
//   1. Every archetype has 2–3 ANCHOR dimensions (uniquely high vs neighbors)
//   2. Every archetype has 1–2 SUPPRESSOR dimensions (uniquely low vs neighbors)
//   3. No two neighboring archetypes share identical anchor patterns
//   4. Historical archetypes require high worldbuilding+density and low psychologicalIntensity
//   5. Dark realist cluster is separated via humanism, realism, and spectacle axes
// ─────────────────────────────────────────────────────────────────────────────

export const DNA_ARCHETYPES = [

  // ── 1. ATMOSPHERIC REALIST ────────────────────────────────────────────────
  // Anchors:   atmosphere=0.97, realism=0.95, intimacy=0.90
  // Suppressors: spectacle=0.22, imagination=0.15, worldbuilding=0.18
  {
    name: 'Atmospheric Realist',
    subtitle: 'Vivid Textures & Slice-of-Life Truth',
    description: 'You appreciate films that capture the raw, textured realities of life, where prevailing mood and atmosphere become characters in themselves. You prefer unvarnished sensory immersion over dramatic artifice.',
    color: '#10B981',
    vector: {
      imagination: 0.15, wonder: 0.42, complexity: 0.52, atmosphere: 0.97, emotionality: 0.72,
      realism: 0.95, ambiguity: 0.72, optimism: 0.48, darkness: 0.58, spectacle: 0.22,
      characterFocus: 0.85, philosophical: 0.65, density: 0.52, intimacy: 0.90, worldbuilding: 0.18,
      moralComplexity: 0.68, narrativeExperimentation: 0.42, psychologicalIntensity: 0.72, humanism: 0.85, mythicScale: 0.18
    }
  },

  // ── 2. EXISTENTIAL OBSERVER ──────────────────────────────────────────────
  // Anchors:   philosophical=0.98, ambiguity=0.95, wonder=0.75
  // Suppressors: darkness=0.48, spectacle=0.18, psychologicalIntensity=0.52
  {
    name: 'Existential Observer',
    subtitle: 'Contemplative Spaces & Quiet Questions',
    description: 'You drift toward slow-burn, meditative cinema that explores loneliness, time, and the human condition. Long takes, lingering frames, and quiet landscapes are a canvas for existential reflection.',
    color: '#6366F1',
    vector: {
      imagination: 0.42, wonder: 0.75, complexity: 0.62, atmosphere: 0.90, emotionality: 0.62,
      realism: 0.78, ambiguity: 0.95, optimism: 0.38, darkness: 0.48, spectacle: 0.18,
      characterFocus: 0.80, philosophical: 0.98, density: 0.42, intimacy: 0.82, worldbuilding: 0.32,
      moralComplexity: 0.70, narrativeExperimentation: 0.58, psychologicalIntensity: 0.52, humanism: 0.82, mythicScale: 0.40
    }
  },

  // ── 3. MORAL REALIST ─────────────────────────────────────────────────────
  // Anchors:   realism=0.95, moralComplexity=0.88, complexity=0.72
  // Suppressors: darkness=0.62 (lower than Neo-Noir), spectacle=0.32, mythicScale=0.22
  {
    name: 'Moral Realist',
    subtitle: 'Ethical Grey Areas & Uncompromising Choices',
    description: 'You are fascinated by the difficult choices humans make under pressure. You value cinema that avoids clear-cut heroes and villains, mapping the complex, messy compromises of real-world ethics.',
    color: '#F97316',
    vector: {
      imagination: 0.22, wonder: 0.32, complexity: 0.72, atmosphere: 0.72, emotionality: 0.72,
      realism: 0.95, ambiguity: 0.82, optimism: 0.38, darkness: 0.62, spectacle: 0.32,
      characterFocus: 0.88, philosophical: 0.80, density: 0.72, intimacy: 0.72, worldbuilding: 0.28,
      moralComplexity: 0.88, narrativeExperimentation: 0.48, psychologicalIntensity: 0.68, humanism: 0.70, mythicScale: 0.22
    }
  },

  // ── 4. NEO-NOIR HUMANIST ─────────────────────────────────────────────────
  // Anchors:   darkness=0.92, atmosphere=0.95, psychologicalIntensity=0.82
  // Suppressors: realism=0.68 (noir is stylized), optimism=0.25, worldbuilding=0.35
  {
    name: 'Neo-Noir Humanist',
    subtitle: 'Urban Shadows & Cynical Redemption',
    description: 'You appreciate the dark, moody landscapes of crime and paranoia, but look for the fragile thread of human connection hidden in the shadows. Redemption, when it comes, is hard-earned and never simple.',
    color: '#4B5563',
    vector: {
      imagination: 0.48, wonder: 0.32, complexity: 0.78, atmosphere: 0.95, emotionality: 0.72,
      realism: 0.68, ambiguity: 0.88, optimism: 0.25, darkness: 0.92, spectacle: 0.55,
      characterFocus: 0.82, philosophical: 0.78, density: 0.78, intimacy: 0.72, worldbuilding: 0.35,
      moralComplexity: 0.88, narrativeExperimentation: 0.55, psychologicalIntensity: 0.82, humanism: 0.72, mythicScale: 0.42
    }
  },

  // ── 5. PHILOSOPHICAL EXPLORER ────────────────────────────────────────────
  // Anchors:   philosophical=0.98, ambiguity=0.92, imagination=0.82
  // Suppressors: realism=0.38, darkness=0.40, intimacy=0.45, spectacle=0.40
  {
    name: 'Philosophical Explorer',
    subtitle: 'Intellectual Depth & Open-Ended Inquiries',
    description: 'You treat cinema as a grand laboratory for big ideas. You seek out metaphysical questions, existential dialogues, and narratives that challenge your intellect, valuing open-ended inquiry over neat resolutions.',
    color: '#8B5CF6',
    vector: {
      imagination: 0.82, wonder: 0.72, complexity: 0.88, atmosphere: 0.78, emotionality: 0.52,
      realism: 0.38, ambiguity: 0.92, optimism: 0.48, darkness: 0.40, spectacle: 0.40,
      characterFocus: 0.68, philosophical: 0.98, density: 0.78, intimacy: 0.45, worldbuilding: 0.68,
      moralComplexity: 0.78, narrativeExperimentation: 0.78, psychologicalIntensity: 0.65, humanism: 0.68, mythicScale: 0.72
    }
  },

  // ── 6. PSYCHOLOGICAL EXCAVATOR ───────────────────────────────────────────
  // Anchors:   psychologicalIntensity=0.98, characterFocus=0.95, darkness=0.92
  // Suppressors: realism=0.50 (interior/stylized), worldbuilding=0.22, optimism=0.20
  {
    name: 'Psychological Excavator',
    subtitle: 'Fractured Minds & Subconscious Depth',
    description: 'You want to get under the skin of characters. You are drawn to stories of trauma, obsession, fractured memory, and intense psychological states where the cinema screen reflects the labyrinth of the mind.',
    color: '#EC4899',
    vector: {
      imagination: 0.68, wonder: 0.38, complexity: 0.88, atmosphere: 0.88, emotionality: 0.78,
      realism: 0.50, ambiguity: 0.88, optimism: 0.20, darkness: 0.92, spectacle: 0.35,
      characterFocus: 0.95, philosophical: 0.78, density: 0.72, intimacy: 0.82, worldbuilding: 0.22,
      moralComplexity: 0.72, narrativeExperimentation: 0.88, psychologicalIntensity: 0.98, humanism: 0.58, mythicScale: 0.35
    }
  },

  // ── 7. MYTHIC DREAMER ────────────────────────────────────────────────────
  // Anchors:   imagination=0.98, wonder=0.95, optimism=0.78
  // Suppressors: realism=0.15, darkness=0.28, complexity=0.45, density=0.35
  {
    name: 'Mythic Dreamer',
    subtitle: 'Surreal Wonders & Folklore Imagination',
    description: 'You believe cinema is a medium of pure dreams, folklore, and magic. You value rich imagination, childhood wonder, and abstract visual storytelling that operates on dream-logic rather than rigid realism.',
    color: '#F59E0B',
    vector: {
      imagination: 0.98, wonder: 0.95, complexity: 0.45, atmosphere: 0.90, emotionality: 0.80,
      realism: 0.15, ambiguity: 0.72, optimism: 0.78, darkness: 0.28, spectacle: 0.82,
      characterFocus: 0.62, philosophical: 0.72, density: 0.35, intimacy: 0.62, worldbuilding: 0.88,
      moralComplexity: 0.40, narrativeExperimentation: 0.80, psychologicalIntensity: 0.45, humanism: 0.85, mythicScale: 0.82
    }
  },

  // ── 8. HUMAN CONDITION ANALYST ───────────────────────────────────────────
  // Anchors:   humanism=0.98, emotionality=0.92, optimism=0.68
  // Suppressors: darkness=0.30, spectacle=0.20, imagination=0.22, mythicScale=0.25
  {
    name: 'Human Condition Analyst',
    subtitle: 'Nuanced Portraits of Mortals & Society',
    description: 'You look at cinema as an empathy machine. You seek rich, natural character studies that capture the complex relationships, social pressures, and quiet struggles that define the everyday human experience.',
    color: '#34D399',
    vector: {
      imagination: 0.22, wonder: 0.62, complexity: 0.62, atmosphere: 0.75, emotionality: 0.92,
      realism: 0.92, ambiguity: 0.68, optimism: 0.68, darkness: 0.30, spectacle: 0.20,
      characterFocus: 0.92, philosophical: 0.78, density: 0.62, intimacy: 0.90, worldbuilding: 0.18,
      moralComplexity: 0.70, narrativeExperimentation: 0.45, psychologicalIntensity: 0.60, humanism: 0.98, mythicScale: 0.25
    }
  },

  // ── 9. NARRATIVE ARCHITECT ───────────────────────────────────────────────
  // Anchors:   complexity=0.98, density=0.95, narrativeExperimentation=0.95
  // Suppressors: intimacy=0.38, emotionality=0.42, realism=0.45, humanism=0.48
  {
    name: 'Narrative Architect',
    subtitle: 'Puzzle Box Structuring & Intricate Timelines',
    description: 'You marvel at structural mastery. You love films that behave like puzzle boxes — multi-layered timelines, nested realities, and complex editing that builds a satisfying, high-density machinery of storytelling.',
    color: '#84CC16',
    vector: {
      imagination: 0.82, wonder: 0.50, complexity: 0.98, atmosphere: 0.68, emotionality: 0.42,
      realism: 0.45, ambiguity: 0.78, optimism: 0.48, darkness: 0.52, spectacle: 0.72,
      characterFocus: 0.58, philosophical: 0.80, density: 0.95, intimacy: 0.38, worldbuilding: 0.75,
      moralComplexity: 0.58, narrativeExperimentation: 0.95, psychologicalIntensity: 0.68, humanism: 0.48, mythicScale: 0.62
    }
  },

  // ── 10. ROMANTIC IDEALIST ────────────────────────────────────────────────
  // Anchors:   emotionality=0.97, intimacy=0.97, optimism=0.92
  // Suppressors: darkness=0.18, spectacle=0.28, complexity=0.35, worldbuilding=0.22
  {
    name: 'Romantic Idealist',
    subtitle: 'Intimate Connections & Belief in Love',
    description: 'You seek sweeps of emotional truth, authentic intimacy, and genuine connection. You believe in the redemptive power of relationships and the beauty of human bonding, even amidst life\'s hardest chapters.',
    color: '#F472B6',
    vector: {
      imagination: 0.45, wonder: 0.85, complexity: 0.35, atmosphere: 0.72, emotionality: 0.97,
      realism: 0.78, ambiguity: 0.42, optimism: 0.92, darkness: 0.18, spectacle: 0.28,
      characterFocus: 0.92, philosophical: 0.62, density: 0.48, intimacy: 0.97, worldbuilding: 0.22,
      moralComplexity: 0.45, narrativeExperimentation: 0.45, psychologicalIntensity: 0.42, humanism: 0.97, mythicScale: 0.28
    }
  },

  // ── 11. CYNICAL HISTORIAN ────────────────────────────────────────────────
  // Anchors:   density=0.92, mythicScale=0.82, worldbuilding=0.72
  // Suppressors: psychologicalIntensity=0.52, intimacy=0.42, imagination=0.20, optimism=0.15
  {
    name: 'Cynical Historian',
    subtitle: 'Grim Chronicles of Power & Legacy',
    description: 'You look at the past through an unsparing lens. You are drawn to cold, detailed deconstructions of institutional greed, empire-building, and the dark cost of human ambition throughout history.',
    color: '#78350F',
    vector: {
      imagination: 0.20, wonder: 0.28, complexity: 0.82, atmosphere: 0.82, emotionality: 0.52,
      realism: 0.90, ambiguity: 0.80, optimism: 0.15, darkness: 0.88, spectacle: 0.68,
      characterFocus: 0.78, philosophical: 0.82, density: 0.92, intimacy: 0.42, worldbuilding: 0.72,
      moralComplexity: 0.95, narrativeExperimentation: 0.42, psychologicalIntensity: 0.52, humanism: 0.48, mythicScale: 0.82
    }
  },

  // ── 12. MELANCHOLIC HUMANIST ─────────────────────────────────────────────
  // Anchors:   emotionality=0.98, humanism=0.97, intimacy=0.95
  // Suppressors: darkness=0.45, spectacle=0.15, worldbuilding=0.15, complexity=0.42
  {
    name: 'Melancholic Humanist',
    subtitle: 'Everyday Sorrow & Tender Empathy',
    description: 'You are drawn to stories of grief, quiet regret, and emotional vulnerability. For you, cinema is a space for healing — holding up a mirror to the fragile beauty of wounded lives with deep compassion.',
    color: '#3B82F6',
    vector: {
      imagination: 0.28, wonder: 0.65, complexity: 0.42, atmosphere: 0.85, emotionality: 0.98,
      realism: 0.88, ambiguity: 0.72, optimism: 0.52, darkness: 0.45, spectacle: 0.15,
      characterFocus: 0.95, philosophical: 0.78, density: 0.48, intimacy: 0.95, worldbuilding: 0.15,
      moralComplexity: 0.62, narrativeExperimentation: 0.45, psychologicalIntensity: 0.62, humanism: 0.97, mythicScale: 0.25
    }
  },

  // ── 13. COSMIC WONDER-SEEKER ─────────────────────────────────────────────
  // Anchors:   wonder=0.98, spectacle=0.95, imagination=0.95
  // Suppressors: philosophical=0.68, realism=0.28, darkness=0.32, intimacy=0.32
  {
    name: 'Cosmic Wonder-Seeker',
    subtitle: 'Awe-Inspiring Vistas & Starbound Dreams',
    description: 'You believe cinema should expand your horizon. You love speculative sci-fi, grand visual scales, and astronomical concepts that make you feel small yet connected to the vast mysteries of the universe.',
    color: '#2563EB',
    vector: {
      imagination: 0.95, wonder: 0.98, complexity: 0.72, atmosphere: 0.88, emotionality: 0.72,
      realism: 0.28, ambiguity: 0.62, optimism: 0.75, darkness: 0.32, spectacle: 0.95,
      characterFocus: 0.52, philosophical: 0.68, density: 0.62, intimacy: 0.32, worldbuilding: 0.92,
      moralComplexity: 0.48, narrativeExperimentation: 0.68, psychologicalIntensity: 0.58, humanism: 0.80, mythicScale: 0.95
    }
  },

  // ── 14. CHARACTER ANTHROPOLOGIST ────────────────────────────────────────
  // Anchors:   characterFocus=0.98, realism=0.92, intimacy=0.88
  // Suppressors: darkness=0.35, spectacle=0.10, mythicScale=0.20, philosophical=0.60
  {
    name: 'Character Anthropologist',
    subtitle: 'Observational Portraiture of Human Quirks',
    description: 'You are fascinated by specific human behaviors, dialects, and social environments. You prefer quiet observation of conversational dynamics and character quirks over sweeping plots or grand effects.',
    color: '#0D9488',
    vector: {
      imagination: 0.22, wonder: 0.55, complexity: 0.52, atmosphere: 0.72, emotionality: 0.78,
      realism: 0.92, ambiguity: 0.68, optimism: 0.62, darkness: 0.35, spectacle: 0.10,
      characterFocus: 0.98, philosophical: 0.60, density: 0.58, intimacy: 0.88, worldbuilding: 0.18,
      moralComplexity: 0.62, narrativeExperimentation: 0.52, psychologicalIntensity: 0.52, humanism: 0.90, mythicScale: 0.20
    }
  },

  // ── 15. EPIC WORLDBUILDER ────────────────────────────────────────────────
  // Anchors:   worldbuilding=0.99, imagination=0.96, mythicScale=0.95
  // Suppressors: realism=0.25, intimacy=0.28, darkness=0.35, philosophical=0.50
  {
    name: 'Epic Worldbuilder',
    subtitle: 'Grand Lore & Monumental Empires',
    description: 'You seek deep immersion in constructed universes. You love dense lore, imaginary geographies, historical timelines, and mythic conflicts that present a fully realized environment for adventure.',
    color: '#D97706',
    vector: {
      imagination: 0.96, wonder: 0.82, complexity: 0.72, atmosphere: 0.82, emotionality: 0.65,
      realism: 0.25, ambiguity: 0.48, optimism: 0.62, darkness: 0.35, spectacle: 0.95,
      characterFocus: 0.58, philosophical: 0.50, density: 0.80, intimacy: 0.28, worldbuilding: 0.99,
      moralComplexity: 0.55, narrativeExperimentation: 0.48, psychologicalIntensity: 0.55, humanism: 0.72, mythicScale: 0.95
    }
  },

  // ── 16. EMOTIONAL FORMALIST ──────────────────────────────────────────────
  // Anchors:   atmosphere=0.95, spectacle=0.90, emotionality=0.90
  // Suppressors: realism=0.40, density=0.45, emotionality is warm/stylized not cold
  {
    name: 'Emotional Formalist',
    subtitle: 'Stylized Sorrow & Aesthetic Resonance',
    description: 'For you, composition, color grading, and framing are the direct language of the heart. You love visually spectacular, hyper-stylized films that use aesthetic form to evoke deep, melancholic emotions.',
    color: '#DB2777',
    vector: {
      imagination: 0.80, wonder: 0.78, complexity: 0.58, atmosphere: 0.95, emotionality: 0.90,
      realism: 0.40, ambiguity: 0.72, optimism: 0.52, darkness: 0.52, spectacle: 0.90,
      characterFocus: 0.72, philosophical: 0.75, density: 0.45, intimacy: 0.78, worldbuilding: 0.55,
      moralComplexity: 0.60, narrativeExperimentation: 0.82, psychologicalIntensity: 0.68, humanism: 0.88, mythicScale: 0.62
    }
  },

  // ── 17. HISTORICAL PRESERVATIONIST ──────────────────────────────────────
  // Anchors:   realism=0.95, worldbuilding=0.85, density=0.82
  // Suppressors: darkness=0.45, psychologicalIntensity=0.48, moralComplexity=0.55, imagination=0.22
  {
    name: 'Historical Preservationist',
    subtitle: 'Authentic Period Details & Restorative Truth',
    description: 'You admire films that act as time machines. You value precise costuming, authentic settings, and factual integrity that reconstructs specific historical epochs without modernization or simplification.',
    color: '#92400E',
    vector: {
      imagination: 0.22, wonder: 0.58, complexity: 0.65, atmosphere: 0.85, emotionality: 0.75,
      realism: 0.95, ambiguity: 0.52, optimism: 0.58, darkness: 0.45, spectacle: 0.72,
      characterFocus: 0.72, philosophical: 0.68, density: 0.82, intimacy: 0.65, worldbuilding: 0.85,
      moralComplexity: 0.55, narrativeExperimentation: 0.38, psychologicalIntensity: 0.48, humanism: 0.85, mythicScale: 0.72
    }
  },

  // ── 18. AMBIGUITY SEEKER ─────────────────────────────────────────────────
  // Anchors:   ambiguity=0.98, narrativeExperimentation=0.92, philosophical=0.92
  // Suppressors: optimism=0.25, realism=0.52, intimacy=0.55, spectacle=0.35
  {
    name: 'Ambiguity Seeker',
    subtitle: 'Unresolved Riddles & Shifting Truths',
    description: 'You believe cinema is at its best when it refuses to explain. You seek out narratives with unreliable narrators, open questions, and abstract conclusions that force you to participate in active interpretation.',
    color: '#6B7280',
    vector: {
      imagination: 0.72, wonder: 0.48, complexity: 0.92, atmosphere: 0.90, emotionality: 0.48,
      realism: 0.52, ambiguity: 0.98, optimism: 0.25, darkness: 0.75, spectacle: 0.35,
      characterFocus: 0.72, philosophical: 0.92, density: 0.78, intimacy: 0.55, worldbuilding: 0.45,
      moralComplexity: 0.88, narrativeExperimentation: 0.92, psychologicalIntensity: 0.78, humanism: 0.62, mythicScale: 0.48
    }
  },

  // ── 19. POETIC MINIMALIST ────────────────────────────────────────────────
  // Anchors:   atmosphere=0.95, intimacy=0.95, density=0.28 (uniquely LOW)
  // Suppressors: spectacle=0.15, complexity=0.42, worldbuilding=0.18, darkness=0.38
  {
    name: 'Poetic Minimalist',
    subtitle: 'Stripped-Back Frames & Silent Power',
    description: 'You believe that less is infinitely more. You seek quiet, sparse films where silence conveys more than dialogue, and where long, unadorned compositions reveal profound beauty in the smallest spaces.',
    color: '#06B6D4',
    vector: {
      imagination: 0.38, wonder: 0.68, complexity: 0.42, atmosphere: 0.95, emotionality: 0.82,
      realism: 0.82, ambiguity: 0.85, optimism: 0.55, darkness: 0.38, spectacle: 0.15,
      characterFocus: 0.82, philosophical: 0.88, density: 0.28, intimacy: 0.95, worldbuilding: 0.18,
      moralComplexity: 0.58, narrativeExperimentation: 0.68, psychologicalIntensity: 0.52, humanism: 0.92, mythicScale: 0.28
    }
  },

  // ── 20. MORAL CARTOGRAPHER ───────────────────────────────────────────────
  // Anchors:   moralComplexity=0.95, darkness=0.90, complexity=0.88
  // Suppressors: humanism=0.40, optimism=0.25, wonder=0.25, spectacle=0.48
  {
    name: 'Moral Cartographer',
    subtitle: 'Mapping the Outer Limits of Right & Wrong',
    description: 'You explore the limits of human decency with cold precision. You look for films that test ethical boundaries, examining how pressure, desperation, and corruption warp the human conscience from the outside in.',
    color: '#D97706',
    vector: {
      imagination: 0.35, wonder: 0.25, complexity: 0.88, atmosphere: 0.80, emotionality: 0.60,
      realism: 0.88, ambiguity: 0.88, optimism: 0.25, darkness: 0.90, spectacle: 0.48,
      characterFocus: 0.80, philosophical: 0.90, density: 0.82, intimacy: 0.55, worldbuilding: 0.42,
      moralComplexity: 0.95, narrativeExperimentation: 0.52, psychologicalIntensity: 0.82, humanism: 0.40, mythicScale: 0.48
    }
  },

  // ── 21. TRAGIC HUMANIST ──────────────────────────────────────────────────
  // Anchors:   emotionality=0.95, humanism=0.92, darkness=0.85
  // Suppressors: spectacle=0.32, worldbuilding=0.25, imagination=0.25, moralComplexity=0.65
  {
    name: 'Tragic Humanist',
    subtitle: 'Dignified Suffering & Flawed Redemption',
    description: 'You are fascinated by characters who are their own worst enemies. You seek out tragic tales where deeply flawed people struggle for meaning, redemption, or simple connection in a cold world.',
    color: '#DC2626',
    vector: {
      imagination: 0.25, wonder: 0.45, complexity: 0.65, atmosphere: 0.85, emotionality: 0.95,
      realism: 0.88, ambiguity: 0.72, optimism: 0.32, darkness: 0.85, spectacle: 0.32,
      characterFocus: 0.92, philosophical: 0.82, density: 0.68, intimacy: 0.88, worldbuilding: 0.25,
      moralComplexity: 0.65, narrativeExperimentation: 0.48, psychologicalIntensity: 0.80, humanism: 0.92, mythicScale: 0.42
    }
  },

  // ── 22. INTIMATE OBSERVER ────────────────────────────────────────────────
  // Anchors:   intimacy=0.99, characterFocus=0.97, realism=0.90
  // Suppressors: spectacle=0.08, worldbuilding=0.10, mythicScale=0.12, density=0.45
  {
    name: 'Intimate Observer',
    subtitle: 'Chamber Dramas & Whispered Secrets',
    description: 'You prefer the intensity of small rooms. Your ideal cinema consists of close-up character dramas, deep conversational dynamics, and family tensions where two people talking holds more power than an explosion.',
    color: '#06B6D4',
    vector: {
      imagination: 0.18, wonder: 0.52, complexity: 0.52, atmosphere: 0.75, emotionality: 0.92,
      realism: 0.90, ambiguity: 0.65, optimism: 0.68, darkness: 0.48, spectacle: 0.08,
      characterFocus: 0.97, philosophical: 0.72, density: 0.45, intimacy: 0.99, worldbuilding: 0.10,
      moralComplexity: 0.62, narrativeExperimentation: 0.48, psychologicalIntensity: 0.65, humanism: 0.95, mythicScale: 0.12
    }
  },

  // ── 23. PSYCHOLOGICAL REALIST ────────────────────────────────────────────
  // Anchors:   psychologicalIntensity=0.95, realism=0.92, characterFocus=0.95
  // Suppressors: spectacle=0.20, worldbuilding=0.15, imagination=0.25, mythicScale=0.22
  {
    name: 'Psychological Realist',
    subtitle: 'Vulnerable Subconscious & Raw Behavior',
    description: 'You seek absolute truth in performance. You look for films that expose the raw, unfiltered psychology of real people — exploring anxiety, obsession, and vulnerability without narrative sugarcoating.',
    color: '#9333EA',
    vector: {
      imagination: 0.25, wonder: 0.42, complexity: 0.72, atmosphere: 0.82, emotionality: 0.85,
      realism: 0.92, ambiguity: 0.78, optimism: 0.42, darkness: 0.80, spectacle: 0.20,
      characterFocus: 0.95, philosophical: 0.78, density: 0.65, intimacy: 0.92, worldbuilding: 0.15,
      moralComplexity: 0.78, narrativeExperimentation: 0.52, psychologicalIntensity: 0.95, humanism: 0.82, mythicScale: 0.22
    }
  },

  // ── 24. EXISTENTIAL WANDERER ─────────────────────────────────────────────
  // Anchors:   atmosphere=0.98, philosophical=0.82, ambiguity=0.80
  // Suppressors: density=0.38, complexity=0.52, intimacy=0.52, spectacle=0.48
  {
    name: 'Existential Wanderer',
    subtitle: 'Isolated Journeys & Contemplative Landscapes',
    description: 'You connect with characters traveling through physical and internal wilderness. You enjoy moody road movies, solitary survival stories, and contemplative journeys that mirror existential searches for identity.',
    color: '#4F46E5',
    vector: {
      imagination: 0.52, wonder: 0.65, complexity: 0.52, atmosphere: 0.98, emotionality: 0.68,
      realism: 0.85, ambiguity: 0.80, optimism: 0.42, darkness: 0.68, spectacle: 0.48,
      characterFocus: 0.80, philosophical: 0.82, density: 0.38, intimacy: 0.52, worldbuilding: 0.48,
      moralComplexity: 0.68, narrativeExperimentation: 0.58, psychologicalIntensity: 0.78, humanism: 0.78, mythicScale: 0.55
    }
  },

  // ── 25. NARRATIVE EXPERIMENTALIST ───────────────────────────────────────
  // Anchors:   narrativeExperimentation=0.98, complexity=0.95, ambiguity=0.90
  // Suppressors: realism=0.38, intimacy=0.42, emotionality=0.42, humanism=0.52
  {
    name: 'Narrative Experimentalist',
    subtitle: 'Deconstructed Storytelling & Formal Audacity',
    description: 'You love when directors break the syntax of film itself. You look for meta-commentary, deconstructed genres, non-linear timelines, and stylistic plays that draw attention to the medium of cinema itself.',
    color: '#C084FC',
    vector: {
      imagination: 0.90, wonder: 0.52, complexity: 0.95, atmosphere: 0.72, emotionality: 0.42,
      realism: 0.38, ambiguity: 0.90, optimism: 0.40, darkness: 0.62, spectacle: 0.58,
      characterFocus: 0.62, philosophical: 0.85, density: 0.90, intimacy: 0.42, worldbuilding: 0.62,
      moralComplexity: 0.68, narrativeExperimentation: 0.98, psychologicalIntensity: 0.68, humanism: 0.52, mythicScale: 0.52
    }
  },

  // ── 26. DREAM LOGIC EXPLORER ─────────────────────────────────────────────
  // Anchors:   imagination=0.95, atmosphere=0.97, narrativeExperimentation=0.92
  // Suppressors: realism=0.18, density=0.48, characterFocus=0.62
  {
    name: 'Dream Logic Explorer',
    subtitle: 'Surreal Journeys Through Subconscious Realms',
    description: 'You respond to films that operate on the illogical fluidity of dreams. You enjoy surrealism, shifts in identity, warped geography, and symbolic sequences that bypass conscious logic to target the unconscious.',
    color: '#8B5CF6',
    vector: {
      imagination: 0.95, wonder: 0.78, complexity: 0.82, atmosphere: 0.97, emotionality: 0.62,
      realism: 0.18, ambiguity: 0.95, optimism: 0.35, darkness: 0.75, spectacle: 0.62,
      characterFocus: 0.62, philosophical: 0.85, density: 0.48, intimacy: 0.58, worldbuilding: 0.78,
      moralComplexity: 0.58, narrativeExperimentation: 0.92, psychologicalIntensity: 0.85, humanism: 0.62, mythicScale: 0.62
    }
  },

  // ── 27. MYTHIC TRADITIONALIST ────────────────────────────────────────────
  // Anchors:   mythicScale=0.97, optimism=0.88, spectacle=0.95
  // Suppressors: darkness=0.25, ambiguity=0.32, narrativeExperimentation=0.35, complexity=0.42
  {
    name: 'Mythic Traditionalist',
    subtitle: 'Timeless Legends & Classical Journeys',
    description: 'You value classical mythology, archetypal hero journeys, and clear moral conflicts. You appreciate large cinematic canvases, soaring themes, and structural clarity that echoes timeless storytelling traditions.',
    color: '#F59E0B',
    vector: {
      imagination: 0.92, wonder: 0.92, complexity: 0.42, atmosphere: 0.78, emotionality: 0.80,
      realism: 0.30, ambiguity: 0.32, optimism: 0.88, darkness: 0.25, spectacle: 0.95,
      characterFocus: 0.68, philosophical: 0.62, density: 0.62, intimacy: 0.42, worldbuilding: 0.92,
      moralComplexity: 0.48, narrativeExperimentation: 0.35, psychologicalIntensity: 0.50, humanism: 0.90, mythicScale: 0.97
    }
  },

  // ── 28. SPIRITUAL SEEKER ─────────────────────────────────────────────────
  // Anchors:   philosophical=0.98, wonder=0.95, optimism=0.75
  // Suppressors: darkness=0.32, spectacle=0.28, density=0.38, complexity=0.45
  {
    name: 'Spiritual Seeker',
    subtitle: 'Metaphysical Transcendence & Silent Grace',
    description: 'For you, cinema is a form of spiritual meditation. You are drawn to films that explore faith, grace, and the quiet mysteries of existence, preferring slow tempos and contemplative silence over dramatic noise.',
    color: '#10B981',
    vector: {
      imagination: 0.58, wonder: 0.95, complexity: 0.45, atmosphere: 0.92, emotionality: 0.78,
      realism: 0.62, ambiguity: 0.85, optimism: 0.75, darkness: 0.32, spectacle: 0.28,
      characterFocus: 0.68, philosophical: 0.98, density: 0.38, intimacy: 0.82, worldbuilding: 0.52,
      moralComplexity: 0.58, narrativeExperimentation: 0.62, psychologicalIntensity: 0.55, humanism: 0.92, mythicScale: 0.68
    }
  },

  // ── 29. EMOTIONAL MAXIMALIST ─────────────────────────────────────────────
  // Anchors:   emotionality=0.98, spectacle=0.88, optimism=0.82
  // Suppressors: realism=0.45, darkness=0.30, complexity=0.38, density=0.48
  {
    name: 'Emotional Maximalist',
    subtitle: 'Sweeping Melodrama & Unabashed Passion',
    description: 'You want cinema to make you feel completely. You love sweeping romantic themes, intense melodrama, and huge sensory climaxes where the music and imagery push emotion to its absolute maximum limit.',
    color: '#EC4899',
    vector: {
      imagination: 0.68, wonder: 0.88, complexity: 0.38, atmosphere: 0.82, emotionality: 0.98,
      realism: 0.45, ambiguity: 0.42, optimism: 0.82, darkness: 0.30, spectacle: 0.88,
      characterFocus: 0.82, philosophical: 0.62, density: 0.48, intimacy: 0.78, worldbuilding: 0.52,
      moralComplexity: 0.48, narrativeExperimentation: 0.52, psychologicalIntensity: 0.65, humanism: 0.92, mythicScale: 0.72
    }
  },

  // ── 30. HUMANIST OPTIMIST ────────────────────────────────────────────────
  // Anchors:   optimism=0.98, humanism=0.98, emotionality=0.90
  // Suppressors: darkness=0.15, spectacle=0.28, complexity=0.38, moralComplexity=0.42
  {
    name: 'Humanist Optimist',
    subtitle: 'Uplifting Empathy & Triumphs of the Spirit',
    description: 'You believe cinema should heal. You seek out stories of redemption, community strength, human kindness, and hope, appreciating films that find light in the darkest corners and celebrate human resilience.',
    color: '#34D399',
    vector: {
      imagination: 0.40, wonder: 0.88, complexity: 0.38, atmosphere: 0.72, emotionality: 0.90,
      realism: 0.78, ambiguity: 0.40, optimism: 0.98, darkness: 0.15, spectacle: 0.28,
      characterFocus: 0.88, philosophical: 0.68, density: 0.48, intimacy: 0.88, worldbuilding: 0.28,
      moralComplexity: 0.42, narrativeExperimentation: 0.40, psychologicalIntensity: 0.42, humanism: 0.98, mythicScale: 0.38
    }
  },

  // ── 31. HISTORICAL CHRONICLER ────────────────────────────────────────────
  // Anchors:   spectacle=0.92, mythicScale=0.92, worldbuilding=0.82
  // Suppressors: psychologicalIntensity=0.60, philosophical=0.60, intimacy=0.48, moralComplexity=0.65
  {
    name: 'Historical Chronicler',
    subtitle: 'Epochal Struggles & Collective Memory',
    description: 'You look at how systems and cultures collapse and rebuild. You love large-scale period pieces, war epics, and biographical chronicles that examine how individual lives are swept up by the tides of history.',
    color: '#78350F',
    vector: {
      imagination: 0.32, wonder: 0.62, complexity: 0.72, atmosphere: 0.82, emotionality: 0.82,
      realism: 0.90, ambiguity: 0.52, optimism: 0.50, darkness: 0.78, spectacle: 0.92,
      characterFocus: 0.80, philosophical: 0.60, density: 0.88, intimacy: 0.48, worldbuilding: 0.82,
      moralComplexity: 0.65, narrativeExperimentation: 0.38, psychologicalIntensity: 0.60, humanism: 0.85, mythicScale: 0.92
    }
  },

  // ── 32. SOCIAL CRITIC ────────────────────────────────────────────────────
  // Anchors:   moralComplexity=0.95, complexity=0.90, realism=0.92
  // Suppressors: wonder=0.22, optimism=0.25, mythicScale=0.42, spectacle=0.38
  {
    name: 'Social Critic',
    subtitle: 'Deconstructing Power & Modern Inequality',
    description: 'You seek cinema that acts as an intellectual weapon. You appreciate sharp class satires, political exposes, and social dramas that deconstruct structural greed, inequality, and institutional decay with precision.',
    color: '#DC2626',
    vector: {
      imagination: 0.42, wonder: 0.22, complexity: 0.90, atmosphere: 0.80, emotionality: 0.68,
      realism: 0.92, ambiguity: 0.85, optimism: 0.25, darkness: 0.82, spectacle: 0.38,
      characterFocus: 0.82, philosophical: 0.90, density: 0.85, intimacy: 0.62, worldbuilding: 0.48,
      moralComplexity: 0.95, narrativeExperimentation: 0.65, psychologicalIntensity: 0.78, humanism: 0.78, mythicScale: 0.42
    }
  },

  // ── 33. POLITICAL OBSERVER ───────────────────────────────────────────────
  // Anchors:   density=0.95, complexity=0.92, realism=0.92
  // Suppressors: emotionality=0.38, wonder=0.15, spectacle=0.35, mythicScale=0.45
  {
    name: 'Political Observer',
    subtitle: 'Systemic Intrigues & Machiavellian Plays',
    description: 'You find drama in the corridors of power. You seek out detailed procedural dramas, bureaucratic suspense, and historical conspiracies that map how decisions are made and how systems manipulate individuals.',
    color: '#1E3A8A',
    vector: {
      imagination: 0.20, wonder: 0.15, complexity: 0.92, atmosphere: 0.72, emotionality: 0.38,
      realism: 0.92, ambiguity: 0.82, optimism: 0.25, darkness: 0.80, spectacle: 0.35,
      characterFocus: 0.78, philosophical: 0.88, density: 0.95, intimacy: 0.50, worldbuilding: 0.55,
      moralComplexity: 0.92, narrativeExperimentation: 0.48, psychologicalIntensity: 0.72, humanism: 0.60, mythicScale: 0.45
    }
  },

  // ── 34. CULTURAL ARCHIVIST ───────────────────────────────────────────────
  // Anchors:   humanism=0.96, realism=0.92, atmosphere=0.88
  // Suppressors: darkness=0.28, spectacle=0.25, psychologicalIntensity=0.38, moralComplexity=0.48
  {
    name: 'Cultural Archivist',
    subtitle: 'Tapestry of Local Heritage & Forgotten Tales',
    description: 'You treasure movies that record specific regional traditions, languages, and stories. You prefer films that behave like living archives, capturing local history, specific communities, and forgotten heritages.',
    color: '#047857',
    vector: {
      imagination: 0.35, wonder: 0.72, complexity: 0.52, atmosphere: 0.88, emotionality: 0.85,
      realism: 0.92, ambiguity: 0.60, optimism: 0.70, darkness: 0.28, spectacle: 0.25,
      characterFocus: 0.90, philosophical: 0.72, density: 0.68, intimacy: 0.85, worldbuilding: 0.65,
      moralComplexity: 0.48, narrativeExperimentation: 0.45, psychologicalIntensity: 0.38, humanism: 0.96, mythicScale: 0.42
    }
  },

  // ── 35. GENRE REVISIONIST ────────────────────────────────────────────────
  // Anchors:   narrativeExperimentation=0.95, moralComplexity=0.88, ambiguity=0.88
  // Suppressors: wonder=0.35, optimism=0.32, intimacy=0.48, realism=0.58
  {
    name: 'Genre Revisionist',
    subtitle: 'Subverting Tropes & Demolishing Formulas',
    description: 'You dislike formulaic storytelling. You look for Westerns, thrillers, or sci-fi films that take the established rules of their genre and flip them to say something fresh, unsettling, and unexpected.',
    color: '#D946EF',
    vector: {
      imagination: 0.85, wonder: 0.35, complexity: 0.90, atmosphere: 0.82, emotionality: 0.52,
      realism: 0.58, ambiguity: 0.88, optimism: 0.32, darkness: 0.72, spectacle: 0.65,
      characterFocus: 0.72, philosophical: 0.82, density: 0.82, intimacy: 0.48, worldbuilding: 0.68,
      moralComplexity: 0.88, narrativeExperimentation: 0.95, psychologicalIntensity: 0.75, humanism: 0.65, mythicScale: 0.58
    }
  },

  // ── 36. FORMALIST VISIONARY ──────────────────────────────────────────────
  // Anchors:   spectacle=0.95, narrativeExperimentation=0.95, imagination=0.95
  // Suppressors: realism=0.35, emotionality=0.40, humanism=0.48, intimacy=0.38
  {
    name: 'Formalist Visionary',
    subtitle: 'Bold Geometries & Avant-Garde Frames',
    description: 'You believe the image itself is the primary language. You seek out directors who use symmetry, architectural framing, and radical color palettes to build worlds that transcend standard emotional realism.',
    color: '#3B82F6',
    vector: {
      imagination: 0.95, wonder: 0.80, complexity: 0.78, atmosphere: 0.90, emotionality: 0.40,
      realism: 0.35, ambiguity: 0.80, optimism: 0.50, darkness: 0.55, spectacle: 0.95,
      characterFocus: 0.58, philosophical: 0.82, density: 0.72, intimacy: 0.38, worldbuilding: 0.85,
      moralComplexity: 0.58, narrativeExperimentation: 0.95, psychologicalIntensity: 0.65, humanism: 0.48, mythicScale: 0.78
    }
  },

  // ── 37. VISUAL STYLIST ───────────────────────────────────────────────────
  // Anchors:   spectacle=0.98, atmosphere=0.97, wonder=0.92
  // Suppressors: realism=0.38, philosophical=0.50, narrativeExperimentation=0.68, complexity=0.48
  {
    name: 'Visual Stylist',
    subtitle: 'Saturated Palettes & Hyper-Aesthetic Worlds',
    description: 'For you, beauty is paramount. You seek visual texture, vibrant neon streetscapes, saturated color grading, and hyper-designed sets, viewing cinema as a sequence of gallery-worthy photographs.',
    color: '#EC4899',
    vector: {
      imagination: 0.92, wonder: 0.92, complexity: 0.48, atmosphere: 0.97, emotionality: 0.75,
      realism: 0.38, ambiguity: 0.65, optimism: 0.62, darkness: 0.50, spectacle: 0.98,
      characterFocus: 0.62, philosophical: 0.50, density: 0.58, intimacy: 0.58, worldbuilding: 0.85,
      moralComplexity: 0.48, narrativeExperimentation: 0.68, psychologicalIntensity: 0.65, humanism: 0.75, mythicScale: 0.70
    }
  },

  // ── 38. KINETIC STORYTELLER ──────────────────────────────────────────────
  // Anchors:   spectacle=0.98, density=0.88, narrativeExperimentation=0.82
  // Suppressors: atmosphere=0.55, intimacy=0.25, realism=0.48, philosophical=0.50
  {
    name: 'Kinetic Storyteller',
    subtitle: 'Visceral Momentum & Rhythmic Editing',
    description: 'You thrive on visual momentum. You value fast, rhythmic cross-cutting, soaring camera pans, and a sense of physical speed where the energy of the edit drives the narrative forward with relentless force.',
    color: '#EF4444',
    vector: {
      imagination: 0.80, wonder: 0.58, complexity: 0.65, atmosphere: 0.55, emotionality: 0.65,
      realism: 0.48, ambiguity: 0.45, optimism: 0.62, darkness: 0.65, spectacle: 0.98,
      characterFocus: 0.58, philosophical: 0.50, density: 0.88, intimacy: 0.25, worldbuilding: 0.75,
      moralComplexity: 0.62, narrativeExperimentation: 0.82, psychologicalIntensity: 0.78, humanism: 0.68, mythicScale: 0.80
    }
  },

  // ── 39. EPIC ROMANTIC ────────────────────────────────────────────────────
  // Anchors:   emotionality=0.97, spectacle=0.92, mythicScale=0.92
  // Suppressors: complexity=0.42, darkness=0.35, moralComplexity=0.48, density=0.58
  {
    name: 'Epic Romantic',
    subtitle: 'Grand Passions Across Historical Canvases',
    description: 'You love love stories told on a monumental scale. You are drawn to grand historic sweeps, lovers separated by wars or classes, and narratives that merge classical romance with dramatic historic backdrops.',
    color: '#E11D48',
    vector: {
      imagination: 0.68, wonder: 0.90, complexity: 0.42, atmosphere: 0.88, emotionality: 0.97,
      realism: 0.55, ambiguity: 0.45, optimism: 0.82, darkness: 0.35, spectacle: 0.92,
      characterFocus: 0.82, philosophical: 0.65, density: 0.58, intimacy: 0.75, worldbuilding: 0.70,
      moralComplexity: 0.48, narrativeExperimentation: 0.42, psychologicalIntensity: 0.62, humanism: 0.92, mythicScale: 0.92
    }
  },

  // ── 40. MORAL PROVOCATEUR ────────────────────────────────────────────────
  // Anchors:   darkness=0.95, ambiguity=0.95, moralComplexity=0.92
  // Suppressors: humanism=0.40, optimism=0.12, wonder=0.18, realism=0.70
  {
    name: 'Moral Provocateur',
    subtitle: 'Transgressive Questions & Visceral Crises',
    description: 'You want cinema to confront you. You look for transgressive ideas, ethical provocations, and characters in extreme pressure-cooker situations that force you to interrogate your own assumptions.',
    color: '#7F1D1D',
    vector: {
      imagination: 0.48, wonder: 0.18, complexity: 0.82, atmosphere: 0.88, emotionality: 0.62,
      realism: 0.70, ambiguity: 0.95, optimism: 0.12, darkness: 0.95, spectacle: 0.52,
      characterFocus: 0.82, philosophical: 0.92, density: 0.80, intimacy: 0.65, worldbuilding: 0.35,
      moralComplexity: 0.92, narrativeExperimentation: 0.72, psychologicalIntensity: 0.90, humanism: 0.40, mythicScale: 0.48
    }
  },

  // ── 41. DARK IDEALIST ────────────────────────────────────────────────────
  // Anchors:   atmosphere=0.95, emotionality=0.92, darkness=0.82
  // Suppressors: realism=0.42, density=0.48, moralComplexity=0.58, complexity=0.52
  {
    name: 'Dark Idealist',
    subtitle: 'Haunting Beauty & Romantic Melancholy',
    description: 'You find poetry in tragedy. You seek out gothic romances, dark fairytales, and melancholic stories where beauty and darkness intersect — proving that hope is most beautiful when surrounded by shadows.',
    color: '#6366F1',
    vector: {
      imagination: 0.85, wonder: 0.80, complexity: 0.52, atmosphere: 0.95, emotionality: 0.92,
      realism: 0.42, ambiguity: 0.80, optimism: 0.45, darkness: 0.82, spectacle: 0.70,
      characterFocus: 0.78, philosophical: 0.82, density: 0.48, intimacy: 0.80, worldbuilding: 0.65,
      moralComplexity: 0.58, narrativeExperimentation: 0.72, psychologicalIntensity: 0.78, humanism: 0.88, mythicScale: 0.68
    }
  },

  // ── 42. PHILOSOPHICAL SKEPTIC ────────────────────────────────────────────
  // Anchors:   ambiguity=0.98, philosophical=0.92, darkness=0.80
  // Suppressors: optimism=0.18, wonder=0.35, realism=0.55, worldbuilding=0.40
  {
    name: 'Philosophical Skeptic',
    subtitle: 'Dismantling Truths & Absurdist Realities',
    description: 'You enjoy cinema that deconstructs certainty. You drift toward absurdist logic, satirical critiques of truth, and stories that expose the chaos of human systems — leaving you with lingering intellectual skepticism.',
    color: '#4B5563',
    vector: {
      imagination: 0.68, wonder: 0.35, complexity: 0.90, atmosphere: 0.82, emotionality: 0.45,
      realism: 0.55, ambiguity: 0.98, optimism: 0.18, darkness: 0.80, spectacle: 0.38,
      characterFocus: 0.72, philosophical: 0.92, density: 0.80, intimacy: 0.52, worldbuilding: 0.40,
      moralComplexity: 0.90, narrativeExperimentation: 0.85, psychologicalIntensity: 0.80, humanism: 0.55, mythicScale: 0.48
    }
  },

  // ── 43. PSYCHOLOGICAL CARTOGRAPHER ──────────────────────────────────────
  // Anchors:   psychologicalIntensity=0.98, complexity=0.92, ambiguity=0.88
  // Suppressors: realism=0.55, optimism=0.25, spectacle=0.38, mythicScale=0.35
  {
    name: 'Psychological Cartographer',
    subtitle: 'Charting the Depths of Trauma & Memory',
    description: 'You appreciate movies that act as mental maps. You seek detailed deconstructions of grief, childhood memories, neuroses, and split identities — treating the mind as an infinite, stylized landscape.',
    color: '#8B5CF6',
    vector: {
      imagination: 0.75, wonder: 0.50, complexity: 0.92, atmosphere: 0.88, emotionality: 0.82,
      realism: 0.55, ambiguity: 0.88, optimism: 0.25, darkness: 0.90, spectacle: 0.38,
      characterFocus: 0.95, philosophical: 0.88, density: 0.78, intimacy: 0.85, worldbuilding: 0.38,
      moralComplexity: 0.78, narrativeExperimentation: 0.88, psychologicalIntensity: 0.98, humanism: 0.72, mythicScale: 0.35
    }
  },

  // ── 44. ATMOSPHERIC POET ─────────────────────────────────────────────────
  // Anchors:   atmosphere=0.98, wonder=0.90, humanism=0.92
  // Suppressors: darkness=0.32, density=0.35, complexity=0.42, spectacle=0.40
  {
    name: 'Atmospheric Poet',
    subtitle: 'Sensory Immersion & Lingering Moods',
    description: 'You want to float in cinematic mood. You seek slow, painterly frames, lush natural lighting, and ambient soundscapes that evoke nostalgia, peace, or slow-burning melancholy without heavy dialogue.',
    color: '#14B8A6',
    vector: {
      imagination: 0.78, wonder: 0.90, complexity: 0.42, atmosphere: 0.98, emotionality: 0.88,
      realism: 0.72, ambiguity: 0.80, optimism: 0.62, darkness: 0.32, spectacle: 0.40,
      characterFocus: 0.75, philosophical: 0.88, density: 0.35, intimacy: 0.92, worldbuilding: 0.42,
      moralComplexity: 0.55, narrativeExperimentation: 0.65, psychologicalIntensity: 0.52, humanism: 0.92, mythicScale: 0.48
    }
  },

  // ── 45. CHARACTER PURIST ─────────────────────────────────────────────────
  // Anchors:   characterFocus=0.98, intimacy=0.95, realism=0.93
  // Suppressors: spectacle=0.05, worldbuilding=0.08, imagination=0.15, mythicScale=0.10
  {
    name: 'Character Purist',
    subtitle: 'Performance-Driven Truths & Dialogue Mastery',
    description: 'For you, actors and writers are the entire film. You prefer dialogue-driven scripts, raw natural performances, and complex character interactions — actively avoiding visual gimmicks or epic scales.',
    color: '#10B981',
    vector: {
      imagination: 0.15, wonder: 0.45, complexity: 0.58, atmosphere: 0.72, emotionality: 0.90,
      realism: 0.93, ambiguity: 0.65, optimism: 0.65, darkness: 0.50, spectacle: 0.05,
      characterFocus: 0.98, philosophical: 0.75, density: 0.62, intimacy: 0.95, worldbuilding: 0.08,
      moralComplexity: 0.68, narrativeExperimentation: 0.45, psychologicalIntensity: 0.65, humanism: 0.95, mythicScale: 0.10
    }
  },

  // ── 46. NARRATIVE STRATEGIST ─────────────────────────────────────────────
  // Anchors:   complexity=0.95, density=0.92, narrativeExperimentation=0.90
  // Suppressors: emotionality=0.38, atmosphere=0.60, humanism=0.50, wonder=0.35
  {
    name: 'Narrative Strategist',
    subtitle: 'Clever Misdirection & Logical Clockworks',
    description: 'You love being outsmarted. You seek out tight, logical screenplays, heist mechanics, procedural investigations, and clockwork structures that hide clues in plain sight and reward analytical viewers.',
    color: '#4F46E5',
    vector: {
      imagination: 0.78, wonder: 0.35, complexity: 0.95, atmosphere: 0.60, emotionality: 0.38,
      realism: 0.68, ambiguity: 0.72, optimism: 0.48, darkness: 0.65, spectacle: 0.68,
      characterFocus: 0.65, philosophical: 0.78, density: 0.92, intimacy: 0.45, worldbuilding: 0.70,
      moralComplexity: 0.68, narrativeExperimentation: 0.90, psychologicalIntensity: 0.72, humanism: 0.50, mythicScale: 0.58
    }
  },

  // ── 47. COSMIC PHILOSOPHER ───────────────────────────────────────────────
  // Anchors:   philosophical=0.99, imagination=0.96, worldbuilding=0.90
  // Suppressors: wonder=0.70, darkness=0.42, emotionality=0.48, intimacy=0.35
  {
    name: 'Cosmic Philosopher',
    subtitle: 'Astrophysical Scales & Existential Humility',
    description: 'You merge the science-fiction lens with philosophical inquiry. You seek stories that use outer space, robotics, or future science to ask ancient questions about consciousness, creation, and human purpose.',
    color: '#2563EB',
    vector: {
      imagination: 0.96, wonder: 0.70, complexity: 0.82, atmosphere: 0.90, emotionality: 0.48,
      realism: 0.38, ambiguity: 0.85, optimism: 0.58, darkness: 0.42, spectacle: 0.92,
      characterFocus: 0.58, philosophical: 0.99, density: 0.72, intimacy: 0.35, worldbuilding: 0.90,
      moralComplexity: 0.62, narrativeExperimentation: 0.80, psychologicalIntensity: 0.68, humanism: 0.75, mythicScale: 0.95
    }
  },

  // ── 48. EMOTIONAL ARCHAEOLOGIST ──────────────────────────────────────────
  // Anchors:   emotionality=0.95, intimacy=0.97, psychologicalIntensity=0.82
  // Suppressors: spectacle=0.12, darkness=0.62, optimism=0.45, worldbuilding=0.18
  {
    name: 'Emotional Archaeologist',
    subtitle: 'Uncovering Buried Secrets & Family Regrets',
    description: 'You appreciate the excavation of family dynamics. You look for movies that dig into generations of secrets, unspoken regrets, and silent grief — exploring how memory and shame shape our closest relationships.',
    color: '#60A5FA',
    vector: {
      imagination: 0.28, wonder: 0.62, complexity: 0.58, atmosphere: 0.85, emotionality: 0.95,
      realism: 0.90, ambiguity: 0.72, optimism: 0.45, darkness: 0.62, spectacle: 0.12,
      characterFocus: 0.97, philosophical: 0.78, density: 0.62, intimacy: 0.97, worldbuilding: 0.18,
      moralComplexity: 0.72, narrativeExperimentation: 0.50, psychologicalIntensity: 0.82, humanism: 0.95, mythicScale: 0.25
    }
  },

  // ── 49. MYTHIC REALIST ───────────────────────────────────────────────────
  // Anchors:   mythicScale=0.88, imagination=0.90, realism=0.80
  // Suppressors: density=0.52, complexity=0.55, moralComplexity=0.58, darkness=0.48
  {
    name: 'Mythic Realist',
    subtitle: 'Blending Folklore with Gritty Groundedness',
    description: 'You love when the magical touches the mud. You seek out stories that place mythological legends, folklore, or magical occurrences within gritty, realistic, and historically grounded human landscapes.',
    color: '#059669',
    vector: {
      imagination: 0.90, wonder: 0.82, complexity: 0.55, atmosphere: 0.92, emotionality: 0.82,
      realism: 0.80, ambiguity: 0.75, optimism: 0.62, darkness: 0.48, spectacle: 0.72,
      characterFocus: 0.78, philosophical: 0.80, density: 0.52, intimacy: 0.75, worldbuilding: 0.82,
      moralComplexity: 0.58, narrativeExperimentation: 0.62, psychologicalIntensity: 0.65, humanism: 0.90, mythicScale: 0.88
    }
  },

  // ── 50. CINEMATIC ECLECTIC ───────────────────────────────────────────────
  // A genuinely wide-spectrum profile: moderately high across many dimensions,
  // no single dominant anchor above 0.72. Only wins when no other archetype fits.
  {
    name: 'Cinematic Eclectic',
    subtitle: 'Fluid Taste Traversing Genres & Scales',
    description: 'You refuse to be boxed in. Your taste is genuinely versatile — you shift easily from blockbusters to quiet indies, comedies to tragedies, valuing pure cinematic craft in whatever form it takes.',
    color: '#6B7280',
    vector: {
      imagination: 0.62, wonder: 0.65, complexity: 0.62, atmosphere: 0.68, emotionality: 0.68,
      realism: 0.62, ambiguity: 0.60, optimism: 0.65, darkness: 0.58, spectacle: 0.65,
      characterFocus: 0.68, philosophical: 0.65, density: 0.62, intimacy: 0.65, worldbuilding: 0.62,
      moralComplexity: 0.60, narrativeExperimentation: 0.65, psychologicalIntensity: 0.60, humanism: 0.70, mythicScale: 0.60
    }
  }

];
