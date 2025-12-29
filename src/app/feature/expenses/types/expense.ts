export interface Expense {
  id: number,
  amount: number,
  Tag: Tag,
  date: Date,
  label: string
}

export enum Tag {
  SOIREE
}
