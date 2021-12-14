import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
//import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbDate, NgbModule, NgbDatepicker, NgbDateAdapter, NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { ReportServicesService } from 'src/app/shared/Services/report-services.service';
import Swal from 'sweetalert2';
import { CommonService } from './../../../shared/Services/common-service.service'
import * as moment from 'moment';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delivery-time-line',
  templateUrl: './delivery-time-line.component.html',
  styleUrls: ['./delivery-time-line.component.scss']
})
export class DeliveryTimeLineComponent implements OnInit {
  //@ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  //@ViewChild(NgbdDatepicker) #d:NgbDatepicker
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>;

  public itemForm: FormGroup;
  myControl2 = new FormControl();
  myControl1 = new FormControl();
  Timelinesdata = new FormGroup({});
  DistributorList = new FormGroup({});
  CustomerList = new FormGroup({});
  DivisionList = new FormGroup({});
  //public AllDatefiler: FormGroup();

  account_name: String;
  currDiv: any;
  Division = [];

  distributor_name: any;
  DistributorData = [];
  filteredOptions: Observable<string[]>;


  AllFilters: any;
  filterValue: any;
  //filterValue1: any;
  filterValue2: any;
  divsion_name: any;
  filterValue1: string;
  //filter1Custname: any;
  filterValue3: string;
  options: any;


  org_name: String
  division_name: String;
  division_id: string;
  //to_percentage: string;
  // from_percentage: string;
  div_name: string;
  div_id: string;
  account_id: string;
  messageEvent: any;

  checkedcust = false;
  isDistDrpDownVisible: boolean;
  RoleName: any;
  DistCode: string;
  from_date: any;
  to_date: any;
  tab: number;

  ShowCustom: boolean;
  todaydate: boolean;
  sevenday: boolean;
  iscustomDate: boolean = false;
  isLastsevenDay: boolean = false;
  isToday: boolean = false;
  isThirtyDays: boolean;
  isDivisionVisible : boolean;
  showRecords:number;

  constructor(private OrderListService: OrderserviceService,
    private MISService: ReportServicesService,
    private modalService: NgbModal,
    private CommonService: CommonService,
    private datepipe: DatePipe,
    private dateAdapter: NgbDateAdapter<string>,
    private toastrService: ToastrService,
    private loader: AppLoaderService, private fb: FormBuilder,) { }

  items: any=[];
  // to_date: String
  // from_date: String
  currentPage: any;
  totalrecord: any;
  noofrecordsperpage: any;
  isCustomizerOpen: boolean = false;

  ngOnInit(): void {
    this.showRecords=10;

    const ExportArrayInput: InputData = {} as InputData;
    const ListInput1: AllInput = {} as AllInput;

    ExportArrayInput.size = 5;
    this.GetDistributor(ExportArrayInput);


    this.currentPage = 1

    this.noofrecordsperpage = 10;

    this.currDiv = "All"
    this.from_date = localStorage.getItem("FromDate");
    this.to_date = localStorage.getItem("ToDate");
    const ExportArrayInput1: Input = {} as Input;

    ExportArrayInput1.offset = 0
    ExportArrayInput1.size = this.noofrecordsperpage


    ExportArrayInput1.from_date = localStorage.getItem("FromDate");
    ExportArrayInput1.to_date = localStorage.getItem("ToDate");

    this.DeliveryTimeLineData(ExportArrayInput1)


    this.BuildForm();


    const ExportArrayInput2: InputData1 = {} as InputData1;
    ExportArrayInput2.size = 5;
    this.GetAccount(ExportArrayInput2)


    const ExportArrayInput3: InputData = {} as InputData
    ExportArrayInput3.size = 5;
    // this.Getdivision(ExportArrayInput3)




    this.isDistDrpDownVisible = true;
    this.isDivisionVisible = false;

    this.RoleName = this.CommonService.getRole();
    this.DistCode = this.CommonService.GetDistributorCode()
    // alert(this.DistCode);

    this.isThirtyDays = true;

    if (this.RoleName != "TML") {
      this.isDistDrpDownVisible = false;
      this.isDivisionVisible = true;
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
  private _filter1(value: string): string[] {

    this.filterValue3 = value;

    if (this.filterValue3 == "") {
      this.filterValue2 = null;
    }


    return this.options.filter(option => option.toLowerCase().includes(this.filterValue3));
  }




  DeliveryTimeLineData(ListInput: Input) {
    // this.loader.open();
    // this.TotalAllRecords = 0
    this.totalrecord = 0
    this.FilterStrings(ListInput);


    this.MISService.Deliverytimeline(ListInput).subscribe(

      data => {


        //this.loader.close();
        if (data.success == true) {
          //this.page.totalElements = data.rangeInfo.total_count;
          //this.TotalAllRecords = data.rangeInfo.total_count;
          this.totalrecord = data.rangeInfo.total_count;
          this.items = []
          this.items = data.data;
          this.showRecords=data.data.length;

          this.loader.close()
        }



        else {

          // this.page.totalElements = 0;

          this.items = [];
          this.loader.close();
          this.toastrService.error(data.data.msg)
          //
          // this.loader.close();
        }
      }, (err) => {

      }

    );




  }
  FilterString: any

  // FilterStrings(ListInput) {

  //   this.FilterString = "";
  //   // var FrmDate = this.datepipe.transform(ListInput.from_date, 'dd-MM-yyyy')
  //   // var todatea = this.datepipe.transform(ListInput.to_date, 'dd-MM-yyyy')
  //   //  var fromDateIn: any;
  //   // fromDateIn = this.dateAdapter.fromModel(ListInput.from_date)?.month;
  //   // let fromDate = moment({ y: this.dateAdapter.fromModel(ListInput.from_date)?.year, M: fromDateIn - 1, d: this.dateAdapter.fromModel(ListInput.from_date)?.day });
  //   // var FrmDate = new Date(fromDate.format("YYYY-MM-DD"));

  //   // var toDateIn: any;
  //   // toDateIn = this.dateAdapter.fromModel(ListInput.to_date)?.month;
  //   // let toDate = moment({ y: this.dateAdapter.fromModel(ListInput.to_date)?.year, M: toDateIn - 1, d: this.dateAdapter.fromModel(ListInput.to_date)?.day });
  //   // var todatea = new Date(toDate.format("YYYY-MM-DD"));
  //   var TimeLineName: any
  //   if (ListInput.days == 'today') { TimeLineName = "0-24 hours" }
  //   if (ListInput.days == 'two_days') { TimeLineName = "24-48 hours" }
  //   if (ListInput.days == 'three_days') { TimeLineName = "48-72 hours" }
  //   if (ListInput.days == 'long_time') { TimeLineName = "More than 72 hours" }
  //   if (ListInput.from_date == "" || ListInput.from_date == undefined || ListInput.from_date == null) {
  //   }
  //   else {
  //     this.FilterString = ' <b>From Date: </b>' + this.from_date;
  //   }


  //   if (ListInput.to_date == "" || ListInput.to_date == undefined || ListInput.to_date == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>To Date: </b>' + this.to_date; }


  //   if (ListInput.account_name == "" || ListInput.account_name == undefined || ListInput.account_name == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>Customer Name: </b>' + this.account_name; }


  //   if (ListInput.otc_number == "" || ListInput.otc_number == undefined || ListInput.otc_number == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>OTC Number: </b>' + ListInput.otc_number; }


  //   if (ListInput.org_name == "" || ListInput.org_name == undefined || ListInput.org_name == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>Distributor Name: </b>' + this.org_name; }


  //   if (ListInput.division_name == "" || ListInput.division_name == undefined || ListInput.division_name == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>Division Name: </b>' + this.division_name; }


  //   if (ListInput.from_percentage == "" || ListInput.from_percentage == undefined || ListInput.from_percentage == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>From Percentage: </b>' + this.from_percentage; }

  //   if (ListInput.to_percentage == "" || ListInput.to_percentage == undefined || ListInput.to_percentage == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>To Percentage: </b>' + this.to_percentage; }


  //   if (ListInput.days == "" || ListInput.days == undefined || ListInput.days == null) {
  //   } else { this.FilterString = this.FilterString + ' <b>Timelines: </b>' + TimeLineName; }


  // }

  filterMyOptions1(Event) {
    this.filterValue2 = Event;
  }

  calculateDate(date1, date2) {

    date1 = new Date(date1);
    date2 = new Date(date2);
    var diffc = date1.getTime() - date2.getTime();


    var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));


    return days;
  }
  distributor_id: any
  dstfilteradd(row, event, index) {
    // this.selectedDistributor = index

    // this.DistributorData[index].isChecked = true;
debugger;
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
          this.Division=[];
        }
      }
    }
    else {
      this.distributor_id ="";
      this.distributor_name = "";
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        this.DistributorList.get(field1).setValue(false);
        this.isDivisionVisible = false;
        this.Division=[];
      }
    }
  }
  // dstfilteradd(row, event) {

  //   this.distributor_id = row.distributor_id
  //   this.distributor_name = row.distributor_name

  //   if (event.target.checked) {
  //     for (const field1 in this.DistributorList.controls) { // 'field' is a string
  //       if (field1 == this.distributor_id) {
  //         this.DistributorList.get(field1).setValue(true);
  //       }
  //       else {
  //         this.DistributorList.get(field1).setValue(false);
  //       }

  //     }
  //   }

  //   else {
  //     for (const field1 in this.DistributorList.controls) { // 'field' is a string

  //       this.DistributorList.get(field1).setValue(false);


  //     }
  //   }

  //   this.Getdivision(row)
  // }

  timelinedata: any;

  tlfilteradd(row) {

    this.days = row;
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

          //     this.dataPreparation(data.data);

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

  divisiontype() {
    this.div_id = ""
    this.division_name = ""

    const data1: InputData3 = {} as InputData3;

    data1.size = 5;
    data1.div_search_text = this.itemForm.value.division_name;
    // this.Getdivision(data1);
  }

  // Custname: any
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

  filterMyOptions(Event) {
    this.myControl1.setValue('');

    this.filterValue = Event;

    const data: InputData = {} as InputData;


    data.distributor_id = Event;
    data.div_search_text = "";

    // this.Getdivision(data);
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

    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;

    const ListInput: Input = {} as Input;
    ListInput.offset = (page * 10);
    ListInput.size = this.noofrecordsperpage
    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }


    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

    if (this.days) { ListInput.days = this.days; } else { ListInput.days = ""; }

    if (this.to_percentage) { ListInput.to_percentage = this.to_percentage; } else { ListInput.to_percentage = ""; }

    if (this.from_percentage) { ListInput.from_percentage = this.from_percentage; } else { ListInput.from_percentage = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

    this.DeliveryTimeLineData(ListInput);
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  calculateDate1(Date1,date2){
    debugger
      Date1 = new Date(Date1);
      date2 = new Date(date2);
      var diffc = Date1.getTime() - date2.getTime();
     
      var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));
      
      return days;
    }
    onDateSelect(event) {
    
      let year = event.year;
      let month = event.month <= 9 ? '0' + event.month : event.month;;
      let day = event.day <= 9 ? '0' + event.day : event.day;;
      let finalDate = year + "-" + month + "-" + day;
      return finalDate
     }
  value:any
  days: any
  otc_number: any
  Filterarray: any = []
  to_percentage: any
  from_percentage: any

  Search() {
    this.currentPage = 1
    this.Filterarray = [];
    var a = this.DistributorList.valid;


    if (this.itemForm.value.to_percentage !== null) {
      if (this.itemForm.value.to_percentage !== "") {
        if (Number(this.itemForm.value.to_percentage) > 100) {
          Swal.fire("To Percentage should be less than or equal to 100");          return false
        }
      }
    }


    if (this.itemForm.value.from_percentage !== null) {
      if (this.itemForm.value.from_percentage !== "") {
        if (Number(this.itemForm.value.from_percentage) < 0) {
          Swal.fire("From Percentage should be greater than or equal to 0");
          return false
        }
        if (Number(this.itemForm.value.from_percentage) > 100) {
          Swal.fire("From Percentage should be Less than or equal to 100");
          return false
        }
      }
    }


    if (this.itemForm.value.from_percentage !== null && this.itemForm.value.to_percentage) {
      if (this.itemForm.value.from_percentage !== "" && this.itemForm.value.to_percentage !== "") {
        if (Number(this.itemForm.value.from_percentage) > Number(this.itemForm.value.to_percentage)) {
          Swal.fire("From Percentage  Should be less than To Percentage");
          return false
        }
      }
    }
    if (this.iscustomDate == true) {
      if (this.itemForm.value.from_date == null || this.itemForm.value.from_date == "" && this.itemForm.value.to_date !== null) {
        Swal.fire('Select From Date');
        const ListInput: Input = {} as Input;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");

        this.DeliveryTimeLineData(ListInput)
        return
      }
      else if (this.itemForm.value.from_date !== null && this.itemForm.value.to_date == null || this.itemForm.value.to_date == "") {
        Swal.fire('Select To Date');
        const ListInput: Input = {} as Input;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");
        this.DeliveryTimeLineData(ListInput)
        return
      }
      var d1 = moment(this.from_date).format('yyyy-MM-DD')
      var d2 = moment(this.to_date).format('yyyy-MM-DD')
      var days = this.calculateDate1(d1,d2);
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
        const ListInput: Input = {} as Input;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");

        this.DeliveryTimeLineData(ListInput)
        return
        
      }
      else if(days >= 95){
        Swal.fire(' Allow to get Only 95 Days Data');
        const ListInput: Input = {} as Input;
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.to_date = localStorage.getItem("ToDate");

        this.DeliveryTimeLineData(ListInput)
        return
      }
      let customfromdate = this.itemForm.value.from_date;
      let customtodate = this.itemForm.value.to_date
      this.from_date = this.onDateSelect(customfromdate)
      this.to_date = this.onDateSelect(customtodate)
    }
    else if (this.isLastsevenDay == true) {
      this.from_date = this.itemForm.value.from_date;
      this.to_date = this.itemForm.value.to_date
      this.from_date = moment(this.to_date).subtract(7, 'days').format('yyyy-MM-DD')
      this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
    }
    else if (this.isToday == true) {
      this.from_date = this.itemForm.value.from_date;
      this.to_date = this.itemForm.value.to_date
      this.from_date = moment(this.to_date).format('yyyy-MM-DD')
      this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
    }
    else if (this.isThirtyDays == true) {
      this.from_date = this.itemForm.value.from_date;
      this.to_date = this.itemForm.value.to_date
      this.from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
      this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
    }

    this.otc_number = this.itemForm.value.otc_number
    // this.account_name = this.itemForm.value.account_name
    // this.org_name = this.itemForm.value.org_name
    // this.divsion_name = this.itemForm.value.divsion_name


    // this.from_date = moment(this.from_date).format('yyyy-MM-DD')

    this.days = this.itemForm.value.days
    this.from_percentage = this.itemForm.value.from_percentage
    this.to_percentage = this.itemForm.value.to_percentage


    //  try
    // var fromDateIn: any;
    // fromDateIn = this.dateAdapter.fromModel(this.from_date)?.month;
    // let fromDate = moment({ y: this.dateAdapter.fromModel(this.from_date)?.year, M: fromDateIn - 1, d: this.dateAdapter.fromModel(this.from_date)?.day });
    // this.from_date = new Date(fromDate.format("YYYY-MM-DD"));

    // var toDateIn: any;
    // toDateIn = this.dateAdapter.fromModel(this.to_date)?.month;
    // let toDate = moment({ y: this.dateAdapter.fromModel(this.to_date)?.year, M: toDateIn - 1, d: this.dateAdapter.fromModel(this.to_date)?.day });
    // this.to_date = new Date(toDate.format("YYYY-MM-DD"));



    if (this.distributor_id != "") {
      // this.AllFilters.get('distributor_id').setValue(this.distributor_id);
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

    if (this.days == "today") {
      this.itemForm.get('days').setValue("0-24 hours");
    }
    else if (this.days == "two_days") {
      this.itemForm.get('days').setValue("24-48 hours");
    }
    else if (this.days == "three_days") {
      this.itemForm.get('days').setValue("48-72 hours");
    }
    else if (this.days == "long_time") {
      this.itemForm.get('days').setValue("More than 72 hours");
    }

    if (this.from_date) {
      this.itemForm.get('from_date').setValue(this.from_date);
    }
    if (this.to_date) {
      this.itemForm.get('to_date').setValue(this.to_date);
    }

    const ListInput: Input = {} as Input;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }


    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

    if (this.days) { ListInput.days = this.days; } else { ListInput.days = ""; }

    if (this.to_percentage) { ListInput.to_percentage = this.to_percentage; } else { ListInput.to_percentage = ""; }

    if (this.from_percentage) { ListInput.from_percentage = this.from_percentage; } else { ListInput.from_percentage = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

    ListInput.offset = 0
    ListInput.size = this.noofrecordsperpage

    this.DeliveryTimeLineData(ListInput);

    // for (let item in this.itemForm.controls) {

    //   if (this.itemForm.controls[item].value) {
    //     var Json = { "Key": item, "Value": this.itemForm.controls[item].value }

    //     this.Filterarray.push(Json)
    //   }
    // }
  }

  reset() {
    debugger;
    this.Division = [];
    this.currentPage = 1
    this.itemForm.reset();
    this.DistributorList.reset();
    this.DivisionList.reset();
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.otc_number = "";
    this.from_percentage = "";
    this.to_percentage = "";
    this.isLastsevenDay = false;
    this.isToday = false;
    this.iscustomDate = false;
    this.ShowCustom = false;
    this.isThirtyDays = true;
    this.distributor_name = "";
    this.distributor_id = "";
    this.account_name = "";
    this.division_name = "";
    this.org_name = "";
    this.days = "";
    var d1 = new Date();
    var x1 = 30;
    d1.setDate(d1.getDate() - x1);

    this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
    this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')

    const ExportArrayInput: InputData = {} as InputData;
    ExportArrayInput.size = 5;
    this.GetDistributor(ExportArrayInput);

    const ExportArrayInput2: InputData1 = {} as InputData1;
    ExportArrayInput2.size = 5;
    this.GetAccount(ExportArrayInput2)

    const ListInput: Input = {} as Input;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }


    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }

    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.org_name) { ListInput.org_name = this.org_name; } else { ListInput.org_name = ""; }

    if (this.days) { ListInput.days = this.days; } else { ListInput.days = ""; }

    if (this.to_percentage) { ListInput.to_percentage = this.to_percentage; } else { ListInput.to_percentage = ""; }

    if (this.from_percentage) { ListInput.from_percentage = this.from_percentage; } else { ListInput.from_percentage = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

    ListInput.offset = 0
    ListInput.size = this.noofrecordsperpage

    this.DeliveryTimeLineData(ListInput);


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

  Accountnamedata: any = []
  AccountnamedataOrignal;
  GetAccount(Data1) {
    // this.Accountnamedata = [];
    this.CommonService.AccountName(Data1).subscribe(
      data => {
        if (data.success == true) {

          this.Accountnamedata = [];
          ///  this.filterValue2 = null;
          this.AccountnamedataOrignal = data.data;
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

  custtype() {
    // //  alert("hii");
    this.account_name = "";
    //this.account_id="";
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

  BuildForm() {
    this.itemForm = this.fb.group({
      from_date: [localStorage.getItem("FromDate")],
      to_date: [localStorage.getItem("ToDate")],
      otc_number: [],
      account_name: [],
      distributor_name: [],
      division_name: [],
      days: [],
      to_percentage: [],
      from_percentage: [],
      org_name: [],
      Today: [],
      Custom: [],
      thirtyDays: [],
      Sevenday: [],
      Distributor_Id: [''],
      // Custom_from_date:[''],
      // Custom_to_date:[''],
    })
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
      this.isThirtyDays = false;
      this.isToday = false;
      this.iscustomDate = false;
      this.from_date = "";
      this.to_date = "";
      this.itemForm.patchValue({
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
      this.isThirtyDays = false;
      this.isToday = false;
      this.isLastsevenDay = false;
      this.from_date = "";
      this.to_date = "";
      this.itemForm.patchValue({
        Today: false,
        Custom: true,
        thirtyDays: false,
        Sevenday: false
      })
    }
  }

  orderDetailsModal: any;
  closeResult = ''
  TempDAta: any;
  orderInformations: any;
  details(row) {

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

  // resetFilterFeild(){
  //   this.AllFilters.reset();
  //   this.DistributorList.reset();
  //   this.DivisionList.reset();
  //   this.CustomerList.reset();
  //   this.BuildForm();
  //   this.Filterarray = [];
  //   this.status = "";
  //   this.otc_number = "";
  //   this.region = "";
  //   this.otc_number = "";
  //   this.status = "";
  //   this.region = "";
  //   this.state = "";
  //   this.district = "";
  //   this.city = "";
  //   this.distributor_name = "";
  //   this.account_name = "";
  //   this.division_name = "";
  //   this.distributor_id = "";
  //   this.division_id = "";
  //   this.order_no = "";
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

  //   const data2: InputData3 = {} as InputData3;
  //   data2.size = 5;
  //   this.GetAccount(data2);
  // }

  EDownload: any;
  count: any;
  pageName: any;

  ReportDownlod() {
    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
    //   if(this.totalrecord==0){
    //     Swal.fire("NO Data Found in Excel File")
    //   }else{
      const ListInput: Input = {} as Input;

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }
      if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }
      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }
      if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

      if (this.days) { ListInput.days = this.days; } else { ListInput.days = ""; }

      if (this.to_percentage) { ListInput.to_percentage = this.to_percentage; } else { ListInput.to_percentage = ""; }

      if (this.from_percentage) { ListInput.from_percentage = this.from_percentage; } else { ListInput.from_percentage = ""; }

      ListInput.offset = 0
      ListInput.size = this.totalrecord;

      this.EDownload = ListInput;
      this.count = this.totalrecord;
      this.pageName = "deliveryTimeLine";
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
    var from_date1 = ListInput.from_date;
    var to_date1 = ListInput.to_date;
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
    var finaldate = this.dateformate(from_date1) + ' '+ 'to' + ' ' + this.dateformate(to_date1);
    var Json1 = { "Key": 'from_date', "Value": finaldate }
    this.Filterarray.push(Json1)
  }
  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }
  onRemoveFilter(filterString) {
    this.isDivisionVisible =false;

    // let Filterarrays = this.Filterarray;

    // this.itemForm.reset();
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
    else if (filterString.Key == "from_percentage") {
      this.itemForm.get("from_percentage").setValue("")
    }
    else if (filterString.Key == "to_percentage") {
      this.itemForm.get("to_percentage").setValue("")
    }
    else if (filterString.Key == "division_name") {
      this.DivisionList.reset();
      this.division_name = '';
      this.division_id = ''
      this.itemForm.get('division_name').setValue("");
    }
    else if (filterString.Key == "days") {
      this.itemForm.get("days").setValue("")
    }
    
    // else if (filterString.Key == "invoice_no") {
    //   this.itemForm.get("invoice_no").setValue("")
    // }
    this.Search();
  }
}


export interface Input {
  // distributor_name: any;


  // org_name: String
  // offset: number
  // size: number
  // division_name: String
  // from_date: String
  // to_date: String
  // otc_number: String
  // account_name: String

  // days: String
  // to_percentage: String
  // from_percentage: String

  org_name: String
  division_name: String
  account_name: String
  offset: number
  size: number
  from_date: String
  to_date: String
  otc_number: String
  days: String
  to_percentage: String
  from_percentage: String;
  distributor_id: any;
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
//export class  NgbDatepickerModule{}

export class InputData2 {
  account_name: string;
  account_id: string;
  size: number;
  cust_search_text: string
}

export class InputData3 {

  div_name: string
  size: number;
  div_search_text: string

}

export class InputOrderDetail {
  order_number: string
  otc_number:string;
}