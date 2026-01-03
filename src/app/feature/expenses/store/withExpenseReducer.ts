import { signalStoreFeature, type } from "@ngrx/signals";
import { ExpenseState } from "./expenseStore";
import { on, withReducer } from "@ngrx/signals/events";
import { ExpenseEvents } from "./expenseEvents";

export function withExpenseReducer() {
  return signalStoreFeature(
    { state: type<ExpenseState>() },
    withReducer(
      on(ExpenseEvents.loadExpenseSuccess, ({ payload }) => ({ expenses: payload.expenses })),
      on(ExpenseEvents.sortExpense, ({ payload }, state) => {
        const columnClicked = payload.sortType;
        return state.sortBy === columnClicked ? { sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' } : {
          sortBy: columnClicked,
          sortDirection: 'asc'
        }
      }),
    ),
  )
}
