import { Component, inject, OnInit } from '@angular/core';
import { AuthStore } from '../auth/store/AuthStore';

@Component({
  selector: 'app-dashboard-component',
  imports: [],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.css',
})
export class DashboardComponent {
  readonly authStore = inject(AuthStore);

  constructor() {
    console.log(this.authStore.userConnected());
  }
}
