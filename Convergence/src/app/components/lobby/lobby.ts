import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';

interface GameSlot {
  id: number;
  name: string;
  host: string;
  mode: string;
  currentPlayers: number;
  maxPlayers: number;
  status: 'open' | 'full' | 'in-progress';
  ping: number;
}

@Component({
  selector: 'app-lobby',
  imports: [],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby {
  playerName = signal('Sir Lancelot');
  playerLevel = signal(42);

  games = signal<GameSlot[]>([
    {
      id: 1,
      name: 'Dark Crusade',
      host: 'KnightOfDoom',
      mode: 'Conquest',
      currentPlayers: 6,
      maxPlayers: 12,
      status: 'open',
      ping: 32,
    },
    {
      id: 2,
      name: 'Siege of Ashenmoor',
      host: 'DragonSlayer99',
      mode: 'Siege',
      currentPlayers: 12,
      maxPlayers: 12,
      status: 'full',
      ping: 58,
    },
    {
      id: 3,
      name: 'The Forgotten Realm',
      host: 'ShadowMage',
      mode: 'Survival',
      currentPlayers: 3,
      maxPlayers: 8,
      status: 'open',
      ping: 15,
    },
    {
      id: 4,
      name: 'Operation Nightfall',
      host: 'TacticalOps',
      mode: 'Blitz',
      currentPlayers: 8,
      maxPlayers: 10,
      status: 'open',
      ping: 45,
    },
  ]);

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  joinGame(game: GameSlot): void {
    if (game.status === 'open') {
      console.log(`Joining game: ${game.name}`);
      // TODO: Connect to backend API to join game
    }
  }

  createGame(): void {
    console.log('Creating new game...');
    // TODO: Connect to backend API to create game
  }

  logout(): void {
    // TODO: Connect to auth service for proper logout
    this.router.navigate(['/login']);
  }

  getPingClass(ping: number): string {
    if (ping < 30) return 'ping-excellent';
    if (ping < 60) return 'ping-good';
    return 'ping-poor';
  }

  getPlayerRatio(game: GameSlot): string {
    return `${game.currentPlayers}/${game.maxPlayers}`;
  }

  getPlayerBarWidth(game: GameSlot): string {
    return `${(game.currentPlayers / game.maxPlayers) * 100}%`;
  }
}
