import { signalStore, withComputed, withHooks, withProps, withState } from "@ngrx/signals";
import { injectDispatch, on, withReducer } from "@ngrx/signals/events";
import { ExpenseByTagsEvents, ExpenseEvents, SortType } from "./expenseEvents";
import { withExpenseEventsHandler } from "./withExpenseFeature";
import { Expense } from "../types/expense";
import { computed, inject } from "@angular/core";
import { withExpenseReducer } from "./withExpenseReducer";
import { AuthStore } from "../../auth/store/AuthStore";
import { ExpenseResume } from "../types/expenseResume";
import { BalanceStore } from "../../balance/store/balanceStore";
import { withExpenseComputed } from "./withExpenseComputed";
import { ExpensePerMonthView as ExpensePerMonthView } from "../types/expensePerMount";
import { ExpenseByTags } from "../types/expenseByTags";

export type TabType = 'incoming' | 'recurring' | 'processed' ;


export type ExpenseState = {
  expenses: Expense[],
  sortBy: SortType | null,
  sortDirection: SortDirection
  expensePerMonth: ExpensePerMonthView[],
  expenseByTags : ExpenseByTags[],
  activeTab : TabType
}

export type SortDirection = 'asc' | 'desc';
export const ExpenseStore = signalStore(
  withState<ExpenseState>({ expenses: [], sortBy: 'date', sortDirection: 'desc', expensePerMonth: [], expenseByTags : [], activeTab : 'incoming'}),
  withExpenseEventsHandler(),
  withExpenseReducer(),
  withExpenseComputed(),
  withHooks({
    onInit(_) {
      const dispatch = injectDispatch(ExpenseEvents);
      const dispatchExpenseByTagsEvents = injectDispatch(ExpenseByTagsEvents);
      dispatch.loadExpense();
      dispatchExpenseByTagsEvents.loadExpenseByTags();
    },
  })
)
