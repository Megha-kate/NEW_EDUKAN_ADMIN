import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrderserviceService } from './../../../../shared/Services/orderservice.service'
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
//import { CommentPopupComponent } from './comment-popup/comment-popup.component'

import { Router } from '@angular/router';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from './../../../../shared/Services/common-service.service'
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { InvoiceCopyComponent } from 'src/app/shared/component/modals/invoice-copy/invoice-copy.component';
//import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';

@Component({
  selector: 'app-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss'],

})
export class FeedbackListComponent implements OnInit {
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>;
  @ViewChild('invoicePopup', { read: TemplateRef, static: false }) invoicePopup: TemplateRef<any>;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  DistributorList = new FormGroup({});
  CustomerList = new FormGroup({});
  DivisionList = new FormGroup({});
  public AllFilters: FormGroup;
  Division = [];
  ShowCustom: boolean;
  currDiv: any;
  todaydate: boolean;
  sevenday: boolean;
  iscustomDate: boolean = false;
  isLastsevenDay: boolean = false;
  isToday: boolean = false;

  totalrecord: number;

  items: any;

  otc_number: any;

  invoice_no: any;

  tableOffset: any;
  // dialog: any;
  // otc_order_number: any;
  distributor_id: string;
  distributor_name: string;
  account_name: string;
  account_id: string;

  AccountName: FormGroup;
  DistCode: any;
  isDistDrpDownVisible: boolean;
  RoleName: string;
  filterValue2: any;
  division_name: any;
  division_id: any;
  isdiableeporrt: boolean;
  div_id: any;
  from_date: any;
  to_date: any;
  FeedbackCount: number;
  isdistributor: boolean;
  isThirtyDays: boolean;

  FromDate: string;
  ToDate: string;
  FeedbackCountExcel: any;
  currentPage: any;
  noofrecordsperpage: number;
  org_name: any;
  temp: any;
  Filterarray: any;
  date: Date;
  selectedDateOption: any;
  range_gt: string;
  range_lt: string;
  isDivisionVisible: boolean;
  showRecords: number;
  DivisionName: any;
  DistName: any;
  total_count: number;


  constructor(
    private OrderListService: OrderserviceService,
    private CommonService: CommonService,
    private modalService: NgbModal,
    private loader: AppLoaderService,
    private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService,
    private datepipe: DatePipe,
    private dialog: MatDialog,
  ) { }


  //items[]:any
  ngOnInit() {
    this.items = [];
    this.date = new Date();
    //this.tableOffset = 0
    //this.page.pageNumber = 0;
    //this.page.size = 10;
    //this.page.totalElements = 0;
    this.showRecords = 10;

    this.from_date = localStorage.getItem("FromDate");
    this.to_date = localStorage.getItem("ToDate");


    this.currentPage = 1

    this.noofrecordsperpage = 10


    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = "";

    this.GetDistributor(data1);
    const data: InputData1 = {} as InputData1
    data.size = 5;
    data.account_name = "";
    this.GetAccount(data1);


    this.isDistDrpDownVisible = true;
    this.isThirtyDays = true;

    this.RoleName = this.CommonService.getRole();
    this.DistCode = this.CommonService.GetDistributorCode()
    this.isDivisionVisible = false
    if (this.RoleName != "TML") {
      this.isDistDrpDownVisible = false;
      const data1: InputData1 = {} as InputData1;
      this.isDivisionVisible = true
      // data.distributor_id = Event.distributor_id;
      data.distributor_id = this.DistCode;
      data.div_search_text = "";

      this.Getdivision(data1);


    }

    //this.resetFilterFeild();
    const ListInput: ListInput = {} as ListInput;
    ListInput.from_date = localStorage.getItem("FromDate");
    ListInput.to_date = localStorage.getItem("ToDate");
    ListInput.size = 10;
    this.FeedbackList(ListInput);
    this.BuildForm();

  }

  // resetFilterFeild(){

  //   this.AllFilters.reset();
  //   this.DistributorList.reset();
  //   this.DivisionList.reset();
  //   this.CustomerList.reset();
  //   this.BuildForm();
  //   this.Filterarray = [];


  //   this.otc_number = "";
  //   this.range_gt = "";
  //   this.range_lt = "";
  //   this.from_date = "";
  //   this.to_date = "";

  //   this.invoice_no = "";

  //   this.account_id = "";
  //   this.distributor_id = "";
  //   this.div_id = "";

  //   this.division_name = "";
  //   this.account_name = "";
  //   this.org_name = "";
  //   this.isThirtyDays = true;
  //   this.isToday = false;
  //   this.iscustomDate = false;
  //   this.isLastsevenDay = false;
  //   this.ShowCustom = false;
  //   var d1 = new Date(); // today!
  //   var x1 = 30; // go back 5 days!
  //   d1.setDate(d1.getDate() - x1);

  //   this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
  //   this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')
  //   const data1: InputData = {} as InputData;

  //   data1.size = 5;
  //   data1.org_search_text = "";

  //   this.GetDistributor(data1);
  //   const data: InputData1 = {} as InputData1
  //   data.size = 5;
  //   data.account_name = "";
  //   this.GetAccount(data1);
  // }
  page: any
  pageChange(page: any) {
    document.body.scrollTop = 0;
    this.currentPage = this.page;
    page = page - 1;
    debugger
    // ListInput1.offset = ((this.page - 1) * 10);
    // const AllFilters: ListInput = {} as ListInput;

    // if (this.to_date) { AllFilters.to_date = this.to_date; } else { AllFilters.to_date = ""; }

    // if (this.from_date) { AllFilters.from_date = this.from_date; } else { AllFilters.from_date = ""; }


    // if (this.otc_number) { AllFilters.otc_number = this.otc_number; } else { AllFilters.otc_number = ""; }

    // if (this.division_name) { AllFilters.division_name = this.division_name; } else { AllFilters.division_name = ""; }

    // if (this.account_name) { AllFilters.account_name = this.account_name; } else { AllFilters.account_name = ""; }

    // if (this.org_name) { AllFilters.org_name = this.org_name; } else { AllFilters.org_name = ""; }

    // this.FeedbackList(this.AllFilters)

    const ListInput: feedbackinput = {} as feedbackinput;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

    if (this.invoice_no) { ListInput.invoice_no = this.invoice_no; } else { ListInput.invoice_no = ""; }

    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

    if (this.rating) { ListInput.range_gt = this.rating; } else { ListInput.range_gt = ""; }

    if (this.rating) { ListInput.range_lt = this.rating; } else { ListInput.range_lt = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }


    // ListInput.offset =  ((page - 1) * 10);
    ListInput.offset = (page * 10);
    ListInput.size = (page * 10) + 10;

    this.FeedbackList(ListInput);


  }

  Getdivision(Data1) {
    this.CommonService.DivisionList(Data1).subscribe(

      data => {


        if (data.success == true) {

          //     this.dataPreparation(data.data);e

          this.Division = [];
          this.filterValue2 = null;
          this.Division = data.data.result;
          this.DivisionList = new FormGroup({})
          for (let formModule of this.Division) {
            this.DivisionList.addControl(formModule.div_id, new FormControl(false))
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

  divisionfilteradd(row, event) {

    if (event.target.checked) {
      this.division_name = row.div_name
      this.division_id = row.div_id;

      for (const field1 in this.DivisionList.controls) { // 'field' is a string
        if (field1 == this.division_id) {
          this.DivisionList.get(field1).setValue(true);
        }
        else {
          this.DivisionList.get(field1).setValue(false);
        }
      }
    }
    else {
      this.division_name = "";
      this.division_id = "";
      for (const field1 in this.DivisionList.controls) { // 'field' is a string
        this.DivisionList.get(field1).setValue(false);
      }
    }

  }

  DistributorData: any = []

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

    if (event.target.checked) {
      this.distributor_id = row.distributor_id
      this.distributor_name = row.distributor_name
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        if (field1 == this.distributor_id) {
          this.DistributorList.get(field1).setValue(true);
          const data: InputData1 = {} as InputData1;
          data.distributor_id = this.distributor_id;
          data.div_search_text = "";
          this.Getdivision(data);
          this.isDivisionVisible = true
        }
        else {
          this.DistributorList.get(field1).setValue(false);

          this.Division = [];
        }
      }

    }

    else {
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        this.DistributorList.get(field1).setValue(false);
        this.Division = [];
        this.isDivisionVisible = false
      }
    }
  }

  Distributortype() {

    this.distributor_id = ""
    this.distributor_name = ""

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = this.AllFilters.value.org_name;

    this.GetDistributor(data1);
  }

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

  rating: any;
  SearchAllDate() {
    this.currentPage = 1
    let fromDate = localStorage.getItem("FromDate");
    let todate = localStorage.getItem("ToDate");
    debugger
    if (this.iscustomDate == true) {
      if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
        Swal.fire('Select From Date');
        const ListInput: ListInput1 = {} as ListInput1;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
        // ListInput.cr_request_type = "order_cancellation"
        this.FeedbackList(ListInput)
        return
      }
      else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
        Swal.fire('Select To Date');
        const ListInput: ListInput1 = {} as ListInput1;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
        //ListInput.cr_request_type = "order_cancellation"
        this.FeedbackList(ListInput)
        return
      }

    

      var d1 = moment(this.from_date).format('yyyy-mm-dd')
      var d2 = moment(this.to_date).format('yyyy-mm-dd')
      var days = this.calculateDate1(d1, d2);
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
        const ListInput: ListInput1 = {} as ListInput1;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
       
        this.FeedbackList(ListInput)
        return

      }
      else if (days >= 95) {
         Swal.fire(' Please select the date range up to 95 days ');
        const ListInput: ListInput1 = {} as ListInput1;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
      
        this.FeedbackList(ListInput)
        return
      }
      // this.from_date = this.AllFilters.value.from_date;
      // this.to_date = this.AllFilters.value.to_date
      // this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
      // this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')

      let customfromdate = this.AllFilters.value.from_date;
      let customtodate = this.AllFilters.value.to_date
      this.from_date = this.onDateSelect(customfromdate)
      this.to_date = this.onDateSelect(customtodate)
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
    }

    this.invoice_no = this.AllFilters.value.invoice_no;
    this.otc_number = this.AllFilters.value.otc_number;
    this.rating = this.AllFilters.value.rating;

    if (this.distributor_id != "") {
      // this.AllFilters.get('distributor_id').setValue(this.distributor_id);
      this.AllFilters.get('org_name').setValue(this.distributor_name);
    }
    else {
      this.distributor_name = this.AllFilters.value.org_name;
      // this.AllFilters.get('distributor_id').setValue('');
      this.AllFilters.get('org_name').setValue(this.distributor_name);
    }

    if (this.account_id != "") {
      this.AllFilters.get('account_name').setValue(this.account_name);
    }

    // if (this.division_id != "") {
    //   this.AllFilters.get('division_name').setValue(this.division_name);
    // }
    // else {
    //   this.AllFilters.get('division_name').setValue('');
    // }

    if (this.from_date) {
      this.AllFilters.get('from_date').setValue(this.from_date);
    }
    if (this.to_date) {
      this.AllFilters.get('to_date').setValue(this.to_date);
    }





    this.AllFilters.value.size = 10;
    this.AllFilters.value.to_date = this.to_date;
    this.AllFilters.value.from_date = this.from_date;

    const ListInput: feedbackinput = {} as feedbackinput;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

    if (this.invoice_no) { ListInput.invoice_no = this.invoice_no; } else { ListInput.invoice_no = ""; }

    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

    if (this.rating) { ListInput.range_gt = this.rating; } else { ListInput.range_gt = ""; }

    if (this.rating) { ListInput.range_lt = this.rating; } else { ListInput.range_lt = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }
    ListInput.offset = 0
    ListInput.size = 10;

    this.FeedbackList(ListInput);

    // for (let item in this.AllFilters.controls) {

    //   if (this.AllFilters.controls[item].value) {
    //     var Json = { "Key": item, "Value": this.AllFilters.controls[item].value }

    //     this.Filterarray.push(Json)
    //   }
    // }
    this.myDrop.close();
  }



  onDateSelect(event) {
    
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    return finalDate
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
    return this.datepipe.transform(date, 'dd-MM-yyyy');
  }

  BuildForm() {
    this.AllFilters = this.fb.group({

      invoice_no: [''],
      // otc_order_number: [''],
      account_name: [''],
      //account_data.name:[],
      org_name: [''],
      div_id: [''],
      distributor_id: [''],
      account_id: [''],
      rating: [''],
      from_date: [''],
      to_date: [''],
      otc_number: [''],
      otc_no_search: []



    });
  }

  resetALl() {
    this.isDivisionVisible = false;

    this.AllFilters.reset();
    this.DistributorList.reset();
    this.DivisionList.reset();
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.otc_number = "";
    this.range_gt = "";
    this.range_lt = "";
    this.from_date = "";
    this.to_date = "";
    this.invoice_no = "";
    this.account_id = "";
    this.distributor_id = "";
    this.div_id = "";
    this.division_name = "";
    this.account_name = "";
    this.org_name = "";
    this.rating = "";
    this.isThirtyDays = true;
    this.isToday = false;
    this.iscustomDate = false;
    this.isLastsevenDay = false;
    this.ShowCustom = false;
    this.Division = [];
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

    const ListInput: ListInput = {} as ListInput;
    ListInput.from_date = this.from_date
    ListInput.to_date = this.to_date
    ListInput.size = 10;
    this.FeedbackList(ListInput);

    this.myDrop.close();
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

  accountType() {
    //  alert("hii");
    this.account_name = "";
    this.account_id = "";


    const data2: InputData1 = {} as InputData1;
    data2.size = 5;
    data2.account_name = this.AllFilters.value.account_name;
    this.GetAccount(data2)
  }
  FeedbackList(ListInput: any) {

    this.FilterStrings(ListInput)
    //this.loader.open()
    debugger;
    this.items = [];
    this.totalrecord = 0

    this.OrderListService.FeedbackList(ListInput).subscribe(

      data => {



        if (data.success == true) {


          this.loader.close()


          this.items = data.data.result;
          //this.totalrecord = data.rangeInfo.total_row;
          this.totalrecord = data.data.total_results;
          //this.totalrecord = data.data.total_count;
          this.showRecords = data.data.result.length
          //alert(this.totalrecord);
          console.log(this.items.length)

          // this.page.totalElements = data.data.total_results;
          // this.items = this.temp = data.data.result;





        }


        else {
          this.loader.close()

          // this.page.totalElements = 0;
          this.toastrService.error(data.data.msg)
        }
      }, (err) => {


      }

    );


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


  orderDetailsModal: any;
  closeResult: string;
  TempDAta: any;
  orderInformations: any;
  details(row) {
    debugger
    this.loader.open()

    this.TempDAta = [];

    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.otc_number = row.otc_order_number;
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

  invoiceData = [];
  Titile: string;
  invoiceotc: string;
  ViewInvoice(row) {

    const ListInput1: ListInput = {} as ListInput;
    ListInput1.invoice_no = row.invoice_no;

    this.OrderListService.GetInvoiceCopy(ListInput1).subscribe(

      data => {
        debugger

        // this.loader.open();

        if (data.success == true) {



          this.invoiceData = data.data
          this.invoiceotc = row.otc_order_number
          this.Titile = row.invoice_no


          // let dialogRef: MatDialogRef<any> = this.dialog.open(InvoiceCopyComponent,{
          //   panelClass: 'my-class',


          //   disableClose: false,
          //   data: { title: Titile, payload: Tempdata, OtcNumber: row.otc_order_number }

          // })

          let ngbModalOptions: NgbModalOptions = {
            backdrop: true,
            keyboard: true
          };
          this.modalService.open(this.invoicePopup, ngbModalOptions).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason: any) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
          this.loader.close();







        }



        else {

          Swal.fire('Please Check Details After Some Time');

          this.loader.close();
        }
      }, (err) => {
        this.loader.close();

      }

    );


  }


  EDownload: any;
  count: any;
  pageName: any;

  ExportDownload() {
    debugger
    //  if (event.target.value == " ") {
    //    Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
      if (this.totalrecord == 0) {
        Swal.fire("No Data For downloding");
      } else {
        const AllFilters: ListInput = {} as ListInput;

        if (this.to_date) { AllFilters.to_date = this.to_date; } else { AllFilters.to_date = ""; }

        if (this.from_date) { AllFilters.from_date = this.from_date; } else { AllFilters.from_date = ""; }

        if (this.otc_number) { AllFilters.otc_number = this.otc_number; } else { AllFilters.otc_number = ""; }

        if (this.division_name) { AllFilters.division_name = this.division_name; } else { AllFilters.division_name = ""; }

        if (this.account_name) { AllFilters.account_name = this.account_name; } else { AllFilters.account_name = ""; }

        if (this.distributor_name) { AllFilters.org_name = this.distributor_name; } else { AllFilters.org_name = ""; }

        AllFilters.size = this.totalrecord;
        AllFilters.offset = 0;

        this.EDownload = AllFilters;
        this.count = this.totalrecord;
        this.pageName = "feedback";
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
    }
  // }

  SearchOTc(event) {
    if (event.key === "Enter") {
      const ListInput: ListInput = {} as ListInput;
      ListInput.from_date = localStorage.getItem("FromDate");
      ListInput.to_date = localStorage.getItem("ToDate");
      ListInput.otc_number = event.target.value
      this.FeedbackList(ListInput);
    }
  }

  showAccount(event) {
    const ListInput: ListInput = {} as ListInput;
    ListInput.from_date = localStorage.getItem("FromDate");
    ListInput.to_date = localStorage.getItem("ToDate");
    ListInput.otc_number = event.target.value
    this.FeedbackList(ListInput);
  }

  onRemoveFilter(filterString) {
    this.isDivisionVisible = false;

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
      this.division_id = "";
      this.division_name = ""
      this.DivisionList.reset();
      this.Division = [];
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
    else if (filterString.Key == "invoice_no") {
      this.invoice_no = ""
      this.AllFilters.get("invoice_no").setValue("")
    }
    else if (filterString.Key == "range_gt") {
      this.rating = ""
      this.AllFilters.get("rating").setValue("")
    }
    else if (filterString.Key == "division_name") {
      this.division_id = "";
      this.division_name = "";
      // this.AllFilters.get("div_id").setValue("")
      this.DivisionList.reset();
    }
    this.SearchAllDate();
  }
}
export interface AllInput {
  account_id: string;
  division_name: String;
  //account_name: any;
  otc_order_number: any;
  organization_name: string;
  otc_number: string;

  // order_status_array: any;
  // invoice_status: string
  invoice_no: string
  //otc_number: string
  order_from_date: string
  ////order_to_date: string
  // tracking_from_date: string
  // tracking_to_date: string
  divison_id: string
  offset: number
  org_name: string
  size: number
  to_date: string;
  from_date: string


  account_name: any;
  invoice_from_date: any;
  invoice_to_date: any;
  distributor_id: any;

}
export class InputData1 {

  size: number
  org_search_text: string
  account_name: string;
  div_search_text: string
  distributor_id: any;


}

export class ListInput1 {

  otc_number: string
  static offset: number;
  from_date: string;
  to_date: string;
  //   range_gt: string
  //   range_lt: string
  //   from_date: string
  //   to_date: string

  //   invoice_no: string
  //   offset: number
  //   size: number
  //   //account_id: string
  //   //distributor_id: string
  //   //div_id: string

  //   division_name: string
  //   account_name: string
  //   org_name: string
  //   otc_order_number: any;
  //   static otc_number: any;

}

export class InputData {

  size: number
  org_search_text: string


}
export interface Input {
  from_date: String
  to_date: String

  // otc_order_number: String

  org_name: String
  division_name: String
  account_name: String



  distributor_id: any;
  distributor_name: String
  offset: number
  size: number
}
export class ListInput {

  otc_number: string
  range_gt: string
  range_lt: string
  from_date: string
  to_date: string

  invoice_no: string
  offset: number
  size: number
  //account_id: string
  distributor_id: string
  //div_id: string

  division_name: string
  account_name: string
  org_name: string
  //otc_order_number: string;



}
// export class ExpotInputdata {


//   Invoice_No: string
//   OTC_Number: string
//   Portal_Order_No: string
//   Distributor_Name: string
//   Customer_Name: string
//   CreatedDate: string
//   Order_Date: string
//   Delivery_Date: string
//   Rating: string

//   Comment: string

// }

export class InputOrderDetail {
  order_number: string
  otc_number: string;
}

export class feedbackinput {
  account_name: string
  division_name: string
  from_date: string
  invoice_no: string
  org_name: string
  otc_number: string
  range_gt: string;
  range_lt: string;
  size: number;
  to_date: string;
  offset: number;
  distributor_id: string;
}