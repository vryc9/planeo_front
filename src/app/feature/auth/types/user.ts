import { Balance } from "../../balance/types/balance";
import { Expense } from "../../expenses/types/expense";

export interface User {
  username: string,
  expenses: Expense[],
  balance: Balance
}
