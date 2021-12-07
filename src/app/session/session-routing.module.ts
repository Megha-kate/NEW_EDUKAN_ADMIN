import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component'
const routes: Routes = [];




export const SessionsRoutes: Routes = [
  {
    path: "",
    children: [
      {
        path: "Login",
        component: LoginComponent,
        data: { title: "Login" }
      }
    ]
  }
];
