// ─── Dynamic Ecosystem Inference ─────────────────────────────────────────────
// Extracted from directorEngine.js — Step 30G


// ─── Dynamic Ecosystem Inference ─────────────────────────────────────────────

export const inferDynamicEcosystem = (director = {}) => {
  const genres = (director.genres || []).map(g => g.toLowerCase());
  const overview = (director.overview || '').toLowerCase();

  // Horror
  if (genres.includes('horror')) {
    if (overview.includes('psychological') || overview.includes('trauma')) {
      return 'american_psychological_dread';
    }
    if (overview.includes('occult') || overview.includes('ritual')) {
      return 'american_occult_horror';
    }
    return 'american_elevated_horror';
  }

  // Crime
  if (genres.includes('crime')) {
    if (overview.includes('gangster') || overview.includes('underworld')) {
      return 'american_operatic_crime';
    }
    return 'american_crime_realism';
  }

  // Science Fiction
  if (genres.includes('science fiction')) {
    if (overview.includes('technology') || overview.includes('ai')) {
      return 'american_techno_anxiety';
    }
    return 'american_philosophical_scifi';
  }

  // Romance
  if (genres.includes('romance')) {
    return 'american_romantic_humanism';
  }

  // Thriller
  if (genres.includes('thriller')) {
    return 'american_urban_paranoia';
  }

  // Drama
  if (genres.includes('drama')) {
    return 'american_indie_realism';
  }

  return null;
};
