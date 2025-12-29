import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideDispatcher } from '@ngrx/signals/events';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptorInterceptor } from './feature/auth/interceptor/auth-interceptor.service';
import { AuthStore } from './feature/auth/store/AuthStore';
import { DashboardStore } from './feature/dashboard/store/DasboardStore';

export const appConfig: ApplicationConfig = {
  providers: [
    AuthStore,
    DashboardStore,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore(),
    provideDispatcher(),
       provideHttpClient(
      withInterceptors([authInterceptorInterceptor])
    ),
]
};
