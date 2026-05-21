import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tagPipe',
})
export class TagPipe implements PipeTransform {

  transform(value: string): string {
    const record: Record<string, string> = {
      "SOIREE": "Soirée",
      "RESTAURANT": "Restaurant"
    }
    return record[value];
  }
}
