import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { User } from "../types/user";

export const AuthEvent = eventGroup({
  source: '[Auth] Authentification',
  events: {
    authentification : type<{username : string, password : string}>(),
    authentificationSuccess : type<{token : string}>(),
    authentificationFailure : type<{error : unknown}>(),
    getCurrentUserSuccess : type<{user : User}>(),
    getCurrentUserFailure : type<{error : unknown}>()
  }
})
