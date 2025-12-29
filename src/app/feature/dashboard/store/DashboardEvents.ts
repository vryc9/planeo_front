import { Component, Type } from "@angular/core";
import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { CalendarComponent } from "../../calendar/calendar-component";
import { DashboardViewEnum } from "../enum/DashboardViewEnum";

export const DashboardEvents = eventGroup({
  source: "[Dashboard] Dashboard",
  events: {
    openMenu: type<{ open: DashboardViewEnum }>()
  }
})
