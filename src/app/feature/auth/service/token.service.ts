import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserConnected } from '../store/AuthStore';

export interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  setToken(token: string): void {
    sessionStorage.setItem('access_token', token);
  }

  getToken(): string | null {
    return sessionStorage.getItem('access_token');
  }

  removeToken(): void {
    sessionStorage.removeItem('access_token');
  }

  getCurrentUser(): UserConnected | null {
  const token = this.getToken(); // ta méthode existante
  if (!token) return null;

  try {
    const payload = jwtDecode<JwtPayload>(token);
    return { username: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}
}
