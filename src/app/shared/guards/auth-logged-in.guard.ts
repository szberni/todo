import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthFacadeService, RouteName } from 'src/app/shared';

export const AuthLoggedInGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
  const authFacade = inject(AuthFacadeService);
  const router = inject(Router);
  const user = await firstValueFrom(authFacade.getUser());

  return !user || router.createUrlTree([`/${RouteName.home}`]);
};
