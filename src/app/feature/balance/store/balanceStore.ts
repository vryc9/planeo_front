import { Events, injectDispatch, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { signalStore, withHooks, withProps, withState } from "@ngrx/signals";
import { inject } from '@angular/core';
import { BalanceService } from '../service/balance-service.service';
import { switchMap, tap } from 'rxjs';
import { BalanceCreateEvents, BalanceEvents } from './balanceEvents';
import { mapResponse } from '@ngrx/operators';
import { ExpenseEvents } from '../../expenses/store/expenseEvents';
import { AuthEvent } from '../../auth/store/AuthEvent';
import { Router } from '@angular/router';
import { AuthStore } from '../../auth/store/AuthStore';
import { BalanceDTO, BalanceResponseDTO } from '../../../types/generated';

type BalanceState = {
  balance: BalanceResponseDTO | undefined
}

export const BalanceStore = signalStore(
  withState<BalanceState>({ balance: undefined }),
  withProps(() => ({
    dispatch: injectDispatch(BalanceEvents),
  })),
  withEventHandlers(
    () => {
      const events = inject(Events);
      const service = inject(BalanceService);
      const router = inject(Router);
      return {
        loadBalance$: events.on(BalanceEvents.loadBalance, ExpenseEvents.createExpenseSuccess, ExpenseEvents.loadExpense, ExpenseEvents.deleteExpenseSuccess).pipe(
          switchMap(_ =>
            service.get().pipe(
              mapResponse({
                next: (balance) => BalanceEvents.loadBalanceSuccess({ balance }),
                error: (error) => {
                  return BalanceEvents.loadBalanceFailure({ error })
                }
              })
            )
          )
        ),

        createBalance$ : events.on(BalanceCreateEvents.createBalance).pipe(
          switchMap(({payload : {balance}}) => service.create(balance).pipe(
            mapResponse({
              next : (balance) => {
                router.navigate(["/dashboard"])
                return BalanceCreateEvents.createBalanceSuccess({balance})
              },
              error : (error) => BalanceCreateEvents.createBalanceFailure({error})
            })
          ))
        )
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
