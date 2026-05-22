import { Component, inject, signal } from '@angular/core';
import { Field, form } from '@angular/forms/signals';
import { injectDispatch } from '@ngrx/signals/events';
import { BalanceCreateEvents, BalanceEvents } from '../../store/balanceEvents';
import { BalanceStore } from '../../store/balanceStore';

@Component({
  selector: 'app-create-balance',
  imports: [Field],
  templateUrl: './create-balance.html',
  styleUrl: './create-balance.css',
})
export class CreateBalance {
  private readonly dispatch = injectDispatch(BalanceCreateEvents);
  private readonly store = inject(BalanceStore);

  balanceFormModel = signal<{currentBalance : number}>({
    currentBalance : 0
  });
  form = form(this.balanceFormModel);

  submit() {
    this.dispatch.createBalance({
      balance : {
        id : 1,
        currentBalance : this.form.currentBalance().value(),
        futureBalance : this.form.currentBalance().value(),
      }
    });
  }
}
