import { MatIconModule } from '@angular/material/icon';
import { Component, inject, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Menu } from '../../types/menu';
import { DashboardViewEnum } from '../../enum/DashboardViewEnum';
import { TokenService } from '../../../auth/service/token.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-sidebar-component',
  imports: [MatIconModule, CommonModule],
  templateUrl: './sidebar-component.html',
  styleUrl: './sidebar-component.css',
})
export class SidebarComponent {
  readonly menuItems: InputSignal<Menu[]> = input.required<Menu[]>();
  readonly changeViewOuput: OutputEmitterRef<DashboardViewEnum> = output<DashboardViewEnum>();
  private readonly tokenService = inject(TokenService)
  private readonly router = inject(Router);


  protected changeView({ view }: Menu): void {
    this.changeViewOuput.emit(view);
  }

  protected logout() : void {
    this.tokenService.removeToken();
    this.router.navigate(["/"], {replaceUrl : true})
  }
}
