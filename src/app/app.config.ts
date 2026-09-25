import { provideTaiga } from "@taiga-ui/core";
import { ApplicationConfig, inject, LOCALE_ID, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { Events, injectDispatch, provideDispatcher } from '@ngrx/signals/events';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './feature/auth/interceptor/credentials.interceptor';
import { sessionExpiredInterceptor } from './feature/auth/interceptor/session-expired.interceptor';
import { AuthStore } from './feature/auth/store/AuthStore';
import { ExpenseStore } from './feature/expenses/store/expenseStore';
import { BalanceStore } from './feature/balance/store/balanceStore';
import { AccountStore } from './feature/account/store/accountStore';
import { ToastStore } from './shared/toast/store/toastStore';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { BarController, Colors, Legend } from 'chart.js';
import { ErrorStore } from "./shared/error/store/errorStore";
import { errorDetailInterceptor } from "./shared/error/error-detail.interceptor";
import { AuthEvent } from "./feature/auth/store/AuthEvent";
import { firstValueFrom, merge } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    BalanceStore,
    AccountStore,
    ToastStore,
    ErrorStore,
    AuthStore,
    ExpenseStore,
    provideCharts({ registerables: [BarController, Legend, Colors] }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAppInitializer(() => {
      inject(ErrorStore);
      inject(AuthStore);
      const events = inject(Events);
      const dispatch = injectDispatch(AuthEvent);

      // Await the gateway's "who am I" cookie check before the router activates any guarded
      // route, so accessDashboardGuard can read AuthStore synchronously without a race.
      const sessionResolved = firstValueFrom(
        merge(
          events.on(AuthEvent.restoreSessionSuccess),
          events.on(AuthEvent.restoreSessionFailure),
        )
      );
      dispatch.restoreSession();
      return sessionResolved;
    }),
    provideStore(),
    provideDispatcher(),
    provideHttpClient(
      withInterceptors([credentialsInterceptor, errorDetailInterceptor, sessionExpiredInterceptor])
    ), provideCharts(withDefaultRegisterables()),
    provideTaiga(),
  ]
};
