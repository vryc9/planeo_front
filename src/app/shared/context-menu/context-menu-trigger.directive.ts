// context-menu-trigger.directive.ts
import { DestroyRef, Directive, ElementRef, inject, input } from '@angular/core';
import { ContextMenuService } from './context-menu.service';
import { ContextMenuItem } from './context-menu-item';

@Directive({
  selector: '[appContextMenu]',
  standalone: true,
})
export class ContextMenuTriggerDirective {
  readonly appContextMenu = input.required<readonly ContextMenuItem[]>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly contextMenuService = inject(ContextMenuService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    const element = this.elementRef.nativeElement;
    this.contextMenuService.register(element, () => this.appContextMenu());
    this.destroyRef.onDestroy(() => this.contextMenuService.unregister(element));
  }
}
