import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthorizeService } from '../Services/authorize.service'
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private DistributorListAPi = `${environment.Edukanadmin}/api/v1/ecom/get/list/distributor/ `;
  private AccountNameURL = `${environment.Edukanadmin}/api/v1/ecom/admin/get_accout_name/ `;

  private DivisionURL = `${environment.Edukanadmin}/api/v1/ecom/get/list/division/`;

  private GetstateURLNew = `${environment.Edukanadmin}/api/v2/ecom/search/geo_dropdowns/`;

  private GETDivisorDetailDataURL = `${environment.Edukanadmin}/api/search/locations_for_part/`;
  private GETDivisiorDivisionDataURL = `${environment.Edukanadmin}/api/get/location_details/`;
  private GetSKUURL1 = `${environment.Edukanadmin}/api/v1/ecom/get/search/web_part_number_drp/`;
  private RulemasterListURL = `${environment.EdukanVss}/api/v1/ecom/admin/discounts_list/`;
  private GetCustomerURL = `${environment.EdukanVss}/api/v1/ecom/admin/account_list_distinct/`;
  private GetproductLineURL = `${environment.EdukanVss}/api/v1/ecom/get/nav/pg_line_group_list/ `;
  private GetStateURL = `${environment.EdukanVss}/api/v1/ecom/admin/state_dropdown/`;
  private GetDistrictURL = `${environment.Edukanadmin}/api/v1/ecom/admin/district_dropdown/`;
  private GetDistributorURL = `${environment.Edukanadmin}/api/v1/ecom/get/list/distributor/`;
  private GetDivisionURL = `${environment.Edukanadmin}/api/v1/ecom/get/list/division/`;
  private RuleDetailsURL = `${environment.EdukanVss}/api/v1/ecom/admin/discounts_detail_list/`;
  private InsertRulemasterURL = `${environment.EdukanVss}/api/v1/ecom/admin/add_discounts/`;
  private InsertRulemasterURLNew = `${environment.EdukanVss}/api/v2/ecom/admin/add_discounts/`;
  private GetPArtDiscountDataURL = `${environment.EdukanVss}/api/v2/ecom/admin/get_part_discount_list/`;
  private GetstatecodeURL = `${environment.Edukanadmin}/api/v1/ecom/admin/state_dropdown/`;
  private DivisionNameURL = `${environment.Edukanadmin}/api/v2/ecom/common/get_division_category/ `;
  private DistrictNameURL  = `${environment.Edukanadmin}/api/v1/ecom/admin/district_dropdown/`;
  private GetsetCategoryURL = `${environment.Edukanadmin}/api/v1/ecom/admin/get_part_list/`;  
  private BulkPartUpdateURL = `${environment.Edukanadmin}/api/v2/ecom/admin/bulk_part_update/`;  
  private ApproveRejectRule = `${environment.EdukanVss}/api/v1/ecom/admin/update_discount_status/` ; 
  private ProductGroupURL = `${environment.Edukanadmin}/api/v1/ecom/list/pg/`;
  private getbannerlistURL  = `${environment.Edukanadmin}/api/v2/ecom/admin/get_banner_list/`; 
  private addBanner  = `${environment.Edukanadmin}/api/v2/ecom/admin/add_banner/`;  
  private DashboardAPi = `${environment.Edukanadmin}/api/v1/ecom/admin/list/dashboard/ `;
  private PoStatusNameURL = `${environment.Edukanadmin}/api/v2/ecom/admin/get_dropdown/`;
  private SaveRegistration = `${environment.Edukanadmin}/api/v1/ecom/admin/registration/`;
  private BindCategoryDistributorURL = `${environment.Edukanadmin}/api/v1/ecom/admin/get_part_list/`;
  private BindPCategoryURL = `${environment.Edukanadmin}/api/v1/ecom/admin/get_part_list/`;
  private PartMasterURL = `${environment.EdukanVss}/api/v1/ecom/admin/get_part_list/`;
  private ValidatePaRTSurl = `${environment.EdukanVss}/api/v2/ecom/admin/validate_data/`;
  private AddUpdateDivisionURL = `${environment.EdukanVss}/api/v2/ecom/admin/add_or_update_division_allocation/`;




  //PoDetailCheck: any;




    constructor(private http: HttpClient, private auth: AuthorizeService) { }


  getRole() {
    //debugger;
    if (localStorage.getItem('loginData') && localStorage.getItem('loginData') != "null") {
      var i = JSON.parse(localStorage.getItem('loginData') || "")
      return i.role_name;
    }
  }



  GetDistributorCode(): string {
    debugger;
    if (localStorage.getItem('loginData') && localStorage.getItem('loginData') != "null") {
      var i = JSON.parse(localStorage.getItem('loginData'))
      return i.distributor_code;
    }
    else {
      return null;
    }
  }

  BindCategoryDistributor(Data: any): Observable<any> {
    return this.http.post(this.BindCategoryDistributorURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  BindProductCategory(Data: any): Observable<any> {
    return this.http.post(this.BindPCategoryURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  RegistrationSave(Data: any): Observable<any> {
    return this.http.post(this.SaveRegistration, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  DistributorList(Data: any): Observable<any> {
    return this.http.post(this.DistributorListAPi, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  ValidatePaRTS(Data: any): Observable<any> {
    return this.http.post(this.ValidatePaRTSurl, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  AccountName(Data: any): Observable<any> {
    return this.http.post(this.AccountNameURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  DivisionList(Data: any): Observable<any> {
    return this.http.post(this.DivisionURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GetstateNew(Data): Observable<any> {
    return this.http.post(this.GetstateURLNew, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GETDivisorDetailData(Data: any): Observable<any> {
    return this.http.post(this.GETDivisorDetailDataURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GETDivisiorDivisionData(Data: any): Observable<any> {
    return this.http.post(this.GETDivisiorDivisionDataURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GetSKU(Data: any): Observable<any> {

    // return this.http.post(this.GetSKUURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
    return this.http.post(this.GetSKUURL1, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  public getJSON(): Observable<any> {
    return this.http.get("./assets/mydata.json");
  }

  PartMaster(Data: any): Observable<any> {
    return this.http.post(this.PartMasterURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  
  AddUpdateDivision(Data: any): Observable<any> {
    return this.http.post(this.AddUpdateDivisionURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  public GetPageVlidation(value) {
    var Valid;
    Valid = false
    var list = JSON.parse(localStorage.getItem('PageDetails'))
    //console.log('list')

    for (let entry1 of list) {

      for (let entry2 of entry1.page_detail) {
        if (entry2.page_url == value) {
          Valid = true
        }

      }


    }

    return Valid

  }
  getDatevalidation(Date1, date2): boolean {

  
    Date1 = new Date(Date1);
    date2 = new Date(date2);
    var diffc = Date1.getTime() - date2.getTime();




    var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));




    if (days == 95 || days <= 95 || days == NaN) {
      return true;
    }
    else {
      return false;

    }
  }


  RulemasterList(Data: any): Observable<any> {
    return this.http.post(this.RulemasterListURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GetCustomer(Data: any): Observable<any> {
    return this.http.post(this.GetCustomerURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GetproductLine(Data: any): Observable<any> {
    return this.http.post(this.GetproductLineURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GetState(Data: any): Observable<any> {
    return this.http.post(this.GetStateURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GetDistrict(Data: any): Observable<any> {
    return this.http.post(this.GetDistrictURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  Dashboard(Data: any):Observable<any>
  {
    return this.http.post(this.DashboardAPi,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  GetDistributor(Data: any): Observable<any> {
    return this.http.post(this.GetDistributorURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GetDivision(Data: any): Observable<any> {
    return this.http.post(this.GetDivisionURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  RuleDetailsListByDiscountcode(Data: any): Observable<any> {
    return this.http.post(this.RuleDetailsURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  InsertRulemaster(Data: any): Observable<any> {
    return this.http.post(this.InsertRulemasterURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  InsertRulemasterNew(Data: any): Observable<any> {
    return this.http.post(this.InsertRulemasterURLNew, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  GetPArtDiscountData(Data: any): Observable<any> {
    return this.http.post(this.GetPArtDiscountDataURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  Getstatecode(Data): Observable<any> {
    return this.http.post(this.GetstatecodeURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

  DivisionName(Data: any): Observable<any> {
    return this.http.post(this.DivisionNameURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  DistrictListName(Data: any): Observable<any> {
    return this.http.post(this.DistrictNameURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GetsetCategory(Data: any):Observable<any>
  {
    return this.http.post(this.GetsetCategoryURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
  bulkPartUpdate(Data: any):Observable<any>
  {
    return this.http.post(this. BulkPartUpdateURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
  ApproveRejectRuleByCode(Data: any):Observable<any>
  {
    return this.http.post(this.ApproveRejectRule,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }
  GetproductGroup(Data: any): Observable<any> {
    return this.http.post(this.ProductGroupURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }
  GetBannerList(Data: any):Observable<any>
  {
    return this.http.post(this.getbannerlistURL,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  AddBanner(Data: any):Observable<any>
  {
    return this.http.post(this.addBanner,Data, {headers:{"Content-Type":"application/json"}}).pipe(catchError(err => of(err)));
  }

  PoStatusName(Data: any): Observable<any> {
    return this.http.post(this.PoStatusNameURL, Data, { headers: { "Content-Type": "application/json" } }).pipe(catchError(err => of(err)));
  }

}

