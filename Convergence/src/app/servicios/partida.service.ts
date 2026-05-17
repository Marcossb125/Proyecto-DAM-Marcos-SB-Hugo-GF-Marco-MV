import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { AuthService } from './auth.service';

export interface Partida {
  id: number;
  name: string;
  host: string;
  currentPlayers: number;
  maxPlayers: number;
  status: 'open' | 'full' | 'in-progress';
  ping: number;
}

export interface Partidaa {
  nombre: string;
  jugadores_limite: number;
  hostNombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class PartidaService {
  private socketService = inject(SocketService);
  private authService = inject(AuthService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly STORAGE_KEY = 'convergence_partidas';

  constructor() { }

  public listen(event: string): Observable<any> {
    return this.socketService.listen(event);
  }

  public emit(event: string, data: any): void {
    this.socketService.emit(event, data);
  }

  eliminarPartidaPorId(id: number): void {
    const partidas = this.obtenerPartidas();
    const nuevasPartidas = partidas.filter((p) => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nuevasPartidas));
  }

  obtenerPartidas(): Partida[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data) as Partida[];
    } catch {
      return [];
    }
  }

  guardarPartida(partida: Partida): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const partidas = this.obtenerPartidas();
    partidas.push(partida);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(partidas));
  }

  crearPartida(nuevaPartida: Partidaa): Observable<any> {
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('createRoom', nuevaPartida, (response: any) => {
        if (response.success) {
          subscriber.next(response.data);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }

  buscarPartidasActivas(): Observable<Partida[]> {
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('buscarPartidas', null, (response: any) => {
        if (response.success) {
          const mappedPartidas: Partida[] = response.data.map((p: any) => ({
            id: p.id,
            name: p.nombre,
            host: p.hostNombre || `ID: ${p.hostId}`,
            currentPlayers: p.jugadoresActuales,
            maxPlayers: p.jugadoresLimite,
            status: p.estado === 'En curso' ? 'open' : 'full',
            ping: p.ping || Math.floor(Math.random() * 60) + 10
          }));
          subscriber.next(mappedPartidas);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }

  buscarMisPartidas(): Observable<Partida[]> {
    const nickname = this.authService.obtenerNombreUsuario();
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('buscarMisPartidas', { nickname }, (response: any) => {
        if (response.success) {
          const mappedPartidas: Partida[] = response.data.map((p: any) => ({
            id: p.id,
            name: p.nombre,
            host: p.hostNombre || `ID: ${p.hostId}`,
            currentPlayers: p.jugadoresActuales,
            maxPlayers: p.jugadoresLimite,
            status: p.estado === 'En curso' ? 'open' : 'full',
            ping: p.ping || Math.floor(Math.random() * 60) + 10
          }));
          subscriber.next(mappedPartidas);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }


  unirseAPartida(partidaId: number): Observable<any> {
    const nickname = this.authService.obtenerNombreUsuario();
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('joinMatch', { matchId: partidaId.toString(), playerId: nickname }, (response: any) => {
        if (response.success) {
          subscriber.next(response.data);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }

  borrarPartida(nombre: string): Observable<any> {
    let data = { nombre, hostNombre: this.authService.obtenerNombreUsuario() };
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('deleteRoom', data, (response: any) => {
        if (response.success) {
          subscriber.next(response);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }

  generarId(): number {
    const partidas = this.obtenerPartidas();
    if (partidas.length === 0) return 1;
    return Math.max(...partidas.map((p) => p.id)) + 1;
  }
}
