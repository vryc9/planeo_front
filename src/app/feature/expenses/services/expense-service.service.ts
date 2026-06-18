import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExpenseAmountByTagDTO, ExpenseCreateRequestDTO, ExpenseDTO, ExpensePerMonthDTO, ExpensesByTagsDTO } from '../../../types/generated';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly baseUrl = environment.apiUrl + '/api/expense';

  readonly http = inject(HttpClient);

  createExpense(expense: ExpenseCreateRequestDTO): Observable<ExpenseDTO> {
    return this.http.post<ExpenseDTO>(this.baseUrl, expense)
  }

  getAllExpense(): Observable<ExpenseDTO[]> {
    return this.http.get<ExpenseDTO[]>(this.baseUrl);
  }

  delete(expense: ExpenseDTO) {
    return this.http.delete<void>(this.baseUrl, {
      body: expense
    });
  }

  getExpensePerMonth() : Observable<ExpensePerMonthDTO[]> {
    return this.http.get<ExpensePerMonthDTO[]>(`${this.baseUrl}/month`);
  }

  getExpenseAmountByTags() : Observable<ExpenseAmountByTagDTO[]>{
    return this.http.get<ExpenseAmountByTagDTO[]>(`${this.baseUrl}/amount`);
  }

  getExpensesByTags () : Observable<ExpensesByTagsDTO[]> {
    return this.http.get<ExpensesByTagsDTO[]>(`${this.baseUrl}/tags`)
  }

}
