import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { BalanceDTO, BalanceResponseDTO } from '../../../types/generated';

@Injectable({
  providedIn: 'root',
})
export class BalanceService {
  private readonly baseUrl = environment.apiUrl + '/api/balance';

  readonly http = inject(HttpClient);
  constructor() {
  }

  get() : Observable<BalanceResponseDTO> {
    return this.http.get<BalanceResponseDTO>(this.baseUrl);
  }

  balanceIsExistingForUser() : Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + '/exist');
  }

  create(balance : BalanceDTO) : Observable<BalanceResponseDTO>{
    return this.http.post<BalanceResponseDTO>(this.baseUrl, balance);
  }

}
