import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component'
import { AuthGuard } from '../shared/Services/auth/auth.guard';
import { TimeLineInvoiceComponent } from './Reports/time-line-invoice/time-line-invoice.component';
//import { UserListComponent } from './UserManagment/user-list/user-list.component';
import { AdminRolemasterComponent } from './UserManagment/admin-rolemaster/admin-rolemaster.component'
import { WebRolemasterComponent } from './UserManagment/web-rolemaster/web-rolemaster.component';
import { OrderTrackingComponent } from './Order Managment/order-tracking/order-tracking.component';
import { DeliveryTimeLineComponent } from './Reports/delivery-time-line/delivery-time-line.component';
import { InvoiceLevelMisComponent } from './Reports/invoice-level-mis/invoice-level-mis.component';
import { OrderDetailsMisComponent } from './Reports/order-details-mis/order-details-mis.component';
import { OrderHistoryComponent } from './Order Managment/order-history/order-history.component';
import { FeedbackListComponent } from './Order Managment/Feedback-List/feedback-list/feedback-list.component';
import { CancleListComponent } from './Order Managment/Cancle-List/cancle-list/cancle-list.component';
import { CreditLimitComponent } from './Credit/credit-limit/credit-limit.component';
import { DigiVorSearchComponent } from './digi-vor-search/digi-vor-search.component';
import { ReturnListsComponent } from './Order Managment/return-lists/return-lists.component';
import { FleetOwnerUploadComponent } from './Credit/fleet-owner-upload/fleet-owner-upload.component';
import { DiscountMasterComponent } from './Pricing & Discount/discount-master/discount-master.component';
import { CustomerDetailsComponent } from './Pricing & Discount/customer-details/customer-details.component';

import { PartMasterComponent } from './master/part-master/part-master.component';
import { DivisionMasterComponent } from './master/Division_master/division-master/division-master.component';
import { BannerComponent } from './Banner/banner/banner.component';
import { PoListComponent } from './Order Managment/Po-List/po-list/po-list.component';
import { PartQueryComponent } from './master/part_Query/part-query/part-query.component';
import { EtaListComponent } from './Reports/eta-list/eta-list.component';
import { UserRegistrationComponent } from './UserManagment/user-registration/user-registration.component';
import { HelplineQueryComponent } from './master/helpline-query/helpline-query.component';
import { InvoicePaymentListComponent } from './Order Managment/invoice-payment-list/invoice-payment-list.component';

const routes: Routes = [
  { path: 'Dashboard', component: HomeComponent, data: { title: 'Dashboard1 ', breadcrumb: 'Dashboard1' } },
  { path: 'InvoicingTimeLine', component: TimeLineInvoiceComponent, data: { title: 'MISInvoiceWiseDetails', breadcrumb: 'MISInvoiceWiseDetails' } },
  { path: 'DeliveryTimeLine', component: DeliveryTimeLineComponent, data: { title: 'MISInvoiceWiseDetails', breadcrumb: 'MISInvoiceWiseDetails' } },
  { path: 'InvoiceLevelMis', component: InvoiceLevelMisComponent, data: { title: 'MISInvoiceWiseDetails', breadcrum: 'MISInvoiceWiseDetails' } },
  { path: 'ETAReport', component: EtaListComponent, data: { title: 'EtaListComponent', breadcrum: 'EtaListComponent' } },
  { path: 'UserRegistrationList', component: UserRegistrationComponent, data: { title: 'UserRegistrationComponent', breadcrum: 'UserRegistrationComponent' } },

  { path: 'OrderDetailslMis', component: OrderDetailsMisComponent, data: { title: 'MISInvoiceWiseDetails', breadcrum: 'MISInvoiceWiseDetails' } },
  { path: 'RolePosition', component: AdminRolemasterComponent, data: { title: 'Users List', breadcrumb: 'Users List' } },
  { path: 'WebRolePosition', component: WebRolemasterComponent, data: { title: 'Users List', breadcrumb: 'Users List' } },
  { path: 'OrderTracking', component: OrderTrackingComponent, data: { title: 'OrderTrackingComponent', breadcrumb: 'OrderTrackingComponent' } },
  { path: 'OrderHistory', component: OrderHistoryComponent, data: { title: 'OrderHistoryComponent', breadcrumb: 'OrderHistoryComponent' } },
  { path: 'FeedBackList', component: FeedbackListComponent, data: { title: 'FeedbackListComponent', breadcrumb: 'FeedbackListComponent' } },
  { path: 'CancleList', component: CancleListComponent, data: { title: 'CancleListComponent', breadcrumb: 'CancleListComponent' } },
  { path: 'CreditLimit', component: CreditLimitComponent, data: { title: 'CreditLimitComponent', breadcrumb: 'CreditLimitComponent' } },
  { path: 'DigiVorSearch', component: DigiVorSearchComponent, data: { title: 'DigiVorSearchComponent', breadcrumb: 'DigiVorSearchComponent' } },
  { path: 'ReturnList', component: ReturnListsComponent, data: { title: 'ReturnListComponent', breadcrumb: 'ReturnListComponent' } },
  { path: 'FleetOwnerUpload', component: FleetOwnerUploadComponent, data: { title: 'FleetOwnerUploadComponent', breadcrumb: 'FleetOwnerUploadComponent' } },
  { path: 'DiscountMaster', component: DiscountMasterComponent, data: { title: 'DiscountMasterComponent', breadcrumb: 'DiscountMasterComponent' } },
  { path: 'CustomerDetails', component: CustomerDetailsComponent, data: { title: 'CustomerDetailsComponent', breadcrumb: 'CustomerDetailsComponent' } },
  { path: 'PartMaster', component: PartMasterComponent, data: { title: 'PartMasterComponent', breadcrumb: 'PartMasterComponent' } },
  { path: 'DivisionMaster', component: DivisionMasterComponent, data: { title: 'DivisionMasterComponent', breadcrumb: 'DivisionMasterComponent' } },
  { path: 'Banner', component: BannerComponent, data: { title: 'BannerComponent', breadcrumb: 'BannerComponent' } },
  { path: 'POList', component: PoListComponent, data: { title: 'PoListComponent', breadcrumb: 'PoListComponent' } },
  {path:'PartQuery',component:PartQueryComponent,data:{title:'PartQueryComponent' ,breadcrumb:'PartQueryComponent'}},
  {path:'HelpLineQuery',component:HelplineQueryComponent,data:{title:'HelplineQueryComponent' ,breadcrumb:'HelplineQueryComponent'}},
  {path:'InvoicePaymentList',component:InvoicePaymentListComponent,data:{title:'InvoicePaymentListComponent' ,breadcrumb:'InvoicePaymentListComponent'}}




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
