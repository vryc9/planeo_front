import { signalStore, withProps, withState } from "@ngrx/signals";
import { Events, withEventHandlers } from "@ngrx/signals/events";
import { inject } from "@angular/core";
import { ErrorEvents } from "./error-events";
import { tap } from "rxjs";
import { ErrorDialogService } from "../components/error-dialog.service";


export const ErrorStore = signalStore(
  withProps(() => ({
    events: inject(Events),
    errorDialog: inject(ErrorDialogService)
  })),
  withEventHandlers(({ events, errorDialog }) => {
    return {
      displayError: events.on(ErrorEvents.error).pipe(
        tap(({ payload }) => errorDialog.show({ title: payload.error.title, detail: payload.error.detail }))
      )
    }
  }),
);
