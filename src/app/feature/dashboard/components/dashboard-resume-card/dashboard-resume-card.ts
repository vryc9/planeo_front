import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { ExpenseResume } from '../../../expenses/types/expenseResume';
import { AccountDTO } from '../../../../types/generated';

// Single-hue teal ramp (brand hue ~175°), darkest → lightest, validated against
// the card's white surface with the dataviz skill's ordinal checks (monotone
// lightness, >=0.06 adjacent step, >=2:1 light-end contrast).
const SEGMENT_COLORS = ['#1b6962', '#248a80', '#2caa9e', '#35cabd'];
const MAX_VISIBLE_ACCOUNTS = 3;

interface AccountBreakdownItem {
  id: number;
  label: string;
  amount: number;
  percent: number;
  color: string;
}

@Component({
  selector: 'app-dashboard-resume-card',
  imports: [MatIconModule, DecimalPipe],
  templateUrl: './dashboard-resume-card.html',
  styleUrl: './dashboard-resume-card.css',
})
export class DashboardResumeCard {
  expenseResume: InputSignal<ExpenseResume> = input.required<ExpenseResume>();
  accounts: InputSignal<AccountDTO[] | undefined> = input<AccountDTO[] | undefined>(undefined);

  private readonly sortedAccounts: Signal<AccountDTO[]> = computed(() =>
    (this.accounts() ?? []).slice().sort((a, b) => b.amount - a.amount),
  );

  private readonly totalPositive: Signal<number> = computed(() =>
    this.sortedAccounts().reduce((sum, account) => sum + Math.max(account.amount, 0), 0),
  );

  private readonly breakdown: Signal<AccountBreakdownItem[]> = computed(() => {
    const total = this.totalPositive();
    return this.sortedAccounts().map((account, index) => ({
      id: account.id,
      label: account.label,
      amount: account.amount,
      percent: account.amount > 0 && total > 0 ? (account.amount / total) * 100 : 0,
      color: SEGMENT_COLORS[Math.min(index, SEGMENT_COLORS.length - 1)],
    }));
  });

  readonly visibleAccounts: Signal<AccountBreakdownItem[]> = computed(() =>
    this.breakdown().slice(0, MAX_VISIBLE_ACCOUNTS),
  );

  readonly barSegments: Signal<AccountBreakdownItem[]> = computed(() =>
    this.breakdown().filter(segment => segment.percent > 0),
  );

  readonly hiddenAccountCount: Signal<number> = computed(() =>
    Math.max(this.sortedAccounts().length - MAX_VISIBLE_ACCOUNTS, 0),
  );
}
