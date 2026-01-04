import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideDispatcher } from '@ngrx/signals/events';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from './feature/auth/interceptor/auth-interceptor.service';
import { AuthStore } from './feature/auth/store/AuthStore';
import { DashboardStore } from './feature/dashboard/store/DasboardStore';
import { CalendarStore } from './feature/calendar/store/calendarStore';
import { ExpenseStore } from './feature/expenses/store/expenseStore';
import { BalanceStore } from './feature/balance/store/balanceStore';

export const appConfig: ApplicationConfig = {
  providers: [
    BalanceStore,
    AuthStore,
    DashboardStore,
    CalendarStore,
    ExpenseStore,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(),
    provideDispatcher(),
    provideHttpClient(
      withInterceptors([authInterceptorInterceptor])
    ),
  ]
};
