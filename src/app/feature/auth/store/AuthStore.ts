import { mapResponse } from '@ngrx/operators';
import { signalStore, withComputed, withProps, withState } from '@ngrx/signals';
import { ignoreElements, map, switchMap, tap } from 'rxjs';
import { computed, inject } from '@angular/core';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth-service.service';
import { Events, injectDispatch, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { AuthEvent } from './AuthEvent';
import { User } from '../types/user';
import { Router } from '@angular/router';
import { ExpenseAmountByCategoryEvents, ExpenseEvents } from '../../expenses/store/expenseEvents';
import { AccountService } from '../../account/service/account-service.service';
import { ToastEvents } from '../../../shared/toast/store/toastEvents';
import { JwtPayload } from 'jwt-decode';

export interface UserConnected {
  username: string,
  role: string
}

interface AuthState {
  userConnected: UserConnected | null
  isLoading: boolean,
}


export const AuthStore = signalStore(
  withState<AuthState>({ userConnected: null, isLoading: false }),
  withProps(() => ({
    accountService: inject(AccountService),
    toastDispatcher: injectDispatch(ToastEvents),
    expenseDispatch: injectDispatch(ExpenseEvents),
    tagsDispatch: injectDispatch(ExpenseAmountByCategoryEvents)
  })),
  withReducer(
    on(AuthEvent.authentification, (_) => ({ isLoading: true })),
    on(AuthEvent.authentificationSuccess, ({ payload: { userConnected } }) => ({ isLoading: false, userConnected })),
    on(AuthEvent.logout, () => ({ userConnected: null, isLoading: false })),
    on(AuthEvent.restoreSessionSuccess, ({ payload: { userConnected } }) => ({ userConnected })),
    on(AuthEvent.restoreSessionFailure, () => ({ userConnected: null })),
  ),
  withComputed(({ userConnected }) => {
    return {
      isAdmin: computed<boolean>(() => userConnected()?.role === "ADMIN")
    }
  }),
  withEventHandlers(
    ({ accountService, expenseDispatch, tagsDispatch }) => {
      const events = inject(Events);
      const service = inject(AuthService);
      const tokenService = inject(TokenService);
      const router = inject(Router)
      return {
        authentification$: events.on(AuthEvent.authentification).pipe(
          switchMap(({ payload }) =>
            service.login(payload.username, payload.password).pipe(
              mapResponse({
                next: ({ accessToken }) => {
                  tokenService.setToken(accessToken);
                  const userConnected: UserConnected = tokenService.getCurrentUser() as UserConnected;
                  return userConnected
                    ? AuthEvent.authentificationSuccess({ token: accessToken, userConnected })
                    : AuthEvent.authentificationFailure({ error: 'Invalid token' });
                },
                error: (error) => AuthEvent.authentificationFailure({ error }),
              })
            )
          )
        ),
        redirect$: events.on(AuthEvent.authentificationSuccess).pipe(
          tap(() => {
            expenseDispatch.loadExpense()
            tagsDispatch.loadExpenseAmountByCategory()
          }),
          switchMap(_ =>
            accountService.exist().pipe(
              mapResponse({
                next: (hasAccount) => hasAccount ? router.navigate(['/dashboard']) : router.navigate(['/balance']),
                error: (e) => console.error(e)
              })
            )
          )
        ),
        restoreSession$: events.on(AuthEvent.restoreSession).pipe(
          map(() => {
            const userConnected = tokenService.getCurrentUser();
            return userConnected ? AuthEvent.restoreSessionSuccess({ userConnected }) : AuthEvent.restoreSessionFailure();
          }),
        ),
        logout$: events.on(AuthEvent.logout).pipe(
          tap(() => tokenService.removeToken()),
          tap(() => router.navigate(['/'], { replaceUrl: true })),
          ignoreElements(),
        ),
      };
    }
  )
)
