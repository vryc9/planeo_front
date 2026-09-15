import { signalStore, withHooks, withState } from '@ngrx/signals';
import { Events, injectDispatch, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { AccountService } from '../service/account-service.service';
import { AccountAddEvents, AccountEvents } from './accountEvents';
import { AccountDTO } from '../../../types/generated';
import { ExpenseEvents } from '../../expenses/store/expenseEvents';
import { BalanceUpdateEvents } from '../../balance/store/balanceEvents';
import { AuthEvent } from '../../auth/store/AuthEvent';
import { ToastEvents } from '../../../shared/toast/store/toastEvents';
import { ErrorEvents } from '../../../shared/error/store/error-events';
import { ErrorDetail } from '../../../shared/error/error';

type AccountState = {
  accounts: AccountDTO[];
};

export const AccountStore = signalStore(
  withState<AccountState>({ accounts: [] }),
  withEventHandlers(() => {
    const events = inject(Events);
    const service = inject(AccountService);
    const toast = injectDispatch(ToastEvents);
    return {
      loadAccounts$: events
        .on(
          AccountEvents.loadAccounts,
          ExpenseEvents.createExpenseSuccess,
          ExpenseEvents.loadExpense,
          ExpenseEvents.updateExpenseSuccess,
          ExpenseEvents.deleteExpenseSuccess,
          BalanceUpdateEvents.addIncomeSuccess,
          AccountAddEvents.addAccountSuccess,
        )
        .pipe(
          switchMap(() =>
            service.getAll().pipe(
              mapResponse({
                next: (accounts) => AccountEvents.loadAccountsSuccess({ accounts }),
                error: (error) => AccountEvents.loadAccountsFailure({ error }),
              }),
            ),
          ),
        ),
      createAccount$: events.on(AccountAddEvents.addAccount).pipe(
        switchMap(({ payload: { accounts } }) =>
          service.create(accounts).pipe(
            mapResponse({
              next: (created) => {
                const description = created.length > 1
                  ? `${created.length} comptes ont été ajoutés`
                  : `"${created[0].label}" a été ajouté à vos comptes`;
                toast.show({
                  title: 'Banque ajoutée',
                  description,
                  variant: 'success',
                });
                return AccountAddEvents.addAccountSuccess({ accounts: created });
              },
              error: (error : ErrorDetail) => ErrorEvents.error({ error }),
            }),
          ),
        ),
      ),
    };
  }),
  withReducer(
    on(AccountEvents.loadAccountsSuccess, ({ payload }) => ({ accounts: payload.accounts })),
    on(AuthEvent.logout, () => ({ accounts: [] })),
  ),
  withHooks(() => {
    const dispatch = injectDispatch(AccountEvents);
    return {
      onInit() {
        dispatch.loadAccounts();
      },
    };
  }),
);
