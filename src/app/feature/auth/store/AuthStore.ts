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

interface AuthState {
  userConnected: User | null
  isLoading: boolean,
}
export const AuthStore = signalStore(
  withState<AuthState>({ userConnected: null, isLoading: false }),
  withReducer(
    on(AuthEvent.authentification, (_) => ({ isLoading: true })),
    on(AuthEvent.authentificationSuccess, (_) => ({ isLoading: false })),
    on(AuthEvent.getCurrentUserSuccess, ({ payload }) => ({ userConnected: payload.user }))
  ),
  withEventHandlers(
    () => {
      const events = inject(Events);
      const service = inject(AuthService);
      const tokenService = inject(TokenService);
      const router = inject(Router)
      return {
        authentification$: events.on(AuthEvent.authentification).pipe(
          switchMap(({ payload }) =>
            service.login(payload.username, payload.password).pipe(
              mapResponse({
                next: (response) => {
                  tokenService.setToken(response.token);
                  return AuthEvent.authentificationSuccess({ token: response.token });
                },
                error: (error) =>
                  AuthEvent.authentificationFailure({ error }),
              })
            )
          )
        ),
        getCurrentUser$: events.on(AuthEvent.authentificationSuccess).pipe(
          switchMap(() => service.getConnectedUser().pipe(
            mapResponse({
              next: (user) => {
                router.navigate(['dashboard']);
                return AuthEvent.getCurrentUserSuccess({ user })
              },
              error: (error) => AuthEvent.authentificationFailure({ error })
            })
          ))
        )
      };
    }
  )
)
