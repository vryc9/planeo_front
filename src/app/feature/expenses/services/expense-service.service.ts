import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Expense } from '../types/expense';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly URL: string = 'http://localhost:8080/api/expense'
  readonly http = inject(HttpClient);

  createExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(this.URL, expense)
  }
}
