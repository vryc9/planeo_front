import { Component, inject, Inject, input, InputSignal, effect } from '@angular/core';
import { ListExpenseComponent } from "../list-expense-component/list-expense-component";
import { Expense } from '../../types/expense';
import { injectDispatch } from '@ngrx/signals/events';
import { ExpenseEvents } from '../../store/expenseEvents';
import { calendarEvents } from '../../../calendar/store/calendarEvent';
import { CalendarStore } from '../../../calendar/store/calendarStore';

@Component({
  selector: 'app-recuring-expense-component',
  imports: [ListExpenseComponent],
  templateUrl: './recuring-expense-component.html',
  styleUrl: './recuring-expense-component.css',
})
export class RecurringExpenseComponent {
  expenses: InputSignal<Expense[]> = input.required<Expense[]>();
  onglet: InputSignal<string> = input.required<string>();
  readonly dispatch = injectDispatch(calendarEvents)
  readonly store = inject(CalendarStore);

  createRecurringExpense(): void {
    this.dispatch.openExpenseModal({ isRecurring: true });
  }
}
