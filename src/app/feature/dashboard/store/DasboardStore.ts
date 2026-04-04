import { signalStore, withComputed, withState } from "@ngrx/signals";
import { on, withReducer } from "@ngrx/signals/events";
import { DashboardEvents } from "./DashboardEvents";
import { DashboardViewEnum } from "../enum/DashboardViewEnum";
import { Menu } from "../types/menu";
import { computed } from "@angular/core";

interface DashboardState {
  currentView: DashboardViewEnum;
  menu: Menu[],
}

const MENU_CONFIG: Omit<Menu, 'isActive'>[] = [
  { view: DashboardViewEnum.DASHBOARD, icon: 'space_dashboard' },
  { view: DashboardViewEnum.CALENDAR, icon: 'calendar_today', },
  { view: DashboardViewEnum.EXPENSE, icon: 'euro' },
  { view: DashboardViewEnum.INVESTMENT, icon: 'attach_money' },
];

export const DashboardStore = signalStore(
  withState({ currentView: DashboardViewEnum.DASHBOARD }),
  withComputed(({ currentView }) => ({
    menu: computed(() =>
      MENU_CONFIG.map(item => ({ ...item, isActive: item.view === currentView() }))
    ),
  })),
  withReducer(
    on(DashboardEvents.openMenu, ({ payload: { view } }) => ({ currentView: view }))
  )
);
