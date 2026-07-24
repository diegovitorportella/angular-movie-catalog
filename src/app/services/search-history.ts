import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  private readonly STORAGE_KEY = 'movie-search-history';
  private readonly MAX_ITEMS = 10;

  private historySubject = new BehaviorSubject<string[]>(this.loadFromStorage());

  public history$: Observable<string[]> = this.historySubject.asObservable();

  getFilteredHistory(term$: Observable<string>): Observable<string[]> {
    const debouncedTerm$ = term$.pipe(
      debounceTime(200),
      map(term => term.trim().toLowerCase()),
      startWith(''),
      distinctUntilChanged(),
      tap(term => console.debug('[SearchHistory] termo filtrado:', term || '(vazio)'))
    );

    return combineLatest([this.history$, debouncedTerm$]).pipe(
      map(([history, term]) =>
        term ? history.filter(item => item.toLowerCase().includes(term)) : history
      )
    );
  }

  addToHistory(query: string): void {
    const term = query.trim();
    if (!term) {
      return;
    }

    const current = this.historySubject.value;

    const withoutDuplicate = current.filter(q => q.toLowerCase() !== term.toLowerCase());
    const updated = [term, ...withoutDuplicate].slice(0, this.MAX_ITEMS);

    this.persist(updated);
    this.historySubject.next(updated);
  }

  clearHistory(): void {
    this.persist([]);
    this.historySubject.next([]);
  }

  private loadFromStorage(): string[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private persist(history: string[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }
}
