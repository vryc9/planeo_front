import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { InvitationPreviewDTO } from '../../../types/generated';
import { ErrorDetail } from '../../../shared/error/error';

export const InvitationEvents = eventGroup({
  source: '[Register] Invitation',
  events: {
    validateInvitation: type<{ token: string }>(),
    validateInvitationSuccess: type<{ invitation: InvitationPreviewDTO }>(),
    validateInvitationFailure: type<{ error: ErrorDetail }>(),
  },
});

export const RegisterEvents = eventGroup({
  source: '[Register] Register',
  events: {
    register: type<{ token: string; username: string; password: string }>(),
    registerSuccess: type<void>(),
    registerFailure: type<{ error: ErrorDetail }>(),
  },
});
