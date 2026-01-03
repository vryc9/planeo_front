import { Component, inject } from '@angular/core';
import { ExpenseStore } from '../../store/expenseStore';
import { DatePipe } from '@angular/common';
import { injectDispatch } from '@ngrx/signals/events';
import { ExpenseEvents, SortType } from '../../store/expenseEvents';
import { MatIconModule } from '@angular/material/icon';
import { Expense } from '../../types/expense';

@Component({
  selector: 'app-list-expense-component',
  imports: [DatePipe, MatIconModule],
  templateUrl: './list-expense-component.html',
  styleUrl: './list-expense-component.css',
})
export class ListExpenseComponent {
  readonly store = inject(ExpenseStore);
  readonly dispath = injectDispatch(ExpenseEvents);

  sort(sortBy: SortType): void {
    this.dispath.sortExpense({ sortType: sortBy })
  }

  delete(expense: Expense): void {
    this.dispath.deleteExpense({ expense })
  }
}
