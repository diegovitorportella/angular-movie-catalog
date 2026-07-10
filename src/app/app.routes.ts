import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { MovieDetailsComponent } from './components/movie-details/movie-details';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movie/:id', component: MovieDetailsComponent }, 
];