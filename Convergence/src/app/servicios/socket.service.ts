import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  /** Socket sin autenticación, sólo para register y login */
  public readonly authSocket: Socket = io(environment.backendUrl, { transports: ['websocket'] });

  /** Socket autenticado, se crea tras el login con el token JWT */
  private socket!: Socket;

  /** Subject que emite cada vez que el servidor envía GAME_STATE_UPDATE */
  public readonly gameStateUpdates$ = new Subject<any>();

  private readonly STORAGE_KEY_token = 'convergence_token';
  private readonly platformId = inject(PLATFORM_ID);

  constructor() {
    this.authSocket.on('connect', () => {
      console.log('Socket de auth conectado con ID:', this.authSocket.id);
    });

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

  /**
   * Inicializa el socket autenticado enviando el token en el handshake de
   * socket.io (opción auth). Debe llamarse tras un login exitoso.
   */
  public conectar(token: string): void {
    this.socket = io(environment.backendUrl, {
      auth: { token },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Socket autenticado conectado con ID:', this.socket.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('Error de conexión autenticada:', err.message);
    });

    // Adjuntar el listener aquí garantiza que nunca se pierda un evento
    this.socket.on('GAME_STATE_UPDATE', (state: any) => {
      console.log('[SocketService] GAME_STATE_UPDATE recibido. Fase:', state?.currentPhase);
      this.gameStateUpdates$.next(state);
    });
  }

  public desconectar(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Socket autenticado desconectado');
    }
  }

  /**
   * Escucha un evento del servidor y lo expone como Observable de RxJS.
   * Al desuscribirse, elimina automáticamente el listener específico (no todos).
   */
  public listen(event: string): Observable<any> {
    return new Observable((subscriber) => {
      if (!this.socket) {
        subscriber.error('Socket no inicializado');
        return;
      }
      const handler = (data: any) => subscriber.next(data);
      this.socket.on(event, handler);
      return () => {
        if (this.socket) this.socket.off(event, handler);
      };
    });
  }

  /**
   * Como listen(), pero espera hasta que el socket esté disponible (polling cada 500ms).
   * Útil para efectos que se crean antes de que el usuario haga login.
   */
  public listenForGame(event: string): Observable<any> {
    return new Observable((subscriber) => {
      let handler: ((data: any) => void) | null = null;
      let intervalId: any = null;

      const trySubscribe = () => {
        if (!this.socket) {
          console.warn(`[SocketService] listenForGame('${event}'): socket no listo, reintentando...`);
          return;
        }
        clearInterval(intervalId);
        console.log(`[SocketService] listenForGame('${event}'): socket listo, suscribiendo.`);
        handler = (data: any) => {
          console.log(`[SocketService] Evento '${event}' recibido:`, data);
          subscriber.next(data);
        };
        this.socket.on(event, handler);
      };

      trySubscribe();
      if (!handler) {
        intervalId = setInterval(trySubscribe, 500);
      }

      return () => {
        clearInterval(intervalId);
        if (this.socket && handler) this.socket.off(event, handler);
      };
    });
  }

  /**
   * Emite un evento al servidor a través del socket autenticado o del socket de auth.
   */
  public emit(event: string, data: any, useAuthSocket: boolean = false): void {
    const s = useAuthSocket ? this.authSocket : this.socket;
    if (!s) {
      console.error(`No se puede emitir ${event}, socket no inicializado`);
      return;
    }
    s.emit(event, data);
  }

  /**
   * Emite un evento con callback. Si data es null o undefined, emite solo el callback.
   */
  public emitWithCallback(event: string, data: any, callback: (response: any) => void, useAuthSocket: boolean = false): void {
    const s = useAuthSocket ? this.authSocket : this.socket;
    if (!s) {
      console.error(`No se puede emitir ${event}, socket no inicializado`);
      return;
    }
    if (data === null || data === undefined) {
      s.emit(event, callback);
    } else {
      s.emit(event, data, callback);
    }
  }
}
