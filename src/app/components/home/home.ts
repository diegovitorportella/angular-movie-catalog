import { Component, OnInit, inject, signal } from '@angular/core';
import { MovieService } from '../../services/movie';
import { Movie } from '../../models/movie.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);
  public movies = signal<Movie[]>([]);

  ngOnInit(): void {
    this.loadPopularMovies();
  }

  loadPopularMovies(): void {
    this.movieService.getPopularMovies().subscribe({
      next: (response: any) => this.movies.set(response.results),
      error: (err: any) => console.error('Erro ao buscar populares:', err)
    });
  }

  onSearch(query: string): void {
    if (!query.trim()) {
      this.loadPopularMovies();
      return;
    }

    this.movieService.searchMovies(query).subscribe({
      next: (response: any) => this.movies.set(response.results),
      error: (err: any) => console.error('Erro ao buscar filmes:', err)
    });
  }
}