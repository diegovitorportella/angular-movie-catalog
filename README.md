# Angular Movie Catalog

This is a frontend application built with Angular to consume the [TMDB (The Movie Database) API](https://developer.themoviedb.org/reference/getting-started) and display a catalog of movies. This project was developed as a technical ramp-up to demonstrate foundational Angular skills.

## 🎯 Objective

Develop a modern, responsive single-page application (SPA) that allows users to browse popular movies, search for specific titles, view detailed information, and manage a protected favorites area.

## ✨ Functional Requirements

- **List Popular Movies:** Fetches and displays a list of currently popular movies.
- **Movie Details:** Displays the poster, title, description (overview), rating, and release date for each movie.
- **Search Functionality:** Allows users to search for movies by name.
- **Dedicated Details Page:** A dynamic route that presents detailed information about a selected movie.
- **Pagination:** Implements pagination for navigating through movie lists and search results.
- **Error Handling:** Displays friendly error messages when API requests fail or no results are found.

## 🛠️ Technical Stack & Architecture

- **Framework:** Angular & Angular CLI
- **Language:** TypeScript
- **Styling:** SCSS (Responsive Layout)
- **API Integration:** HttpClient
- **Architecture:** Component-based architecture with separated services for API calls and defined models/interfaces for data typing.

## 📁 Project Structure

```text
src/
└── app/
    ├── components/      # Pages and reusable UI components
    ├── services/        # API integration logic (MovieService)
    ├── models/          # TypeScript interfaces (Movie, MovieResponse)
    ├── guards/          # Route guards
    ├── environments/    # Environment variables (API keys)
    ├── app.routes.ts
    └── app.config.ts
```

## 🛣️ Routing

The application implements the following routes:

| Route | Description |
| ------ | ----------- |
| `/` | Home page with the list of popular movies |
| `/movie/:id` | Movie details page |
| `/favorites` | Protected favorites page |
| `**` | 404 - Page Not Found |

## 🔒 Route Protection (Guards)

The `/favorites` route is protected by a simple Angular Guard to demonstrate basic access control.

- Unauthenticated users are redirected.
- Authenticated users can access the route normally.

## 🚀 Features

- Browse popular movies
- Search movies by title
- View detailed movie information
- Responsive user interface
- Protected routes using Angular Guards
- RESTful API integration with TMDB
- Pagination support
- Error handling for failed requests
