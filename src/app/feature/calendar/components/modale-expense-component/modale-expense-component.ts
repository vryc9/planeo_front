import { Component, computed, Inject, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { form, min, required, submit, FormField } from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { injectDispatch } from '@ngrx/signals/events';
import { ExpenseEvents } from '../../../expenses/store/expenseEvents';
import { ExpenseStore } from '../../../expenses/store/expenseStore';
import { NgClass } from "@angular/common";
import { CategoryStore } from '../../../category/store/CategoryStore';
import { CategoryDTO } from '../../../../types/generated/category-dto';
import { ExpenseStatus } from '../../../../types/generated';
import { AccountStore } from '../../../account/store/accountStore';
import { AccountDTO } from '../../../../types/generated/account-dto';

interface ExpenseFormData {
  amount: number;
  category: CategoryDTO | null,
  account: AccountDTO | null,
  date: string,
  label: string
}

@Component({
  selector: 'app-modale-expense-component',
  imports: [MatDialogModule, FormField, MatInputModule, NgClass, FormField],
  providers : [CategoryStore],
  templateUrl: './modale-expense-component.html',
  styleUrl: './modale-expense-component.css',
})

export class ModaleExpenseComponent {
  readonly dialogRef = inject(MatDialogRef<ModaleExpenseComponent>);
  readonly dispatch = injectDispatch(ExpenseEvents);
  readonly expenseStore = inject(ExpenseStore)
  protected readonly categoryStore = inject(CategoryStore);
  protected readonly accountStore = inject(AccountStore);

  categoryOption: Signal<{
    id: number;
    name: string;
  }[]> = computed(() => {
    return this.categoryStore.categories().map(({id, name}) => ({id, name}))
  });

  accountOption: Signal<{
    id: number;
    label: string;
    logo: string;
  }[]> = computed(() => {
    return this.accountStore.accounts().map(({id, label, logo}) => ({id, label, logo}))
  });

  expenseModel = signal<ExpenseFormData>({
    amount: 0,
    category: null,
    account: null,
    date: "",
    label: "",
  });

  form = form(this.expenseModel, (schemaPath) => {
    required(schemaPath.category, { message: "Doit etre la" })
    required(schemaPath.account, { message: "Le compte est obligatoire" })
    required(schemaPath.amount, { message: 'Le montant est obligatoire' })
    min(schemaPath.amount, 1, { message: "Le montant doit être supérier à 0" })
    required(schemaPath.label, { message: "Le label est obligatoire" })
  });

  isOpen: WritableSignal<boolean> = signal<boolean>(false);
  selectedLabel: WritableSignal<string> = signal<string>('Sélection une catégorie');
  isAccountOpen: WritableSignal<boolean> = signal<boolean>(false);
  selectedAccountLabel: WritableSignal<string> = signal<string>('Sélection un compte');
  selectedAccountLogo: WritableSignal<string | null> = signal<string | null>(null);
  isRecurring: WritableSignal<boolean> = signal<boolean>(false);

  dateFormLabel: Signal<string> = computed<string>(() => this.isRecurring() ? "Date de prélèvement" : "Date")

  constructor(@Inject(MAT_DIALOG_DATA) { date, isRecurring }: { date: string, isRecurring: boolean }) {
    this.expenseModel.set({
      amount: 0,
      category: null,
      account: null,
      date: date,
      label: "",
    })
    this.isRecurring.set(isRecurring)
  }

  toggleDropdown(): void {
    this.isOpen.update(b => !b);
  }

  selectOption(categoryid: number, label: string): void {
    const selectedCategory : CategoryDTO = this.categoryStore.categories().find(({id}) => id === categoryid)!;
    this.form.category().value.set(selectedCategory);
    this.selectedLabel.set(label);
    this.isOpen.set(false);
  }

  toggleAccountDropdown(): void {
    this.isAccountOpen.update(b => !b);
  }

  selectAccountOption(accountId: number, label: string, logo: string): void {
    const selectedAccount : AccountDTO = this.accountStore.accounts().find(({id}) => id === accountId)!;
    this.form.account().value.set(selectedAccount);
    this.selectedAccountLabel.set(label);
    this.selectedAccountLogo.set(logo);
    this.isAccountOpen.set(false);
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    submit(this.form, async () => {
      const { category, account, amount, date, label } = this.expenseModel();
      console.log({
        category,
        account,
        amount,
        date: new Date(date),
        label,
        isRecurring: this.isRecurring()
      });

      this.dispatch.createExpense({
        expense: {
          category : category!,
          accountId : account!.id,
          amount,
          status : ExpenseStatus.PENDING,
          date: new Date(date).toISOString(),
          label,
          recurring: this.isRecurring()
        }
      })
    });
    this.dialogRef.close();
  }
}
