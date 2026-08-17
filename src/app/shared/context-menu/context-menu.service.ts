import { Injectable, inject } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ContextMenuItem } from './context-menu-item';
import { ContextMenuComponent } from './context-menu-component';

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  private readonly overlay = inject(Overlay);
  private overlayRef: OverlayRef | null = null;

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
