import { Component, computed, inject, signal, Signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DecimalPipe } from '@angular/common';
import { injectDispatch } from '@ngrx/signals/events';
import { AccountStore } from '../../store/accountStore';
import { AccountTransferEvents } from '../../store/accountEvents';
import { AccountDTO } from '../../../../types/generated';

@Component({
  selector: 'app-modale-transfer-component',
  imports: [MatDialogModule, DecimalPipe],
  templateUrl: './modale-transfer-component.html',
  styleUrl: './modale-transfer-component.css',
})
export class ModaleTransferComponent {
  protected readonly dialogRef = inject(MatDialogRef<ModaleTransferComponent>);
  private readonly accountStore = inject(AccountStore);
  private readonly dispatch = injectDispatch(AccountTransferEvents);

  protected readonly accounts: Signal<AccountDTO[]> = this.accountStore.accounts;

  protected readonly originId = signal<number | null>(null);
  protected readonly targetId = signal<number | null>(null);
  protected readonly amount = signal(0);

  protected readonly originAccount: Signal<AccountDTO | undefined> = computed(() =>
    this.accounts().find((account) => account.id === this.originId()),
  );

  protected readonly targetAccount: Signal<AccountDTO | undefined> = computed(() =>
    this.accounts().find((account) => account.id === this.targetId()),
  );

  protected readonly exceedsBalance: Signal<boolean> = computed(() => {
    const origin = this.originAccount();
    return !!origin && this.amount() > origin.amount;
  });

  protected readonly canSubmit: Signal<boolean> = computed(
    () =>
      this.originId() !== null &&
      this.targetId() !== null &&
      this.originId() !== this.targetId() &&
      this.amount() > 0 &&
      !this.exceedsBalance(),
  );

  protected selectOrigin(account: AccountDTO): void {
    this.originId.set(account.id);
    if (this.targetId() === account.id) {
      this.targetId.set(null);
    }
  }

  protected selectTarget(account: AccountDTO): void {
    this.targetId.set(account.id);
    if (this.originId() === account.id) {
      this.originId.set(null);
    }
  }

  protected updateAmount(value: string): void {
    const parsed = parseFloat(value.replace(',', '.'));
    this.amount.set(isNaN(parsed) ? 0 : parsed);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    const origin = this.originAccount();
    const target = this.targetAccount();
    if (!this.canSubmit() || !origin || !target) {
      return;
    }

    this.dispatch.transfer({
      accountOriginId: origin.id,
      accountOriginLabel: origin.label,
      accountTargetId: target.id,
      accountTargetLabel: target.label,
      amount: this.amount(),
    });
    this.dialogRef.close();
  }
}
