import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserConnected } from '../store/AuthStore';

/**
 * Talks only to the gateway's /auth/* endpoints. The JWT never reaches the browser: the
 * gateway sets an opaque HttpOnly session cookie and every call below relies on it being sent
 * automatically (see the credentials interceptor) rather than on any token held here.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  login(username: string, password: string): Observable<UserConnected> {
    return this.http.post<UserConnected>(`${this.baseUrl}/auth/login`, {
      username,
      password
    });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {});
  }

  me(): Observable<UserConnected> {
    return this.http.get<UserConnected>(`${this.baseUrl}/auth/me`);
  }
}
