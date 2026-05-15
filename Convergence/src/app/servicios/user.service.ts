import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private socketService = inject(SocketService);

  constructor() { }

  /**
   * Guarda la bandera del usuario en la base de datos.
   */
  guardarBandera(nickname: string, bandera: { layout: string; nombre: string; colors: string[] }): Observable<any> {
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('guardarBandera', {
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
   */
  obtenerBandera(nickname: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('obtenerBandera', { nickname }, (response: any) => {
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
   * Guarda el general seleccionado por el usuario en la base de datos.
   */
  guardarGeneral(nickname: string, generalId: number): Observable<any> {
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('guardarGeneral', { nickname, generalId }, (response: any) => {
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
      this.socketService.emitWithCallback('obtenerGeneral', { nickname }, (response: any) => {
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
   * Obtiene el ranking global de usuarios desde MongoDB.
   */
  getRanking(): Observable<any[]> {
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('getRanking', null, (response: any) => {
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
   * Obtiene el perfil de un usuario en el ranking (con bandera y facción) desde MongoDB.
   */
  getRankingUserProfile(nickname: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socketService.emitWithCallback('getRankingUserProfile', nickname, (response: any) => {
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
