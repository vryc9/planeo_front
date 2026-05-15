import { eventGroup } from "@ngrx/signals/events";
import { type } from "@ngrx/signals";
import { Expense } from "../types/expense";
import { ExpensePerMonth } from "../types/expensePerMount";
import { ExpenseByTags } from "../types/expenseByTags";
import { TabType } from "./expenseStore";

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

export const ExpenseByTagsEvents = eventGroup({
  source : "[Expense] Expenses by tags",
  events : {
    loadExpenseByTags : type<void>(),
    loadExpenseBytagsSuccess: type<{ expenseByTags: ExpenseByTags[] }>(),
    loadExpenseByTagsFailure: type<{ error: unknown }>(),
  }
})

export const ExpensePerMountEvent = eventGroup({
  source: "[Expense] Expense per mount source",
  events: {
    loadExpensePerMonth: type<void>(),
    loadExpensePerMonthSuccess: type<{ expenses: ExpensePerMonth[] }>(),
    loadExpensePerMonthFailure: type<{ error: unknown }>(),
  },
})

export const ExpenseTabEvents = eventGroup({
  source : "[Expense] Changement de tab",
  events : {
    changeTab : type<{tab : TabType}>()
  }
})
