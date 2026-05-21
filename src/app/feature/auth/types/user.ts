import { BalanceResponseDTO, ExpenseDTO } from "../../../types/generated";

export interface User {
  id : number,
  username: string,
  expenses: ExpenseDTO[],
  balance: BalanceResponseDTO
}
