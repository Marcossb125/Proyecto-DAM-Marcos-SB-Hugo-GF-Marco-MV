import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PartidaService, Partida } from '../../servicios/partida.service';

@Component({
  selector: 'app-lobby',
  imports: [FormsModule],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby implements OnInit {
  playerName = signal('Sir Lancelot');
  playerLevel = signal(42);

  games = signal<Partida[]>([]);

  // Modal state
  showModal = signal(false);
  newGameName = '';
  newGameMaxPlayers = 2;
  formError = signal('');

  constructor(
    private router: Router,
    private partidaService: PartidaService
  ) {}

  ngOnInit(): void {
    this.cargarPartidas();
  }

  /**
   * Carga las partidas desde localStorage y actualiza la señal.
   */
  cargarPartidas(): void {
    const partidas = this.partidaService.obtenerPartidas();
    this.games.set(partidas);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  joinGame(game: Partida): void {
    if (game.status === 'open') {
      console.log(`Joining game: ${game.name}`);
    }
  }

  /**
   * Abre el modal para crear una nueva partida.
   */
  createGame(): void {
    this.newGameName = '';
    this.newGameMaxPlayers = 2;
    this.formError.set('');
    this.showModal.set(true);
  }

  /**
   * Cierra el modal.
   */
  closeModal(): void {
    this.showModal.set(false);
    this.formError.set('');
  }

  /**
   * Valida y confirma la creación de la partida, la guarda en localStorage.
   */
  confirmCreateGame(): void {
    // Validaciones
    const name = this.newGameName.trim();
    if (!name) {
      this.formError.set('El nombre de la partida es obligatorio.');
      return;
    }
    if (this.newGameMaxPlayers < 2) {
      this.formError.set('El mínimo de jugadores es 2.');
      return;
    }

    const nuevaPartida: Partida = {
      id: this.partidaService.generarId(),
      name: name,
      host: this.playerName(),
      currentPlayers: 1,
      maxPlayers: this.newGameMaxPlayers,
      status: 'open',
      ping: Math.floor(Math.random() * 60) + 10,
    };

    this.partidaService.guardarPartida(nuevaPartida);
    this.cargarPartidas();
    this.closeModal();
  }

  /**
   * Cierra el modal si se hace clic en el backdrop.
   */
  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeModal();
    }
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  getPingClass(ping: number): string {
    if (ping < 30) return 'ping-excellent';
    if (ping < 60) return 'ping-good';
    return 'ping-poor';
  }

  getPlayerRatio(game: Partida): string {
    return `${game.currentPlayers}/${game.maxPlayers}`;
  }

  getPlayerBarWidth(game: Partida): string {
    return `${(game.currentPlayers / game.maxPlayers) * 100}%`;
  }
}
