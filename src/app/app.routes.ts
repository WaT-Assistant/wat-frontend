import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Landing } from './features/landing/landing';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Landing
      }
    ]
  }
];