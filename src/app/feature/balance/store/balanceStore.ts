import { Events, injectDispatch, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { signalStore, withHooks, withProps, withState } from "@ngrx/signals";
import { inject } from '@angular/core';
import { BalanceService } from '../service/balance-service.service';
import { switchMap, tap } from 'rxjs';
import { BalanceCreateEvents, BalanceEvents, BalanceUpdateEvents } from './balanceEvents';
import { mapResponse } from '@ngrx/operators';
import { ExpenseEvents, IncomeModal } from '../../expenses/store/expenseEvents';
import { AuthEvent } from '../../auth/store/AuthEvent';
import { Router } from '@angular/router';
import {BalanceResponseDTO } from '../../../types/generated';
import { ToastEvents } from '../../../shared/toast/store/toastEvents';
import { MatDialog } from '@angular/material/dialog';
import { ModaleIncomeComponent } from '../../expenses/components/modale-income-component/modale-income-component';

type BalanceState = {
  balance: BalanceResponseDTO | undefined
}

export const BalanceStore = signalStore(
  withState<BalanceState>({ balance: undefined }),
  withProps(() => ({
    dispatch: injectDispatch(BalanceEvents),
    dialog: inject(MatDialog)
  })),
  withEventHandlers(
    ({ dialog }) => {
      const events = inject(Events);
      const service = inject(BalanceService);
      const router = inject(Router);
      const toast = injectDispatch(ToastEvents);
      return {
        loadBalance$: events.on(
          BalanceEvents.loadBalance,
          ExpenseEvents.createExpenseSuccess,
          ExpenseEvents.loadExpense,
          ExpenseEvents.deleteExpenseSuccess).
          pipe(
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
        createBalance$: events.on(BalanceCreateEvents.createBalance).pipe(
          switchMap(({ payload: { balance } }) => service.create(balance).pipe(
            mapResponse({
              next: (balance) => {
                router.navigate(["/dashboard"])
                return BalanceCreateEvents.createBalanceSuccess({ balance })
              },
              error: (error) => BalanceCreateEvents.createBalanceFailure({ error })
            })
          ))
        ),
        update$: events.on(BalanceUpdateEvents.addIncome).pipe(
          switchMap(({ payload: { amount } }) =>
            service.update(amount).pipe(
              mapResponse({
                next: (balance) => {
                  toast.show({
                    title: 'Entrée enregistrée',
                    description: `+${amount.toFixed(2)} € ajouté à votre solde`,
                    variant: 'success',
                  });
                  return BalanceUpdateEvents.addIncomeSuccess({ balance });
                },
                error: (error) => BalanceUpdateEvents.addIncomeFailure({ error }),
              })
            )
          )
        ),
        openIncomeModale$: events.on(IncomeModal.openIncomeModal).pipe(
          tap(() => dialog.open(ModaleIncomeComponent, { width: '440px' }))
        ),
      };
    }
  ),
  withReducer(
    on(BalanceEvents.loadBalanceSuccess, ({ payload }) => ({ balance: payload.balance })),
    on(BalanceUpdateEvents.addIncomeSuccess, ({ payload }) => ({ balance: payload.balance })),
    on(AuthEvent.logout, () => ({ balance: undefined })),
  ),
  withHooks(({ dispatch }) => ({
    onInit() {
      dispatch.loadBalance();
    },
  }))
)
