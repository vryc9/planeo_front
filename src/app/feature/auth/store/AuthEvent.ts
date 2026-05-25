import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { User } from "../types/user";
import { emptyProps } from "@ngrx/store";

export const AuthEvent = eventGroup({
  source: '[Auth] Authentification',
  events: {
    authentification: type<{ username: string, password: string }>(),
    authentificationSuccess: type<{ token: string }>(),
    authentificationFailure: type<{ error: unknown }>(),
    getCurrentUserSuccess: type<{ user: User }>(),
    getCurrentUserFailure: type<{ error: unknown }>(),
    logout: type<void>(),
  },
})


export const appInitialized = eventGroup({
  source: 'App',
  events: {
    appReady: type<void>(),
  }
})



