import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { Menu } from "../types/menu";
import { DashboardViewEnum } from "../enum/DashboardViewEnum";

export const DashboardEvents = eventGroup({
  source: "[Dashboard] Dashboard",
  events: {
    openMenu: type<{ view: DashboardViewEnum }>()
  }
})
