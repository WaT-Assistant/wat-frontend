import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Landing } from './features/landing/landing';
import {LoginPageComponent} from './features/auth/loginpage/loginpage';
import{RegisterPageComponent} from './features/auth/registerpage/registerpage';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        component: Landing
      },
      {
        path: 'login',
        component: LoginPageComponent
      },
      {
        path: 'register',
        component: RegisterPageComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
      },

      { path: '**', redirectTo: '' }
    ]
  },

];