import { Component, input, InputSignal, signal } from '@angular/core';
import { ExpenseDTO } from '../../../../types/generated';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ExpensesByCategoryDTO } from '../../../../types/generated/expenses-by-tags-dto';


@Component({
  selector: 'app-list-expense-by-category',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './list-expense-by-category.html',
  styleUrl: './list-expense-by-category.css',
})
export class ListExpenseByCategory {
  readonly expensesbyCategory: InputSignal<ExpensesByCategoryDTO[]> = input.required<ExpensesByCategoryDTO[]>();

  protected readonly expandedState = signal<Record<number, boolean>>({});

  protected toggle(index: number): void {
    this.expandedState.update(state => ({
      ...state,
      [index]: !state[index],
    }));
  }

  protected isExpanded(index: number): boolean {
    return this.expandedState()[index] ?? false;
  }

  protected totalAmount(expenses: ExpenseDTO[]): number {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }
}
