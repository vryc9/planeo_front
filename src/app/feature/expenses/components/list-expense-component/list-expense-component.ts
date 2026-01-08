import { Component, computed, input, InputSignal, Signal } from '@angular/core';
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
  readonly expenses: InputSignal<Expense[]> = input.required<Expense[]>();
  readonly onglet: InputSignal<string> = input.required<string>();
  readonly dateColumnlabel: Signal<string> = computed<string>(() => this.onglet() !== "incomingExpense" ? "Date de prélèvement" : "Date")
  readonly dispath = injectDispatch(ExpenseEvents);

  sort(sortBy: SortType): void {
    this.dispath.sortExpense({ sortType: sortBy })
  }

  delete(expense: Expense): void {
    this.dispath.deleteExpense({ expense })
  }
}
