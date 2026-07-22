import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { MovieDetailsComponent } from './components/movie-details/movie-details';
import { FavoritesComponent } from './components/favorites/favorites';
import { authGuard } from './guards/auth-guard';
import { NotFound } from './components/not-found/not-found';
import { movieDetailsResolver } from './components/movie-details/resolvers/movie-details.resolver';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'movie/:id', 
    component: MovieDetailsComponent,
    resolve: { movieData: movieDetailsResolver }
  },
  { 
     path: 'favorites', 
     component: FavoritesComponent,
     canActivate: [authGuard] 
   },
  { path: '**', component: NotFound }
];