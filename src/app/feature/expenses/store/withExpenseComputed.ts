import { computed, inject } from "@angular/core";
import {
  signalStoreFeature,
  type,
  withComputed,
  withProps,
} from "@ngrx/signals";
import { ExpenseState, TabType } from "./expenseStore";
import { BalanceStore } from "../../balance/store/balanceStore";
import { ExpenseResume } from "../types/expenseResume";
import { ExpenseDTO, ExpenseStatus } from "../../../types/generated";
import { ExpensesByCategoryDTO } from "../../../types/generated/expenses-by-tags-dto";

type SortKey = 'amount' | 'date' | 'label';
type SortDirection = 'asc' | 'desc';

function sortExpenses(
  expenses: ExpenseDTO[],
  sortBy: SortKey | null,
  direction: SortDirection
): ExpenseDTO[] {
  if (!sortBy) return [...expenses];
  const multiplier: 1 | -1 = direction === 'asc' ? 1 : -1;
  return [...expenses].toSorted((a, b) => {
    switch (sortBy) {
      case 'amount': return (a.amount - b.amount) * multiplier;
      case 'date': return (new Date(a.date).getTime() - new Date(b.date).getTime()) * multiplier;
      case 'label': return a.label.localeCompare(b.label) * multiplier;
    }
  });
}

export function withExpenseComputed() {
  return signalStoreFeature(
    { state: type<ExpenseState>() },

    withProps(() => ({
      _balanceStore: inject(BalanceStore),
    })),

    withComputed(({ expenses, sortBy, sortDirection, activeTab, expensesByCategory, _balanceStore }) => {
      const groupedExpenses = computed(() => {
        const groups = Object.groupBy(expenses(), ({ recurring, status }) => {
          if (recurring) return 'recurring';
          return status === ExpenseStatus.PENDING ? 'pending' : 'processed';
        });
        return {
          pending: groups.pending ?? [],
          processed: groups.processed ?? [],
          recurring: groups.recurring ?? [],
        };
      });

      const sortedPending = computed(() => sortExpenses(groupedExpenses().pending, sortBy(), sortDirection()));
      const sortedProcessed = computed(() => sortExpenses(groupedExpenses().processed, sortBy(), sortDirection()));
      const sortedRecurring = computed(() => sortExpenses(groupedExpenses().recurring, sortBy(), sortDirection()));

      const resumeExpense = computed<ExpenseResume[]>(() => {
        const balance = _balanceStore.balance();
        const pendingCount = groupedExpenses().pending.length;

        if (!balance) {
          return [
            { data: pendingCount, title: 'Dépense à venir', icon: 'money' },
            { data: 0, title: 'Dépense récurrente', icon: 'autorenew' },
          ];
        }

        const { currentBalance, futureBalance, pendingExpense } = balance;
        return [
          { data: pendingCount, title: 'Dépense à venir', icon: 'money' },
          { data: 0, title: 'Dépense récurrente', icon: 'autorenew' },
          { data: `${currentBalance}€`, title: 'Solde actuel', icon: 'account_balance' },
          ...(futureBalance !== currentBalance
            ? [{ data: `${futureBalance}€`, title: 'Solde à venir', icon: 'money_off' }]
            : []),
          { data: `${pendingExpense}€`, title: 'Reste à payer', icon: 'money_off' },
        ];
      });

      const expenseDTOList = computed(() => {
        const map: Record<TabType, ExpenseDTO[]> = {
          incoming: sortedPending(),
          processed: sortedProcessed(),
          recurring: sortedRecurring(),
          category: [],
        };
        return map[activeTab()];
      });

      const expensesByCategoryList = computed(() =>
        activeTab() === 'category' ? expensesByCategory() : []
      );

      return {
        resumeExpense,
        sortedExpenses: sortedPending,
        sortedRecurringExpenses: sortedRecurring,
        filterExpenseByProcessingStatus: sortedProcessed,
        expenseDTOList,
        expensesByCategoryList,
      };
    }),
  );
}
