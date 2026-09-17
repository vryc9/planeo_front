import { type } from '@ngrx/signals';
import { eventGroup } from '@ngrx/signals/events';
import { AccountCreateRequestDTO, AccountDTO } from '../../../types/generated';

export const AccountEvents = eventGroup({
  source: '[Account] Account',
  events: {
    loadAccounts: type<void>(),
    loadAccountsSuccess: type<{ accounts: AccountDTO[] }>(),
    loadAccountsFailure: type<{ error: unknown }>(),
  },
});

export const AccountAddEvents = eventGroup({
  source: '[Account] Adding account',
  events: {
    addAccount: type<{ accounts: AccountCreateRequestDTO[] }>(),
    addAccountSuccess: type<{ accounts: AccountDTO[] }>(),
    addAccountFailure: type<{ error: unknown }>(),
  },
});

export const AccountExistEvents = eventGroup({
  source: '[Account] Vérification existence',
  events: {
    checkAccountExists: type<void>(),
    checkAccountExistsSuccess: type<{ exists: boolean }>(),
    checkAccountExistsFailure: type<{ error: unknown }>(),
  },
});

export const AccountTransferEvents = eventGroup({
  source: '[Account] Transfert entre comptes',
  events: {
    transfer: type<{
      accountOriginId: number;
      accountOriginLabel: string;
      accountTargetId: number;
      accountTargetLabel: string;
      amount: number;
    }>(),
    transferSuccess: type<void>(),
  },
});
