import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
//import { DateAdapter, MatDialog, MatDialogRef, MAT_DATE_FORMATS } from '@angular/material';
import { DataPassServiceService } from '../../../../shared/Services/data-pass-service.service';
import { ExcelServiceService } from '../../../../shared/Services/excel-service.service';
//import { CommonService } from 'app/shared/services/MyServices/common.service';
//mport { OrderListService } from '../../../../shared/Services/orderservice.service';


import { Router } from '@angular/router';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import Swal from 'sweetalert2';
import { CommonService } from './../../../../shared/Services/common-service.service';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrderDetailsComponent } from 'src/app/shared/component/modals/order-details/order-details.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AllInput } from 'src/app/pages/Reports/time-line-invoice/time-line-invoice.component';
import{PoDetailsComponent}from './../../../../shared/component/modals/Po_list/po-details/po-details.component'


@Component({
  selector: 'app-po-list',
  templateUrl: './po-list.component.html',
  styleUrls: ['./po-list.component.scss']
})
export class PoListComponent implements OnInit {
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>;
  @ViewChild('PoListInformations', { read: TemplateRef, static: false }) PoListInformations: TemplateRef<any>;

  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;

  page: any;
  currentPage: any;
  noofrecordsperpage: number;
  otcNo: any;
  poNumber: any;
  ShowCustom: boolean;
  iscustomDate: boolean;
  isThirtyDays: boolean;
  isToday: boolean;
  isLastsevenDay: boolean;
  distributor_name: string;
  DistributorData: any;
  account_name: string;
  account_id: string;
  AccountName: FormGroup;
  //currentPage: any;
  Filterarray: any[];
  po_number: any;
  showRecords: number;
  toastrService: any;
  offset: number;
  po_status: any;
  sap_order_number_search: any;
  organization_name: any;
  sap_order_number: any;
  PoDetails: any;
  EDownload: any;
  pageName: string;
  count: number;
  closeResult: string;

  constructor(
    private dataPass: DataPassServiceService, private excelService: ExcelServiceService, private CommonService: CommonService,

    private datepipe: DatePipe, private loader: AppLoaderService, private OrderListService: OrderserviceService,

    private fb: FormBuilder, private dialog: MatDialog,
    private modalService: NgbModal,

    private router: Router
  ) {
    // this.page.pageNumber = 0;
    // this.page.size = 10;
    // this.page.totalElements = 0;
  }

  //page = new Page();
  temp = [];
  public items: any[];
  CustomerList = new FormGroup({});
  DistributorList = new FormGroup({});
  public AllFilters: FormGroup;
  isDistDrpDownVisible: boolean;
  div_id: any;
  distributor_id: any;
  otc_number: any;
  range_gt: any;
  range_lt: any;
  from_date: any;
  to_date: any;
  invoice_no: any;
  FilterString: any;
  FromDate: any;
  ToDate: any;
  tableOffset: any;
  isdistributor: boolean;
  isdiableeporrt: boolean;
  POCountExcel: any;
  POCount: any = 0
  totalrecord: number;

  ngOnInit() {
    //this.tableOffset = 0

    this.currentPage = 1

    this.noofrecordsperpage = 10
    this.showRecords = 10;
    //this.offset=0

    this.isdiableeporrt = true
    var RoleName = this.CommonService.getRole();
    if (RoleName == "Distributor") {
      this.isdistributor = true
    }
    else {
      this.isdistributor = false
    }

    this.from_date = localStorage.getItem("FromDate");
    this.to_date = localStorage.getItem("ToDate");
    this.FromDate = this.from_date;
    this.ToDate = this.to_date;




    const ListInput: PoInput = {} as PoInput;
    ListInput.offset = 0;
    ListInput.limit = 10;
    ListInput.po_row_id = "";
    ListInput.from_date = this.from_date;
    ListInput.to_date = this.to_date;
    ListInput.po_number = "";
    this.GetList(ListInput);

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = "";

    this.GetDistributor(data1);
    const data: InputData1 = {} as InputData1
    data.size = 5;
    data.account_name = "";
    this.GetAccount(data);

    this.GetStatusData();
    this.BuildForm();
  }
  showAccount(event) {
    const ListInput: PoInput = {} as PoInput;
    ListInput.from_date = localStorage.getItem("FromDate");
    ListInput.to_date = localStorage.getItem("ToDate");
    ListInput.po_number = event.target.value
    this.GetList(ListInput);
  }
  SearchPo(event) {
    if (event.key === "Enter") {
      const ListInput: PoInput = {} as PoInput;
      ListInput.from_date = localStorage.getItem("FromDate");
      ListInput.to_date = localStorage.getItem("ToDate");
      ListInput.po_number = event.target.value
      this.GetList(ListInput);
    }
  }


  GetList(ListInput) {
    // this.POCountExcel = 0;

    // this.FilterStrings(ListInput);
    this.FilterStrings(ListInput)

    this.totalrecord = 0
    this.items = []

    this.OrderListService.PoOrderList(ListInput).subscribe(

      data => {

        if (data.success == true) {
         
          this.totalrecord = data.total_result;

          this.items = data.data;
         this.temp = data.data
          this.showRecords = data.data.length

          
        }
        else {
          this.toastrService.error(data.data.msg)

          //this.loader.close();
        }
      }, (err) => {

      }
    );
  }
  onRemoveFilter(filterString) {

    let Filterarrays = this.Filterarray;
    if (filterString.Key == "otc_number") {
      this.otc_number = "";
      this.AllFilters.get("otc_number").setValue("")
      this.AllFilters.get('otc_no_search').setValue("");
    }
    else if (filterString.Key == "org_name") {
      this.distributor_id = "";
      this.distributor_name = "";
      this.AllFilters.get('org_name').setValue("");
      const data1: InputData = {} as InputData;
      data1.size = 5;
      data1.org_search_text = "";
      this.GetDistributor(data1);
     
    }
    else if (filterString.Key == "account_name") {
      this.account_id = "";
      this.account_name = "";
      this.AllFilters.get('account_name').setValue("");
      const data: InputData1 = {} as InputData1
      data.size = 5;
      data.account_name = "";
      this.GetAccount(data);
    }

     else if (filterString.Key == "po_status") {
      this.invoice_no = ""
     this.AllFilters.get("po_status").setValue("")
     }
     else if (filterString.Key == "organization_name") {
      this.invoice_no = ""
     this.AllFilters.get("organization_name").setValue("")
     }
     else if (filterString.Key == "sap_order_number") {
      this.invoice_no = ""
     this.AllFilters.get("sap_order_number").setValue("")
     }
     else if (filterString.Key == "po_number") {
      this.invoice_no = ""
     this.AllFilters.get("po_number").setValue("")
     }
    // else if (filterString.Key == "invoice_no") {
    //   this.invoice_no = ""
    //   this.AllFilters.get("invoice_no").setValue("")
    // }
    // else if (filterString.Key == "range_gt") {
    //   this.rating = ""
    //   this.AllFilters.get("rating").setValue("")
    // }
    // else if (filterString.Key == "division_name") {
    //   this.division_id = "";
    //   this.division_name = "";
    //   this.DivisionList.reset();
    // }
    this.SearchAllDate();
  }

  BuildForm() {
    this.AllFilters = this.fb.group({


      from_date: [''],
      to_date: [''],
      otc_number: [''],
      otc_no_search: [''],
      organization_name: [''],
      account_name: [''],
      po_number: [''],
      sap_order_number: [''],
      //drp_purchase_order_status: [''],
      po_status: [],
      org_name:[],
      distributor_id:[]





    });
  }
  // viewPodetails(data){

  //   this.TempDAta = [];

  //   const ListInput1: InputOrderDetail = {} as InputOrderDetail;
  //     ListInput1.po_row_id = data
  //    this.OrderListService.PoList1(ListInput1).subscribe(
         
  //     data => {
  //       if (data.success == true) {
  //         this.loader.close()
  //         if (data.data.length > 0) {
  //           this.TempDAta = data.data;
  //           this.PoListInformations = this.TempDAta
  //           let ngbModalOptions: NgbModalOptions = {
  //             backdrop: true,
  //             keyboard: true
  //           };
  //           this.modalService.open(this.PoListInformations, ngbModalOptions).result.then((result) => {
  //             this.closeResult = `Closed with: ${result}`;
  //           }, (reason: any) => {
  //             this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //           });
  //         }
        
  //       }
  //       else {
  //         this.loader.close()
  //       }
  //     }, (err) => {
  //     }
  //   );
  // }
  viewPodetails (data: any, isNew?) {


    
    this.loader.open();
    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.po_row_id = data

    this.OrderListService.PoList1(ListInput1).subscribe(

      data => {
        debugger

        if (data.success == true) {
          this.loader.close();

       
            var TempDAta = data.data.result;
            this.dataPass.setOrderListData(TempDAta);
            let title = '';
            let dialogRef: MatDialogRef<any> = this.dialog.open(PoDetailsComponent, {
              panelClass: 'my-class',
              disableClose: false,
              data: { title: title, }

            })
            this.loader.close();
         
        }
        else {
          Swal.fire('Please Check Details After Some Time');
          this.loader.close();
        }
      }, (err) => {
        Swal.fire('Please Check Details After Some Time');
        this.loader.close();

      }

    );

  }  
  ExportDownload() {
    debugger;
    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
    //   if (this.totalrecord == 0) {
      //   Swal.fire("No Data For downloding");
      // } else {

      
        const ListInput: PoInput = {} as PoInput;

        if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }
    
        if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }
    
        if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }
        if (this.po_status) { ListInput.po_status = this.po_status; } else { ListInput.po_status = ""; }
    
        if (this.sap_order_number_search) { ListInput.sap_order_number_search = this.sap_order_number_search; } else { ListInput.sap_order_number_search = ""; }
        if (this.po_number) { ListInput.po_number = this.po_number; } else { ListInput.po_number = ""; }
        if (this.organization_name) { ListInput.organization_name = this.organization_name; } else { ListInput.organization_name = ""; }

       // ListInput.limit = 10;
      //ListInput.offset = 0;
       // ListInput.offset = (page * 10);
      // organization_name
   //  ListInput.limit = this.noofrecordsperpage;
     ListInput.limit = this.totalrecord;
     ListInput.offset = 0;
      this.EDownload = ListInput;
      this.count = this.totalrecord;
      this.pageName = "POList";
      let ngbModalOptions: NgbModalOptions = {
        backdrop: true,
        keyboard: true
      };
      this.modalService.open(this.ExcelDownload, ngbModalOptions).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });

    }
  // }
// }
  changedatefilter(Value) {
    if (Value == 'Today') {
      this.ShowCustom = false;
      this.isToday = true;
      this.isThirtyDays = false;
      this.isLastsevenDay = false;
      this.iscustomDate = false;
      this.from_date = "";
      this.to_date = "";
      this.AllFilters.patchValue({
        Today: true,
        Custom: false,
        thirtyDays: false,
        Sevenday: false
      })
    }

    if (Value == 'Sevenday') {
      this.ShowCustom = false;
      this.isLastsevenDay = true;
      this.isThirtyDays = false;
      this.isToday = false;
      this.iscustomDate = false;
      this.from_date = "";
      this.to_date = "";
      this.AllFilters.patchValue({
        Today: false,
        Custom: false,
        thirtyDays: false,
        Sevenday: true
      })
    }

    if (Value == 'thirtyDays') {
      this.ShowCustom = false;
      this.isThirtyDays = true;
      this.isToday = false;
      this.isLastsevenDay = false;
      this.iscustomDate = false;
      // this.from_date = "";
      // this.to_date = "";
      this.AllFilters.patchValue({
        Today: false,
        Custom: false,
        thirtyDays: true,
        Sevenday: false
      })
    }

    if (Value == 'Custom') {
      this.ShowCustom = true;
      this.iscustomDate = true;
      this.isThirtyDays = false;
      this.isToday = false;
      this.isLastsevenDay = false;
      this.from_date = "";
      this.to_date = "";
      this.AllFilters.patchValue({
        Today: false,
        Custom: true,
        thirtyDays: false,
        Sevenday: false
      })
    }
  }
  calculateDate1(Date1, date2) {
    debugger
    Date1 = new Date(Date1);
    date2 = new Date(date2);
    var diffc = Date1.getTime() - date2.getTime();

    var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));

    return days;
  }
  
  SearchAllDate() {
    this.currentPage = 1
    let fromDate = localStorage.getItem("FromDate");
    let todate = localStorage.getItem("ToDate");
    debugger
    if (this.iscustomDate == true) {
      if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
        Swal.fire('Select From Date');
        const ListInput: PoInput = {} as PoInput;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
        this.GetList(ListInput)
        return
      }
      else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
        Swal.fire('Select To Date');
        const ListInput: PoInput = {} as PoInput;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
        this.GetList(ListInput)
        return
      }
      var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
      var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
      var days = this.calculateDate1(d1,d2);
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
        const ListInput: PoInput = {} as PoInput;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
        this.GetList(ListInput)
        return
        
      }
      else if(days >= 95){
        Swal.fire(' Allow to get Only 95 Days Data');
        const ListInput: PoInput = {} as PoInput;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
        this.GetList(ListInput)
        return
      }
      this.from_date = this.AllFilters.value.from_date;
      this.to_date = this.AllFilters.value.to_date
      this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
      this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
    }
    else if (this.isLastsevenDay == true) {
      this.from_date = moment(todate).subtract(7, 'days').format('yyyy-MM-DD')
      this.to_date = this.datepipe.transform(todate, 'yyyy-MM-dd')
    }
    else if (this.isToday == true) {
      this.from_date = moment(todate).format('yyyy-MM-DD')
      this.to_date = this.datepipe.transform(todate, 'yyyy-MM-dd')
    }
    else if (this.isThirtyDays == true) {
      this.from_date = this.datepipe.transform(fromDate, 'yyyy-MM-dd')
      this.to_date = this.datepipe.transform(todate, 'yyyy-MM-dd')
    };

  

   

    if (this.from_date) {
      this.AllFilters.get('from_date').setValue(this.from_date);
    }
    if (this.to_date) {
      this.AllFilters.get('to_date').setValue(this.to_date);
    }
    this.from_date = this.AllFilters.value.from_date;
    this.to_date = this.AllFilters.value.to_date;
    this.otc_number = this.AllFilters.value.otc_number;
    this.po_status = this.AllFilters.value.po_status;
    this.po_number = this.AllFilters.value.po_number;
    this.sap_order_number = this.AllFilters.value.sap_order_number;
    this.account_name = this.AllFilters.value.account_name;
    this.distributor_name=this.AllFilters.value.distributor_name;

    const ListInput: PoInput = {} as PoInput;
    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }
    if (this.po_status) { ListInput.po_status = this.po_status; } else { ListInput.po_status = ""; }
    if (this.po_number) { ListInput.po_number = this.po_number; } else { ListInput.po_number = ""; }
    if (this.sap_order_number) { ListInput.sap_order_number = this.sap_order_number; } else { ListInput.sap_order_number = ""; }
    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }
    if (this.distributor_name) { ListInput.distributor_name = this.distributor_name; } else { ListInput.distributor_name = ""; }



    ListInput.limit = 10
    this.GetList(ListInput);
    this.myDrop.close();



  }
  FilterStrings(ListInput) {
    this.Filterarray = [];
    for (let item in ListInput) {

      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');

    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'limit');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'distributor_id');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'range_gt');
    var from_date1 = ListInput.from_date;
    var to_date1 = ListInput.to_date;
    var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');

    var Json1 = { "Key": 'from_date', "Value": finaldate }
    this.Filterarray.push(Json1)
  }

  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }


  pageChange(page: any) {
    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1
    debugger

    const ListInput: PoInput = {} as PoInput;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }
    if (this.po_status) { ListInput.po_status = this.po_status; } else { ListInput.po_status = ""; }

    if (this.sap_order_number_search) { ListInput.sap_order_number_search = this.sap_order_number_search; } else { ListInput.sap_order_number_search = ""; }
    if (this.po_number) { ListInput.po_number = this.po_number; } else { ListInput.po_number = ""; }
    
    ///.limit = 10;
    ListInput.offset = (page * 10);

    ListInput.limit = this.noofrecordsperpage;

    //ListInput.limit = (page * 10);
   // ListInput.size = (page * 10) + 10;
   //.offset = (page * 10);

//ListInput.limit = this.noofrecordsperpage;

    this.GetList(ListInput);
    this.myDrop.close();

  }


  accountType() {
    //  alert("hii");
    this.account_name = "";
    this.account_id = "";


    const data2: InputData1 = {} as InputData1;
    data2.size = 5;
    data2.account_name = this.AllFilters.value.account_name;
    this.GetAccount(data2)
  }
  filterMyOptionsCustname(row, event) {
    this.account_id = row.account_id;
    this.account_name = row.account_name;
    if (event.target.checked) {
      for (const field1 in this.CustomerList.controls) { // 'field' is a string
        if (field1 == this.account_id) {
          this.CustomerList.get(field1).setValue(true);
        }
        else {
          this.CustomerList.get(field1).setValue(false);
        }
      }
    }
    else {
      for (const field1 in this.CustomerList.controls) { // 'field' is a string

        this.CustomerList.get(field1).setValue(false);
      }
    }
  }
  Accountnamedata: any = []
  AccountnamedataOrignal;
  GetAccount(Data1) {
    this.Accountnamedata = [];
    this.CommonService.AccountName(Data1).subscribe(
      data => {
        if (data.success == true) {

          this.Accountnamedata = [];
          ///  this.filterValue2 = null;
          // this.AccountnamedataOrignal = data.data;
          this.Accountnamedata = data.data;
          this.Accountnamedata = this.Accountnamedata.slice(0, 5)
          // for (let i = 0; i < this.Accountnamedata.length; i++) {
          //   this.Accountnamedata[i].account_name = this.Accountnamedata[i].account_name.slice(0, 15) + '...'
          // }
          this.AccountName = new FormGroup({})
          for (let formModule of this.Accountnamedata) {
            this.AccountName.addControl(formModule.account_id, new FormControl(false))
          }
          this.CustomerList = new FormGroup({})
          for (let formModule of this.Accountnamedata) {
            this.CustomerList.addControl(formModule.account_id, new FormControl(false))
          }
        }
        else {

          //this.loader.close();
          //
        }
      }, (err) => {
        // this.loader.close();
      }
    );
  }



  Distributortype() {

    this.distributor_id = ""
    this.distributor_name = ""

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = this.AllFilters.value.org_name;

    this.GetDistributor(data1);
  }
  GetDistributor(Data) {
    this.DistributorData = []

    this.CommonService.DistributorList(Data).subscribe(
      data => {
        if (data.success == true) {
          this.DistributorData = data.data.result;


          this.DistributorList = new FormGroup({})
          for (let formModule of this.DistributorData) {
            this.DistributorList.addControl(formModule.distributor_id, new FormControl(false))
          }


        }
        else {
        }
      }, (err) => {

      }

    );


  }

  dstfilteradd(row, event) {

    debugger

    if (event.target.checked) {
      this.distributor_id = row.distributor_id
      this.distributor_name = row.distributor_name
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        if (field1 == this.distributor_id) {
          this.DistributorList.get(field1).setValue(true);
          // this.isDivisionVisible = true

          const data: InputData1 = {} as InputData1;
          data.distributor_id = this.distributor_id;
          data.div_search_text = "";
          // this.Getdivision(data);
        }
        else {
          this.DistributorList.get(field1).setValue(false);
          // this.Division=[];
        }
      }
    }

    else {
      this.distributor_id = "";
      this.distributor_name = "";
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        this.DistributorList.get(field1).setValue(false);
        // this.Division=[];
        // this.isDivisionVisible = false
      }
    }

  }
  // PoDataPrepareArray: any;
  // async ExportDownload($event) {

  //   this.isdiableeporrt = false
  //   this.PoDataPrepareArray = []
  //   const ListInput: PoInput = {} as PoInput;

  //   if (this.from_date) { ListInput.from_date = this.FromDate; } else { ListInput.from_date = ""; }

  //   if (this.to_date) { ListInput.to_date = this.ToDate; } else { ListInput.to_date = ""; }

  //   if (this.po_number) { ListInput.po_number = this.poNumber; } else { ListInput.po_number = ""; }

  //   if (this.otc_number) { ListInput.otc_number = this.otcNo; } else { ListInput.otc_number = ""; }

  //   ListInput.limit = this.POCount;

  //   if (this.POCount <= 250) {

  //     await this.OrderListService.PoOrderList(ListInput).subscribe(

  //       data => {

  //         if (data.success == true) {

  //           for (let entry of data.data) {

  //             const ListInput: ExpotInputdata = {} as ExpotInputdata;

  //             ListInput.po_number = entry.po_number
  //             ListInput.otc_number = entry.otc_number
  //             ListInput.customer_name = entry.ship_account_name
  //             ListInput.division_name = entry.ord_division_name
  //             ListInput.order_date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
  //             ListInput.order_status = entry.order_status

  //             this.PoDataPrepareArray.push(ListInput)

  //           }

  //           this.excelService.exportCancellationAsExcelFile(this.PoDataPrepareArray, 'PoList');

  //           this.isdiableeporrt = true
  //         }

  //         else {
  //           Swal.fire('Please try Again')
  //           this.isdiableeporrt = true
  //         }
  //       }, (err) => {

  //         Swal.fire('Please try Again')
  //         this.isdiableeporrt = true
  //       }
  //     );
  //   }
  //   else {

  //     var Size = 250
  //     var offset = 0

  //     var rou = (Math.ceil(this.POCount / 250))

  //     for (let i = 0; i < rou; i++) {

  //       await this.OrderListService.PoOrderList(ListInput).subscribe(

  //         data => {

  //           if (data.success == true) {

  //             for (let entry of data.data) {

  //               const ListInput: ExpotInputdata = {} as ExpotInputdata;

  //               ListInput.po_number = entry.po_number
  //               ListInput.otc_number = entry.otc_number
  //               ListInput.customer_name = entry.ship_account_name
  //               ListInput.division_name = entry.ord_division_name
  //               ListInput.order_date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
  //               ListInput.order_status = entry.order_status

  //               this.PolistExcel(ListInput)

  //             }

  //           }
  //           else {
  //             Swal.fire('Please try Again')
  //             this.isdiableeporrt = true
  //           }
  //         }, (err) => {
  //           Swal.fire('Please try Again')
  //           this.isdiableeporrt = true
  //         }
  //       );
  //       Size = Size + 250;
  //       offset = offset + 250;
  //     }
  //   }
  // }

  // PolistExcel(ListInput) {
  //   this.PoDataPrepareArray.push(ListInput)

  //   this.POCountExcel = this.PoDataPrepareArray.length
  //   if (this.PoDataPrepareArray.length == this.POCount) {
  //     this.excelService.exportCancellationAsExcelFile(this.PoDataPrepareArray, 'PoList');
  //     this.isdiableeporrt = true
  //   }

  // }
  resetALl() {
    this.AllFilters.reset();
    this.DistributorList.reset();
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.otc_number = "";
    this.from_date = "";
    this.to_date = "";
    this.isThirtyDays = true;
    this.isToday = false;
    this.iscustomDate = false;
    this.isLastsevenDay = false;
    this.ShowCustom = false;
    //this.Division = [];
    var d1 = new Date(); // today!
    var x1 = 30; // go back 5 days!
    d1.setDate(d1.getDate() - x1);

    this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
    this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = "";

    this.GetDistributor(data1);
    const data: InputData1 = {} as InputData1
    data.size = 5;
    data.account_name = "";
    this.GetAccount(data);

    const ListInput: PoInput = {} as PoInput;
    ListInput.from_date = this.from_date
    ListInput.to_date = this.to_date
    ListInput.limit = 10;
    this.GetList(ListInput);

    this.myDrop.close();
  }

  // poNumber:any;
  soRowId: any;
  // otcNo:any

  orderDetailsModal: any;
  TempDAta: any;
  orderInformations: any;
  details(row) {
    debugger
    this.loader.open()

    this.TempDAta = [];

    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.otc_number = row.otc_number;
    this.OrderListService.OtcOrderDetails(ListInput1).subscribe(
      data => {
        if (data.success == true) {
          this.loader.close()
          if (data.data.length > 0) {
            this.TempDAta = data.data[0];
            this.orderInformations = this.TempDAta
            let ngbModalOptions: NgbModalOptions = {
              backdrop: true,
              keyboard: true
            };
            this.modalService.open(this.orderDetails, ngbModalOptions).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason: any) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
          }
          else {
            Swal.fire('Please Check Details After Some Time');
            this.loader.close()
          }
        }
        else {
          this.loader.close()
        }
      }, (err) => {
      }
    );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  StatusData = []


  GetStatusData() {
    debugger
    var Json = {
      "dropdown_type": "drp_purchase_order_status"
    }



    this.CommonService.PoStatusName(Json).subscribe(

      data => {
        debugger


        if (data.success == true) {

          console.log(data)

          this.StatusData = [];
          ///  this.filterValue2 = null;

          this.StatusData = data.data;


        }
        else {

          //this.loader.close();
          //
        }
      }, (err) => {
        // this.loader.close();
      }

    );


  }





}


export class InputData1 {

  size: number
  org_search_text: string
  account_name: string;
  div_search_text: string
  distributor_id: any;


}

export class PoInput {
  offset: number;
  limit: number;
  po_row_id: string;
  from_date: string;
  to_date: string;
  po_number: string;
  stp_name: string;
  otc_number: string
  size: number;
  account_name: string;
  static otc_number: any;
  organization_name: any;
  po_status: any;
  sap_order_number_search: any;
  sap_order_number: any;
  distributor_name: string;
  Po_Number: any;
  OTC_Number: any;
  Customer_Name: any;
  Distributor_Name: any;
  Sap_Order_Number: any;
  CreatedDate: string;
  UpadteDate: string;
  OrderDate: string;
  Order_Status: any;
  Division_Name: any;
}

export class ExpotInputdata {
  po_id: string;
  opos_id: string;
  po_number: string;
  stp_name: string;
  order_pos: string;
  order_date: string;
  order_type: string;
  order_raiserd: string;
  order_div_id: string;
  order_for: string;
  sta_as_of_date: string;
  stp_code: string;
  order_status: string;
  otc_number: string;
  customer_name: string;
  division_name: string;
}


export class InputData {

  size: number
  org_search_text: string


}

export class InputOrderDetail {
  otc_order_no: string
  otc_number: any;
  po_row_id: any;
}
