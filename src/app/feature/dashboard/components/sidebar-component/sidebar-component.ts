import { MatIconModule } from '@angular/material/icon';
import { Component, signal, WritableSignal } from '@angular/core';
import { Menu } from './menu';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar-component',
  imports: [MatIconModule, CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  menuItems: WritableSignal<Menu[]> = signal<Menu[]>([
    {
      text: "Dashboard",
      isActive: true,
      icon: "space_dashboard"
    },
    {
      text: "Calendrier",
      isActive: false,
      icon: "calendar_today"
    },
    {
      text: "Dépenses",
      isActive: false,
      icon: "euro"
    }
  ]);

  toggleActive(menu: Menu): void {
    this.menuItems.update(currentItems =>
      currentItems.map(item => ({
        ...item,
        isActive: item === menu
      }))
    );
  }
}
