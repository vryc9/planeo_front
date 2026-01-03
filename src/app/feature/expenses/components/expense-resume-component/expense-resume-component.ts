import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ResumeExpenseCard } from "../resume-expense-card/resume-expense-card";
import { ExpenseStore } from '../../store/expenseStore';
import { ExpenseResume } from '../../types/expenseResume';

@Component({
  selector: 'app-expense-resume-component',
  imports: [MatIconModule, ResumeExpenseCard],
  templateUrl: './expense-resume-component.html',
  styleUrl: './expense-resume-component.css',
})
export class ExpenseResumeComponent {
  expenseResume : InputSignal<ExpenseResume[]> = input.required<ExpenseResume[]>();
}
