import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { InvitationCreatedDTO } from '../../../types/generated';
import { ErrorDetail } from '../../../shared/error/error';

export const InvitationCreateEvents = eventGroup({
  source: '[Register] Create invitation',
  events: {
    createInvitation: type<{ role: string }>(),
    createInvitationSuccess: type<{ invitation: InvitationCreatedDTO }>(),
    createInvitationFailure: type<{ error: ErrorDetail }>(),
  },
});
