import { eventGroup } from "@ngrx/signals/events";
import { type } from "@ngrx/signals";
import { Expense } from "../types/expense";

export type SortType = "date" | 'amount' | 'label'
export const ExpenseEvents = eventGroup({
  source: "[Expense] Expense",
  events: {
    createExpense: type<{ expense: Expense }>(),
    createExpenseSuccess: type<{ expense: Expense }>(),
    createExpenseFailure: type<{ error: unknown }>(),
    loadExpense: type<void>(),
    loadExpenseSuccess: type<{ expenses: Expense[] }>(),
    loadExpenseFailure: type<{ error: unknown }>(),
    sortExpense: type<{ sortType: SortType }>(),
    deleteExpense: type<{ expense: Expense }>(),
    deleteExpenseSuccess: type<void>(),
    deleteExpenseFailure: type<{ error: unknown }>(),
  },
})
