import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of, throwError, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment, } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})


export class FileUploadService {

  

  private UploadvehiclecsvURL = `${environment.Edukanadmin}/api/v2/ecom/admin/upload_account_mappings/`;
  private uploadPartValidateURL = `${environment.Edukanadmin}/api/v2/ecom/admin/validate_parts/`;
  private uploadExcelURL = `${environment.Edukanadmin}/api/v2/ecom/admin/bulk_part_update/`;

  

  constructor(private http: HttpClient, private _Router: Router) { }

 



  uploadvehicleCSV(data: FormData) {
    return this.http.post<any>(this.UploadvehiclecsvURL, data).pipe(catchError(this.handlError))
    //return this.http.post(this.UploadvehiclecsvURL, data, { headers: { "Content-Type":'multipart/form-data', } }).pipe(catchError(err => of(err)));
  }




  handlError(error: HttpErrorResponse) {
    return throwError(error)
  }

  uploadPartValidate(data: FormData) {
    return this.http.post<any>(this.uploadPartValidateURL, data).pipe(catchError(this.handlError))
  }

  uploadExcel(data: FormData) {
    return this.http.post<any>(this.uploadExcelURL, data).pipe(catchError(this.handlError))
  }

}
