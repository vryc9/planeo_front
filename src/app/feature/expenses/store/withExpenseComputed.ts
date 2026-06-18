import { computed, inject, linkedSignal } from "@angular/core";
import {
  signalStoreFeature,
  type,
  withComputed,
  withLinkedState,
  withProps,
} from "@ngrx/signals";
import { ExpenseState, TabType } from "./expenseStore"; // ← TabType ajouté
import { BalanceStore } from "../../balance/store/balanceStore";
import { ExpenseResume } from "../types/expenseResume";
import { ExpenseDTO, ExpensesByTagsDTO, ExpenseStatus } from "../../../types/generated";

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

type TabSource = {
  tab: TabType;
  pending: ExpenseDTO[];
  processed: ExpenseDTO[];
  recurring: ExpenseDTO[];
};

export function withExpenseComputed() {
  return signalStoreFeature(
    { state: type<ExpenseState>() },

    withProps(() => ({
      _balanceStore: inject(BalanceStore),
    })),

    withComputed(({ expenses, sortBy, sortDirection, activeTab, expensesByTags, _balanceStore }) => {
      const pendingExpenses = computed(() =>
        expenses().filter(({ recurring, status }) =>
          !recurring && status === ExpenseStatus.PENDING
        )
      );
      const processedExpenses = computed(() =>
        expenses().filter(({ recurring, status }) =>
          !recurring && status === ExpenseStatus.PROCESSED
        )
      );
      const recurringExpenses = computed(() =>
        expenses().filter(({ recurring }) => recurring)
      );

      const sortedPending = computed(() => sortExpenses(pendingExpenses(), sortBy(), sortDirection()));
      const sortedProcessed = computed(() => sortExpenses(processedExpenses(), sortBy(), sortDirection()));
      const sortedRecurring = computed(() => sortExpenses(recurringExpenses(), sortBy(), sortDirection()));

      const resumeExpense = computed<ExpenseResume[]>(() => {
        const balance = _balanceStore.balance();
        const pendingCount = pendingExpenses().length;

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

      const expenseDTOList = computed<ExpenseDTO[]>(() => {
        const map: Record<Exclude<TabType, 'tags'>, ExpenseDTO[]> = {
          incoming: sortedPending(),
          processed: sortedProcessed(),
          recurring: sortedRecurring(),
        };
        return map[activeTab() as Exclude<TabType, 'tags'>] ?? [];
      });

      const expensesByTagList = computed<ExpensesByTagsDTO[]>(() =>
        activeTab() === 'tags' ? expensesByTags() : []
      );

      return {
        resumeExpense,
        sortedExpenses: sortedPending,
        sortedRecurringExpenses: sortedRecurring,
        filterExpenseByProcessingStatus: sortedProcessed,
        expenseDTOList,
        expensesByTagList,
      };
    }),

  );
}
