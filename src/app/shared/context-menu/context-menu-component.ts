import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ContextMenuItem } from './context-menu-item';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul class="context-menu" role="menu">
      @for (item of items(); track item.label) {
        <li role="none">
          <button
            type="button"
            role="menuitem"
            class="context-menu-item"
            [class.context-menu-item--danger]="item.danger"
            [disabled]="item.disabled"
            (click)="select(item)"
          >
            @if (item.icon) {
              <mat-icon class="context-menu-item-icon" [fontIcon]="item.icon"></mat-icon>
            }
            <span class="context-menu-item-label">{{ item.label }}</span>
          </button>
        </li>
      }
    </ul>
  `,
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent {
  readonly items = input.required<readonly ContextMenuItem[]>();
  readonly closed = output<void>();

  select(item: ContextMenuItem): void {
    if (item.disabled) return;
    item.action();
    this.closed.emit();
  }
}
