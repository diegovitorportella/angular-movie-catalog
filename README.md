# Angular Movie Catalog

This is a frontend application built with Angular to consume the [TMDB (The Movie Database) API](https://developer.themoviedb.org/reference/getting-started) and display a catalog of movies. This project was developed as a technical ramp-up to demonstrate foundational Angular skills, plus two advanced features focused on **RxJS** and **reactive data loading**.

🌐 **Live demo:** [angular-movie-catalog-lyart.vercel.app](https://angular-movie-catalog-lyart.vercel.app/)

## 🎯 Objective

Develop a modern, responsive single-page application (SPA) that allows users to browse popular movies, search for specific titles, view detailed information, and manage a protected favorites area.

## ✨ Functional Requirements

- **List Popular Movies:** Fetches and displays a list of currently popular movies.
- **Movie Details:** Displays the poster, title, description (overview), rating, and release date for each movie.
- **Search Functionality:** Allows users to search for movies by name.
- **Dedicated Details Page:** A dynamic route that presents detailed information about a selected movie.
- **Pagination:** Implements pagination for navigating through movie lists and search results.
- **Error Handling:** Displays friendly error messages when API requests fail or no results are found.

## 🧪 Advanced Features (Ramp-up Extensions)

Two additional features were implemented to explore more advanced Angular and RxJS concepts.

### 1. Route Resolver with `forkJoin`

The `/movie/:id` route uses an Angular **Resolver** to pre-fetch data **before** the component is displayed. Instead of opening the screen and then requesting data, the router loads everything up front.

The resolver uses **`forkJoin`** to fire three requests in parallel — movie details, cast (credits) and recommendations — delivering the component with all data ready. Errors are handled with `catchError`, redirecting back to the home page on failure.

> See [`movie-details.resolver.ts`](src/app/components/movie-details/resolvers/movie-details.resolver.ts).

### 2. Search History with RxJS

The home screen implements a **Google/Chrome-like search history**. RxJS is intentionally scoped to **this feature only** — the movie list, search, and pagination on the home use **Signals**, keeping the reactive stream focused on the history:

- The history lives in a dedicated service exposed as an Observable (**`history$`**) backed by a **`BehaviorSubject`**.
- It is persisted in `localStorage` with case-insensitive **dedup**, **most-recent-first** ordering, and a **10-item limit**.
- Confirmed searches (button / Enter / clicking a history item) push new terms via `addToHistory()`.
- As the user types, the dropdown filters the history in real time via a reactive pipeline: **`debounceTime`** (waits for a typing pause), **`distinctUntilChanged`** (skips unchanged terms), **`tap`** (debug side-effect), combined with the current history through **`combineLatest`**.
- The dropdown consumes the resulting **`filteredHistory$`** in the template via the **`async` pipe** (no manual `subscribe`/`ngOnDestroy`).

> See [`search-history.ts`](src/app/services/search-history.ts) (RxJS) and [`home.ts`](src/app/components/home/home.ts) (Signals + `filteredHistory$` via `async`).

## 🛠️ Technical Stack & Architecture

- **Framework:** Angular 21 (standalone components) & Angular CLI
- **Language:** TypeScript
- **Styling:** SCSS (Responsive Layout)
- **API Integration:** `HttpClient`
- **State Management:**
  - **Signals** for local UI state (home movie list, search, pagination, authentication, favorites, movie details).
  - **RxJS** for the details resolver (`forkJoin`) and the **search history** feature (`BehaviorSubject` / `history$`, plus a `debounceTime` / `distinctUntilChanged` / `combineLatest` filter pipeline).
- **Architecture:** Component-based architecture with separated services for API calls, route guards, a resolver, and defined models/interfaces for data typing.

## 📁 Project Structure

```text
src/
├── app/
│   ├── components/
│   │   ├── header/          # Top navigation + login toggle
│   │   ├── home/            # Movie list, search & pagination (Signals) + history dropdown (RxJS)
│   │   ├── movie-details/   # Details screen
│   │   │   └── resolvers/   # forkJoin resolver (pre-fetch details/cast/recommendations)
│   │   ├── favorites/       # Protected favorites screen
│   │   └── not-found/       # 404 page
│   ├── services/
│   │   ├── movie.ts         # TMDB API integration (HttpClient)
│   │   ├── auth.ts          # Simple auth state (signal)
│   │   ├── favorites.ts     # Favorites state (signal + localStorage)
│   │   └── search-history.ts# Search history (BehaviorSubject + localStorage)
│   ├── models/             # TypeScript interfaces (Movie, MovieResponse)
│   ├── guards/             # Route guards (auth-guard)
│   ├── app.routes.ts
│   └── app.config.ts
└── environments/           # Environment variables (API keys / access token)
```

## 🛣️ Routing

The application implements the following routes:

| Route | Description | Notes |
| ------ | ----------- | ----- |
| `/` | Home page with the list of popular movies | Search + pagination |
| `/movie/:id` | Movie details page | Data pre-loaded via **Resolver** (`forkJoin`) |
| `/favorites` | Protected favorites page | Guarded by **auth guard** |
| `**` | 404 - Page Not Found | Wildcard fallback |

## 🔒 Route Protection (Guards)

The `/favorites` route is protected by a simple Angular Guard (`CanActivateFn`) to demonstrate basic access control.

- Unauthenticated users are redirected to the home page.
- Authenticated users can access the route normally.

Authentication state is a simple `signal` toggled from the header, kept intentionally minimal to showcase guards.

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- A TMDB account with an API key / access token ([get one here](https://developer.themoviedb.org/reference/getting-started))

### Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure your environment. Copy the example file and fill in your TMDB credentials:
   ```bash
   cp src/environments/environment.example.ts src/environments/environment.ts
   ```
   Then edit `src/environments/environment.ts`:
   ```ts
   export const environment = {
     production: false,
     tmdbApiKey: 'YOUR_API_KEY',
     tmdbAccessToken: 'YOUR_ACCESS_TOKEN',
     apiUrl: 'https://api.themoviedb.org/3'
   };
   ```

### Running

- Start the dev server:
  ```bash
  npm start
  ```
  The app will be available at `http://localhost:4200/`.
- Production build:
  ```bash
  npm run build
  ```

## ☁️ Deployment (Vercel)

The app is deployed on [Vercel](https://vercel.com) as a static SPA at [angular-movie-catalog-lyart.vercel.app](https://angular-movie-catalog-lyart.vercel.app/). Configuration lives in [`vercel.json`](vercel.json):

- **Build command:** `node scripts/set-env.js && npm run build`
- **Output directory:** `dist/angular-movie-catalog/browser`
- **Rewrites:** every route falls back to `index.html`, so deep links such as `/movie/123` and `/favorites` work on refresh.

Since `src/environments/environment.ts` is git-ignored, [`scripts/set-env.js`](scripts/set-env.js) generates it at build time from environment variables. Set these in **Project Settings → Environment Variables** on Vercel:

| Variable | Description |
| -------- | ----------- |
| `TMDB_API_KEY` | Your TMDB API key |
| `TMDB_ACCESS_TOKEN` | Your TMDB read access token |

To deploy:

1. Import the GitHub repository in Vercel (or run `npx vercel` from the project root).
2. Add the two environment variables above.
3. Deploy. Every push to the main branch triggers a new production deployment.

> **Note:** this is a frontend-only app, so the TMDB token is bundled into the client code. Use TMDB's read-only access token and never reuse credentials with broader permissions.

## 🚀 Features

- Browse popular movies
- Search movies by title
- Google/Chrome-like search history with real-time filtering (RxJS + persistence)
- View detailed movie information (cast & recommendations)
- Data pre-loaded via route Resolver (`forkJoin`)
- Add/remove favorites (persisted locally)
- Responsive user interface with hover effects
- Protected routes using Angular Guards
- RESTful API integration with TMDB
- Pagination support
- Error handling for failed requests
