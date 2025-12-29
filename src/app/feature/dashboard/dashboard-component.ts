import { Component, inject, OnInit } from '@angular/core';
import { AuthStore } from '../auth/store/AuthStore';
import { SidebarComponent } from "./components/sidebar-component/sidebar-component";

@Component({
  selector: 'app-dashboard-component',
  imports: [SidebarComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  readonly authStore = inject(AuthStore);

  constructor() {
    console.log(this.authStore.userConnected());
  }
}
