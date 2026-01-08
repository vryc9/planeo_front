export interface Expense {
  id?: number,
  amount: number,
  tag: Tag,
  status? : ExpenseStatus
  date: Date,
  label: string
  recurring : boolean
}

export enum Tag {
  SOIREE,
  RESTAURANT
}

export enum ExpenseStatus {
  PENDING,
  PROCESSED
}
