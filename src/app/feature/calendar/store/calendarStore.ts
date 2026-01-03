import { signalStore, withHooks, withState } from "@ngrx/signals";
import { Events, injectDispatch, on, withEventHandlers, withReducer } from "@ngrx/signals/events";
import { calendarEvents } from "./calendarEvent";
import { inject } from "@angular/core";
import { tap } from "rxjs";
import {
  MatDialog,
} from '@angular/material/dialog';
import { ModaleExpenseComponent } from "../components/modale-expense-component/modale-expense-component";
import { EventInput } from "@fullcalendar/core/index.js";
import { ExpenseEvents } from "../../expenses/store/expenseEvents";
import { convertExpenseToCalendarItem } from "../util/event-util";
import { ExpenseStore } from "../../expenses/store/expenseStore";

type ExpenseState = {
  expenses: EventInput[];
}

export const CalendarStore = signalStore(
  withState<ExpenseState>({ expenses: [] }),
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
  ),
  withReducer(
    on(ExpenseEvents.loadExpenseSuccess, ({ payload }) => ({ expenses: payload.expenses.map(({ label, date }) => convertExpenseToCalendarItem(label, date)) })),
    on(ExpenseEvents.createExpenseSuccess, ({ payload }, state) => ({
      expenses: [
        ...state.expenses,
        convertExpenseToCalendarItem(payload.expense.label, payload.expense.date)
      ]
    }))
  ),
  withHooks({
    onInit(_) {
      const __ = inject(ExpenseStore);
      const dispatch = injectDispatch(ExpenseEvents);
      dispatch.loadExpense();
    },
  })
)
