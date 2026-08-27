import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'payments' },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then((module) => module.LoginComponent) },
  { path: 'payments', canActivate: [authGuard], loadComponent: () => import('./features/payments/components/payment-list.component').then((module) => module.PaymentListComponent) },
  { path: '**', redirectTo: 'payments' }
];