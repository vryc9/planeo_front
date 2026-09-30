import { Component, input } from '@angular/core';
import { FieldState } from '@angular/forms/signals';

@Component({
  selector: 'app-field-error-component',
  imports: [],
  templateUrl: './field-error-component.html',
  styleUrl: './field-error-component.css',
})
export class FieldErrorComponent {
  readonly state = input.required<FieldState<unknown>>();

}
