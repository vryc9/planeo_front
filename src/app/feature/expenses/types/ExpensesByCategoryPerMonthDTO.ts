import { ExpensesByCategoryDTO } from '../../../types/generated/expenses-by-tags-dto';

export type ExpensesByCategoryPerMonthDTO = {
  month: string;
} & {
  categories: ExpensesByCategoryDTO[];
};
