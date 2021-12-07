import { Injectable } from '@angular/core';
import { HttpInterceptor,HttpRequest,HttpHandler,HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import {AuthorizeService} from '../Services/authorize.service'
import { catchError } from 'rxjs/operators';
// import Swal from 'sweetalert2';
// import { AppLoaderService } from "app/shared/services/app-loader/app-loader.service";
//  import { MatSnackBar } from '@angular/material';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})




export class AppinterceptorService implements HttpInterceptor {
  private rq: any = false;

  private UploadCsv = `${environment.Edukanadmin}/api/v2/ecom/admin/upload_account_mapping/`;
  private UploadvehiclecsvURL = `${environment.Edukanadmin}/api/v2/ecom/admin/upload_account_mapping/`;
  
  constructor(private auth: AuthorizeService) { }
  handlError(error:HttpErrorResponse)
  {
   // this.loader.close()
    
    return throwError(error)
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
  debugger

    // this.rq = req.url.includes(this.UploadCsv);

    if (req.url.includes(this.UploadCsv)) {
      this.rq = req.url.includes(this.UploadCsv);
    }
    else {
      this.rq = req.url.includes(this.UploadvehiclecsvURL);
    }
  //alert(this.rq)
   
    const headers= new HttpHeaders(
     
      {
        Authorization: `Bearer ${this.auth.getToken()}`,
        //'Content-Type': `application/json`,
       // 'Content-Type': `${this.rq ? "" : 'application/json'}`,
        
      }
    )
    const headers1= new HttpHeaders(
     
      {
        Authorization: `Bearer ${this.auth.getToken()}`,
        //'Content-Type': `application/json`,
        'Content-Type': `${this.rq ? "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW" : 'application/json'}`,
        
      }
    )
    var clone
    if (this.rq)
    {
       clone= req.clone({
        headers:headers1
      })
    }
    else
    {
       clone= req.clone({
        headers:headers
      })
    }

    

    let self = this;
    if (!window.navigator.onLine) {
     // this.loader.close()
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      //return Observable.throw(new HttpErrorResponse({ error: 'Internet is required.' }));
    //  self.snackBar.open('Internet is required.!', 'close', { duration: 3000 });
      return throwError('Internet is required.' );
  } else {

   return next.handle(clone).pipe(
     catchError(error=>{
      // this.loader.close()
       //debugger
     if (error.status === 412 && error.url === 'https://skindevreplica-tls.api.tatamotors/api/search/locations_for_part/')
    //if (error.status === 412 && error.url === 'https://skinprod.api.tatamotors/api/search/locations_for_part/')
     
   
     {
       var errormsg = ""
       if (error.error.msg != "")
       {
        errormsg = error.error.msg
       }
     // self.snackBar.open('Precondition Failed.! ' + '' + errormsg, 'close', { duration: 3000 });
   //   Swal.fire (errormsg);
     }
      if (error.status === 401 ) {
       this.auth.loggedOut();
        throw error;
      }
      else
      {
        throw error;
      }
     })
   );
  }
}
}

@Injectable({
  providedIn: 'root'
})
export class FileAppinterceptorService implements HttpInterceptor {
 

  constructor(private auth: AuthorizeService ) { }
  handlError(error:HttpErrorResponse)
  {
    return throwError(error)
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
   // alert('hi')

    const headers= new HttpHeaders(
      {
        Authorization: `Bearer ${this.auth.getToken()}`,
       // 'Content-Type': `application/x-www-form-urlencoded`, 

        }
    )
    const clone= req.clone({
      headers:headers
    })

    if (!window.navigator.onLine) {
      // if there is no internet, throw a HttpErrorResponse error
      // since an error is thrown, the function will terminate here
      //return Observable.throw(new HttpErrorResponse({ error: 'Internet is required.' }));
    //  this.loader.close();
    //  Swal.fire('Internet is required!')
      return throwError('Internet is required.' );
  } else {

   return next.handle(clone).pipe(
     catchError(error=>{
      if (error.status === 401 ) {
    //    this.auth.loggedOut();
        throw error;
      }
      else
      {
        throw error;
      }
     })
   );
    }


  }
}
