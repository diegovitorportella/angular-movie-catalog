import { Component, OnInit, inject } from '@angular/core';
import { MovieService } from '../../services/movie';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);

  ngOnInit(): void {
    this.movieService.getPopularMovies().subscribe({
      next: (response) => {
        console.log('Filmes Populares:', response.results);
      },
      error: (err) => {
        console.error('Erro ao buscar filmes:', err);
      }
    });
  }
}