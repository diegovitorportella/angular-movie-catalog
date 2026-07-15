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
  public currentPage = signal<number>(1);
  public currentQuery = signal<string>('');
  
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    const query = this.currentQuery();
    const page = this.currentPage();
    
    this.errorMessage.set(null);

    if (!query) {
      this.movieService.getPopularMovies(page).subscribe({
        next: (response: any) => this.movies.set(response.results),
        error: (err: any) => {
          console.error('Erro ao buscar populares:', err);
          this.errorMessage.set('Não foi possível carregar a lista de filmes. Tente novamente mais tarde.');
        }
      });
    } else {
      this.movieService.searchMovies(query, page).subscribe({
        next: (response: any) => this.movies.set(response.results),
        error: (err: any) => {
          console.error('Erro ao buscar filmes:', err);
          this.errorMessage.set('Ocorreu um erro ao realizar a busca. Verifique sua conexão e tente novamente.');
        }
      });
    }
  }

  onSearch(query: string): void {
    this.currentQuery.set(query.trim());
    this.currentPage.set(1);
    this.loadMovies();
  }

  nextPage(): void {
    this.currentPage.update(page => page + 1);
    this.loadMovies();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
      this.loadMovies();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}