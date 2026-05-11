import { Component, inject, signal } from '@angular/core';
import { ListExpenseComponent } from "./components/list-expense-component/list-expense-component";
import { ExpenseResumeComponent } from "./components/expense-resume-component/expense-resume-component";
import { ExpenseStore } from './store/expenseStore';
import { injectDispatch } from '@ngrx/signals/events';
import { calendarEvents } from '../calendar/store/calendarEvent';

type TabType = 'incoming' | 'recurring' | 'processed' ;

@Component({
  selector: 'app-expense-component',
  imports: [ListExpenseComponent, ExpenseResumeComponent],
  templateUrl: './expense-component.html',
  styleUrl: './expense-component.scss',
})
export class ExpenseComponent {
  readonly store = inject(ExpenseStore);
  private readonly dispatch = injectDispatch(calendarEvents);
  readonly activeTab = signal<TabType>('incoming');

  setTab(tab: TabType): void {
    this.activeTab.set(tab);
  }

  createExpense(): void {
    this.dispatch.openExpenseModal({ isRecurring: this.activeTab() === 'recurring' });
  }
}
