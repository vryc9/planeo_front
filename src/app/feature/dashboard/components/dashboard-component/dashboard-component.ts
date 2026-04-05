import { Component, inject, OnInit, computed, ElementRef, viewChild } from '@angular/core';
import { ExpenseStore } from '../../../expenses/store/expenseStore';
import { ExpenseResumeComponent } from "../../../expenses/components/expense-resume-component/expense-resume-component";
import { DashbordGraphComponent } from "../dashbord-graph-component/dashbord-graph-component";
import { DashboardListExpense } from "../dashboard-list-expense/dashboard-list-expense";
import { injectDispatch } from '@ngrx/signals/events';
import { ExpensePerMountEvent } from '../../../expenses/store/expenseEvents';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartOptions, Chart } from 'chart.js';
import { DashboardStore } from '../../store/DasboardStore';

@Component({
  selector: 'app-dashboard-component',
  imports: [ExpenseResumeComponent, DashbordGraphComponent, DashboardListExpense],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent implements OnInit {
  readonly expensesStore = inject(ExpenseStore);
  readonly dashboardStore = inject(DashboardStore);
  readonly dispatch = injectDispatch(ExpensePerMountEvent);



  ngOnInit(): void {
    this.dispatch.loadExpensePerMonth();
  }
}
