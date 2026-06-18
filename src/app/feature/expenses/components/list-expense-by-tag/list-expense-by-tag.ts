import { Component, input, InputSignal, signal } from '@angular/core';
import { ExpenseDTO, ExpensesByTagsDTO } from '../../../../types/generated';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-list-expense-by-tag',
  imports: [DatePipe],
  templateUrl: './list-expense-by-tag.html',
  styleUrl: './list-expense-by-tag.css',
})
export class ListExpenseByTag {
  readonly expensesbyTags: InputSignal<ExpensesByTagsDTO[]> = input.required<ExpensesByTagsDTO[]>();

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
