import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  login(username: string, password: string): Observable<{ accessToken: string, refreshToken : string }> {
    return this.http.post<{ accessToken : string, refreshToken : string }>(`${this.baseUrl}/auth/login`, {
      username,
      password
    });
  }

  getConnectedUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/user/me`);
  }
}
