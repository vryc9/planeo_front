import { signalStore } from "@ngrx/signals";
import { Events, on, withEventHandlers, withReducer } from "@ngrx/signals/events";
import { calendarEvents } from "./calendarEvent";
import { inject } from "@angular/core";
import { tap } from "rxjs";
import {
  MatDialog,
} from '@angular/material/dialog';
import { ModaleExpenseComponent } from "../components/modale-expense-component/modale-expense-component";

export const CalendarStore = signalStore(
  withEventHandlers(
    () => {
      const events = inject(Events);
      const dialog = inject(MatDialog)
      return {
        openModale$: events.on(calendarEvents.openExpenseModal).pipe(
          tap(({ payload }) => dialog.open(ModaleExpenseComponent,
            {
              data: {
                date: payload.startStr
              }
            }
          ))
        ),
      };
    }
  )
)
