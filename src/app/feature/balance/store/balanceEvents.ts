import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { BalanceDTO, BalanceResponseDTO } from "../../../types/generated";

export const BalanceEvents = eventGroup({
  source: "[Balance] Balance",
  events: {
    loadBalance: type<void>(),
    loadBalanceSuccess: type<{ balance: BalanceResponseDTO }>(),
    loadBalanceFailure: type<{ error: unknown }>()
  }
})


export const BalanceCreateEvents = eventGroup({
  source : "[Balance] Création du solde",
  events : {
    createBalance : type<{balance : BalanceDTO}>(),
    createBalanceSuccess : type<{balance : BalanceResponseDTO}>(),
    createBalanceFailure : type<{error : unknown}>()
  }
})

export const BalanceUpdateEvents = eventGroup({
  source: "[Balance] Update balance",
  events: {
    addIncome: type<{ amount: number }>(),
    addIncomeSuccess: type<{ balance: BalanceResponseDTO }>(),
    addIncomeFailure: type<{ error: unknown }>(),
  }
})
