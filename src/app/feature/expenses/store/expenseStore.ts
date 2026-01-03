import { signalStore, withComputed, withHooks, withProps, withState } from "@ngrx/signals";
import { injectDispatch, on, withReducer } from "@ngrx/signals/events";
import { ExpenseEvents, SortType } from "./expenseEvents";
import { withExpenseEventsHandler } from "./withExpenseFeature";
import { Expense } from "../types/expense";
import { computed, inject } from "@angular/core";
import { withExpenseReducer } from "./withExpenseReducer";
import { AuthStore } from "../../auth/store/AuthStore";
import { ExpenseResume } from "../types/expenseResume";

export type ExpenseState = {
  expenses: Expense[],
  sortBy: SortType | null,
  sortDirection: SortDirection
}

export type SortDirection = 'asc' | 'desc';
export const ExpenseStore = signalStore(
  withState<ExpenseState>({ expenses: [], sortBy: 'date', sortDirection: 'desc' }),
  withProps(() => ({
    authStore: inject(AuthStore)
  })),
  withExpenseEventsHandler(),
  withExpenseReducer(),
  withComputed(({ expenses, sortBy, sortDirection, authStore }) => ({
    resumeExpense: computed<ExpenseResume[]>(() => {
      const { currentBalance, futureBalance } = authStore.userConnected()?.balance!
      const countExpense: number = expenses().length;
      return [
        {
          data: countExpense,
          title: "Dépense à venir",
          icon: 'money'
        },
        {
          data: 0,
          title: "Dépense récurrente",
          icon: 'autorenew'
        },
        {
          data: currentBalance,
          icon: 'account_balance',
          title: 'Solde actuel'
        },
        {
          data: futureBalance,
          icon: 'money_off',
          title: 'Solde à venir'
        }
      ]
    }),
    sortedExpenses: computed(() => {
      const multiplier: 1 | -1 = sortDirection() === 'asc' ? 1 : -1;
      if (!sortBy()) return [...expenses()];
      return [...expenses()].toSorted((a, b) => {
        switch (sortBy()) {
          case 'amount':
            return (a.amount - b.amount) * multiplier;
          case 'date':
            return (new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier;
          case 'label':
            return a.label.localeCompare(b.label) * multiplier;
          default:
            return 0;
        }
      });
    })
  })),
  withHooks({
    onInit(_) {
      const dispatch = injectDispatch(ExpenseEvents);
      dispatch.loadExpense();
    },
  })
)
