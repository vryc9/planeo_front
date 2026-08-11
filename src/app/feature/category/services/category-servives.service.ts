import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ExpenseAmountByTagDTO, ExpenseCreateRequestDTO, ExpenseDTO, ExpensePerMonthDTO, ExpensesByTagsDTO } from '../../../types/generated';
import { CategoryDTO } from '../../../types/generated/category-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = environment.apiUrl + '/api/category';
  private readonly http = inject(HttpClient);

  /* createExpense(expense: ExpenseCreateRequestDTO): Observable<ExpenseDTO> {
    return this.http.post<ExpenseDTO>(this.baseUrl, expense)
  } */

  getAllExpense(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(this.baseUrl);
  }
}
