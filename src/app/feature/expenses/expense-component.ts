import { Component, computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ListExpenseComponent } from "./components/list-expense-component/list-expense-component";
import { ExpenseResumeComponent } from "./components/expense-resume-component/expense-resume-component";
import { ExpenseStore, TabType } from './store/expenseStore';
import { injectDispatch } from '@ngrx/signals/events';
import { calendarEvents } from '../calendar/store/calendarEvent';
import { ExpenseTabEvents } from './store/expenseEvents';
import { Expense } from './types/expense';
import { debouncedSignal } from './utils/debounce';

const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-expense-component',
  imports: [ListExpenseComponent, ExpenseResumeComponent],
  templateUrl: './expense-component.html',
  styleUrl: './expense-component.scss',
})
export class ExpenseComponent {
  readonly store = inject(ExpenseStore);
  private readonly dispatch = injectDispatch(calendarEvents);
  private readonly dispatchTabEvents = injectDispatch(ExpenseTabEvents);

  private readonly searchQuery : WritableSignal<string> = signal('');
  private readonly debouncedQuery  : Signal<string> = debouncedSignal(this.searchQuery, SEARCH_DEBOUNCE_MS, '');

  protected readonly filteredExpenses: Signal<Expense[]> = computed<Expense[]>(() => {
    const query = this.debouncedQuery().toLowerCase().trim();
    const expenses = this.store.expenseToDisplayInTab();
    if (!query) return expenses;
    return expenses.filter(({ label }) => label.toLowerCase().includes(query));
  });

  setTab(tab: TabType): void {
    this.dispatchTabEvents.changeTab({ tab });
  }

  createExpense(): void {
    this.dispatch.openExpenseModal({ isRecurring: this.store.activeTab() === 'recurring' });
  }

  search(query: string): void {
    this.searchQuery.set(query);
  }
}
