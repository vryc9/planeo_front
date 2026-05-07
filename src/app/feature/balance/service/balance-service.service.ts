import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Balance } from '../types/balance';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private readonly baseUrl = environment.apiUrl + '/api/balance';

  readonly http = inject(HttpClient);
  constructor() {
  }

  get() : Observable<Balance> {
    return this.http.get<Balance>(this.baseUrl);
  }

  balanceIsExistingForUser() : Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + '/exist');
  }

  create(balance : Balance) : Observable<Balance>{
    return this.http.post<Balance>(this.baseUrl, balance);
  }

}
