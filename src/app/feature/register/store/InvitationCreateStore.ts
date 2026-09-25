import { inject } from '@angular/core';
import { signalStore, withState } from '@ngrx/signals';
import { Events, injectDispatch, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { mapResponse } from '@ngrx/operators';
import { switchMap } from 'rxjs';
import { RegisterService } from '../service/register-service.service';
import { InvitationCreateEvents } from './InvitationCreateEvent';
import { ErrorEvents } from '../../../shared/error/store/error-events';
import { ErrorDetail } from '../../../shared/error/error';
import { ToastEvents } from '../../../shared/toast/store/toastEvents';

interface InvitationCreateState {
  isCreating: boolean;
}

export const InvitationCreateStore = signalStore(
  withState<InvitationCreateState>({ isCreating: false }),
  withReducer(
    on(InvitationCreateEvents.createInvitation, () => ({ isCreating: true })),
    on(InvitationCreateEvents.createInvitationSuccess, () => ({ isCreating: false })),
    on(InvitationCreateEvents.createInvitationFailure, () => ({ isCreating: false })),
  ),
  withEventHandlers(() => {
    const events = inject(Events);
    const service = inject(RegisterService);
    const toast = injectDispatch(ToastEvents);
    const errorDispatch = injectDispatch(ErrorEvents);
    return {
      createInvitation$: events.on(InvitationCreateEvents.createInvitation).pipe(
        switchMap(({ payload }) =>
          service.createInvitation(payload.role).pipe(
            mapResponse({
              next: (invitation) => {
                navigator.clipboard.writeText(invitation.registrationLink).catch(() => {});
                toast.show({
                  title: 'Invitation créée',
                  description: 'Le lien a été copié dans le presse-papiers',
                  variant: 'success',
                });
                return InvitationCreateEvents.createInvitationSuccess({ invitation });
              },
              error: (error: ErrorDetail) => {
                errorDispatch.error({ error });
                return InvitationCreateEvents.createInvitationFailure({ error });
              },
            }),
          ),
        ),
      ),
    };
  }),
);
