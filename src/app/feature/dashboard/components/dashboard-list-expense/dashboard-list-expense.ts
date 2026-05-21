import { Component, input, InputSignal } from '@angular/core';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { injectDispatch } from '@ngrx/signals/events';
import { DashboardEvents } from '../../store/DashboardEvents';
import { DashboardViewEnum } from '../../enum/DashboardViewEnum';
import { ExpenseDTO, Tag } from '../../../../types/generated';

@Component({
  selector: 'app-dashboard-list-expense',
  imports: [MatIconModule, DatePipe, NgClass],
  templateUrl: './dashboard-list-expense.html',
  styleUrl: './dashboard-list-expense.css',
})
export class DashboardListExpense {
  readonly expenses: InputSignal<ExpenseDTO[]> = input.required<ExpenseDTO[]>();
  readonly dispatch = injectDispatch(DashboardEvents);
  readonly DashboardViewEnum: typeof DashboardViewEnum = DashboardViewEnum;

  displayExpenseComponent(): void {
    this.dispatch.openMenu({ view: DashboardViewEnum.EXPENSE });
  }

  tagIcon(tag: Tag): string {
    const icons: Record<Tag, string> = {
      [Tag.SOIREE]: 'nightlife',
      [Tag.RESTAURANT]: 'restaurant',
      [Tag.ANNIVERSAIRE]: 'cake',
      [Tag.CINEMA]: 'movie',
    };
    return icons[tag] ?? 'receipt';
  }
}
