import { eventGroup } from "@ngrx/signals/events";
import { type } from "@ngrx/signals";
import { Expense } from "../types/expense";

export const ExpenseEvents = eventGroup({
  source: "[Expense] Expense",
  events: {
    createExpense: type<{ expense: Expense }>(),
    createExpenseSuccess: type<{ expense: Expense }>(),
    createExpenseFailure: type<{ error: unknown }>(),
    loadExpense: type<void>(),
    loadExpenseSuccess: type<{ expenses: Expense[] }>(),
    loadExpenseFailure: type<{ error: unknown }>(),
  }
})
