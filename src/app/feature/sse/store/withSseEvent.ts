import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";

export const SseEvent = eventGroup({
  source: "[SSE] Server side event",
  events: {
    subscribe: type<void>(),
    subscribeSucces: type<void>(),
    subscribeFailure: type<{ error: unknown }>()
  }
})
