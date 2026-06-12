import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Landing } from './features/landing/landing';
import {LoginPageComponent} from './features/auth/loginpage/loginpage';
import{RegisterPageComponent} from './features/auth/registerpage/registerpage';

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
  }
    ]
  },

];