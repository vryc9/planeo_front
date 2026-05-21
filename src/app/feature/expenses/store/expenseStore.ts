import { signalStore, withComputed, withHooks, withProps, withState } from "@ngrx/signals";
import { injectDispatch, on, withReducer } from "@ngrx/signals/events";
import { ExpenseByTagsEvents, ExpenseEvents, SortType } from "./expenseEvents";
import { withExpenseEventsHandler } from "./withExpenseFeature";
import { computed, inject } from "@angular/core";
import { withExpenseReducer } from "./withExpenseReducer";
import { AuthStore } from "../../auth/store/AuthStore";
import { BalanceStore } from "../../balance/store/balanceStore";
import { withExpenseComputed } from "./withExpenseComputed";
import { ExpenseByTagDTO, ExpenseDTO, ExpensePerMonthDTO } from "../../../types/generated";
import { ExpensePerMonView } from "../types/ExpensePerMonView";

export type TabType = 'incoming' | 'recurring' | 'processed' ;


export type ExpenseState = {
  expenses: ExpenseDTO[],
  sortBy: SortType | null,
  sortDirection: SortDirection
  expensePerMonth: ExpensePerMonView[],
  expenseByTags : ExpenseByTagDTO[],
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
