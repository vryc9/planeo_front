import { Routes } from '@angular/router';
import { accessDashboardGuard } from './guards/access-dashboard-guard';
import { AuthComponenent } from './feature/auth/auth.component';

export const routes: Routes = [
  {path : '', loadComponent: () => import('./feature/auth/auth.component').then(m => m.AuthComponenent) },
  {path : 'register', loadComponent: () => import('./feature/register/register.component').then(m => m.RegisterComponent) },
  {path : 'dashboard', loadComponent : () => import('./feature/dashboard/dashboard-container-component').then(m => m.DashboardContainerComponent), canActivate : [accessDashboardGuard]},
  {path : 'balance', loadComponent : () => import('./feature/account/components/onboarding-create-account/onboarding-create-account').then(m => m.OnboardingCreateAccountComponent), canActivate : [accessDashboardGuard]},
  {path: '**', component: AuthComponenent},
];
