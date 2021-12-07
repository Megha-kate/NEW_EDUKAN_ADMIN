import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import {SessionsRoutes} from './session-routing.module'
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [LoginComponent],
  imports: [
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(SessionsRoutes)
   
  ], providers: [DatePipe]
})
export class SessionModule { }
