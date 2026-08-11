import { Component, computed, effect, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ListExpenseComponent } from "./components/list-expense-component/list-expense-component";
import { ExpenseResumeComponent } from "./components/expense-resume-component/expense-resume-component";
import { ExpenseStore, TabType } from './store/expenseStore';
import { injectDispatch } from '@ngrx/signals/events';
import { calendarEvents } from '../calendar/store/calendarEvent';
import { ExpenseTabEvents, IncomeModal } from './store/expenseEvents';
import { debouncedSignal } from './utils/debounce';
import { ExpenseDTO, ExpensesByTagsDTO } from '../../types/generated';
import { ListExpenseByCategory } from './components/list-expense-by-tag/list-expense-by-category';

const SEARCH_DEBOUNCE_MS = 300;

@Component({
  selector: 'app-expense-component',
  imports: [ListExpenseComponent, ExpenseResumeComponent, ListExpenseByCategory],
  templateUrl: './expense-component.html',
  styleUrl: './expense-component.scss',
})
export class ExpenseComponent {
  readonly store = inject(ExpenseStore);
  private readonly dispatch = injectDispatch(calendarEvents);
  private readonly dispatchTabEvents = injectDispatch(ExpenseTabEvents);
  private readonly dispatchIncomEvents = injectDispatch(IncomeModal)

  protected readonly onglet = this.store.activeTab;
  private readonly searchQuery: WritableSignal<string> = signal('');
  private readonly debouncedQuery: Signal<string> = debouncedSignal(this.searchQuery, SEARCH_DEBOUNCE_MS, '');


  protected readonly filteredDTOExpenses = computed<ExpenseDTO[]>(() => {
    const query = this.debouncedQuery()?.toLowerCase().trim() ?? '';
    const expenses = this.store.expenseDTOList();
    return query ? expenses.filter(({ label }) => label.toLowerCase().includes(query)) : expenses;
  });

  setTab(tab: TabType): void {
    this.dispatchTabEvents.changeTab({ tab });
  }

  private isExpenseList(expenses: ExpenseDTO[] | ExpensesByTagsDTO[]): expenses is ExpenseDTO[] {
    return expenses.length === 0 || 'label' in expenses[0];
  }

  createExpense(): void {
    this.dispatch.openExpenseModal({ isRecurring: this.store.activeTab() === 'recurring' });
  }

  openIncomeModal(): void {
    this.dispatchIncomEvents.openIncomeModal();
  }

  search(query: string): void {
    this.searchQuery.set(query);
  }
}
