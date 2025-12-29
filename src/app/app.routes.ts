import { Routes } from '@angular/router';
import { accessDashboardGuard } from './guards/access-dashboard-guard';
import { AuthComponenent } from './feature/auth/auth.component';

export const routes: Routes = [
  {path : '', loadComponent: () => import('./feature/auth/auth.component').then(m => m.AuthComponenent) },
  {path : 'dashboard', loadComponent : () => import('./feature/dashboard/dashboard-container-component').then(m => m.DashboardContainerComponent), canActivate : [accessDashboardGuard]},
  {path: '**', component: AuthComponenent},
];
