import { DashboardViewEnum } from "../enum/DashboardViewEnum";

export interface Menu {
  icon: string,
  view : DashboardViewEnum,
  isActive : boolean
}
