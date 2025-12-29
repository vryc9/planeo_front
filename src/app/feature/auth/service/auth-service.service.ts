import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly URL2: string = 'http://localhost:8080/api/auth/login';

  constructor(private http: HttpClient) {
  }
  login(username: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(this.URL2, {
      username,
      password
    });
  }
}
