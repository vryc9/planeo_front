import { mapResponse } from '@ngrx/operators';
import { signalStore, withProps, withState } from '@ngrx/signals';
import { ignoreElements, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth-service.service';
import { Events, injectDispatch, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { AuthEvent } from './AuthEvent';
import { User } from '../types/user';
import { Router } from '@angular/router';
import { ExpenseAmountByCategoryEvents, ExpenseEvents } from '../../expenses/store/expenseEvents';
import { AccountService } from '../../account/service/account-service.service';
import { ToastEvents } from '../../../shared/toast/store/toastEvents';

interface AuthState {
  userConnected: User | null
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
    on(AuthEvent.authentificationSuccess, (_) => ({ isLoading: false })),
    on(AuthEvent.getCurrentUserSuccess, ({ payload }) => ({ userConnected: payload.user })),
    on(AuthEvent.logout, () => ({ userConnected: null, isLoading: false })),
  ),
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
                  return AuthEvent.authentificationSuccess({ token: accessToken });
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
        logout$: events.on(AuthEvent.logout).pipe(
          tap(() => tokenService.removeToken()),
          tap(() => router.navigate(['/'], { replaceUrl: true })),
          ignoreElements(),
        ),
      };
    }
  )
)
