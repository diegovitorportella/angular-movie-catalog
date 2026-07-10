import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie';

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
  public movie = signal<any>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.movieService.getMovieDetails(id).subscribe({
        next: (response: any) => {
          this.movie.set(response);
        },
        error: (err: any) => {
          console.error('Erro ao buscar detalhes do filme:', err);
        }
      });
    }
  }
}