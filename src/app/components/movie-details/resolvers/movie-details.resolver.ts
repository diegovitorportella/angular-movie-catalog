import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MovieService } from '../../../services/movie';

export const movieDetailsResolver: ResolveFn<any> = (route) => {
  const id = route.paramMap.get('id');
  const movieService = inject(MovieService);
  const router = inject(Router);

  if (!id) {
    router.navigate(['/']);
    return of(null);
  }

  return forkJoin({
    details: movieService.getMovieDetails(id),
    credits: movieService.getMovieCredits(id),
    recommendations: movieService.getMovieRecommendations(id)
  }).pipe(
    catchError(error => {
      console.error('Erro ao pré-carregar dados do filme:', error);
      router.navigate(['/']);
      return of(null);
    })
  );
};