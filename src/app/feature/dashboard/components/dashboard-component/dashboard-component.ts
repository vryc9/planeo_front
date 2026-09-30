import { Component, inject } from '@angular/core';
import { ExpenseStore } from '../../../expenses/store/expenseStore';
import { DashbordGraphComponent } from "../dashbord-graph-component/dashbord-graph-component";
import { DashboardListExpense } from "../dashboard-list-expense/dashboard-list-expense";
import { DashboardTagsGraphComponent } from "../dashboard-tags-graph-component/dashboard-tags-graph-component";
import { DashboardResumeCard } from "../dashboard-resume-card/dashboard-resume-card";
import { DashboardStore } from '../../store/DasboardStore';
import { AccountStore } from '../../../account/store/accountStore';

@Component({
  selector: 'app-dashboard-component',
  imports: [DashbordGraphComponent, DashboardListExpense, DashboardTagsGraphComponent, DashboardResumeCard],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  readonly expensesStore = inject(ExpenseStore);
  readonly dashboardStore = inject(DashboardStore);
  readonly accountStore = inject(AccountStore);
}
