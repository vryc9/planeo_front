// ---------------------------------------------------------------------------
// GENERATED — do not edit manually.
// Source: com.example.planeo_back.web.DTO.expense.ExpensesByTagsDTO
// Generator: ts-codegen-processor (https://github.com/your-org/ts-codegen)
// ---------------------------------------------------------------------------

import type { ExpenseDTO } from './expense-dto';
import type { Tag } from './tag';

export interface ExpensesByTagsDTO {
  tag: Tag;
  expenses: ExpenseDTO[];
}
