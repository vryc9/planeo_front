import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  constructor() {
  }

  setToken(token: string): void {
    sessionStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }
}
