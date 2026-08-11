import { signalStore, withHooks, withState } from "@ngrx/signals";
import { injectDispatch } from "@ngrx/signals/events";
import { ExpenseAmountByCategoryEvents, ExpenseEvents, SortType } from "./expenseEvents";
import { withExpenseEventsHandler } from "./withExpenseFeature";
import { withExpenseReducer } from "./withExpenseReducer";
import { withExpenseComputed } from "./withExpenseComputed";
import { ExpenseDTO } from "../../../types/generated";
import { ExpensePerMonView } from "../types/ExpensePerMonView";
import { ExpensesByCategoryDTO } from "../../../types/generated/expenses-by-tags-dto";
import { ExpenseAmountByCategoryDTO } from "../../../types/generated/expense-amount-by-tag-dto";

export type TabType = 'incoming' | 'recurring' | 'processed' | 'category';


export type ExpenseState = {
  expenses: ExpenseDTO[],
  sortBy: SortType | null,
  sortDirection: SortDirection
  expensePerMonth: ExpensePerMonView[],
  expenseAmountByCategory: ExpenseAmountByCategoryDTO[],
  activeTab: TabType
  expensesByCategory: ExpensesByCategoryDTO[]
}

export const initialExpenseState: ExpenseState = {
  expenses: [], sortBy: 'date', sortDirection: 'desc',
  expensePerMonth: [], expenseAmountByCategory: [], activeTab: 'incoming', expensesByCategory: []
};

export type SortDirection = 'asc' | 'desc';
export const ExpenseStore = signalStore(
  withState<ExpenseState>(initialExpenseState),
  withExpenseEventsHandler(),
  withExpenseReducer(),
  withExpenseComputed(),
  withHooks({
    onInit(_) {
      const dispatch = injectDispatch(ExpenseEvents);
      const dispatchExpenseByTagsEvents = injectDispatch(ExpenseAmountByCategoryEvents);
      dispatch.loadExpense();
      dispatchExpenseByTagsEvents.loadExpenseAmountByCategory();
    },
  })
)
