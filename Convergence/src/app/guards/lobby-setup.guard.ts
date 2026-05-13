import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthService } from '../servicios/auth.service';
import { UserService } from '../servicios/user.service';

/**
 * El lobby exige general (1–4), bandera guardada (layout + colores) y nombre de facción
 * (viene en obtenerBandera como `nombre`, persistido en usuario.Faccion).
 */
export const lobbySetupGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const userService = inject(UserService);
  const router = inject(Router);

  const nickname = auth.obtenerNombreUsuario();
  if (!nickname) {
    return router.createUrlTree(['/login']);
  }

  const bandera$ = userService.obtenerBandera(nickname).pipe(catchError(() => of(null)));
  const general$ = userService.obtenerGeneral(nickname).pipe(catchError(() => of(null)));

  return forkJoin({ bandera: bandera$, general: general$ }).pipe(
    map(({ bandera, general }) => {
      const hasLayout =
        bandera &&
        typeof bandera.layout === 'string' &&
        bandera.layout.trim().length > 0;
      const hasColors =
        bandera &&
        Array.isArray(bandera.colors) &&
        bandera.colors.length > 0;
      const hasFactionName =
        bandera &&
        typeof bandera.nombre === 'string' &&
        bandera.nombre.trim().length > 0;

      const gid = general?.generalId;
      const n = gid != null ? Number(gid) : NaN;
      const hasGeneral = Number.isInteger(n) && n >= 1 && n <= 4;

      if (hasLayout && hasColors && hasFactionName && hasGeneral) {
        return true;
      }

      if (!hasGeneral) {
        return router.createUrlTree(['/personajes'], { queryParams: { needLobbySetup: 'general' } });
      }
      return router.createUrlTree(['/inicio'], { queryParams: { needLobbySetup: 'profile' } });
    }),
    catchError(() => of(router.createUrlTree(['/inicio'], { queryParams: { needLobbySetup: 'profile' } })))
  );
};
