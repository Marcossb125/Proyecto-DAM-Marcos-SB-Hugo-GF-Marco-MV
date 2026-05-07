import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  /** Socket sin autenticación, sólo para register y login */
  public readonly authSocket: Socket = io('http://localhost:3000', { transports: ['websocket'] });

  /** Socket autenticado, se crea tras el login con el token JWT */
  private socket!: Socket;

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

  public desconectar(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Socket autenticado desconectado');
    }
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
