export interface Expense {
  id?: number,
  amount: number,
  tag: Tag,
  status? : ExpenseStatus
  date: Date,
  label: string
}

export enum Tag {
  SOIREE,
  RESTAURANT
}

export enum ExpenseStatus {
  PENDING,
  PROCESSED
}
