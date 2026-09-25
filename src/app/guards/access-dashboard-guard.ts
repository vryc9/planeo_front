import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { AuthStore } from '../feature/auth/store/AuthStore';

/**
 * There is no client-side token to check anymore: session state comes from AuthStore, which is
 * hydrated by an app initializer that awaits the gateway's /auth/me call before the router
 * activates any route, so this can stay a synchronous guard.
 */
export const accessDashboardGuard: CanActivateFn = (_, __) => {
  const store = inject(AuthStore)
  const router = inject(Router);
  return store.userConnected() ? true : new RedirectCommand(router.parseUrl('/'));
};
