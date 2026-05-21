import { eventGroup } from "@ngrx/signals/events";
import { type } from "@ngrx/signals";
import { TabType } from "./expenseStore";
import { ExpenseByTagDTO, ExpenseCreateRequestDTO, ExpenseDTO, ExpensePerMonthDTO } from "../../../types/generated";

export type SortType = "date" | 'amount' | 'label'
export const ExpenseEvents = eventGroup({
  source: "[Expense] Expense",
  events: {
    createExpense: type<{ expense: ExpenseCreateRequestDTO }>(),
    createExpenseSuccess: type<{ expense: ExpenseDTO }>(),
    createExpenseFailure: type<{ error: unknown }>(),
    loadExpense: type<void>(),
    loadExpenseSuccess: type<{ expenses: ExpenseDTO[] }>(),
    loadExpenseFailure: type<{ error: unknown }>(),
    sortExpense: type<{ sortType: SortType }>(),
    deleteExpense: type<{ expense: ExpenseDTO }>(),
    deleteExpenseSuccess: type<void>(),
    deleteExpenseFailure: type<{ error: unknown }>(),
  },
})

export const ExpenseByTagsEvents = eventGroup({
  source : "[Expense] Expenses by tags",
  events : {
    loadExpenseByTags : type<void>(),
    loadExpenseBytagsSuccess: type<{ expenseByTags: ExpenseByTagDTO[] }>(),
    loadExpenseByTagsFailure: type<{ error: unknown }>(),
  }
})

export const ExpensePerMountEvent = eventGroup({
  source: "[Expense] Expense per mount source",
  events: {
    loadExpensePerMonth: type<void>(),
    loadExpensePerMonthSuccess: type<{ expenses: ExpensePerMonthDTO[] }>(),
    loadExpensePerMonthFailure: type<{ error: unknown }>(),
  },
})

export const ExpenseTabEvents = eventGroup({
  source : "[Expense] Changement de tab",
  events : {
    changeTab : type<{tab : TabType}>()
  }
})
