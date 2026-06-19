import { signalStoreFeature, type } from "@ngrx/signals";
import { ExpenseState, initialExpenseState } from "./expenseStore";
import { on, withReducer } from "@ngrx/signals/events";
import { ExpenseAmountByTagsEvents, ExpenseByTagsEvents, ExpenseEvents, ExpensePerMountEvent, ExpenseTabEvents } from "./expenseEvents";
import { AuthEvent } from "../../auth/store/AuthEvent";

export function withExpenseReducer() {
  return signalStoreFeature(
    { state: type<ExpenseState>() },
    withReducer(
      on(ExpenseEvents.loadExpenseSuccess, ({ payload }) => ({ expenses: payload.expenses })),
      on(ExpenseTabEvents.changeTab, ({ payload: { tab } }) => ({ activeTab: tab })),
      on(ExpenseAmountByTagsEvents.loadExpenseAmountBytagsSuccess, ({ payload: { expenseAmountByTags } }) => ({ expenseAmountByTags })),
      on(ExpensePerMountEvent.loadExpensePerMonthSuccess, ({ payload }) => ({
        expensePerMonth: payload.expenses.map(item => ({
          ...item, month: new Intl.DateTimeFormat('fr-FR', { month: 'long' })
            .format(new Date(2024, item.month - 1))
        }))
      })),
      on(ExpenseEvents.sortExpense, ({ payload }, state) => {
        const columnClicked = payload.sortType;
        return state.sortBy === columnClicked ? { sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' } : {
          sortBy: columnClicked,
          sortDirection: 'asc'
        }
      }),
      on(ExpenseByTagsEvents.loadExpenseBytagsSuccess, ({ payload: { expensesByTags } }) => ({ expensesByTags })),
      on(AuthEvent.logout, () => initialExpenseState)
    ),
  )
}
