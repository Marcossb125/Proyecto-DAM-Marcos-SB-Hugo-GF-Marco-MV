import { Component, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../servicios/auth.service';
import { UserService } from '../../servicios/user.service';
import { NationFlag, NationData } from '../nation-flag/nation-flag';
import { FlagBuilder } from '../flag-builder/flag-builder';
import { TopActions } from '../top-actions/top-actions';
import { BottomNavbar } from '../bottom-navbar/bottom-navbar';
import { Banner } from '../banner/banner';
import { PartidaService, Partida } from '../../servicios/partida.service';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule, MatButtonModule, MatIconModule, MatBadgeModule, MatSnackBarModule, NationFlag, FlagBuilder, BottomNavbar, Banner, TopActions],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  // TODO: Replace with data from auth service / user API
  playerName = signal('Comandante');
  playerStatus = signal('En línea');

  nationData = signal<NationData | null>(null);
  isEditingFlag = signal<boolean>(false);

  activeGames = signal<Partida[]>([]);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private userService: UserService,
    private partidaService: PartidaService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.route.snapshot.queryParamMap.get('needLobbySetup') === 'profile') {
      this.snackBar.open(
        'Para entrar al lobby necesitas guardar una bandera (diseño y colores) y un nombre de facción. Edita la bandera desde tu perfil.',
        'Entendido',
        { duration: 8000 }
      );
      void this.router.navigate(['/inicio'], { replaceUrl: true, queryParams: {} });
    }

    const nombre = this.authService.obtenerNombreUsuario();
    this.playerName.set(nombre);

    this.cargarMisPartidas();

    // Cargar la bandera del usuario desde la base de datos
    if (nombre) {
      this.userService.obtenerBandera(nombre).subscribe({
        next: (bandera) => {
          if (bandera && bandera.layout) {
            this.nationData.set({
              nombre: bandera.nombre || '',
              layout: bandera.layout,
              colors: bandera.colors || []
            });
          }
        },
        error: (err) => {
          console.error('Error al cargar la bandera:', err);
        }
      });
    }
  }

  cargarMisPartidas(): void {
    this.partidaService.buscarMisPartidas().subscribe({
      next: (partidas) => {
        // Limitar a 3 como pide el usuario, aunque el backend ya debería filtrarlas
        this.activeGames.set(partidas.slice(0, 3));
      },
      error: (err) => {
        console.error('Error al cargar mis partidas:', err);
      }
    });
  }

  continueGame(id: number): void {
    this.router.navigate(['/match', id]);
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
    this.authService.logoutUser();
    this.router.navigate(['/login']);
    console.log('Cerrando sesión táctica...');
  }

  openFlagBuilder(): void {
    this.isEditingFlag.set(true);
  }

  saveFlag(data: NationData): void {
    this.nationData.set(data);
    this.isEditingFlag.set(false);

    // Guardar la bandera en la base de datos
    const nickname = this.authService.obtenerNombreUsuario();
    if (nickname) {
      this.userService.guardarBandera(nickname, {
        layout: data.layout,
        nombre: data.nombre,
        colors: data.colors
      }).subscribe({
        next: () => {
          console.log('Bandera guardada en BD correctamente');
        },
        error: (err) => {
          console.error('Error al guardar la bandera en BD:', err);
        }
      });
    }
  }

  cancelFlagEdit(): void {
    this.isEditingFlag.set(false);
  }
}

