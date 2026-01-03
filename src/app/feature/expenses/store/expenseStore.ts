import { signalStore, withHooks, withState } from "@ngrx/signals";
import { injectDispatch, on, withReducer } from "@ngrx/signals/events";
import { ExpenseEvents } from "./expenseEvents";
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
  ),
  withHooks({
    onInit(_) {
      const dispatch = injectDispatch(ExpenseEvents);
      dispatch.loadExpense();
    },
  })
)
