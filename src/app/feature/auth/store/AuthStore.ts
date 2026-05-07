import { mapResponse, tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth-service.service';
import { Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { AuthEvent } from './AuthEvent';
import { User } from '../types/user';
import { Router, RoutesRecognized } from '@angular/router';
import { ExpenseEvents } from '../../expenses/store/expenseEvents';
import { SseService } from '../../sse/services/sse-service.service';
import { SseStore } from '../../sse/store/sseStore';
import { BalanceStore } from '../../balance/store/balanceStore';
import { BalanceService } from '../../balance/service/balance-service.service';

interface AuthState {
  userConnected: User | null
  isLoading: boolean,
}
export const AuthStore = signalStore(
  withState<AuthState>({ userConnected: null, isLoading: false }),
  withProps(() => ({
    balanceService : inject(BalanceService),
  })),
  withReducer(
    on(AuthEvent.authentification, (_) => ({ isLoading: true })),
    on(AuthEvent.authentificationSuccess, (_) => ({ isLoading: false })),
    on(AuthEvent.getCurrentUserSuccess, ({ payload }) => ({ userConnected: payload.user }))
  ),
  withEventHandlers(
    ({balanceService}) => {
      const events = inject(Events);
      const service = inject(AuthService);
      const tokenService = inject(TokenService);
      const router = inject(Router)
      const sse = inject(SseStore)

      return {
        authentification$: events.on(AuthEvent.authentification).pipe(
          switchMap(({ payload }) =>
            service.login(payload.username, payload.password).pipe(
              mapResponse({
                next: ({accessToken}) => {
                  console.log("Je suis dans l'authenfication");
                  tokenService.setToken(accessToken);
                  return AuthEvent.authentificationSuccess({ token: accessToken });
                },
                error: (error) =>
                  AuthEvent.authentificationFailure({ error }),
              })
            )
          )
        ),
        redirect$ : events.on(AuthEvent.authentificationSuccess).pipe(
          switchMap(_ =>
            balanceService.balanceIsExistingForUser().pipe(
              mapResponse({
                next : (bool) => bool ? router.navigate(['/dashboard']) : router.navigate(['/balance']),
                error : (e) => console.error(e)
              })
            )
          )
        )
      };
    }
  )
)
