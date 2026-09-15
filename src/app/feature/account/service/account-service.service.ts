import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AccountCreateRequestDTO, AccountDTO } from '../../../types/generated';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly baseUrl = environment.apiUrl + '/api/accounts';
  private readonly http = inject(HttpClient);

  getAll(): Observable<AccountDTO[]> {
    return this.http.get<AccountDTO[]>(this.baseUrl);
  }

  create(accounts: AccountCreateRequestDTO[]): Observable<AccountDTO[]> {
    return this.http.post<AccountDTO[]>(this.baseUrl, accounts);
  }
}
