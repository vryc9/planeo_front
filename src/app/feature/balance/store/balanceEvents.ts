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
