import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private socketService = inject(SocketService);

  constructor() { }

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
