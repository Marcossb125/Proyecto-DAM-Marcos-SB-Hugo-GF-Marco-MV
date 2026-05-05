import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

// Socket sin autenticación, sólo para register y login
const authSocket = io('http://localhost:3000', { transports: ['websocket'] });

authSocket.on('connect', () => {
  console.log('Socket de auth conectado con ID:', authSocket.id);
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

export interface Partidaa {
  nombre: string;
  jugadores_limite: number;
  hostNombre: string;
}



@Injectable({
  providedIn: 'root',
})
export class PartidaService {

  /** Socket autenticado, se crea tras el login con el token JWT */
  private socket!: Socket;

  private readonly STORAGE_KEY = 'convergence_partidas';
  private readonly STORAGE_KEY_users = 'convergence_users';
  private readonly STORAGE_KEY_user = 'convergence_user';
  private readonly STORAGE_KEY_token = 'convergence_token';
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const tokenStr = localStorage.getItem(this.STORAGE_KEY_token);
      if (tokenStr) {
        try {
          const token = JSON.parse(tokenStr);
          this.conectar(token);
        } catch (e) {
          console.error('Error auto-conectando socket:', e);
        }
      }
    }
  }

  // ── WebSocket autenticado ────────────────────────────────────────────────

  /**
   * Inicializa el socket autenticado enviando el token en el handshake de
   * socket.io (opción auth). Debe llamarse tras un login exitoso.
   */
  public conectar(token: string): void {
    this.socket = io('http://localhost:3000', {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Socket autenticado conectado con ID:', this.socket.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Error de conexión autenticada:', err.message);
    });
  }

  /**
   * Escucha un evento del servidor y lo expone como Observable de RxJS.
   * Al desuscribirse, elimina automáticamente el listener.
   */
  public listen(event: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        subscriber.error('Socket no inicializado');
        return;
      }
      this.socket.on(event, (data: any) => subscriber.next(data));
      return () => {
        if (this.socket) this.socket.off(event);
      };
    });
  }

  /**
   * Emite un evento al servidor a través del socket autenticado.
   */
  public emit(event: string, data: any): void {
    console.log('Emitting event:', event, data);
    if (!this.socket) {
      console.error('No se puede emitir, socket no inicializado');
      return;
    }
    this.socket.emit(event, data);
  }

  // ── Auth (register / login) ──────────────────────────────────────────────

  registerUser(data: { email: string; password: string; nickname: string }): Promise<boolean> {
    return new Promise((resolve) => {
      authSocket.emit('register', data, (response: { error?: string }) => {
        if (response.error) {
          console.error('Error en el registro:', response.error);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  loginUser(data: { nickname: string; password: string }): Promise<boolean> {
    return new Promise((resolve) => {
      authSocket.emit('login', data, (response: { data: string; error?: string }) => {
        if (response.data) {
          localStorage.setItem(this.STORAGE_KEY_user, JSON.stringify(data.nickname));
          localStorage.setItem(this.STORAGE_KEY_token, JSON.stringify(response.data));

          // Conectar el socket autenticado usando el token recibido
          this.conectar(response.data);
          resolve(true);
        } else {
          console.error('Error en el login:', response.error);
          resolve(false);
        }
      });
    });
  }

  logoutUser(): void {
    localStorage.removeItem(this.STORAGE_KEY_token);
    localStorage.removeItem(this.STORAGE_KEY_user);
    if (this.socket) {
      this.socket.disconnect();
      console.log('Desconectado del servicio middleware');
    }
  }

  // ── Partidas (localStorage) ──────────────────────────────────────────────

  /**
   * Elimina una partida por su id del localStorage.
   */
  eliminarPartidaPorId(id: number): void {
    const partidas = this.obtenerPartidas();
    const nuevasPartidas = partidas.filter((p) => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(nuevasPartidas));
  }

  /**
   * Obtiene todas las partidas guardadas en localStorage.
   */
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

  /**
   * Guarda una nueva partida en localStorage.
   */
  guardarPartida(partida: Partida): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const partidas = this.obtenerPartidas();
    partidas.push(partida);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(partidas));
  }

  crearPartida(nuevaPartida: Partidaa): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        subscriber.error('Socket no inicializado');
        return;
      }
      this.socket.emit('createRoom', nuevaPartida, (response: any) => {
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
      if (!this.socket) {
        subscriber.error('Socket no inicializado');
        return;
      }
      this.socket.emit('buscarPartidas', (response: any) => {
        if (response.success) {
          // Mapeamos los campos del backend (en español) a la interfaz del frontend (en inglés)
          const mappedPartidas: Partida[] = response.data.map((p: any) => ({
            id: p.id,
            name: p.nombre, // 'nombre' -> 'name'
            host: p.hostNombre || `ID: ${p.hostId}`, // Usamos el nombre del host que ahora envía el backend
            currentPlayers: p.jugadoresActuales,
            maxPlayers: p.jugadoresLimite,
            status: p.estado === 'En curso' ? 'open' : 'full',
            ping: p.ping || Math.floor(Math.random() * 60) + 10 // Simulado si no viene del backend
          }));
          subscriber.next(mappedPartidas);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }

  borrarPartida(nombre: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        subscriber.error('Socket no inicializado');
        return;
      }
      this.socket.emit('deleteRoom', nombre, (response: any) => {
        if (response.success) {
          subscriber.next(response);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }

  /**
   * Genera un ID único para una nueva partida.
   */
  generarId(): number {
    const partidas = this.obtenerPartidas();
    if (partidas.length === 0) return 1;
    return Math.max(...partidas.map((p) => p.id)) + 1;
  }

  // ── Usuarios (localStorage) ──────────────────────────────────────────────

  /**
   * Obtiene todos los usuarios guardados en localStorage.
   */
  obtenerUsuarios(): any[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    const data = localStorage.getItem(this.STORAGE_KEY_users);
    if (!data) return [];
    try {
      return JSON.parse(data) as any[];
    } catch {
      return [];
    }
  }

  guardarNombreUsuario(nombre: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.STORAGE_KEY_user, nombre);
  }

  obtenerNombreUsuario(): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    return localStorage.getItem(this.STORAGE_KEY_user) || '';
  }

  // ── Bandera (BD) ────────────────────────────────────────────────────────

  /**
   * Guarda la bandera del usuario en la base de datos.
   * Emite el evento 'guardarBandera' al middleware con el nickname y los datos de la bandera.
   */
  guardarBandera(nickname: string, bandera: { layout: string; nombre: string; colors: string[] }): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        subscriber.error('Socket no inicializado');
        return;
      }
      this.socket.emit('guardarBandera', { 
        nickname, 
        nombre: bandera.nombre, 
        bandera: { layout: bandera.layout, colors: bandera.colors } 
      }, (response: any) => {
        if (response.success) {
          subscriber.next(response.data);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }

  /**
   * Obtiene la bandera del usuario desde la base de datos.
   * Emite el evento 'obtenerBandera' al middleware con el nickname.
   */
  obtenerBandera(nickname: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        subscriber.error('Socket no inicializado');
        return;
      }
      this.socket.emit('obtenerBandera', { nickname }, (response: any) => {
        if (response.success) {
          subscriber.next(response.data);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }

  // ── General (BD) ────────────────────────────────────────────────────────

  /**
   * Guarda el general seleccionado por el usuario en la base de datos.
   */
  guardarGeneral(nickname: string, generalId: number): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        subscriber.error('Socket no inicializado');
        return;
      }
      this.socket.emit('guardarGeneral', { nickname, generalId }, (response: any) => {
        if (response.success) {
          subscriber.next(response.data);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }

  /**
   * Obtiene el general seleccionado por el usuario desde la base de datos.
   */
  obtenerGeneral(nickname: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        subscriber.error('Socket no inicializado');
        return;
      }
      this.socket.emit('obtenerGeneral', { nickname }, (response: any) => {
        if (response.success) {
          subscriber.next(response.data);
        } else {
          subscriber.error(response.error);
        }
        subscriber.complete();
      });
    });
  }
}
