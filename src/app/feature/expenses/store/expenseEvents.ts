import { eventGroup } from "@ngrx/signals/events";
import { type } from "@ngrx/signals";
import { TabType } from "./expenseStore";
import { ExpenseAmountByTagDTO, ExpenseCreateRequestDTO, ExpenseDTO, ExpensePerMonthDTO, ExpensesByTagsDTO } from "../../../types/generated";
import { emptyProps } from "@ngrx/store";
import { ExpenseByTagDTO } from "../../../types/generated/expense-by-tag-dto";

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

export const ExpenseAmountByTagsEvents = eventGroup({
  source : "[Expense] Expenses amount amount by tags",
  events : {
    loadExpenseAmountByTags : type<void>(),
    loadExpenseAmountBytagsSuccess: type<{ expenseAmountByTags: ExpenseAmountByTagDTO[] }>(),
    loadExpenseAmountByTagsFailure: type<{ error: unknown }>(),
  }
})

export const ExpenseByTagsEvents = eventGroup({
  source : "[Expense] Expenses amount by tags",
  events : {
    loadExpenseByTags : emptyProps(),
    loadExpenseBytagsSuccess: type<{ expensesByTags: ExpensesByTagsDTO[] }>(),
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

export const IncomeModal = eventGroup({
  source : "[Expense] Modale d'entrée d'argent",
  events : {
    openIncomeModal : type<void>()
  }
})
