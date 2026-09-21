import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { signalStore, withState } from '@ngrx/signals';
import { Events, injectDispatch, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { RegisterService } from '../service/register-service.service';
import { InvitationEvents, RegisterEvents } from './RegisterEvent';
import { InvitationPreviewDTO } from '../../../types/generated';
import { ErrorDetail } from '../../../shared/error/error';
import { ToastEvents } from '../../../shared/toast/store/toastEvents';

type InvitationStatus = 'idle' | 'loading' | 'valid' | 'invalid';

interface RegisterState {
  invitation: InvitationPreviewDTO | null;
  invitationStatus: InvitationStatus;
  invitationError: string | null;
  isSubmitting: boolean;
  registerError: string | null;
}

export const RegisterStore = signalStore(
  withState<RegisterState>({
    invitation: null,
    invitationStatus: 'idle',
    invitationError: null,
    isSubmitting: false,
    registerError: null,
  }),
  withReducer(
    on(InvitationEvents.validateInvitation, () => ({
      invitationStatus: 'loading' as const,
      invitationError: null,
    })),
    on(InvitationEvents.validateInvitationSuccess, ({ payload }) => ({
      invitationStatus: 'valid' as const,
      invitation: payload.invitation,
    })),
    on(InvitationEvents.validateInvitationFailure, ({ payload }) => ({
      invitationStatus: 'invalid' as const,
      invitationError: payload.error.detail,
    })),
    on(RegisterEvents.register, () => ({ isSubmitting: true, registerError: null })),
    on(RegisterEvents.registerSuccess, () => ({ isSubmitting: false })),
    on(RegisterEvents.registerFailure, ({ payload }) => ({
      isSubmitting: false,
      registerError: payload.error.detail,
    })),
  ),
  withEventHandlers(() => {
    const events = inject(Events);
    const service = inject(RegisterService);
    const router = inject(Router);
    const toast = injectDispatch(ToastEvents);
    return {
      validateInvitation$: events.on(InvitationEvents.validateInvitation).pipe(
        switchMap(({ payload }) =>
          service.validateInvitation(payload.token).pipe(
            mapResponse({
              next: (invitation) => InvitationEvents.validateInvitationSuccess({ invitation }),
              error: (error: ErrorDetail) => InvitationEvents.validateInvitationFailure({ error }),
            }),
          ),
        ),
      ),
      register$: events.on(RegisterEvents.register).pipe(
        switchMap(({ payload }) =>
          service.register(payload).pipe(
            mapResponse({
              next: () => {
                toast.show({
                  title: 'Compte créé',
                  description: 'Vous pouvez maintenant vous connecter',
                  variant: 'success',
                });
                router.navigate(['/'], { replaceUrl: true });
                return RegisterEvents.registerSuccess();
              },
              error: (error: ErrorDetail) => RegisterEvents.registerFailure({ error }),
            }),
          ),
        ),
      ),
    };
  }),
);
