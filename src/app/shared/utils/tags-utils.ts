import { Tag } from "../../types/generated";

export function toTagLabel(value: string): string {
  return Object.values(Tag).find(v => Object.keys(Tag)[Object.values(Tag).indexOf(v as Tag)] === value) ?? value;
}

const TAG_ICONS: Record<keyof typeof Tag, string> = {
  SOIREE:         'nightlife',
  RESTAURANT:     'restaurant',
  ANNIVERSAIRE:   'cake',
  COURSE:         'shopping_cart',
  ABONNEMENT:     'repeat',
  TRANSPORT:      'directions_transit',
  INVESTISSEMENT: 'trending_up',
  CINEMA:         'movie',
};

export function toTagIcon(tag: string): string {
  return TAG_ICONS[tag as keyof typeof Tag] ?? 'receipt';
}
