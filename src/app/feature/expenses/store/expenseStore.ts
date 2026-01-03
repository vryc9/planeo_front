import { inject } from "@angular/core";
import { signalStore, withState } from "@ngrx/signals";
import { Events, on, withEventHandlers, withReducer } from "@ngrx/signals/events";
import { ExpenseService } from "../services/expense-service.service";
import { ExpenseEvents } from "./expenseEvents";
import { switchMap } from "rxjs";
import { mapResponse } from "@ngrx/operators";
import { withExpenseFeature } from "./withExpenseFeature";
import { Expense } from "../types/expense";


type ExpenseType = {
  expenses: Expense[]
}

export const ExpenseStore = signalStore(
  withState<ExpenseType>({ expenses: [] }),
  withExpenseFeature(),
  withReducer(
    on(ExpenseEvents.loadExpenseSuccess, ({ payload }) => ({ expenses: payload.expenses }))
  )
)
