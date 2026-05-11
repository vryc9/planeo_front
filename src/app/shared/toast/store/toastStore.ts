import { inject } from '@angular/core';
import { signalStore, withState } from '@ngrx/signals';
import { Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { map, switchMap, timer } from 'rxjs';
import { ToastEvents, ToastVariant } from './toastEvents';

export type ToastState = {
  visible: boolean;
  title: string;
  description: string;
  variant: ToastVariant;
};

const TOAST_DURATION_MS = 3500;

export const ToastStore = signalStore(
  withState<ToastState>({
    visible: false,
    title: '',
    description: '',
    variant: 'success',
  }),
  withReducer(
    on(ToastEvents.show, ({ payload }) => ({
      visible: true,
      title: payload.title,
      description: payload.description,
      variant: payload.variant,
    })),
    on(ToastEvents.hide, () => ({ visible: false })),
  ),
  withEventHandlers(() => {
    const events = inject(Events);
    return {
      autoHide$: events.on(ToastEvents.show).pipe(
        switchMap(() => timer(TOAST_DURATION_MS).pipe(map(() => ToastEvents.hide()))),
      ),
    };
  }),
);
