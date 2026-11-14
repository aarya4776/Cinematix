# 🎬 Cinematix

### Discover Cinema. Understand Your Taste. Find Your Next Favourite.

Cinematix is a cinematic movie discovery platform designed to make finding your next film more meaningful. Instead of relying entirely on conventional recommendations, it combines algorithmic taste profiling, curated cinematic connections, and director-focused exploration to help users discover films beyond their usual preferences.

Built with React 19, Vite, and WebGL-powered visual experiences, Cinematix turns movie discovery into an interactive journey.

---

## ✨ Features

### 1. Movie Discovery
- Explore movies using live TMDB data.
- Browse movie posters, backdrops, descriptions, trailers, cast, and other metadata.
- Discover films across different genres, regions, and cinematic movements.

### 2. Movie DNA — Taste Profiling
- An interactive movie preference profiling experience.
- Uses 20-dimensional mathematical taste vectors to represent cinematic preferences.
- Pairwise movie battles help identify user preferences.
- Uses cosine similarity to compare taste profiles against curated cinematic canons.
- Generates algorithmic taste archetypes and movie recommendations.

### 3. Auteur Universe
- Explore directors and their cinematic identities.
- Map director worldviews and visual grammar.
- Examine filmmaking styles and career classifications through a custom algorithmic engine.

### 4. Tonight's Pick
- Discover curated movie recommendations for your next movie night.
- Explore cinematic pairings and unexpected suggestions.
- Avoid repeated recommendations within the same browsing session.

### 5. Cinematic Connections
- Explore curated relationships between films, directors, genres, and cinematic movements.
- Discover cinematic twins and related film recommendations.
- Identify potential cinematic blind spots and explore unfamiliar styles.

### 6. Personal Watchlist
- Save movies to a personal watchlist.
- Maintain your saved collection across browser sessions using local storage.

---

## 🛠️ Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, JavaScript, JSX |
| Build Tool | Vite 8 |
| Routing | React Router DOM 7 |
| Styling | Custom CSS3 |
| Animations | Framer Motion |
| 3D Graphics | Three.js, OGL, WebGL |
| Iconography | Lucide React |
| Audio | Web Audio API |
| Movie Data | TMDB API v3 |
| Ratings | OMDb API |
| Video Playback | YouTube Iframe API |
| Storage | localStorage, sessionStorage |
| Development | Node.js, npm, ESLint |

---

## 🧠 Algorithmic Engines

Cinematix incorporates custom-built algorithmic systems:

- **Movie DNA Vector Engine:** 20-dimensional taste representation, pairwise preference comparisons, cosine similarity, and archetype attribution.
- **Auteur Universe Engine:** Director worldview mapping, visual grammar classification, and career taxonomy.
- **Cinematic Knowledge Graphs:** Curated cinematic relationships, regional film ecosystems, cinematic twins, and blind-spot mappings.

These systems use deterministic algorithms and curated data rather than relying on generative AI for movie recommendations.

---

## 🏗️ Architecture

Cinematix follows a client-side Single Page Application (SPA) architecture.

- Application logic and recommendation algorithms execute in the browser.
- External APIs provide movie metadata and critic ratings.
- Browser storage maintains watchlists and session information.
- An in-memory caching layer helps reduce redundant API requests.

There is currently no separately developed backend server or server-side database.

---

## 🚀 Getting Started

### Prerequisites

- Node.js
- npm
- TMDB API key
- OMDb API key

### 1. Clone the repository

```bash
git clone https://github.com/aarya4776/Cinematix.git
```

### 2. Navigate into the project

```bash
cd Cinematix
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a template.

Add your API keys:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_OMDB_API_KEY=your_omdb_api_key
```

Obtain API keys from:

- TMDB: https://developer.themoviedb.org/
- OMDb: https://www.omdbapi.com/apikey.aspx

### 5. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal to access Cinematix.

### 6. Build for production

```bash
npm run build
```

### 7. Run ESLint

```bash
npm run lint
```

---

## 📁 Project Structure

```text
Cinematix/
│
├── public/
│
├── scripts/
│
├── src/
│   ├── assets/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── validation/
│   └── App.jsx
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

---

## 🔐 Security Note

API keys are configured through environment variables. Because this is a client-side application, variables prefixed with `VITE_` are included in the browser bundle and should not be treated as private credentials.

Never commit your actual `.env` file or other sensitive credentials to GitHub.

---

## 📌 Project Information

**Project:** Cinematix  
**Category:** Movie Discovery & Recommendation Platform  
**Architecture:** Client-Side SPA  
**Frontend Framework:** React 19  
**Build Tool:** Vite 8

---

Cinematix — Explore Beyond Your Watchlist. Discover Beyond Your Taste.
