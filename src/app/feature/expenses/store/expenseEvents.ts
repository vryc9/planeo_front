import { eventGroup } from "@ngrx/signals/events";
import { Expense } from "../types/expense";
import { type } from "@ngrx/signals";

export const ExpenseEvents = eventGroup({
  source: "[Expense] Expense",
  events: {
    createExpense: type<{ expense: Expense }>(),
    createExpenseSuccess : type<{expense : Expense}>(),
    createExpenseFailure : type<{error : unknown}>()
  }
})
