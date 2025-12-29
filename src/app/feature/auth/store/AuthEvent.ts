import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";

export const AuthEvent = eventGroup({
  source: 'Auth',
  events: {
    authentification : type<{username : string, password : string}>(),
    authentificationSuccess : type<{token : string}>(),
    authentificationFailure : type<{error : any}>(),
  }
})
