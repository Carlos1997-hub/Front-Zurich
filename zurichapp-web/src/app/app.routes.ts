import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },

  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'clients',
        loadComponent: () =>
          import('./features/admin/clients/clients.component').then(m => m.ClientsComponent),
      },
      {
        path: 'clients/:clientId/policies',
        loadComponent: () =>
          import('./features/admin/client-policies/client-policies.component').then(m => m.ClientPoliciesComponent),
      },
      {
        path: 'clients/:clientId/quotes',
        loadComponent: () =>
          import('./features/admin/client-quotes/client-quotes.component').then(m => m.ClientQuotesComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'clients' }
    ],
  },

  {
    path: 'client',
    canActivate: [authGuard],
    children: [
      {
        path: 'policies',
        loadComponent: () =>
          import('./features/client/my-policies/my-policies.component').then(m => m.MyPoliciesComponent),
      },
      {
        path: 'quotes',
        loadComponent: () =>
          import('./features/client/my-quotes/my-quotes.component').then(m => m.MyQuotesComponent),
      },
      { path: '', pathMatch: 'full', redirectTo: 'policies' }
    ],
  },

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' },
];
