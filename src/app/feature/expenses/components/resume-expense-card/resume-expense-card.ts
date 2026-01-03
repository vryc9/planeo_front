import { Component, input, InputSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseResume } from '../../types/expenseResume';

@Component({
  selector: 'app-resume-expense-card',
  imports: [MatIconModule],
  templateUrl: './resume-expense-card.html',
  styleUrl: './resume-expense-card.css',
})
export class ResumeExpenseCard {
  expenseResume : InputSignal<ExpenseResume> = input.required<ExpenseResume>();
}
