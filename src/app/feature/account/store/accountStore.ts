import { signalStore, withHooks, withState } from '@ngrx/signals';
import { Events, injectDispatch, on, withEventHandlers, withReducer } from '@ngrx/signals/events';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { mapResponse } from '@ngrx/operators';
import { AccountService } from '../service/account-service.service';
import { AccountAddEvents, AccountEvents, AccountExistEvents, AccountTransferEvents } from './accountEvents';
import { AccountDTO } from '../../../types/generated';
import { ExpenseEvents } from '../../expenses/store/expenseEvents';
import { BalanceUpdateEvents } from '../../balance/store/balanceEvents';
import { AuthEvent } from '../../auth/store/AuthEvent';
import { ToastEvents } from '../../../shared/toast/store/toastEvents';
import { ErrorEvents } from '../../../shared/error/store/error-events';
import { ErrorDetail } from '../../../shared/error/error';

type AccountState = {
  accounts: AccountDTO[];
  hasAccount: boolean;
};

export const AccountStore = signalStore(
  withState<AccountState>({ accounts: [], hasAccount: false }),
  withEventHandlers(() => {
    const events = inject(Events);
    const service = inject(AccountService);
    const toast = injectDispatch(ToastEvents);
    const router = inject(Router);
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
          AccountTransferEvents.transferSuccess,
          AuthEvent.authentificationSuccess,
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
                router.navigate(['/dashboard']);
                return AccountAddEvents.addAccountSuccess({ accounts: created });
              },
              error: (error : ErrorDetail) => ErrorEvents.error({ error }),
            }),
          ),
        ),
      ),
      checkAccountExists$: events
        .on(
          AccountExistEvents.checkAccountExists,
          AccountAddEvents.addAccountSuccess,
          AuthEvent.authentificationSuccess,
        )
        .pipe(
          switchMap(() =>
            service.exist().pipe(
              mapResponse({
                next: (exists) => AccountExistEvents.checkAccountExistsSuccess({ exists }),
                error: (error) => AccountExistEvents.checkAccountExistsFailure({ error }),
              }),
            ),
          ),
        ),
      transfer$: events.on(AccountTransferEvents.transfer).pipe(
        switchMap(({ payload }) =>
          service
            .transfer({
              accountOriginId: payload.accountOriginId,
              accountTargetId: payload.accountTargetId,
              amount: payload.amount,
            })
            .pipe(
              mapResponse({
                next: () => {
                  const formattedAmount = payload.amount.toLocaleString('fr-FR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });
                  toast.show({
                    title: 'Transfert effectué',
                    description: `${formattedAmount} € transférés de "${payload.accountOriginLabel}" vers "${payload.accountTargetLabel}"`,
                    variant: 'success',
                  });
                  return AccountTransferEvents.transferSuccess();
                },
                error: (error: ErrorDetail) => ErrorEvents.error({ error }),
              }),
            ),
        ),
      ),
    };
  }),
  withReducer(
    on(AccountEvents.loadAccountsSuccess, ({ payload }) => ({ accounts: payload.accounts })),
    on(AccountExistEvents.checkAccountExistsSuccess, ({ payload }) => ({ hasAccount: payload.exists })),
    on(AuthEvent.logout, () => ({ accounts: [], hasAccount: false })),
  ),
  withHooks(() => {
    const dispatch = injectDispatch(AccountEvents);
    const dispatchExist = injectDispatch(AccountExistEvents);
    return {
      onInit() {
        dispatch.loadAccounts();
        dispatchExist.checkAccountExists();
      },
    };
  }),
);
