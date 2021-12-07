import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import {AuthLayoutComponent} from './shared/component/Layout/auth-layout/auth-layout.component'
import {AdminlayoutComponent} from './shared/component/Layout/adminlayout/adminlayout.component'
import { AuthGuard } from './shared/Services/auth/auth.guard';

export const rootRouterConfig: Routes = [
  {
    path: '',
    redirectTo: 'session/Login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'session',
        loadChildren: () => import('./session/session.module').then(m => m.SessionModule),
        data: { title: ''}
      }
    ]
  },
  {
    path: '',
    component: AdminlayoutComponent,
    canActivate: [],
    children: [
     
      {
        path: 'pages',
        loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
        data: { title: 'Pages', breadcrumb: 'PAGES'}
      }
    ]
  }
  
  ];