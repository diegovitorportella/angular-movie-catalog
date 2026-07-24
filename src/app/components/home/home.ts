import { Component, OnInit, inject, signal } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { MovieService } from '../../services/movie';
import { SearchHistoryService } from '../../services/search-history';
import { Movie, MovieResponse } from '../../models/movie.type';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss' 
})
export class HomeComponent implements OnInit {
  private movieService = inject(MovieService);

  public searchHistoryService = inject(SearchHistoryService);

  private searchTerm$ = new Subject<string>();
  public filteredHistory$: Observable<string[]> =
    this.searchHistoryService.getFilteredHistory(this.searchTerm$);

  public movies = signal<Movie[]>([]);
  public currentPage = signal<number>(1);
  public currentQuery = signal<string>('');
  public errorMessage = signal<string | null>(null);
  public showDropdown = signal<boolean>(false);

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    const query = this.currentQuery();
    const page = this.currentPage();

    this.errorMessage.set(null);

    if (!query) {
      this.movieService.getPopularMovies(page).subscribe({
        next: (response: MovieResponse) => this.movies.set(response.results),
        error: (err) => {
          console.error('Erro ao buscar populares:', err);
          this.errorMessage.set('Não foi possível carregar a lista de filmes. Tente novamente mais tarde.');
        }
      });
    } else {
      this.movieService.searchMovies(query, page).subscribe({
        next: (response: MovieResponse) => this.movies.set(response.results),
        error: (err) => {
          console.error('Erro ao buscar filmes:', err);
          this.errorMessage.set('Ocorreu um erro ao realizar a busca. Verifique sua conexão e tente novamente.');
        }
      });
    }
  }

  onSearch(query: string): void {
    const term = query.trim();
    this.currentQuery.set(term);
    this.currentPage.set(1);

    if (term) {
      this.searchHistoryService.addToHistory(term);
    }

    this.showDropdown.set(false);
    this.loadMovies();
  }

  selectHistory(item: string, input: HTMLInputElement): void {
    input.value = item;
    this.onSearch(item);
  }

  onInput(value: string): void {
    this.searchTerm$.next(value);
  }

  onFocus(): void {
    this.showDropdown.set(true);
  }

  onBlur(): void {
    this.showDropdown.set(false);
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