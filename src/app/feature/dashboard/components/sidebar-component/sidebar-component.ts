import { MatIconModule } from '@angular/material/icon';
import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from '../../types/menu';
import { DashboardViewEnum } from '../../enum/DashboardViewEnum';
@Component({
  selector: 'app-sidebar-component',
  imports: [MatIconModule, CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  readonly menuItems: InputSignal<Menu[]> = input.required<Menu[]>();
  readonly changeViewOuput: OutputEmitterRef<DashboardViewEnum> = output<DashboardViewEnum>();


  protected changeView({ view }: Menu): void {
    this.changeViewOuput.emit(view);
  }
}
