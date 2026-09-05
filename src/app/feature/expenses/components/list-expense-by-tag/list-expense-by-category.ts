import { Component, computed, input, InputSignal, signal, Signal } from '@angular/core';
import { ExpenseDTO } from '../../../../types/generated';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ExpensesByCategoryDTO } from '../../../../types/generated/expenses-by-tags-dto';
import { ExpensesByCategoryPerMonthDTO } from '../../types/ExpensesByCategoryPerMonthDTO';

export type MonthOption = { value: string; label: string };

function formatMonthLabel(month: string): string {
  const [year, monthIndex] = month.split('-').map(Number);
  const label = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(new Date(year, monthIndex - 1));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

@Component({
  selector: 'app-list-expense-by-category',
  imports: [DatePipe, CurrencyPipe],
  templateUrl: './list-expense-by-category.html',
  styleUrl: './list-expense-by-category.css',
})
export class ListExpenseByCategory {
  readonly expensesbyCategory: InputSignal<ExpensesByCategoryPerMonthDTO[]> = input.required<ExpensesByCategoryPerMonthDTO[]>();

  protected readonly expandedState = signal<Record<number, boolean>>({});
  private readonly manuallySelectedMonth = signal<string | null>(null);

  protected readonly monthOptions: Signal<MonthOption[]> = computed(() =>
    this.expensesbyCategory()
      .map(({ month }) => month)
      .filter((month): month is string => Boolean(month))
      .sort((a, b) => b.localeCompare(a))
      .map(value => ({ value, label: formatMonthLabel(value) }))
  );

  protected readonly selectedMonth: Signal<string | null> = computed(() =>
    this.manuallySelectedMonth() ?? this.monthOptions()[0]?.value ?? null
  );

  protected readonly filteredGroups: Signal<ExpensesByCategoryDTO[]> = computed(() =>
    this.expensesbyCategory().find(({ month }) => month === this.selectedMonth())?.categories ?? []
  );

  protected readonly monthTotal = computed<number>(() =>
    this.filteredGroups().reduce((sum, group) => sum + this.totalAmount(group.expenses), 0)
  );

  selectMonth(month: string): void {
    this.manuallySelectedMonth.set(month);
  }

  protected toggle(categoryId: number): void {
    this.expandedState.update(state => ({
      ...state,
      [categoryId]: !state[categoryId],
    }));
  }

  protected isExpanded(categoryId: number): boolean {
    return this.expandedState()[categoryId] ?? false;
  }

  protected totalAmount(expenses: ExpenseDTO[]): number {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
  }
}
