import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Expense } from '../types/expense';
import { Observable } from 'rxjs';
import { ExpensePerMonth } from '../types/expensePerMount';
import { environment } from '../../../../environments/environment';
import { ExpenseByTags } from '../types/expenseByTags';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
    private readonly baseUrl = environment.apiUrl + '/api/expense';

  readonly http = inject(HttpClient);

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.baseUrl, expense)
  }

  getAllExpense(): Observable<Expense[]> {
    return this.http.get<Expense[]>(this.baseUrl);
  }

  delete(expense: Expense) {
    return this.http.delete<void>(this.baseUrl, {
      body: expense
    });
  }

  getExpensePerMonth() : Observable<ExpensePerMonth[]> {
    return this.http.get<ExpensePerMonth[]>(`${this.baseUrl}/month`);
  }

  getExpenseByTags() : Observable<ExpenseByTags[]>{
    return this.http.get<ExpenseByTags[]>(`${this.baseUrl}/tags`);
  }

}
