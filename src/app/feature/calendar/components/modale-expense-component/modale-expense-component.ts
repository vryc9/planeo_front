import { Component, computed, Inject, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { email, Field, form, min, required, submit } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Expense, Tag } from '../../../expenses/types/expense';
import { MatInputModule } from '@angular/material/input';
import { injectDispatch } from '@ngrx/signals/events';
import { ExpenseEvents } from '../../../expenses/store/expenseEvents';
import { ExpenseStore } from '../../../expenses/store/expenseStore';

interface ExpenseFormData {
  amount: number;
  tag: Tag | null,
  date: string,
  label: string
}

@Component({
  selector: 'app-modale-expense-component',
  imports: [MatDialogModule, Field, MatInputModule],
  templateUrl: './modale-expense-component.html',
  styleUrl: './modale-expense-component.css',
})

export class ModaleExpenseComponent {
  readonly dialogRef = inject(MatDialogRef<ModaleExpenseComponent>);
  readonly dispatch = injectDispatch(ExpenseEvents);
  readonly expenseStore = inject(ExpenseStore)

  tagLabels: WritableSignal<Record<Tag, string>> = signal({
    [Tag.SOIREE]: "Soirée",
    [Tag.RESTAURANT]: "Restaurant"
  });

  tagOptions: Signal<{
    id: Tag;
    label: string;
  }[]> = computed(() => {
    return Object.entries(this.tagLabels()).map(([key, value]) => ({
      id: Number(key) as Tag,
      label: value
    }));
  });

  expenseModel = signal<ExpenseFormData>({
    amount: 0,
    tag: null,
    date: "",
    label: "",
  });

  form = form(this.expenseModel, (schemaPath) => {
    required(schemaPath.tag, { message: "Doit etre la" })
    required(schemaPath.amount, { message: 'Le montant est obligatoire' })
    min(schemaPath.amount, 1, { message: "Le montant doit être supérier à 0" })
    required(schemaPath.label, { message: "Le label est obligatoire" })
  });

  isOpen: WritableSignal<boolean> = signal<boolean>(false);
  selectedLabel: WritableSignal<string> = signal<string>('Sélection un tag');

  constructor(@Inject(MAT_DIALOG_DATA) public data: { date: string }) {
    this.expenseModel.set({
      amount: 0,
      tag: null,
      date: data.date,
      label: "",
    })
  }

  toggleDropdown(): void {
    this.isOpen.update(b => !b);
  }

  selectOption(tagId: Tag, label: string): void {
    this.form.tag().value.set(tagId);
    this.selectedLabel.set(label);
    this.isOpen.set(false);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      const { tag, amount, date, label } = this.expenseModel();
      this.dispatch.createExpense({
        expense: {
          tag: tag!,
          amount,
          date: new Date(date),
          label
        }
      })
    });
  }
}
