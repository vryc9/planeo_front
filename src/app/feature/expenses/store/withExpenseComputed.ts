import { signalStoreFeature, type, withComputed, withLinkedState, withProps } from "@ngrx/signals";
import { ExpenseState, TabType } from "./expenseStore";
import { computed, inject, linkedSignal } from "@angular/core";
import { BalanceStore } from "../../balance/store/balanceStore";
import { ExpenseResume } from "../types/expenseResume";
import { ExpenseDTO, ExpenseStatus } from "../../../types/generated";

export function withExpenseComputed() {
  return signalStoreFeature(
    { state: type<ExpenseState>() },
    withProps(() => ({
      balanceStore: inject(BalanceStore)
    })),
    withComputed(({ expenses, sortBy, sortDirection, balanceStore }) => ({
      resumeExpense: computed<ExpenseResume[]>(() => {
        const { currentBalance, futureBalance, pendingExpense } = balanceStore.balance() ?? {}
        const expenseFilterByPending: ExpenseDTO[] = [...expenses()].filter(({ status }) => status === ExpenseStatus.PENDING)
        const countExpense: number = expenseFilterByPending.length;
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
            data: `${currentBalance}€`,
            icon: 'account_balance',
            title: 'Solde actuel'
          },
          {
            data: `${futureBalance}€`,
            icon: 'money_off',
            title: 'Solde à venir'
          },
          {
            data: `${pendingExpense}€`,
            icon: 'money_off',
            title: 'Reste à payer'
          }
        ]
      }),
      sortedExpenses: computed(() => {
        const multiplier: 1 | -1 = sortDirection() === 'asc' ? 1 : -1;
        if (!sortBy()) return [...expenses()];
        return [...expenses()].filter(({ recurring, status }) => !recurring && status == ExpenseStatus.PENDING).toSorted((a, b) => {
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
      }),
      sortedRecurringExpenses: computed(() => {
        const multiplier: 1 | -1 = sortDirection() === 'asc' ? 1 : -1;
        if (!sortBy()) return [...expenses()];
        return [...expenses()].filter(({ recurring }) => recurring).toSorted((a, b) => {
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
      }),
      filterExpenseByProcessingStatus: computed(() => {
        const multiplier: 1 | -1 = sortDirection() === 'asc' ? 1 : -1;
        if (!sortBy()) return [...expenses()];
        return [...expenses()].filter(({ recurring, status }) => !recurring && status == ExpenseStatus.PROCESSED).toSorted((a, b) => {
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
      }),
    })),
    withLinkedState(({ activeTab, sortedExpenses, filterExpenseByProcessingStatus, sortedRecurringExpenses }) => ({
      expenseToDisplayInTab: linkedSignal<TabType, ExpenseDTO[]>({
        source: activeTab,
        computation: (tab) => ({
          incoming: sortedExpenses(),
          processed: filterExpenseByProcessingStatus(),
          recurring: sortedRecurringExpenses(),
        })[tab],
      }),
    }))
  )
}
