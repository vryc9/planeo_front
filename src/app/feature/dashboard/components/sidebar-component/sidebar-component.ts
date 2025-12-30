import { MatIconModule } from '@angular/material/icon';
import { Component, computed, Signal, signal, Type, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectDispatch } from '@ngrx/signals/events';
import { DashboardEvents } from '../../store/DashboardEvents';
import { signalState } from '@ngrx/signals';
import { DashboardViewEnum } from '../../enum/DashboardViewEnum';
import { CalendarComponent } from '../../../calendar/calendar-component';
import { ExpenseComponent } from '../../../expenses/expense-component';
import { DashboardStore } from '../../store/DasboardStore';
import { Menu } from '../../types/menu';
@Component({
  selector: 'app-sidebar-component',
  imports: [MatIconModule, CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  readonly dispatch = injectDispatch(DashboardEvents);
  menuItems: WritableSignal<Menu[]> = signal<Menu[]>([
    {
      view: DashboardViewEnum.DASHBOARD,
      isActive: true,
      icon: "space_dashboard"
    },
    {
      view: DashboardViewEnum.CALENDAR,
      isActive: false,
      icon: "calendar_today"
    },
    {
      view:  DashboardViewEnum.EXPENSE,
      isActive: false,
      icon: "euro"
    },
    {
      view:  DashboardViewEnum.INVESTMENT,
      isActive: false,
      icon: "attach_money"
    }
  ]);

  toggleActive(menu: Menu): void {
    this.menuItems.update(currentItems =>
      currentItems.map(item => ({
        ...item,
        isActive: item === menu
      }))
    );
    this.dispatch.openMenu({open : menu.view})
  }
}
