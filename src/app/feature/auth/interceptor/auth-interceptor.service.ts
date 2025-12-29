import { HttpContextToken, HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs';
import { inject } from '@angular/core';
import { TokenService } from '../service/token.service';


export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(TokenService);
  const token = authService.getToken();
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }
  return next(req);
};
