import { MatIconModule } from '@angular/material/icon';
import { Component, computed, inject, input, InputSignal, output, OutputEmitterRef, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from '../../types/menu';
import { DashboardViewEnum } from '../../enum/DashboardViewEnum';
import { Router } from '@angular/router';
import { injectDispatch } from '@ngrx/signals/events';
import { AuthEvent } from '../../../auth/store/AuthEvent';
import { AuthStore } from '../../../auth/store/AuthStore';
@Component({
  selector: 'app-sidebar-component',
  imports: [MatIconModule, CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  readonly menuItems: InputSignal<Menu[]> = input.required<Menu[]>();
  readonly changeViewOuput: OutputEmitterRef<DashboardViewEnum> = output<DashboardViewEnum>();
  private readonly dispatch = injectDispatch(AuthEvent)
  private readonly router = inject(Router);
  protected readonly authStore = inject(AuthStore);

  protected readonly userInitials: Signal<string> = computed(() => {
    const username = this.authStore.userConnected()?.username ?? '';
    const parts = username.split(/[\s._-]+/).filter(Boolean);
    const initials = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
    return (initials || username.slice(0, 2)).toUpperCase();
  });

  protected changeView({ view }: Menu): void {
    this.changeViewOuput.emit(view);
  }

  protected logout() : void {
    this.dispatch.logout()
  }
}
