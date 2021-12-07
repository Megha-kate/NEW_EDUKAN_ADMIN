//import { NgModule } from '@angular/core';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import {AuthLayoutComponent} from './Layout/auth-layout/auth-layout.component'
import {AdminlayoutComponent} from './Layout/adminlayout/adminlayout.component'

import {FooterComponent} from './footer/footer.component'
import {HeaderComponent} from './header/header.component'
import {PaginationComponent} from './pagination/pagination.component'
// ONLY REQUIRED FOR **TOP** NAVIGATION LAYOUT
import { CommonModule } from "@angular/common";
import { DatePipe } from '@angular/common';
import {OrderDetailsComponent} from './modals/order-details/order-details.component'
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { NgbModule,NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import {SubmenuListComponent} from './submenu-list/submenu-list.component'
import { AppLoaderComponent } from './app-loader/app-loader.component';
import { AppLoaderService } from "./app-loader/app-loader.service";
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {OrderPopupComponent} from './modals/order-popup/order-popup.component';
import {CashInvoiceLogComponent} from './modals/cash-invoice-log/cash-invoice-log.component';
import {TackingRejectInvoicePopupComponent} from './modals/tacking-reject-invoice-popup/tacking-reject-invoice-popup.component';
import {FailOrderPopupComponent} from './modals/fail-order-popup/fail-order-popup.component';
import {ReportDownloadPopupComponent} from './modals/report-download-popup/report-download-popup.component';
import {CancelListPopupComponent} from './modals/cancel-list-popup/cancel-list-popup.component';
import {CreditLogComponent} from './modals/credit-log/credit-log.component';
import {AddLimitPopupComponent} from './modals/add-limit-popup/add-limit-popup.component';
import {EtaPopupComponent} from './modals/eta-popup/eta-popup.component';
import {PaymentDetailPopupComponent} from './modals/payment-detail-popup/payment-detail-popup.component';
import { StarRatingModule } from 'angular-star-rating';
import {CommentPopupComponent} from './modals/comment-popup/comment-popup.component';
import {InvoiceCopyComponent} from './modals/invoice-copy/invoice-copy.component';
//import {InfoPopupComponent} from './modals/info-popup/info-popup.component';
import {CustomerListPopupComponent} from './modals/customer-list-popup/customer-list-popup.component';
import {DiscountMasterPopupComponent} from './modals/discount-master-popup/discount-master-popup.component';
import {DigiVorStockPopupComponent}from './modals/digi-vor-stock-popup/digi-vor-stock-popup.component'
import {MaterialModule}from '../material/material.module';
import{InfodetailpopupComponent} from './modals/infodetailpopup-component/infodetailpopup/infodetailpopup.component'

import { AgmCoreModule } from '@agm/core';



const components = [SubmenuListComponent,CurrencyFormatPipe,AppLoaderComponent,OrderDetailsComponent,AuthLayoutComponent,AdminlayoutComponent,FooterComponent,HeaderComponent,PaginationComponent,OrderPopupComponent,
  CashInvoiceLogComponent,TackingRejectInvoicePopupComponent,FailOrderPopupComponent,ReportDownloadPopupComponent,CancelListPopupComponent,CreditLogComponent,AddLimitPopupComponent,EtaPopupComponent,PaymentDetailPopupComponent,
  CommentPopupComponent,InvoiceCopyComponent,CustomerListPopupComponent,DiscountMasterPopupComponent,DigiVorStockPopupComponent,InfodetailpopupComponent]

@NgModule({
  imports: [
     ReactiveFormsModule,
     CommonModule,MatDialogModule,
    RouterModule,NgbModule,NgbDatepickerModule,
    MatIconModule,
    FormsModule,
    StarRatingModule.forRoot(),

    AgmCoreModule,
    MaterialModule
    
  ],
  providers: [DatePipe,AppLoaderService],
  declarations: components,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],

  entryComponents: [],
  exports: components
})
export class SharedComponentsModule {}