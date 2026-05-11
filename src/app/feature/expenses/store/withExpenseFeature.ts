import { ExpensePerMonth } from './../types/expensePerMount';
import { inject } from "@angular/core";
import { signalStoreFeature } from "@ngrx/signals";
import { Events, withEventHandlers } from "@ngrx/signals/events";
import { ExpenseService } from "../services/expense-service.service";
import { ExpenseByTagsEvents, ExpenseEvents, ExpensePerMountEvent } from "./expenseEvents";
import { switchMap, tap } from "rxjs";
import { mapResponse } from "@ngrx/operators";
import { SseEvent } from '../../sse/store/withSseEvent';

export function withExpenseEventsHandler() {
  return signalStoreFeature(
    withEventHandlers(
      () => {
        const events = inject(Events);
        const service = inject(ExpenseService);
        return {
          createExpense$: events.on(ExpenseEvents.createExpense).pipe(
            switchMap(({ payload }) =>
              service.createExpense(payload.expense).pipe(
                mapResponse({
                  next: (expense) => ExpenseEvents.createExpenseSuccess({ expense }),
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
