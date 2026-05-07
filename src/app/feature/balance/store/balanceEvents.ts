import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { Balance } from "../types/balance";

export const BalanceEvents = eventGroup({
  source: "[Balance] Balance",
  events: {
    loadBalance: type<void>(),
    loadBalanceSuccess: type<{ balance: Balance }>(),
    loadBalanceFailure: type<{ error: unknown }>()
  }
})


export const BalanceCreateEvents = eventGroup({
  source : "[Balance] Création du solde",
  events : {
    createBalance : type<{balance : Balance}>(),
    createBalanceSuccess : type<{balance : Balance}>(),
    createBalanceFailure : type<{error : unknown}>()
  }
})
