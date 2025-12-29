import { Routes } from '@angular/router';

export const routes: Routes = [
  {path : '', loadComponent: () => import('./feature/auth/auth.component').then(m => m.AuthComponenent) },
  {path : 'dashboard', loadComponent : () => import('./feature/dashboard/dashboard-component').then(m => m.DashboardComponent)}
];
