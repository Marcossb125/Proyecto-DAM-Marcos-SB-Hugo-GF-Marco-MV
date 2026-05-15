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
import { NationFlag, NationData } from '../nation-flag/nation-flag';

interface PlayerRanking {
  id: string;
  name: string;
  victories: number;
  rank: number;
  flagData?: NationData;
  faction?: string;
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, BottomNavbar, Banner, TopActions, NationFlag],
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
        const mappedPlayers: PlayerRanking[] = data.map((u, index) => {
          let flagData: NationData | undefined;
          try {
            if (u.bandera) {
              flagData = JSON.parse(u.bandera);
            }
          } catch (e) {
            console.error('Error parsing flag data for user', u.id, e);
          }

          return {
            id: u.id,
            name: u.id, // En UsuarioMongo, id es el nickname
            victories: u.victorias || 0,
            rank: index + 1,
            flagData,
            faction: u.faccion
          };
        });
        this.players.set(mappedPlayers);
      },
      error: (err) => console.error('Error al cargar ranking:', err)
    });
  }
}
