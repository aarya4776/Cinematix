const API_KEY = import.meta.env?.VITE_TMDB_API_KEY || '72a998dcbb7a2e67fe96f316866c8fdb';
const OMDB_API_KEY = import.meta.env?.VITE_OMDB_API_KEY || 'trilogy';
const BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/';

// Cache for external ratings to avoid redundant OMDb calls
const externalRatingsCache = new Map();

/**
 * Fetches real IMDb and Rotten Tomatoes ratings from the free OMDb API.
 * OMDb supports CORS (*) so this works directly from the browser.
 * Returns null for any rating that is unavailable — never fabricates data.
 *
 * @param {string} imdbId  - The IMDb ID (e.g. "tt0137523")
 * @returns {{ imdb: string|null, rottenTomatoes: string|null }} real ratings or null
 */
const getExternalRatings = async (imdbId) => {
  if (!imdbId) return { imdb: null, rottenTomatoes: null };

  if (externalRatingsCache.has(imdbId)) {
    return externalRatingsCache.get(imdbId);
  }

  try {
    const url = `${OMDB_BASE_URL}/?i=${imdbId}&apikey=${OMDB_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OMDb error: ${response.status}`);
    const data = await response.json();

    if (data.Response !== 'True') {
      const result = { imdb: null, rottenTomatoes: null };
      externalRatingsCache.set(imdbId, result);
      return result;
    }

    const ratingsArr = data.Ratings || [];
    const imdbEntry = ratingsArr.find(r => r.Source === 'Internet Movie Database');
    const rtEntry = ratingsArr.find(r => r.Source === 'Rotten Tomatoes');
    const metaEntry = ratingsArr.find(r => r.Source === 'Metacritic');
    const metascore = metaEntry ? metaEntry.Value : (data.Metascore && data.Metascore !== 'N/A' ? `${data.Metascore}/100` : null);

    const result = {
      imdb: imdbEntry ? imdbEntry.Value : (data.imdbRating && data.imdbRating !== 'N/A' ? `${data.imdbRating}/10` : null),
      rottenTomatoes: rtEntry ? rtEntry.Value : null,
      metascore,
    };

    externalRatingsCache.set(imdbId, result);
    return result;
  } catch (error) {
    console.error('[OMDb] Error fetching external ratings:', error);
    const result = { imdb: null, rottenTomatoes: null };
    externalRatingsCache.set(imdbId, result);
    return result;
  }
};

const fetchApi = async (endpoint, params = {}) => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    language: 'en-US',
    ...params,
  });

  try {
    const response = await fetch(`${BASE_URL}${endpoint}?${queryParams}`);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('TMDB API Error:', error);
    return null;
  }
};

const multiWordIntents = [
  { phrase: 'mind bending', genres: [9648, 53], label: 'Mind-Bending Thrillers' },
  { phrase: 'feel good', genres: [35], label: 'Feel-Good Comedies' },
  { phrase: 'romantic comedy', genres: [10749, 35], label: 'Romantic Comedies' },
  { phrase: 'romantic comedies', genres: [10749, 35], label: 'Romantic Comedies' },
  { phrase: 'alien invasion', genres: [878], label: 'Alien Invasion Sci-Fi' },
  { phrase: 'space adventure', genres: [878, 12], label: 'Epic Space Adventures' },
  { phrase: 'space adventures', genres: [878, 12], label: 'Epic Space Adventures' },
  { phrase: 'crime thriller', genres: [80, 53], label: 'Gritty Crime Thrillers' },
  { phrase: 'crime thrillers', genres: [80, 53], label: 'Gritty Crime Thrillers' },
  { phrase: 'superhero action', genres: [28], label: 'Superhero Blockbusters' },
  { phrase: 'superhero movies', genres: [28, 12], label: 'Superhero Action Epics' },
  { phrase: 'psychological horror', genres: [27, 53], label: 'Psychological Horror Thrillers' },
  { phrase: 'psychological thriller', genres: [53, 9648], label: 'Psychological Thrillers' },
  { phrase: 'psychological thrillers', genres: [53, 9648], label: 'Psychological Thrillers' },
  { phrase: 'science fiction', genres: [878], label: 'Science Fiction' },
  { phrase: 'sci fi', genres: [878], label: 'Sci-Fi' },
  { phrase: 'real life', genres: [99, 36], label: 'Real Life & Historical Dramas' },
  { phrase: 'dark thriller', genres: [53], label: 'Dark Suspense Thrillers' },
  { phrase: 'dark thrillers', genres: [53], label: 'Dark Suspense Thrillers' },
  { phrase: 'action adventure', genres: [28, 12], label: 'Action Adventures' },
  { phrase: 'action adventures', genres: [28, 12], label: 'Action Adventures' }
];

const keywordMapping = {
  action: { id: 28, name: 'Action', adjective: 'Action' },
  adventure: { id: 12, name: 'Adventure', adjective: 'Adventure' },
  animation: { id: 16, name: 'Animation', adjective: 'Animated' },
  animated: { id: 16, name: 'Animation', adjective: 'Animated' },
  comedy: { id: 35, name: 'Comedy', adjective: 'Comedy' },
  crime: { id: 80, name: 'Crime', adjective: 'Crime' },
  documentary: { id: 99, name: 'Documentary', adjective: 'Documentary' },
  drama: { id: 18, name: 'Drama', adjective: 'Drama' },
  family: { id: 10751, name: 'Family', adjective: 'Family-Friendly' },
  fantasy: { id: 14, name: 'Fantasy', adjective: 'Fantasy' },
  history: { id: 36, name: 'History', adjective: 'Historical' },
  horror: { id: 27, name: 'Horror', adjective: 'Horror' },
  music: { id: 10402, name: 'Music', adjective: 'Musical' },
  musical: { id: 10402, name: 'Music', adjective: 'Musical' },
  mystery: { id: 9648, name: 'Mystery', adjective: 'Mystery' },
  romance: { id: 10749, name: 'Romance', adjective: 'Romance' },
  romantic: { id: 10749, name: 'Romance', adjective: 'Romantic' },
  scifi: { id: 878, name: 'Sci-Fi', adjective: 'Sci-Fi' },
  thriller: { id: 53, name: 'Thriller', adjective: 'Thriller' },
  war: { id: 10752, name: 'War', adjective: 'War' },
  western: { id: 37, name: 'Western', adjective: 'Western' },

  ghost: { id: 27, modifier: 'Supernatural Ghost' },
  paranormal: { id: 27, modifier: 'Paranormal' },
  spooky: { id: 27, modifier: 'Spooky' },
  scary: { id: 27, modifier: 'Terrifying' },
  zombie: { id: 27, modifier: 'Zombie' },
  undead: { id: 27, modifier: 'Undead' },
  vampire: { id: 27, modifier: 'Vampire' },
  monster: { id: 27, modifier: 'Monster' },
  supernatural: { id: 27, modifier: 'Supernatural' },
  fun: { id: 35, modifier: 'Feel-Good' },
  funny: { id: 35, modifier: 'Hilarious' },
  hilarious: { id: 35, modifier: 'Hilarious' },
  happy: { id: 35, modifier: 'Feel-Good' },
  sad: { id: 18, modifier: 'Emotional' },
  emotional: { id: 18, modifier: 'Emotional' },
  tearjerker: { id: 18, modifier: 'Heart-Wrenching' },
  epic: { id: 12, modifier: 'Epic' },
  space: { id: 878, modifier: 'Space' },
  alien: { id: 878, modifier: 'Alien' },
  future: { id: 878, modifier: 'Futuristic' },
  futuristic: { id: 878, modifier: 'Futuristic' },
  robot: { id: 878, modifier: 'Robotic' },
  cyberpunk: { id: 878, modifier: 'Cyberpunk' },
  dystopian: { id: 878, modifier: 'Dystopian' },
  spy: { id: 53, modifier: 'Spy' },
  detective: { id: 80, modifier: 'Detective' },
  cop: { id: 80, modifier: 'Police/Cop' },
  mafia: { id: 80, modifier: 'Mafia' },
  gangster: { id: 80, modifier: 'Gangster' },
  heist: { id: 80, modifier: 'Heist' },
  magic: { id: 14, modifier: 'Magical' },
  dragon: { id: 14, modifier: 'Mythical' },
  wizard: { id: 14, modifier: 'Wizardry' },
  witch: { id: 14, modifier: 'Witchcraft' },
  dark: { id: 53, modifier: 'Dark' },
  suspense: { id: 53, modifier: 'Suspenseful' },
  intense: { id: 53, modifier: 'Intense' },
  gripping: { id: 53, modifier: 'Gripping' },
  psychological: { id: 53, modifier: 'Psychological' },
  battle: { id: 10752, modifier: 'Battle-Heavy' },
  military: { id: 10752, modifier: 'Military' },
  superhero: { id: 28, modifier: 'Superhero' },
  hero: { id: 28, modifier: 'Heroic' }
};

const detectIntent = (query) => {
  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  if (!cleanQuery) return null;

  const detectedGenres = new Set();
  const detectedModifiers = [];
  const detectedBaseGenres = [];
  let matchedPhraseLabel = '';

  // 1. Check multi-word phrase matches
  let remainingQuery = cleanQuery;
  multiWordIntents.forEach(item => {
    if (cleanQuery.includes(item.phrase)) {
      item.genres.forEach(gId => detectedGenres.add(gId));
      matchedPhraseLabel = item.label;
      remainingQuery = remainingQuery.replace(item.phrase, '');
    }
  });

  // 2. Tokenize the remaining query
  const words = remainingQuery.split(' ');
  words.forEach(word => {
    if (keywordMapping[word]) {
      const mapItem = keywordMapping[word];
      detectedGenres.add(mapItem.id);
      if (mapItem.modifier) {
        detectedModifiers.push(mapItem.modifier);
      } else if (mapItem.adjective) {
        detectedBaseGenres.push(mapItem.adjective);
      }
    }
  });

  if (detectedGenres.size > 0) {
    const genreIds = Array.from(detectedGenres).join(',');

    // Build dynamic label
    let label;
    if (matchedPhraseLabel) {
      label = matchedPhraseLabel;
    } else {
      const uniqueModifiers = Array.from(new Set(detectedModifiers));
      const uniqueBaseGenres = Array.from(new Set(detectedBaseGenres));

      if (uniqueModifiers.length > 0 && uniqueBaseGenres.length > 0) {
        label = `${uniqueModifiers.join(' ')} ${uniqueBaseGenres.join(' ')} Favorites`;
      } else if (uniqueModifiers.length > 0) {
        label = `${uniqueModifiers.join(' ')} Movies`;
      } else if (uniqueBaseGenres.length > 0) {
        label = `${uniqueBaseGenres.join(' ')} Favorites`;
      } else {
        label = 'Curated Cinematic Recommendations';
      }
    }

    label = label.replace(/\s+/g, ' ').trim();
    // Capitalize first letter of each word
    label = label.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return { genreIds, label };
  }

  return null;
};
const genreMap = {
  action: 28,
  adventure: 12,
  animation: 16,
  biography: 36,      // TMDB uses History for biopics
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  musical: 10402,     // same TMDB Music genre
  mystery: 9648,
  romance: 10749,
  scifi: 878,
  'sci-fi': 878,
  'science-fiction': 878,
  superhero: 28,      // TMDB maps superhero films under Action
  sports: 28,         // no dedicated TMDB sports genre; use Action as closest
  thriller: 53,
  'tv-movie': 10770,
  'tv movie': 10770,
  tv: 10770,
  war: 10752,
  western: 37
};

const languageCodeMap = {
  'any': 'any',
  'en': 'en',
  'ko': 'ko',
  'ja': 'ja',
  'hi': 'hi',
  'ta': 'ta',
  'th': 'th',
  'te': 'te',
  'ml': 'ml',
  'kn': 'kn',
  'bn': 'bn',
  'mr': 'mr',
  'pa': 'pa',
  'zh': 'zh',
  'es': 'es',
  'fr': 'fr',
  'ar': 'ar',
  'fa': 'fa',
  'tr': 'tr',
  'id': 'id',
  'vi': 'vi',
  'ru': 'ru',
  'de': 'de',
  'it': 'it',
  'pl': 'pl',
  'sv': 'sv',
  'no': 'no',
  'da': 'da',
  'el': 'el',
  'pt': 'pt',
  'ro': 'ro',
  'hu': 'hu',
  'uk': 'uk',
  'nl': 'nl',
  'tl': 'tl',
  'ms': 'ms',
  'sr': 'sr',
  'cs': 'cs',
  'fi': 'fi',
  'Taiwanese': 'zh',
  'Hong Kong': 'zh'
};

const normalizeLanguage = (lang) => {
  if (!lang || lang === 'any') return 'any';
  const val = languageCodeMap[lang] || lang;
  if (!val || val === 'undefined' || val === 'null') return 'any';
  return val;
};

const getGenreIdByName = (name) => {
  if (!name) return null;
  const cleanName = name.toLowerCase().trim().replace(/[\s_]+/g, '-');
  return genreMap[cleanName] || genreMap[cleanName.replace(/-/g, ' ')] || null;
};

const getGenreNameById = (id) => {
  const numericId = parseInt(id, 10);
  if (numericId === 10770) return 'TV Movie';
  if (numericId === 878) return 'Sci-Fi';
  const found = Object.entries(genreMap).find((entry) => entry[1] === numericId);
  if (!found) return null;
  const name = found[0];
  if (name === 'scifi' || name === 'sci-fi' || name === 'science-fiction') return 'Sci-Fi';
  if (name === 'tv-movie' || name === 'tv movie' || name === 'tv') return 'TV Movie';
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const directorCreditsCache = new Map();
const actorCreditsCache = new Map();

// 100% Human-Curated Masterpiece Registry for Legendary Cinephile Auteurs
// Maps TMDB Person IDs -> Array of TMDB Movie IDs representing their defining masterpieces (Criterion/Sight&Sound/Letterboxd standard)
const CURATED_DIRECTORS = {
  // Bong Joon Ho
  "21684": [11324, 496243, 30018, 1255, 110416],
  // Park Chan-wook
  "10099": [670, 290098, 705996, 2440, 4550, 4640],
  // Akira Kurosawa
  "5026": [346, 11902, 3782, 11645, 12493, 11878, 12613],
  // Wong Kar-wai
  "12453": [843, 11104, 11284, 2082, 844, 18329],
  // Hayao Miyazaki
  "608": [129, 128, 8392, 4935, 81, 10515, 508883, 149870],
  // Satoshi Kon
  "100128": [10494, 4977, 33320, 13393],
  // Hirokazu Kore-eda
  "25645": [505192, 11025, 14881, 10574, 768225, 174349],
  // Yasujiro Ozu
  "95501": [30206, 42485, 56221, 42502, 45484, 63200],
  // Christopher Nolan
  "525": [157336, 155, 27205, 872585, 77, 374720],
  // Quentin Tarantino
  "138": [680, 500, 16869, 184, 68718, 466272, 24],
  // Martin Scorsese
  "1032": [769, 103, 104, 106646, 1422, 398978],
  // Stanley Kubrick
  "240": [62, 935, 185, 694, 2375, 345],
  // Alfred Hitchcock
  "2636": [426, 567, 539, 213, 1054],
  // David Lynch
  "5655": [1018, 793, 985, 9825],
  // Denis Villeneuve
  "137427": [329865, 146233, 273481, 335984, 46261, 693134]
};

const getDirectorCredits = (directorId) => {
  const cacheKey = String(directorId);
  if (!directorCreditsCache.has(cacheKey)) {
    directorCreditsCache.set(cacheKey, fetchApi(`/person/${directorId}/movie_credits`));
  }
  return directorCreditsCache.get(cacheKey);
};

const isGenuineDirector = (job) => {
  if (!job) return false;
  const j = job.toLowerCase().trim();

  // Must contain 'director'
  if (!j.includes('director')) return false;

  // Strict exclusions for assistant, unit, art, creative, etc.
  const excludedSubwords = [
    'assistant', 'associate', 'second unit', '2nd unit', 'third unit', '3rd unit',
    'art', 'casting', 'photography', 'photo', 'technical', 'stage',
    'musical', 'music', 'video', 'creative', 'adviser', 'advisor',
    'consultant', 'advisory', 'additional', 'utility', 'lighting',
    'effects', 'dubbing', 'voice', 'dialogue', 'action director',
    'choreo', 'stunt', 'wardrobe', 'production', 'post-production',
    'executive', 'technical director', 'animation director'
  ];
  return !excludedSubwords.some(word => j.includes(word));
};

const isPromotionalOrBehindTheScenes = (title) => {
  if (!title) return false;
  const t = title.toLowerCase();
  const promoKeywords = [
    'making of', 'behind the scenes', 'bonus feature', 'deleted scenes',
    'retrospective', 'tribute', 'extra features', 'promo', 'trailer',
    'interview', 'press conference', 'featurette', 'teaser', 'sneak peek'
  ];
  return promoKeywords.some(keyword => t.includes(keyword));
};

const isCuratedDirectorMovie = (movie) => {
  if (!movie?.id || !movie.title || !movie.poster_path || !movie.release_date) return false;
  if (movie.adult) return false;
  if (isPromotionalOrBehindTheScenes(movie.title)) return false;

  const genres = movie.genre_ids || [];
  const voteCount = movie.vote_count || 0;
  const popularity = movie.popularity || 0;

  if (genres.includes(10770)) return false;
  if (genres.includes(99) && voteCount < 1000) return false;

  return voteCount >= 50 || popularity >= 4;
};

const getDirectedMoviesFromCredits = (credits) => {
  const crewList = credits?.crew || [];

  const rawDirected = crewList.filter(movie => {
    return isGenuineDirector(movie?.job) && isCuratedDirectorMovie(movie);
  });

  const deduplicated = [];
  const seenIds = new Set();
  const seenTitles = new Map();

  const normalizeTitle = (title) => {
    if (!title) return '';
    return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  };

  // Sort by metadata quality first, so that the best version of duplicate titles is preserved
  const candidates = rawDirected.map(movie => {
    const dateStr = movie.release_date || '';
    const year = dateStr ? parseInt(dateStr.substring(0, 4), 10) : 0;
    const normalizedTitle = normalizeTitle(movie.title);

    let quality = 0;
    if (movie.poster_path) quality += 10;
    if (movie.backdrop_path) quality += 5;
    if (movie.overview && movie.overview.length > 50) quality += 5;
    if (movie.vote_count) quality += Math.min(movie.vote_count / 100, 10);
    if (movie.popularity) quality += Math.min(movie.popularity, 5);

    return {
      ...movie,
      _year: year,
      _normalizedTitle: normalizedTitle,
      _quality: quality
    };
  }).sort((a, b) => b._quality - a._quality);

  candidates.forEach(item => {
    // Strict ID deduplication
    if (seenIds.has(item.id)) return;

    // Title + Year deduplication (prevent duplicate entries with same/similar title within 1 year)
    if (item._normalizedTitle) {
      const match = seenTitles.get(item._normalizedTitle);
      if (match) {
        const yearDiff = Math.abs(item._year - match.year);
        if (yearDiff <= 1) {
          return;
        }
      } else {
        seenTitles.set(item._normalizedTitle, {
          year: item._year,
          id: item.id
        });
      }
    }

    seenIds.add(item.id);
    deduplicated.push(item);
  });

  return deduplicated;
};

const getDirectorEssentialScore = (movie, selectedDecades = {}, selectedFranchises = new Set()) => {
  const voteAverage = movie.vote_average || 0;
  const voteCount = movie.vote_count || 0;
  const popularity = movie.popularity || 0;
  const isNonEnglish = movie.original_language && movie.original_language !== 'en';

  // 1. Auteur/Acclaim Bias (Criterion / Sight & Sound weighting)
  // Non-linear rating weight to heavily favor artistic excellence
  const ratingWeight = Math.pow(voteAverage, 3) * 1.5;

  // 2. High-Prestige Auteur / World Cinema Rescue Boost
  // Regional/world cinema masterpieces have high ratings but low vote counts on TMDB.
  // We apply an even stronger boost for non-English masterpieces to protect them from commercial bias!
  let prestigeRescue = 0;
  if (voteAverage >= 7.7) {
    if (isNonEnglish) {
      // World cinema masterpiece boost
      if (voteCount < 1000) prestigeRescue = 220; // Huge boost for rare/regional classics!
      else prestigeRescue = 120;
    } else {
      // English masterpiece boost
      if (voteCount < 1500) prestigeRescue = 180;
      else prestigeRescue = 80;
    }
  } else if (voteAverage >= 7.3) {
    if (isNonEnglish) {
      prestigeRescue = 120;
    } else {
      prestigeRescue = 80;
    }
  } else if (voteAverage < 6.5) {
    prestigeRescue = -180; // Severe penalty for mediocre works to prevent filler
  }

  // 3. Logarithmic Vote Count (highly compressed, especially for non-English films where vote counts are skewed)
  const voteCountCompressor = isNonEnglish ? 10 : 18;
  const audienceConsensus = Math.log10(Math.max(voteCount, 1)) * voteCountCompressor;

  // 4. Minimize commercial popularity influence
  // For non-English films, popularity is highly skewed by recent commercial releases; compress it to near zero
  const popCompressor = isNonEnglish ? 0.01 : 0.05;
  const commercialScore = Math.min(popularity * popCompressor, 5);

  // 5. Star Vehicle Commercial Hit Penalty (to prevent actor-popularity blockbusters from dominating director masterpieces)
  let starVehiclePenalty = 0;
  if (movie.genre_ids) {
    const commercialGenres = [28, 35, 10751]; // Action, Comedy, Family
    const isCommercial = movie.genre_ids.some(g => commercialGenres.includes(g));

    // If it's a commercial genre, has high popularity/votes, but only average ratings,
    // it is highly likely an actor-driven mass vehicle rather than an auteur masterpiece.
    if (isCommercial && voteAverage < 7.4) {
      if (isNonEnglish && (popularity > 25 || voteCount > 300)) {
        starVehiclePenalty = -150; // Heavy penalty to push out mass commercial star vehicles!
      } else if (!isNonEnglish && (popularity > 80 || voteCount > 1500)) {
        starVehiclePenalty = -100;
      }
    }
  }

  // 6. Classic Era Landmark Boost (films before 2000 that survived the test of time)
  const dateStr = movie.release_date || '';
  const year = dateStr ? parseInt(dateStr.substring(0, 4), 10) : 0;
  let classicEraBoost = 0;
  if (year > 0 && year < 2000) {
    if (voteAverage >= 7.4) {
      classicEraBoost = 80; // Strong boost for verified classics!
    } else if (voteAverage >= 7.0) {
      classicEraBoost = 40;
    }
  }

  // 7. Genre Prestige Bonus (Drama, History, War, Mystery)
  let genreBonus = 0;
  if (movie.genre_ids) {
    const prestigeGenres = [18, 36, 10752, 9648];
    const hasPrestige = movie.genre_ids.some(g => prestigeGenres.includes(g));
    if (hasPrestige) genreBonus = 25;
  }

  let finalScore = ratingWeight + prestigeRescue + audienceConsensus + commercialScore + starVehiclePenalty + classicEraBoost + genreBonus;

  // 8. Career Evolution / Decade Diversity Boost
  const decade = year > 0 ? Math.floor(year / 10) * 10 : 0;
  if (decade > 0) {
    const selectedCount = selectedDecades[decade] || 0;
    if (selectedCount === 0) {
      finalScore += 50; // Boost to ensure era representation!
    } else if (selectedCount >= 2) {
      finalScore -= 70; // Heavier penalty to prevent clumping
    }
  }

  // 9. Franchise/Sequel Penalty
  const normalizeTitle = (title) => {
    if (!title) return '';
    return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  };
  const normTitle = normalizeTitle(movie.title);

  const franchiseKeywords = ['godfather', 'star wars', 'lord of the rings', 'matrix', 'alien', 'avengers', 'harry potter', 'toy story', 'kill bill', 'spider-man', 'batman', 'superman', 'jurassic', 'john wick', 'fast & furious', 'pirates of the caribbean', 'hunger games', 'twilight', 'shrek', 'mission: impossible'];
  const matchedFranchise = franchiseKeywords.find(kw => normTitle.includes(kw));

  if (matchedFranchise) {
    if (selectedFranchises.has(matchedFranchise)) {
      finalScore -= 150; // Severe franchise penalty
    }
  } else {
    for (const selected of selectedFranchises) {
      const selectedWords = selected.split(' ').filter(w => w.length > 4);
      if (selectedWords.length > 0) {
        const overlap = selectedWords.filter(w => normTitle.includes(w));
        if (overlap.length >= 2 || (selectedWords.length === 1 && normTitle.includes(selectedWords[0]))) {
          finalScore -= 120;
          break;
        }
      }
    }
  }

  return finalScore;
};

const sortDirectorEssentials = (movies, directorId = null) => {
  const rawList = [...movies];

  // 1. If this is a pre-verified curated director, use the exact curated list to guarantee 100% human-level accuracy!
  if (directorId && CURATED_DIRECTORS[String(directorId)]) {
    const curatedIds = CURATED_DIRECTORS[String(directorId)];

    // Filter and map in the exact order specified in our curated list
    const curatedMovies = curatedIds
      .map(id => rawList.find(m => String(m.id) === String(id)))
      .filter(Boolean);

    if (curatedMovies.length >= 3) {
      return curatedMovies;
    }
  }

  const totalCount = rawList.length;

  // Step 1: Pre-filter out weak and irrelevant entries
  const preFiltered = rawList.filter(movie => {
    const voteAverage = movie.vote_average || 0;
    const voteCount = movie.vote_count || 0;
    const titleLower = (movie.title || '').toLowerCase();

    // Strict genre/promotional filter
    const isBTS = titleLower.includes('making of') ||
      titleLower.includes('behind the scenes') ||
      titleLower.includes('bonus feature') ||
      titleLower.includes('tribute') ||
      titleLower.includes('retrospective');
    if (isBTS) return false;

    if (totalCount >= 15) {
      // Large catalog: strict minimum quality and vote count
      return voteAverage >= 6.4 && voteCount >= 50;
    } else if (totalCount >= 5) {
      // Medium catalog: moderate minimum quality
      return voteAverage >= 6.0 && voteCount >= 15;
    } else {
      // Small catalog: show genuine works
      return voteAverage >= 5.0 || voteCount >= 5;
    }
  });

  // Step 2: Adaptive Iterative Selection
  // Instead of simple sorting, we select films one-by-one and dynamically apply
  // Decade Saturation penalties and Sequel/Franchise stacking penalties.
  const selectedFilms = [];
  const selectedDecades = {};
  const selectedFranchises = new Set();

  const normalizeTitle = (title) => {
    if (!title) return '';
    return title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  };

  // We loop to select up to 8 movies (and at least 4 if available)
  const targetSize = Math.max(4, Math.min(8, preFiltered.length));
  const remainingCandidates = [...preFiltered];

  for (let i = 0; i < targetSize; i++) {
    if (remainingCandidates.length === 0) break;

    // Rescore all remaining candidates with the current state of selectedDecades & selectedFranchises
    remainingCandidates.forEach(cand => {
      cand._dynamicScore = getDirectorEssentialScore(cand, selectedDecades, selectedFranchises);
    });

    // Sort remaining candidates by dynamic score
    remainingCandidates.sort((a, b) => b._dynamicScore - a._dynamicScore);

    // Select the best candidate
    const bestCand = remainingCandidates.shift();
    selectedFilms.push(bestCand);

    // Record its decade
    const dateStr = bestCand.release_date || '';
    const year = dateStr ? parseInt(dateStr.substring(0, 4), 10) : 0;
    const decade = year > 0 ? Math.floor(year / 10) * 10 : 0;
    if (decade > 0) {
      selectedDecades[decade] = (selectedDecades[decade] || 0) + 1;
    }

    // Record its franchise
    const normTitle = normalizeTitle(bestCand.title);
    const franchiseKeywords = ['godfather', 'star wars', 'lord of the rings', 'matrix', 'alien', 'avengers', 'harry potter', 'toy story', 'kill bill', 'spider-man', 'batman', 'superman', 'jurassic', 'john wick', 'fast & furious', 'pirates of the caribbean', 'hunger games', 'twilight', 'shrek', 'mission: impossible'];
    const matchedFranchise = franchiseKeywords.find(kw => normTitle.includes(kw)) || normTitle;
    selectedFranchises.add(matchedFranchise);
  }

  // Final chronological sort for elegant presentation
  return selectedFilms.sort((a, b) => {
    const y1 = a.release_date ? parseInt(a.release_date.substring(0, 4), 10) : 0;
    const y2 = b.release_date ? parseInt(b.release_date.substring(0, 4), 10) : 0;
    if (y1 !== y2) return y1 - y2;
    return (a.title || '').localeCompare(b.title || '');
  });
};

const sortDirectorHiddenGems = (movies, directorId = null) => {
  const essentialIds = new Set(sortDirectorEssentials(movies, directorId).map(movie => movie.id));

  let gems = movies.filter(movie => {
    const voteAverage = movie.vote_average || 0;
    const voteCount = movie.vote_count || 0;
    const popularity = movie.popularity || 0;

    return (
      !essentialIds.has(movie.id) &&
      voteAverage >= 6.6 &&
      voteCount >= 75 &&
      popularity <= 75 &&
      (voteCount <= 6000 || popularity <= 35)
    );
  });

  if (gems.length < 3) {
    gems = movies.filter(movie => {
      const voteAverage = movie.vote_average || 0;
      const voteCount = movie.vote_count || 0;
      return !essentialIds.has(movie.id) && voteAverage >= 6.2 && voteCount >= 50;
    });
  }

  return [...gems]
    .sort((a, b) => {
      const aScore = ((a.vote_average || 0) * 22) + Math.log10(Math.max(a.vote_count || 1, 1)) * 16 - Math.min(a.popularity || 0, 120) * 0.25;
      const bScore = ((b.vote_average || 0) * 22) + Math.log10(Math.max(b.vote_count || 1, 1)) * 16 - Math.min(b.popularity || 0, 120) * 0.25;
      return bScore - aScore;
    });
};

// ============================================================================
// NEXT-GEN SEARCH ENGINE ARCHITECTURE: Smart Intent, Bayesian Ranking, Typo Resilience
// ============================================================================
const SEARCH_TYPOS = {
  // Nolan & Modern Masters
  'oppenhimer': 'oppenheimer',
  'oppenhiemer': 'oppenheimer',
  'openheimer': 'oppenheimer',
  'interstelar': 'interstellar',
  'intersteller': 'interstellar',
  'interstaller': 'interstellar',
  'inceptoin': 'inception',
  'incepton': 'inception',
  'insception': 'inception',
  'memento': 'memento',
  'the prestig': 'the prestige',
  'prestige': 'the prestige',
  'dark knight': 'the dark knight',
  'dark night': 'the dark knight',
  // Classics & Blockbusters
  'gladiater': 'gladiator',
  'gladaitor': 'gladiator',
  'avengars': 'avengers',
  'avenger': 'avengers',
  'spiderman': 'spider-man',
  'spider man': 'spider-man',
  'bat man': 'batman',
  'shawshank redemtion': 'the shawshank redemption',
  'shawshank': 'the shawshank redemption',
  'pulp ficiton': 'pulp fiction',
  'pulpfiction': 'pulp fiction',
  'whiplsh': 'whiplash',
  'whiplas': 'whiplash',
  'shutter islan': 'shutter island',
  'inglorious basterds': 'inglourious basterds',
  'inglorious bastards': 'inglourious basterds',
  'godfathr': 'the godfather',
  'godfather': 'the godfather',
  'parasit': 'parasite',
  'parasyte': 'parasite',
  'fightclub': 'fight club',
  'departed': 'the departed',
  'matrix': 'the matrix',
  'spirited awy': 'spirited away',
  'spirited awat': 'spirited away',
  'totoro': 'my neighbor totoro',
  'blade runer': 'blade runner',
  'bladerunner': 'blade runner',
  'mad max': 'mad max: fury road',
  'jurrasic park': 'jurassic park',
  'starwars': 'star wars',
  'lord of the rings': 'the lord of the rings',
  'lotr': 'the lord of the rings',
  'goodfellas': 'goodfellas',
  'good fellas': 'goodfellas',
  'se7en': 'seven',
  // Renowned Directors / Auteurs
  'tarentino': 'quentin tarantino',
  'tarantino': 'quentin tarantino',
  'scorcese': 'martin scorsese',
  'scorsese': 'martin scorsese',
  'scorses': 'martin scorsese',
  'kubrik': 'stanley kubrick',
  'kubrick': 'stanley kubrick',
  'miyazake': 'hayao miyazaki',
  'miyazaki': 'hayao miyazaki',
  'nolan': 'christopher nolan',
  'fincher': 'david fincher',
  'villeneuve': 'denis villeneuve',
  'kurosawa': 'akira kurosawa',
  'bong joon ho': 'bong joon-ho',
  'bong joonho': 'bong joon-ho',
  'park chan wook': 'park chan-wook',
  'wong kar wai': 'wong kar-wai',
  'hitchcock': 'alfred hitchcock'
};

const normalizeSearchTerm = (str) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
};

const computeSearchRelevance = (movie, rawQuery) => {
  if (!movie) return -1000;
  const title = (movie.title || '').trim();
  const origTitle = (movie.original_title || '').trim();
  const normTitle = normalizeSearchTerm(title);
  const normOrig = normalizeSearchTerm(origTitle);
  const normQuery = normalizeSearchTerm(rawQuery);
  const queryWords = normQuery.split(' ').filter(Boolean);

  let score = 0;

  // 1. Text Similarity & Exact Match Hierarchy
  if (normTitle === normQuery || normOrig === normQuery) {
    score += 320;
  } else {
    // Strip leading English articles
    const stripArt = (s) => s.replace(/^(the|a|an)\s+/, '');
    if (stripArt(normTitle) === stripArt(normQuery)) {
      score += 280;
    } else if (normTitle.startsWith(normQuery) || normOrig.startsWith(normQuery)) {
      score += 150;
    } else if (normTitle.includes(normQuery) || normOrig.includes(normQuery)) {
      score += 80;
    }
  }

  // Multi-word coverage
  if (queryWords.length > 1) {
    const matched = queryWords.filter(w => normTitle.includes(w) || normOrig.includes(w)).length;
    score += (matched / queryWords.length) * 60;
  }

  // 2. Metadata Quality Signals
  if (movie.poster_path) score += 35;
  else score -= 45; // Deprioritize obscure catalog entries missing posters

  if (movie.backdrop_path) score += 12;
  if (!movie.overview || movie.overview.length < 15) score -= 25;

  // 3. Bayesian Rating & Cultural Prominence
  const voteCount = Number(movie.vote_count) || 0;
  const voteAvg = Number(movie.vote_average) || 0;
  const pop = Number(movie.popularity) || 0;

  // Bayesian rating (m = 50, C = 6.5)
  const bayesian = ((voteCount * voteAvg) + (50 * 6.5)) / (voteCount + 50);
  score += bayesian * 8; // max ~75

  // Logarithmic vote count weighting: guarantees world-class blockbusters dominate over zero-vote home videos
  score += Math.min(Math.log10(voteCount + 1) * 22, 95);

  // Popularity signal
  score += Math.min(pop * 0.4, 25);

  // Penalize obscure catalog noise without votes unless newly released in theaters (< 90 days)
  const releaseDate = movie.release_date || '';
  const isRecent = releaseDate && new Date(releaseDate) > new Date(Date.now() - 90 * 86400000);
  if (!isRecent) {
    if (voteCount === 0) score -= 85;
    else if (voteCount < 10) score -= 45;
    else if (voteCount < 50) score -= 20;
  }

  return score;
};

// In-memory LRU cache for live search suggestions (0ms latency on repeated keystrokes)
const liveSearchCache = new Map();

const searchBarLive = async (rawQuery) => {
  if (!rawQuery || !rawQuery.trim()) {
    return { movies: [], person: null, correctedQuery: null };
  }

  const query = rawQuery.trim();
  const cacheKey = query.toLowerCase();

  if (liveSearchCache.has(cacheKey)) {
    return liveSearchCache.get(cacheKey);
  }

  const lowerQ = query.toLowerCase();
  const effectiveQuery = SEARCH_TYPOS[lowerQ] || query;
  const correctedQuery = effectiveQuery !== query ? effectiveQuery : null;

  // Extract release year if user typed e.g. "Dune 2021" or "The Batman 2022"
  const yearMatch = effectiveQuery.match(/\b(19\d{2}|20\d{2})\b/);
  const detectedYear = yearMatch ? yearMatch[1] : null;
  const cleanTitleQuery = detectedYear
    ? effectiveQuery.replace(/\b(19\d{2}|20\d{2})\b/, '').replace(/[()]/g, '').trim()
    : effectiveQuery;

  const movieParams = { query: cleanTitleQuery || effectiveQuery };
  if (detectedYear) {
    movieParams.primary_release_year = detectedYear;
  }

  const fetchPromises = [
    fetchApi('/search/movie', movieParams),
    fetchApi('/search/person', { query: cleanTitleQuery || effectiveQuery })
  ];

  if (effectiveQuery !== query && !detectedYear) {
    fetchPromises.push(fetchApi('/search/movie', { query }));
  }

  const [movieData, personData, fallbackMovieData] = await Promise.all(fetchPromises);

  // 1. Person/Director Detection
  let personMatch = null;
  const personResults = personData?.results || [];
  if (personResults.length > 0) {
    const topPerson = personResults[0];
    if (topPerson && (topPerson.popularity >= 3 || personResults.length === 1)) {
      const knownForTitles = (topPerson.known_for || [])
        .filter(k => k.title || k.name)
        .map(k => k.title || k.name)
        .slice(0, 3);

      personMatch = {
        id: topPerson.id,
        name: topPerson.name,
        department: topPerson.known_for_department || 'Directing',
        profile_path: topPerson.profile_path,
        topMovies: knownForTitles
      };
    }
  }

  // 2. Candidate Gathering & Deduplication
  let candidates = [];
  if (movieData?.results) {
    candidates = [...movieData.results];
  }
  if (fallbackMovieData?.results) {
    candidates = [...candidates, ...fallbackMovieData.results];
  }

  // If a prominent person was matched, inject their defining known_for movies
  if (personMatch && personResults[0]?.known_for) {
    const personMovies = personResults[0].known_for.filter(item => item.media_type === 'movie' || item.title);
    candidates = [...candidates, ...personMovies];
  }

  const seenIds = new Set();
  const uniqueCandidates = [];
  for (const movie of candidates) {
    if (movie && movie.id && !seenIds.has(movie.id)) {
      seenIds.add(movie.id);
      uniqueCandidates.push(movie);
    }
  }

  // 3. Bayesian Relevance Re-Ranking
  const scored = uniqueCandidates.map(movie => ({
    movie,
    score: computeSearchRelevance(movie, cleanTitleQuery || effectiveQuery)
  }));
  scored.sort((a, b) => b.score - a.score);

  // 4. Curate Top 6 Formatted Movies for Instant Dropdown
  const topMovies = scored.slice(0, 6).map(({ movie }) => {
    const releaseDate = movie.release_date || '';
    const year = releaseDate ? releaseDate.slice(0, 4) : '';
    const genreNames = (movie.genre_ids || [])
      .map(gId => getGenreNameById(gId))
      .filter(Boolean)
      .slice(0, 2);

    return {
      id: movie.id,
      title: movie.title || movie.original_title || 'Untitled',
      year,
      poster_path: movie.poster_path,
      vote_average: typeof movie.vote_average === 'number' ? Math.round(movie.vote_average * 10) / 10 : 0,
      vote_count: movie.vote_count || 0,
      genres: genreNames,
      overview: movie.overview || ''
    };
  });

  const finalResult = {
    movies: topMovies,
    person: personMatch,
    correctedQuery
  };

  if (liveSearchCache.size > 100) {
    const firstKey = liveSearchCache.keys().next().value;
    liveSearchCache.delete(firstKey);
  }
  liveSearchCache.set(cacheKey, finalResult);

  return finalResult;
};

export const tmdb = {
  getGenreIdByName,
  getGenreNameById,
  // Get image URLs
  getImageUrl: (path, size = 'w500') => path ? `${IMG_BASE_URL}${size}${path}` : null,
  getOriginalImageUrl: (path) => path ? `${IMG_BASE_URL}original${path}` : null,

  // Movies Lists
  getTrending: (timeWindow = 'day', page = 1) => fetchApi(`/trending/movie/${timeWindow}`, { page }),
  getPopular: (page = 1) => fetchApi('/movie/popular', { page }),
  getTopRated: (page = 1) => fetchApi('/movie/top_rated', { page }),
  getHiddenGems: (page = 1) => fetchApi('/discover/movie', {
    page,
    'vote_average.gte': 7.6,
    'vote_count.gte': 150,
    'vote_count.lte': 3500,
    sort_by: 'vote_count.desc',
    without_genres: '99,10770'
  }),

  // Movie Details
  getMovieDetails: (id) => fetchApi(`/movie/${id}`, { append_to_response: 'videos,credits,similar,recommendations' }),
  getExternalRatings,

  // Search & Discover Engine — Upgraded with Bayesian Quality Re-Ranking & Intent Resolution
  searchMovies: async (query, page = 1) => {
    if (!query || !query.trim()) {
      return { results: [], total_pages: 0, total_results: 0, page };
    }

    const cleanQ = query.trim();
    const lowerQ = cleanQ.toLowerCase();
    const corrected = SEARCH_TYPOS[lowerQ] || cleanQ;

    // Detect year in search query (e.g. "Dune 2021" or "Blade Runner 1982")
    const yearMatch = corrected.match(/\b(19\d{2}|20\d{2})\b/);
    const detectedYear = yearMatch ? yearMatch[1] : null;
    const cleanTitle = detectedYear 
      ? corrected.replace(/\b(19\d{2}|20\d{2})\b/, '').replace(/[()]/g, '').trim()
      : corrected;

    const params = { query: cleanTitle || corrected, page };
    if (detectedYear) {
      params.primary_release_year = detectedYear;
    }

    let data = await fetchApi('/search/movie', params);

    // Smart Fallback if results are empty on page 1
    if ((!data || !data.results || data.results.length < 3) && page === 1) {
      // 1. Try raw query if typo was applied
      if (corrected !== cleanQ) {
        const rawData = await fetchApi('/search/movie', { query: cleanQ, page });
        if (rawData?.results?.length) {
          data = rawData;
        }
      }

      // 2. Try Person/Director match if still empty
      if (!data || !data.results || data.results.length === 0) {
        const personData = await fetchApi('/search/person', { query: cleanQ });
        const person = personData?.results?.[0];
        if (person) {
          const credits = await fetchApi(`/person/${person.id}/movie_credits`);
          const crewOrCast = (credits?.crew || [])
            .filter(c => c.job === 'Director')
            .concat(credits?.cast || []);
          if (crewOrCast.length > 0) {
            data = {
              page: 1,
              results: crewOrCast.slice(0, 20),
              total_pages: Math.ceil(crewOrCast.length / 20),
              total_results: crewOrCast.length
            };
          }
        }
      }
    }

    if (!data || !data.results) {
      return { results: [], total_pages: 0, total_results: 0, page };
    }

    // Deduplicate and apply Bayesian Relevance Ranking
    const seenIds = new Set();
    const unique = [];
    for (const m of data.results) {
      if (m && m.id && !seenIds.has(m.id)) {
        seenIds.add(m.id);
        unique.push(m);
      }
    }

    const ranked = unique.map(movie => ({
      movie,
      score: computeSearchRelevance(movie, cleanTitle || cleanQ)
    }));
    ranked.sort((a, b) => b.score - a.score);

    return {
      ...data,
      results: ranked.map(r => r.movie)
    };
  },
  searchBarLive,
  detectIntent,
  getGenres: () => fetchApi('/genre/movie/list'),
  discoverByGenre: (genreId, page = 1) => fetchApi('/discover/movie', { with_genres: genreId, page }),
  getPersonMovieCredits: (personId) => {
    const cacheKey = String(personId);
    if (!actorCreditsCache.has(cacheKey)) {
      actorCreditsCache.set(cacheKey, fetchApi(`/person/${personId}/movie_credits`));
    }
    return actorCreditsCache.get(cacheKey);
  },
  getDirectorCombinedCredits: (id) => fetchApi(`/person/${id}/combined_credits`),
  getDirectorDetails: (id) => fetchApi(`/person/${id}`, { append_to_response: 'images' }),
  getDirectorMovies: async (id) => {
    const credits = await getDirectorCredits(id);
    return sortDirectorEssentials(getDirectedMoviesFromCredits(credits), id);
  },
  getDirectorHiddenGems: async (id) => {
    const credits = await getDirectorCredits(id);
    return sortDirectorHiddenGems(getDirectedMoviesFromCredits(credits), id);
  },
  searchPeople: (query) => fetchApi('/search/person', { query }),

  // Tonight's Pick Engine — 100% Accurate Multi-Dimensional Bayesian & Vibe Recommender
  getTonightsPick: async (preferences = {}, seenMovies = []) => {
    const seenIds = (seenMovies || []).map(m => m.id);
    const seenTitles = new Set((seenMovies || []).map(m => (m.title || '').toLowerCase().trim()));

    const params = {
      include_adult: false,
      include_video: false,
      without_genres: '10770', // Exclude low-budget TV movies unless genre dictates
    };

    // Deep Vibe Archetype Profiles with Comprehensive Seed Masterpiece Anchors
    const VIBE_PROFILES = {
      'mind-bending': {
        genres: [9648, 878, 53], // Mystery, Sci-Fi, Thriller
        forbiddenGenres: [10751, 10749, 10402], // Family, Romance (as sole), Musical
        keywords: ['twist', 'mind', 'time', 'reality', 'memory', 'simulation', 'dimension', 'subconscious', 'psychological', 'puzzle', 'illusion', 'paranoia', 'quantum', 'loop', 'identity', 'conspiracy', 'hallucination', 'dreams', 'existential', 'amnesia'],
        anchors: [27205, 77, 1018, 329865, 1124, 11324, 38, 264660, 4977, 36095, 550, 670, 745, 141, 603, 63, 220289, 181886, 26466, 2832], // Inception, Memento, Mulholland Dr, Arrival, The Prestige, Shutter Island, Eternal Sunshine, Ex Machina, Paprika, Cure, Fight Club, Oldboy, Sixth Sense, Donnie Darko, Matrix, 12 Monkeys, Coherence, Enemy, Triangle, Identity
      },
      'adrenaline': {
        genres: [28, 53, 12], // Action, Thriller, Adventure
        forbiddenGenres: [10749, 99], // Romance (as sole), Documentary
        keywords: ['heist', 'chase', 'mission', 'assassin', 'survival', 'speed', 'hostage', 'explosive', 'lethal', 'warfare', 'agent', 'rogue', 'retaliation', 'race', 'combat', 'pursuit', 'undercover', 'tactical'],
        anchors: [76341, 155, 949, 562, 110415, 245891, 161, 280, 339964, 353081, 137113, 273481, 85, 361743, 180299, 603, 155], // Mad Max Fury Road, The Dark Knight, Heat, Die Hard, The Raid, John Wick, Speed, Terminator 2, Baby Driver, MI Fallout, Edge of Tomorrow, Sicario, Raiders, Top Gun Maverick, The Raid 2, The Matrix
      },
      'noir': {
        genres: [80, 9648, 53, 18], // Crime, Mystery, Thriller, Drama
        forbiddenGenres: [10751, 16, 10402, 14], // Family, Animation, Music, Fantasy
        keywords: ['detective', 'investigation', 'murder', 'corrupt', 'cop', 'underworld', 'syndicate', 'private eye', 'criminal', 'conspiracy', 'shadow', 'mob', 'noir', 'killer', 'femme fatale', 'cynical', 'interrogation'],
        anchors: [829, 807, 1949, 2118, 335984, 103, 11423, 64690, 963, 275, 1073, 6977, 11353, 1538, 567], // Chinatown, Se7en, Zodiac, L.A. Confidential, Blade Runner 2049, Taxi Driver, Memories of Murder, Drive, Maltese Falcon, Fargo, Third Man, No Country, Blood Simple, Collateral, Rear Window
      },
      'comfort': {
        genres: [35, 10751, 16, 10749, 12], // Comedy, Family, Animation, Romance, Adventure
        forbiddenGenres: [27, 53, 10752, 80], // Strictly NO Horror, Thriller, War, Crime!
        keywords: ['heartwarming', 'friendship', 'whimsical', 'uplifting', 'family', 'kindness', 'journey', 'love', 'adventure', 'charming', 'sweet', 'wholesome', 'delightful', 'community', 'warmth', 'nostalgia', 'tender'],
        anchors: [194, 129, 120467, 346648, 773, 8392, 76, 872, 11216, 10315, 840430, 812225, 16859, 37797, 2493], // Amelie, Spirited Away, Grand Budapest Hotel, Paddington 2, Little Miss Sunshine, Totoro, Before Sunrise, Singin' in the Rain, Cinema Paradiso, Fantastic Mr Fox, The Holdovers, Marcel the Shell, Kiki's Delivery Service, Whisper of the Heart, Princess Bride
      },
      'dread': {
        genres: [27, 9648, 53], // Horror, Mystery, Thriller
        forbiddenGenres: [35, 10751, 10749], // Strictly NO Comedy, Family, Romance!
        keywords: ['haunting', 'dread', 'terror', 'evil', 'sinister', 'cursed', 'nightmare', 'occult', 'supernatural', 'demonic', 'paranoia', 'claustrophobic', 'isolated', 'possession', 'unsettling', 'eerie', 'chilling', 'macabre', 'disturbing'],
        anchors: [694, 493922, 310131, 348, 1091, 274, 36095, 539, 419430, 805, 44214, 503919, 530385, 270303, 170], // The Shining, Hereditary, The Witch, Alien, The Thing, Silence of the Lambs, Cure, Psycho, Get Out, Rosemary's Baby, Black Swan, The Lighthouse, Midsommar, It Follows, Misery
      },
      'cathartic': {
        genres: [18, 10749], // Drama, Romance
        forbiddenGenres: [28, 27], // Strictly NO pure Action, pure Horror!
        keywords: ['emotional', 'moving', 'heartbreaking', 'tearjerker', 'grief', 'redemption', 'memory', 'tragedy', 'sacrifice', 'loss', 'poignant', 'deep', 'profound', 'humanity', 'bittersweet', 'longing', 'melancholy', 'healing'],
        anchors: [531428, 666277, 965150, 758866, 334543, 278, 424, 843, 25538, 426426, 489, 207, 142, 600354], // Portrait of a Lady on Fire, Past Lives, Aftersun, Drive My Car, Manchester by the Sea, Shawshank, Schindler's List, In the Mood for Love, Yi Yi, Roma, Good Will Hunting, Dead Poets Society, Brokeback Mountain, The Father
      },
      'scifi-wonder': {
        genres: [878, 12], // Sci-Fi, Adventure
        forbiddenGenres: [27, 10749], // NO Horror, Romance
        keywords: ['space', 'universe', 'cosmos', 'extraterrestrial', 'alien', 'planet', 'astronaut', 'exploration', 'galaxy', 'future', 'interstellar', 'artificial intelligence', 'voyage', 'discovery', 'science', 'philosophical', 'transcendence', 'cybernetics'],
        anchors: [62, 157336, 78, 329865, 593, 1398, 686, 9693, 264660, 782, 603, 335984, 693134, 438631, 840], // 2001 Space Odyssey, Interstellar, Blade Runner, Arrival, Solaris, Stalker, Contact, Children of Men, Ex Machina, Gattaca, The Matrix, Blade Runner 2049, Dune 2, Dune, Close Encounters
      },
      'dark-comedy': {
        genres: [35, 80, 18], // Comedy, Crime, Drama
        forbiddenGenres: [10751], // NO Family
        keywords: ['satire', 'dark humor', 'cynical', 'witty', 'ironic', 'black comedy', 'absurd', 'eccentric', 'crime gone wrong', 'morbid', 'sarcastic', 'bizarre', 'deadpan', 'macabre', 'grotesque', 'irreverent'],
        anchors: [275, 254320, 935, 496243, 8321, 115, 785084, 545, 404495, 674324, 546554, 515001, 792307, 5236], // Fargo, The Lobster, Dr. Strangelove, Parasite, In Bruges, The Big Lebowski, Triangle of Sadness, Barton Fink, Death of Stalin, Banshees of Inisherin, Knives Out, Jojo Rabbit, Poor Things, Kiss Kiss Bang Bang
      },
      'hidden-treasure': {
        genres: [18, 53, 9648, 80], // High-prestige narrative drama, mystery, thriller, crime
        forbiddenGenres: [10770],
        keywords: ['independent', 'overlooked', 'underseen', 'arthouse', 'festival', 'palme d\'or', 'cult', 'neo-realism', 'existential', 'auteur', 'masterpiece', 'compelling'],
        anchors: [36095, 491584, 11423, 46049, 25538, 600, 598, 19542, 445, 265195, 797, 290098, 103663, 37495, 705996, 62835, 976893, 915935, 1050035, 480530, 758866], // Cure, Burning, Memories of Murder, Incendies, Yi Yi, La Haine, City of God, A Prophet, Cache, Wild Tales, Persona, Handmaiden, The Hunt, High and Low, Decision to Leave, A Separation, Perfect Days, Anatomy of a Fall, Monster, Capernaum, Drive My Car
      },
      'roulette': {
        genres: [],
        forbiddenGenres: [10770],
        keywords: [],
        anchors: [346, 103, 11645, 829, 278, 238, 240, 155, 496243, 129, 27205, 680, 157336, 389, 769, 289, 567, 426, 28, 62, 11216, 194, 14537, 935, 275, 78, 348, 1091, 244786, 76341, 6977, 7345, 120467, 38], // Seven Samurai, Taxi Driver, Ran, Chinatown, Shawshank, Godfather 1/2, Dark Knight, Parasite, Spirited Away, Inception, Pulp Fiction, Interstellar, 12 Angry Men, GoodFellas, Casablanca, Rear Window, Vertigo, Apocalypse Now, 2001, Cinema Paradiso, Amelie, Harakiri, Dr Strangelove, Fargo, Blade Runner, Alien, The Thing, Whiplash, Mad Max Fury Road, No Country, There Will Be Blood, Grand Budapest, Eternal Sunshine
      },
    };

    // Curated Anchor Masterworks for Classic Blueprint Genres (Guarantees 10/10 Cinema in Genre Mode)
    const GENRE_ANCHORS = {
      action: [76341, 155, 280, 562, 949, 161, 85, 245891, 110415, 353081, 137113, 603, 361743], // Mad Max Fury Road, Dark Knight, T2, Die Hard, Heat, Speed, Raiders, John Wick, The Raid, MI Fallout, Edge of Tomorrow, The Matrix, Top Gun Maverick
      adventure: [85, 120, 121, 122, 129, 346648, 2493, 105, 19995, 76341], // Raiders, LOTR 1/2/3, Spirited Away, Paddington 2, Princess Bride, Back to the Future, Avatar, Mad Max
      animation: [129, 128, 8392, 10315, 324857, 37797, 105864, 4977, 8587, 150540, 16859], // Spirited Away, Princess Mononoke, Totoro, Fantastic Mr Fox, Spider-Verse, Whisper of the Heart, Wolf Children, Paprika, The Lion King, Inside Out, Kiki
      comedy: [275, 115, 935, 194, 8321, 120467, 840430, 680, 515001, 773], // Fargo, Big Lebowski, Dr Strangelove, Amelie, In Bruges, Grand Budapest, The Holdovers, Pulp Fiction, Jojo Rabbit, Little Miss Sunshine
      crime: [238, 240, 769, 829, 807, 103, 1949, 2118, 680, 11423, 6977, 275], // Godfather 1/2, GoodFellas, Chinatown, Se7en, Taxi Driver, Zodiac, LA Confidential, Pulp Fiction, Memories of Murder, No Country, Fargo
      documentary: [375, 4935, 25683, 110416, 27581, 13342, 197, 42353, 58496], // Man on Wire, Grizzly Man, Jiro Dreams of Sushi, Senna, The Act of Killing, Stop Making Sense, Fog of War, Searching for Sugar Man
      drama: [278, 389, 424, 496243, 244786, 289, 531428, 666277, 334543, 758866, 600354, 7345], // Shawshank, 12 Angry Men, Schindler's List, Parasite, Whiplash, Casablanca, Portrait of a Lady on Fire, Past Lives, Manchester by the Sea, Drive My Car, The Father, There Will Be Blood
      family: [129, 8392, 346648, 10315, 872, 150540, 812225, 2493, 105, 16859], // Spirited Away, Totoro, Paddington 2, Fantastic Mr Fox, Singin in the Rain, Inside Out, Marcel the Shell, Princess Bride, Back to the Future, Kiki
      fantasy: [120, 121, 122, 129, 141, 411, 2493, 4977, 128], // LOTR 1/2/3, Spirited Away, Donnie Darko, Pan's Labyrinth, Princess Bride, Paprika, Princess Mononoke
      history: [872585, 424, 947, 404495, 205, 346, 11645, 62835, 11216], // Oppenheimer, Schindler's List, Lawrence of Arabia, Death of Stalin, Hotel Rwanda, Seven Samurai, Ran, A Separation, Cinema Paradiso
      biography: [872585, 424, 769, 37799, 489, 205, 4935, 1124], // Oppenheimer, Schindler's List, GoodFellas, The Social Network, Good Will Hunting, Hotel Rwanda, Grizzly Man, The Prestige
      horror: [694, 493922, 310131, 348, 1091, 274, 539, 419430, 805, 36095, 503919, 530385, 44214], // The Shining, Hereditary, The Witch, Alien, The Thing, Silence of the Lambs, Psycho, Get Out, Rosemary's Baby, Cure, The Lighthouse, Midsommar, Black Swan
      music: [244786, 872, 13342, 194, 11216, 207, 4977], // Whiplash, Singin in the Rain, Stop Making Sense, Amelie, Cinema Paradiso, Dead Poets Society, Paprika
      musical: [872, 313369, 194, 129, 11216], // Singin in the Rain, La La Land, Amelie, Spirited Away, Cinema Paradiso
      mystery: [829, 807, 1949, 567, 426, 77, 546554, 11423, 27205, 11324, 1018, 36095], // Chinatown, Se7en, Zodiac, Rear Window, Vertigo, Memento, Knives Out, Memories of Murder, Inception, Shutter Island, Mulholland Dr, Cure
      romance: [76, 843, 38, 289, 531428, 666277, 313369, 194, 11216, 142], // Before Sunrise, In the Mood for Love, Eternal Sunshine, Casablanca, Portrait of a Lady, Past Lives, La La Land, Amelie, Cinema Paradiso, Brokeback Mountain
      'science-fiction': [157336, 62, 329865, 335984, 78, 603, 264660, 9693, 686, 348, 1091, 693134], // Interstellar, 2001, Arrival, Blade Runner 2049, Blade Runner, Matrix, Ex Machina, Children of Men, Contact, Alien, The Thing, Dune 2
      scifi: [157336, 62, 329865, 335984, 78, 603, 264660, 9693, 686, 348, 1091, 693134],
      superhero: [155, 324857, 299536, 299534, 100402, 603, 76341], // The Dark Knight, Into the Spider-Verse, Infinity War, Endgame, Winter Soldier, The Matrix, Mad Max
      thriller: [567, 274, 496243, 77, 670, 807, 1949, 11423, 2118, 27205, 36095, 244786, 6977], // Rear Window, Silence of the Lambs, Parasite, Memento, Oldboy, Se7en, Zodiac, Memories of Murder, LA Confidential, Inception, Cure, Whiplash, No Country
      war: [28, 424, 857, 423, 346, 11645, 1917, 374720, 534780], // Apocalypse Now, Schindler's List, Saving Private Ryan, The Pianist, Seven Samurai, Ran, 1917, Dunkirk, The Zone of Interest
      sports: [244786, 1366, 1246, 614, 110416, 8068, 5974], // Whiplash, Rocky, Raging Bull, Million Dollar Baby, Senna, The Fighter, Warrior
      western: [429, 393, 68718, 6977, 346, 11645, 1073] // The Good the Bad and the Ugly, Once Upon a Time in the West, Django Unchained, No Country for Old Men, Seven Samurai, Ran, The Third Man
    };

    // 1. Language Filter
    const mappedLanguage = normalizeLanguage(preferences.language);
    if (mappedLanguage && mappedLanguage !== 'any') {
      params.with_original_language = mappedLanguage;
    }

    const isRegionalLanguage = mappedLanguage && mappedLanguage !== 'any' && mappedLanguage !== 'en';
    const isClassicEra = preferences.era === '1970s' || preferences.era === '1960s & Earlier';

    // 2. Primary Genre or Vibe Filter
    let activeVibeProfile = null;
    if (preferences.mode === 'vibe' && preferences.vibe) {
      activeVibeProfile = VIBE_PROFILES[preferences.vibe] || null;
      if (activeVibeProfile?.genres?.length) {
        params.with_genres = activeVibeProfile.genres.join('|');
      }
      if (activeVibeProfile?.forbiddenGenres?.length) {
        params.without_genres = `10770,${activeVibeProfile.forbiddenGenres.join(',')}`;
      }
    } else if (preferences.genre) {
      let key = preferences.genre;
      if (key === 'science-fiction') key = 'scifi';
      const primaryGenreId = genreMap[key] || null;
      if (primaryGenreId) {
        params.with_genres = primaryGenreId.toString();
      }
    }

    // 3. Era Filter
    let minDate = '9999-12-31';
    let maxDate = '0000-01-01';
    let requiresGte = false;
    let requiresLte = false;

    if (preferences.era && preferences.era !== 'Any Era') {
      const currentYear = new Date().getFullYear();
      let eGte = null, eLte = null;
      switch (preferences.era) {
        case 'Latest Releases': eGte = `${currentYear - 2}-01-01`; break;
        case '2020s': eGte = '2020-01-01'; eLte = '2029-12-31'; break;
        case '2010s': eGte = '2010-01-01'; eLte = '2019-12-31'; break;
        case '2000s': eGte = '2000-01-01'; eLte = '2009-12-31'; break;
        case '1990s': eGte = '1990-01-01'; eLte = '1999-12-31'; break;
        case '1980s': eGte = '1980-01-01'; eLte = '1989-12-31'; break;
        case '1970s': eGte = '1970-01-01'; eLte = '1979-12-31'; break;
        case '1960s & Earlier': eLte = '1969-12-31'; break;
      }
      if (eGte) { minDate = eGte; requiresGte = true; }
      if (eLte) { maxDate = eLte; requiresLte = true; }
      if (requiresGte) params['primary_release_date.gte'] = minDate;
      if (requiresLte) params['primary_release_date.lte'] = maxDate;
    }

    // 4. Runtime Filter — Strictly enforce <95m when 'short' is requested
    if (preferences.runtime && preferences.runtime !== 'any') {
      switch (preferences.runtime) {
        case 'short': params['with_runtime.lte'] = 94; break;
        case 'medium': params['with_runtime.gte'] = 95; params['with_runtime.lte'] = 125; break;
        case 'epic': params['with_runtime.gte'] = 120; break;
      }
    }

    // Determine strict tier bounds
    const isTierHiddenGem = preferences.tier === 'hidden_gem' || preferences.vibe === 'hidden-treasure';
    const tier = isTierHiddenGem ? 'hidden_gem' : (preferences.tier || 'masterpiece');

    // STRICT VOTE CEILINGS & FLOORS
    let minVoteCount = 200;
    let maxVoteCount = null;

    if (tier === 'hidden_gem') {
      // HIDDEN GEM: Hard ceiling to eradicate global blockbusters
      minVoteCount = isRegionalLanguage ? 25 : 60;
      maxVoteCount = isRegionalLanguage ? 3000 : (isClassicEra ? 8000 : 6000);
    } else if (tier === 'crowd_pleaser') {
      minVoteCount = isRegionalLanguage ? 250 : 1400;
    } else {
      // 'masterpiece'
      minVoteCount = isRegionalLanguage ? 40 : (isClassicEra ? 80 : 250);
    }

    // Candidate Filter Verification
    const candidatePassesAllFilters = (m) => {
      if (!m || !m.id) return false;
      if (seenIds.includes(m.id)) return false;
      if (m.title && seenTitles.has(m.title.toLowerCase().trim())) return false;
      if (!m.overview || m.overview.length < 25) return false;
      if (!m.backdrop_path && !m.poster_path) return false;

      // 1. Language Filter
      if (mappedLanguage && mappedLanguage !== 'any') {
        if (m.original_language !== mappedLanguage) return false;
      }

      // 2. Era Filter
      if (preferences.era && preferences.era !== 'Any Era') {
        if (!m.release_date) return false;
        const year = parseInt(m.release_date.substring(0, 4), 10);
        if (isNaN(year)) return false;

        const currentYear = new Date().getFullYear();
        switch (preferences.era) {
          case 'Latest Releases': if (year < currentYear - 2) return false; break;
          case '2020s': if (year < 2020 || year > 2029) return false; break;
          case '2010s': if (year < 2010 || year > 2019) return false; break;
          case '2000s': if (year < 2000 || year > 2009) return false; break;
          case '1990s': if (year < 1990 || year > 1999) return false; break;
          case '1980s': if (year < 1980 || year > 1989) return false; break;
          case '1970s': if (year < 1970 || year > 1979) return false; break;
          case '1960s & Earlier': if (year > 1969) return false; break;
        }
      }

      // Strict pre-check on runtime if present on candidate
      if (preferences.runtime && preferences.runtime !== 'any' && m.runtime) {
        if (preferences.runtime === 'short' && m.runtime > 94) return false;
        if (preferences.runtime === 'medium' && (m.runtime < 95 || m.runtime > 125)) return false;
        if (preferences.runtime === 'epic' && m.runtime < 120) return false;
      }

      const gIds = m.genre_ids || (m.genres || []).map(g => g.id);

      // 3. Genre Mode strict filter
      if (preferences.mode === 'genre' && preferences.genre) {
        let key = preferences.genre;
        if (key === 'science-fiction') key = 'scifi';
        const targetGenreId = genreMap[key];
        if (targetGenreId && !gIds.includes(targetGenreId)) return false;

        // Thematic verification for mapped genres
        const overviewLower = (m.overview || '').toLowerCase();
        const titleLower = (m.title || '').toLowerCase();
        const combinedText = `${titleLower} ${overviewLower}`;

        if (key === 'superhero') {
          const superheroKeywords = ['superhero', 'marvel', 'dc comics', 'comic book', 'batman', 'superman', 'avengers', 'spider-man', 'mutant', 'vigilante', 'hero', 'villain', 'powers'];
          const matchesHero = superheroKeywords.some(kw => combinedText.includes(kw)) || [155, 324857, 299536, 299534, 100402, 603, 76341].includes(m.id);
          if (!matchesHero) return false;
        } else if (key === 'sports') {
          const sportsKeywords = ['sport', 'boxing', 'boxer', 'football', 'basketball', 'baseball', 'athlete', 'coach', 'racing', 'racer', 'championship', 'tournament', 'fight', 'wrestling', 'tennis'];
          const matchesSport = sportsKeywords.some(kw => combinedText.includes(kw)) || [244786, 1366, 1246, 614, 110416, 8068, 5974].includes(m.id);
          if (!matchesSport) return false;
        } else if (key === 'biography') {
          const bioKeywords = ['biography', 'biographical', 'true story', 'based on the life', 'memoir', 'historical figure', 'life of', 'chronicles the life', 'real-life'];
          const matchesBio = bioKeywords.some(kw => combinedText.includes(kw)) || [872585, 424, 769, 37799, 489, 205, 4935, 1124].includes(m.id);
          if (!matchesBio) return false;
        }
      }

      // 4. Vibe Mode strict positive & negative genre matching
      if (preferences.mode === 'vibe' && activeVibeProfile) {
        // Must contain at least one designated genre for this vibe (unless open universe like roulette)
        if (activeVibeProfile.genres?.length > 0) {
          const hasVibeGenre = activeVibeProfile.genres.some(gid => gIds.includes(gid));
          if (!hasVibeGenre) return false;
        }

        // Strictly exclude ALL forbidden tone killers defined in profile
        if (activeVibeProfile.forbiddenGenres?.length > 0) {
          const hasForbidden = activeVibeProfile.forbiddenGenres.some(gid => gIds.includes(gid));
          if (hasForbidden) return false;
        }
      }

      // 5. Exclude concerts, making-of specials, and documentaries (unless user specifically asked for them)
      const titleLower = (m.title || '').toLowerCase();
      const isBTSOrConcert = titleLower.includes('live at ') ||
        titleLower.includes('in concert') ||
        titleLower.includes('making of') ||
        titleLower.includes('behind the scenes') ||
        titleLower.includes('bonus feature') ||
        titleLower.includes('retrospective');
      if (isBTSOrConcert && preferences.genre !== 'music' && preferences.genre !== 'documentary') {
        return false;
      }
      if (gIds.includes(99) && preferences.genre !== 'documentary') {
        return false; // Exclude documentary from narrative vibe curation
      }

      const v = m.vote_count || 0;
      const R = m.vote_average || 0;

      // 6. Tier Vote Count Bounds
      if (isTierHiddenGem) {
        if (maxVoteCount && v > maxVoteCount) return false; // ABSOLUTE BLOCK OF MAINSTREAM TITLES
        if (v < minVoteCount) return false;
        if (R < 7.2) return false;
      } else if (tier === 'crowd_pleaser') {
        if (v < minVoteCount) return false;
        if (R < 7.1) return false;
      } else {
        // Masterpiece
        if (v < minVoteCount) return false;
        if (R < 7.5) return false;
      }

      return true;
    };

    // Bayesian Weighted Rating calculation for undisputed cinematic excellence
    const calculateCinematicScore = (movie) => {
      const v = movie.vote_count || 0;
      const R = movie.vote_average || 0;
      const C = 6.9; // Global baseline mean
      const m = isTierHiddenGem ? 100 : 350;

      // True Bayesian Weighted Mean formula
      const bayesian = (v / (v + m)) * R + (m / (v + m)) * C;
      let score = bayesian;

      if (isTierHiddenGem) {
        // Hidden Gem sweet spot: reward 300 to 3,500 votes
        if (v >= 300 && v <= 3500) {
          score += 1.0;
        } else if (v < 300) {
          score += 0.4;
        } else if (v > 4500) {
          score -= 0.8; // penalty for creeping into mainstream
        }
        if (R >= 7.8) score += 0.7;
        if (R >= 8.1) score += 0.5;
      } else if (tier === 'crowd_pleaser') {
        const popBonus = Math.min((movie.popularity || 0) * 0.04, 1.6);
        score += popBonus;
        if (v > 5000) score += 0.6;
        if (R >= 7.5) score += 0.4;
      } else {
        // Masterpiece
        const consensusBonus = Math.min(Math.log10(Math.max(v, 10)) * 0.25, 1.3);
        score += consensusBonus;
        if (R >= 8.2) score += 1.0;
        if (R >= 8.0) score += 0.5;
      }

      // Vibe relevance boost
      if (preferences.mode === 'vibe' && activeVibeProfile) {
        const gIds = movie.genre_ids || (movie.genres || []).map(g => g.id);
        const matchCount = (activeVibeProfile.genres || []).filter(gid => gIds.includes(gid)).length;
        if (matchCount >= 2) score += 0.7;
        else if (matchCount === 1) score += 0.4;

        const overviewLower = (movie.overview || '').toLowerCase();
        const titleLower = (movie.title || '').toLowerCase();
        const combined = `${titleLower} ${overviewLower}`;
        const kwMatches = (activeVibeProfile.keywords || []).filter(kw => combined.includes(kw));
        score += Math.min(kwMatches.length * 0.3, 1.2);
      } else if (preferences.mode === 'genre' && preferences.genre) {
        // Classic genre relevance boost
        let key = preferences.genre;
        if (key === 'science-fiction') key = 'scifi';
        const targetGenreId = genreMap[key];
        const gIds = movie.genre_ids || (movie.genres || []).map(g => g.id);
        if (targetGenreId && gIds.includes(targetGenreId)) score += 0.5;
      }

      // Visual asset bonus
      if (movie.backdrop_path && movie.poster_path) score += 0.3;

      // Certified Auteur Anchor bonus
      if (movie.isAnchor) score += 1.5;

      return score;
    };

    try {
      const candidateMap = new Map();

      // Channel 0: Curated Anchor Evaluation (Guarantees Certified Auteur Masterworks for Both Vibe & Classic Blueprint)
      let potentialAnchors = [];
      if (preferences.mode === 'vibe') {
        potentialAnchors = activeVibeProfile?.anchors || [];
      } else if (preferences.genre) {
        let key = preferences.genre;
        if (key === 'science-fiction') key = 'scifi';
        potentialAnchors = GENRE_ANCHORS[key] || GENRE_ANCHORS[preferences.genre] || [];
      }

      const unseenAnchors = potentialAnchors.filter(id => !seenIds.includes(id));
      if (unseenAnchors.length > 0) {
        // Shuffle unseen anchors to give variety on successive rolls
        const shuffledAnchors = [...unseenAnchors].sort(() => Math.random() - 0.5);
        const anchorFetches = shuffledAnchors.slice(0, 10).map(id => fetchApi(`/movie/${id}`));
        const anchorResults = await Promise.allSettled(anchorFetches);
        anchorResults.forEach(res => {
          if (res.status === 'fulfilled' && res.value) {
            const m = res.value;
            if (candidatePassesAllFilters(m)) {
              candidateMap.set(m.id, { ...m, isAnchor: true });
            }
          }
        });
      }

      // Channel 1: Targeted Multi-Page Discover API Queries based on Tier
      // Randomize starting page offsets to continuously uncover fresh cinematic gems across calls
      const baseOffset = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3

      if (isTierHiddenGem) {
        // Stream A: Popularity-capped quality discover (removes all mega-blockbusters)
        const gemParams = {
          ...params,
          page: baseOffset,
          sort_by: 'popularity.desc',
          'popularity.lte': 55,
          'popularity.gte': 6,
          'vote_average.gte': 7.3,
          'vote_count.gte': minVoteCount,
        };
        const p1 = await fetchApi('/discover/movie', gemParams);
        (p1?.results || []).forEach(m => {
          if (candidatePassesAllFilters(m)) candidateMap.set(m.id, m);
        });

        // Stream B: Second page of popularity-capped quality
        const p2 = await fetchApi('/discover/movie', { ...gemParams, page: baseOffset + 1 });
        (p2?.results || []).forEach(m => {
          if (candidatePassesAllFilters(m)) candidateMap.set(m.id, m);
        });

        // Stream C: Deep Scan of vote_average.desc starting at page 3 (skips top 40 famous movies to find real gems)
        for (let p = 3; p <= 6; p++) {
          const depthData = await fetchApi('/discover/movie', {
            ...params,
            page: p,
            sort_by: 'vote_average.desc',
            'vote_count.gte': minVoteCount,
          });
          (depthData?.results || []).forEach(m => {
            if (candidatePassesAllFilters(m)) candidateMap.set(m.id, m);
          });
          if (candidateMap.size >= 35) break;
        }
      } else if (tier === 'crowd_pleaser') {
        for (let p = baseOffset; p <= baseOffset + 2; p++) {
          const cpData = await fetchApi('/discover/movie', {
            ...params,
            page: p,
            sort_by: 'popularity.desc',
            'vote_average.gte': 7.2,
            'vote_count.gte': minVoteCount,
          });
          (cpData?.results || []).forEach(m => {
            if (candidatePassesAllFilters(m)) candidateMap.set(m.id, m);
          });
        }
      } else {
        // Masterpiece: Top Acclaimed Legends
        // Stream A: Highest critical consensus across multiple dynamic pages
        for (let p = baseOffset; p <= baseOffset + 2; p++) {
          const mpData = await fetchApi('/discover/movie', {
            ...params,
            page: p,
            sort_by: 'vote_average.desc',
            'vote_average.gte': 7.6,
            'vote_count.gte': minVoteCount,
          });
          (mpData?.results || []).forEach(m => {
            if (candidatePassesAllFilters(m)) candidateMap.set(m.id, m);
          });
        }

        // Stream B: High-popularity critical favorites (acclaimed blockbusters)
        const popData = await fetchApi('/discover/movie', {
          ...params,
          page: baseOffset,
          sort_by: 'popularity.desc',
          'vote_average.gte': 7.8,
          'vote_count.gte': Math.max(minVoteCount, 800),
        });
        (popData?.results || []).forEach(m => {
          if (candidatePassesAllFilters(m)) candidateMap.set(m.id, m);
        });
      }

      // Fallback Scanner with relaxed bounds if pool is too tight (e.g. obscure language/era combo)
      if (candidateMap.size < 5) {
        for (let fallbackPage = 1; fallbackPage <= 5; fallbackPage++) {
          const fbParams = {
            ...params,
            page: fallbackPage,
            sort_by: 'vote_average.desc',
            'vote_count.gte': isRegionalLanguage ? 5 : (isTierHiddenGem ? 20 : 50),
          };
          const fbData = await fetchApi('/discover/movie', fbParams);
          (fbData?.results || []).forEach(m => {
            if (candidatePassesAllFilters(m)) candidateMap.set(m.id, m);
          });
          if (candidateMap.size >= 10) break;
        }
      }

      let candidatePool = Array.from(candidateMap.values());
      if (!candidatePool.length) return null;

      // 1. Calculate Score for all candidates in pool
      const scoredCandidates = candidatePool.map(cand => ({
        cand,
        score: calculateCinematicScore(cand),
      }));

      // 2. Sort descending by score
      scoredCandidates.sort((a, b) => b.score - a.score);

      // 3. Take Top Elite Tier (up to 15 best candidates, all 95%+ quality match)
      const eliteTier = scoredCandidates.slice(0, Math.min(15, scoredCandidates.length));

      // 4. Mathematical Boltzmann / Softmax Probabilistic Distribution
      // w_i = exp((score_i - max_score) / Temperature)
      // Guarantees prestige dominance while preventing deterministic repetition
      const maxScore = eliteTier[0].score;
      const temperature = 0.55;

      const weights = eliteTier.map(item => Math.exp((item.score - maxScore) / temperature));
      const weightedLottery = [];
      const remainingIndices = eliteTier.map((_, idx) => idx);

      while (remainingIndices.length > 0) {
        const subTotalWeight = remainingIndices.reduce((sum, idx) => sum + weights[idx], 0);
        let rand = Math.random() * subTotalWeight;
        let chosenRemainingIdx = 0;

        for (let i = 0; i < remainingIndices.length; i++) {
          const originalIdx = remainingIndices[i];
          if (rand < weights[originalIdx]) {
            chosenRemainingIdx = i;
            break;
          }
          rand -= weights[originalIdx];
        }

        const chosenOriginalIdx = remainingIndices.splice(chosenRemainingIdx, 1)[0];
        weightedLottery.push(eliteTier[chosenOriginalIdx].cand);
      }

      // Add remaining scored candidates as ordered fallbacks
      const remainingCandidates = scoredCandidates.slice(eliteTier.length).map(item => item.cand);
      const evaluationQueue = [...weightedLottery, ...remainingCandidates];

      // Contenders metadata for cinematic decryptor reel (must all match the user's tier!)
      const contenders = evaluationQueue.slice(0, 8).map(c => ({
        id: c.id,
        title: c.title,
        poster_path: c.poster_path,
        backdrop_path: c.backdrop_path,
        vote_average: c.vote_average,
        year: c.release_date ? c.release_date.substring(0, 4) : '',
      }));

      // Find the #1 highest-ranked pick from the stochastic lottery that passes strict runtime validation
      let pick = null;
      for (const cand of evaluationQueue) {
        try {
          const details = await fetchApi(`/movie/${cand.id}`, {
            append_to_response: 'credits,videos,release_dates,similar,watch/providers',
          });
          if (!details) continue;

          // Strict Runtime Verification — Enforces strictly <95m for 'short'
          if (preferences.runtime && preferences.runtime !== 'any' && details.runtime) {
            if (preferences.runtime === 'short' && details.runtime > 94) continue;
            if (preferences.runtime === 'medium' && (details.runtime < 95 || details.runtime > 125)) continue;
            if (preferences.runtime === 'epic' && details.runtime < 120) continue;
          }

          // Strict Acclaim Consensus Check: Verify external ratings if IMDb ID is available
          let extRatings = null;
          if (details.imdb_id) {
            try {
              extRatings = await getExternalRatings(details.imdb_id);
              if (extRatings?.imdb) {
                const imdbScore = parseFloat(extRatings.imdb);
                // For masterpiece tier, reject titles with mediocre IMDb scores (< 7.3)
                if (tier === 'masterpiece' && !isNaN(imdbScore) && imdbScore < 7.3) {
                  continue; // Reject titles that slip through with inflated TMDB scores
                }
              }
            } catch {
              // Non-blocking error
            }
          }

          pick = { ...cand, ...details, externalRatings: extRatings };

          // Parse official trailer
          const trailer = tmdb.getMovieTrailer(details.videos?.results, details.original_language);
          pick.trailer = trailer;

          // Parse certification rating (US MPAA or international)
          let certification = null;
          if (details.release_dates?.results) {
            const usRelease = details.release_dates.results.find(r => r.iso_3166_1 === 'US') || details.release_dates.results[0];
            if (usRelease && usRelease.release_dates) {
              const certEntry = usRelease.release_dates.find(d => d.certification && d.certification.trim() !== '');
              if (certEntry) certification = certEntry.certification;
            }
          }
          pick.certification = certification;

          // Parse Watch Providers ("Where to Stream Tonight")
          let watchProviders = { stream: [], rent: [], buy: [], link: null };
          const wpAll = details['watch/providers']?.results || {};
          const wpRegion = wpAll.US || wpAll.GB || wpAll.IN || wpAll.CA || Object.values(wpAll)[0];
          if (wpRegion) {
            watchProviders.link = wpRegion.link || null;
            watchProviders.stream = (wpRegion.flatrate || []).slice(0, 5).map(p => ({
              id: p.provider_id,
              name: p.provider_name,
              logo: tmdb.getImageUrl(p.logo_path, 'w92'),
            }));
            watchProviders.rent = (wpRegion.rent || []).slice(0, 4).map(p => ({
              id: p.provider_id,
              name: p.provider_name,
              logo: tmdb.getImageUrl(p.logo_path, 'w92'),
            }));
            watchProviders.buy = (wpRegion.buy || []).slice(0, 4).map(p => ({
              id: p.provider_id,
              name: p.provider_name,
              logo: tmdb.getImageUrl(p.logo_path, 'w92'),
            }));
          }
          pick.watchProviders = watchProviders;

          // Curate "Double Feature" companion pick
          let doubleFeature = null;
          if (details.similar?.results && details.similar.results.length > 0) {
            const dfCandidates = details.similar.results.filter(s =>
              s.id !== pick.id &&
              s.poster_path &&
              s.vote_average >= 6.8 &&
              (s.vote_count || 0) >= (isRegionalLanguage ? 15 : 80)
            );
            if (dfCandidates.length > 0) {
              dfCandidates.sort((a, b) => b.vote_average - a.vote_average);
              const df = dfCandidates[0];
              doubleFeature = {
                id: df.id,
                title: df.title,
                poster_path: df.poster_path,
                vote_average: df.vote_average,
                release_date: df.release_date,
                overview: df.overview,
              };
            }
          }
          pick.doubleFeature = doubleFeature;

          break; // Found our 100% verified pick!
        } catch (e) {
          console.warn('[TMDB Engine] Enrichment error on candidate:', cand.id, e);
        }
      }

      if (pick) {
        pick.contenders = contenders;
        return pick;
      }

      return null;
    } catch (error) {
      console.error('[TMDB Engine] Error fetching Tonights Pick:', error);
      return null;
    }
  },


  // Strict Official Trailer Selection System using deterministic buckets
  getMovieTrailer: (videos, originalLanguage = 'en') => {
    if (!videos || videos.length === 0) return null;

    const targetLang = (originalLanguage || '').toLowerCase();
    const blockedKeywords = ['clip', 'promo', 'featurette', 'interview', 'behind the scenes', 'tv spot', 'sneak peek', 'blooper', 'playlist'];

    // Helper to detect dubbed content
    const isDubbed = (name) => /dubbed/.test(name.toLowerCase());

    // Clean up videos: keep only trailers and teasers, exclude junk
    const candidates = videos.filter(v => {
      if (!v.key) return false;
      const type = (v.type || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      if (blockedKeywords.some(k => name.includes(k))) return false;
      return type === 'trailer' || type === 'teaser';
    });

    // Helper to determine if language matches target (including Indian languages)
    const matchesTargetLang = (lang) => {
      if (!targetLang || targetLang === 'any') return false;
      return lang && lang.toLowerCase() === targetLang;
    };

    // 1️⃣ Native‑language official trailer (non‑dubbed)
    const nativeOfficial = candidates.find(v => {
      const type = (v.type || '').toLowerCase();
      const lang = (v.iso_639_1 || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      const isOfficial = v.official === true || /official/.test(name);
      return type === 'trailer' && matchesTargetLang(lang) && isOfficial && !isDubbed(name);
    });
    if (nativeOfficial) return nativeOfficial;

    // 2️⃣ Native‑language teaser (fallback if no official trailer)
    const nativeTeaser = candidates.find(v => {
      const type = (v.type || '').toLowerCase();
      const lang = (v.iso_639_1 || '').toLowerCase();
      return type === 'teaser' && matchesTargetLang(lang);
    });
    if (nativeTeaser) return nativeTeaser;

    // 3️⃣ Any official trailer (regardless of language) – used when no native version exists
    const anyOfficial = candidates.find(v => {
      const type = (v.type || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      const isOfficial = v.official === true || /official/.test(name);
      return type === 'trailer' && isOfficial && !isDubbed(name);
    });
    if (anyOfficial) return anyOfficial;

    // 4️⃣ Any teaser (as a last resort)
    const anyTeaser = candidates.find(v => (v.type || '').toLowerCase() === 'teaser');
    if (anyTeaser) return anyTeaser;

    // No suitable video found
    return null;
  },
};
