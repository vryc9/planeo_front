import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { ListExpenseComponent } from "./components/list-expense-component/list-expense-component";
import { RecuringExpenseComponent } from "./components/recuring-expense-component/recuring-expense-component";

@Component({
  selector: 'app-expense-component',
  imports: [MatTabsModule, MatIconModule, ListExpenseComponent, RecuringExpenseComponent],
  templateUrl: './expense-component.html',
  styleUrl: './expense-component.scss',
})
export class ExpenseComponent {

}
