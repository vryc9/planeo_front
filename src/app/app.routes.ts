import { Routes } from '@angular/router';

export const routes: Routes = [
  {path : '', loadComponent: () => import('./feature/auth/auth').then(m => m.AuthComponenent) },
];
