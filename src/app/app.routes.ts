import { Routes } from '@angular/router';
import { PendingApprovalComponent } from './features/auth/pending-approval/pending-approval.component';
import { requireAuthGuard, requirePendingRoleGuard, requireGuestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent),
    canActivate: [requireGuestGuard]
  },
  {
    path: 'oauth/callback',
    loadComponent: () => import('./features/auth/callback/callback.component').then(m => m.CallbackComponent),
    canActivate: [requireGuestGuard]
  },
  {
    path: 'pending-approval',
    component: PendingApprovalComponent,
    canActivate: [requirePendingRoleGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent),
    canActivate: [requireAuthGuard],
    title: 'SFMS | Dashboard'
  },
  {
    path: 'admin',
    canActivate: [requireAuthGuard],
    children: [
      {
        path: 'pending-users',
        loadComponent: () => import('./features/admin/pending-users/pending-users/pending-users').then(m => m.PendingUsersComponent),
        title: 'SFMS | Pending Users'
      },
      {
        path: 'configuration',
        loadComponent: () => import('./features/admin/configuration/configuration/configuration').then(m => m.ConfigurationComponent),
        title: 'SFMS | Configuration'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];