import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import Swal from 'sweetalert2';
import { CommonService } from './../../../shared/Services/common-service.service';
import * as moment from 'moment';
import { ListInput2 } from '../Cancle-List/cancle-list/cancle-list.component';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('failorderDetails', { read: TemplateRef, static: false }) failorderDetails: TemplateRef<any>;
  @ViewChild('EOrderDownload', { read: TemplateRef, static: false }) EOrderDownload: TemplateRef<any>;
  @ViewChild('invoicePopup', { read: TemplateRef, static: false }) invoicePopup: TemplateRef<any>;

  currDiv: any;
  currentPage: any
  totalrecord: any
  noofrecordsperpage: any;
  DistrictLists = new FormGroup({});
  StateLists = new FormGroup({});

  isdistributor: any;

  FromDate: string;
  ToDate: string;
  RoleName: string;
  DistCode: string;

  FinalTax = 0;
  FinallGros = 0

  public AllFilters: FormGroup;
  DistributorList = new FormGroup({});
  DivisionList = new FormGroup({});
  CustomerList = new FormGroup({});

  DistributorData: any = [];
  distributor_id: any;
  distributor_name: any;

  Division = [];
  division_name: any;
  division_id: any

  Accountnamedata: any = []
  AccountnamedataOrignal;
  account_name: any;
  account_id: any;

  ShowCustom: boolean;
  todaydate: boolean;
  sevenday: boolean;
  iscustomDate: boolean = false;
  isLastsevenDay: boolean = false;
  isToday: boolean = false;
  isThirtyDays: boolean;

  from_date: any;
  to_date: any;
  isDivisionVisible: boolean;

  showRecords: number;
  portal_order_number: any;
  otc_order_free_search: any;
  otc_number_search: string;
  Days: string;
  selected: any;
  state_code: string;

  constructor(
    private OrderListService: OrderserviceService,
    private CommonService: CommonService,
    private modalService: NgbModal,
    private loader: AppLoaderService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.currDiv = "e-order";
    this.currentPage = 1
    this.noofrecordsperpage = 10;
    this.showRecords = 10;
    this.from_date = localStorage.getItem("FromDate");
    this.to_date = localStorage.getItem("ToDate");

    this.RoleName = this.CommonService.getRole();
    this.DistCode = this.CommonService.GetDistributorCode()

    this.isdistributor = true;

    this.isThirtyDays = true;

    if (this.RoleName == "TML") {
      // this.ShowDate = true;
      this.isdistributor = false
      // this.isDistDrpDownVisible = false;
      this.isDivisionVisible = false;
    }
    else {
      const data: InputData2 = {} as InputData2;
      data.distributor_id = this.DistCode;
      data.div_search_text = "";

      this.Getdivision(data);
      this.isDivisionVisible = true;
    }

    this.BuildForm();

    const data: InputData = {} as InputData

    this.DistrictList(data)
   
   const data4: InputData3 = {} as InputData3;
  
   this.Getstatecode(data4)

    const ListInput2: InputOrder = {} as InputOrder;

    ListInput2.limit = 10;
    ListInput2.offset = 0;
    ListInput2.from_date = localStorage.getItem("FromDate");
    ListInput2.to_date = localStorage.getItem("ToDate");
    ListInput2.otc_number = "";
    ListInput2.otc_number_search = "";
    ListInput2.distributor_id = "";
    ListInput2.division_id = "";
    ListInput2.order_number = "";
    ListInput2.shipping_state = "";
    ListInput2.shiping_district = "";
    ListInput2.shipping_taluka = "";
    ListInput2.shipping_city = "";
    ListInput2.shipping_pincode = "";
    ListInput2.account_name = "";
    ListInput2.division_name = "";
    ListInput2.organization_name = "";
    ListInput2.order_status = "";
    ListInput2.order_type = "";
    ListInput2.channel = "ecommerce";
    ListInput2.dealer_state = "";
    ListInput2.dealer_region = "";
    this.GetOrderList(ListInput2);

    const data1: InputData = {} as InputData;
    data1.size = 5;
    data1.org_search_text = "";
    this.GetDistributor(data1);

    const data2: InputData3 = {} as InputData3;
    data2.size = 5;
    this.GetAccount(data2);

    const data3: InputPageCount = {} as InputPageCount;
    data3.page_type = "order_history";
    data3.from_date = localStorage.getItem("FromDate");
    data3.to_date = localStorage.getItem("ToDate");
    this.GetPageCount(data3);
  }

  BuildForm() {
    this.AllFilters = this.fb.group({
      otc_number: [''],
      status: [''],
      state: [''],
      district: [''],
      city: [],
      region: [],
      org_name: [''],
      account_name: [''],
      from_date: localStorage.getItem("FromDate"),
      to_date: localStorage.getItem("ToDate"),
      division_name: [''],
      order_number: [''],
      order_status: [''],
      Today: [],
      Custom: [],
      thirtyDays: [],
      Sevenday: [],
      otc_no_search: []
    })
  }

  tab: any = 1;
  onClick(check) {
    this.tab = check
    this.currentPage = 1
    if (this.tab == 1) {
      this.currDiv = "e-order"

      this.FromDate = localStorage.getItem("FromDate");
      this.ToDate = localStorage.getItem("ToDate");

      const ListInput2: InputOrder = {} as InputOrder;

      ListInput2.limit = 10;
      ListInput2.offset = 0;
      ListInput2.from_date = this.FromDate;
      ListInput2.to_date = this.ToDate;
      ListInput2.otc_number = "";
      ListInput2.otc_number_search = "";
      ListInput2.distributor_id = "";
      ListInput2.division_id = "";
      ListInput2.order_number = "";
      ListInput2.shipping_state = "";
      ListInput2.shiping_district = "";
      ListInput2.shipping_taluka = "";
      ListInput2.shipping_city = "";
      ListInput2.shipping_pincode = "";
      ListInput2.account_name = "";
      ListInput2.division_name = "";
      ListInput2.organization_name = "";
      ListInput2.order_status = "";
      ListInput2.order_type = "";
      ListInput2.channel = "ecommerce";
      ListInput2.dealer_state = "";
      ListInput2.dealer_region = "";

      this.Filterarray = [];
      this.resetFilterFeild();
      this.AllFilters.get("otc_no_search").setValue("")
      this.GetOrderList(ListInput2);



    }

    if (this.tab == 2) {
      this.currDiv = "CRMOrder"

      this.FromDate = localStorage.getItem("FromDate");
      this.ToDate = localStorage.getItem("ToDate");

      // const ListInput: Input = {} as Input;
      // ListInput.size = 10;
      // ListInput.offset = 0;
      // ListInput.account_id = "";
      // ListInput.distributor_id = "";
      // ListInput.division_id = "";
      // ListInput.order_type = "";
      // ListInput.from_date = this.FromDate;
      // ListInput.to_date = this.ToDate;
      // ListInput.channel = "siebel";
      // ListInput.otc_order_free_search = "";
      // ListInput.portal_order_number = "";
      // ListInput.action = "ForExcel"
      // ListInput.shipping_state = "";

      const ListInput2: InputOrder = {} as InputOrder;

      ListInput2.limit = 10;
      ListInput2.offset = 0;
      ListInput2.from_date = this.FromDate;
      ListInput2.to_date = this.ToDate;
      ListInput2.otc_number = "";
      ListInput2.otc_number_search = "";
      ListInput2.distributor_id = "";
      ListInput2.division_id = "";
      ListInput2.order_number = "";
      ListInput2.shipping_state = "";
      ListInput2.shiping_district = "";
      ListInput2.shipping_taluka = "";
      ListInput2.shipping_city = "";
      ListInput2.shipping_pincode = "";
      ListInput2.account_name = "";
      ListInput2.division_name = "";
      ListInput2.organization_name = "";
      ListInput2.order_status = "";
      ListInput2.order_type = "";
      ListInput2.channel = "siebel";
      ListInput2.dealer_state = "";
      ListInput2.dealer_region = "";

      this.Filterarray = [];
      this.resetFilterFeild();
      //this.resetALl();
      this.AllFilters.get("otc_no_search").setValue("")
      this.GetOrderList(ListInput2);
    }

    if (this.tab == 3) {
      this.currDiv = "HiRPM"
      this.FromDate = localStorage.getItem("FromDate");
      this.ToDate = localStorage.getItem("ToDate");

      // const ListInput: Input = {} as Input;
      // ListInput.size = 10;
      // ListInput.offset = 0;
      // ListInput.account_id = "";
      // ListInput.distributor_id = "";
      // ListInput.division_id = "";
      // ListInput.order_type = "";
      // ListInput.from_date = this.FromDate;
      // ListInput.to_date = this.ToDate;
      // ListInput.channel = "hirpm";
      // ListInput.otc_order_free_search = "";
      // ListInput.portal_order_number = "";
      // ListInput.action = ""
      // ListInput.shipping_state = "";
      // this.Filterarray = [];
      // this.HighRPMList(ListInput);

      const ListInput2: InputOrder = {} as InputOrder;

      ListInput2.limit = 10;
      ListInput2.offset = 0;
      ListInput2.from_date = this.FromDate;
      ListInput2.to_date = this.ToDate;
      ListInput2.otc_number = "";
      ListInput2.otc_number_search = "";
      ListInput2.distributor_id = "";
      ListInput2.division_id = "";
      ListInput2.order_number = "";
      ListInput2.shipping_state = "";
      ListInput2.shiping_district = "";
      ListInput2.shipping_taluka = "";
      ListInput2.shipping_city = "";
      ListInput2.shipping_pincode = "";
      ListInput2.account_name = "";
      ListInput2.division_name = "";
      ListInput2.organization_name = "";
      ListInput2.order_status = "";
      ListInput2.order_type = "";
      ListInput2.channel = "hirpm";
      ListInput2.dealer_state = "";
      ListInput2.dealer_region = "";

      this.Filterarray = [];
      this.resetFilterFeild();
      this.AllFilters.get("otc_no_search").setValue("")
      this.GetOrderList(ListInput2);

      // this.resetALl();
    }

    if (this.tab == 4) {
      this.currDiv = "InProcess"

      this.FromDate = localStorage.getItem("FromDate");
      this.ToDate = localStorage.getItem("ToDate");

      // this.Failorder_from_date = localStorage.getItem("FromDate");
      // this.Failorder_to_date = localStorage.getItem("ToDate");

      const ListInput1: FiledInput = {} as FiledInput;
      ListInput1.size = 10;
      ListInput1.offset = 0;
      ListInput1.order_from_date = this.FromDate;
      ListInput1.order_to_date = this.ToDate;
      ListInput1.otc_order_number = "";
      ListInput1.order_number = "";
      ListInput1.status = ["In-Process", "Partially Confirmed"];

      this.Filterarray = [];

      this.resetFilterFeild();
      this.AllFilters.get("otc_no_search").setValue("")
      this.GetFailuerList(ListInput1);

      // this.resetALl();
    }

    const data3: InputPageCount = {} as InputPageCount;
    data3.page_type = "order_history";
    data3.from_date = this.from_date;
    data3.to_date = this.to_date
    this.GetPageCount(data3);
  }
  Disnamedata: any = []
  DistrictList(Data1) {

    console.log(this.Disnamedata, "divs")

    this.CommonService.DistrictListName(Data1).subscribe(
      data => {
        if (data.success == true) {

          this.Disnamedata = [];


          this.Disnamedata = data.data.result;


          this.DistrictLists = new FormGroup({})
          for (let formModule of this.Disnamedata) {
            this.DistrictLists.addControl(formModule.district_name, new FormControl(false))
          }
        }
        else {

          this.loader.close();

        }
      }, (err) => {
        // this.loader.close();
      }
    );
  }
  // load() {
  //   return new Promise((resolve) => {
  //       this.Settings = this.httpGet('assets/mydata.json');
  //       resolve(true);
  //   });
// }
  rows = []
  HighRPMList(ListInput) {
    this.totalrecord = 0
    this.FilterStrings(ListInput);
    //this.loader.open();
    this.OrderListService.OrderList(ListInput).subscribe(
      data1 => {
        if (data1.success == true) {

          this.loader.close()
          this.totalrecord = data1.data.total_results;
          this.rows = data1.data.result;
          this.loader.close();
        }
        else {
          this.rows = [];
          this.loader.close()
          this.toastrService.error(data1.msg)
        }
      }, (err) => {
        this.loader.close();
      }
    );
  }

  rowFailed = []
  GetFailuerList(ListInput1) {

    this.totalrecord = 0;
    this.FilterStrings(ListInput1);
    this.loader.open();
    this.OrderListService.FailedOrderList(ListInput1).subscribe(
      data1 => {
        debugger
        if (data1.success == true) {
          this.totalrecord = data1.rangeInfo.total_row;
          //  this.items = data1.data.result;
          this.rowFailed = data1.data;
          this.ProgressCount = data1.rangeInfo.total_row;
          this.showRecords=data1.data.length

          this.loader.close();
        }
        else {
          this.rowFailed = [];
          this.loader.close()
          // this.toastrService.error(data1.msg)
          this.toastrService.error("Data Not Found")
        }
      }, (err) => {
        this.loader.close();
      }
    );
  }

  orderrow = []
  GetOrderList(ListInput2) {
    debugger;
    this.totalrecord = 0;
    this.FilterStrings(ListInput2);
//console.log(ListInput2)
   // this.loader.open();
    this.OrderListService.OtcOrderList(ListInput2).subscribe(
      data1 => {

        if (data1.success == true) {
          this.totalrecord = data1.total_result;
          this.showRecords=data1.data.length
          this.orderrow = data1.data;
         // console.log(this.orderrow)
         // this.loader.close();



          if (this.tab==1) {
            this.eDukaanCount = data1.total_result;
          }
          if (this.tab==2) {
            this.crmCount = data1.total_result;
          }
          if (this.tab==3) {
            this.hiRpmCount = data1.total_result;
          }
          if (this.tab==4) {
            this.ProgressCount = data1.total_result;
          }


         // this.PreapreData(data1.data);

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


          if (this.tab == 1) {
            this.eDukaanCount = 0;
          }
         if (this.tab == 2) {
            this.crmCount = 0;
          }
           if (this.tab == 3) {
            this.hiRpmCount = 0;
          }
         if (this.tab == 4) {
            this.ProgressCount = 0;
          }
          this.orderrow = [];
          //.loader.close()
          // this.toastrService.error(data1.data.msg)
          this.toastrService.error("Data Not Found")
        }
      }, (err) => {
        this.loader.close();
      }
    );
  }

  calculateTotal(row) {
    this.FinallGros = 0;
    var keys = Object.keys(row.total_line_items);
    var len = keys.length;
    if (len > 0) {
      for (let entry of row.total_line_items) {
        var Gross = entry.GROSS_AMOUNT;
        var Tax = entry.TOTAL_TAX_s;
        if (entry.GROSS_AMOUNT == undefined || entry.GROSS_AMOUNT == "" || entry.GROSS_AMOUNT == NaN) {
          Gross = 0;
        }
        if (entry.TOTAL_TAX_s == undefined || entry.TOTAL_TAX_s == "" || entry.TOTAL_TAX_s == NaN) {
          Tax = 0;
        }
        // this.FinalMrp = this.FinalMrp + Number(Mrp);
        this.FinalTax = this.FinalTax + Number(Tax);
        this.FinallGros = this.FinallGros + Number(Gross);
        // this.FinallGros = this.FinallGros + this.FinalTax;
      }
    }
    else {
      this.FinallGros = 0;
    }
    return this.FinallGros;
  }

  pageChange(page: any) {

    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;
    //currentPage  = this.totalrecord/10


    if (this.tab == 1) {
      this.currDiv = "e-order"

      const ListInput2: InputOrder = {} as InputOrder;

      if (this.to_date) { ListInput2.to_date = this.to_date; } else { ListInput2.to_date = ""; }

      if (this.from_date) { ListInput2.from_date = this.from_date; } else { ListInput2.from_date = ""; }

      if (this.otc_number) { ListInput2.otc_number = this.otc_number; } else { ListInput2.otc_number = ""; }
      if (this.status) { ListInput2.order_status = this.status; } else { ListInput2.order_status = ""; }
      if (this.region) { ListInput2.dealer_region = this.region; } else { ListInput2.dealer_region = ""; }
      if (this.state_code) { ListInput2.state_code = this.state_code; } else { ListInput2.state_code = ""; }
      if (this.district) { ListInput2.shiping_district = this.district; } else { ListInput2.shiping_district = ""; }
      if (this.city) { ListInput2.shipping_city = this.city; } else { ListInput2.shipping_city = ""; }

      if (this.account_name) { ListInput2.account_name = this.account_name; } else { ListInput2.account_name = ""; }

      if (this.distributor_name) { ListInput2.organization_name = this.distributor_name; } else { ListInput2.organization_name = ""; }

      if (this.distributor_id) { ListInput2.distributor_id = this.distributor_id; } else { ListInput2.distributor_id = ""; }

      if (this.division_name) { ListInput2.division_name = this.division_name; } else { ListInput2.division_name = ""; }

      ListInput2.offset = (page * 10);
      ListInput2.limit = this.noofrecordsperpage
      ListInput2.channel = "ecommerce"

      this.GetOrderList(ListInput2);

    }

    if (this.tab == 2) {
      this.currDiv = "CRMOrder"

      const ListInput: InputOrder = {} as InputOrder;

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }
      if (this.status) { ListInput.order_status = this.status; } else { ListInput.order_status = ""; }
      if (this.region) { ListInput.dealer_region = this.region; } else { ListInput.dealer_region = ""; }
      if (this.state_code) { ListInput.state_code = this.state_code; } else { ListInput.state_code = ""; }
      if (this.district) { ListInput.shiping_district = this.district; } else { ListInput.shiping_district = ""; }
      if (this.city) { ListInput.shipping_city = this.city; } else { ListInput.shipping_city = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

      if (this.distributor_name) { ListInput.organization_name = this.distributor_name; } else { ListInput.organization_name = ""; }

      if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

      if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

      ListInput.offset = (page * 10);
      ListInput.limit = this.noofrecordsperpage
      ListInput.channel = "siebel"

      this.GetOrderList(ListInput);
    }

    if (this.tab == 3) {
      this.currDiv = "HiRPM"

      const ListInput: InputOrder = {} as InputOrder;

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }
      if (this.status) { ListInput.order_status = this.status; } else { ListInput.order_status = ""; }
      if (this.region) { ListInput.dealer_region = this.region; } else { ListInput.dealer_region = ""; }
      if (this.state_code) { ListInput.state_code = this.state_code; } else { ListInput.state_code = ""; }
      if (this.district) { ListInput.shiping_district = this.district; } else { ListInput.shiping_district = ""; }
      if (this.city) { ListInput.shipping_city = this.city; } else { ListInput.shipping_city = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

      if (this.distributor_name) { ListInput.organization_name = this.distributor_name; } else { ListInput.organization_name = ""; }

      if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

      if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

      ListInput.offset = (page * 10);
      ListInput.limit = this.noofrecordsperpage
      ListInput.channel = "hirpm"

      this.GetOrderList(ListInput);

    }

    if (this.tab == 4) {
      this.currDiv = "InProcess"
      debugger;
      const ListInput1: FiledInput = {} as FiledInput;

      if (this.from_date) { ListInput1.order_from_date = this.from_date; } else { ListInput1.order_from_date = ""; }

      if (this.to_date) { ListInput1.order_to_date = this.to_date; } else { ListInput1.order_to_date = ""; }

      if (this.order_no) { ListInput1.order_number = this.order_no; } else { ListInput1.order_number = ""; }

      if (this.distributor_name) { ListInput1.org_name = this.distributor_name; } else { ListInput1.org_name = ""; }

      if (this.distributor_id) { ListInput1.distributor_id = this.distributor_id; } else { ListInput1.distributor_id = ""; }

      if (this.division_name) { ListInput1.division_name = this.division_name; } else { ListInput1.division_name = ""; }

      if (this.status) { ListInput1.status = this.status; } else { ListInput1.status = ""; }

      if (this.status != "") {
        if (this.status) { ListInput1.status = this.status; } else { ListInput1.status = ""; }
      }
      else {
        ListInput1.status = ["In-Process", "Partially Confirmed"];
      }

      ListInput1.offset = (page * 10);
      ListInput1.limit = this.noofrecordsperpage;
      this.GetFailuerList(ListInput1);

    }

  }

  // StateData: any;
  // GetStateData() {
  //   this.StateData = []

  //   var Json = {
  //     "dropdown_type": "state",
  //     "multi_district": [],
  //     "multi_taluka": [],
  //     "multi_city": [],
  //     "offset": 0,
  //     "limit": 10000
  //   }

  //   this.CommonService.GetstateNew(Json).subscribe(
  //     data => {
  //       if (data.success == true) {
  //         for (let entry of data.data.States) {

  //           if (entry.state_code != undefined) {
  //             this.StateData.push(entry)
  //           }
  //         }
  //       }
  //       else {
  //       }
  //     }, (err) => {

  //     }
  //   );
  // }
  statenamedata: any[]
  Getstatecode(Data1) {
    this.statenamedata = [];


    this.CommonService.Getstatecode(Data1).subscribe(
      data => {
        if (data.success == true) {
          this.statenamedata = data.data.result

          console.log(this.statenamedata)

          this.StateLists = new FormGroup({})
          for (let formModule of this.statenamedata) {
            this.StateLists.addControl(formModule.state_code, new FormControl(false))
          }
        }
        else {

          this.loader.close();

        }
      }, (err) => {
        // this.loader.close();
      }
    );


  }

  onChange(deviceValue) {
    console.log(deviceValue);
    const data2: InputData2 = {} as InputData2;
    var jsonn = { "multi_zone": this.selected, "multi_state": [deviceValue], "size": 100 }
    this.DistrictList(jsonn)
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

      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        if (field1 == this.distributor_id) {
          this.DistributorList.get(field1).setValue(true);
          this.isDivisionVisible = true;
          const data: InputData2 = {} as InputData2;
          data.distributor_id = this.distributor_id;
          data.div_search_text = "";
          this.Getdivision(data);
        }
        else {
          this.DistributorList.get(field1).setValue(false);
          this.Division = [];
        }
      }
      // const data: InputData2 = {} as InputData2;
      // data.distributor_id = this.distributor_id;
      // data.div_search_text = "";
      // this.Getdivision(data);
    }
    else {
      this.distributor_id = "";
      this.distributor_name = "";
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        this.DistributorList.get(field1).setValue(false);
        this.Division = [];
        this.isDivisionVisible = false;
      }

      // const data: InputData2 = {} as InputData2;
      // data.distributor_id = this.distributor_id;
      // data.div_search_text = "";
      // this.Getdivision(data);
    }
    // this.Getdivision(row)

  }

  Distributortype() {

    this.distributor_id = ""
    this.distributor_name = ""

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = this.AllFilters.value.org_name;

    this.GetDistributor(data1);
  }

  Getdivision(Data1) {
    this.CommonService.DivisionList(Data1).subscribe(
      data => {
        if (data.success == true) {
          this.Division = [];
          this.Division = data.data.result;
          this.DivisionList = new FormGroup({})
          for (let formModule of this.Division) {
            this.DivisionList.addControl(formModule.div_id, new FormControl(false))
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
      this.division_name = ""
      this.division_id = ""
      for (const field1 in this.DivisionList.controls) { // 'field' is a string

        this.DivisionList.get(field1).setValue(false);
      }
    }

  }

  // divisionfilteradd(row, event) {
  //   this.division_name = row.div_name
  //   this.division_id = row.div_id
  //   let distribution = row.distributor_id
  //   console.log(this.division_id)
  //   console.log(row)
  //   console.log(distribution)
  //   if (event.target.checked) {
  //     console.log('checked')
  //     console.log(this.DivisionList.controls)
  //     for (const field1 in this.DivisionList.controls) { // 'field' is a string
  //       console.log(field1, 'Hii')
  //       if (field1 == this.division_id) {
  //         this.DivisionList.get(field1).setValue(false);
  //       }
  //       else {
  //         this.DivisionList.get(field1).setValue(true);
  //       }
  //     }
  //   }
  //   else {
  //     for (const field1 in this.DivisionList.controls) { // 'field' is a string
  //       this.DivisionList.get(field1).setValue(false);
  //     }
  //   }
  // }

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
    this.account_name = "";
    const data2: InputData3 = {} as InputData3;
    data2.size = 5;
    data2.account_name = this.AllFilters.value.account_name;
    this.GetAccount(data2)
  }

  filterMyOptionsCustname(row, event) {
    this.account_id = row.account_id;
    this.account_name = row.account_name;
    if (event.target.checked) {
      for (const field1 in this.CustomerList.controls) {
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

  changedatefilter(Value) {
    if (Value == 'Today') {
      this.ShowCustom = false;
      this.isToday = true;
      this.isThirtyDays = false;
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
      this.AllFilters.patchValue({
        Today: false,
        Custom: true,
        thirtyDays: false,
        Sevenday: false
      })
    }
  }

  orderDetailsModal: any;
  closeResult: string;
  TempDAta: any;
  orderInformations: any;
  details(row) {
    this.loader.open()
    debugger
    this.TempDAta = [];

    console.log(row)

    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.otc_number = row.otc_number;
    // var json = row.otc_number;
    this.OrderListService.OtcOrderDetails(ListInput1).subscribe(
      data => {
        debugger
        if (data.success == true) {
          this.loader.close()
          // if (data.data.order_line_items > 0) {
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
          // }
          // else {
          //   Swal.fire('Please Check Details After Some Time');
          //   this.loader.close()
          // }
        }
        else {
          this.loader.close()
        }
      }, (err) => {
      }
    );
  }



  // details1(row) {
  //   this.loader.open()
  //   debugger
  //   this.TempDAta = [];

  //   const ListInput1: InputOrderDetail = {} as InputOrderDetail;
  //   ListInput1.otc_order_free_search = row.otc_order_free_search;
  //   // var json = row.otc_number;
  //   this.OrderListService.OtcOrderDetails(ListInput1).subscribe(
  //     data => {
  //       debugger
  //       if (data.success == true) {
  //         this.loader.close()
  //         // if (data.data.order_line_items > 0) {
  //         this.TempDAta = data.data[0];
  //         this.orderInformations = this.TempDAta
  //         let ngbModalOptions: NgbModalOptions = {
  //           backdrop: true,
  //           keyboard: true
  //         };
  //         this.modalService.open(this.orderDetails, ngbModalOptions).result.then((result) => {
  //           this.closeResult = `Closed with: ${result}`;
  //         }, (reason: any) => {
  //           this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //         });
  //         // }
  //         // else {
  //         //   Swal.fire('Please Check Details After Some Time');
  //         //   this.loader.close()
  //         // }
  //       }
  //       else {
  //         this.loader.close()
  //       }
  //     }, (err) => {
  //     }
  //   );
  // }

  clickCrmOrder(row) {
    debugger
    this.loader.open()

    this.TempDAta = [];

    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.order_number = row.order_number;

    this.OrderListService.OtcOrderDetails(ListInput1).subscribe(
      data => {
        if (data.success == true) {
          this.loader.close()
          // if (data.data.result[0].line_items.length > 0) {
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
          // }
          // else {
          //   Swal.fire('Please Check Details After Some Time');
          //   this.loader.close()
          // }
        }
        else {
          this.loader.close()
        }
      }, (err) => {
      }
    );
  }

  statefilteradd(row) {
    this.state_name = row.state_name;
  }

  
  ngAfterViewInit() {
    debugger


    this.CommonService.getJSON().subscribe(data => {
      console.log(data)
      this.Days = data.Days;


    });
  }
 
  
  state_name: any;
  otc_number: any;
  status: any;
  region: any;
  state: any;
  district: any;
  city: any;
  order_no: any;
  Filterarray: any = []

  Search() {
    debugger;
    this.Filterarray = [];
    this.currentPage = 1

    if (this.tab == 1) {
      this.otc_number = this.AllFilters.value.otc_number;
      this.status = this.AllFilters.value.status;
      this.region = this.AllFilters.value.region;
      this.state_code = this.AllFilters.value.state_code;
      this.district = this.AllFilters.value.district;
      this.city = this.AllFilters.value.city;

      if (this.iscustomDate == true) {
        if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
          Swal.fire('Select From Date');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
          //ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
          Swal.fire('Select To Date');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
          //ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
        var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1,d2);
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
         // ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
          
        }
        else if(this.CommonService.getDatevalidation(this.AllFilters.value.from_date, this.AllFilters.value.to_date)){
        //  Swal.fire(' Allow to get Only 95 Days Data');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
         // ListInput.cr_request_type = "order_cancellation"
         }
          else{
         Swal.fire(this.Days + ' Please select the date range up to 95 days ');
          this.GetOrderList(ListInput)
          return
         
        }

        this.from_date = this.AllFilters.value.from_date;
        this.to_date = this.AllFilters.value.to_date;
        this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
        this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
      }
      else if (this.isLastsevenDay == true) {
        this.from_date = moment(this.to_date).subtract(7, 'days').format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }
      else if (this.isToday == true) {
        this.from_date = moment(this.to_date).format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }
      else if (this.isThirtyDays == true) {
        this.from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }

      if (this.from_date) {
        this.AllFilters.get('from_date').setValue(this.from_date);
      }
      if (this.to_date) {
        this.AllFilters.get('to_date').setValue(this.to_date);
      }

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

      if (this.division_id != "") {
        this.AllFilters.get('division_name').setValue(this.division_name);
      }

      const ListInput2: InputOrder = {} as InputOrder;

      if (this.to_date) { ListInput2.to_date = this.to_date; } else { ListInput2.to_date = ""; }

      if (this.from_date) { ListInput2.from_date = this.from_date; } else { ListInput2.from_date = ""; }


      if (this.otc_number) { ListInput2.otc_number = this.otc_number; } else { ListInput2.otc_number = ""; }
      if (this.status) { ListInput2.order_status = this.status; } else { ListInput2.order_status = ""; }
      if (this.region) { ListInput2.dealer_region = this.region; } else { ListInput2.dealer_region = ""; }
      if (this.state_code) { ListInput2.shipping_state = this.state_code; } else { ListInput2.shipping_state = ""; }
      if (this.district) { ListInput2.shiping_district = this.district; } else { ListInput2.shiping_district = ""; }
      if (this.city) { ListInput2.shipping_city = this.city; } else { ListInput2.shipping_city = ""; }

      // if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

      if (this.account_name) { ListInput2.account_name = this.account_name; } else { ListInput2.account_name = ""; }

      if (this.distributor_name) { ListInput2.organization_name = this.distributor_name; } else { ListInput2.organization_name = ""; }

      if (this.distributor_id) { ListInput2.distributor_id = this.distributor_id; } else { ListInput2.distributor_id = ""; }

      if (this.division_name) { ListInput2.division_name = this.division_name; } else { ListInput2.division_name = ""; }

      ListInput2.offset = 0
      ListInput2.limit = this.noofrecordsperpage
      ListInput2.channel = "ecommerce"

      this.GetOrderList(ListInput2);



      // const data3: InputPageCount = {} as InputPageCount;
      // data3.page_type = "order_history";
      // data3.from_date = this.from_date;
      // data3.to_date = this.to_date
      // this.GetPageCount(data3);
      // for (let item in this.AllFilters.controls) {

      //   if (this.AllFilters.controls[item].value) {
      //     var Json = { "Key": item, "Value": this.AllFilters.controls[item].value }

      //     this.Filterarray.push(Json)
      //   }
      // }
    }
    else if (this.tab == 2) {
      this.otc_number = this.AllFilters.value.otc_number;
      this.status = this.AllFilters.value.status;
      this.region = this.AllFilters.value.region;
      this.state_code = this.AllFilters.value.state;
      this.district = this.AllFilters.value.district;
      this.city = this.AllFilters.value.city;

      if (this.iscustomDate == true) {
        if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
          Swal.fire('Select From Date');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
          //ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
          Swal.fire('Select To Date');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
          //ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
        var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1,d2);
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
         // ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
          
        }
        else if(days >= 95){
          Swal.fire(' "Please select the date range up to 95 days"');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
         // ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        this.from_date = this.AllFilters.value.from_date;
        this.to_date = this.AllFilters.value.to_date;
        this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
        this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
      }
      else if (this.isLastsevenDay == true) {
        this.from_date = moment(this.to_date).subtract(7, 'days').format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }
      else if (this.isToday == true) {
        this.from_date = moment(this.to_date).format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }
      else if (this.isThirtyDays == true) {
        this.from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }

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

      if (this.division_id != "") {
        this.AllFilters.get('division_name').setValue(this.division_name);
      }

      if (this.from_date) {
        this.AllFilters.get('from_date').setValue(this.from_date);
      }

      if (this.to_date) {
        this.AllFilters.get('to_date').setValue(this.to_date);
      }

      const ListInput: InputOrder = {} as InputOrder;

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }
      if (this.status) { ListInput.order_status = this.status; } else { ListInput.order_status = ""; }
      if (this.region) { ListInput.dealer_region = this.region; } else { ListInput.dealer_region = ""; }
      if (this.state_code) { ListInput.shipping_state = this.state_code; } else { ListInput.shipping_state = ""; }
      if (this.district) { ListInput.shiping_district = this.district; } else { ListInput.shiping_district = ""; }
      if (this.city) { ListInput.shipping_city = this.city; } else { ListInput.shipping_city = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

      if (this.distributor_name) { ListInput.organization_name = this.distributor_name; } else { ListInput.organization_name = ""; }

      if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

      if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

      ListInput.offset = 0
      ListInput.limit = this.noofrecordsperpage
      ListInput.channel = "siebel"

      this.GetOrderList(ListInput);

      // for (let item in this.AllFilters.controls) {

      //   if (this.AllFilters.controls[item].value) {
      //     var Json = { "Key": item, "Value": this.AllFilters.controls[item].value }

      //     this.Filterarray.push(Json)
      //     console.log(Json)
      //   }
      // }
      // const data3: InputPageCount = {} as InputPageCount;
      // data3.page_type = "order_history";
      // data3.from_date = this.from_date;
      // data3.to_date = this.to_date
      // this.GetPageCount(data3);
    }
    else if (this.tab == 3) {
      this.otc_number = this.AllFilters.value.otc_number;
      this.status = this.AllFilters.value.status;
      this.region = this.AllFilters.value.region;
      this.state_code = this.AllFilters.value.state_code;
      this.district = this.AllFilters.value.district;
      this.city = this.AllFilters.value.city;

      if (this.iscustomDate == true) {
        if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
          Swal.fire('Select From Date');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.GetOrderList(ListInput)
          return
        }
        else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
          Swal.fire('Select To Date');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
          //ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
        var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1,d2);
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
         // ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
          
        }
        else if(days >= 95){
          Swal.fire('"Please select the date range up to 95 days"');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
         // ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        this.from_date = this.AllFilters.value.from_date;
        this.to_date = this.AllFilters.value.to_date;
        this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
        this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
      }
      else if (this.isLastsevenDay == true) {
        this.from_date = moment(this.to_date).subtract(7, 'days').format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }
      else if (this.isToday == true) {
        this.from_date = moment(this.to_date).format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }
      else if (this.isThirtyDays == true) {
        this.from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }

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

      if (this.division_id != "") {
        this.AllFilters.get('division_name').setValue(this.division_name);
      }

      if (this.from_date) {
        this.AllFilters.get('from_date').setValue(this.from_date);
      }

      if (this.to_date) {
        this.AllFilters.get('to_date').setValue(this.to_date);
      }

      const ListInput: InputOrder = {} as InputOrder;

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }
      if (this.status) { ListInput.order_status = this.status; } else { ListInput.order_status = ""; }
      if (this.region) { ListInput.dealer_region = this.region; } else { ListInput.dealer_region = ""; }
      if (this.state_code) { ListInput.shipping_state = this.state_code; } else { ListInput.shipping_state = ""; }
      if (this.district) { ListInput.shiping_district = this.district; } else { ListInput.shiping_district = ""; }
      if (this.city) { ListInput.shipping_city = this.city; } else { ListInput.shipping_city = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

      if (this.distributor_name) { ListInput.organization_name = this.distributor_name; } else { ListInput.organization_name = ""; }

      if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

      if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

      ListInput.offset = 0
      ListInput.limit = this.noofrecordsperpage
      ListInput.channel = "hirpm"

      // this.HighRPMList(ListInput);
      this.GetOrderList(ListInput);


      // for (let item in this.AllFilters.controls) {

      //   if (this.AllFilters.controls[item].value) {
      //     var Json = { "Key": item, "Value": this.AllFilters.controls[item].value }

      //     this.Filterarray.push(Json)
      //   }
      // }
    }
    else if (this.tab == 4) {

      this.order_no = this.AllFilters.value.order_number;
      this.status = this.AllFilters.value.order_status;

      if (this.iscustomDate == true) {
        if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
          Swal.fire('Select From Date');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
          //ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
          Swal.fire('Select To Date');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
          //ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
        var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1,d2);
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
         // ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
          
        }
        else if(days >= 95){
          Swal.fire(' "Please select the date range up to 95 days"');
          const ListInput: ListInput2 = {} as ListInput2;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");
         // ListInput.cr_request_type = "order_cancellation"
          this.GetOrderList(ListInput)
          return
        }
        this.from_date = this.AllFilters.value.from_date;
        this.to_date = this.AllFilters.value.to_date;
        this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
        this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
      }
      else if (this.isLastsevenDay == true) {
        this.from_date = moment(this.to_date).subtract(7, 'days').format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }
      else if (this.isToday == true) {
        this.from_date = moment(this.to_date).format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }
      else if (this.isThirtyDays == true) {
        this.from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
        this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
      }

      if (this.distributor_id != "") {
        // this.AllFilters.get('distributor_id').setValue(this.distributor_id);
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }
      else {
        this.distributor_name = this.AllFilters.value.org_name;
        // this.AllFilters.get('distributor_id').setValue('');
        this.AllFilters.get('org_name').setValue(this.distributor_name);
      }

      if (this.division_id != "") {
        this.AllFilters.get('division_name').setValue(this.division_name);
      }

      if (this.from_date) {
        this.AllFilters.get('from_date').setValue(this.from_date);
      }

      if (this.to_date) {
        this.AllFilters.get('to_date').setValue(this.to_date);
      }

      const ListInput1: FiledInput = {} as FiledInput;

      if (this.to_date) { ListInput1.order_to_date = this.to_date; } else { ListInput1.order_to_date = ""; }

      if (this.from_date) { ListInput1.order_from_date = this.from_date; } else { ListInput1.order_from_date = ""; }


      if (this.order_no) { ListInput1.order_number = this.order_no; } else { ListInput1.order_number = ""; }

      if (this.distributor_name) { ListInput1.org_name = this.distributor_name; } else { ListInput1.org_name = ""; }

      if (this.distributor_id) { ListInput1.distributor_id = this.distributor_id; } else { ListInput1.distributor_id = ""; }

      if (this.division_name) { ListInput1.division_name = this.division_name; } else { ListInput1.division_name = ""; }

      if (this.status != "") {
        if (this.status) { ListInput1.status = this.status; } else { ListInput1.status = ""; }
      }
      else {
        ListInput1.status = ["In-Process"];
      }

      ListInput1.offset = 0
      ListInput1.limit = this.noofrecordsperpage

      this.GetFailuerList(ListInput1);

      // for (let item in this.AllFilters.controls) {

      //   if (this.AllFilters.controls[item].value) {
      //     var Json = { "Key": item, "Value": this.AllFilters.controls[item].value }

      //     this.Filterarray.push(Json)
      //   }
      // }
    }

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
    if (this.tab == 4) {
      this.from_date1 = ListInput.order_from_date;
      this.to_date1 = ListInput.order_to_date;
      var finaldate = this.dateformate(this.from_date1) + ' ' + 'to' + ' ' + this.dateformate(this.to_date1);
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'order_from_date');
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'order_to_date');
    }
    else {
      this.from_date1 = ListInput.from_date;
      this.to_date1 = ListInput.to_date;
      var finaldate = this.dateformate(this.from_date1) + ' ' + 'to' + ' ' + this.dateformate(this.to_date1);
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
    }

    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'distributor_id');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'limit');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'channel');

    if (this.status == "") {
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'status');
    }

    var Json1 = { "Key": 'from_date', "Value": finaldate }
    this.Filterarray.push(Json1)
  }

  from_date1: any;
  to_date1: any;
  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
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

  faildata: any;
  failedClick(row) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: true,
      keyboard: true
    };
    this.faildata = row;
    this.modalService.open(this.failorderDetails, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  resetALl() {
    debugger;
    this.isDivisionVisible = false;

    this.currentPage = 1
    this.AllFilters.reset();
    this.DistributorList.reset();
    this.DivisionList.reset();
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.status = "";
    this.otc_number = "";
    this.region = "";
    this.otc_number = "";
    this.status = "";
    this.region = "";
    this.state = "";
    this.district = "";
    this.city = "";
    this.distributor_name = "";
    this.account_name = "";
    this.division_name = "";
    this.distributor_id = "";
    this.division_id = "";
    this.order_no = "";
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

    const data2: InputData3 = {} as InputData3;
    data2.size = 5;
    this.GetAccount(data2);

    // const data: InputData2 = {} as InputData2;
    // data.distributor_id =  "";
    // data.div_search_text = "";
    // this.Getdivision(data);

    const data3: InputPageCount = {} as InputPageCount;
    data3.page_type = "order_history";
    data3.from_date = this.from_date;
    data3.to_date = this.to_date
    this.GetPageCount(data3);

    if (this.tab == 1) {
      this.currDiv = "e-order"

      const ListInput2: InputOrder = {} as InputOrder;

      if (this.to_date) { ListInput2.to_date = this.to_date; } else { ListInput2.to_date = ""; }

      if (this.from_date) { ListInput2.from_date = this.from_date; } else { ListInput2.from_date = ""; }

      if (this.otc_number) { ListInput2.otc_number = this.otc_number; } else { ListInput2.otc_number = ""; }
      if (this.status) { ListInput2.order_status = this.status; } else { ListInput2.order_status = ""; }
      if (this.region) { ListInput2.dealer_region = this.region; } else { ListInput2.dealer_region = ""; }
      if (this.state) { ListInput2.shipping_state = this.state; } else { ListInput2.shipping_state = ""; }
      if (this.district) { ListInput2.shiping_district = this.district; } else { ListInput2.shiping_district = ""; }
      if (this.city) { ListInput2.shipping_city = this.city; } else { ListInput2.shipping_city = ""; }

      // if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

      if (this.account_name) { ListInput2.account_name = this.account_name; } else { ListInput2.account_name = ""; }

      if (this.distributor_name) { ListInput2.organization_name = this.distributor_name; } else { ListInput2.organization_name = ""; }

      if (this.distributor_id) { ListInput2.distributor_id = this.distributor_id; } else { ListInput2.distributor_id = ""; }

      if (this.division_name) { ListInput2.division_name = this.division_name; } else { ListInput2.division_name = ""; }

      ListInput2.offset = 0
      ListInput2.limit = this.noofrecordsperpage
      ListInput2.channel = "ecommerce"

      this.GetOrderList(ListInput2);
    }

    else if (this.tab == 2) {
      const ListInput: Input = {} as Input;

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.otc_number) { ListInput.otc_order_free_search = this.otc_number; } else { ListInput.otc_order_free_search = ""; }
      if (this.status) { ListInput.order_status = this.status; } else { ListInput.order_status = ""; }
      if (this.region) { ListInput.dealer_region = this.region; } else { ListInput.dealer_region = ""; }
      if (this.state) { ListInput.shipping_state = this.state; } else { ListInput.shipping_state = ""; }
      if (this.district) { ListInput.shiping_district = this.district; } else { ListInput.shiping_district = ""; }
      if (this.city) { ListInput.shipping_city = this.city; } else { ListInput.shipping_city = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

      if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

      if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

      if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

      ListInput.offset = 0
      ListInput.size = this.noofrecordsperpage
      ListInput.channel = "siebel"

      this.GetOrderList(ListInput);

      //this.HighRPMList(ListInput);
    }

    else if (this.tab == 3) {
      const ListInput: Input = {} as Input;

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.otc_number) { ListInput.otc_order_free_search = this.otc_number; } else { ListInput.otc_order_free_search = ""; }
      if (this.status) { ListInput.order_status = this.status; } else { ListInput.order_status = ""; }
      if (this.region) { ListInput.dealer_region = this.region; } else { ListInput.dealer_region = ""; }
      if (this.state) { ListInput.shipping_state = this.state; } else { ListInput.shipping_state = ""; }
      if (this.district) { ListInput.shiping_district = this.district; } else { ListInput.shiping_district = ""; }
      if (this.city) { ListInput.shipping_city = this.city; } else { ListInput.shipping_city = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

      if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

      if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }

      if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

      ListInput.offset = 0
      ListInput.size = this.noofrecordsperpage
      ListInput.channel = "hirpm"

      this.HighRPMList(ListInput);
    }

    else if (this.tab == 4) {
      const ListInput1: FiledInput = {} as FiledInput;

      if (this.to_date) { ListInput1.order_to_date = this.to_date; } else { ListInput1.order_to_date = ""; }

      if (this.from_date) { ListInput1.order_from_date = this.from_date; } else { ListInput1.order_from_date = ""; }


      if (this.order_no) { ListInput1.order_number = this.order_no; } else { ListInput1.order_number = ""; }

      if (this.distributor_name) { ListInput1.org_name = this.distributor_name; } else { ListInput1.org_name = ""; }

      if (this.distributor_id) { ListInput1.distributor_id = this.distributor_id; } else { ListInput1.distributor_id = ""; }

      if (this.division_name) { ListInput1.division_name = this.division_name; } else { ListInput1.division_name = ""; }

      if (this.status != "") {
        if (this.status) { ListInput1.status = this.status; } else { ListInput1.status = ""; }
      }
      else {
        ListInput1.status = ["In-Process"];
      }

      ListInput1.offset = 0
      ListInput1.size = this.noofrecordsperpage

      this.GetFailuerList(ListInput1);
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
    this.status = "";
    this.otc_number = "";
    this.region = "";
    this.otc_number = "";
    this.status = "";
    this.region = "";
    this.state = "";
    this.district = "";
    this.city = "";
    this.distributor_name = "";
    this.account_name = "";
    this.division_name = "";
    this.distributor_id = "";
    this.division_id = "";
    this.order_no = "";
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

    const data2: InputData3 = {} as InputData3;
    data2.size = 5;
    this.GetAccount(data2);

  }

  calculateDate1(Date1, date2) {
    Date1 = new Date(Date1);
    date2 = new Date(date2);
    var diffc = Date1.getTime() - date2.getTime();

    var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));

    return days;
  }

  dayscalculate() {
    var days = this.calculateDate1(this.from_date, this.to_date);
  }

  EorderDownload: any;
  count: any;
  pageName: any;
  EOrderExport() {
    debugger
    // if (event.target.value == " ") {
    //   Swal.fire('For CRM orders, Please select download type')
    // }
    // else if (event.target.value == "Excel") {
    //   var days = this.calculateDate1(this.from_date, this.to_date);

      // if (days > 30) {
      //   Swal.fire('For e-Dukaan orders, Export to excel option is allowed for 30 days')
      // }
      // else {

      //   console.log(this.otc_number)
        if (this.totalrecord == 0) {
          Swal.fire("No Data For Downloding.....");
        } else {
          const ListInput2: InputOrderDownload = {} as InputOrderDownload;

          if (this.to_date) { ListInput2.to_date = this.to_date; } else { ListInput2.to_date = ""; }

          if (this.from_date) { ListInput2.from_date = this.from_date; } else { ListInput2.from_date = ""; }
          // if (this.otc_number) { ListInput2.otc_number = this.otc_number; } else { ListInput2.otc_number = ""; }
          if (this.portal_order_number) { ListInput2.portal_order_number = this.portal_order_number } else { ListInput2.portal_order_number }
          if (this.otc_number) { ListInput2.otc_number_search = this.otc_number; } else { ListInput2.otc_number_search = ""; }
          if (this.status) { ListInput2.order_status = this.status; } else { ListInput2.order_status = ""; }
          if (this.region) { ListInput2.dealer_region = this.region; } else { ListInput2.dealer_region = ""; }
          if (this.state) { ListInput2.shipping_state = this.state; } else { ListInput2.shipping_state = ""; }
          if (this.district) { ListInput2.shiping_district = this.district; } else { ListInput2.shiping_district = ""; }
          if (this.city) { ListInput2.shipping_city = this.city; } else { ListInput2.shipping_city = ""; }

          if (this.account_id) { ListInput2.account_id = this.account_id; } else { ListInput2.account_id = ""; }

          if (this.account_name) { ListInput2.account_name = this.account_name; } else { ListInput2.account_name = ""; }

          if (this.distributor_name) { ListInput2.org_name = this.distributor_name; } else { ListInput2.org_name = ""; }

          // if (this.distributor_id) { ListInput2.distributor_id = this.distributor_id; } else { ListInput2.distributor_id = ""; }

          if (this.division_name) { ListInput2.division_name = this.division_name; } else { ListInput2.division_name = ""; }

          ListInput2.channel = "ecommerce";
          ListInput2.action = "ForExcel"

          console.log(ListInput2)
          var limit = 250
          var offset = 0

          ListInput2.offset = 0
          ListInput2.limit = limit;

          this.EorderDownload = ListInput2;
          this.count = this.totalrecord;
          this.pageName = "e-order"
          let ngbModalOptions: NgbModalOptions = {
            backdrop: false,
            keyboard: false,
          };
          this.modalService.open(this.EOrderDownload, ngbModalOptions).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason: any) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        }
      }
    // }
  // }
  CRMExport() {

    // if (event.target.value == " ") {
    //   Swal.fire('For CRM orders, Please select download type')
    // }
    // else {
    //   var days = this.calculateDate1(this.from_date, this.to_date);

    //   if (days > 30) {
    //     Swal.fire('For CRM orders, Export to excel option is allowed for 30 days')
    //   }
    //   else if (event.target.value == "Excel") {
        if (this.totalrecord == 0) {
          Swal.fire("No Data For Downloding.....");


        } else {

        const ListInput2: InputOrderDownload = {} as InputOrderDownload;

          if (this.to_date) { ListInput2.to_date = this.to_date; } else { ListInput2.to_date = ""; }

          if (this.from_date) { ListInput2.from_date = this.from_date; } else { ListInput2.from_date = ""; }


          if (this.otc_number) { ListInput2.otc_number_search = this.otc_number; } else { ListInput2.otc_number_search = ""; }
          if (this.status) { ListInput2.order_status = this.status; } else { ListInput2.order_status = ""; }
          if (this.region) { ListInput2.dealer_region = this.region; } else { ListInput2.dealer_region = ""; }
          if (this.state) { ListInput2.shipping_state = this.state; } else { ListInput2.shipping_state = ""; }
          if (this.district) { ListInput2.shiping_district = this.district; } else { ListInput2.shiping_district = ""; }
          if (this.city) { ListInput2.shipping_city = this.city; } else { ListInput2.shipping_city = ""; }

          // if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

          if (this.account_name) { ListInput2.account_name = this.account_name; } else { ListInput2.account_name = ""; }

          if (this.distributor_name) { ListInput2.org_name = this.distributor_name; } else { ListInput2.org_name = ""; }

          //if (this.distributor_id) { ListInput2.distributor_id = this.distributor_id; } else { ListInput2.distributor_id = ""; }

          // if (this.division_name) { ListInput2.division_name = this.division_name; } else { ListInput2.division_name = ""; }

          ListInput2.channel = "siebel";
          ListInput2.action = "ForExcel"

          var limit = 250
          var offset = 0

          ListInput2.offset = 0
          ListInput2.limit = limit;

          this.EorderDownload = ListInput2;
          this.count = this.totalrecord;
          this.pageName = "CRM"
          let ngbModalOptions: NgbModalOptions = {
            backdrop: false,
            keyboard: false,
          };
          this.modalService.open(this.EOrderDownload, ngbModalOptions).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason: any) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
        }
      }
    // }
  // }
  // toggle_vehicle_list(vehicleId, el):void {  
  //   if( document.getElementById(vehicleId).style.display == 'table-row-group'){
  //     document.getElementById(vehicleId).style.display = 'none'; 
  //     document.getElementById(el).classList.remove("active");
  //  }
  //  else{
  //    document.getElementById(vehicleId).style.display = 'table-row-group';
  //    document.getElementById(el).classList.add("active");
  //  }
  // }

  invoiceDetails = []
  InvoiceDetails(row) {
    console.log(row)

    const ListInput1: InputOrderInvoiceDetail = {} as InputOrderInvoiceDetail;
    ListInput1.order_number = row.order_number;
    this.OrderListService.GetInvoiceList(ListInput1).subscribe(
      
      data1 => {
        
        if (data1.success == true) {
          this.invoiceDetails = data1.data;
          this.loader.close();
        }
        else {
          this.rowFailed = [];
          this.loader.close()
          this.toastrService.error(data1.data.msg)
        }
      }, (err) => {
        this.loader.close();
        //  Swal.fire("no invoice copy found");

      }
    );
  }

  Invoiceclick(row) {
    debugger
    var Json

    Json = {
      "invoice_no": row.invoice_no
    }

    this.OrderListService.InvoiceList(Json).subscribe(
      
      data => {
        if (data.success == true) {
          
          var w = window.open(data.data.invoice_url, '_blank');
          w.focus();
        }
        else {
        }
      }, (err) => {
      Swal.fire("no invoice copy found");

      }
    );
  }

  SearchOTc(event) {
    debugger
    if (event.key === "Enter") {


      if (this.tab == 1) {
        const ListInput2: InputOrder = {} as InputOrder;
        ListInput2.limit = 10;
        ListInput2.offset = 0;
        ListInput2.from_date = localStorage.getItem("FromDate");
        ListInput2.to_date = localStorage.getItem("ToDate");
        ListInput2.channel = "ecommerce";
        ListInput2.otc_number = event.target.value;
        this.GetOrderList(ListInput2);
        //this.loader.close()


      }
      else if (this.tab == 2) {
        const ListInput2: InputOrder = {} as InputOrder;
        ListInput2.from_date = localStorage.getItem("FromDate");
        ListInput2.to_date = localStorage.getItem("ToDate");
        ListInput2.channel = "siebel";
        ListInput2.otc_number = event.target.value;
        this.GetOrderList(ListInput2);
        this.loader.close()

      }
      else if (this.tab == 3) {
        const ListInput: InputOrder = {} as InputOrder;
        ListInput.to_date = localStorage.getItem("ToDate");
        ListInput.from_date = localStorage.getItem("FromDate");
        ListInput.otc_number = event.target.value;
        ListInput.channel = "hirpm"
        this.GetOrderList(ListInput);
        this.loader.close()

      }
      else if (this.tab == 4) {
        const ListInput: FiledInput = {} as FiledInput;
        ListInput.order_to_date = localStorage.getItem("ToDate");
        ListInput.order_from_date = localStorage.getItem("FromDate");
        ListInput.order_number = event.target.value;
        ListInput.status = ["In-Process"]
        this.GetFailuerList(ListInput);
        this.loader.close()

      }
    }

    this.loader.close();
  }


  // SearchOTc1(event) {
  //   if (event.key === "Enter") {
  //     if (this.tab == 1) {
  //       const ListInput2: InputOrder = {} as InputOrder;
  //       ListInput2.limit = 10;
  //       ListInput2.offset = 0;
  //       ListInput2.from_date = localStorage.getItem("FromDate");
  //       ListInput2.to_date = localStorage.getItem("ToDate");
  //       ListInput2.channel = "ecommerce";
  //       ListInput2.otc_number = event.target.value;
  //       this.GetOrderList(ListInput2);
  //       this.loader.close()


  //     }
  //     else if (this.tab == 2) {
  //       const ListInput2: InputOrder = {} as InputOrder;
  //       ListInput2.from_date = localStorage.getItem("FromDate");
  //       ListInput2.to_date = localStorage.getItem("ToDate");
  //       ListInput2.channel = "siebel";
  //       ListInput2.otc_number = event.target.value;
  //       this.GetOrderList(ListInput2);
  //       this.loader.close()

  //     }
  //     else if (this.tab == 3) {
  //       const ListInput: InputOrder = {} as InputOrder;
  //       ListInput.to_date = localStorage.getItem("ToDate");
  //       ListInput.from_date = localStorage.getItem("FromDate");
  //       ListInput.otc_number = event.target.value;
  //       ListInput.channel = "hirpm"
  //       this.GetOrderList(ListInput);
  //       this.loader.close()

  //     }
  //     else if (this.tab == 4) {
  //       const ListInput: FiledInput = {} as FiledInput;
  //       ListInput.order_to_date = localStorage.getItem("ToDate");
  //       ListInput.order_from_date = localStorage.getItem("FromDate");
  //       ListInput.order_number = event.target.value;
  //       ListInput.status = ["In-Process"]
  //       this.GetFailuerList(ListInput);
  //       this.loader.close()

  //     }
  //   }
  // }


  showOtc(event) {
    this.otc_number = event.target.value;
    if (this.tab == 1) {
      const ListInput2: InputOrder = {} as InputOrder;
      ListInput2.limit = 10;
      ListInput2.offset = 0;
      ListInput2.from_date = localStorage.getItem("FromDate");
      ListInput2.to_date = localStorage.getItem("ToDate");
      ListInput2.channel = "ecommerce";
      ListInput2.otc_number = event.target.value;
      this.GetOrderList(ListInput2);
    }
    else if (this.tab == 2) {
      const ListInput2: InputOrder = {} as InputOrder;
      ListInput2.from_date = localStorage.getItem("FromDate");
      ListInput2.to_date = localStorage.getItem("ToDate");
      ListInput2.channel = "siebel";
      ListInput2.otc_number = event.target.value;
      this.GetOrderList(ListInput2);
    }
    else if (this.tab == 3) {
      const ListInput: InputOrder = {} as InputOrder;
      ListInput.to_date = localStorage.getItem("ToDate");
      ListInput.from_date = localStorage.getItem("FromDate");
      ListInput.otc_number = event.target.value;
      ListInput.channel = "hirpm"
      this.GetOrderList(ListInput);
    }
    else if (this.tab == 4) {
      const ListInput: FiledInput = {} as FiledInput;
      ListInput.order_to_date = localStorage.getItem("ToDate");
      ListInput.order_from_date = localStorage.getItem("FromDate");
      ListInput.order_number = event.target.value;
      ListInput.status = ["In-Process"]
      this.GetFailuerList(ListInput);
    }


    this.loader.close();
  }

  onRemoveFilter(filterString) {
    this.isDivisionVisible == false;
    let Filterarrays = this.Filterarray;
    if (filterString.Key == "otc_number") {
      this.otc_number = "";
      this.AllFilters.get("otc_number").setValue("")
      this.AllFilters.get("otc_no_search").setValue("")
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
      const data2: InputData3 = {} as InputData3;
      data2.size = 5;
      this.GetAccount(data2);
    }
    else if (filterString.Key == "order_status") {
      this.status = ""
      this.AllFilters.get("status").setValue("")
    }
    else if (filterString.Key == "dealer_region") {
      this.region = ""
      this.AllFilters.get("region").setValue("")
    }
    else if (filterString.Key == "division_name") {
      this.division_id = "";
      this.division_name = "";
      // this.AllFilters.get("div_id").setValue("")
      this.DivisionList.reset()
    }
    else if (filterString.Key == "shipping_state") {
      this.state = "";
      this.AllFilters.get("state").setValue("")
    }
    else if (filterString.Key == "shiping_district") {
      this.district = "";
      this.AllFilters.get("district").setValue("")
    }
    else if (filterString.Key == "shipping_city") {
      this.city = "";
      this.AllFilters.get("city").setValue("")
    }
    else if (filterString.Key == "order_number") {
      this.order_no = "";
      this.AllFilters.get("order_number").setValue("")
    }
    else if (filterString.Key == "status") {
      this.status = "";
      this.AllFilters.get("order_status").setValue("")
    }
    this.Search();
    //this.GetOrderList(ListInput2);
    
  }

  pageCount = [];
  eDukaanCount: any;
  crmCount: any;
  hiRpmCount: any;
  ProgressCount: any;
  eDukaanTotalCount: any;
  crmTotalCount: any;
  hiRpmTotalCount: any;
  ProgressTotalCount: any;
  GetPageCount(input) {
    debugger
    // this.Accountnamedata = [];
    this.pageCount = []
    // console.log("orderhistroy",this.pageCount)
    debugger
    this.OrderListService.GetStatisticsOfPage(input).subscribe(
      data => {
        if (data.success == true) {
          this.pageCount = data.data;
          this.eDukaanCount = this.pageCount[0].order_count;
          this.crmCount = this.pageCount[1].order_count;
          this.hiRpmCount = this.pageCount[2].order_count;
          this.ProgressCount = this.pageCount[3].order_count;
        }
        else {

        }
      }, (err) => {
      }
    );
  }


  invoiceData = [];
  Titile: string;
  invoiceotc: string;
  openInvoicePopup(row) {
    console.log(row)
    debugger
    const ListInput1: ListInput = {} as ListInput;
    ListInput1.invoice_no = row.invoice_no;

    this.OrderListService.GetInvoiceCopy(ListInput1).subscribe(

      data => {
        debugger
        if (data.success == true) {

          this.invoiceData = data.data
          this.invoiceotc = row.otc_order_number
          this.Titile = row.invoice_no

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
        //Swal.fire('Please Check Details After Some Time');



      }
    );
  }
}

export class Input {
  size: number
  offset: number
  account_id: string
  distributor_id: string
  division_id: string
  order_type: string
  from_date: string
  to_date: string
  channel: string
  shiping_district: string
  shipping_city: string
  shipping_taluka: string
  shipping_pincode: string
  //  otc_order_no: string
  otc_order_free_search: string
  portal_order_number: string
  order_status: string
  action: string
  division_name: string
  org_name: string
  account_name: string
  shipping_state: string
  dealer_region: string;
}

export class FiledInput {
  offset: number
  size: number
  status: any
  order_number: string
  otc_order_number: string
  order_from_date: string
  order_to_date: string
  //division_id: string
  distributor_id: string
  division_name: any
  org_name: any
  DivisionName: string
  DistibutoName: string
  account_id: string
  Custname: string
  limit: any;
}

export class InputOrder {
  limit: number;
  offset: number;
  from_date: string;
  to_date: string;
  otc_number: string;
  otc_number_search: string;
  distributor_id: string;
  division_id: string;
  order_number: string;
  shipping_state: string;
  shiping_district: string;
  shipping_taluka: string;
  shipping_city: string;
  shipping_pincode: string;
  account_name: string;
  division_name: string;
  organization_name: string;
  order_status: string;
  order_type: string;
  channel: string;
  dealer_state: string;
  dealer_region: string;
  state_code: string;
}

export class InputData {
  size: number
  org_search_text: string
}

export class InputData2 {
  distributor_id: string;
  div_search_text: string;
}

export class InputData3 {
  account_name: string;
  account_id: string;
  size: number;
  cust_search_text: string
}

export class InputOrderDetail {
  order_number: string
  otc_number: string;
  otc_order_free_search: any;
}

export class InputOrderDownload {
  size: number;
  offset: number;
  from_date: string;
  to_date: string;
  otc_number: string;
  account_id: string;
  otc_number_search: string;
  distributor_id: string;
  division_id: string;
  order_number: string;
  shipping_state: string;
  shiping_district: string;
  shipping_taluka: string;
  shipping_city: string;
  shipping_pincode: string;
  account_name: string;
  division_name: string;
  organization_name: string;
  order_status: string;
  order_type: string;
  channel: string;
  dealer_state: string;
  dealer_region: string;
  action: string;
  portal_order_number: any;
  otc_order_free_search: string;
  org_name: any;
  limit: number;
  //action: string
}

export class InputOrderInvoiceDetail {
  offset: number;
  size: number;
  tracking_from_date: string;
  tracking_to_date: string;
  invoice_from_date: string;
  invoice_to_date: string;
  order_from_date: string;
  order_to_date: string;
  order_number: string;
  otc_number: string;
  invoice_no: string;
  invoice_status: string;
  division_name: string;
  org_name: string;
  account_name: string;
  account_id: string;
}

export class InputPageCount {
  page_type: string
  from_date: string;
  to_date: string;
}
export class ListInput {
  invoice_no: string
}