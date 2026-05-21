// ---------------------------------------------------------------------------
// GENERATED — do not edit manually.
// Source: com.example.planeo_back.web.DTO.ExpenseDTO
// Generator: ts-codegen-processor (https://github.com/your-org/ts-codegen)
// ---------------------------------------------------------------------------

import type { ExpenseStatus } from './expense-status';
import type { Tag } from './tag';

export interface ExpenseDTO {
  id: number;
  amount: number;
  tag: Tag;
  status: ExpenseStatus;
  date: string;
  label: string;
  recurring: boolean;
}
