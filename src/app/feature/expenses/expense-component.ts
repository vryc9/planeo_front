import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { ListExpenseComponent } from "./components/list-expense-component/list-expense-component";
import { RecurringExpenseComponent } from "./components/recuring-expense-component/recuring-expense-component";
import { ExpenseResumeComponent } from "./components/expense-resume-component/expense-resume-component";
import { ExpenseStore } from './store/expenseStore';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-expense-component',
  imports: [MatTabsModule, MatIconModule, ListExpenseComponent, RecurringExpenseComponent, ExpenseResumeComponent],
  templateUrl: './expense-component.html',
  styleUrl: './expense-component.scss',
})
export class ExpenseComponent {
  readonly store = inject(ExpenseStore);
}
