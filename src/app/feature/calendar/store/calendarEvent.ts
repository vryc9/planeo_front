import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";

export const calendarEvents = eventGroup({
  source : "[Calendar] Calendar",
  events : {
    openExpenseModal : type<{startStr : string}>()
  }
})
