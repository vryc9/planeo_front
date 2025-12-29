import { mapResponse, tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { withEntities } from '@ngrx/signals/entities';
import { Login } from '../types/login';
import { TokenService } from '../service/token.service';
import { AuthService } from '../service/auth-service.service';
import { Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { AuthEvent } from './AuthEvent';

interface AuthState {
  token : string,
  isLoading: boolean,
}

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState<AuthState>({ token: '', isLoading: false },
  ),
  withReducer(
    on(AuthEvent.authentification, (state) => ({ ...state, isLoading: true })),
    on(AuthEvent.authentificationSuccess, (state, { token }) => ({ ...state, token, isLoading: false })),
    on(AuthEvent.authentificationFailure, (state) => ({ ...state, isLoading: false }))
  ),
  withEventHandlers(
    (_, {on} = inject(Events), service = inject(AuthService), tokenService = inject(TokenService), router = inject(Router)) => ({
      authentification$: on(AuthEvent.authentification).pipe(
        switchMap(({payload}) => service.login(payload.username, payload.password).pipe(
          mapResponse({
            next: (response) => {
              tokenService.setToken(response.token);
              router.navigate(['/dashboard']);
              return AuthEvent.authentificationSuccess({token: response.token});
            },
            error: (error) => AuthEvent.authentificationFailure({error}),
          })
        ))
      ),
    })
  )
)
