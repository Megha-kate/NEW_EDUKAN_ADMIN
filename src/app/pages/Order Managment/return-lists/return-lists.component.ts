import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';


import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import * as moment from 'moment';
import { CommonService } from './../../../shared/Services/common-service.service';

@Component({
  selector: 'app-return-lists',
  templateUrl: './return-lists.component.html',
  styleUrls: ['./return-lists.component.scss']
})
export class ReturnListsComponent implements OnInit {

  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('CancelDetails', { read: TemplateRef, static: false }) CancelDetails: TemplateRef<any>;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  items: any[];
  totalrecord: number;
  CustomerList = new FormGroup({});
  DistributorList = new FormGroup({});
  DivisionList = new FormGroup({});

  Division = [];

  currentPage: any;
  noofrecordsperpage: number;

  public AllFilters: FormGroup;
  ShowCustom: boolean;
  todaydate: boolean;
  sevenday: boolean;
  iscustomDate: boolean = false;
  isLastsevenDay: boolean = false;
  isToday: boolean = false;
  isThirtyDays: boolean;
  Filterarray: any[];

  AccountName: FormGroup;
  account_name: string;
  account_id: string;
  distributor_id: string;
  distributor_name: string;
  DistributorData: any[];
  filterValue2: any;
  isDistDrpDownVisible: boolean;
  RoleName: any;
  DistCode: string;
  selectedDateOption: string;
  from_date: any;
  date: Date;
  to_date: any;

  currDiv: any

  isDivisionVisible:boolean;

  constructor(
    private OrderListService: OrderserviceService,
    private CommonService: CommonService,
    private modalService: NgbModal,
    private loader: AppLoaderService,
    private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {

    this.date = new Date();

    this.currentPage = 1;
    this.noofrecordsperpage = 10

    this.from_date = localStorage.getItem("FromDate");
    this.to_date = localStorage.getItem("ToDate");

    const ListInput: ListInput1 = {} as ListInput1;
    ListInput.from_date = localStorage.getItem("FromDate");
    ListInput.to_date = localStorage.getItem("ToDate");
    ListInput.cr_request_type = "order_return"
    ListInput.offset = 0;
    this.ReturnList(ListInput)

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = "";

    const data: InputData1 = {} as InputData1
    data.size = 5;
    data.account_name = "";
    this.GetAccount(data);

    const ExportArrayInput: InputData = {} as InputData;

    ExportArrayInput.size = 5;
    this.GetDistributor(ExportArrayInput);

    this.isDistDrpDownVisible = true;
    this.isDivisionVisible = false;

    this.RoleName = this.CommonService.getRole();
    this.DistCode = this.CommonService.GetDistributorCode()

    if (this.RoleName != "TML") {
      this.isDistDrpDownVisible = false;
      this.isDivisionVisible = true
      const data1: InputData1 = {} as InputData1;

      // data.distributor_id = Event.distributor_id;
      data.distributor_id = this.DistCode;
      data.div_search_text = "";

      this.Getdivision(data1);
    }

    this.isThirtyDays = true;




    this.BuildForm();









  }

  page: any;
  cancel_order_number: any;
  otc_number: any;
  pageChange(page) {
    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;

    const ListInput: inputAll = {} as inputAll;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

    if (this.otc_number) { ListInput.otc_order_number = this.otc_number; } else { ListInput.otc_order_number = ""; }

    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

    if (this.cancel_order_number) { ListInput.cancel_order_number = this.distributor_id; } else { ListInput.cancel_order_number = ""; }

    ListInput.cr_request_type = "order_return"

    ListInput.offset = (page * 10);
    ListInput.size = (page * 10) + 10;
    this.ReturnList(ListInput);


  }

  
  BuildForm() {
    this.AllFilters = this.fb.group({

      otc_number: [''],
      invoice_no: [''],
      cancel_order_number: [''],
      to_date: [''],
      from_date: [''],
      account_name: [''],
      org_name: [''],
      div_id: [''],
      distributor_id: [''],
      distributor_name: [''],
      Today: [],
      Custom: [],
      thirtyDays: [],
      Sevenday: [],
    });
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

  Getdivision(Data1) {
    this.CommonService.DivisionList(Data1).subscribe(

      data => {


        if (data.success == true) {
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

  accountType() {
    //  alert("hii");
    this.account_name = "";
    this.account_id = "";


    const data2: InputData1 = {} as InputData1;
    data2.size = 5;
    data2.account_name = this.AllFilters.value.account_name;
    this.GetAccount(data2)
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

    if (event.target.checked) {
      this.distributor_id = row.distributor_id
      this.distributor_name = row.distributor_name

      if (event.target.checked) {
        for (const field1 in this.DistributorList.controls) { // 'field' is a string
          if (field1 == this.distributor_id) {
            this.DistributorList.get(field1).setValue(true);
            this.isDivisionVisible = true
            const data: InputData = {} as InputData;
            data.distributor_id = this.distributor_id;
            data.div_search_text = "";
            this.Getdivision(data);
          }
          else {
            this.DistributorList.get(field1).setValue(false);
            this.Division=[];
          }

        }
      }

      else {
        this.distributor_id = "";
        this.distributor_name = "";
        for (const field1 in this.DistributorList.controls) { // 'field' is a string
          this.DistributorList.get(field1).setValue(false);
          this.Division=[];
          this.isDivisionVisible = false
        }
      }

    }
    else {
      this.distributor_id = "";
      this.distributor_name = "";
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        this.DistributorList.get(field1).setValue(false);
        this.Division=[];
      }
    }


    //    this.Getdivision(row)

  }

  division_name: any;
  division_id: any;
  divisionfilteradd(row, event) {

    if (event.target.checked) {
      this.division_name = row.div_name
      this.division_id = row.div_id
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

  invoice_no: string
  div_id: string;
  org_name: string;
  resetALl() {
    this.isDivisionVisible =false;

    this.AllFilters.reset();
    this.DistributorList.reset();
    this.DivisionList.reset();
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.otc_number = "";
    this.cancel_order_number = "";
    this.from_date = "";
    this.to_date = "";

    this.invoice_no = "";

    this.account_id = "";
    this.distributor_id = "";
    this.div_id = "";

    this.division_name = "";
    this.account_name = "";
    this.org_name = "";
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

    const ListInput: ListInput1 = {} as ListInput1;
    ListInput.from_date = localStorage.getItem("FromDate");
    ListInput.to_date = localStorage.getItem("ToDate");
    ListInput.cr_request_type = "order_return"
    this.ReturnList(ListInput)

    this.myDrop.close();
  }

  
  calculateDate1(Date1,date2){
    debugger
      Date1 = new Date(Date1);
      date2 = new Date(date2);
      var diffc = Date1.getTime() - date2.getTime();
     
      var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));
      
      return days;
    }
  SearchAllDate() {
    debugger;
    // if (this.from_date == undefined) {

    //   this.from_date = new Date(this.date.getFullYear(), this.date.getMonth(), 1);
    //   this.to_date = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0);
    //   this.from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
    //   this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
    // }
    // this.AllFilters.value.from_date = this.from_date;

    // this.AllFilters.value.size = 10;
    // this.AllFilters.value.to_date = this.to_date;


    // if (this.to_date) {
    //   this.AllFilters.get('to_date').setValue(this.to_date);

    //   this.AllFilters.value.order_to_date = this.to_date;
    //   this.AllFilters.value.to_date = this.to_date;
    // }
    // else {

    //   this.AllFilters.value.order_to_date = "";
    //   this.AllFilters.value.to_date = "";
    // }

    // if (this.from_date) {
    //   this.AllFilters.get('from_date').setValue(this.from_date);
    //   this.AllFilters.value.order_from_date = this.from_date;
    //   this.AllFilters.value.from_date = this.from_date;
    // } else {

    //   this.AllFilters.value.order_from_date = "";
    // }


    // this.AllFilters.value.size = 10;
    // this.CancleList(this.AllFilters.value);
    // this.Filterarray = [];

    //   for (let item in this.AllFilters.controls) {

    //   if (this.AllFilters.controls[item].value) {
    //     var Json = { "Key": item, "Value": this.AllFilters.controls[item].value }

    //     this.Filterarray.push(Json)
    //   }
    // }

    let fromDate = localStorage.getItem("FromDate");
    let toDate = localStorage.getItem("ToDate");
    this.currentPage = 1
    this.Filterarray = [];
    var a = this.DistributorList.valid;

    if (this.iscustomDate == true) {
      if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
        Swal.fire('Select From Date');
        const ListInput: inputAll = {} as inputAll;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
        //ListInput.cr_request_type = "order_cancellation"
        this.ReturnList(ListInput)
        this.loader.close()
        return
      }
      else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
        Swal.fire('Select To Date');
        const ListInput: inputAll = {} as inputAll;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
        //ListInput.cr_request_type = "order_cancellation"

        this.ReturnList(ListInput)
        this.loader.close()
        return
      }
      var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
      var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
      var days = this.calculateDate1(d1,d2);
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
        const ListInput: inputAll = {} as inputAll;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
       // ListInput.cr_request_type = "order_cancellation"
        this.ReturnList(ListInput)
        this.loader.close()
        return
        
      }
      else if(days >= 95){
        Swal.fire(' Please select the date range up to 95 days ');
        const ListInput: inputAll = {} as inputAll;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
       // ListInput.cr_request_type = "order_cancellation"
        this.ReturnList(ListInput)
        this.loader.close()
        return
      }
      this.from_date = this.AllFilters.value.from_date;
      this.to_date = this.AllFilters.value.to_date
      this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
      this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
    }
    else if (this.isLastsevenDay == true) {
      this.from_date = moment(toDate).subtract(7, 'days').format('yyyy-MM-DD')
      this.to_date = this.datepipe.transform(toDate, 'yyyy-MM-dd')
    }
    else if (this.isToday == true) {
      this.from_date = moment(toDate).format('yyyy-MM-DD')
      this.to_date = this.datepipe.transform(toDate, 'yyyy-MM-dd')
    }
    else if (this.isThirtyDays == true) {
      this.from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
      this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
    }

    this.otc_number = this.AllFilters.value.otc_number;
    this.cancel_order_number = this.AllFilters.value.cancel_order_number;

    if (this.distributor_id != "") {
      this.AllFilters.get('distributor_id').setValue(this.distributor_id);
      this.AllFilters.get('org_name').setValue(this.distributor_name);
    }
    else {
      this.distributor_name = this.AllFilters.value.org_name;
      this.AllFilters.get('distributor_id').setValue('');
      this.AllFilters.get('org_name').setValue(this.distributor_name);
    }

    if (this.account_id != "") {
      this.AllFilters.get('account_name').setValue(this.account_name);
    }

    // if (this.division_id != "") {
    //   this.AllFilters.get('division_name').setValue(this.division_name);
    // }


    if (this.from_date) {
      this.AllFilters.get('from_date').setValue(this.from_date);
    }
    if (this.to_date) {
      this.AllFilters.get('to_date').setValue(this.to_date);
    }

    const ListInput: inputAll = {} as inputAll;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

    if (this.otc_number) { ListInput.otc_order_number = this.otc_number; } else { ListInput.otc_order_number = ""; }

    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

    if (this.cancel_order_number) { ListInput.cancel_order_number = this.cancel_order_number; } else { ListInput.cancel_order_number = ""; }

    ListInput.cr_request_type = "order_return"

    ListInput.offset = 0
    ListInput.size = this.noofrecordsperpage

    this.ReturnList(ListInput);

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
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'distributor_id');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'cr_request_type');

    var from_date1 = ListInput.from_date;
    var to_date1 = ListInput.to_date;
    var finaldate = this.dateformate(from_date1) + ' '+ 'to' + ' ' + this.dateformate(to_date1);
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');

    var Json1 = { "Key": 'from_date', "Value": finaldate }
    this.Filterarray.push(Json1)
  }

  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }


  ReturnList(ListInput: any) {
    debugger;
   // this.loader.open();
    this.FilterStrings(ListInput)
    this.items = [];
    this.totalrecord = 0

    this.OrderListService.CancleOrderList(ListInput).subscribe(

      data => {



        if (data.success == true) {


          this.loader.close()
        
          this.items = data.data.result;
          //this.totalrecord = data.rangeInfo.total_row;
          this.totalrecord = data.data.total_count;
         // alert(this.totalrecord);
          // this.page.totalElements = data.data.total_results;
          // this.items = this.temp = data.data.result;





        }


        else {
          this.loader.close()

          // this.page.totalElements = 0;

          //this.toastrService.error(data.data.msg)
        }
      }, (err) => {


      }

    );


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
    ListInput1.otc_number = row.otc_order_number ;
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


  CancellationInformations: any;
  cancellog(data) {
    debugger
    this.loader.open()
    const ListInput4: InputCancelDetail = {} as InputCancelDetail;
    ListInput4.cancel_order_number = data.cancel_order_number;

    this.OrderListService.CancelOrderDetails(ListInput4).subscribe(
      data => {
        if (data.success == true) {
          this.loader.close()
          this.CancellationInformations = data.data.result[0];
          let ngbModalOptions: NgbModalOptions = {
            backdrop: true,
            keyboard: true
          };
          this.modalService.open(this.CancelDetails, ngbModalOptions).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason: any) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });

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


  EDownload: any;
  count: any;
  pageName: any;

  ExportDownload() {
    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
    //   if (this.totalrecord == 0) {
    //     Swal.fire("No Data For downloding");
    //   } else {

      
      const AllFilters: ListInput5 = {} as ListInput5;

      if (this.account_name) { AllFilters.account_name = this.account_name; } else { AllFilters.account_name = ""; }

      if (this.otc_number) { AllFilters.otc_order_number = this.otc_number; } else { AllFilters.otc_order_number = ""; }

      if (this.cancel_order_number) { AllFilters.cancel_order_number = this.cancel_order_number; } else { AllFilters.cancel_order_number = ""; }

      if (this.from_date) { AllFilters.from_date = this.from_date; } else { AllFilters.from_date = ""; }

      if (this.to_date) { AllFilters.to_date = this.to_date; } else { AllFilters.to_date = ""; }

      if (this.distributor_name) { AllFilters.org_name = this.distributor_name; } else { AllFilters.org_name = ""; }
      if (this.division_id) { AllFilters.division_name = this.division_id; } else { AllFilters.division_name = ""; }
      AllFilters.cr_request_type = "order_return"

      AllFilters.size = this.totalrecord;
      AllFilters.offset = 0;

      this.EDownload = AllFilters;
      this.count = this.totalrecord;
      this.pageName = "return";
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

  SearchCancelNo(event) {
    if (event.key === "Enter") {
      const ListInput: ListInput2 = {} as ListInput2;
      ListInput.from_date = localStorage.getItem("FromDate");
      ListInput.to_date = localStorage.getItem("ToDate");
      ListInput.cr_request_type = "order_return";
      ListInput.cancel_order_number = event.target.value;
      this.ReturnList(ListInput)
    }
  }

  showAccount($event) {

    const ListInput: ListInput2 = {} as ListInput2;
    ListInput.cancel_order_number = $event.target.value;
    ListInput.from_date = localStorage.getItem("FromDate");
    ListInput.to_date = localStorage.getItem("ToDate");
    ListInput.cr_request_type = "order_return";
    ListInput.cancel_order_number = $event.target.value;
    this.ReturnList(ListInput);

  }

  onRemoveFilter(filterString) {
    this.isDivisionVisible =false;

    if (filterString.Key == "otc_order_number") {
      this.otc_number = "";
      this.AllFilters.get("otc_number").setValue("")
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
      this.division_name = "";
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
    else if (filterString.Key == "division_name") {
      this.division_id = "";
      this.division_name = "";
      // this.AllFilters.get("div_id").setValue("")
      this.DivisionList.reset();
      this.Division = [];
    }
    else if (filterString.Key == "cancel_order_number") {
      this.cancel_order_number = "";
      this.AllFilters.get("cancel_order_number").setValue("")
    }
    this.SearchAllDate();
  }
}

export class InputData1 {

  size: number
  org_search_text: string
  account_name: string;
  div_search_text: string
  distributor_id: any;


}




export class InputData {

  size: number
  org_search_text: string
  distributor_id: string;
  div_search_text: string;


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
  //distributor_id: string
  //div_id: string

  division_name: string
  account_name: string
  org_name: string
  //otc_order_number: string;
  static size: number;

}


export class InputOrderDetail {
  order_number: string
  otc_number:string;
}


export class ListInput1 {
  cr_request_type: string
  from_date: string
  offset: 0
  to_date: string;
}

export class ListInput2 {
  cr_request_type: string
  from_date: string
  offset: 0
  to_date: string;
  cancel_order_number: string;
}

export class InputCancelDetail {
  cancel_order_number
}

export class ListInput5 {

  cancel_order_number: string
  otc_order_number: string

  from_date: string
  to_date: string
  offset: number
  size: number
  order_number: string


  //distributor_id: string
  //division_id: string
  // account_id: string

  division_name: string
  account_name: string
  org_name: string
  cr_request_type: string;



}

export class inputAll {
  account_name: string;
  cancel_order_number: string;
  cr_request_type: string;
  division_name: string;
  from_date: string;
  order_number: string;
  org_name: string;
  otc_order_number: string;
  to_date: string;
  distributor_id: any;
  offset: number
  size: number
}
export class Input {
  //otc_number:string;
  account_id: string;
  account_name: string;
  account_type: string;
  customer_segment: string;
  distributor_code: string;
  distributor_name: string;
  from_date: string;
  offset: number
  to_date: string;
  cancel_order_number: string;
}

