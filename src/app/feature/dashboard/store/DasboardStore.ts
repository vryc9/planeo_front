import { signalStore, withState } from "@ngrx/signals";
import { on, withReducer } from "@ngrx/signals/events";
import { DashboardEvents } from "./DashboardEvents";
import { DashboardViewEnum } from "../enum/DashboardViewEnum";

interface DashboardState {
  currentView : DashboardViewEnum
}
export const DashboardStore = signalStore(
  withState<DashboardState>({currentView : DashboardViewEnum.DASHBOARD}),
  withReducer(
    on(DashboardEvents.openMenu, ({payload}) => ({currentView : payload.open}))
  )

)
