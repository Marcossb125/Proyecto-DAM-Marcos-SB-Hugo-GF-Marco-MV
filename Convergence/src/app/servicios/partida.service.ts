import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';



const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Conectado al servidor con ID:", socket.id);
});




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

  /**
   * Elimina una partida por su id del localStorage.
   */
  eliminarPartidaPorId(id: number): void {
    const partidas = this.obtenerPartidas();
    const nuevasPartidas = partidas.filter((p) => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nuevasPartidas));
  }
  private readonly STORAGE_KEY = 'convergence_partidas';
  private readonly STORAGE_KEY_users = 'convergence_users';
  private readonly STORAGE_KEY_user = 'convergence_user';
  private readonly STORAGE_KEY_token = 'convergence_token';

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

  registerUser(data: { email: string, password: string, nickname: string }): Promise<boolean> {
    return new Promise((resolve) => {
      socket.emit('register', data, (response: { error?: string }) => {
        if (response.error) {
          console.error('Error en el registro:', response.error);
          resolve(false);
        } else {
          console.log("hola");
          resolve(true);
        }
      });
    });
  }

  loginUser(data: { nickname: string, password: string }): Promise<boolean> {
    return new Promise((resolve) => {
      socket.emit('login', data, (response: { data: string; error?: string }) => {
        if (response.data) {
          localStorage.setItem(this.STORAGE_KEY_user, JSON.stringify(data.nickname));
          localStorage.setItem(this.STORAGE_KEY_token, JSON.stringify(response.data));
          resolve(true);
        } else {
          console.error('Error en el login:', response.error);
          resolve(false);
        }
      });
    })
  }

  logoutUser(): void {
    localStorage.removeItem(this.STORAGE_KEY_token);
    localStorage.removeItem(this.STORAGE_KEY_user);
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
  guardarNombreUsuario(nombre: string): void {
    localStorage.setItem(this.STORAGE_KEY_user, nombre);
  }
  obtenerNombreUsuario(): string {
    return localStorage.getItem(this.STORAGE_KEY_user) || '';
  }
}
