import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  form, min, required, requiredError, submit, validate,
  FormField, type SchemaPath,
  readonly,
} from '@angular/forms/signals';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { injectDispatch } from '@ngrx/signals/events';
import { ExpenseEvents } from '../../../expenses/store/expenseEvents';
import { CategoryStore } from '../../../category/store/CategoryStore';
import { AccountStore } from '../../../account/store/accountStore';
import { CategoryDTO } from '../../../../types/generated/category-dto';
import { AccountDTO } from '../../../../types/generated/account-dto';
import { ExpenseStatus } from '../../../../types/generated';
import { DropdownComponent, DropdownOption } from '../../../../shared/components/dropdown-component/dropdown-component';
import { FieldErrorComponent } from '../../../../shared/components/field-error-component/field-error-component';

type ExpenseDialogData = Readonly<{ date: string; isRecurring: boolean }>;

type ExpenseFormModel = {
  amount: number | null;
  categoryId: CategoryDTO['id'] | null;
  accountId: AccountDTO['id'] | null;
  date: string;
  label: string;
};

const notBlank = (path: SchemaPath<string>, message: string): void =>
  validate(path, ({ value }) => (value().trim() ? undefined : requiredError({ message })));

@Component({
  selector: 'app-modale-expense-component',
  imports: [MatDialogModule, MatInputModule, FormField, DropdownComponent, FieldErrorComponent],
  templateUrl: './modale-expense-component.html',
  styleUrl: './modale-expense-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModaleExpenseComponent {
  private readonly dialogRef = inject<MatDialogRef<ModaleExpenseComponent>>(MatDialogRef);
  private readonly dispatch = injectDispatch(ExpenseEvents);
  private readonly categoryStore = inject(CategoryStore);
  private readonly accountStore = inject(AccountStore);
  private readonly data = inject<ExpenseDialogData>(MAT_DIALOG_DATA);

  protected readonly isRecurring = this.data.isRecurring;
  protected readonly dateLabel = this.isRecurring ? 'Date de prélèvement' : 'Date';

  protected readonly categoryOptions = computed<DropdownOption[]>(() =>
    this.categoryStore.categories().map(({ id, name }) => ({ id, label: name })),
  );
  protected readonly accountOptions = computed<DropdownOption[]>(() =>
    this.accountStore.accounts().map(({ id, label, logo }) => ({
      id,
      label,
      logo: `data:image/png;base64,${logo}`,
    })),
  );


  private readonly model = signal<ExpenseFormModel>({
    amount: null,
    categoryId: null,
    accountId: null,
    date: this.data.date,
    label: '',
  });

  protected readonly form = form(this.model, (p) => {
    readonly(p.date, () => !this.isRecurring);
    required(p.categoryId, { message: 'La catégorie est obligatoire' });
    required(p.accountId, { message: 'Le compte est obligatoire' });
    required(p.amount, { message: 'Le montant est obligatoire' });
    min(p.amount, 0.01, { message: 'Le montant doit être supérieur à 0' });
    required(p.date, { message: 'La date est obligatoire' });
    notBlank(p.label, 'Le label est obligatoire');
  });

  protected async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const success = await submit(this.form, async () => {
      const { categoryId, accountId, amount, date, label } = this.model();
      const category = this.categoryStore.categories().find(({ id }) => id === categoryId);
      if (!category || accountId === null || amount === null) return;

      this.dispatch.createExpense({
        expense: {
          category,
          accountId,
          amount,
          status: ExpenseStatus.PENDING,
          date: new Date(date).toISOString(),
          label,
          recurring: this.isRecurring,
        },
      });
    });

    if (success) this.dialogRef.close();
  }
}
