// ---------------------------------------------------------------------------
// GENERATED — do not edit manually.
// Source: com.example.planeo_back.web.DTO.expense.ExpenseCreateRequestDTO
// Generator: ts-codegen-processor (https://github.com/your-org/ts-codegen)
// ---------------------------------------------------------------------------

import { CategoryDTO } from './category-dto';
import type { ExpenseStatus } from './expense-status';

export interface ExpenseCreateRequestDTO {
  amount: number;
  category: CategoryDTO;
  status: ExpenseStatus;
  date: string;
  label: string;
  recurring: boolean;
}
