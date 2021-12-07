import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { OrderserviceService } from './../../../shared/Services/orderservice.service'
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from './../../../shared/Services/common-service.service'
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { NgModule } from '@angular/core';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OwlDateTimeIntl } from 'ng-pick-datetime';
import { DefaultIntl } from './../../OwlDatefomat'
@Component({
  selector: 'app-order-tracking',
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.scss'],
  providers: [
    { provide: OwlDateTimeIntl, useClass: DefaultIntl },
  ],
})
export class OrderTrackingComponent implements OnInit {
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('invoiceDetails', { read: TemplateRef, static: false }) invoiceDetails: TemplateRef<any>;
  @ViewChild('cashDetails', { read: TemplateRef, static: false }) cashDetails: TemplateRef<any>;
  @ViewChild('TrackingReject', { read: TemplateRef, static: false }) TrackingReject: TemplateRef<any>;
  @ViewChild('reportAllDownload', { read: TemplateRef, static: false }) reportAllDownload: TemplateRef<any>;
  @ViewChild('reportDownload', { read: TemplateRef, static: false }) reportDownload: TemplateRef<any>;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  selection = new SelectionModel<any>(false, []);

  DistributorList = new FormGroup({});
  CustomerList = new FormGroup({});
  DivisionList = new FormGroup({});

  date: Date;
  ShowCustom: boolean;
  isOrderdate: boolean;
  iscustomDate: boolean;
  from_date: any;
  Division = [];
  to_date: any;
  isLastsevenDay: boolean;
  isToday: boolean;
  isInvoicedate: boolean;
  invoice_from_date: string;
  invoice_to_date: string;
  isTrackingdate: any;
  tracking_from_date: string;
  tracking_to_date: string;
  account_name: any;
  otcnumber: any;
  order_from_date: string;
  order_to_date: string;
  division_name: any;
  AccountName: FormGroup;
  division_id: any;
  div_id: string;
  filterValue2: any;
  isDistDrpDownVisible: boolean;
  DistCode: string;
  isThirtyDays: boolean;
  isDivisionVisible: boolean;
  showRecords: number;
  otc_order_number: any;

  constructor(private OrderListService: OrderserviceService,
    private CommonService: CommonService,
    private modalService: NgbModal,
    private loader: AppLoaderService,
    private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService,
    // private dataPass: DataPassService,
    private datepipe: DatePipe,
    dateTimeAdapter: DateTimeAdapter<any>
  ) { }
  myControl = new FormControl();
  // selected = new FormControl();
  //DistributorList = new FormGroup({})
  OrderTrackingList = new FormGroup({})
  currentPage: any
  totalrecord: any
  noofrecordsperpage: any;
  currDiv: any;
  href: any;
  public AllFilters: FormGroup;
  public AllDatefiler: FormGroup;
  invoice_status: string;

  // dateTimeAdapter.setLocale('en-IN');

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  Allorder_status: any;
  RoleName: any;
  ShowDate: boolean;
  divison_id: any;
  account_id: any;
  org_name: any;
  Allinvoice_status: any;
  Allinvoice_no: any;
  Allotc_number: any;
  Allorder_from_date: any;
  Allorder_to_date: any;

  Alldivison_id: any;

  Allorg_name: any;
  Alltracking_from_date: any;
  Alltracking_to_date: any;

  Pinvoice_status: any;
  Pinvoice_no: any;
  Potc_number: any;
  Porder_from_date: any;
  Porder_to_date: any;

  Pdivison_id: any;

  Porg_name: any;
  Ptracking_from_date: any;
  Ptracking_to_date: any;

  isdiableeporrt: any

  pagevalid: boolean
  // minDate :any
  meeting: any
  isdistributor: any;
  mindate: any;
  Maxday: any;
  tableOffset: any;
  Date: any;
  public itemForm: FormGroup;
  FromDate: string;
  ToDate: string;
  OrderFromDate: string;
  OrderToDate: string;
  curenttab: any;
  Allaccount_id: AnalyserNode;
  otc_number: string;
  invoice_no: string;

  public trackingdate = new FormControl(new Date());

  invoice_ids1 = [];
  selected = [];
  isSelected: boolean;
  selectedItemsList = [];

  public myForm: FormGroup;

  public max = new Date();

  currency: string = '₹';

  selectedDateOption: any;

  orderDate: boolean
  trackingDate: boolean;
  invoiceDate: boolean;

  ngOnInit(): void {

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.showRecords = 10;

    this.href = this.router.url;
    // alert(this.href)
    this.from_date = localStorage.getItem("FromDate");
    this.to_date = localStorage.getItem("ToDate");
    this.href = this.router.url;
    // alert(this.href)

    var d = new Date();
    d.setDate(d.getDate() - 3);
    this.mindate = d;

    this.orderDate = true;
    this.isThirtyDays = true
    this.currDiv = "All"
    this.currentPage = 1
    this.noofrecordsperpage = 10
    const ListInput1: AllInput = {} as AllInput;
    ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
    ListInput1.invoice_status = "";
    ListInput1.invoice_no = "";
    ListInput1.otc_number = "";
    ListInput1.order_from_date = localStorage.getItem("FromDate");
    ListInput1.order_to_date = localStorage.getItem("ToDate");
    ListInput1.tracking_from_date = ""; //this.FromDate;
    ListInput1.tracking_to_date = "";// this.ToDate;
    ListInput1.divison_id = "";
    ListInput1.offset = 0;
    ListInput1.org_name = "";
    ListInput1.account_name = "";
  
    ListInput1.size = 10;
    this.AllorderList(ListInput1);
    //this.noofrecordsperpage = 10
    //  const ListInput1: AllInput = {} as AllInput;
    // ListInput1.order_status_array = ["Confirmed"] //this.Allorder_status;
    // ListInput1.invoice_status = " ";
    // ListInput1.invoice_no = "";
    // ListInput1.otc_number = "";
    // ListInput1.order_from_date = "";
    // ListInput1.order_to_date = "";
    // ListInput1.tracking_from_date = ""; //this.FromDate;
    // ListInput1.tracking_to_date = "";// this.ToDate;
    // ListInput1.divison_id = "";
    // ListInput1.offset = 0;
    // ListInput1.organization_name = "";
    // ListInput1.account_name = "";
    // ListInput1.size = 10

    // ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"]
    // ListInput1.invoice_no = "";
    // ListInput1.otc_number = "";
    // ListInput1.order_from_date = "";
    // ListInput1.order_to_date = "";
    // ListInput1.tracking_from_date = ""; //this.FromDate;
    // ListInput1.tracking_to_date = "";// this.ToDate;
    // ListInput1.divison_id = "";
    // ListInput1.offset = 0;
    // ListInput1.org_name = "";

    // ListInput1.invoice_status = "";
    // ListInput1.size = 10

    // this.AllorderList(ListInput1);



    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = "";

    this.GetDistributor(data1);
    const data3: InputData3 = {} as InputData3
    data3.size = 5;
    data3.div_name = "";
    this.GetAccount(data3);

    this.isDistDrpDownVisible = true;


    this.RoleName = this.CommonService.getRole();
    this.DistCode = this.CommonService.GetDistributorCode()

    this.isdistributor = true;
    if (this.RoleName == "TML") {
      this.ShowDate = true;
      this.isdistributor = false
      this.isDistDrpDownVisible = false;
      this.isDivisionVisible = false
    }
    else {
      const data1: InputData1 = {} as InputData1;
      data1.distributor_id = this.DistCode;
      data1.div_search_text = "";
      this.isDivisionVisible = true;
      this.Getdivision(data1);
    }

    const data: InputData1 = {} as InputData1;

    // data.distributor_id = Event.distributor_id;
    data.distributor_id = this.DistCode;
    data.div_search_text = "";

    // this.Getdivision(data1);


    this.BuildForm();

    const data5: InputPageCount = {} as InputPageCount;
    data5.page_type = "order_tracking";
    data5.from_date = localStorage.getItem("FromDate");
    data5.to_date = localStorage.getItem("ToDate");
    this.GetPageCount(data5);

  }


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

          this.loader.close();
          //
        }
      }, (err) => {
        // this.loader.close();
      }
    );
  }
  divisiontype() {
    this.div_id = ""
    this.division_name = ""

    const data1: InputData3 = {} as InputData3;

    data1.size = 5;
    data1.div_search_text = this.AllFilters.value.division_name;
    // this.Getdivision(data1);
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
    // const data1: InputData2 = {} as InputData2;
    // data1.size = 5;
    // data1.cust_search_text = this.itemForm.value.account_name
    // this.Accountnamedata = this.Accountnamedata.filter(obj => obj.account_name.toLowerCase().indexOf(data1.cust_search_text) > -1)
    // this.GetAccount(this.Accountnamedata);

    // this.account_name = "";
    // this.account_id = ""

    const data2: InputData1 = {} as InputData1;
    data2.size = 5;
    data2.account_name = this.AllFilters.value.account_name;
    this.GetAccount(data2)
  }


  filterMyOptionsCustname(row, event, index) {

    // var prevIndex;
    this.account_id = row.account_id;
    this.account_name = row.account_name;

    // this.Accountnamedata[index].isChecked = true
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
  checkboxData = [1, 2, 3, 4, 5, 6, 7, 8];
  isChecked;
  isCheckedName;
  onChange(e) {
    this.isChecked = !this.isChecked;
    this.isCheckedName = e.target.name;
  }






  BuildForm() {
    this.AllFilters = this.fb.group({

      invoice_status: [''],
      invoice_no: [''],
      otc_number: [''],
      order_from_date: [''],
      order_to_date: [''],
      tracking_from_date: [''],
      tracking_to_date: [''],
      divison_id: [''],
      org_name: [''],
      account_name: [''],
      Custname: [''],
      invoice_from_date: [''],
      invoice_to_date: [''],
      Distributor_Id: [''],
      order_status_array: [],
      size: [],
      offset: [],
      otc_no_search: []
    })



    this.AllDatefiler = this.fb.group({

      Today: [],
      Custom: [],
      thirtyDays: [true],
      Sevenday: []
    })
  }

  Filterarray: any = []
  distributor_id: any
  distributor_name: any;
  dstfilteradd(row, event) {

    if (event.target.checked) {
      this.distributor_id = row.distributor_id
      this.distributor_name = row.distributor_name
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        if (field1 == this.distributor_id) {
          this.DistributorList.get(field1).setValue(true);
          this.isDivisionVisible = true;
          const data: InputData1 = {} as InputData1;
          data.distributor_id = this.distributor_id;
          data.div_search_text = "";
          this.Getdivision(data);
        }
        else {
          this.DistributorList.get(field1).setValue(false);
          this.Division = [];
        }

      }
    }

    else {
      this.distributor_id = "";
      this.distributor_name = "";
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        this.DistributorList.get(field1).setValue(false);
        this.Division = [];
        this.isDivisionVisible = false;
      }
    }


  }
  // SearchAllDate() {



  //   var a = this.DistributorList.valid;
  //   //(this.DistributorList.valid)



  //   this.Filterarray = [];


  //   if (this.distributor_id != "") {

  //     this.AllFilters.get('Distributor_Id').setValue(this.distributor_id);
  //     this.AllFilters.get('org_name').setValue(this.distributor_name);
  //   }
  //   else {
  //     this.AllFilters.get('Distributor_Id').setValue('');
  //   }


  //   this.AllFilters.get('size').setValue(10);
  //   this.AllFilters.get('offset').setValue(0);
  //   this.AllFilters.get('order_status_array').setValue(["Confirmed", "Cancelled", "Partially Confirmed"]);

  //   this.AllorderList(this.AllFilters.value);

  //   // for(let item in this.AllFilters.controls){}



  //   for (let item in this.AllFilters.controls) {

  //     if (this.AllFilters.controls[item].value) {
  //       var Json = { "Key": item, "Value": this.AllFilters.controls[item].value }

  //       this.Filterarray.push(Json)
  //     }


  //   }


  //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
  //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'order_status_array');
  //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');


  //   this.myDrop.close();

  // }

  SearchAllDate() {
    this.currentPage = 1
    this.Filterarray = [];


    if (this.tab == 1) {
      debugger;
      this.date = new Date();

      // if (this.orderDate == true) {
      //   this.trackingDate = false;
      //   this.invoiceDate = false;
      //   if (this.iscustomDate == true) {
      //     if (this.AllFilters.value.order_from_date == null || this.AllFilters.value.order_from_date == "" && this.AllFilters.value.order_to_date !== null) {
      //       Swal.fire('Select From Date');
      //       const ListInput1: AllInput = {} as AllInput;
      //       ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
      //       ListInput1.order_from_date = localStorage.getItem("FromDate");
      //       ListInput1.order_to_date = localStorage.getItem("ToDate");
      //       ListInput1.offset = 0;
      //       ListInput1.size = 10;
      //       this.AllorderList(ListInput1);
      //       return
      //     }
      //     else if (this.AllFilters.value.order_from_date !== null && this.AllFilters.value.order_to_date == null || this.AllFilters.value.order_to_date == "") {
      //       Swal.fire('Select To Date');
      //       return
      //     }
      //     var d1 = moment(this.AllFilters.value.order_from_date).format('yyyy-MM-DD')
      //     var d2 = moment(this.AllFilters.value.order_to_date).format('yyyy-MM-DD')
      //     var days = this.calculateDate1(d1, d2);
      //     if (d1 > d2) {
      //       Swal.fire('From-Date Should be Less Than To-Date.');
      //       return

      //     }
      //     else if (days >= 95) {
      //       Swal.fire(' Allow to get Only 95 Days Data');
      //       return
      //     }
      //     this.from_date = this.AllFilters.value.order_from_date;
      //     this.to_date = this.AllFilters.value.order_to_date;
      //     this.order_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
      //     this.order_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
      //   }
      //   else if (this.isLastsevenDay == true) {
      //     this.order_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
      //     this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      //   }
      //   else if (this.isToday == true) {
      //     this.order_from_date = moment(this.to_date).format('yyyy-MM-DD')
      //     this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      //   }
      //   else if (this.isThirtyDays == true) {
      //     this.order_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
      //     this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      //   }
      // }

      if (this.orderDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.order_from_date == null || this.AllFilters.value.order_from_date == "" && this.AllFilters.value.order_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.order_from_date = localStorage.getItem("FromDate");
            ListInput1.order_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.order_from_date !== null && this.AllFilters.value.order_to_date == null || this.AllFilters.value.order_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.order_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.order_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.order_from_date;
          this.to_date = this.AllFilters.value.order_to_date;
          this.order_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.order_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isLastsevenDay == true) {
          this.order_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isToday == true) {
          this.order_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.order_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }
      else if (this.invoiceDate == true) {
        this.trackingDate = false;
        this.orderDate = false;
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.invoice_from_date == null || this.AllFilters.value.invoice_from_date == "" && this.AllFilters.value.invoice_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.invoice_from_date = localStorage.getItem("FromDate");
            ListInput1.invoice_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.invoice_from_date !== null && this.AllFilters.value.invoice_to_date == null || this.AllFilters.value.invoice_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.invoice_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.invoice_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }

          this.from_date = this.AllFilters.value.invoice_from_date;
          this.to_date = this.AllFilters.value.invoice_to_date;
          this.invoice_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.invoice_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isToday == true) {
          this.invoice_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.invoice_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isLastsevenDay == true) {
          this.invoice_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.invoice_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.invoice_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.invoice_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }
      else if (this.trackingDate == true) {
        this.invoiceDate = false;
        this.orderDate = false;
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.tracking_from_date == null || this.AllFilters.value.tracking_from_date == "" && this.AllFilters.value.tracking_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.tracking_from_date = localStorage.getItem("FromDate");
            ListInput1.tracking_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.tracking_from_date !== null && this.AllFilters.value.tracking_to_date == null || this.AllFilters.value.tracking_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.tracking_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.tracking_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.tracking_from_date;
          this.to_date = this.AllFilters.value.tracking_to_date;
          this.tracking_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.tracking_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isToday == true) {
          this.tracking_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isLastsevenDay == true) {
          this.tracking_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.tracking_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }

      if (this.account_id != "") {
        this.AllFilters.get('account_name').setValue(this.account_name);
      }

      if (this.distributor_id != "") {
        this.AllFilters.get('Distributor_Id').setValue(this.distributor_id);
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }
      else {
        this.distributor_name = this.AllFilters.value.org_name;
        this.AllFilters.get('Distributor_Id').setValue('');
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }

      if (this.orderDate == true) {
        this.AllFilters.get('order_from_date').setValue(this.order_from_date);
        this.AllFilters.get('order_to_date').setValue(this.order_to_date);
      }
      if (this.trackingDate == true) {
        this.AllFilters.get('tracking_from_date').setValue(this.tracking_from_date);
        this.AllFilters.get('tracking_to_date').setValue(this.tracking_to_date);
      }
      if (this.invoiceDate == true) {
        this.AllFilters.get('invoice_from_date').setValue(this.invoice_from_date);
        this.AllFilters.get('invoice_to_date').setValue(this.invoice_to_date);
      }

      // this.AllFilters.get('size').setValue(10);
      // this.AllFilters.get('offset').setValue(0);

      this.otc_number = this.AllFilters.value.otc_number;
      this.invoice_no = this.AllFilters.value.invoice_no
      this.invoice_status = this.AllFilters.value.invoice_status

      const AllFilters: AllInput = {} as AllInput;

      if (this.orderDate == true) {
        if (this.order_from_date) { AllFilters.order_from_date = this.order_from_date; } else { AllFilters.order_from_date = ""; }
        if (this.order_to_date) { AllFilters.order_to_date = this.order_to_date; } else { AllFilters.order_to_date = ""; }
        if (this.tracking_from_date) { AllFilters.tracking_from_date = this.tracking_from_date; } else { AllFilters.tracking_from_date = ""; }
        if (this.tracking_to_date) { AllFilters.tracking_to_date = this.tracking_to_date; } else { AllFilters.tracking_to_date = ""; }
        if (this.invoice_from_date) { AllFilters.invoice_from_date = this.invoice_from_date; } else { AllFilters.invoice_from_date = ""; }
        if (this.invoice_to_date) { AllFilters.invoice_to_date = this.invoice_to_date; } else { AllFilters.invoice_to_date = ""; }
      }
      if (this.invoiceDate == true) {
        if (this.order_from_date) { AllFilters.order_from_date = this.order_from_date; } else { AllFilters.order_from_date = ""; }
        if (this.order_to_date) { AllFilters.order_to_date = this.order_to_date; } else { AllFilters.order_to_date = ""; }
        if (this.tracking_from_date) { AllFilters.tracking_from_date = this.tracking_from_date; } else { AllFilters.tracking_from_date = ""; }
        if (this.tracking_to_date) { AllFilters.tracking_to_date = this.tracking_to_date; } else { AllFilters.tracking_to_date = ""; }
        if (this.invoice_from_date) { AllFilters.invoice_from_date = this.invoice_from_date; } else { AllFilters.invoice_from_date = ""; }
        if (this.invoice_to_date) { AllFilters.invoice_to_date = this.invoice_to_date; } else { AllFilters.invoice_to_date = ""; }
      }
      if (this.trackingDate == true) {
        if (this.order_from_date) { AllFilters.order_from_date = this.order_from_date; } else { AllFilters.order_from_date = ""; }
        if (this.order_to_date) { AllFilters.order_to_date = this.order_to_date; } else { AllFilters.order_to_date = ""; }
        if (this.tracking_from_date) { AllFilters.tracking_from_date = this.tracking_from_date; } else { AllFilters.tracking_from_date = ""; }
        if (this.tracking_to_date) { AllFilters.tracking_to_date = this.tracking_to_date; } else { AllFilters.tracking_to_date = ""; }
        if (this.invoice_from_date) { AllFilters.invoice_from_date = this.invoice_from_date; } else { AllFilters.invoice_from_date = ""; }
        if (this.invoice_to_date) { AllFilters.invoice_to_date = this.invoice_to_date; } else { AllFilters.invoice_to_date = ""; }
      }

      if (this.otc_number) { AllFilters.otc_number = this.otc_number; } else { AllFilters.otc_number = ""; }

      if (this.division_name) { AllFilters.division_name = this.division_name; } else { AllFilters.division_name = ""; }

      if (this.invoice_no) { AllFilters.invoice_no = this.invoice_no; } else { AllFilters.invoice_no = ""; }

      // if (this.invoice_status) { AllFilters.invoice_status = this.invoice_status; } else { AllFilters.invoice_status = ""; }
      // if (this.invoice_status) {

      //   AllFilters.invoice_status = this.Allinvoice_status;
      // }
      // else {
      //   this.Allinvoice_status = ""
      //   AllFilters.invoice_status = this.invoice_status;
      // }

      if (this.invoice_status != "") {
        if (this.invoice_status) { AllFilters.invoice_status = this.invoice_status; } else { AllFilters.invoice_status = ""; }
      }
      else {
        AllFilters.invoice_status = "";
      }
      if (this.account_name) { AllFilters.account_name = this.account_name; } else { AllFilters.account_name = ""; }

      // if(this.distributor_id != ""){
      if (this.distributor_id) { AllFilters.distributor_id = this.distributor_id; } else { AllFilters.distributor_id = ""; }
      if (this.distributor_name) { AllFilters.org_name = this.distributor_name; } else { AllFilters.org_name = ""; }
      // }
      // else{
      //   if (this.org_name) { AllFilters.org_name = this.org_name; } else { AllFilters.org_name = ""; }
      // }

      AllFilters.offset = 0
      AllFilters.size = this.noofrecordsperpage
      AllFilters.size = 10

      AllFilters.divison_id = ""
      // AllFilters.invoice_status = ""
      AllFilters.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"]

      this.AllorderList(AllFilters);

      // if (this.orderDate == true) {
      //   const data5: InputPageCount = {} as InputPageCount;
      //   data5.page_type = "order_tracking";
      //   data5.from_date = this.order_from_date;
      //   data5.to_date = this.order_to_date;
      //   this.GetPageCount(data5);
      // }
      // if (this.invoiceDate == true) { 
      //   const data5: InputPageCount = {} as InputPageCount;
      //   data5.page_type = "order_tracking";
      //   data5.from_date = this.invoice_from_date;
      //   data5.to_date = this.invoice_to_date;
      //   this.GetPageCount(data5);
      // }
      // if (this.trackingDate == true) { 
      //   const data5: InputPageCount = {} as InputPageCount;
      //   data5.page_type = "order_tracking";
      //   data5.from_date = this.tracking_from_date;
      //   data5.to_date = this.tracking_to_date;
      //   this.GetPageCount(data5);
      // }


    }


    if (this.tab == 2) {
      debugger;
      this.date = new Date();

      if (this.orderDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.order_from_date == null || this.AllFilters.value.order_from_date == "" && this.AllFilters.value.order_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.order_from_date = localStorage.getItem("FromDate");
            ListInput1.order_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.order_from_date !== null && this.AllFilters.value.order_to_date == null || this.AllFilters.value.order_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.order_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.order_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.order_from_date;
          this.to_date = this.AllFilters.value.order_to_date;
          this.order_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.order_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isLastsevenDay == true) {
          this.order_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isToday == true) {
          this.order_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.order_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }
      else if (this.trackingDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.tracking_from_date == null || this.AllFilters.value.tracking_from_date == "" && this.AllFilters.value.tracking_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.tracking_from_date = localStorage.getItem("FromDate");
            ListInput1.tracking_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.tracking_from_date !== null && this.AllFilters.value.tracking_to_date == null || this.AllFilters.value.tracking_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.tracking_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.tracking_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
//          this.to_date = this.AllFilters.value.tracking_to_date;
          this.tracking_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.tracking_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isToday == true) {

          this.tracking_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isLastsevenDay == true) {
          this.tracking_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.tracking_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }

      if (this.account_id != "") {
        this.AllFilters.get('account_name').setValue(this.account_name);
      }

      if (this.distributor_id != "") {
        this.AllFilters.get('Distributor_Id').setValue(this.distributor_id);
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }
      else {
        this.distributor_name = this.AllFilters.value.org_name;
        this.AllFilters.get('Distributor_Id').setValue('');
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }

      if (this.orderDate == true) {
        this.AllFilters.get('order_from_date').setValue(this.order_from_date);
        this.AllFilters.get('order_to_date').setValue(this.order_to_date);
      }
      if (this.trackingDate == true) {
        this.AllFilters.get('tracking_from_date').setValue(this.tracking_from_date);
        this.AllFilters.get('tracking_to_date').setValue(this.tracking_to_date);
      }

      // this.AllFilters.get('size').setValue(10);
      // this.AllFilters.get('offset').setValue(0);

      this.otc_number = this.AllFilters.value.otc_number;
      this.invoice_no = this.AllFilters.value.invoice_no

      const listinput: InputOther = {} as InputOther;

      if (this.orderDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
      }
      if (this.trackingDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

      }

      if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

      // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
      if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

      if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

      if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

      if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

      if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

      listinput.offset = 0
      listinput.size = this.noofrecordsperpage

      listinput.divison_id = "";
      listinput.invoice_status = "order_without_invoice";
      listinput.order_status_array = ["Confirmed"];
      listinput.size = 10;

      this.AllorderList(listinput);

    }

    if (this.tab == 3) {

      debugger;
      this.date = new Date();

      if (this.orderDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.order_from_date == null || this.AllFilters.value.order_from_date == "" && this.AllFilters.value.order_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.order_from_date = localStorage.getItem("FromDate");
            ListInput1.order_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.order_from_date !== null && this.AllFilters.value.order_to_date == null || this.AllFilters.value.order_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.order_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.order_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.order_from_date;
          this.to_date = this.AllFilters.value.order_to_date;
          this.order_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.order_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isLastsevenDay == true) {
          this.order_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isToday == true) {
          this.order_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.order_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }
      else if (this.trackingDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.tracking_from_date == null || this.AllFilters.value.tracking_from_date == "" && this.AllFilters.value.tracking_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.tracking_from_date = localStorage.getItem("FromDate");
            ListInput1.tracking_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.tracking_from_date !== null && this.AllFilters.value.tracking_to_date == null || this.AllFilters.value.tracking_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.tracking_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.tracking_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.tracking_from_date;
          this.to_date = this.AllFilters.value.tracking_to_date;
          this.tracking_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.tracking_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isToday == true) {
          this.tracking_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isLastsevenDay == true) {
          this.tracking_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.tracking_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }

      if (this.account_id != "") {
        this.AllFilters.get('account_name').setValue(this.account_name);
      }

      if (this.distributor_id != "") {
        this.AllFilters.get('Distributor_Id').setValue(this.distributor_id);
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }
      else {
        this.distributor_name = this.AllFilters.value.org_name;
        this.AllFilters.get('Distributor_Id').setValue('');
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }

      // if (this.div_id != "") {
      //   this.AllFilters.get('divison_id').setValue(this.division_name);
      // }


      if (this.orderDate == true) {
        this.AllFilters.get('order_from_date').setValue(this.order_from_date);
        this.AllFilters.get('order_to_date').setValue(this.order_to_date);
      }
      if (this.trackingDate == true) {
        this.AllFilters.get('tracking_from_date').setValue(this.tracking_from_date);
        this.AllFilters.get('tracking_to_date').setValue(this.tracking_to_date);
      }


      this.otc_number = this.AllFilters.value.otc_number;
      this.invoice_no = this.AllFilters.value.invoice_no

      const listinput: InputOther = {} as InputOther;

      if (this.orderDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
      }
      if (this.trackingDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

      }

      if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

      // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
      if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

      if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

      if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

      if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

      if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

      listinput.invoice_status = "Cancelled";

      listinput.offset = 0
      listinput.size = this.noofrecordsperpage
      this.List(listinput)


    }

    if (this.tab == 4) {
      debugger;
      this.date = new Date();

      if (this.orderDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.order_from_date == null || this.AllFilters.value.order_from_date == "" && this.AllFilters.value.order_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.order_from_date = localStorage.getItem("FromDate");
            ListInput1.order_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.order_from_date !== null && this.AllFilters.value.order_to_date == null || this.AllFilters.value.order_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.order_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.order_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.order_from_date;
          this.to_date = this.AllFilters.value.order_to_date;
          this.order_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.order_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isLastsevenDay == true) {
          this.order_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isToday == true) {
          this.order_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.order_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }
      else if (this.trackingDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.tracking_from_date == null || this.AllFilters.value.tracking_from_date == "" && this.AllFilters.value.tracking_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.tracking_from_date = localStorage.getItem("FromDate");
            ListInput1.tracking_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.tracking_from_date !== null && this.AllFilters.value.tracking_to_date == null || this.AllFilters.value.tracking_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.tracking_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.tracking_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.tracking_from_date;
          this.to_date = this.AllFilters.value.tracking_to_date;
          this.tracking_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.tracking_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isToday == true) {
          this.tracking_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isLastsevenDay == true) {
          this.tracking_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.tracking_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }

      if (this.account_id != "") {
        this.AllFilters.get('account_name').setValue(this.account_name);
      }

      if (this.distributor_id != "") {
        this.AllFilters.get('Distributor_Id').setValue(this.distributor_id);
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }
      else {
        this.distributor_name = this.AllFilters.value.org_name;
        this.AllFilters.get('Distributor_Id').setValue('');
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }

      // if (this.div_id != "") {
      //   this.AllFilters.get('divison_id').setValue(this.division_name);
      // }


      if (this.orderDate == true) {
        this.AllFilters.get('order_from_date').setValue(this.order_from_date);
        this.AllFilters.get('order_to_date').setValue(this.order_to_date);
      }
      if (this.trackingDate == true) {
        this.AllFilters.get('tracking_from_date').setValue(this.tracking_from_date);
        this.AllFilters.get('tracking_to_date').setValue(this.tracking_to_date);
      }


      this.otc_number = this.AllFilters.value.otc_number;
      this.invoice_no = this.AllFilters.value.invoice_no

      const listinput: InputOther = {} as InputOther;

      if (this.orderDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
      }
      if (this.trackingDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

      }

      if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

      // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
      if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

      if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

      if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

      if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

      if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

      listinput.invoice_status = "invoiced";


      listinput.offset = 0
      listinput.size = this.noofrecordsperpage
      this.List(listinput)



    }

    if (this.tab == 5) {

      debugger;
      this.date = new Date();

      if (this.orderDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.order_from_date == null || this.AllFilters.value.order_from_date == "" && this.AllFilters.value.order_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.order_from_date = localStorage.getItem("FromDate");
            ListInput1.order_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.order_from_date !== null && this.AllFilters.value.order_to_date == null || this.AllFilters.value.order_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.order_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.order_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.order_from_date;
          this.to_date = this.AllFilters.value.order_to_date;
          this.order_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.order_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isLastsevenDay == true) {
          this.order_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isToday == true) {
          this.order_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.order_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }
      else if (this.trackingDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.tracking_from_date == null || this.AllFilters.value.tracking_from_date == "" && this.AllFilters.value.tracking_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.tracking_from_date = localStorage.getItem("FromDate");
            ListInput1.tracking_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.tracking_from_date !== null && this.AllFilters.value.tracking_to_date == null || this.AllFilters.value.tracking_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.tracking_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.tracking_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.tracking_from_date;
          this.to_date = this.AllFilters.value.tracking_to_date;
          this.tracking_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.tracking_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isToday == true) {
          this.tracking_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isLastsevenDay == true) {
          this.tracking_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.tracking_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }

      if (this.account_id != "") {
        this.AllFilters.get('account_name').setValue(this.account_name);
      }

      if (this.distributor_id != "") {
        this.AllFilters.get('Distributor_Id').setValue(this.distributor_id);
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }
      else {
        this.distributor_name = this.AllFilters.value.org_name;
        this.AllFilters.get('Distributor_Id').setValue('');
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }

      // if (this.div_id != "") {
      //   this.AllFilters.get('divison_id').setValue(this.division_name);
      // }


      if (this.orderDate == true) {
        this.AllFilters.get('order_from_date').setValue(this.order_from_date);
        this.AllFilters.get('order_to_date').setValue(this.order_to_date);
      }
      if (this.trackingDate == true) {
        this.AllFilters.get('tracking_from_date').setValue(this.tracking_from_date);
        this.AllFilters.get('tracking_to_date').setValue(this.tracking_to_date);
      }


      this.otc_number = this.AllFilters.value.otc_number;
      this.invoice_no = this.AllFilters.value.invoice_no

      const listinput: InputOther = {} as InputOther;

      if (this.orderDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
      }
      if (this.trackingDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

      }

      if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

      // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
      if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

      if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

      if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

      if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

      if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

      listinput.invoice_status = "out for delivery";

      listinput.offset = 0
      listinput.size = this.noofrecordsperpage
      this.List(listinput)
    }


    if (this.tab == 6) {
      debugger;
      this.date = new Date();

      if (this.orderDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.order_from_date == null || this.AllFilters.value.order_from_date == "" && this.AllFilters.value.order_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.order_from_date = localStorage.getItem("FromDate");
            ListInput1.order_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.order_from_date !== null && this.AllFilters.value.order_to_date == null || this.AllFilters.value.order_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.order_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.order_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.order_from_date;
          this.to_date = this.AllFilters.value.order_to_date;
          this.order_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.order_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isLastsevenDay == true) {
          this.order_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isToday == true) {
          this.order_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.order_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.order_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }
      else if (this.trackingDate == true) {
        if (this.iscustomDate == true) {
          if (this.AllFilters.value.tracking_from_date == null || this.AllFilters.value.tracking_from_date == "" && this.AllFilters.value.tracking_to_date !== null) {
            Swal.fire('Select From Date');
            const ListInput1: AllInput = {} as AllInput;
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
            ListInput1.tracking_from_date = localStorage.getItem("FromDate");
            ListInput1.tracking_to_date = localStorage.getItem("ToDate");
            ListInput1.offset = 0;
            ListInput1.size = 10;
            this.AllorderList(ListInput1);
            return
          }
          else if (this.AllFilters.value.tracking_from_date !== null && this.AllFilters.value.tracking_to_date == null || this.AllFilters.value.tracking_to_date == "") {
            Swal.fire('Select To Date');
            return
          }
          var d1 = moment(this.AllFilters.value.tracking_from_date).format('yyyy-MM-DD')
          var d2 = moment(this.AllFilters.value.tracking_to_date).format('yyyy-MM-DD')
          var days = this.calculateDate1(d1, d2);
          if (d1 > d2) {
            Swal.fire('From-Date Should be Less Than To-Date.');
            return

          }
          else if (days >= 95) {
            Swal.fire(' Please select the date range up to 95 days ');
            return
          }
          this.from_date = this.AllFilters.value.tracking_from_date;
          this.to_date = this.AllFilters.value.tracking_to_date;
          this.tracking_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
          this.tracking_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        }
        else if (this.isToday == true) {
          this.tracking_from_date = moment(this.to_date).format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isLastsevenDay == true) {
          this.tracking_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
        else if (this.isThirtyDays == true) {
          this.tracking_from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
          this.tracking_to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
        }
      }

      if (this.account_id != "") {
        this.AllFilters.get('account_name').setValue(this.account_name);
      }

      if (this.distributor_id != "") {
        this.AllFilters.get('Distributor_Id').setValue(this.distributor_id);
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }
      else {
        this.distributor_name = this.AllFilters.value.org_name;
        this.AllFilters.get('Distributor_Id').setValue('');
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }

      // if (this.div_id != "") {
      //   this.AllFilters.get('divison_id').setValue(this.division_name);
      // }


      if (this.orderDate == true) {
        this.AllFilters.get('order_from_date').setValue(this.order_from_date);
        this.AllFilters.get('order_to_date').setValue(this.order_to_date);
      }
      if (this.trackingDate == true) {
        this.AllFilters.get('tracking_from_date').setValue(this.tracking_from_date);
        this.AllFilters.get('tracking_to_date').setValue(this.tracking_to_date);
      }


      this.otc_number = this.AllFilters.value.otc_number;
      this.invoice_no = this.AllFilters.value.invoice_no

      const listinput: InputOther = {} as InputOther;

      if (this.orderDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
      }
      if (this.trackingDate == true) {
        if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
        if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
        if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
        if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

      }

      if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

      // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }

      if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

      if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

      if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

      if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

      if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

      listinput.invoice_status = "delivered";

      listinput.offset = 0
      listinput.size = this.noofrecordsperpage
      this.List(listinput)

    }


    // for (let item in this.AllFilters.controls) {

    //   if (this.AllFilters.controls[item].value) {
    //     var Json = { "Key": item, "Value": this.AllFilters.controls[item].value }

    //     this.Filterarray.push(Json)
    //   }


    // }

    // this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    // this.Filterarray = this.Filterarray.filter(book => book.Key !== 'order_status_array');
    // this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    this.myDrop.close();

  }

  FilterStrings(ListInput) {
    // debugger
    this.Filterarray = [];
    console.log(ListInput)
    for (let item in ListInput) {

      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    console.log(this.Filterarray)
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'limit');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'distributor_id');

    if (this.tab == 1 || this.tab == 2) {
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'order_status_array');
    }
    if (this.tab != 1) {
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'invoice_status');
    }

    if (this.orderDate == true) {
      var from_date1 = ListInput.order_from_date;
      var to_date1 = ListInput.order_to_date;
      var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'order_from_date');
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'order_to_date');
    }

    if (this.invoiceDate == true) {
      var from_date1 = ListInput.invoice_from_date;
      var to_date1 = ListInput.invoice_to_date;
      var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'invoice_from_date');
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'invoice_to_date');

    }
    if (this.trackingDate == true) {
      var from_date1 = ListInput.tracking_from_date;
      var to_date1 = ListInput.tracking_to_date;
      var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'tracking_from_date');
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'tracking_to_date');
    }

    var Json1 = { "Key": 'from_date', "Value": finaldate }
    this.Filterarray.push(Json1)

  }

  dateformate(date) {
    return this.datepipe.transform(date, 'dd-MM-yyyy');
  }


  resetALl() {
    debugger
    this.isDivisionVisible = false;

    this.currentPage = 1
    this.AllFilters.reset();
    this.DistributorList.reset();
    this.DivisionList.reset();
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.division_name = "",
     this.account_id = "",
      this.invoice_status = "";
    this.invoice_no = "";
    this.otc_number = "";
    this.order_from_date = "";
    this.order_to_date = "";
    this.tracking_from_date = "";
    this.tracking_to_date = "";
    this.divison_id = "";
    this.org_name = "";
    this.account_name = "";
    this.invoice_from_date = "";
    this.invoice_to_date = "";
    this.distributor_id = ""
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

    const data3: InputData3 = {} as InputData3
    data3.size = 5;
    data3.div_name = "";
    this.GetAccount(data3);

    // const data: InputData1 = {} as InputData1;
    // data.distributor_id =  "";
    // data.div_search_text = "";
    // this.Getdivision(data);

    // if (this.tab == 1) {
    //   this.orderDate = true;
    //   this.trackingDate = false;
    //   this.invoiceDate = false;
    //   this.isThirtyDays = true;
    //   const ListInput1: AllInput = {} as AllInput;
    //   ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
    //   ListInput1.invoice_status = "";
    //   ListInput1.invoice_no = "";
    //   ListInput1.otc_number = "";
    //   ListInput1.order_from_date = this.from_date
    //   ListInput1.order_to_date = this.to_date
    //   ListInput1.tracking_from_date = ""; //this.FromDate;
    //   ListInput1.tracking_to_date = "";// this.ToDate;
    //   ListInput1.divison_id = "";
    //   ListInput1.offset = 0;
    //   ListInput1.org_name = "";
    //   ListInput1.account_name = "";
    //   ListInput1.size = 10;
    //   this.AllorderList(ListInput1);
    //   this.myDrop.close();

    // }
     if (this.tab == 1) {
      this.orderDate = true;
      this.trackingDate = false;
      this.invoiceDate = false;
      this.isThirtyDays = true;
     this.currDiv = "All"

      const ListInput1: AllInput = {} as AllInput;
     ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
     ListInput1.invoice_status = ""
      ListInput1.invoice_no = "";
      ListInput1.otc_number = "";
      ListInput1.order_from_date = this.from_date
      ListInput1.order_to_date = this.to_date
      ListInput1.tracking_from_date = ""; //this.FromDate;
      ListInput1.tracking_to_date = "";// this.ToDate;
      ListInput1.divison_id = "";
      ListInput1.offset = 0;
      ListInput1.org_name = "";
      ListInput1.account_name = "";
      ListInput1.size = 10;
      this.AllorderList(ListInput1);
    }

    else if (this.tab == 2) {
      this.orderDate = true;
      this.trackingDate = false;
      this.invoiceDate = false;
      this.isThirtyDays = true;
      this.currDiv = "Delayed"

      const ListInput1: AllInput = {} as AllInput;
      ListInput1.order_status_array = ["Confirmed"];//this.Allorder_status;
      ListInput1.invoice_status = "order_without_invoice";
      ListInput1.invoice_no = "";
      ListInput1.otc_number = "";
      ListInput1.order_from_date = this.from_date
      ListInput1.order_to_date = this.to_date
      ListInput1.tracking_from_date = ""; //this.FromDate;
      ListInput1.tracking_to_date = "";// this.ToDate;
      ListInput1.divison_id = "";
      ListInput1.offset = 0;
      ListInput1.org_name = "";
      ListInput1.account_name = "";
      ListInput1.size = 10;
      this.AllorderList(ListInput1);
    }

    else if (this.tab == 3) {
      this.orderDate = false;
      this.trackingDate = true;
      this.invoiceDate = false;
      this.isThirtyDays = true;
      this.currDiv = "Cancelled"

      const listinput: InputOther = {} as InputOther;
      listinput.tracking_from_date = this.from_date
      listinput.tracking_to_date = this.to_date
      listinput.invoice_status = "Cancelled";
      listinput.offset = 0;
      listinput.size = this.noofrecordsperpage
      this.List(listinput)
    }
    else if (this.tab == 4) {
      this.orderDate = false;
      this.trackingDate = true;
      this.invoiceDate = false;
      this.isThirtyDays = true;
      this.currDiv = "invoiced"
      const listinput: InputOther = {} as InputOther;
      listinput.tracking_from_date = this.from_date
      listinput.tracking_to_date = this.to_date
      listinput.invoice_status = "invoiced";
      listinput.offset = 0;
      listinput.size = this.noofrecordsperpage
      this.List(listinput)
    }

    else if (this.tab == 5) {
      this.orderDate = false;
      this.trackingDate = true;
      this.invoiceDate = false;
      this.isThirtyDays = true;
      this.currDiv = "out for delivery"

      const listinput: InputOther = {} as InputOther;
      listinput.tracking_from_date = this.from_date
      listinput.tracking_to_date = this.to_date
      listinput.invoice_status = "out for delivery";
      listinput.offset = 0;
      listinput.size = this.noofrecordsperpage
      this.List(listinput)
    }

    else if (this.tab == 6) {
      this.orderDate = false;
      this.trackingDate = true;
      this.invoiceDate = false;
      this.isThirtyDays = true;
      this.currDiv = "Delivered"

      const listinput: InputOther = {} as InputOther;
      listinput.tracking_from_date = this.from_date
      listinput.tracking_to_date = this.to_date
      listinput.invoice_status = "delivered";
      listinput.offset = 0;
      listinput.size = this.noofrecordsperpage
      this.List(listinput)
    }
    this.myDrop.close();
  }

  resetFilterFeild() {
    this.AllFilters.reset();
    this.DistributorList.reset();
    this.DivisionList.reset();
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.division_name = "",
      this.account_id = "",
      this.invoice_status = "";
    this.invoice_no = "";
    this.otc_number = "";
    this.order_from_date = "";
    this.order_to_date = "";
    this.tracking_from_date = "";
    this.tracking_to_date = "";
    this.divison_id = "";
    this.org_name = "";
    this.account_name = "";
    this.invoice_from_date = "";
    this.invoice_to_date = "";
    this.distributor_id = ""
    this.isThirtyDays = true;
    this.isToday = false;
    this.iscustomDate = false;
    this.isLastsevenDay = false;
    this.ShowCustom = false;
    this.Division = [];
    var d1 = new Date();
    var x1 = 30;
    d1.setDate(d1.getDate() - x1);

    this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
    this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = "";
    this.GetDistributor(data1);

    const data3: InputData3 = {} as InputData3
    data3.size = 5;
    data3.div_name = "";
    this.GetAccount(data3);
  }


  changedatefilter(Value) {
    if (Value == 'Today') {
      this.ShowCustom = false;
      this.isToday = true;
      this.isThirtyDays = false;
      this.isLastsevenDay = false;
      this.iscustomDate = false;
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
      this.AllFilters.patchValue({
        Today: false,
        Custom: true,
        thirtyDays: false,
        Sevenday: false
      })
    }
  }

  changedate(Value) {
    if (Value == 'order_date') {
      this.orderDate = true;
      this.invoiceDate = false;
      this.trackingDate = false;
      // this.ShowCustom = false;
      this.isOrderdate = true;
      this.isInvoicedate = false;
      this.isTrackingdate = false;
      this.AllDatefiler.patchValue({
        invoice_from_date: true,

      })
    }

    if (Value == 'invoice_date') {
      this.orderDate = false;
      this.invoiceDate = true;
      this.trackingDate = false;
      // this.ShowCustom = false;
      this.isOrderdate = false;
      this.isTrackingdate = false;
      this.isInvoicedate = true;
      this.AllDatefiler.patchValue({
        invoice_to_date: false,

      })
    }
    if (Value == 'tracking_date') {
      this.orderDate = false;
      this.invoiceDate = false;
      this.trackingDate = true;
      // this.ShowCustom = false;
      this.isOrderdate = false;
      this.isInvoicedate = false;
      this.isTrackingdate = true;
      this.AllDatefiler.patchValue({
        tracking_to_date: false,
        tracking_from_date: false

      })
    }

    // if (this.selectedDateOption == 'Today') {
    //   this.changedatefilter('Today');
    // }
    // else if (this.selectedDateOption == 'Sevenday') {
    //   this.changedatefilter('Sevenday');
    // }
    // else if (this.selectedDateOption == 'thirtyDays') {
    //   this.changedatefilter('thirtyDays');
    // }
    // else {
    //   this.changedatefilter('Custom');
    // }



  }

  // pageChange(page: any) {

  //   document.body.scrollTop = 0;
  //   this.currentPage = page;
  //   page = page - 1;

  //   if (this.tab == 1) {
  //     debugger
  //     if (this.order_from_date == undefined || this.order_to_date == undefined || this.order_from_date == "" || this.order_to_date == "") {
        
  //       const ListInput1: AllInput = {} as AllInput;
  //       ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] 
  //       ListInput1.invoice_status = "";
  //       ListInput1.invoice_no = "";
  //       ListInput1.otc_number = "";
  //       ListInput1.order_from_date = localStorage.getItem("FromDate");
  //       ListInput1.order_to_date = localStorage.getItem("ToDate");
  //       ListInput1.tracking_from_date = ""; 
  //       ListInput1.tracking_to_date = "";
  //       ListInput1.divison_id = "";
  //       ListInput1.offset = (page * 10);
  //       ListInput1.org_name = "";
  //       ListInput1.account_name = "";
  //       ListInput1.size = 10;
  //       this.AllorderList(ListInput1);
  //     }
  //     else {
  //       const AllFilters: AllInput = {} as AllInput;
  //       if (this.orderDate == true) {
  //         if (this.order_from_date) { AllFilters.order_from_date = this.order_from_date; } else { AllFilters.order_from_date = ""; }
  //         if (this.order_to_date) { AllFilters.order_to_date = this.order_to_date; } else { AllFilters.order_to_date = ""; }
  //         if (this.tracking_from_date) { AllFilters.tracking_from_date = this.tracking_from_date; } else { AllFilters.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { AllFilters.tracking_to_date = this.tracking_to_date; } else { AllFilters.tracking_to_date = ""; }
  //         if (this.invoice_from_date) { AllFilters.invoice_from_date = this.invoice_from_date; } else { AllFilters.invoice_from_date = ""; }
  //         if (this.invoice_to_date) { AllFilters.invoice_to_date = this.invoice_to_date; } else { AllFilters.invoice_to_date = ""; }
  //       }
  //       if (this.invoiceDate == true) {
  //         if (this.order_from_date) { AllFilters.order_from_date = this.order_from_date; } else { AllFilters.order_from_date = ""; }
  //         if (this.order_to_date) { AllFilters.order_to_date = this.order_to_date; } else { AllFilters.order_to_date = ""; }
  //         if (this.tracking_from_date) { AllFilters.tracking_from_date = this.tracking_from_date; } else { AllFilters.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { AllFilters.tracking_to_date = this.tracking_to_date; } else { AllFilters.tracking_to_date = ""; }
  //         if (this.invoice_from_date) { AllFilters.invoice_from_date = this.invoice_from_date; } else { AllFilters.invoice_from_date = ""; }
  //         if (this.invoice_to_date) { AllFilters.invoice_to_date = this.invoice_to_date; } else { AllFilters.invoice_to_date = ""; }
  //       }
  //       if (this.trackingDate == true) {
  //         if (this.order_from_date) { AllFilters.order_from_date = this.order_from_date; } else { AllFilters.order_from_date = ""; }
  //         if (this.order_to_date) { AllFilters.order_to_date = this.order_to_date; } else { AllFilters.order_to_date = ""; }
  //         if (this.tracking_from_date) { AllFilters.tracking_from_date = this.tracking_from_date; } else { AllFilters.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { AllFilters.tracking_to_date = this.tracking_to_date; } else { AllFilters.tracking_to_date = ""; }
  //         if (this.invoice_from_date) { AllFilters.invoice_from_date = this.invoice_from_date; } else { AllFilters.invoice_from_date = ""; }
  //         if (this.invoice_to_date) { AllFilters.invoice_to_date = this.invoice_to_date; } else { AllFilters.invoice_to_date = ""; }
  //       }

  //       if (this.otc_number) { AllFilters.otc_number = this.otc_number; } else { AllFilters.otc_number = ""; }

  //       if (this.org_name) { AllFilters.org_name = this.org_name; } else { AllFilters.org_name = ""; }
  //       if (this.division_name) { AllFilters.division_name = this.division_name; } else { AllFilters.division_name = ""; }

  //       if (this.distributor_id) { AllFilters.distributor_id = this.distributor_id; } else { AllFilters.distributor_id = ""; }

  //       if (this.invoice_no) { AllFilters.invoice_no = this.invoice_no; } else { AllFilters.invoice_no = ""; }

  //       if (this.invoice_status) { AllFilters.invoice_status = this.invoice_status; } else { AllFilters.invoice_status = ""; }
  //       if (this.distributor_name) { AllFilters.org_name = this.distributor_name; } else { AllFilters.org_name = ""; }
  //       if (this.account_name) { AllFilters.account_name = this.account_name; } else { AllFilters.account_name = ""; }
  //       AllFilters.offset = (page * 10);
  //       AllFilters.size = this.noofrecordsperpage
  //       AllFilters.divison_id = ""
  //       AllFilters.invoice_status = this.invoice_status
  //       AllFilters.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"]

  //       this.AllorderList(AllFilters);
  //     }
  //   }
  //   if (this.tab == 2) {
  //     debugger
  //     this.currDiv = "Delayed"

  //     if (this.order_from_date == undefined || this.order_to_date == undefined || this.order_from_date == "" || this.order_to_date == "") {
  //       const ListInput1: AllInput = {} as AllInput;
  //       ListInput1.order_status_array = ["Confirmed"];
  //       ListInput1.invoice_status = "order_without_invoice";
  //       ListInput1.invoice_no = "";
  //       ListInput1.otc_number = "";
  //       ListInput1.order_from_date = localStorage.getItem("FromDate");
  //       ListInput1.order_to_date = localStorage.getItem("ToDate");
  //       ListInput1.tracking_from_date = ""; 
  //       ListInput1.tracking_to_date = "";
  //       ListInput1.divison_id = "";
  //       ListInput1.offset = (page * 10);
  //       ListInput1.org_name = "";
  //       ListInput1.account_name = "";
  //       ListInput1.size = 10;
  //       this.AllorderList(ListInput1);
  //     }
  //     else {
  //       const listinput: InputOther = {} as InputOther;

  //       if (this.orderDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
  //       }
  //       if (this.trackingDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

  //       }

  //       if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

  //       // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
  //       if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

  //       if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

  //       if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }
  //       if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }
  //       if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

  //       listinput.offset = (page * 10);
  //       listinput.size = this.noofrecordsperpage

  //       listinput.divison_id = "";
  //       listinput.invoice_status = "order_without_invoice";
  //       listinput.order_status_array = ["Confirmed"];
  //       listinput.size = 10;

  //       this.AllorderList(listinput);
  //     }
  //   }

  //   if (this.tab == 3) {
  //     debugger
  //     this.currDiv = "Cancelled"

  //     if (this.tracking_from_date == undefined || this.tracking_to_date == undefined || this.tracking_from_date == "" || this.tracking_to_date == "") {
  //       const listinput: InputOther = {} as InputOther;
  //       listinput.order_from_date = localStorage.getItem("FromDate");
  //       listinput.order_to_date = localStorage.getItem("ToDate");
  //       listinput.tracking_from_date = ""; 
  //       listinput.tracking_to_date = "";
  //       listinput.invoice_status = "Cancelled";
  //       listinput.offset = (page * 10);
  //       listinput.size = 10
  //       this.List(listinput)
  //     }
  //     else {
  //       const listinput: InputOther = {} as InputOther;

  //       if (this.orderDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
  //       }
  //       if (this.trackingDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
  //       }

  //       if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

  //       // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
  //       if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

  //       if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

  //       if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

  //       if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

  //       if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

  //       listinput.invoice_status = "Cancelled";

  //       listinput.offset = (page * 10);
  //       listinput.size = this.noofrecordsperpage
  //       this.List(listinput)
  //     }
  //   }

  //   if (this.tab == 4) {


  //     this.currDiv = "invoiced"
  //     if (this.order_from_date == undefined || this.order_to_date == undefined || this.order_from_date == "" || this.order_to_date == "") {
  //       const listinput: InputOther = {} as InputOther;
  //       listinput.order_from_date = localStorage.getItem("FromDate");
  //       listinput.order_to_date = localStorage.getItem("ToDate");
  //       listinput.tracking_from_date = ""; 
  //       listinput.tracking_to_date = "";
  //       listinput.invoice_status = "invoiced";
  //       listinput.offset = (page * 10);
  //       listinput.size = 10
  //       this.List(listinput)
  //     }
  //     else {
  //       const listinput: InputOther = {} as InputOther;

  //       if (this.orderDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
  //       }
  //       if (this.trackingDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

  //       }

  //       if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

  //       if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

  //       if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

  //       if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

  //       if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

  //       if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

  //       listinput.invoice_status = "invoiced";

  //       listinput.offset = (page * 10);
  //       listinput.size = 10
  //       this.List(listinput)
  //     }
  //   }

  //   if (this.tab == 5) {

  //     this.currDiv = "OutforDelivery"

  //     if (this.tracking_from_date == undefined || this.tracking_to_date == undefined || this.tracking_from_date == "" || this.tracking_to_date == "") {
  //       const listinput: InputOther = {} as InputOther;
  //       listinput.order_from_date = localStorage.getItem("FromDate");
  //       listinput.order_to_date = localStorage.getItem("ToDate");
  //       listinput.tracking_from_date = "";
  //       listinput.tracking_to_date = "";
  //       listinput.invoice_status = "out for delivery";
  //       listinput.offset = (page * 10);
  //       listinput.size = this.noofrecordsperpage
  //       this.List(listinput)
  //     }
  //     else {

  //       const listinput: InputOther = {} as InputOther;

  //       if (this.orderDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
  //       }
  //       if (this.trackingDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
  //       }

  //       if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

  //       if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

  //       if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

  //       if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

  //       if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

  //       if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }


  //       listinput.invoice_status = "out for delivery";

  //       listinput.offset = (page * 10);
  //       listinput.size = this.noofrecordsperpage
  //       this.List(listinput)
  //     }
  //   }

  //   if (this.tab == 6) {

  //     this.currDiv = "Delivered"

  //     if (this.tracking_from_date == undefined || this.tracking_to_date == undefined || this.tracking_from_date == "" || this.tracking_to_date == "") {
  //       const listinput: InputOther = {} as InputOther;
  //       listinput.tracking_from_date = localStorage.getItem("FromDate");
  //       listinput.tracking_to_date = localStorage.getItem("ToDate");
  //       listinput.invoice_status = "delivered";
  //       listinput.offset = (page * 10);
  //       listinput.size = this.noofrecordsperpage
  //       this.List(listinput)
  //     }
  //     else {
  //       const listinput: InputOther = {} as InputOther;

  //       if (this.orderDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
  //       }
  //       if (this.trackingDate == true) {
  //         if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
  //         if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
  //         if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
  //         if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

  //       }

  //       if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

  //       if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

  //       if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

  //       if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

  //       if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

  //       if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

  //       listinput.invoice_status = "delivered";

  //       listinput.offset = (page * 10);
  //       listinput.size = this.noofrecordsperpage
  //       this.List(listinput)
  //     }
  //   }




    


  // }
  pageChange(page: any) {

    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;

    if (this.tab == 1) {
      debugger
      if (this.order_from_date == undefined && this.order_to_date == undefined && this.invoice_from_date == undefined && this.invoice_to_date == undefined && this.tracking_from_date == undefined && this.tracking_to_date == undefined) {
        const ListInput1: AllInput = {} as AllInput;
        ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;
        ListInput1.invoice_status = "";
        ListInput1.invoice_no = "";
        ListInput1.otc_number = "";
        ListInput1.order_from_date = localStorage.getItem("FromDate");
        ListInput1.order_to_date = localStorage.getItem("ToDate");
        ListInput1.tracking_from_date = ""; //this.FromDate;
        ListInput1.tracking_to_date = "";// this.ToDate;
        ListInput1.divison_id = "";
        ListInput1.offset = (page * 10);
        ListInput1.org_name = "";
        ListInput1.account_name = "";
        ListInput1.size = 10;
        this.AllorderList(ListInput1);
      }
      else {
        const AllFilters: AllInput = {} as AllInput;
        if (this.orderDate == true) {
          if (this.order_from_date) { AllFilters.order_from_date = this.order_from_date; } else { AllFilters.order_from_date = ""; }
          if (this.order_to_date) { AllFilters.order_to_date = this.order_to_date; } else { AllFilters.order_to_date = ""; }
          if (this.tracking_from_date) { AllFilters.tracking_from_date = this.tracking_from_date; } else { AllFilters.tracking_from_date = ""; }
          if (this.tracking_to_date) { AllFilters.tracking_to_date = this.tracking_to_date; } else { AllFilters.tracking_to_date = ""; }
          if (this.invoice_from_date) { AllFilters.invoice_from_date = this.invoice_from_date; } else { AllFilters.invoice_from_date = ""; }
          if (this.invoice_to_date) { AllFilters.invoice_to_date = this.invoice_to_date; } else { AllFilters.invoice_to_date = ""; }
        }
        if (this.invoiceDate == true) {
          if (this.order_from_date) { AllFilters.order_from_date = this.order_from_date; } else { AllFilters.order_from_date = ""; }
          if (this.order_to_date) { AllFilters.order_to_date = this.order_to_date; } else { AllFilters.order_to_date = ""; }
          if (this.tracking_from_date) { AllFilters.tracking_from_date = this.tracking_from_date; } else { AllFilters.tracking_from_date = ""; }
          if (this.tracking_to_date) { AllFilters.tracking_to_date = this.tracking_to_date; } else { AllFilters.tracking_to_date = ""; }
          if (this.invoice_from_date) { AllFilters.invoice_from_date = this.invoice_from_date; } else { AllFilters.invoice_from_date = ""; }
          if (this.invoice_to_date) { AllFilters.invoice_to_date = this.invoice_to_date; } else { AllFilters.invoice_to_date = ""; }
        }
        if (this.trackingDate == true) {
          if (this.order_from_date) { AllFilters.order_from_date = this.order_from_date; } else { AllFilters.order_from_date = ""; }
          if (this.order_to_date) { AllFilters.order_to_date = this.order_to_date; } else { AllFilters.order_to_date = ""; }
          if (this.tracking_from_date) { AllFilters.tracking_from_date = this.tracking_from_date; } else { AllFilters.tracking_from_date = ""; }
          if (this.tracking_to_date) { AllFilters.tracking_to_date = this.tracking_to_date; } else { AllFilters.tracking_to_date = ""; }
          if (this.invoice_from_date) { AllFilters.invoice_from_date = this.invoice_from_date; } else { AllFilters.invoice_from_date = ""; }
          if (this.invoice_to_date) { AllFilters.invoice_to_date = this.invoice_to_date; } else { AllFilters.invoice_to_date = ""; }
        }

        if (this.otc_number) { AllFilters.otc_number = this.otc_number; } else { AllFilters.otc_number = ""; }

        if (this.org_name) { AllFilters.org_name = this.org_name; } else { AllFilters.org_name = ""; }
        if (this.division_name) { AllFilters.division_name = this.division_name; } else { AllFilters.division_name = ""; }

        if (this.distributor_id) { AllFilters.distributor_id = this.distributor_id; } else { AllFilters.distributor_id = ""; }

        if (this.invoice_no) { AllFilters.invoice_no = this.invoice_no; } else { AllFilters.invoice_no = ""; }

        if (this.invoice_status) { AllFilters.invoice_status = this.invoice_status; } else { AllFilters.invoice_status = ""; }
        if (this.distributor_name) { AllFilters.org_name = this.distributor_name; } else { AllFilters.org_name = ""; }
        if (this.account_name) { AllFilters.account_name = this.account_name; } else { AllFilters.account_name = ""; }
        AllFilters.offset = (page * 10);
        AllFilters.size = this.noofrecordsperpage
        AllFilters.divison_id = ""
        AllFilters.invoice_status = this.invoice_status
        AllFilters.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"]

        this.AllorderList(AllFilters);
      }
    }
    if (this.tab == 2) {
      debugger
      this.currDiv = "Delayed"

      if (this.order_from_date == undefined || this.order_to_date == undefined || this.order_from_date == "" || this.order_to_date == "") {
        const ListInput1: AllInput = {} as AllInput;
        ListInput1.order_status_array = ["Confirmed"];//this.Allorder_status;
        ListInput1.invoice_status = "order_without_invoice";
        ListInput1.invoice_no = "";
        ListInput1.otc_number = "";
        ListInput1.order_from_date = localStorage.getItem("FromDate");
        ListInput1.order_to_date = localStorage.getItem("ToDate");
        ListInput1.tracking_from_date = ""; //this.FromDate;
        ListInput1.tracking_to_date = "";// this.ToDate;
        ListInput1.divison_id = "";
        ListInput1.offset = (page * 10);
        ListInput1.org_name = "";
        ListInput1.account_name = "";
        ListInput1.size = 10;
        this.AllorderList(ListInput1);
      }
      else {
        const listinput: InputOther = {} as InputOther;

        if (this.orderDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
        }
        if (this.trackingDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

        }

        if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

        // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
        if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

        if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

        if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }
        if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }
        if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

        listinput.offset = (page * 10);
        listinput.size = this.noofrecordsperpage

        listinput.divison_id = "";
        listinput.invoice_status = "order_without_invoice";
        listinput.order_status_array = ["Confirmed"];
        listinput.size = 10;

        this.AllorderList(listinput);
      }
    }

    if (this.tab == 3) {
      debugger
      this.currDiv = "Cancelled"

      if (this.tracking_from_date == undefined || this.tracking_to_date == undefined || this.tracking_from_date == "" || this.tracking_to_date == "") {
        const listinput: InputOther = {} as InputOther;
        listinput.tracking_from_date = localStorage.getItem("FromDate");
        listinput.tracking_to_date = localStorage.getItem("ToDate");
        listinput.invoice_status = "Cancelled";
        listinput.offset = (page * 10);
        listinput.limit = this.noofrecordsperpage
        this.List(listinput)
      }
      else {
        const listinput: InputOther = {} as InputOther;

        if (this.orderDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
        }
        if (this.trackingDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
        }

        if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

        // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
        if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

        if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

        if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

        if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

        if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

        listinput.invoice_status = "Cancelled";

        listinput.offset = (page * 10);
        listinput.size = this.noofrecordsperpage
        this.List(listinput)
      }
    }

    if (this.tab == 4) {


      this.currDiv = "invoiced"
      if (this.tracking_from_date == undefined || this.tracking_to_date == undefined || this.tracking_from_date == "" || this.tracking_to_date == "") {
        const listinput: InputOther = {} as InputOther;
        listinput.tracking_from_date = localStorage.getItem("FromDate");
        listinput.tracking_to_date = localStorage.getItem("ToDate");
        listinput.invoice_status = "invoiced";
        listinput.offset = (page * 10);
        listinput.limit = this.noofrecordsperpage
        this.List(listinput)
      }
      else {
        const listinput: InputOther = {} as InputOther;

        if (this.orderDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
        }
        if (this.trackingDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

        }

        if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

        // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
        if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

        if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

        if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

        if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

        if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

        listinput.invoice_status = "invoiced";

        listinput.offset = (page * 10);
        listinput.limit = this.noofrecordsperpage
        this.List(listinput)
      }
    }

    if (this.tab == 5) {

      this.currDiv = "OutforDelivery"

      if (this.tracking_from_date == undefined || this.tracking_to_date == undefined || this.tracking_from_date == "" || this.tracking_to_date == "") {
        const listinput: InputOther = {} as InputOther;
        listinput.tracking_from_date = localStorage.getItem("FromDate");
        listinput.tracking_to_date = localStorage.getItem("ToDate");
        listinput.invoice_status = "out for delivery";
        listinput.offset = (page * 10);
        listinput.size = this.noofrecordsperpage
        this.List(listinput)
      }
      else {

        const listinput: InputOther = {} as InputOther;

        if (this.orderDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
        }
        if (this.trackingDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
        }

        if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

        // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
        if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

        if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

        if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

        if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

        if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }


        listinput.invoice_status = "out for delivery";

        listinput.offset = (page * 10);
        listinput.size = this.noofrecordsperpage
        this.List(listinput)
      }
    }

    if (this.tab == 6) {

      this.currDiv = "Delivered"

      if (this.tracking_from_date == undefined || this.tracking_to_date == undefined || this.tracking_from_date == "" || this.tracking_to_date == "") {
        const listinput: InputOther = {} as InputOther;
        listinput.tracking_from_date = localStorage.getItem("FromDate");
        listinput.tracking_to_date = localStorage.getItem("ToDate");
        listinput.invoice_status = "delivered";
        listinput.offset = (page * 10);
        listinput.size = this.noofrecordsperpage
        this.List(listinput)
      }
      else {
        const listinput: InputOther = {} as InputOther;

        if (this.orderDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }
        }
        if (this.trackingDate == true) {
          if (this.order_from_date) { listinput.order_from_date = this.order_from_date; } else { listinput.order_from_date = ""; }
          if (this.order_to_date) { listinput.order_to_date = this.order_to_date; } else { listinput.order_to_date = ""; }
          if (this.tracking_from_date) { listinput.tracking_from_date = this.tracking_from_date; } else { listinput.tracking_from_date = ""; }
          if (this.tracking_to_date) { listinput.tracking_to_date = this.tracking_to_date; } else { listinput.tracking_to_date = ""; }

        }

        if (this.otc_number) { listinput.otc_number = this.otc_number; } else { listinput.otc_number = ""; }

        // if (this.org_name) { listinput.org_name = this.org_name; } else { this.AllFilters.value.org_name = ""; }
        if (this.division_name) { listinput.division_name = this.division_name; } else { listinput.division_name = ""; }

        if (this.distributor_id) { listinput.distributor_id = this.distributor_id; } else { listinput.distributor_id = ""; }

        if (this.invoice_no) { listinput.invoice_no = this.invoice_no; } else { listinput.invoice_no = ""; }

        if (this.distributor_name) { listinput.organization_name = this.distributor_name; } else { listinput.organization_name = ""; }

        if (this.account_name) { listinput.account_name = this.account_name; } else { listinput.account_name = ""; }

        listinput.invoice_status = "delivered";

        listinput.offset = (page * 10);
        listinput.size = this.noofrecordsperpage
        this.List(listinput)
      }
    }




    // const ListInput: Input = {} as Input;
    // ListInput.offset = (page * 10);
    // ListInput.size = this.noofrecordsperpage
    // // if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    // // if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }


  }

  Distributortype() {

    this.distributor_id = ""
    this.distributor_name = ""

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = this.AllFilters.value.org_name;

    this.GetDistributor(data1);

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
  toggle_vehicle_list(vehicleId, el): void {
    if (document.getElementById(vehicleId).style.display == 'table-row-group') {
      document.getElementById(vehicleId).style.display = 'none';
      document.getElementById(el).classList.remove("active");
    }
    else {
      document.getElementById(vehicleId).style.display = 'table-row-group';
      document.getElementById(el).classList.add("active");
    }
  }
  orderDetailsModal: any;
  closeResult: string;
  TempDAta: any;
  orderInformations: any;
  closemodel:any
  details(row) {
    this.loader.open()

    this.TempDAta = [];
    debugger


    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
   // ListInput1.otc_number = row.otc_number;
    ListInput1.otc_number= row.otc_order_number
    console.log(row);
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
           this.closemodel=this.modalService.open(this.orderDetails, ngbModalOptions).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason: any) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
            console.log(this.closemodel)
          }
          else {
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
  closeModal(){
    this.closemodel.hide()
  }


  detailsALL(row) {
    this.loader.open()

    this.TempDAta = [];
    debugger


    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
   // ListInput1.otc_number = row.otc_number;
    ListInput1.otc_number= row.otc_number
    console.log(row);
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


  details1(row) {
    this.loader.open()

    this.TempDAta = [];
    debugger


    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.otc_number = row.otc_number;
    //ListInput1.otc_number= row.otc_order_number
    console.log(row);
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

  invoiceOtc(row) {
    this.loader.open()

    this.TempDAta = [];
    debugger


    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.otc_number = row.otc_order_number;
    // ListInput1.otc_number= row.otc_order_number
    console.log(row);
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
  invoicedetails(row) {
    debugger
    this.loader.open()

    this.TempDAta = [];

    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.order_number = row.order_number;
    this.OrderListService.OrderList(ListInput1).subscribe(
      data => {

        if (data.success == true) {

          this.loader.close()

          if (data.data.result[0].line_items.length > 0) {
            this.TempDAta = data.data.result[0];

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

  orderInvoiceInformations: any;
  openPopUp(data) {
    debugger
    this.loader.open()
    this.TempDAta = [];
    const ListInput4: InputInvoiceDetail = {} as InputInvoiceDetail;
    ListInput4.invoice_no = data.invoice_no;

    this.OrderListService.InvoiceTAT(ListInput4).subscribe(
      data => {
        if (data.success == true) {
          this.loader.close()
          // if (data.data[0].line_items.length > 0) {
          //   this.TempDAta = data.data[0];
          //   this.orderInvoiceInformations = this.TempDAta
          //   this.modalService.open(this.orderDetails, { ariaLabelledBy: 'modal-dialog-centered modal-lg' }).result.then((result) => {
          //     this.closeResult = `Closed with: ${result}`;
          //   }, (reason: any) => {
          //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          //   });
          // }
          // else {
          //   this.loader.close()
          // }
          this.orderInvoiceInformations = data.data;
          let ngbModalOptions: NgbModalOptions = {
            backdrop: true,
            keyboard: true
          };
          this.modalService.open(this.invoiceDetails, ngbModalOptions).result.then((result) => {
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

  cashInvoiceInformations: any;
  openCashLog(data) {
    debugger
    this.loader.open()
    this.TempDAta = [];
    const ListInput4: InputInvoiceDetail = {} as InputInvoiceDetail;
    ListInput4.invoice_no = data.invoice_no;

    this.OrderListService.CashInvoiceTAT(ListInput4).subscribe(
      data => {
        if (data.success == true) {
          this.loader.close()
          this.cashInvoiceInformations = data.data;
          let ngbModalOptions: NgbModalOptions = {
            backdrop: true,
            keyboard: true
          };
          this.modalService.open(this.cashDetails, ngbModalOptions).result.then((result) => {
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

  GetHours(Hours) {


    var Output
    var WaitHours = Hours;

    if (WaitHours <= 0) {
      Output = 0 + ' Hours'

    }
    else if (WaitHours > 0 && WaitHours <= 8) {
      Output = WaitHours.toFixed(0) + ' Hours'

    }

    else if (WaitHours > 8 && WaitHours <= 12) {
      Output = WaitHours.toFixed(0) + ' Hours'

    }
    else if (WaitHours > 12 && WaitHours <= 24) {
      Output = WaitHours.toFixed(0) + ' Hours'

    }
    else if (WaitHours > 24) {
      Output = (Number(WaitHours) / 24).toFixed(0) + ' Days'

    }


    return Output;

  }

  tab: any = 1;
  rows = []
  onClick(check) {
     debugger
     console.log(this.rows)

    this.selectedItemsList = [];
    this.tab = check


    if (this.tab == 1) {
      
      this.currDiv = "All"
      this.orderDate = true;
      this.trackingDate = false;
      this.invoiceDate = false;
      this.isThirtyDays = true;
      this.isLastsevenDay = false;
      this.isToday = false;
      this.iscustomDate = false;
      this.ShowCustom = false;
      this.currentPage = 1;
      const ListInput1: AllInput = {} as AllInput;



      ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"] //this.Allorder_status;

      ListInput1.invoice_status = "";
      ListInput1.invoice_no = "";
      ListInput1.otc_number = "";
      ListInput1.order_from_date = localStorage.getItem("FromDate");
      ListInput1.order_to_date = localStorage.getItem("ToDate");
      ListInput1.tracking_from_date = ""; //this.FromDate;
      ListInput1.tracking_to_date = "";// this.ToDate;
      ListInput1.divison_id = "";
      //ListInput1.offset = 0;
      ListInput1.org_name = "";

     // ListInput1.size = 10;
      this.selectedItemsList = [];
      this.Filterarray = [];
      this.resetFilterFeild();
      this.AllFilters.get("otc_no_search").setValue("")
      this.AllorderList(ListInput1);
    }

    if (this.tab == 2) {
      this.currDiv = "Delayed"
      this.orderDate = true;
      this.isThirtyDays = true;
      this.trackingDate = false;
      this.invoiceDate = false;
      this.isLastsevenDay = false;
      this.isToday = false;
      this.iscustomDate = false;
      this.ShowCustom = false;
      this.currentPage = 1;
      const ListInput1: AllInput = {} as AllInput;



      ListInput1.order_status_array = ["Confirmed"]
      ListInput1.invoice_status = "order_without_invoice";
      ListInput1.invoice_no = "";
      ListInput1.otc_number = "";
      ListInput1.order_from_date = localStorage.getItem("FromDate");
      ListInput1.order_to_date = localStorage.getItem("ToDate");
      ListInput1.tracking_from_date = ""; //this.FromDate;
      ListInput1.tracking_to_date = "";// this.ToDate;
      ListInput1.divison_id = "";
      ListInput1.offset = 0;
      ListInput1.org_name = "";

      ListInput1.size = 10;
      this.selectedItemsList = [];
      this.Filterarray = [];
      this.resetFilterFeild();
      this.AllFilters.get("otc_no_search").setValue("")
      this.AllorderList(ListInput1);
    }

    if (this.tab == 3) {
      debugger
      this.currDiv = "Cancelled"
      this.trackingDate = true;
      this.orderDate = false;
      this.isThirtyDays = true;
      this.currentPage = 1;
      // this.tracking_from_date = localStorage.getItem("FromDate");
      // this.tracking_to_date = localStorage.getItem("ToDate");
      const ListInput: Input = {} as Input;

     
      ListInput.otc_order_number = "";
      ListInput.invoice_no = "";
      ListInput.order_from_date = "";
      ListInput.order_to_date = "";
      ListInput.tracking_from_date = localStorage.getItem("FromDate");
      ListInput.tracking_to_date = localStorage.getItem("ToDate");
      ListInput.offset = 0
      this.rows = [];
      ListInput.limit = 10;
      ListInput.invoice_status = "Cancelled";
      this.selectedItemsList = [];
      this.Filterarray = [];
      this.resetFilterFeild();
      this.AllFilters.get("otc_no_search").setValue("")
      this.List(ListInput);
    }

    if (this.tab == 4) {
      this.currDiv = "invoiced"
      // this.trackingDate = true;
      // this.orderDate = false;
      // this.isThirtyDays = true;

      this.orderDate = false;
      this.trackingDate = true;
      this.invoiceDate = false;
      this.isThirtyDays = true;
      this.isLastsevenDay = false;
      this.isToday = false;
      this.iscustomDate = false;
      this.ShowCustom = false;

      this.currentPage = 1;
      const ListInput: Input = {} as Input;
      ListInput.invoice_status = "invoiced";
      ListInput.invoice_no = "";
      ListInput.otc_order_number = "";
      ListInput.order_from_date = "";
      ListInput.order_to_date = "";
      ListInput.tracking_from_date = localStorage.getItem("FromDate");
      ListInput.tracking_to_date = localStorage.getItem("ToDate");
      ListInput.offset = 0
      this.rows = [];
      ListInput.limit = 10;
      this.selectedItemsList = [];
      this.Filterarray = [];
      this.resetFilterFeild();
      this.AllFilters.get("otc_no_search").setValue("")
      this.List(ListInput);
    }

    if (this.tab == 5) {
      this.currDiv = "OutforDelivery"
      this.trackingDate = true;
      this.orderDate = false;
      this.isThirtyDays = true;
      this.currentPage = 1;
      const ListInput: Input = {} as Input;

     
      ListInput.otc_order_number = "";
      ListInput.invoice_no = "";
      ListInput.order_from_date = "";
      ListInput.order_to_date = "";
      ListInput.tracking_from_date = localStorage.getItem("FromDate");
      ListInput.tracking_to_date = localStorage.getItem("ToDate");
      this.rows = [];
      ListInput.offset = 0
      ListInput.limit = 10;

      ListInput.invoice_status = "out for delivery";
      this.selectedItemsList = [];
      this.Filterarray = [];
      this.resetFilterFeild();
      this.AllFilters.get("otc_no_search").setValue("")
      this.List(ListInput);


    }

    if (this.tab == 6) {
      this.currDiv = "Delivered"
      this.trackingDate = true;
      this.orderDate = false;
      this.isThirtyDays = true;
      this.currentPage = 1;
      const ListInput: Input = {} as Input;

      ListInput.offset = 0
      ListInput.size = 10;

      ListInput.otc_order_number = "";
      ListInput.invoice_no = "";
      ListInput.tracking_from_date = localStorage.getItem("FromDate");
      ListInput.tracking_to_date = localStorage.getItem("ToDate");
      this.rows = [];
      ListInput.invoice_status = "delivered";
      this.selectedItemsList = [];
      this.Filterarray = [];
      this.resetFilterFeild();
      this.AllFilters.get("otc_no_search").setValue("")
      this.List(ListInput);


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

  changeStatus(index) {
    this.items = this.items.map((item, itemIndex) => {
      if (index === itemIndex) {
        item.active = 'active';
      } else {
        item.active = '';
      }
      return item;
    })
  }

  listData: any = [];
  selectvalue = [];
  selectedvalue = [];
  test: string[] = [];
  List(ListInput) {
    this.totalrecord = 0

    this.FilterStrings(ListInput)
    this.loader.open()

    this.OrderListService.OrderTrackingList(ListInput).subscribe(

      data => {
        debugger;

        // this.totalrecord = data.rangeInfo.total_row;
        if (data.success == true) {
        
          this.totalrecord = data.total_result;
          this.showRecords = data.data.length
         // this.loader.close()
          this.rows = data.data;
         //console.log(this.rows ,"ffff");



          // this.OrderTrackingList = new FormGroup({})

          if (this.tab == 4) {
            this.invoiceCount = data.total_result;
          }
          if (this.tab == 3) {
            this.cancelCount = data.total_result;
          }
          if (this.tab == 5) {
            this.outForDeliveyCount = data.total_result;
          }
          if (this.tab == 6) {
            this.deliveryCount = data.total_result;
          }


          this.PreapreData(data.data);

          // if (this.selectedItemsList.length > 0) {
          //   // for (let formModule of this.listData) {
          //   //   this.OrderTrackingList.addControl(formModule.invoice_id, new FormControl(false))
          //   // }
          //   // for (let formModule of this.selectedItemsList) {
          //   //   this.OrderTrackingList.addControl(formModule, new FormControl(true))
          //   // }
          //   // for (let value1 of this.listData) {
          //   for (let value2 of this.selectedItemsList) {
          //     // if (value1.invoice_id == value2) {
          //     this.test = value2
          //     this.selectvalue.push(value2)
          //     // }
          //   }
          //   this.selectedvalue = this.selectvalue;

          //   // }

          // }
          this.loader.close()


        }
        else {
          if (this.tab == 4) {
            this.invoiceCount = 0
          }
          if (this.tab == 3) {
            this.cancelCount = 0
          }
          if (this.tab == 5) {
            this.outForDeliveyCount = 0
          }
          if (this.tab == 6) {
            this.deliveryCount = 0
          }
         // this.toastrService.error(data.data.msg);
          this.rows = [];


          this.loader.close();
        }
      }, (err) => {
        this.loader.close()

      }

    );

    this.loader.close()


  }
  FinalServiceData: any = [];
  PreapreData(Data) {
    this.rows = [];
    this.FinalServiceData = []
    for (let entry1 of Data) {

      const dataList1: FormArray1 = {} as FormArray1;


      var WaitHours = entry1.waiting_hours
      var Output

      if (WaitHours <= 0) {
        Output = 0 + ' Hours'
        dataList1.Color = "accent"
      }
      else if (WaitHours > 0 && WaitHours <= 8) {
        Output = WaitHours.toFixed(0) + ' Hours'
        dataList1.Color = "accent"
      }

      else if (WaitHours > 8 && WaitHours <= 12) {
        Output = WaitHours.toFixed(0) + ' Hours'
        dataList1.Color = "primary"
      }
      else if (WaitHours > 12 && WaitHours <= 24) {
        Output = WaitHours.toFixed(0) + ' Hours'
        dataList1.Color = "warn"
      }
      else if (WaitHours > 24) {
        Output = (Number(WaitHours) / 24).toFixed(0) + ' Days'
        dataList1.Color = "warn"
      }


      dataList1.order_number = entry1.order_number;
      dataList1.order_date = entry1.order_date;
      dataList1.order_amount = entry1.order_amount;

      dataList1.Pendinghours = Output;
      dataList1.invoice_amount = entry1.invoice_amount;
      dataList1.invoice_no = entry1.invoice_no;
      dataList1.otc_order_number = entry1.otc_order_number;

      dataList1.account_name = entry1.account_name;
      dataList1.organization_name = entry1.organization_name;
      dataList1.account_id = entry1.account_id;
      dataList1.tracking_date = entry1.tracking_date;
      dataList1.invoice_id = entry1.invoice_id;
      dataList1.invoice_status = entry1.invoice_status;
      dataList1.size = entry1.size,
        dataList1.offset = entry1.offset,
        dataList1.is_shipsy = entry1.is_shipsy;
      dataList1.payment_method = entry1.payment_method;
      this.FinalServiceData.push(dataList1);

    }

    this.rows = this.FinalServiceData;
    if (this.currDiv == 'invoiced' || this.currDiv == 'OutforDelivery') {
      for (let j = 0; j < this.selectedItemsList.length; j++) {
        for (let i = 0; i < this.rows.length; i++) {

          if (this.selectedItemsList[j].invoice_id == this.rows[i].invoice_id) {
            this.rows[i].isChecked = true;
          }

        }
      }
    }
  }

  items: any
  AllorderList(ListInput: any) {
    // debugger;
    //this.loader.open()
    this.FilterStrings(ListInput)
    this.items = []
    this.totalrecord = 0

    this.OrderListService.OrderTrackingALlList(ListInput).subscribe(

      data => {

        debugger

        if (data.success == true) {

          this.totalrecord = data.total_row;
          this.showRecords = data.data.length
          this.items = data.data;
          this.loader.close()
          this.items = data.data;

          this.totalrecord = data.rangeInfo.total_row;

          if (this.tab == 1) {
            this.allCount = data.rangeInfo.total_row;
           // console.log(this.allCount)
            //console.log(data.rangeInfo.total_row)
          }
          if (this.tab == 2) {
            this.delayCount = data.rangeInfo.total_row;
          }


        }



        else {
          if (this.tab == 1) {
            this.allCount = 0;
           // console.log(this.allCount)
            // console.log(data.rangeInfo.total_row)
          }
          if (this.tab == 2) {
            this.delayCount = 0;
          }
          this.loader.close()


          this.toastrService.error(data.data.msg)
        }
      }, (err) => {
        this.loader.close();


      }

    );




  }

  TempReject = []
  Errormessage: any;
  RejectItem: any;
  InvoicedClick(CurrentTab) {
    debugger
    this.Errormessage = ""
    this.TempReject = []
    if (this.selectedItemsList.length > 0) {
      for (let entry1 of this.selectedItemsList) {
        var d1 = Date.parse(this.datepipe.transform(entry1.tracking_date, 'yyyy-MM-dd hh:mm a'));
        var d2 = Date.parse(this.datepipe.transform(this.trackingdate.value, 'yyyy-MM-dd hh:mm a'));
        if (d1 > d2) {
          var json = { "InvoiceNumber": entry1.invoice_no, "TrackingDate": this.datepipe.transform(entry1.tracking_date, 'yyyy-MM-dd hh:mm a'), "selectedDate": this.datepipe.transform(this.trackingdate.value, 'yyyy-MM-dd hh:mm a'), "Title": CurrentTab }
          // this.TempReject.push(entry1.invoice_no)
          this.TempReject.push(json)
        }
      }
    }

    if (this.TempReject.length == 0) {
      if (this.selectedItemsList.length > 0) {
        let invoice_ids: number[];
        invoice_ids = this.invoice_ids1;
        var CStatus;
        const dataList: FormArray = {} as FormArray;
        var Finalstatus = "";
        if (CurrentTab == "Invoiced") {
          Finalstatus = "out for delivery";
          CStatus = "Invoice"
        }
        else if (CurrentTab == "OutForDelivery") {
          Finalstatus = "delivered";
          CStatus = "Out For delivery"
        }
        dataList.tracking_date = this.trackingdate.value;
        for (let entry1 of this.selectedItemsList) {
          const dataList1: FormArray = {} as FormArray;
          dataList1.invoice_id = entry1.invoice_id;
          dataList1.invoice_status = Finalstatus;
          // dataList1.tracking_date = this.datepipe.transform(this.trackingdate.value, 'yyyy-MM-dd hh:mm a');
          dataList1.tracking_date = moment(this.trackingdate.value).format('yyyy-MM-DD hh:mm a')
          this.invoice_ids1.push(dataList1);

        }
        const Final: FinalArray = {} as FinalArray;
        Final.invoice_list = this.invoice_ids1;

        this.loader.open()
        this.OrderListService.updateStatus(Final).subscribe(
          data => {
            if (data.success == true) {
              // this.trackingdate = new FormControl(new Date());
              this.RefreshTab();
              Swal.fire('Status Updated!');
              this.selectedItemsList = []
              this.modalService.dismissAll();
              if (CurrentTab == "Invoiced") {
                this.currDiv = "invoiced"
                const ListInput: Input = {} as Input;
                ListInput.invoice_status = "invoiced";
                ListInput.invoice_no = "";
                ListInput.otc_order_number = "";
                ListInput.order_from_date = "";
                ListInput.order_to_date = "";
                ListInput.tracking_from_date = "";
                ListInput.tracking_to_date = "";
                ListInput.offset = 0
                this.rows = [];
                ListInput.size = 10;
                this.selectedItemsList = [];
                this.List(ListInput);
              }
              else if (CurrentTab == "OutForDelivery") {
                this.currDiv = "OutforDelivery"
                const ListInput: Input = {} as Input;
                ListInput.offset = 0
                ListInput.size = 10;
                ListInput.tracking_from_date = "";
                ListInput.tracking_to_date = "";
                ListInput.otc_order_number = "";
                ListInput.invoice_no = "";
                ListInput.tracking_from_date = "";
                ListInput.tracking_to_date = "";
                this.rows = [];
                ListInput.invoice_status = "out for delivery";
                this.selectedItemsList = [];
                this.List(ListInput);
              }
              this.loader.close();
              // this.rows = [];
            }
            else {
              this.selectedItemsList = []
              // this.rows = [];
              this.loader.close();
              this.modalService.dismissAll();
            }
          }, (err) => {
            this.selectedItemsList = []
            this.loader.close();
            this.modalService.dismissAll();
          }
        );
      }
      else {
        Swal.fire('Please Select at Least One Invoice.');
        this.modalService.dismissAll();
      }

    }
    else {
      // let dialogRef: MatDialogRef<any> = this.dialog.open(TackingRejectInvoicepopupComponent, {
      //   //width: '1000px',
      //   disableClose: false,
      //   data: { payload: this.TempReject, Title: CurrentTab }
      // })
      //  this.Errormessage = "Tracking date is always greater than " + CStatus + " date , Please check below invoiced </br>" + this.TempReject.join();

      this.RejectItem = this.TempReject;
      let ngbModalOptions: NgbModalOptions = {
        backdrop: true,
        keyboard: true
      };
      this.modalService.open(this.TrackingReject, ngbModalOptions).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason: any) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    this.loader.close();
  }


  RefreshTab() {
    const ListInput: Input = {} as Input;
    ListInput.offset = 0
    //   ListInput.tracking_from_date = "";
    // ListInput.tracking_to_date = "";
    // ListInput.otc_number = "";
    // ListInput.invoice_no = "";

    if (this.invoice_no) {
      ListInput.invoice_no = this.invoice_no;
    }
    else {

      ListInput.invoice_no = "";
    }
    if (this.otc_number) {
      ListInput.otc_order_number = this.otc_number;
    }
    else {
      ListInput.otc_order_number = "";
    }
    if (this.ToDate) {
      ListInput.tracking_to_date = this.ToDate;
    }
    else {
      ListInput.tracking_to_date = "";
    }

    if (this.FromDate) {

      ListInput.tracking_from_date = this.FromDate;
    }
    else {

      ListInput.tracking_from_date = "";
    }
    if (this.tab == 2) {
      this.rows = [];
      ListInput.invoice_status = "invoiced";
      this.List(ListInput);
    }
    if (this.tab == 3) {
      this.rows = [];
      ListInput.invoice_status = "out for delivery";
      this.List(ListInput);
    }
    if (this.tab == 4) {
      this.rows = [];
      ListInput.invoice_status = "delivered";
      this.List(ListInput);
    }
    this.List(ListInput);
  }

  invoiceId: any;
  onCheckboxChangeFn(row, event) {
    // this.fetchSelectedItems()
    // this.fetchCheckedIDs()
    if (event.target.checked) {
      this.selectedItemsList.push(row);
    } else {
      for (var i = 0; i < this.rows.length; i++) {
        if (this.selectedItemsList[i] == row) {
          this.selectedItemsList.splice(i, 1);
        }
      }
    }

    // localStorage.setItem("distributorValue", JSON.stringify(this.selectedItemsList));

    //     if (event.target.checked) {
    //   this.selectedItemsList.push(true);
    // }
    // else{
    //   this.selectedItemsList.push(false);
    // }

    // localStorage.setItem("distributorValue", JSON.stringify(this.selectedItemsList));
  }

  GetColor(Hours) {

    var Output
    var WaitHours = Hours;
    var Color

    if (WaitHours <= 0) {
      Output = 0 + ' Hours'
      Color = "accent"
    }
    else if (WaitHours > 0 && WaitHours <= 8) {
      Output = WaitHours.toFixed(0) + ' Hours'
      Color = "accent"
    }

    else if (WaitHours > 8 && WaitHours <= 12) {
      Output = WaitHours.toFixed(0) + ' Hours'
      Color = "primary"
    }
    else if (WaitHours > 12 && WaitHours <= 24) {
      Output = WaitHours.toFixed(0) + ' Hours'
      Color = "warn"
    }
    else if (WaitHours > 24) {
      Output = (Number(WaitHours) / 24).toFixed(0) + ' Days'
      Color = "warn"
    }
    return Color;

  }

  open(content) {
    this.modalService.open(content);
  }
  openDelivery(contentDelivery) {
    this.modalService.open(contentDelivery);
  }

  calculateDate1(Date1, date2) {
    Date1 = new Date(Date1);
    date2 = new Date(date2);
    var diffc = Date1.getTime() - date2.getTime();

    var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));

    return days;
  }

  allOrderReport: any;
  count: any;
  pageName: any;
  fileTypeName: any;
  ReportDownlodAll(event) {


    // if (event.target.value == " ") {
    //   Swal.fire('For All orders, Please select download type')
    // }
    // else if (event.target.value == "Excel") {
    //   var days = this.calculateDate1(this.from_date, this.to_date);

    //   if (days > 30) {
    //     Swal.fire('For e-Dukaan orders, Export to excel option is allowed for 30 days')
    //   }
    //   else {

        if (this.totalrecord == 0) {
          Swal.fire("No Data For downloding.....");
        } else {
          const ListInput1: AllReport = {} as AllReport;
          var fileType = "";
          if (this.tab == 1) {
            fileType = "ALL";

            ListInput1.invoice_status = this.invoice_status;
            ListInput1.invoice_no = this.invoice_no;
            ListInput1.otc_number = this.otc_number;
            ListInput1.order_from_date = this.from_date;
            ListInput1.order_to_date = this.to_date;
            ListInput1.tracking_from_date = this.tracking_from_date; //this.FromDate;
            ListInput1.tracking_to_date = this.tracking_to_date;// this.ToDate;
            ListInput1.divison_id = this.div_id;
            ListInput1.offset = 0
            ListInput1.size = this.totalrecord;
            ListInput1.org_name = this.distributor_name;
            ListInput1.account_name = this.account_name
            // ListInput1.order_status = "Confirmed";
            ListInput1.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"]
            ListInput1.invoice_from_date = this.invoice_from_date
            ListInput1.invoice_to_date = this.invoice_to_date
          }
          else if (this.tab == 2) {
            fileType = "Delayed";

            //const ListInput1: AllInput = {} as AllInput;
            //ListInput1.order_status = "Confirmed";
            ListInput1.order_status_array = ["Confirmed"]
            ListInput1.invoice_status = "order_without_invoice";
            ListInput1.invoice_no = this.invoice_no;
            ListInput1.otc_number = this.otc_number;
            ListInput1.order_from_date = this.order_from_date;
            ListInput1.order_to_date = this.order_to_date;
            ListInput1.tracking_from_date = this.tracking_from_date; //this.FromDate;
            ListInput1.tracking_to_date = this.tracking_to_date;// this.ToDate;
            ListInput1.divison_id = this.division_id;
            ListInput1.account_name = this.account_name
            ListInput1.org_name = this.distributor_name;
            ListInput1.offset = 0
            ListInput1.size = this.totalrecord;
          }


          this.allOrderReport = ListInput1;
          this.count = this.totalrecord;
          this.pageName = "tracking-All";
          this.fileTypeName = fileType
          let ngbModalOptions: NgbModalOptions = {
            backdrop: false,
            keyboard: false,
          };
          this.modalService.open(this.reportAllDownload, ngbModalOptions).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason: any) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        }
      }
    // }
  // }
  OrderReport: any;
  ReportDownload(event) {
   debugger;

    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
      if (this.totalrecord == 0) {
        Swal.fire("No Data For downloding");
      }
      else {
        const ListInput: Report = {} as Report;

       

        //ListInput.tracking_from_date = this.tracking_from_date; //this.FromDate;
       // ListInput.tracking_to_date = this.tracking_to_date

        if (this.invoice_no) { ListInput.invoice_no = this.invoice_no; } else { ListInput.invoice_no = ""; }

        if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

        if (this.from_date) { ListInput.tracking_from_date = this.from_date; } else { ListInput.tracking_from_date = ""; }

        if (this.to_date) { ListInput.tracking_to_date = this.to_date; } else { ListInput.tracking_to_date = ""; }

        if (this.OrderFromDate) { ListInput.order_from_date = this.OrderFromDate; } else { ListInput.order_from_date = "" };
        if (this.OrderToDate) { ListInput.order_to_date = this.OrderToDate; } else { ListInput.order_to_date = ""; }
        if (this.divison_id) { ListInput.div_id = this.divison_id; } else { ListInput.div_id = ""; }

        if (this.org_name) { ListInput.org_name = this.org_name; } else { ListInput.org_name = "" }


        if (this.account_id) { ListInput.account_id = this.account_id; } else { ListInput.account_id = "" }

        
        
        
        if (this.tab == 4) {

          ListInput.invoice_status = "invoiced";

        }
        if (this.tab == 5) {

          ListInput.invoice_status = "out for delivery";

        }
        if (this.tab == 6) {

          ListInput.invoice_status = "Delivered";

        }
        if (this.tab == 3) {

          ListInput.invoice_status = "Cancelled";

        }

        ListInput.limit = this.totalrecord;
        ListInput.offset = 0;
        this.OrderReport = ListInput;
      
      
        this.count = this.totalrecord;
        this.pageName = "tracking";
        let ngbModalOptions: NgbModalOptions = {
          backdrop: false,
          keyboard: false,
        };
        this.modalService.open(this.reportDownload, ngbModalOptions).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
    }
 


  ReportDownloadDelivery(event) {

    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
      if (this.totalrecord == 0) {
        Swal.fire("No Data For downloding");
      } else {

        const ListInput: Input = {} as Input;


        if (this.invoice_no) { ListInput.invoice_no = this.invoice_no; } else { ListInput.invoice_no = ""; }

        if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

        if (this.from_date) { ListInput.tracking_from_date = this.from_date; } else { ListInput.tracking_from_date = ""; }

        if (this.to_date) { ListInput.tracking_to_date = this.to_date; } else { ListInput.tracking_to_date = ""; }

        if (this.OrderFromDate) { ListInput.order_from_date = this.OrderFromDate; } else { ListInput.order_from_date = "" };
        if (this.OrderToDate) { ListInput.order_to_date = this.OrderToDate; } else { ListInput.order_to_date = ""; }


        if (this.divison_id) { ListInput.div_id = this.divison_id; } else { ListInput.div_id = ""; }

        if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = "" }


        if (this.account_id) { ListInput.account_name = this.account_id; } else { ListInput.account_name = "" }



        
        if (this.curenttab == 4) {

          ListInput.invoice_status = "delivered";

        }
        if (this.curenttab == 3) {

          ListInput.invoice_status = "Cancelled";

        }

        ListInput.invoice_status = "delivered"
        ListInput.offset = 0;

        ListInput.size = this.totalrecord;

        this.OrderReport = ListInput;
        this.count = this.totalrecord;
        this.pageName = "deliverytracking";
        let ngbModalOptions: NgbModalOptions = {
          backdrop: false,
          keyboard: false,
        };
        this.modalService.open(this.reportDownload, ngbModalOptions).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

      }
    }

  // }

  SearchOTc(event) {

    if (event.key === "Enter") {
      if (this.tab == 1) {
        const AllFilters: AllInput = {} as AllInput;
        AllFilters.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"]
        AllFilters.order_from_date = localStorage.getItem("FromDate");
        AllFilters.order_to_date = localStorage.getItem("ToDate");
        AllFilters.otc_number = event.target.value;
        this.AllorderList(AllFilters);
        // this.loader.close();
      }
      else if (this.tab == 2) {
        const AllFilters: AllInput = {} as AllInput;
        AllFilters.order_status_array = ["Confirmed"];
        AllFilters.invoice_status = "order_without_invoice";
        AllFilters.order_from_date = localStorage.getItem("FromDate");
        AllFilters.order_to_date = localStorage.getItem("ToDate");
        AllFilters.otc_number = event.target.value;
        this.AllorderList(AllFilters);
        this.loader.close();

      }
      else if (this.tab == 3) {
        const listinput: InputOther = {} as InputOther;
        listinput.tracking_from_date = localStorage.getItem("FromDate");
        listinput.tracking_to_date = localStorage.getItem("ToDate");
        listinput.invoice_status = "Cancelled";
        listinput.otc_number = event.target.value;
        this.List(listinput)
        this.loader.close();

      }
      else if (this.tab == 4) {
        const listinput: InputOther = {} as InputOther;
        listinput.tracking_from_date = localStorage.getItem("FromDate");
        listinput.tracking_to_date = localStorage.getItem("ToDate");
        listinput.invoice_status = "invoiced";
        listinput.otc_number = event.target.value;
        this.List(listinput)
        this.loader.close();

      }
      else if (this.tab == 5) {
        const listinput: InputOther = {} as InputOther;
        listinput.tracking_from_date = localStorage.getItem("FromDate");
        listinput.tracking_to_date = localStorage.getItem("ToDate");
        listinput.invoice_status = "out for delivery";
        listinput.otc_number = event.target.value;
        this.List(listinput)
        this.loader.close();

      }
      else if (this.tab == 6) {
        const listinput: InputOther = {} as InputOther;
        listinput.tracking_from_date = localStorage.getItem("FromDate");
        listinput.tracking_to_date = localStorage.getItem("ToDate");
        listinput.invoice_status = "delivered";
        listinput.otc_number = event.target.value;
        this.List(listinput)
        this.loader.close();

      }
    }
  }

  showOtc(event) {
    if (this.tab == 1) {
      const AllFilters: AllInput = {} as AllInput;
      AllFilters.order_status_array = ["Confirmed", "Cancelled", "Partially Confirmed"]
      AllFilters.order_from_date = localStorage.getItem("FromDate");
      AllFilters.order_to_date = localStorage.getItem("ToDate");
      AllFilters.otc_number = event.target.value;
      this.AllorderList(AllFilters);
      this.loader.close();

    }
    else if (this.tab == 2) {
      const AllFilters: AllInput = {} as AllInput;
      AllFilters.order_status_array = ["Confirmed"];
      AllFilters.invoice_status = "order_without_invoice";
      AllFilters.order_from_date = localStorage.getItem("FromDate");
      AllFilters.order_to_date = localStorage.getItem("ToDate");
      AllFilters.otc_number = event.target.value;
      this.AllorderList(AllFilters);
      this.loader.close();

    }
    else if (this.tab == 3) {
      const listinput: InputOther = {} as InputOther;
      listinput.tracking_from_date = localStorage.getItem("FromDate");
      listinput.tracking_to_date = localStorage.getItem("ToDate");
      listinput.invoice_status = "Cancelled";
      listinput.otc_number = event.target.value;
      this.List(listinput)
      this.loader.close();

    }
    else if (this.tab == 4) {
      const listinput: InputOther = {} as InputOther;
      listinput.tracking_from_date = localStorage.getItem("FromDate");
      listinput.tracking_to_date = localStorage.getItem("ToDate");
      listinput.invoice_status = "invoiced";
      listinput.otc_number = event.target.value;
      this.List(listinput)
      this.loader.close();

    }
    else if (this.tab == 5) {
      const listinput: InputOther = {} as InputOther;
      listinput.tracking_from_date = localStorage.getItem("FromDate");
      listinput.tracking_to_date = localStorage.getItem("ToDate");
      listinput.invoice_status = "out for delivery";
      listinput.otc_number = event.target.value;
      this.List(listinput)
      this.loader.close();

    }
    else if (this.tab == 6) {
      const listinput: InputOther = {} as InputOther;
      listinput.tracking_from_date = localStorage.getItem("FromDate");
      listinput.tracking_to_date = localStorage.getItem("ToDate");
      listinput.invoice_status = "delivered";
      listinput.otc_number = event.target.value;
      this.List(listinput)
      this.loader.close();

    }
  }

  onRemoveFilter(filterString) {
    this.isDivisionVisible = false;

    if (filterString.Key == "otc_number") {
      this.otc_number = "";
      this.AllFilters.get("otc_number").setValue("")
      this.AllFilters.get("otc_no_search").setValue("")
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
    else if (filterString.Key == "organization_name") {
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
      const data2: InputData3 = {} as InputData3;
      data2.size = 5;
      this.GetAccount(data2);
    }
    else if (filterString.Key == "division_name") {
      this.division_id = "";
      this.division_name = "";
      this.DivisionList.reset();
    }
    else if (filterString.Key == "invoice_no") {
      this.invoice_no = "";
      this.AllFilters.get("invoice_no").setValue("")
    }
    // else if (filterString.Key == "status") {
    //   this.status = "";
    //   this.AllFilters.get("order_status").setValue("")
    // }
    else if (filterString.Key == "invoice_status") {
      this.invoice_status = "";
      this.AllFilters.get("invoice_status").setValue("")
    }

    this.SearchAllDate();
  }

  pageCount = [];
  allCount: any;
  delayCount: any;
  cancelCount: any;
  invoiceCount: any;
  outForDeliveyCount: any;
  deliveryCount: any;

  GetPageCount(input) {
    // this.Accountnamedata = [];
    this.pageCount = []
    debugger
    this.OrderListService.GetStatisticsOfPage(input).subscribe(
      data => {
        if (data.success == true) {
          this.pageCount = data.data;
          this.allCount = this.pageCount[0].order_count;
          this.delayCount = this.pageCount[1].order_count;
          this.invoiceCount = this.pageCount[2].order_count;
          this.outForDeliveyCount = this.pageCount[3].order_count;
          this.deliveryCount = this.pageCount[4].order_count;
          this.cancelCount = this.pageCount[5].order_count;
        }
        else {

        }
      }, (err) => {
      }
    );
  }
}

export interface AllInput {
  to_date: string;
  from_date: string;
  status: string;
  division_name: any;
  account_id: any;

  order_status_array: any;
  invoice_status: string
  invoice_no: string
  otc_number: string
  order_from_date: string
  order_to_date: string
  tracking_from_date: string
  tracking_to_date: string
  divison_id: string
  offset: number
  org_name: string
  size: number

  account_name: any;
  invoice_from_date: any;
  invoice_to_date: any;
  distributor_id: any;

}


export class Input {
  size: number
  organization_name: string

  account_name: string
  invoice_status: string
  offset: number

  otc_order_number: string
  invoice_no: string
  tracking_from_date: string
  tracking_to_date: string
  order_to_date: string
  order_from_date: string
  div_id: string
  //otc_number: string;
  to_date: any;
  from_date: any;
  distributor_id: any;
  Custname: any;
  otc_number: string;
  division_name: String;
  org_name: any;
  limit: number;
  //otc_order_number: string;
}


export interface FormArray1 {
  account_id: any;


  order_amount: string;
  otc_order_number: string;
  invoice_no: string;
  invoice_amount: string;
  tracking_date: string;
  Pendinghours: string;
  Color: string;
  invoice_id: string;
  account_name: string;
  organization_name: string;
  order_number: string;
  order_date: string;
  invoice_status: string;
  offset: number;
  size: number;
  is_shipsy: boolean;
  payment_method: string;
}


export class InputData {

  size: number
  org_search_text: string


}


export class InputOrderDetail {
  order_number: string
  otc_number: string;
}

export class InputInvoiceDetail {
  invoice_no: number;
}


export interface FinalArray {
  invoice_list: any[];
}

export interface FormArray {
  invoice_id: string;
  invoice_status: string;
  tracking_date: string;
}
export class InputData1 {

  size: number
  org_search_text: string
  account_name: string;
  div_search_text: string;
  distributor_id: any;


}
export class InputData3 {

  div_name: string
  size: number;
  div_search_text: string


}

export class AllReport {
  order_status_array: any;
  invoice_status: string
  invoice_no: string
  otc_number: string
  order_from_date: string
  order_to_date: string
  tracking_from_date: string
  tracking_to_date: string
  divison_id: string
  offset: number
  org_name: string
  size: number
  account_name: any;
  invoice_from_date: any;
  invoice_to_date: any;
}


export class Report {
  size: number
  org_name: string
  //  account_id: string
  account_name: string
  invoice_status: string
  offset: number
  // invoice_from_date: string
  // invoice_to_date: string
  otc_number: string
  invoice_no: string
  tracking_from_date: string
  tracking_to_date: string
  order_to_date: string
  order_from_date: string
  div_id: string
  limit: any;
  account_id: any;

  // offset:number
}


export interface InputOther {
  limit: any;
  to_date: string;
  from_date: string
  division_name: any;
  account_id: any;
  offset: number
  account_name: string
  divison_id: string
  invoice_no: string
  invoice_status: string
  order_from_date: string
  order_status_array: any
  order_to_date: string
  // org_name: string
  organization_name: string
  otc_number: string
  size: number;
  tracking_from_date: string
  tracking_to_date: string
  distributor_id: any;
}

export class InputPageCount {
  page_type: string
  from_date: string;
  to_date: string;
}