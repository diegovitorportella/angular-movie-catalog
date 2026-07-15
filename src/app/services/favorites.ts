import { Injectable, signal } from '@angular/core';
import { Movie } from '../models/movie.type';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  public favorites = signal<Movie[]>(this.loadFavorites());

  private loadFavorites(): Movie[] {
    const saved = localStorage.getItem('angular-movie-favorites');
    return saved ? JSON.parse(saved) : [];
  }

  private saveFavorites(favs: Movie[]): void {
    localStorage.setItem('angular-movie-favorites', JSON.stringify(favs));
  }

  toggleFavorite(movie: Movie): void {
    const currentFavs = this.favorites();
    const index = currentFavs.findIndex(m => m.id === movie.id);
    let updatedFavs: Movie[];

    if (index > -1) {
      updatedFavs = currentFavs.filter(m => m.id !== movie.id);
    } else {
      updatedFavs = [...currentFavs, movie];
    }

    this.favorites.set(updatedFavs);
    this.saveFavorites(updatedFavs);
  }

  isFavorite(movieId: number): boolean {
    return this.favorites().some(m => m.id === movieId);
  }
}