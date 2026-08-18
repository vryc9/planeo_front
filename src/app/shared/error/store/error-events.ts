import { eventGroup } from "@ngrx/signals/events";
import { ErrorDetail } from "../error";
import { type } from "@ngrx/signals";

export const ErrorEvents = eventGroup({
  source: '[Error] Error handling...',
  events: {
    error: type<{ error: ErrorDetail}>()
  }
})
