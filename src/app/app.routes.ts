// import { Routes } from '@angular/router';

// export const routes: Routes = [];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/coming-soon/coming-soon.component').then(m => m.ComingSoonComponent),
    title: 'SFMS | Home'
  },
  {
    path: '**',
    redirectTo: ''
  }
];