import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PartidaService } from '../../servicios/partida.service';

interface PlayerRanking {
  id: number;
  name: string;
  victories: number;
  status: 'online' | 'offline';
  rank: number;
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class Ranking {
  private router = inject(Router);
  private partidaService = inject(PartidaService);

  searchQuery = signal('');
  
  // Mock data for ranking
  players = signal<PlayerRanking[]>([
    { id: 1, name: 'Sir Lancelot', victories: 150, status: 'online', rank: 1 },
    { id: 2, name: 'General Kenobi', victories: 132, status: 'online', rank: 2 },
    { id: 3, name: 'Dark Overlord', victories: 120, status: 'offline', rank: 3 },
    { id: 4, name: 'Tactical Mind', victories: 98, status: 'online', rank: 4 },
    { id: 5, name: 'Shadow Walker', victories: 85, status: 'offline', rank: 5 },
    { id: 6, name: 'Iron Wall', victories: 72, status: 'online', rank: 6 },
    { id: 7, name: 'Eagle Eye', victories: 65, status: 'offline', rank: 7 },
    { id: 8, name: 'Storm Bringer', victories: 54, status: 'online', rank: 8 },
  ]);

  filteredPlayers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.players();
    return this.players().filter(p => p.name.toLowerCase().includes(query));
  });

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}
