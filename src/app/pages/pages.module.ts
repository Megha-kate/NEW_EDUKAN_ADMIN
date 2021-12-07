import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component'
import { PagesRoutingModule } from './pages-routing.module';
import { AdminlayoutComponent } from './../shared/component/Layout/adminlayout/adminlayout.component'
import { HeaderComponent } from '../shared/component/header/header.component';
import { TimeLineInvoiceComponent } from './Reports/time-line-invoice/time-line-invoice.component';
import { NgbModule, NgbDatepickerModule, } from '@ng-bootstrap/ng-bootstrap';
import { UserListComponent } from './UserManagment/user-list/user-list.component';
import { SharedComponentsModule } from './../shared/component/shared-components.module';
import { AdminRolemasterComponent } from './UserManagment/admin-rolemaster/admin-rolemaster.component'
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { WebRolemasterComponent } from './UserManagment/web-rolemaster/web-rolemaster.component';
import { OrderTrackingComponent } from './Order Managment/order-tracking/order-tracking.component';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DeliveryTimeLineComponent } from './Reports/delivery-time-line/delivery-time-line.component';
import { InvoiceLevelMisComponent } from './Reports/invoice-level-mis/invoice-level-mis.component';
import { OrderDetailsMisComponent } from './Reports/order-details-mis/order-details-mis.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { OrderHistoryComponent } from './Order Managment/order-history/order-history.component';
import { SharedModule } from './../shared/shared.module';
import { FeedbackListComponent } from './Order Managment/Feedback-List/feedback-list/feedback-list.component';
import { StarRatingModule } from 'angular-star-rating';
import { CancleListComponent } from './Order Managment/Cancle-List/cancle-list/cancle-list.component';
import { CreditLimitComponent } from './Credit/credit-limit/credit-limit.component';
import { DigiVorSearchComponent } from './digi-vor-search/digi-vor-search.component';
import { ReturnListsComponent } from './Order Managment/return-lists/return-lists.component';
import { SearchDetailsComponent } from './digi-vor-search/search-details/search-details.component';
import { InfodetailpopupComponentComponent } from './digi-vor-search/search-details/infodetailpopup-component/infodetailpopup-component.component';
import { MaterialModule } from './../shared/material/material.module';
import { FleetOwnerUploadComponent } from './Credit/fleet-owner-upload/fleet-owner-upload.component';
//import { AgmCoreModule } from '@agm/core';
import { DiscountMasterComponent } from './Pricing & Discount/discount-master/discount-master.component';
import { CustomerDetailsComponent } from './Pricing & Discount/customer-details/customer-details.component';
import { AgmCoreModule, AgmMap, AgmMarker } from '@agm/core';
//import { SelectAutocompleteModule } from 'mat-select-autocomplete';
//import { BrowserModule } from '@angular/platform-browser'

import { MatButtonModule } from '@angular/material/button';
//import { ListComponent } from './master/List/list.component';
//import{ListComponent} from './m'
import { PartMasterComponent } from './master/part-master/part-master.component';
import { DivisionMasterComponent } from './master/Division_master/division-master/division-master.component';
import { BannerComponent } from './Banner/banner/banner.component';
import { MatSelectModule } from '@angular/material/select';
import { PoListComponent } from './Order Managment/Po-List/po-list/po-list.component';
import { PartQueryComponent } from './master/part_Query/part-query/part-query.component';
import { EtaListComponent } from './Reports/eta-list/eta-list.component';
import { UserRegistrationComponent } from './UserManagment/user-registration/user-registration.component';
import { HelplineQueryComponent } from './master/helpline-query/helpline-query.component';
import { InvoicePaymentListComponent } from './Order Managment/invoice-payment-list/invoice-payment-list.component';
//import { EtaReportComponent } from './Reports/ETA Report/eta-report/eta-report.component';
//import { SelectAutocompleteModule } from 'mat-select-autocomplete';
//import { BarchartComponent } from './barchart/barchart.component';  
//import { MatTooltipModule } from "@angular/material/tooltip";




@NgModule({
  declarations: [HomeComponent, TimeLineInvoiceComponent, UserListComponent, AdminRolemasterComponent, WebRolemasterComponent, OrderTrackingComponent, DeliveryTimeLineComponent, InvoiceLevelMisComponent, OrderDetailsMisComponent, OrderHistoryComponent, FeedbackListComponent,
    CancleListComponent, DigiVorSearchComponent,
    CreditLimitComponent,
    ReturnListsComponent, SearchDetailsComponent, InfodetailpopupComponentComponent, FleetOwnerUploadComponent, DiscountMasterComponent, CustomerDetailsComponent, PartMasterComponent, DivisionMasterComponent, BannerComponent, PoListComponent, PartQueryComponent, EtaListComponent, UserRegistrationComponent, HelplineQueryComponent, InvoicePaymentListComponent, ],
  imports: [SharedComponentsModule,
    CommonModule, MatCheckboxModule,
    //SelectAutocompleteModule,
    MatSelectModule,
    PagesRoutingModule, NgbModule, NgbDatepickerModule, ReactiveFormsModule, MatDatepickerModule, FormsModule,
    MatNativeDateModule,
    MatAutocompleteModule, MatFormFieldModule, MatInputModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SharedModule,
    MaterialModule,
   // MatTooltipModule,
   // BrowserModule,
  // BarchartComponent,  


    MatButtonModule,
    StarRatingModule.forRoot(),


    AgmCoreModule

  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },

  ]
})
export class PagesModule { }
