import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private socketService = inject(SocketService);
  private platformId = inject(PLATFORM_ID);

  private readonly STORAGE_KEY_users = 'convergence_users';
  private readonly STORAGE_KEY_user = 'convergence_user';
  private readonly STORAGE_KEY_token = 'convergence_token';

  constructor() {}

  registerUser(data: { email: string; password: string; nickname: string }): Promise<boolean> {
    return new Promise((resolve) => {
      this.socketService.emitWithCallback('register', data, (response: { error?: string }) => {
        if (response.error) {
          console.error('Error en el registro:', response.error);
          resolve(false);
        } else {
          resolve(true);
        }
      }, true); // useAuthSocket = true
    });
  }

  loginUser(data: { nickname: string; password: string }): Promise<boolean> {
    return new Promise((resolve) => {
      this.socketService.emitWithCallback('login', data, (response: { data: string; error?: string }) => {
        if (response.data) {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.STORAGE_KEY_user, JSON.stringify(data.nickname));
            localStorage.setItem(this.STORAGE_KEY_token, JSON.stringify(response.data));
          }

          // Conectar el socket autenticado usando el token recibido
          this.socketService.conectar(response.data);
          resolve(true);
        } else {
          console.error('Error en el login:', response.error);
          resolve(false);
        }
      }, true); // useAuthSocket = true
    });
  }

  logoutUser(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.STORAGE_KEY_token);
      localStorage.removeItem(this.STORAGE_KEY_user);
    }
    this.socketService.desconectar();
    console.log('Sesión cerrada y socket desconectado');
  }

  guardarNombreUsuario(nombre: string): void {
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem(this.STORAGE_KEY_user, nombre);
  }

  obtenerNombreUsuario(): string {
    if (!isPlatformBrowser(this.platformId)) return '';
    const user = localStorage.getItem(this.STORAGE_KEY_user);
    if (!user) return '';
    try {
      // Intentar parsear por si está guardado como JSON string (como en loginUser)
      return JSON.parse(user);
    } catch {
      return user;
    }
  }

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

  estaLogueado(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    const token = localStorage.getItem(this.STORAGE_KEY_token);
    return !!token && token.length > 0;
  }
}
