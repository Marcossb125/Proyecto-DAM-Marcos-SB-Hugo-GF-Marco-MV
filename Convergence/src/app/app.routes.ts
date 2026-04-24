import { Routes } from '@angular/router';

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
    loadComponent: () =>
      import('./components/inicio/inicio').then((m) => m.Inicio),
  },
  {
    path: 'lobby',
    loadComponent: () =>
      import('./components/lobby/lobby').then((m) => m.Lobby),
  },
  {
    path: 'personajes',
    loadComponent: () =>
      import('./components/personajes/personajes').then((m) => m.Personajes),
  },
  {
    path: 'match',
    loadComponent: () =>
      import('./components/match/match').then((m) => m.Match),
  },
  {
    path: 'ranking',
    loadComponent: () =>
      import('./components/ranking/ranking').then((m) => m.Ranking),
  },
  {
    path: 'chat',
    loadComponent: () =>
      import('./components/chat/chat').then((m) => m.Chat),
  },
  { path: '**', redirectTo: 'login' },
];
