import { Component, input, InputSignal } from '@angular/core';
import { Expense } from '../../../expenses/types/expense';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { injectDispatch } from '@ngrx/signals/events';
import { DashboardEvents } from '../../store/DashboardEvents';
import { DashboardViewEnum } from '../../enum/DashboardViewEnum';

@Component({
  selector: 'app-dashboard-list-expense',
  imports: [MatIconModule, DatePipe],
  templateUrl: './dashboard-list-expense.html',
  styleUrl: './dashboard-list-expense.css',
})
export class DashboardListExpense {
  expenses: InputSignal<Expense[]> = input.required<Expense[]>();
  readonly dispatch = injectDispatch(DashboardEvents);
  readonly DashboardViewEnum: typeof DashboardViewEnum = DashboardViewEnum

  displayExpenseComponent(): void {
    this.dispatch.openMenu({ view: DashboardViewEnum.EXPENSE });
  }
}
