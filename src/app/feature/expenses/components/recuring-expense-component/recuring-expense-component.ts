import { Component, inject, Inject, input, InputSignal, effect } from '@angular/core';
import { ListExpenseComponent } from "../list-expense-component/list-expense-component";
import { injectDispatch } from '@ngrx/signals/events';
import { ExpenseEvents } from '../../store/expenseEvents';
import { calendarEvents } from '../../../calendar/store/calendarEvent';
import { CalendarStore } from '../../../calendar/store/calendarStore';
import { ExpenseDTO } from '../../../../types/generated';
import { TabType } from '../../store/expenseStore';

@Component({
  selector: 'app-recuring-expense-component',
  imports: [ListExpenseComponent],
  templateUrl: './recuring-expense-component.html',
  styleUrl: './recuring-expense-component.css',
})
export class RecurringExpenseComponent {
  expenses: InputSignal<ExpenseDTO[]> = input.required<ExpenseDTO[]>();
  onglet: InputSignal<TabType> = input.required<TabType>();
  readonly dispatch = injectDispatch(calendarEvents)
  readonly store = inject(CalendarStore);

  createRecurringExpense(): void {
    this.dispatch.openExpenseModal({ isRecurring: true });
  }
}
