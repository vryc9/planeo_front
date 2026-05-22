import { inject } from "@angular/core";
import { signalStoreFeature, withProps } from "@ngrx/signals";
import { Events, injectDispatch, withEventHandlers } from "@ngrx/signals/events";
import { ExpenseService } from "../services/expense-service.service";
import { ExpenseByTagsEvents, ExpenseEvents, ExpensePerMountEvent } from "./expenseEvents";
import { switchMap, tap } from "rxjs";
import { mapResponse } from "@ngrx/operators";
import { SseEvent } from '../../sse/store/withSseEvent';
import { ToastEvents } from '../../../shared/toast/store/toastEvents';

export function withExpenseEventsHandler() {
  return signalStoreFeature(
    withProps(() => ({
      toast: injectDispatch(ToastEvents),
      events: inject(Events),
      service: inject(ExpenseService),
    })),
    withEventHandlers(
      ({ toast, events, service }) => {
        return {
          createExpense$: events.on(ExpenseEvents.createExpense).pipe(
            switchMap(({ payload }) =>
              service.createExpense(payload.expense).pipe(
                mapResponse({
                  next: (expense) => {
                    toast.show({ description: "La dépense a bien été créée", title: "Creation de la dépense", variant: "success" })
                    return ExpenseEvents.createExpenseSuccess({ expense })
                  },
                  error: (error) =>
                    ExpenseEvents.createExpenseFailure({ error }),
                })
              )
            )
          ),
          loadExpense$: events.on(
            ExpenseEvents.loadExpense,
            ExpenseEvents.deleteExpenseSuccess,
            SseEvent.subscribeSucces,
            ExpenseEvents.createExpenseSuccess)
            .pipe(
              switchMap(_ =>
                service.getAllExpense().pipe(
                  mapResponse({
                    next: (expenses) => ExpenseEvents.loadExpenseSuccess({ expenses }),
                    error: (error) =>
                      ExpenseEvents.loadExpenseFailure({ error }),
                  })
                )
              )
            ),
          loadExpensePerMount$: events.on(
            ExpensePerMountEvent.loadExpensePerMonth)
            .pipe(
              tap(() => console.log("Je suis la")
              ),
              switchMap(_ =>
                service.getExpensePerMonth().pipe(
                  mapResponse({
                    next: (expenses) => ExpensePerMountEvent.loadExpensePerMonthSuccess({ expenses }),
                    error: (error) =>
                      ExpenseEvents.loadExpenseFailure({ error }),
                  })
                )
              )
            ),
          loadExpenseByTags$: events.on(ExpensePerMountEvent.loadExpensePerMonth)
            .pipe(
              switchMap(_ =>
                service.getExpenseByTags().pipe(
                  mapResponse({
                    next: (expenseByTags) => ExpenseByTagsEvents.loadExpenseBytagsSuccess({ expenseByTags }),
                    error: (error) => ExpenseByTagsEvents.loadExpenseByTagsFailure({ error }),
                  })
                )
              )
            ),
          deleteExpense$: events.on(ExpenseEvents.deleteExpense).pipe(
            switchMap(({ payload }) =>
              service.delete(payload.expense).pipe(
                mapResponse({
                  next: (_) => ExpenseEvents.deleteExpenseSuccess(),
                  error: (error) =>
                    ExpenseEvents.deleteExpenseFailure({ error }),
                })
              )
            )
          ),
        };
      }
    )
  )
}
