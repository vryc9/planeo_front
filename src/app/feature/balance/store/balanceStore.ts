import { Events, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { Balance } from './../types/balance';
import { signalStore, withState } from "@ngrx/signals";
import { inject } from '@angular/core';
import { BalanceService } from '../service/balance-service.service';
import { switchMap } from 'rxjs';
import { BalanceEvents } from './balanceEvents';
import { mapResponse } from '@ngrx/operators';
import { ExpenseEvents } from '../../expenses/store/expenseEvents';

type BalanceState = {
  balance: Balance | null
}

export const BalanceStore = signalStore(
  withState<BalanceState>({ balance: null }),
  withEventHandlers(
    () => {
      const events = inject(Events);
      const service = inject(BalanceService);
      return {
        loadBalance$: events.on(BalanceEvents.loadBalance, ExpenseEvents.createExpenseSuccess, ExpenseEvents.loadExpense, ExpenseEvents.deleteExpenseSuccess).pipe(
          switchMap(_ =>
            service.get().pipe(
              mapResponse({
                next: (balance) => BalanceEvents.loadBalanceSuccess({ balance }),
                error: (error) =>
                  BalanceEvents.loadBalanceFailure({ error }),
              })
            )
          )
        ),
      };
    }
  ),
  withReducer(
    on(BalanceEvents.loadBalanceSuccess, ({ payload }) => ({ balance: payload.balance }))
  )
)
