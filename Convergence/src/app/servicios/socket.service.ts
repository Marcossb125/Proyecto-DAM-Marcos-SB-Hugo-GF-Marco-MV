import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  public readonly authSocket: Socket = io(environment.backendUrl, { transports: ['websocket'] });

  private socket!: Socket;

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

  public emit(event: string, data: any, useAuthSocket: boolean = false): void {
    const s = useAuthSocket ? this.authSocket : this.socket;
    if (!s) {
      console.error(`No se puede emitir ${event}, socket no inicializado`);
      return;
    }
    s.emit(event, data);
  }

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
