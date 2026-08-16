import { Component, computed, inject, signal, Signal, WritableSignal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ExpenseDTO } from '../../../../types/generated';
import { CategoryDTO } from '../../../../types/generated/category-dto';

type SortKey = 'date' | 'amount';
type SortDirection = 'asc' | 'desc';

interface ExpenseCategoryModalData {
  category: CategoryDTO;
  expenses: ExpenseDTO[];
}

@Component({
  selector: 'app-expense-category-modal',
  imports: [MatDialogModule, MatIconModule, DatePipe, DecimalPipe],
  templateUrl: './expense-category-modal.html',
  styleUrl: './expense-category-modal.css',
})
export class ExpenseCategoryModalComponent {
  readonly dialogRef = inject(MatDialogRef<ExpenseCategoryModalComponent>);
  private readonly data = inject<ExpenseCategoryModalData>(MAT_DIALOG_DATA);

  protected readonly category: CategoryDTO = this.data.category;
  protected readonly expenses: ExpenseDTO[] = this.data.expenses;

  protected readonly sortBy: WritableSignal<SortKey> = signal<SortKey>('date');
  protected readonly sortDirection: WritableSignal<SortDirection> = signal<SortDirection>('desc');

  protected readonly expenseCount: Signal<number> = computed(() => this.expenses.length);

  protected readonly totalAmount: Signal<number> = computed(() =>
    this.expenses.reduce((sum, expense) => sum + expense.amount, 0)
  );

  protected readonly sortedExpenses: Signal<ExpenseDTO[]> = computed(() => {
    const direction = this.sortDirection() === 'asc' ? 1 : -1;
    const sortBy = this.sortBy();
    return this.expenses.toSorted((a, b) => {
      if (sortBy === 'amount') return (a.amount - b.amount) * direction;
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * direction;
    });
  });

  sort(key: SortKey): void {
    if (this.sortBy() === key) {
      this.sortDirection.update(direction => (direction === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortBy.set(key);
      this.sortDirection.set(key === 'date' ? 'desc' : 'asc');
    }
  }
}
