import { Component, inject} from '@angular/core';
import { ExpenseStore } from '../../store/expenseStore';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { TagPipe } from '../../pipes/tag-pipe.pipe';

@Component({
  selector: 'app-list-expense-component',
  imports: [DatePipe],
  templateUrl: './list-expense-component.html',
  styleUrl: './list-expense-component.css',
})
export class ListExpenseComponent {
  readonly store = inject(ExpenseStore);
}
