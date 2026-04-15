import { Injectable } from '@angular/core';

export interface Partida {
  id: number;
  name: string;
  host: string;
  currentPlayers: number;
  maxPlayers: number;
  status: 'open' | 'full' | 'in-progress';
  ping: number;
}

@Injectable({
  providedIn: 'root',
})
export class PartidaService {
  private readonly STORAGE_KEY = 'convergence_partidas';
  private readonly STORAGE_KEY_users = 'convergence_users';

  /**
   * Obtiene todas las partidas guardadas en localStorage.
   */
  obtenerPartidas(): Partida[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) {
      return [];
    }
    try {
      return JSON.parse(data) as Partida[];
    } catch {
      return [];
    }
  }

  /**
   * Guarda una nueva partida en localStorage.
   */
  guardarPartida(partida: Partida): void {
    const partidas = this.obtenerPartidas();
    partidas.push(partida);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(partidas));
  }

  /**
   * Genera un ID único para una nueva partida.
   */
  generarId(): number {
    const partidas = this.obtenerPartidas();
    if (partidas.length === 0) {
      return 1;
    }
    return Math.max(...partidas.map((p) => p.id)) + 1;
  }

  guardarUsuario(usuario: any): void {
    const usuarios = this.obtenerUsuarios();
    usuarios.push(usuario);
    localStorage.setItem(this.STORAGE_KEY_users, JSON.stringify(usuarios));
  }

  /**
   * Obtiene todos los usuarios guardados en localStorage.
   */
  obtenerUsuarios(): any[] {
    const data = localStorage.getItem(this.STORAGE_KEY_users);
    if (!data) {
      return [];
    }
    try {
      return JSON.parse(data) as any[];
    } catch {
      return [];
    }
  }
}
