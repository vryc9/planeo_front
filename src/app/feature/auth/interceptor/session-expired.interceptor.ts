import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

// Calls where a 401 is an expected, non-fatal outcome (bad credentials, no active session yet).
const AUTH_PATHS = ['/auth/login', '/auth/me'];

/**
 * A 401 on any other call means the gateway couldn't resolve or silently refresh the session
 * (e.g. the refresh token itself expired) — send the user back to the login screen. Runs
 * closest to the backend so it sees the raw response before errorDetailInterceptor reshapes it,
 * and rethrows unchanged so that interceptor still runs normally afterwards.
 */
export const sessionExpiredInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: unknown) => {
      const isAuthCall = AUTH_PATHS.some(path => req.url.includes(path));
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthCall) {
        router.navigate(['/'], { replaceUrl: true });
      }
      return throwError(() => error);
    }),
  );
};
