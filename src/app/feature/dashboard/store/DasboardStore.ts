import { signalStore, withComputed, withProps, withState } from "@ngrx/signals";
import { on, withReducer } from "@ngrx/signals/events";
import { DashboardEvents } from "./DashboardEvents";
import { DashboardViewEnum } from "../enum/DashboardViewEnum";
import { Menu } from "../types/menu";
import { computed, inject } from "@angular/core";
import { ExpenseStore } from "../../expenses/store/expenseStore";
import { ExpenseDTO } from "../../../types/generated";

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
  withProps(() => ({
    expenseStore: inject(ExpenseStore)
  })),
  withComputed(({ currentView, expenseStore: { expenses } }) => ({
    menu: computed(() =>
      MENU_CONFIG.map(item => ({ ...item, isActive: item.view === currentView() }))
    ),
    expenses: computed<ExpenseDTO[]>(() => expenses().slice(0, 5))
  })),
  withReducer(
    on(DashboardEvents.openMenu, ({ payload: { view } }) => ({ currentView: view }))
  )
);
