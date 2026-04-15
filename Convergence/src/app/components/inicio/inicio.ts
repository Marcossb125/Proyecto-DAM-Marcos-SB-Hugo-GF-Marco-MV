import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';

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
  imports: [MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  // TODO: Replace with data from auth service / user API
  playerName = signal('Sir Lancelot');
  playerStatus = signal('EN LÍNEA');

  // TODO: Fetch from backend API
  activeGame = signal<ActiveGame | null>({
    id: 1,
    name: 'Dark Crusade',
    mode: 'Conquest',
    currentPlayers: 6,
    maxPlayers: 12,
    daysPassed: 37,
    hoursLeft: 2,
  });

  constructor(private router: Router) { }

  continueGame(): void {
    // TODO: Connect to game service to resume active game
    console.log('Continuing active game...');
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  showAllGames(): void {
    this.router.navigate(['/lobby']);
  }

  createGame(): void {
    // TODO: Connect to backend API to create new game
    console.log('Creating new game...');
  }

  logout(): void {
    // TODO: Connect to auth service for proper logout
    this.router.navigate(['/login']);
    console.log('Cerrando sesión táctica...');
  }

}
