import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ContextMenuItem } from './context-menu-item';
import { ContextMenuComponent } from './context-menu-component';

type ItemsProvider = () => readonly ContextMenuItem[];

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  private readonly overlay = inject(Overlay);
  private readonly document = inject(DOCUMENT);

  private readonly registry = new Map<HTMLElement, ItemsProvider>();
  private overlayRef: OverlayRef | null = null;
  private globalListenerAttached = false;

  register(element: HTMLElement, itemsProvider: ItemsProvider): void {
    this.registry.set(element, itemsProvider);
    this.ensureGlobalListener();
  }

  unregister(element: HTMLElement): void {
    this.registry.delete(element);
  }

  private ensureGlobalListener(): void {
    if (this.globalListenerAttached) return;
    this.globalListenerAttached = true;
    this.document.addEventListener('contextmenu', this.handleContextMenu, { capture: true });
  }

  private readonly handleContextMenu = (event: MouseEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    for (const [element, itemsProvider] of this.registry) {
      if (element.contains(target) || target.contains(element)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.open({ x: event.clientX, y: event.clientY }, itemsProvider());
        return;
      }
    }
  };

  open(origin: { x: number; y: number }, items: readonly ContextMenuItem[]): void {
    this.close();

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(origin)
      .withPositions([
        { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'top' },
        { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'bottom' },
      ])
      .withPush(true);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const componentRef = this.overlayRef.attach(new ComponentPortal(ContextMenuComponent));
    componentRef.setInput('items', items);

    componentRef.instance.closed.subscribe(() => this.close());
    this.overlayRef.backdropClick().subscribe(() => this.close());
    this.overlayRef.keydownEvents().subscribe((event) => {
      if (event.key === 'Escape') this.close();
    });
  }

  close(): void {
    this.overlayRef?.dispose();
    this.overlayRef = null;
  }
}
