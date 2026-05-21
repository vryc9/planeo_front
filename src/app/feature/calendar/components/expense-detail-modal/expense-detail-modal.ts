import { Component, computed, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NgClass } from '@angular/common';
import { ExpenseDTO, ExpenseStatus, Tag } from '../../../../types/generated';

const TAG_LABELS: Record<Tag, string> = {
  [Tag.SOIREE]: 'Soirée',
  [Tag.RESTAURANT]: 'Restaurant',
  [Tag.CINEMA]: 'Cinéma',
  [Tag.ANNIVERSAIRE]: 'Anniversaire',
};

@Component({
  selector: 'app-expense-detail-modal',
  imports: [MatDialogModule, NgClass],
  templateUrl: './expense-detail-modal.html',
  styleUrl: './expense-detail-modal.css',
})
export class ExpenseDetailModalComponent {
  readonly dialogRef = inject(MatDialogRef<ExpenseDetailModalComponent>);
  private readonly data = inject<{ expense: ExpenseDTO }>(MAT_DIALOG_DATA);

  readonly expense = signal(this.data.expense);

  readonly tagLabel = computed(() => TAG_LABELS[this.expense().tag] ?? this.expense().tag);

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
