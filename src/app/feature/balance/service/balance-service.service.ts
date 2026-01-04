import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Balance } from '../types/balance';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private readonly URL : string = 'http://localhost:8080/api/balance'
  readonly http = inject(HttpClient);
  constructor() {
  }

  get() : Observable<Balance> {
    return this.http.get<Balance>(this.URL);
  }

}
