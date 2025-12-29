import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { TokenService } from '../feature/auth/service/token.service';

export const accessDashboardGuard: CanActivateFn = (_, __) => {
  const service = inject(TokenService)
  const router = inject(Router);
  return service.getToken() ? true : new RedirectCommand(router.parseUrl('/'));
};
