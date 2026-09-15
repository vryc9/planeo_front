import { Component, computed, inject, Inject, Signal, signal, WritableSignal } from '@angular/core';
import { FormField, form, min, required, submit } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { injectDispatch } from '@ngrx/signals/events';
import { BalanceUpdateEvents } from '../../../balance/store/balanceEvents';
import { BalanceStore } from '../../../balance/store/balanceStore';
import { AccountStore } from '../../../account/store/accountStore';
import { AccountDTO } from '../../../../types/generated';

interface IncomeFormData {
  amount: number;
  account: AccountDTO | null;
}

@Component({
  selector: 'app-modale-income',
  imports: [MatDialogModule, FormField, MatInputModule, FormField],
  templateUrl: './modale-income-component.html',
  styleUrl: './modale-income-component.css',
})
export class ModaleIncomeComponent {
  readonly dialogRef = inject(MatDialogRef<ModaleIncomeComponent>);
  readonly dispatch = injectDispatch(BalanceUpdateEvents);
  private readonly dispatchUpdateEvents = injectDispatch(BalanceUpdateEvents)
  private readonly store = inject(BalanceStore);
  protected readonly accountStore = inject(AccountStore);

  incomeModel = signal<IncomeFormData>({ amount: 0, account: null });

  form = form(this.incomeModel, (schemaPath) => {
    required(schemaPath.amount, { message: 'Le montant est obligatoire' });
    min(schemaPath.amount, 0.01, { message: 'Le montant doit être supérieur à 0' });
    required(schemaPath.account, { message: 'Le compte est obligatoire' });
  });

  protected readonly accountOption: Signal<{ id: number; label: string; logo: string }[]> = computed(() =>
    this.accountStore.accounts().map(({ id, label, logo }) => ({ id, label, logo })),
  );

  isAccountOpen: WritableSignal<boolean> = signal<boolean>(false);
  selectedAccountLabel: WritableSignal<string> = signal<string>('Sélection un compte');
  selectedAccountLogo: WritableSignal<string | null> = signal<string | null>(null);

  constructor(@Inject(MAT_DIALOG_DATA) _data: unknown) { }

  toggleAccountDropdown(): void {
    this.isAccountOpen.update(b => !b);
  }

  selectAccountOption(accountId: number, label: string, logo: string): void {
    const selectedAccount: AccountDTO = this.accountStore.accounts().find(({ id }) => id === accountId)!;
    this.form.account().value.set(selectedAccount);
    this.selectedAccountLabel.set(label);
    this.selectedAccountLogo.set(logo);
    this.isAccountOpen.set(false);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      const { amount, account } = this.incomeModel();
      this.dispatchUpdateEvents.addIncome({ amount, accountId: account!.id })
    });
    this.dialogRef.close();
  }
}
