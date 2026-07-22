import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.scss'
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public favoritesService = inject(FavoritesService);
  public movie = signal<any>(null);
  public credits = signal<any>(null);
  public recommendations = signal<any>(null);
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const resolvedData = this.route.snapshot.data['movieData'];

    if (resolvedData) {
      this.movie.set(resolvedData.details);
      this.credits.set(resolvedData.credits);
      this.recommendations.set(resolvedData.recommendations);
    } else {
      this.errorMessage.set('Não foi possível carregar os detalhes deste filme.');
    }
  }

  toggleFavorite() {
    const currentMovie = this.movie();
    if (currentMovie) {
      this.favoritesService.toggleFavorite(currentMovie);
    }
  }

  isFavorite(): boolean {
    const currentMovie = this.movie();
    return currentMovie ? this.favoritesService.isFavorite(currentMovie.id) : false;
  }
}