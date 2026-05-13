import { Component, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../servicios/user.service';
import { TopActions } from '../top-actions/top-actions';
import { BottomNavbar } from '../bottom-navbar/bottom-navbar';
import { Banner } from '../banner/banner';
import { UserService } from '../../servicios/user.service';

interface PlayerRanking {
  id: string;
  name: string;
  victories: number;
  status: 'online' | 'offline';
  rank: number;
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, BottomNavbar, Banner, TopActions],
  templateUrl: './ranking.html',
  styleUrl: './ranking.css',
})
export class Ranking {
  private router = inject(Router);
  private userService = inject(UserService);

  searchQuery = signal('');
  
  // Real data for ranking
  players = signal<PlayerRanking[]>([]);

  filteredPlayers = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.players();
    return this.players().filter(p => p.name.toLowerCase().includes(query));
  });

  constructor() {
    this.cargarRanking();
  }

  cargarRanking() {
    this.userService.getRanking().subscribe({
      next: (data) => {
        const mappedPlayers: PlayerRanking[] = data.map((u, index) => ({
          id: u.id,
          name: u.id, // En UsuarioMongo, id es el nickname
          victories: u.victorias || 0,
          status: 'online', // Por defecto, o podrías omitirlo
          rank: index + 1
        }));
        this.players.set(mappedPlayers);
      },
      error: (err) => console.error('Error al cargar ranking:', err)
    });
  }
}
