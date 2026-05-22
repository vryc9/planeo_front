import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { injectDispatch } from '@ngrx/signals/events';
import { ExpenseEvents, SortType } from '../../store/expenseEvents';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseDTO } from '../../../../types/generated';
import { TabType } from '../../store/expenseStore';

@Component({
  selector: 'app-list-expense-component',
  imports: [DatePipe, MatIconModule],
  templateUrl: './list-expense-component.html',
  styleUrl: './list-expense-component.css',
})
export class ListExpenseComponent {
  readonly expenses: InputSignal<ExpenseDTO[]> = input.required<ExpenseDTO[]>();
  readonly onglet: InputSignal<TabType> = input.required<TabType>();
  readonly dateColumnlabel: Signal<string> = computed<string>(() => this.onglet() !== "incoming" ? "Date de prélèvement" : "Date")
  readonly dispath = injectDispatch(ExpenseEvents);
  readonly isEmpty : Signal<boolean> = computed<boolean>(() => this.expenses().length === 0)

  sort(sortBy: SortType): void {
    this.dispath.sortExpense({ sortType: sortBy })
  }

  delete(expense: ExpenseDTO): void {
    this.dispath.deleteExpense({ expense })
  }
}
