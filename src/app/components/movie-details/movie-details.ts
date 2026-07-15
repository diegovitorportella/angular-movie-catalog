import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie';
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
  private movieService = inject(MovieService);
  public favoritesService = inject(FavoritesService);
  
  public movie = signal<any>(null);
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.errorMessage.set(null);
      this.movieService.getMovieDetails(id).subscribe({
        next: (response: any) => {
          this.movie.set(response);
        },
        error: (err: any) => {
          console.error('Erro ao buscar detalhes do filme:', err);
          this.errorMessage.set('Não foi possível carregar os detalhes deste filme. Ele pode não existir ou ocorreu uma falha na rede.');
        }
      });
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