import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';
import type { FormValueControl } from '@angular/forms/signals';

export type DropdownOption = Readonly<{ id: number; label: string; logo?: string }>;

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown-component.html',
  styleUrl: './dropdown-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent implements FormValueControl<number | null> {
  readonly value = model<number | null>(null);
  readonly touched = model(false);
  readonly options = input.required<readonly DropdownOption[]>();
  readonly placeholder = input('Sélectionner');
  readonly ariaLabel = input.required<string>();

  protected readonly open = signal(false);
  protected readonly selected = computed(() => this.options().find(({ id }) => id === this.value()));

  protected select(id: number): void {
    this.value.set(id);
    this.touched.set(true);
    this.open.set(false);
  }
}
