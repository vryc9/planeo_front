import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from '@angular/core';
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
import { SseStore } from './feature/sse/store/sseStore';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BarController, Colors, Legend } from 'chart.js';

export const appConfig: ApplicationConfig = {
  providers: [
    BalanceStore,
    SseStore,
    AuthStore,
    DashboardStore,
    CalendarStore,
    ExpenseStore,
    provideCharts({ registerables: [BarController, Legend, Colors] }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(),
    provideDispatcher(),
    provideHttpClient(
      withInterceptors([authInterceptorInterceptor])
    ), provideCharts(withDefaultRegisterables()),
  ]
};
