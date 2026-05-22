import { Component, inject, Inject, signal } from '@angular/core';
import { Field, form, min, required, submit } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { injectDispatch } from '@ngrx/signals/events';
import { BalanceUpdateEvents } from '../../../balance/store/balanceEvents';
import { BalanceStore } from '../../../balance/store/balanceStore';

interface IncomeFormData {
  amount: number;
}

@Component({
  selector: 'app-modale-income',
  imports: [MatDialogModule, Field, MatInputModule],
  templateUrl: './modale-income-component.html',
  styleUrl: './modale-income-component.css',
})
export class ModaleIncomeComponent {
  readonly dialogRef = inject(MatDialogRef<ModaleIncomeComponent>);
  readonly dispatch = injectDispatch(BalanceUpdateEvents);
  private readonly dispatchUpdateEvents = injectDispatch(BalanceUpdateEvents)
  private readonly store = inject(BalanceStore);

  incomeModel = signal<IncomeFormData>({ amount: 0 });

  form = form(this.incomeModel, (schemaPath) => {
    required(schemaPath.amount, { message: 'Le montant est obligatoire' });
    min(schemaPath.amount, 0.01, { message: 'Le montant doit être supérieur à 0' });
  });

  constructor(@Inject(MAT_DIALOG_DATA) _data: unknown) { }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      const { amount } = this.incomeModel();
      this.dispatchUpdateEvents.addIncome({amount})
    });
    this.dialogRef.close();
  }
}
