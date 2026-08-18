import { type } from "@ngrx/signals";
import { eventGroup } from "@ngrx/signals/events";
import { Menu } from "../types/menu";
import { DashboardViewEnum } from "../enum/DashboardViewEnum";
import { TabType } from "../../expenses/store/expenseStore";

export const DashboardEvents = eventGroup({
  source: "[Dashboard] Dashboard",
  events: {
    openMenu: type<{ view: DashboardViewEnum, openTab? : TabType }>()
  }
})
