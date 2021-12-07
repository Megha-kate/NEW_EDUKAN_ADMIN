import { Injectable } from '@angular/core';
import {HttpClient, HttpParams, HttpErrorResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthorizeService } from './authorize.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CreditServiceService {

  private ListUrl = `${environment.Edukanadmin}/api/v1/ecom/admin/list/credit_list/`;
  private CreditListURL  = `${environment.Edukanadmin}/api/v1/ecom/admin/CreditMasterList/     `;
  private CreditLogURL =  `${environment.EdukanVss}/api/v1/ecom/admin/credit_log_list/  `;
  private SaveCreditURL  = `${environment.EdukanVss}/api/v1/ecom/admin/addCredit/     `;
  private FleetOwnerListUrl = `${environment.EdukanVss}/api/v1/ecom/admin/CreditListWithMappingList/    `;
  
  constructor(private http: HttpClient,private auth: AuthorizeService) { }

  List(data:any):Observable<any>
  {
     return this.http.post<any>(this.ListUrl,data).pipe(catchError(err => of(err)));
  } 

  CreditList(data:any):Observable<any>
  {
     return this.http.post<any>(this.CreditListURL,data).pipe(catchError(err => of(err)));
  } 

  CreditLog(data:any):Observable<any>
  {
     return this.http.post<any>(this.CreditLogURL,data).pipe(catchError(err => of(err)));
  } 

  SaveCredit(data:any):Observable<any>
  {
     return this.http.post<any>(this.SaveCreditURL,data).pipe(catchError(err => of(err)));
  } 
  FleetOwnerList(data:any):Observable<any>
  {
     return this.http.post<any>(this.FleetOwnerListUrl,data).pipe(catchError(err => of(err)));
  } 
}
