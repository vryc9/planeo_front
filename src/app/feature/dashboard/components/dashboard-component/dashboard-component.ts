import { Component, inject, OnInit } from '@angular/core';
import { ExpenseStore } from '../../../expenses/store/expenseStore';
import { DashbordGraphComponent } from "../dashbord-graph-component/dashbord-graph-component";
import { DashboardListExpense } from "../dashboard-list-expense/dashboard-list-expense";
import { DashboardTagsGraphComponent } from "../dashboard-tags-graph-component/dashboard-tags-graph-component";
import { DashboardResumeCard } from "../dashboard-resume-card/dashboard-resume-card";
import { injectDispatch } from '@ngrx/signals/events';
import { ExpensePerMountEvent } from '../../../expenses/store/expenseEvents';
import { DashboardStore } from '../../store/DasboardStore';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard-component',
  imports: [DashbordGraphComponent, DashboardListExpense, DashboardTagsGraphComponent, DashboardResumeCard, JsonPipe],
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
