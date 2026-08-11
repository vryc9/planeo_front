import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CategoryDTO } from '../../../types/generated/category-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = environment.apiUrl + '/api/category';
  private readonly http = inject(HttpClient);

  createCategory(category: {name : string, icon : string}): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(this.baseUrl, category)
  }

  getAllExpense(): Observable<CategoryDTO[]> {
    return this.http.get<CategoryDTO[]>(this.baseUrl);
  }
}
