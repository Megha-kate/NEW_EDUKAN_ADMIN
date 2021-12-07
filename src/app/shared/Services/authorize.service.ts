import { Injectable } from '@angular/core';
import {HttpClient,HttpParams, HttpErrorResponse} from '@angular/common/http'
import {catchError, map} from 'rxjs/operators';
import {BehaviorSubject, forkJoin, of, throwError, Observable} from 'rxjs';
import {Router} from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  private LoginUrl = `${environment.Edukanadmin}/api/v1/ecom/admin/login/`;

  constructor(private http: HttpClient, private _Router: Router) { }


  loginAuth(data: any): Observable<any> {
   debugger
     return this.http.post<any>(this.LoginUrl,data).pipe();
  }
 
  ExpireDateTime: any;
 

  public getToken() {
    
    const Tocken = localStorage.getItem('token'); 
    
   return localStorage.getItem('token');
   //return  JSON.parse(localStorage.getItem('token')!);;
  }
 
  handlError(error: HttpErrorResponse) {
    return throwError(error);
  }


  loggedOut() {
    // alert('LogOut');
    debugger
     localStorage.removeItem('token');
 
     localStorage.removeItem('token');
   
     localStorage.removeItem('loginData');
    
 
     localStorage.removeItem('PageDetails');
     localStorage.removeItem('ORGName');
     localStorage.removeItem('timer');
     localStorage.removeItem("ToDate");
     localStorage.removeItem("FromDate");
     
     localStorage.clear();
     
    
    this._Router.navigate(['session/Login']);
    
   }
}
