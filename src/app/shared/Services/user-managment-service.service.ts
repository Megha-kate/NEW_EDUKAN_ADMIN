import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthorizeService } from './authorize.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagmentServiceService {
  private RegistrationListAPi = `${environment.Edukanadmin}/api/v1/ecom/admin/registered_list/`;
  // private GetPostionListURL = `${environment.Edukanadmin}/api/v1/ecom/admin/position_list/`;
  private GetPostionListURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_position_list/`;
  private RoletypeDrpDwn = `${environment.Edukanadmin}/api/v1/ecom/admin/role_List/`;
  private PositionDrpDwn = `${environment.Edukanadmin}/api/v1/ecom/admin/position_list/`;
  private InsertUpdatePositionMasppingURL = `${environment.Edukanadmin}/api/v1/ecom/admin/list/InsertUpdatePositionMaster/`;
  private PagemasterDataURL = `${environment.Edukanadmin}/api/v1/ecom/admin/list/RolePageMappingList/`;
  private InsertPagemappingURL = `${environment.Edukanadmin}/api/v1/ecom/admin/list/UpdateRoleMapping/`;
  // private webRoletypeDrpDwn = `${environment.Edukanadmin}/api/v1/ecom/admin/other_user/roles_list/ `;
  private webRoletypeDrpDwn = `${environment.Edukanadmin}/api/v2/ecom/admin/get_other_user_roles_list/`;
  private InsertWebPannelUpdateRoleMasterURL = `${environment.Edukanadmin}/api/v1/ecom/admin/other_user/add_role/`;
  private InsertWebPageMappingURL = `${environment.Edukanadmin}/api/v1/ecom/admin/insert_customer_role_permissions/`;
  private InsertUpdateDivisionMasterURL = `${environment.Edukanadmin}/api/v2/ecom/admin/add_or_update_division_allocation/`;
  private UpdateDivisionMasterURL = `${environment.Edukanadmin}/api/v2/ecom/admin/add_or_update_division_allocation/`;
  private DivisionMasterIDURL =`${environment.Edukanadmin}/api/v2/ecom/admin/validate_division_id/`;
  constructor(private http: HttpClient,private auth: AuthorizeService) { }
 RegistrationList(Data: any):Observable<any>
  {
    return this.http.post(this.RegistrationListAPi,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
 GetPostionList(Data: any):Observable<any>
  {
    return this.http.post(this.GetPostionListURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
 BindRoleTypeOld(Data: any):Observable<any>
  {
    return this.http.post(this.RoletypeDrpDwn,'', {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  async BindRoleType(Data :any): Promise<any> {
    return await this.http.post(this.RoletypeDrpDwn,Data, {headers:{"Content-Type":"application/json"}}).toPromise();
  }
  
  BindPosition(Data: any):Observable<any>
  {
    return this.http.post(this.PositionDrpDwn,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  InsertUpdatePositionMaspping(Data: any):Observable<any>
  {
    return this.http.post(this.InsertUpdatePositionMasppingURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  GetPagemasterData(Data: any):Observable<any>
  {
    return this.http.post(this.PagemasterDataURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  InsertPageMapping(Data: any):Observable<any>
  {
    return this.http.post(this.InsertPagemappingURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  BindWebRoleTypeMaster(Data: any):Observable<any>
  {
    return this.http.post(this.webRoletypeDrpDwn,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  InsertWebPannelUpdateRoleMaster(Data: any):Observable<any>
  {
    return this.http.post(this.InsertWebPannelUpdateRoleMasterURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
  BindWebRoleType(Data: any):Observable<any>
  {
    return this.http.post(this.webRoletypeDrpDwn,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  InsertWebPageMapping(Data: any):Observable<any>
  {
    return this.http.post(this.InsertWebPageMappingURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
  
  InsertUpdateDivisionMaster(Data: any):Observable<any>
  {
    return this.http.post(this.InsertUpdateDivisionMasterURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
  UpdateDivisionMaster(Data: any):Observable<any>
  {
    return this.http.post(this.UpdateDivisionMasterURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
  DivisionMasterID(Data: any):Observable<any>
  {
    return this.http.post(this.DivisionMasterIDURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
}
