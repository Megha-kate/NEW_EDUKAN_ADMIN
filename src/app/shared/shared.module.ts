import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//import {AdminlayoutComponent} from './component/Layout/adminlayout/adminlayout.component'
import { RouterModule } from '@angular/router';
import { NgbModule,NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
//mport { AuthorizeService } from './services/authorize.service';
import { SharedComponentsModule } from './component/shared-components.module';
// import {AppinterceptorService} from '../shared/services/appinterceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthorizeService } from './Services/authorize.service';
import { AppinterceptorService } from './Services/appinterceptor.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule} from '@angular/forms';
import {AppConfirmService} from './Services/app-confirm.service';
import {AppComfirmComponent} from './Services/app-confirm.component';
@NgModule({
  declarations: [AppComfirmComponent],
  imports: [
    CommonModule,
    SharedComponentsModule,NgbModule,NgbDatepickerModule,FormsModule,ReactiveFormsModule
  ],
  exports: [
    SharedComponentsModule,
    
  
  ],
  
  providers: [
 AuthorizeService,
 AppConfirmService,
     {provide: HTTP_INTERCEPTORS, useClass: AppinterceptorService, multi: true},
    // should add here
  ]
})
export class SharedModule { }
