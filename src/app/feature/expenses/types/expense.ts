export interface Expense {
  id?: number,
  amount: number,
  tag: Tag,
  date: Date,
  label: string
}

export enum Tag {
  SOIREE,
  RESTAURANT
}
