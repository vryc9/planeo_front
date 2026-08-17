import { Directive, inject, input } from '@angular/core';
import { ContextMenuService } from './context-menu.service';
import { ContextMenuItem } from './context-menu-item';

@Directive({
  selector: '[appContextMenu]',
  standalone: true,
  host: {
    '(contextmenu)': 'onContextMenu($event)',
  },
})
export class ContextMenuTriggerDirective {
  readonly appContextMenu = input.required<readonly ContextMenuItem[]>();

  private readonly contextMenuService = inject(ContextMenuService);

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuService.open({ x: event.clientX, y: event.clientY }, this.appContextMenu());
  }
}
