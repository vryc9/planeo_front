import { eventGroup } from "@ngrx/signals/events";
import { type } from "@ngrx/signals";
import { TabType } from "./expenseStore";
import { ExpenseCreateRequestDTO, ExpenseDTO, ExpensePerMonthDTO } from "../../../types/generated";
import { emptyProps } from "@ngrx/store";
import { ExpenseAmountByCategoryDTO } from "../../../types/generated/expense-amount-by-tag-dto";
import { ExpensesByCategoryDTO } from "../../../types/generated/expenses-by-tags-dto";

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
    loadExpenseForLastMonths : type<void>(),
    loadExpenseForLastMonthsSuccess: type<{ expenses: ExpenseDTO[] }>(),
    loadExpenseForLastMonthsFailure: type<{ error: unknown }>(),
  },
})

export const ExpenseAmountByCategoryEvents = eventGroup({
  source : "[Expense] Expenses amount amount by tags",
  events : {
    loadExpenseAmountByCategory : type<void>(),
    loadExpenseAmountByCategorySuccess: type<{ expenseAmountByCategory: ExpenseAmountByCategoryDTO[] }>(),
    loadExpenseAmountByCategoryFailure: type<{ error: unknown }>(),
  }
})

export const ExpenseByCategoryEvents = eventGroup({
  source : "[Expense] Expenses amount by category",
  events : {
    loadExpenseByCategory : emptyProps(),
    loadExpenseByCategorySuccess: type<{ expensesByCategory: ExpensesByCategoryDTO[] }>(),
    loadExpenseByCategoryFailure: type<{ error: unknown }>(),
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
