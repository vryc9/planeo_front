import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';

export type ToastVariant = 'success' | 'error';

export interface ToastPayload {
  title: string;
  description: string;
  variant: ToastVariant;
}

export const ToastEvents = eventGroup({
  source: '[Toast]',
  events: {
    show: type<ToastPayload>(),
    hide: type<void>(),
  },
});
