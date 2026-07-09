import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Landing } from './features/landing/landing';
import {LoginPageComponent} from './features/auth/loginpage/loginpage';
import{RegisterPageComponent} from './features/auth/registerpage/registerpage';
import { authGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './features/dashboard/dashboard';
import { PublicOffersPage } from './features/public-offers-page/public-offers-page';
import { unauthGuard } from './core/guards/unauth.guard';

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
        component: LoginPageComponent,
        canActivate: [unauthGuard]
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        canActivate: [unauthGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [authGuard]
      },
      {
        path: 'public-offers',
        component: PublicOffersPage
      },

      { path: '**', redirectTo: '' }
    ]
  },

];