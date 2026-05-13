import { Component, signal, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TopActions } from '../top-actions/top-actions';
import { BottomNavbar } from '../bottom-navbar/bottom-navbar';
import { Banner } from '../banner/banner';
import { PartidaService, Partida, Partidaa } from '../../servicios/partida.service';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-lobby',
  imports: [FormsModule, BottomNavbar, Banner, TopActions],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby implements OnInit {

  /**
   * Marca una partida para confirmar borrado (muestra mensaje inline).
   */
  deleteGame(game: Partida): void {
    this.gameToDelete.set(game);
  }

  /**
   * Confirma el borrado de la partida seleccionada.
   */
  confirmDelete(): void {
    const game = this.gameToDelete();
    if (!game) return;

    this.partidaService.borrarPartida(game.name).subscribe({
      next: () => {
        console.log('Partida borrada con éxito');
        this.gameToDelete.set(null);
        this.cargarPartidas();
      },
      error: (err) => {
        console.error('Error al borrar la partida:', err);
        this.gameToDelete.set(null);
      }
    });
  }

  /**
   * Cancela el borrado de la partida.
   */
  cancelDelete(): void {
    this.gameToDelete.set(null);
  }

  isHost(game: Partida): boolean {
    const currentUser = this.authService.obtenerNombreUsuario();
    return game.host === currentUser;
  }


  playerName = signal('Sir Lancelot');
  playerLevel = signal(42);
  currentPage = signal(1);
  pageSize = 4; // partidas por página en móvil
  isMobile = signal(false);

  pagedGames = computed(() => {
    const list = this.filteredGames();
    if (!this.isMobile()) return list;
    const start = (this.currentPage() - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  totalPages = computed(() => {
    const list = this.filteredGames();
    if (!this.isMobile()) return 1;
    return Math.max(1, Math.ceil(list.length / this.pageSize));
  });

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  games = signal<Partida[]>([]);

  // Modal state
  showModal = signal(false);
  newGameName = '';
  newGameMaxPlayers = 2;
  formError = signal('');
  gameToDelete = signal<Partida | null>(null);

  searchText = signal('');
  errorModalMessage = signal('');

  filteredGames = computed(() => {
    const search = this.searchText().toLowerCase();
    return this.games().filter(game =>
      (game.name || '').toLowerCase().includes(search)
    );
  });

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.currentPage.set(1); // Reiniciar a la primera página al buscar
  }

  constructor(
    private router: Router,
    private partidaService: PartidaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarPartidas();
    // Solo accedemos a window en el navegador
    if (typeof window !== 'undefined') {
      const checkMobile = () => this.isMobile.set(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
    }
  }

  /**
 * Carga las partidas desde localStorage y actualiza la señal.
 */
  cargarPartidas(): void {
    // Pedimos al backend que busque las partidas activas
    this.partidaService.buscarPartidasActivas().subscribe({
      next: (partidas) => {
        this.games.set(partidas);
      },
      error: (err) => {
        console.error('Error al cargar partidas:', err);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  joinGame(game: Partida): void {
    if (game.status === 'open') {
      console.log(`Joining game: ${game.name}`);
      this.partidaService.unirseAPartida(game.id).subscribe({
        next: () => {
          this.router.navigate(['/match', game.id]);
        },
        error: (err) => {
          if (err === 'La partida está llena') {
            this.errorModalMessage.set('No puedes unirte a esta partida porque ya está llena.');
          } else {
            this.errorModalMessage.set('Error táctico: ' + (err || 'desconocido'));
          }
          console.error('Error al unirse:', err);
        }
      });
    }
  }

  closeErrorModal(): void {
    this.errorModalMessage.set('');
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
      host: this.authService.obtenerNombreUsuario(),
      currentPlayers: 1,
      maxPlayers: this.newGameMaxPlayers,
      status: 'open',
      ping: Math.floor(Math.random() * 60) + 10,
    };

    const nuevaPartidaa: Partidaa = {
      nombre: name,
      jugadores_limite: this.newGameMaxPlayers,
      hostNombre: this.authService.obtenerNombreUsuario(),
    };

    this.partidaService.crearPartida(nuevaPartidaa).subscribe({
      next: (res) => {
        console.log('Partida creada con éxito:', res);
        this.closeModal();
        // Redirigir directamente a la partida recién creada
        this.router.navigate(['/match', res.id]);
      },
      error: (err) => {
        this.formError.set(err || 'Nombre en uso o límite de partidas alcanzado');
      }
    });
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
