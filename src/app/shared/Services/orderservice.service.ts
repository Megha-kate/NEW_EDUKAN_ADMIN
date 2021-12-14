import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthorizeService } from './authorize.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrderserviceService{
  private AllOrderTrakingistURL = `${environment.Edukanadmin}/api/v1/ecom/admin/list/InvoiceAll/  `;
  private OrderTrakingistURL = `${environment.Edukanadmin}/api/v2/ecom/admin/invoice_tracking_list/`;  
  private OrderListURL = `${environment.Edukanadmin}/api/v2/ecom/admin/otc_order_list/`;
  private PoListURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_so_details/`;

  private InvoiceListURL = `${environment.Edukanadmin}/api/v1/ecom/admin/InvoiceDetailWithPdf/ `;
  private updateStatusURL = `${environment.Edukanadmin}/api/v1/ecom/admin/TrackingStatusChange/ `;
  private InvoiceTATAPI = `${environment.Edukanadmin}/api/v1/ecom/admin/list/GetTatListBasedInvoice/   `;
  private CashInvoiceTATAPI = `${environment.Edukanadmin}/api/v2/ecom/admin/cash_invoice_tat/`;  
  private FailOrderListURL = `${environment.Edukanadmin}/api/v1/ecom/admin/OrderHistoryAdminView/`;
  private OtcOrderListURL = `${environment.Edukanadmin}/api/v2/ecom/admin/otc_order_list/`;
  private PaymentInfoURL = `${environment.Edukanadmin}/api/v1/ecom/admin/order_by_id/    `;
  private FeedbackListURL = `${environment.Edukanadmin}/api/v1/ecom/admin/feedback_list/   `;
  private CancelOrderListURL = `${environment.Edukanadmin}/api/v1/ecom/admin/cancel_orders_list/`;
  private GetInvoiceListURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_invoice_list/`;
  private CancelOrderDetailsURL = `${environment.Edukanadmin}/api/v1/ecom/admin/cancel_order_detail/`;
  private OtcOrderDetailsURL = `${environment.Edukanadmin}/api/v2/ecom/admin/otc_order_details/`;
  private GetETAURL = `${environment.Edukanadmin}/api/v1/ecom/admin/eta_for_order/`;
  private PaymentHistoryURL = `${environment.Edukanadmin}/api/v1/ecom/admin/payment_detail/`;
  private GetPaymentDetailsURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_payment_details/`;
  private ReturnOrderListURL = `${environment.Edukanadmin}/api/v1/ecom/admin/cancel_orders_list/`
  private GetInvoiceCopyURL = `${environment.Edukanadmin}/api/v1/ecom/admin/InvoiceDetailWithPdf/`;
  private AccountListURL = `${environment.Edukanadmin}/api/v1/ecom/admin/ecom_account_list/`;
  private AccountDiscountURL = `${environment.Edukanadmin}/api/v1/ecom/admin/get/account_discount_matrix/`;
  private UpdateListURL = `${environment.Edukanadmin}/api/v2/ecom/admin/add_or_update_division_allocation/`;
  private DivisionMasterURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_division_allocation_list/`;
  private PartMasterURL = `${environment.Edukanadmin}/api/v1/ecom/admin/get_part_list/`;
  private StatisticsOfPageURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_statistics_of_page/`;
  private GETDivisiorDivisionDataURL = `${environment.Edukanadmin}/api/get/location_details/`;
  private GETDivisorDetailDataURL = `${environment.Edukanadmin}/api/search/locations_for_part/`;
  private PoOrderListDataURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_so_list/`;
  private partQueryDataURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_part_query_list/`;
  private PODetailsURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_so_details/`;
  private helplineQueryURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_helpline_query_list/`;
  private InvoicePaymentURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_invoice_list/`;
  private InvoicePaymentupdateURL = `${environment.Edukanadmin}/api/v2/ecom/admin/invoice_payment_status_update/`;







  constructor(private http: HttpClient,private auth: AuthorizeService) { }
  OrderTrackingALlList(Data: any): Observable<any> {
    return this.http.post(this.AllOrderTrakingistURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
 OrderTrackingList(Data: any): Observable<any> {
    return this.http.post(this.OrderTrakingistURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
 OrderList(Data: any): Observable<any> {
    return this.http.post(this.OrderListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
 InvoiceList(Data: any): Observable<any> {
    return this.http.post(this.InvoiceListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  updateStatus(Data: any): Observable<any> {
    return this.http.post(this.updateStatusURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  InvoiceTAT(Data: any): Observable<any> {
    return this.http.post(this.InvoiceTATAPI, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  CashInvoiceTAT(Data: any): Observable<any> {
    return this.http.post(this.CashInvoiceTATAPI, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  FailedOrderList(Data: any): Observable<any> {
    return this.http.post(this.FailOrderListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  OtcOrderList(Data: any): Observable<any> {
    return this.http.post(this.OtcOrderListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  PoList1(Data: any): Observable<any> {
    return this.http.post(this.PoListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  PaymentInfo(Data: any): Observable<any> {
    return this.http.post(this.PaymentInfoURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  FeedbackList(Data: any): Observable<any> {
    return this.http.post(this.FeedbackListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  async OrderListnew(Data :any): Promise<any> {
    return await this.http.post(this.OrderListURL,Data, {headers:{"Content-Type":"application/json"}}).toPromise();
  }
  CancelOrderList(Data: any): Observable<any> {
    return this.http.post(this.CancelOrderListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GetInvoiceList(Data: any): Observable<any> {
    return this.http.post(this.GetInvoiceListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  CancelOrderDetails(Data: any): Observable<any> {
    return this.http.post(this.CancelOrderDetailsURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  OtcOrderDetails(Data: any): Observable<any> {
    return this.http.post(this.OtcOrderDetailsURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GetETA(Data: any): Observable<any> {
    return this.http.post(this.GetETAURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  PaymentHistory(Data: any): Observable<any> {
    return this.http.post(this.PaymentHistoryURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GetPaymentDetails(Data: any): Observable<any> {
    return this.http.post(this.GetPaymentDetailsURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  CancleOrderList(Data: any): Observable<any> {
    return this.http.post(this.ReturnOrderListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GetInvoiceCopy(Data: any): Observable<any> {
    return this.http.post(this.GetInvoiceCopyURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GetAccountList(Data: any): Observable<any> {
    return this.http.post(this.AccountListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GetAccountDiscountMatrix(Data: any): Observable<any> {
    return this.http.post(this.AccountDiscountURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  UpdateList(Data: any): Observable<any> {
    return this.http.post(this.UpdateListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  DivisionMaster(Data: any): Observable<any> {
    return this.http.post(this.DivisionMasterURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  partmaster(Data: any): Observable<any> {
    return this.http.post(this.PartMasterURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GetStatisticsOfPage(Data: any): Observable<any> {
    return this.http.post(this.StatisticsOfPageURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GETDivisiorDivisionData(Data: any): Observable<any> {
    return this.http.post(this.GETDivisiorDivisionDataURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GETDivisorDetailData(Data: any): Observable<any> {
    return this.http.post(this.GETDivisorDetailDataURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  
  }
  PoOrderList(Data: any): Observable<any> {
    return this.http.post(this.PoOrderListDataURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  
  }
  partQuery(Data: any): Observable<any> {
    return this.http.post(this.partQueryDataURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  
  }
  PODetails(Data: any): Observable<any> {
    return this.http.post(this.PODetailsURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  helplineQuery(Data: any): Observable<any> {
    return this.http.post(this.helplineQueryURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  InvoicePayment(Data: any): Observable<any> {
    return this.http.post(this.InvoicePaymentURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  InvoicePaymentUpdate(Data: any): Observable<any> {
    return this.http.post(this.InvoicePaymentupdateURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
}
