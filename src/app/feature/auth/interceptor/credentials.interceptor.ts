import { HttpInterceptorFn } from '@angular/common/http';

/**
 * BFF pattern: the session lives in an HttpOnly cookie set by the gateway, never in a token
 * held by this app. `withCredentials: true` makes the browser send/accept that cookie on every
 * request (including cross-origin ones, e.g. localhost:4200 -> localhost:8080 in dev).
 */
export const credentialsInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ withCredentials: true }));
