import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register').then((m) => m.Register),
  },
  {
    path: 'inicio',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'lobby',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/lobby/lobby').then((m) => m.Lobby),
  },
  {
    path: 'personajes',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/personajes/personajes').then((m) => m.Personajes),
  },
  {
    path: 'match/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/match/match').then((m) => m.Match),
  },
  {
    path: 'ranking',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/ranking/ranking').then((m) => m.Ranking),
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/chat/chat').then((m) => m.Chat),
  },
  { path: '**', redirectTo: 'login' },
];
