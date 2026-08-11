// ---------------------------------------------------------------------------
// GENERATED — do not edit manually.
// Source: com.example.planeo_back.web.DTO.ExpenseDTO
// Generator: ts-codegen-processor (https://github.com/your-org/ts-codegen)
// ---------------------------------------------------------------------------

import { CategoryDTO } from './category-dto';
import type { ExpenseStatus } from './expense-status';

export interface ExpenseDTO {
  id: number;
  amount: number;
  category: CategoryDTO;
  status: ExpenseStatus;
  date: string;
  label: string;
  recurring: boolean;
}
