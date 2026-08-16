import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExpenseAmountByTagDTO, ExpenseCreateRequestDTO, ExpenseDTO, ExpensePerMonthDTO } from '../../../types/generated';
import { ExpenseAmountByCategoryDTO } from '../../../types/generated/expense-amount-by-tag-dto';
import { ExpensesByCategoryDTO } from '../../../types/generated/expenses-by-tags-dto';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly baseUrl = environment.apiUrl + '/api/expense';

  private readonly numberOfMonth: number = 2;

  readonly http = inject(HttpClient);

  createExpense(expense: ExpenseCreateRequestDTO): Observable<ExpenseDTO> {
    return this.http.post<ExpenseDTO>(this.baseUrl, expense)
  }

  getAllExpense(): Observable<ExpenseDTO[]> {
    return this.http.get<ExpenseDTO[]>(this.baseUrl);
  }

  getExpensesForLastMonths(): Observable<ExpenseDTO[]> {
    return this.http.get<ExpenseDTO[]>(`${this.baseUrl}/month/number`, {
      params: { monthCount: this.numberOfMonth }
    })
  }

  delete(expense: ExpenseDTO) {
    return this.http.delete<void>(this.baseUrl, {
      body: expense
    });
  }

  update(expense: ExpenseDTO): Observable<ExpenseDTO> {
    return this.http.put<ExpenseDTO>(this.baseUrl, expense);
  }

  getExpensePerMonth(): Observable<ExpensePerMonthDTO[]> {
    return this.http.get<ExpensePerMonthDTO[]>(`${this.baseUrl}/month`);
  }

  getExpenseAmountByCategories(): Observable<ExpenseAmountByCategoryDTO[]> {
    return this.http.get<ExpenseAmountByTagDTO[]>(`${this.baseUrl}/amount/category`);
  }

  getExpensesByCategory(): Observable<ExpensesByCategoryDTO[]> {
    return this.http.get<ExpensesByCategoryDTO[]>(`${this.baseUrl}/category`)
  }

}
