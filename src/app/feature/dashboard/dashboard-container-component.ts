import { Component, computed, inject, Type, } from '@angular/core';
import { AuthStore } from '../auth/store/AuthStore';
import { SidebarComponent } from "./components/sidebar-component/sidebar-component";
import { DashboardStore } from './store/DasboardStore';
import { CalendarComponent } from '../calendar/calendar-component';
import { NgComponentOutlet } from '@angular/common';
import { DashboardViewEnum } from './enum/DashboardViewEnum';
import { ExpenseComponent } from '../expenses/expense-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { InvestmentComponent } from '../investment/investment-component';
import { injectDispatch } from '@ngrx/signals/events';
import { DashboardEvents } from './store/DashboardEvents';
import { AuthEvent } from '../auth/store/AuthEvent';
import { BalanceStore } from '../balance/store/balanceStore';

@Component({
  selector: 'app-dashboard-component',
  imports: [SidebarComponent, NgComponentOutlet],
  templateUrl: './dashboard-container-component.html',
  styleUrl: './dashboard-container-component.css',
})
export class DashboardContainerComponent {
  readonly authStore = inject(AuthStore);
  readonly store = inject(DashboardStore);
  readonly dispatch = injectDispatch(DashboardEvents);
  private readonly balanceStore = inject(BalanceStore);
  private readonly authDispatch = injectDispatch(AuthEvent);

  private readonly components: Record<DashboardViewEnum, Type<unknown>> = {
    [DashboardViewEnum.DASHBOARD]: DashboardComponent,
    [DashboardViewEnum.CALENDAR]: CalendarComponent,
    [DashboardViewEnum.EXPENSE]: ExpenseComponent,
    [DashboardViewEnum.INVESTMENT]: InvestmentComponent
  };
  readonly currentComponent = computed(() => this.components[this.store.currentView()]);

  protected changeView(view: DashboardViewEnum): void {
    this.dispatch.openMenu({ view });
  }

  protected logout(): void {
    this.authDispatch.logout();
  }
}

