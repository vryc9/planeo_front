import { Component, computed, inject, signal, Signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { injectDispatch } from '@ngrx/signals/events';
import { DecimalPipe } from '@angular/common';
import { AccountAddEvents } from '../../store/accountEvents';
import { BANKS, Bank } from '../../../../shared/banks/banks.data';
import { BalanceStore } from '../../../balance/store/balanceStore';
import { AccountCreateRequestDTO } from '../../../../types/generated';

interface AccountEntry {
  bank: Bank;
  label: string;
  amount: number;
}

@Component({
  selector: 'app-modale-account-component',
  imports: [MatDialogModule, DecimalPipe],
  templateUrl: './modale-account-component.html',
  styleUrl: './modale-account-component.css',
})
export class ModaleAccountComponent {
  protected readonly dialogRef = inject(MatDialogRef<ModaleAccountComponent>);
  private readonly dispatch = injectDispatch(AccountAddEvents);
  private readonly balanceStore = inject(BalanceStore);

  protected readonly bankSearch = signal('');
  protected readonly entries = signal<AccountEntry[]>([]);

  protected readonly filteredBanks: Signal<readonly Bank[]> = computed(() => {
    const query = this.bankSearch().toLowerCase().trim();
    if (!query) {
      return BANKS;
    }
    return BANKS.filter((bank) => bank.name.toLowerCase().includes(query));
  });

  protected readonly currentBalance: Signal<number> = computed(
    () => this.balanceStore.balance()?.currentBalance ?? 0,
  );

  private readonly hasEmptyLabel: Signal<boolean> = computed(() =>
    this.entries().some((entry) => !entry.label.trim()),
  );

  protected readonly canSubmit: Signal<boolean> = computed(
    () => this.entries().length > 0 && !this.hasEmptyLabel(),
  );

  protected onSearch(query: string): void {
    this.bankSearch.set(query);
  }

  protected isBankSelected(bank: Bank): boolean {
    return this.entries().some((entry) => entry.bank.name === bank.name);
  }

  protected toggleBank(bank: Bank): void {
    if (this.isBankSelected(bank)) {
      this.entries.update((list) => list.filter((entry) => entry.bank.name !== bank.name));
      return;
    }
    this.entries.update((list) => [...list, { bank, label: bank.name, amount: 0 }]);
  }

  protected updateLabel(index: number, value: string): void {
    this.entries.update((list) =>
      list.map((entry, i) => (i === index ? { ...entry, label: value } : entry)),
    );
  }

  protected updateAmount(index: number, value: string): void {
    const amount = parseFloat(value.replace(',', '.'));
    this.entries.update((list) =>
      list.map((entry, i) => (i === index ? { ...entry, amount: isNaN(amount) ? 0 : amount } : entry)),
    );
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.canSubmit()) {
      return;
    }

    const accounts: AccountCreateRequestDTO[] = this.entries().map((entry) => ({
      label: entry.label.trim(),
      amount: entry.amount,
      logo: entry.bank.logo,
    }));

    this.dispatch.addAccount({ accounts });
    this.dialogRef.close();
  }
}
