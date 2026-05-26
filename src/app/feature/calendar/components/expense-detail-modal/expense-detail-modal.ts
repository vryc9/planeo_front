import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import { ExpenseDTO, ExpenseStatus, Tag } from '../../../../types/generated';
import { toTagLabel } from '../../../../shared/utils/tags-utils';


@Component({
  selector: 'app-expense-detail-modal',
  imports: [MatDialogModule, NgClass],
  templateUrl: './expense-detail-modal.html',
  styleUrl: './expense-detail-modal.css',
})
export class ExpenseDetailModalComponent {
  readonly dialogRef = inject(MatDialogRef<ExpenseDetailModalComponent>);
  private readonly data = inject<{ expense: ExpenseDTO }>(MAT_DIALOG_DATA);

  protected readonly expense: WritableSignal<ExpenseDTO> = signal(this.data.expense);
  protected readonly tagLabel = computed(() => toTagLabel(this.expense().tag));

  readonly formattedDate = computed(() =>
    new Date(this.expense().date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  );

  readonly formattedAmount = computed(() =>
    this.expense().amount.toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );

  readonly isProcessed = computed(() => this.expense().status === ExpenseStatus.PROCESSED);
}
