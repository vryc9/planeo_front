// core/http/error-detail.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export type ErrorDetail = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  timestamp: string;
};

function isErrorDetail(value: unknown): value is ErrorDetail {
  return (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    'detail' in value &&
    'status' in value
  );
}

export const errorDetailInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && isErrorDetail(error.error)) {
        return throwError(() => error.error);
      }

      const fallback: ErrorDetail = {
        type: 'about:blank',
        title: error instanceof HttpErrorResponse && error.status === 0
          ? 'Connexion impossible'
          : 'Erreur inattendue',
        status: error instanceof HttpErrorResponse ? error.status : 0,
        detail: error instanceof HttpErrorResponse && error.status === 0
          ? 'Le serveur est injoignable, vérifiez votre connexion'
          : 'Une erreur est survenue, merci de réessayer',
        instance: req.url,
        timestamp: new Date().toISOString(),
      };
      return throwError(() => fallback);
    }),
  );
