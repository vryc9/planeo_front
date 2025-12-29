import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly URL2: string = 'http://localhost:8080/api/auth/login';
  private readonly URL_USER : string = 'http://localhost:8080/api/user/me'

  constructor(private http: HttpClient) {
  }
  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.URL2, {
      username,
      password
    });
  }

  getConnectedUser() : Observable<User> {
    return this.http.get<User>(this.URL_USER);
  }


}
