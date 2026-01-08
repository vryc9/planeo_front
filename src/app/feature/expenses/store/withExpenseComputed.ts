import { signalStoreFeature, type, withComputed, withProps } from "@ngrx/signals";
import { ExpenseState } from "./expenseStore";
import { computed, inject } from "@angular/core";
import { BalanceStore } from "../../balance/store/balanceStore";
import { ExpenseResume } from "../types/expenseResume";

export function withExpenseComputed() {
  return signalStoreFeature(
    { state: type<ExpenseState>() },
    withProps(() => ({
      balanceStore: inject(BalanceStore)
    })),
    withComputed(({ expenses, sortBy, sortDirection, balanceStore }) => ({
      resumeExpense: computed<ExpenseResume[]>(() => {
        const { currentBalance, futureBalance, pendingExpenses } = balanceStore.balance()!
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
            data: `${pendingExpenses}€`,
            icon: 'money_off',
            title: 'Reste à payer'
          }
        ]
      }),
      sortedExpenses: computed(() => {
        const multiplier: 1 | -1 = sortDirection() === 'asc' ? 1 : -1;
        if (!sortBy()) return [...expenses()];
        return [...expenses()].filter(({ recurring }) => !recurring).toSorted((a, b) => {
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
      })
    })),
  )
}
