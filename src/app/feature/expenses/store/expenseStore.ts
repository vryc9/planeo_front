import { signalStore, withHooks, withState } from "@ngrx/signals";
import { injectDispatch } from "@ngrx/signals/events";
import { ExpenseAmountByTagsEvents, ExpenseEvents, SortType } from "./expenseEvents";
import { withExpenseEventsHandler } from "./withExpenseFeature";
import { withExpenseReducer } from "./withExpenseReducer";
import { withExpenseComputed } from "./withExpenseComputed";
import { ExpenseAmountByTagDTO, ExpenseDTO, ExpensesByTagsDTO } from "../../../types/generated";
import { ExpensePerMonView } from "../types/ExpensePerMonView";

export type TabType = 'incoming' | 'recurring' | 'processed' | 'tags';


export type ExpenseState = {
  expenses: ExpenseDTO[],
  sortBy: SortType | null,
  sortDirection: SortDirection
  expensePerMonth: ExpensePerMonView[],
  expenseAmountByTags: ExpenseAmountByTagDTO[],
  activeTab: TabType
  expensesByTags: ExpensesByTagsDTO[]
}

export type SortDirection = 'asc' | 'desc';
export const ExpenseStore = signalStore(
  withState<ExpenseState>({ expenses: [], sortBy: 'date', sortDirection: 'desc', expensePerMonth: [], expenseAmountByTags: [], activeTab: 'incoming', expensesByTags: [] }),
  withExpenseEventsHandler(),
  withExpenseReducer(),
  withExpenseComputed(),
  withHooks({
    onInit(_) {
      const dispatch = injectDispatch(ExpenseEvents);
      const dispatchExpenseByTagsEvents = injectDispatch(ExpenseAmountByTagsEvents);
      dispatch.loadExpense();
      dispatchExpenseByTagsEvents.loadExpenseAmountByTags();
    },
  })
)
