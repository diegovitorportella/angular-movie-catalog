import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { MovieDetailsComponent } from './components/movie-details/movie-details';
import { FavoritesComponent } from './components/favorites/favorites';
import { authGuard } from './guards/auth-guard';
import { NotFound } from './components/not-found/not-found';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { 
    path: 'favorites', 
    component: FavoritesComponent, 
    canActivate: [authGuard] 
  },
  { path: '**', component: NotFound }
];