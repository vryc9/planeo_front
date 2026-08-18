import { provideTaiga } from "@taiga-ui/core";
import { ApplicationConfig, inject, LOCALE_ID, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideDispatcher } from '@ngrx/signals/events';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from './feature/auth/interceptor/auth-interceptor.service';
import { AuthStore } from './feature/auth/store/AuthStore';
import { ExpenseStore } from './feature/expenses/store/expenseStore';
import { BalanceStore } from './feature/balance/store/balanceStore';
import { ToastStore } from './shared/toast/store/toastStore';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BarController, Colors, Legend } from 'chart.js';
import { ErrorStore } from "./shared/error/store/errorStore";
import { errorDetailInterceptor } from "./shared/error/error-detail.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    BalanceStore,
    ToastStore,
    ErrorStore,
    AuthStore,
    ExpenseStore,
    provideCharts({ registerables: [BarController, Legend, Colors] }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
      inject(ErrorStore);
    }),
    provideStore(),
    provideDispatcher(),
    provideHttpClient(
      withInterceptors([authInterceptorInterceptor, errorDetailInterceptor])
    ), provideCharts(withDefaultRegisterables()),
    provideTaiga(),
  ]
};
