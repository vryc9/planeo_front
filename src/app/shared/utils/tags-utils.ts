import { Tag } from "../../types/generated";

export function toTagLabel(value: string): string {
  return Object.values(Tag).find(v => Object.keys(Tag)[Object.values(Tag).indexOf(v as Tag)] === value) ?? value;
}
