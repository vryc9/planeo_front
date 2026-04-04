import { Component, inject } from '@angular/core';
import { ExpenseStore } from '../../../expenses/store/expenseStore';
import { ExpenseResumeComponent } from "../../../expenses/components/expense-resume-component/expense-resume-component";
import { DashbordGraphComponent } from "../dashbord-graph-component/dashbord-graph-component";
import { DashboardListExpense } from "../dashboard-list-expense/dashboard-list-expense";

@Component({
  selector: 'app-dashboard-component',
  imports: [ExpenseResumeComponent, DashbordGraphComponent, DashboardListExpense],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  readonly expensesStore = inject(ExpenseStore);
}
