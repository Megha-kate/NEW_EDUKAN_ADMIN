import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbDateAdapter, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { ReportServicesService } from 'src/app/shared/Services/report-services.service';
import { CommonService } from './../../../shared/Services/common-service.service';
import * as moment from 'moment';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { ListInput } from '../../Order Managment/Cancle-List/cancle-list/cancle-list.component';


@Component({
  selector: 'app-invoice-level-mis',
  templateUrl: './invoice-level-mis.component.html',
  styleUrls: ['./invoice-level-mis.component.scss']
})
export class InvoiceLevelMisComponent implements OnInit {
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>;
  //showDateType: any;
  //fb: any;

  filterValue: any;
  //filterValue1: any;
  filterValue2: any;
  divsion_name: any;
  filterValue1: string;
  //filter1Custname: any;
  filterValue3: string;
  otc_number: any;

  public itemForm = new FormGroup({});
  DistributorList = new FormGroup({});
  CustomerList = new FormGroup({});
  DivisionList = new FormGroup({});
  myControl2 = new FormControl();
  myControl1 = new FormControl();
  GetstateNew = new FormGroup({});

  options: any;
  from_date: any;
  to_date: any;
  currDiv: any;
  ShowCustom: boolean;
  todaydate: boolean;
  sevenday: boolean;
  iscustomDate: boolean = false;
  isLastsevenDay: boolean = false;
  isToday: boolean = false;
  distributor_name: any;
  DistributorData = [];
  StateData = []
  RoleName: any;
  DistCode: string;
  distributor_id: any;
  Division = [];
  division_name: String;
  division_id: string;
  invoice_from_date: string;
  invoice_to_date: string;
  div_name: string;
  div_id: string;
  isDistDrpDownVisible: boolean = true;
  account_name: string;
  account_id: string;
  org_name: any;
  part_number: any;
  order_quantity: any;
  invoice_no: any;
  order_status: any;
  status: any;
  state_name: any;
  state_code: any;
  Filterarray: any;
  _filter1: any;
  isOrderdate: boolean = false;
  isInvoicedate: boolean;
  isinvoice_from_date: boolean;
  isinvoice_to_date: boolean;
  state_codes: any
  AllDistributorData: any;
  selectedDistributor: any;
  selectedAccountname: any;
  rating: any;
  date: Date;
  isThirtydays: boolean;
  from_date1: any;
  to_date1: any;

  isDivisionVisible: boolean;
  state: string;

  constructor(private MISService: ReportServicesService,
    private OrderListService: OrderserviceService,
    private CommonService: CommonService,
    private datepipe: DatePipe,
    private dateAdapter: NgbDateAdapter<string>,
    private modalService: NgbModal,
    private loader: AppLoaderService, private fb: FormBuilder,
    private toastrService: ToastrService,
  ) { }


  items: any = [];

  // to_date: String
  // from_date: String

  currentPage: any;
  totalrecord: any
  noofrecordsperpage: any;
  showRecords: number;

  ngOnInit(): void {
    this.currentPage = 1
    this.noofrecordsperpage = 10;
    this.showRecords = 10;

    const ExportArrayInput: InputData = {} as InputData;
    const ListInput1: AllInput = {} as AllInput;

    this.isInvoicedate = true;
    this.isThirtydays = true;

    this.currDiv = "All"
    this.date = new Date();
    this.from_date = moment(this.date).subtract(30, 'days').format('yyyy-MM-DD')
    this.to_date = localStorage.getItem("ToDate");
    const ExportArrayInput1: Input = {} as Input;
    ExportArrayInput1.offset = 0
    ExportArrayInput1.size = this.noofrecordsperpage
    // ExportArrayInput1.from_date = "";
    // ExportArrayInput1.to_date = "";
    ExportArrayInput1.invoice_from_date = localStorage.getItem("FromDate");
    ExportArrayInput1.invoice_to_date = localStorage.getItem("ToDate");

    this.InvoiceLevelMisData(ExportArrayInput1)
    ExportArrayInput.size = 5;
    this.GetDistributor(ExportArrayInput);

    const ExportArrayInput4: InputData2 = {} as InputData2;
    ExportArrayInput4.size = 5;
    this.GetAccount(ExportArrayInput4)

    const ExportArrayInput5: InputDat4 = {} as InputDat4;
    ExportArrayInput5.size = 5;
    this.GetStateData();
    
    this.BuildForm();

    this.RoleName = this.CommonService.getRole();
    this.DistCode = this.CommonService.GetDistributorCode()

    this.isDivisionVisible = false;

    if (this.RoleName != "TML") {
      //tempcode
      this.isDivisionVisible = true;
      this.isDistDrpDownVisible = false;
      const data: InputData1 = {} as InputData1;

      // data.distributor_id = Event.distributor_id;
      data.distributor_id = this.DistCode;
      data.div_search_text = "";

      this.Getdivision(data);

      this.myControl2.valueChanges.subscribe(value => {

        this._filter1Custname(value)
      });

      this.filterValue = null;
      this.myControl1.valueChanges.subscribe(value => {

        this._filter1(value)
      });

    }
  }
  filterValue4: any
  Custid: any
  private _filter1Custname(value: string): string[] {

    this.filterValue4 = value;
    // this.filterValue = filterValue1;

    if (this.filterValue4 == "") {
      this.Custid = null;
    }

    const data: InputData2 = {} as InputData2;


    data.account_name = this.filterValue4;
    data.size = 5;
    this.GetAccount(data);
    // alert(filterValue1);

    return this.options.filter(option => option.toLowerCase().includes(this.filterValue4));
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
  Accountnamedata: any = []
  AccountnamedataOrignal;
  GetAccount(Data1) {
    this.Accountnamedata = [];
    this.CommonService.AccountName(Data1).subscribe(
      data => {
        if (data.success == true) {

          this.Accountnamedata = [];
          ///  this.filterValue2 = null;
          this.AccountnamedataOrignal = data.data;
          // this.Accountnamedata[this.selectedAccountname].isChecked = true

          // this.Accountnamedata = data.data;
          this.Accountnamedata = this.AccountnamedataOrignal.slice(0, 5)
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

  divisiontype() {
    this.div_id = ""
    this.division_name = ""

    const data1: InputData3 = {} as InputData3;

    data1.size = 5;
    data1.div_search_text = this.itemForm.value.division_name;
    // this.Getdivision(data1);
  }


  accountType() {
    //  alert("hii");
    // this.account_name = "";
    // //this.account_id="";
    // const data1: InputData2 = {} as InputData2;
    // data1.size = 5;
    // data1.cust_search_text = this.itemForm.value.account_name

    // this.Accountnamedata = this.AccountnamedataOrignal.filter(obj => obj.account_name.toLowerCase().indexOf(data1.cust_search_text) > -1)
    // this.GetAccount(this.Accountnamedata);

    const data2: InputData2 = {} as InputData2;
    data2.size = 5;
    data2.account_name = this.itemForm.value.account_name;
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


  // custtype() {
  //   //  alert("hii");
  //   // this.account_name = "";
  //   // //this.account_id="";
  //   // const data1: InputData2 = {} as InputData2;
  //   // data1.size = 5;
  //   // data1.cust_search_text = this.itemForm.value.account_name

  //   // this.Accountnamedata = this.AccountnamedataOrignal.filter(obj => obj.account_name.toLowerCase().indexOf(data1.cust_search_text) > -1)
  //   // this.GetAccount(this.Accountnamedata);


  //   this.account_name = "";
  //   this.account_id = ""

  //   const data2: InputData2 = {} as InputData2;

  //   data2.size = 5;
  //   data2.cust_search_text = this.itemForm.value.account_name;
  //   this.GetAccount(data2);
  // }

  changedate(Value) {
    if (Value == 'order_date') {
      this.isOrderdate = true;
      this.isInvoicedate = false;
      this.itemForm.patchValue({
        invoice_from_date: true,

      })
    }

    if (Value == 'invoice_date') {
      this.isOrderdate = false;
      this.isInvoicedate = true;
      this.itemForm.patchValue({
        invoice_to_date: false,

      })
    }






  }

  changedatefilter(Value) {

    if (Value == 'Today') {
      this.ShowCustom = false;
      this.isToday = true;
      this.itemForm.patchValue({
        Today: true,
        Custom: false,
        thirtyDays: false,
        Sevenday: false
      })
    }

    if (Value == 'Sevenday') {
      this.ShowCustom = false;
      this.isLastsevenDay = true;
      this.itemForm.patchValue({
        Today: false,
        Custom: false,
        thirtyDays: false,
        Sevenday: true
      })
    }

    if (Value == 'thirtyDays') {
      this.ShowCustom = false;
      this.isThirtydays = true;
      this.isLastsevenDay = false;
      this.isToday = false;
      this.iscustomDate = false;
      this.itemForm.patchValue({
        Today: false,
        Custom: false,
        thirtyDays: true,
        Sevenday: false
      })
    }

    if (Value == 'Custom') {
      this.ShowCustom = true;
      this.iscustomDate = true;
      this.itemForm.patchValue({
        Today: false,
        Custom: true,
        thirtyDays: false,
        Sevenday: false
      })
    }


  }
  // statedata = []

  GetStateData() {
    this.StateData = []

    var Json = {
      "dropdown_type": "state",
      "multi_district": [],
      "multi_taluka": [],
      "multi_city": [],
      "offset": 0,
      "limit": 10000
    }

    this.CommonService.GetstateNew(Json).subscribe(
      data => {
        if (data.success == true) {
          this.StateData = data.data.States;
        }
        else {
        }
      }, (err) => {

      }
    );
  }
  // statefilteradd(row, event) {

  //   this.state_name=row.state_name
  //   this.state_code=row.state_code;
  //   if (event.target.checked) {
  //     for (const field1 in this.GetstateNew.controls) { // 'field' is a string
  //       if (field1 == this.state_code) {
  //         this.GetstateNew.get(field1).setValue(true);
  //       }
  //       else {
  //         this.GetstateNew.get(field1).setValue(false);
  //       }
  //     }
  //   }
  //   else {
  //     for (const field1 in this.GetstateNew.controls) { // 'field' is a string
  //       this.GetstateNew.get(field1).setValue(false);
  //     }
  //   }
  //   //this.Getdivision(row)
  // }

  GetDistributor(Data) {
    this.DistributorData = []


    this.CommonService.DistributorList(Data).subscribe(
      data => {
        if (data.success == true) {
          this.DistributorData = data.data.result;
          this.AllDistributorData = data.data.result;


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

  InvoiceLevelMisData(ListInput: Input) {
    // this.loader.open()
    debugger
    // this.TotalAllRecords = 0
    this.totalrecord = 0
    this.FilterStrings(ListInput);



    //this.loader.open();


    this.MISService.InvoiceLevelMisData(ListInput).subscribe(

      data => {


        if (data.Success == true) {
          debugger
          //this.page.totalElements = data.rangeInfo.total_count;
          //this.TotalAllRecords = data.rangeInfo.total_count;
          this.totalrecord = data.total_elements;
          this.items = []
          this.items = data.data;
          this.showRecords = data.data.length

          this.loader.close()






        }



        else {

          // this.page.totalElements = 0;
          this.loader.close();
          this.items = [];
          this.toastrService.error(data.data.msg)
          // this.loader.close();
        }
      }, (err) => {

      }

    );




  }

  BuildForm() {
    this.itemForm = this.fb.group({
      from_date: [],
      to_date: [],
      otc_number: [],
      account_name: [],
      distributor_name: [],
      division_name: [],
      days: [],
      to_percentage: [],
      from_percentage: [],
      part_number: [],
      order_quantity: [],
      org_name: [],
      invoice_no: [],
      Today: [],
      Custom: [],
      thirtyDays: [],
      Sevenday: [],
      Distributor_Id: [''],
      rating: [],
      state: [],
      state_code:[''],
      state_name:[''],
      order_status:['']
    })
  }


  calculateDate1(Date1, date2) {
    debugger
    Date1 = new Date(Date1);
    date2 = new Date(date2);
    var diffc = Date1.getTime() - date2.getTime();

    var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));

    return days;
  }
  //Filterarray=[];
  fromDate: any;
  toDate: any;
  orderFromDate: any;
  orderToDate: any;
  Search() {
    debugger
    this.Filterarray = [];

    var a = this.DistributorList.valid;
    this.date = new Date();
    //alert(this.DistributorList.valid)
    if (this.isOrderdate == true) {
      if (this.iscustomDate == true) {
        if (this.itemForm.value.from_date == null || this.itemForm.value.from_date == "" && this.itemForm.value.to_date !== null) {
         // Swal.fire('Select From Date');
          const ListInput: Input = {} as Input;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.InvoiceLevelMisData(ListInput)
          return
        }
        else if (this.itemForm.value.from_date !== null && this.itemForm.value.to_date == null || this.itemForm.value.to_date == "") {
          //Swal.fire('Select To Date');
          const ListInput: Input = {} as Input;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
          this.InvoiceLevelMisData(ListInput)
          return
        }
        var d1 = moment(this.from_date).format('yyyy-MM-DD')
        var d2 = moment(this.to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1, d2);
        if (d1 > d2) {
         // Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: Input = {} as Input;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.InvoiceLevelMisData(ListInput)
          return

        }
        else if (days >= 95) {
          Swal.fire(' Allow to get Only 95 Days Data');
          const ListInput: Input = {} as Input;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.InvoiceLevelMisData(ListInput)
          return
        }
        this.fromDate = this.itemForm.value.from_date;
        this.toDate = this.itemForm.value.to_date;
        this.orderFromDate = moment(this.fromDate).subtract(1, 'months').format('yyyy-MM-DD')
        this.orderToDate = moment(this.toDate).subtract(1, 'months').format('yyyy-MM-DD')
      }
      else if (this.isLastsevenDay == true) {
        this.fromDate = this.from_date
        this.toDate = this.to_date
        this.orderFromDate = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
        this.orderToDate = this.datepipe.transform(this.toDate, 'yyyy-MM-dd')
      }
      else if (this.isToday == true) {
        this.fromDate = this.from_date
        this.toDate = this.to_date
        this.orderFromDate = moment(this.toDate).format('yyyy-MM-DD')
        this.orderToDate = this.datepipe.transform(this.toDate, 'yyyy-MM-dd')
      }
      else {
        this.fromDate = this.from_date
        this.toDate = this.to_date
        this.orderFromDate = moment(this.date).subtract(30, 'days').format('yyyy-MM-DD')
        this.orderToDate = this.datepipe.transform(this.toDate, 'yyyy-MM-dd')
      }
    }
    else if (this.isInvoicedate == true) {
      if (this.iscustomDate == true) {

        if (this.itemForm.value.invoice_from_date == null || this.itemForm.value.invoice_from_date == "" && this.itemForm.value.invoice_to_date !== null) {
          Swal.fire('Select From Date');
          const ListInput: Input = {} as Input;
          ListInput.invoice_from_date = localStorage.getItem("FromDate");
          ListInput.invoice_to_date = localStorage.getItem("ToDate");
          ListInput.offset = 0;
          ListInput.size = 10;


          this.InvoiceLevelMisData(ListInput)
          return
        }
        else if (this.itemForm.value.invoice_from_date !== null && this.itemForm.value.invoice_to_date == null || this.itemForm.value.invoice_to_date == "") {
          Swal.fire('Select To Date');
          const ListInput: Input = {} as Input;
          ListInput.invoice_from_date = localStorage.getItem("FromDate");
          ListInput.invoice_to_date = localStorage.getItem("ToDate");
          ListInput.offset = 0;
          ListInput.size = 10;



          this.InvoiceLevelMisData(ListInput)
          return
        }
        var d1 = moment(this.itemForm.value.invoice_from_date).format('yyyy-MM-DD')
        var d2 = moment(this.itemForm.value.invoice_to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1, d2);
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: Input = {} as Input;
          ListInput.invoice_from_date = localStorage.getItem("FromDate");
          ListInput.invoice_to_date = localStorage.getItem("ToDate");
          ListInput.offset = 0;
          ListInput.size = 10;


          this.InvoiceLevelMisData(ListInput)
          return

        }
        else if (days >= 95) {
          Swal.fire(' Allow to get Only 95 Days Data');
          const ListInput: Input = {} as Input;
          ListInput.invoice_from_date = localStorage.getItem("FromDate");
          ListInput.invoice_to_date = localStorage.getItem("ToDate");
          ListInput.offset = 0;
          ListInput.size = 10;

          this.InvoiceLevelMisData(ListInput)
          return
        }
        this.fromDate = this.itemForm.value.from_date;
        this.toDate = this.itemForm.value.to_date;
        this.invoice_from_date = moment(this.fromDate).subtract(1, 'months').format('yyyy-MM-DD')
        this.invoice_to_date = moment(this.toDate).subtract(1, 'months').format('yyyy-MM-DD')
      }
      else if (this.isToday == true) {
        this.fromDate = this.from_date
        this.toDate = this.to_date
        this.invoice_from_date = moment(this.toDate).format('yyyy-MM-DD')
        this.invoice_to_date = this.datepipe.transform(this.toDate, 'yyyy-MM-dd')
      }
      else if (this.isLastsevenDay == true) {
        this.fromDate = this.from_date
        this.toDate = this.to_date
        this.invoice_from_date = moment(this.date).subtract(7, 'days').format('yyyy-MM-DD')
        this.invoice_to_date = this.datepipe.transform(this.toDate, 'yyyy-MM-dd')
      }
      else {
        this.fromDate = this.from_date
        this.toDate = this.to_date
        this.invoice_from_date = moment(this.date).subtract(30, 'days').format('yyyy-MM-DD')
        this.invoice_to_date = this.datepipe.transform(this.toDate, 'yyyy-MM-dd')
      }
    }
    

    this.otc_number = this.itemForm.value.otc_number
    this.part_number = this.itemForm.value.part_number
    this.order_quantity = this.itemForm.value.order_quantity
    this.invoice_no = this.itemForm.value.invoice_no
    this.order_status = this.itemForm.value.status;
    this.status = this.itemForm.value.order_status;
    this.state_codes = this.itemForm.value.state;
    this.rating = this.itemForm.value.rating;
    if (this.distributor_id != "") {
      this.itemForm.get('Distributor_Id').setValue(this.distributor_id);
      this.itemForm.get('org_name').setValue(this.distributor_name);
    }
    else {
      this.distributor_name = this.itemForm.value.org_name;
      this.itemForm.get('org_name').setValue(this.distributor_name);
    }

    if (this.account_id != "") {
      this.itemForm.get('account_name').setValue(this.account_name);
    }

    if (this.division_id != "") {
      this.itemForm.get('division_name').setValue(this.division_name);
    }
    if (this.isInvoicedate == true) {
      if (this.invoice_from_date) {
        this.itemForm.get('from_date').setValue(this.invoice_from_date);
      }
      if (this.invoice_to_date) {
        this.itemForm.get('to_date').setValue(this.invoice_to_date);
      }
    }

    const ListInput: Input = {} as Input;




    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

    // if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }
    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }


    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }
    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
    if (this.order_quantity) { ListInput.order_quantity = this.order_quantity } else { ListInput.order_quantity; }
    if (this.invoice_no) { ListInput.invoice_no = this.invoice_no } else { ListInput.invoice_no; }
    if (this.order_status) { ListInput.order_status = this.order_status; } else { ListInput.order_status = ""; }

    if (this.status) { ListInput.status = this.status; } else { ListInput.status = ""; }
    //if (this.rating){ListInput.rating} =this.rating;} else {ListInput.rating=""}
    if (this.rating) { ListInput.rating = this.rating; } else { ListInput.rating = ""; }


    if (this.isOrderdate == true) {
      if (this.orderFromDate) { ListInput.from_date = this.orderFromDate; } else { ListInput.from_date = ""; }
      if (this.orderToDate) { ListInput.to_date = this.orderToDate; } else { ListInput.to_date = ""; }
    }
    if (this.isInvoicedate == true) {
      if (this.invoice_from_date) { ListInput.invoice_from_date = this.invoice_from_date; } else { ListInput.invoice_from_date = ""; }
      if (this.invoice_to_date) { ListInput.invoice_to_date = this.invoice_to_date; } else { ListInput.invoice_to_date = ""; }
    }
    // this.from_date1 = this.itemForm.value.from_date;
    // this.to_date1 = this.itemForm.value.to_date;
    // // this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
    // // this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
    // var finaldate = this.dateformate(this.from_date1) + ' '+ 'to' + ' ' + this.dateformate(this.to_date1);
    // var Json1 = { "Key": 'from_date', "Value": finaldate }
    // this.Filterarray.push(Json1)
    // this.itemForm.get('from_date').setValue('');
    // this.itemForm.get('to_date').setValue('');
    // if (this.state_code) { ListInput.state = this.state_code; } else { ListInput.state = ""; 


    if (this.state_codes) { ListInput.state = this.state_codes; } else { ListInput.state = ""; }

    ListInput.offset = 0
    ListInput.size = this.noofrecordsperpage

    this.InvoiceLevelMisData(ListInput);


    // for (let item in this.itemForm.controls) {

    //   if (this.itemForm.controls[item].value) {
    //     var Json = { "Key": item, "Value": this.itemForm.controls[item].value }

    //     this.Filterarray.push(Json)
    //   }
    // }

  }

  FilterStrings(ListInput) {
    debugger
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
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'invoice_status');

    if (this.isOrderdate == true) {
      var from_date1 = ListInput.from_date;
      var to_date1 = ListInput.to_date;
      var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
    }
    if (this.isInvoicedate == true) {
      var from_date1 = ListInput.invoice_from_date;
      var to_date1 = ListInput.invoice_to_date;
      var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'invoice_from_date');
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'invoice_to_date');
    }

    var Json1 = { "Key": 'from_date', "Value": finaldate }
    this.Filterarray.push(Json1)
  }

  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }
  // changeDateType(event){
  //   if (event.value == "Order Date") {
  //     this.showDateType = event.value;

  //   }
  //   if (event.value == "Tracking Date") {
  //     this.showDateType = event.value;


  //   }
  //   if (event.value == "Invoice Date") {
  //     this.showDateType = event.value;
  //   }
  //   this.BuildForm();




  // }
  reset() {
    // this.Division = []
    this.isDivisionVisible = false;

    this.currentPage = 1
    this.CustomerList.reset();
    this.DistributorList.reset();
    this.DivisionList.reset();
    this.itemForm.reset();
    this.BuildForm();
    // this.DistributorData = this.AllDistributorData
    // this.DistributorData[this.selectedDistributor].isChecked = false
    // this.Accountnamedata = this.Accountnamedata
    // this.Accountnamedata[this.selectedAccountname].isChecked = false
    this.Filterarray = [];
    this.Division = [];
     this.order_status="",
     this.otc_number = "",
      this.account_name = ""
      this.distributor_name = "",
      this.division_name = "",
      this.part_number = "",
      this.order_quantity = "",
      this.org_name = "",
      this.invoice_no = "",
      this.distributor_id = "",
      this.rating = "",
     // this.state_code = ""
      //this.state = "",
      this.state_code = "";
     this.state_name = "";
     // this.state_codes = "";
     // this.state_name = "";
     this.isInvoicedate = true;
     this.isOrderdate = false;
     this.isThirtydays = true;
    this.isToday = false;
   // this.isLastsevenDay = false;
    this.iscustomDate = false;
    this.ShowCustom = false;
    var d1 = new Date(); // today!
    var x1 = 30; // go back 5 days!
    d1.setDate(d1.getDate() - x1);

    this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
    this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    const ExportArrayInput: InputData = {} as InputData;
    ExportArrayInput.size = 5;
    this.GetDistributor(ExportArrayInput);

    const ExportArrayInput4: InputData2 = {} as InputData2;
    ExportArrayInput4.size = 5;
    this.GetAccount(ExportArrayInput4)

    const ExportArrayInput5: InputDat4 = {} as InputDat4;
    ExportArrayInput5.size = 5;
    this.GetStateData();
    //this.BuildForm();

    const ExportArrayInput1: Input = {} as Input;
    ExportArrayInput1.offset = 0
    ExportArrayInput1.size = this.noofrecordsperpage
    ExportArrayInput1.invoice_from_date = this.from_date
    ExportArrayInput1.invoice_to_date = this.to_date
    this.InvoiceLevelMisData(ExportArrayInput1)

  }

  Distributortype() {

    // this.distributor_id = ""
    // this.distributor_name = ""

    // const data1: InputData = {} as InputData;

    // data1.org_search_text = this.itemForm.value.org_name;
    // //.div_search_text = this.itemForm.value.div_name;
    // data1.size = 5;
    // this.GetDistributor(data1);
    // //this.Getdivision(data1);

    this.distributor_id = ""
    this.distributor_name = ""

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = this.itemForm.value.org_name;
    this.GetDistributor(data1);
  }
  dstfilteradd(row, event, index) {
    this.selectedDistributor = index

    this.DistributorData[index].isChecked = true

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
  AddPercentage(val1: any, val2: any) {

    var value1 = Number(val1)
    var value2 = Number(val2)
    var Total = value1 + value2
    var Output = ""
    if (Total == 0) {
      Output = ""
    }
    else {
      Output = (Total).toString() + '%'

    }


    return Output
  }

  total(val1: any, val2: any) {
    var value1 = Number(val1)
    var Value2 = Number(val2)
    return value1 + Value2


  }

  pageChange(page: any) {
    debugger
    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;

    const ListInput: Input = {} as Input;
    ListInput.offset = (page * 10);
    ListInput.size = this.noofrecordsperpage

    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }
    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }


    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.org_name) { ListInput.org_name = this.org_name; } else { ListInput.org_name = ""; }
    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
    if (this.order_quantity) { ListInput.order_quantity = this.order_quantity } else { ListInput.order_quantity; }
    if (this.invoice_no) { ListInput.invoice_no = this.invoice_no } else { ListInput.invoice_no; }
    if (this.order_status) { ListInput.order_status = this.order_status; } else { ListInput.order_status = ""; }

    if (this.status) { ListInput.status = this.status; } else { ListInput.status = ""; }

    if (this.isOrderdate == true) {
      if (this.orderFromDate) { ListInput.from_date = this.orderFromDate; } else { ListInput.from_date = ""; }
      if (this.orderToDate) { ListInput.to_date = this.orderToDate; } else { ListInput.to_date = ""; }
      if (this.invoice_from_date) { ListInput.invoice_from_date = this.invoice_from_date; } else { ListInput.invoice_from_date = ""; }
      if (this.invoice_to_date) { ListInput.invoice_to_date = this.invoice_to_date; } else { ListInput.invoice_to_date = ""; }
    }
    else if (this.isInvoicedate == true) {
      if (this.invoice_from_date == undefined && this.invoice_to_date == undefined) {
        if (this.from_date) { ListInput.invoice_from_date = this.from_date; } else { ListInput.invoice_from_date = ""; }
        if (this.to_date) { ListInput.invoice_to_date = this.to_date; } else { ListInput.invoice_to_date = ""; }
        if (this.orderFromDate) { ListInput.from_date = this.orderFromDate; } else { ListInput.from_date = ""; }
        if (this.orderToDate) { ListInput.to_date = this.orderToDate; } else { ListInput.to_date = ""; }
      }
      else {
        if (this.invoice_from_date) { ListInput.invoice_from_date = this.invoice_from_date; } else { ListInput.invoice_from_date = ""; }
        if (this.invoice_to_date) { ListInput.invoice_to_date = this.invoice_to_date; } else { ListInput.invoice_to_date = ""; }
        if (this.orderFromDate) { ListInput.from_date = this.orderFromDate; } else { ListInput.from_date = ""; }
        if (this.orderToDate) { ListInput.to_date = this.orderToDate; } else { ListInput.to_date = ""; }
      }
    }

    // if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }
    // if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }
    // if (this.invoice_from_date) { ListInput.invoice_from_date = this.from_date; } else { ListInput.invoice_from_date = ""; }
    // if (this.invoice_to_date) { ListInput.invoice_to_date = this.to_date; } else { ListInput.invoice_to_date = ""; }
    // if (this.state_code) { ListInput.state = this.state_code; } else { ListInput.state = ""; }

    if (this.state_codes) { ListInput.state = this.state_codes; } else { ListInput.state = ""; }
    this.InvoiceLevelMisData(ListInput);

  }

  orderDetailsModal: any;
  closeResult = ''
  TempDAta: any;
  orderInformations: any;
  otcOpen(row) {
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
            this.loader.close()
          }
        }
        else {
          this.loader.close()
        }
      }, (err) => {
        this.loader.close()
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

  ReportDownlod() {
    debugger;
    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
    //     if(this.totalrecord==0){
    //       Swal.fire("NO Data Found in Excel File");
    //     }else{
    const ListInput: Input = {} as Input;

    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

    if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }
    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
    if (this.order_quantity) { ListInput.order_quantity = this.order_quantity } else { ListInput.order_quantity; }
    if (this.invoice_no) { ListInput.invoice_no = this.invoice_no } else { ListInput.invoice_no; }
    if (this.order_status) { ListInput.order_status = this.order_status; } else { ListInput.order_status = ""; }

    if (this.status) { ListInput.status = this.status; } else { ListInput.status = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }
    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }
    if (this.invoice_from_date) { ListInput.invoice_from_date = this.from_date; } else { ListInput.invoice_from_date = ""; }
    if (this.invoice_to_date) { ListInput.invoice_to_date = this.to_date; } else { ListInput.invoice_to_date = ""; }

    if (this.state_codes) { ListInput.state = this.state_codes; } else { ListInput.state = ""; }
    ListInput.offset = 0
    ListInput.size = this.totalrecord;
    this.EDownload = ListInput;
    this.count = this.totalrecord;
    this.pageName = "invoiceDetailsMIS";
    let ngbModalOptions: NgbModalOptions = {
      backdrop: false,
      keyboard: false
    };
    this.modalService.open(this.ExcelDownload, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  //   }
  // }
  onRemoveFilter(filterString) {
    // let Filterarrays = this.Filterarray;

    // this.itemForm.reset();
    this.isDivisionVisible = false;

    if (filterString.Key == "otc_number") {
      this.itemForm.get("otc_number").setValue("")
    }
    else if (filterString.Key == "org_name") {
      this.Division = [];
      this.DistributorList.reset();
      this.distributor_id = "";
      this.distributor_name = "";
      this.itemForm.get('org_name').setValue("");
      const ExportArrayInput1: Input = {} as Input;
      ExportArrayInput1.size = 5;
      this.GetDistributor(ExportArrayInput1);
      this.division_id = "";
      this.division_name = "";
      this.DivisionList.reset();
    }
    else if (filterString.Key == "account_name") {
      this.CustomerList.reset();
      this.account_id = "";
      this.account_name = "";
      this.itemForm.get('account_name').setValue("");
      const data2: InputData2 = {} as InputData2;
      data2.size = 5;
      data2.account_name = this.itemForm.value.account_name;
      this.GetAccount(data2)
    }
    else if (filterString.Key == "part_number") {
      this.itemForm.get("part_number").setValue("")
    }
    else if (filterString.Key == "invoice_no") {
      this.itemForm.get("invoice_no").setValue("")
    }
    else if (filterString.Key == "division_name") {
      this.DivisionList.reset();
      this.division_name = '';
      this.division_id = ''
      this.itemForm.get('division_name').setValue("");
    }
    else if (filterString.Key == "order_quantity") {
      this.itemForm.get("order_quantity").setValue("")
    }
    else if (filterString.Key == "rating") {
      this.itemForm.get("rating").setValue("")
    }
    else if (filterString.Key == "status") {
      this.itemForm.get("status").setValue("")
    }
    else if (filterString.Key == "order_status") {
      this.itemForm.get("order_status").setValue("")
    }
    else if (filterString.Key == "state") {
      this.itemForm.get("state").setValue("")
    }
    // else if (filterString.Key == "invoice_no") {
    //   this.itemForm.get("invoice_no").setValue("")
    // }
    this.Search();
  }
}


// export interface Input {
//   state: any;
//   order_status: any;
//   invoice_no: any;
//   order_quantity: any;
//   part_number: any;
//   distributor_id: any;


//   org_name: String
//   offset: number
//   size: number
//   division_name: String
//   from_date: String
//   to_date: String
//   otc_number: String
//   account_name: String
//   status:any
//   days: String
//   to_percentage: String
//   from_percentage: String

// }
export interface Input {
  rating: any;
  from_date: String
  to_date: String
  invoice_no: any;


  part_number: String
  order_status: String
  otc_number: String
  state: String
  org_name: String
  division_name: String
  account_name: String
  status: String
  order_quantity: String
  statename: String
  distributor_id: any;
  distributor_name: String
  offset: number
  size: number;
  invoice_from_date: string;
  invoice_to_date: string;
}

export interface AllInput {
  otc_number: string
  from_date: string
  to_date: string
  divison_id: string
  offset: number
  org_name: string
  size: number;
  div_search_text: string;
  distributor_id: any;
  account_name: any;
}
export class InputData {
  size: number
  org_search_text: string
  distributor_id: any;
  div_search_text: string;
}

export class InputData1 {
  account_name: string
  cust_search_text: string
  size: number;
  distributor_id: string;
  div_search_text: string;
}

export class InputData2 {
  account_name: string;
  account_id: string;
  size: number;
  //cust_search_text: string
  account_namet: any;
}
export class InputData3 {

  div_name: string
  size: number;
  div_search_text: string


}
export class InputDat4 {
  dropdown_type: "state";
  multi_district: any;
  multi_taluka: any;
  multi_city: any;
  offset: 0;
  limit: 10000;
  state_name: string;
  state_code: string;
  size: number;
  state_search_text: string
}

export class InputOrderDetail {
  order_number: string
  otc_number: string;
}