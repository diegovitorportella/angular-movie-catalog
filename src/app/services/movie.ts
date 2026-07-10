import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MovieResponse } from '../models/movie.type';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private accessToken = environment.tmdbAccessToken;

  getPopularMovies(page: number = 1): Observable<MovieResponse> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.accessToken}`
    });

    return this.http.get<MovieResponse>(
      `${this.apiUrl}/movie/popular?language=pt-BR&page=${page}`, 
      { headers }
    );
  }
}