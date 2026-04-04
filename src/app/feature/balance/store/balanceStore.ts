import { Events, injectDispatch, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { Balance } from './../types/balance';
import { signalStore, withHooks, withProps, withState } from "@ngrx/signals";
import { inject } from '@angular/core';
import { BalanceService } from '../service/balance-service.service';
import { switchMap } from 'rxjs';
import { BalanceEvents } from './balanceEvents';
import { mapResponse } from '@ngrx/operators';
import { ExpenseEvents } from '../../expenses/store/expenseEvents';

type BalanceState = {
  balance: Balance | undefined
}

export const BalanceStore = signalStore(
  withState<BalanceState>({ balance: undefined }),
  withProps(() => ({
    dispatch: injectDispatch(BalanceEvents)
  })),
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
  ),
  withHooks(({ dispatch }) => ({
    onInit() {
      dispatch.loadBalance();
    },
  }))
)
