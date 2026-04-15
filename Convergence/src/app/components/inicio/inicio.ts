import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

interface ActiveGame {
  id: number;
  name: string;
  mode: string;
  currentPlayers: number;
  maxPlayers: number;
  daysPassed: number;
  hoursLeft: number;
}

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  playerName = signal('Sir Lancelot');
  playerStatus = signal('EN LÍNEA');

  activeGame = signal<ActiveGame | null>({
    id: 1,
    name: 'Dark Crusade',
    mode: 'Conquest',
    currentPlayers: 6,
    maxPlayers: 12,
    daysPassed: 37,
    hoursLeft: 2,
  });

  constructor(private router: Router) {}

  continueGame(): void {
    console.log('Continuing active game...');
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  showAllGames(): void {
    this.router.navigate(['/lobby']);
  }

  createGame(): void {
    console.log('Creating new game...');
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
