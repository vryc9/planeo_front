import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { UserConnected } from "./AuthStore";

export const AuthEvent = eventGroup({
  source: '[Auth] Authentification',
  events: {
    authentification: type<{ username: string, password: string }>(),
    authentificationSuccess: type<{ userConnected: UserConnected }>(),
    authentificationFailure: type<{ error: unknown }>(),
    logout: type<void>(),
    restoreSession: type<void>(),
    restoreSessionSuccess : type<{userConnected : UserConnected}>(),
    restoreSessionFailure : type<void>()
  },
})


export const appInitialized = eventGroup({
  source: 'App',
  events: {
    appReady: type<void>(),
  }
})
