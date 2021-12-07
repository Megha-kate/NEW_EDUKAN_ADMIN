import { Injectable } from '@angular/core';


import {HttpClient,HttpParams, HttpErrorResponse} from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { AuthorizeService } from './authorize.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportServicesService {

  private PartwiseListURL = `${environment.Edukanadmin}/api/v1/ecom/admin/mis_report_part_level/`;
  private InvoiceWiseListURL  = `${environment.Edukanadmin}/api/v1/ecom/admin/mis_report_invoice_level/`;

  private DeliverytimelineURL = `${environment.Edukanadmin}/api/v1/ecom/admin/delivery_mis_report/`;
  private InvoicelvelmisURL =  `${environment.Edukanadmin}/api/v1/ecom/admin/mis_report_invoice_level/`;
  private OrderdetailsmisURL =  `${environment.Edukanadmin}/api/v1/ecom/admin/mis_report_part_level/`;

  private InvoicetimelineURL  = `${environment.Edukanadmin}/api/v1/ecom/admin/invoices_mis_report/`;
  private GetEtaReportURL = `${environment.Edukanadmin}/api/v1/ecom/admin/get/eta_list/`;

  
  constructor(private http: HttpClient,private auth: AuthorizeService) { }


  
  private getToken=this.auth.getToken();
 
  


 
 


  

  PartwiseList(Data: any):Observable<any>
  {
    return this.http.post(this.PartwiseListURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }



  
  Deliverytimeline(Data: any):Observable<any>
  {
    return this.http.post(this.DeliverytimelineURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  Invoicetimeline(Data: any):Observable<any>
  {
    return this.http.post(this.InvoicetimelineURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  InvoiceLevelMisData(Data: any):Observable<any>
  {
    return this.http.post(this.InvoicelvelmisURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }


  InvoiceWiseList(Data: any):Observable<any>
  {
    return this.http.post(this.InvoiceWiseListURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  OrderDetailsMis(Data: any):Observable<any>
  {
    return this.http.post(this.OrderdetailsmisURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
  
  GetEtatReport(Data: any): Observable<any> {
    return this.http.post(this.GetEtaReportURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

}
