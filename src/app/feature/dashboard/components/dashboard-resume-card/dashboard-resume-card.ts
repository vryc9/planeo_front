import { Component, input, InputSignal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseResume } from '../../../expenses/types/expenseResume';

@Component({
  selector: 'app-dashboard-resume-card',
  imports: [MatIconModule],
  templateUrl: './dashboard-resume-card.html',
  styleUrl: './dashboard-resume-card.css',
})
export class DashboardResumeCard {
  expenseResume: InputSignal<ExpenseResume> = input.required<ExpenseResume>();
}
