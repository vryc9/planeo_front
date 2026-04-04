import { MatIconModule } from '@angular/material/icon';
import { Component, input, InputSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { injectDispatch } from '@ngrx/signals/events';
import { DashboardEvents } from '../../store/DashboardEvents';
import { Menu } from '../../types/menu';
@Component({
  selector: 'app-sidebar-component',
  imports: [MatIconModule, CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  readonly dispatch = injectDispatch(DashboardEvents);
  readonly menuItems: InputSignal<Menu[]> = input.required<Menu[]>();


  protected changeView({ view }: Menu): void {
    this.dispatch.openMenu({ view });
  }
}
