import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { CommonService } from './../../../shared/Services/common-service.service';
import { DataPassServiceService } from './../../../shared/Services/data-pass-service.service';
import { CreditServiceService } from './../../../shared/Services/credit-service.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-credit-limit',
  templateUrl: './credit-limit.component.html',
  styleUrls: ['./credit-limit.component.scss']
})
export class CreditLimitComponent implements OnInit {
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @ViewChild('creditLog', { read: TemplateRef, static: false }) creditLog: TemplateRef<any>;
  @ViewChild('addlimit', { read: TemplateRef, static: false }) addlimit: TemplateRef<any>;
  currDiv: any;
  currentPage: any
  totalrecord: any
  noofrecordsperpage: any;

  from_date: string;
  to_date: string;
  RoleName: string;
  isdistributor: boolean;

  public AllFilters: FormGroup;
  DistributorList = new FormGroup({});
  CustomerList = new FormGroup({});

  DistributorData: any = [];
  distributor_id: any;
  distributor_name: any;

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

  Filterarray: any = [];

  FromDate: string;
  ToDate: string;

  href: any;
  pagevalid: boolean;

  items: [];
  temp: [];

  showRecords:number
  AccountName: FormGroup;

  constructor(
    private CommonService: CommonService,
    private modalService: NgbModal,
    private loader: AppLoaderService,
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private datepipe: DatePipe,
    private dataPass: DataPassServiceService,
    private creditservice: CreditServiceService
  ) { }

  ngOnInit(): void {
    this.currDiv = "retailer";
    this.currentPage = 1
    this.noofrecordsperpage = 10;
    this.showRecords=10;


    this.FromDate = localStorage.getItem("FromDate");
    this.ToDate = localStorage.getItem("ToDate");

    this.RoleName = this.CommonService.getRole();

    this.isdistributor = true;

    // this.isThirtyDays = true;

    if (this.RoleName == "TML") {
      this.isdistributor = false;
    }

    const data1: InputData = {} as InputData;
    data1.size = 5;
    data1.org_search_text = "";
    this.GetDistributor(data1);

    const data2: InputData3 = {} as InputData3;
    data2.size = 5;
    
    this.GetAccount(data2);

    this.BuildForm();

    const ListInput: InputData1 = {} as InputData1;
    ListInput.account_type = "RT";
    ListInput.size = 10;
    ListInput.offset= 0
    this.GetList(ListInput);
  }

  BuildForm() {
    this.AllFilters = this.fb.group({
      org_name: [''],
      from_date: [''],
      to_date: [''],
      Today: [],
      Custom: [],
      thirtyDays: [],
      Sevenday: [],
      account_name: [],
      account_id_search: []
    })
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
    this.distributor_id = row.distributor_id
    this.distributor_name = row.distributor_name
    if (event.target.checked) {
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        if (field1 == this.distributor_id) {
          this.DistributorList.get(field1).setValue(true);
        }
        else {
          this.DistributorList.get(field1).setValue(false);
        }
      }
    }
    else {
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        this.DistributorList.get(field1).setValue(false);
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


  omitSpecialChar(event) {
    const keyPressed = String.fromCharCode(event.keyCode);
    const verifyKeyPressed = /^[a-zA-Z\' \u00C0-\u00FF]*$/.test(keyPressed);
    return verifyKeyPressed === true;
  }
  //Accountnamedata: any = []
 // AccountnamedataOrignal;
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

  // custtype() {
  //   this.account_name = "";
  //   const data2: InputData3 = {} as InputData3;
  //   data2.size = 5;
  //   data2.account_name = this.AllFilters.value.account_name;
  //   this.GetAccount(data2)
//  }

  // filterMyOptionsCustname(row, event) {
  //   this.account_id = row.account_id;
  //   this.account_name = row.account_name;
  //   if (event.target.checked) {
  //     for (const field1 in this.CustomerList.controls) {
  //       if (field1 == this.account_id) {
  //         this.CustomerList.get(field1).setValue(true);
  //       }
  //       else {
  //         this.CustomerList.get(field1).setValue(false);
  //       }
  //     }
  //   }
  //   else {
  //     for (const field1 in this.CustomerList.controls) { // 'field' is a string

  //       this.CustomerList.get(field1).setValue(false);
  //     }
  //   }
  // }

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
      this.iscustomDate = false
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
      this.iscustomDate = false;
      this.isToday = false;
      this.isLastsevenDay = false;
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

  tab: any = 1;
  onClick(check) {
    this.tab = check
    this.currentPage = 1
    // this.isThirtyDays = false;
    // this.isToday = false;
    // this.iscustomDate = false;
    // this.isLastsevenDay = false;
    // this.ShowCustom = false;
    this.Filterarray = [];
    if (this.tab == 1) {
      this.isThirtyDays = false;
      this.isToday = false;
      this.iscustomDate = false;
      this.isLastsevenDay = false;
      this.currDiv = "retailer"

      const ListInput: InputData1 = {} as InputData1;

      ListInput.account_name = "";
      ListInput.account_type = "RT";
      ListInput.customer_segment = "";
      ListInput.offset = 0;
      ListInput.from_date = "";
      ListInput.to_date = "";
      ListInput.account_id = "";
      ListInput.distributor_code = "";
      // ListInput.size = 10;
      this.AllFilters.get('account_id_search').setValue("");
      this.Filterarray = [];
      this.resetFilterFeild();
      this.GetList(ListInput);
    }

    if (this.tab == 2) {
      this.isThirtyDays = false;
      this.isToday = false;
      this.iscustomDate = false;
      this.isLastsevenDay = false;
      this.currDiv = "fleet-owner"

      const ListInput: InputData1 = {} as InputData1;

      ListInput.account_name = "";
      ListInput.account_type = "FO";
      ListInput.customer_segment = "";
      ListInput.offset = 0;
      ListInput.from_date = "";
      ListInput.to_date = "";
      ListInput.account_id = "";
      ListInput.distributor_code = "";
      // ListInput.size = 10;
      this.Filterarray = [];
      this.resetFilterFeild();
      this.AllFilters.get('account_id_search').setValue("");
      this.GetList(ListInput);
    }
  }

  GetList(ListInput) {
    this.totalrecord = 0;
    this.FilterStrings(ListInput);

   /// this.loader.open();
    debugger
    this.creditservice.CreditList(ListInput).subscribe(
      data => {
        debugger
        if (data.success == true) {
          this.totalrecord = data.rangeInfo.total_row;
          this.items = data.data;
          this.showRecords=data.data.length

          this.loader.close();
          // if (this.tab == 1) {
          //   this.allCount = data.rangeInfo.total_row;
          //   console.log(this.allCount)
          //   console.log(data.rangeInfo.total_row)
          // }
          // if (this.tab == 2) {
          //   this.delayCount = data.rangeInfo.total_row;
          // }
        }
        else {
          this.items = this.temp = [];
          this.loader.close();
          this.toastrService.error(data.data.msg)
        }
      }, (err) => {
        this.loader.close();
      }
    );
  }

  pageChange(page: any) {
    debugger;
    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;

    if (this.tab == 1) {
      this.currDiv = "retailer"

      const ListInput: InputData1 = {} as InputData1;

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.distributor_id) { ListInput.distributor_code = this.distributor_id; } else { ListInput.distributor_code = ""; }

      if (this.account_id) { ListInput.account_id = this.account_id; } else { ListInput.account_id = ""; }


      ListInput.offset = page;
      ListInput.size = this.noofrecordsperpage
      ListInput.account_type = "RT"

      this.GetList(ListInput);

    }

    if (this.tab == 2) {
      this.currDiv = "fleet-owner"

      const ListInput: InputData1 = {} as InputData1;

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.distributor_id) { ListInput.distributor_code = this.distributor_id; } else { ListInput.distributor_code = ""; }

      if (this.account_id) { ListInput.account_id = this.account_id; } else { ListInput.account_id = ""; }

      ListInput.offset = page;
      ListInput.size = this.noofrecordsperpage
      ListInput.account_type = "FO"

      this.GetList(ListInput);
    }

  }

  Search() {
    debugger;
    this.Filterarray = [];
    this.currentPage = 1
    if (this.tab == 1) {
      if (this.iscustomDate == true) {
        if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
          Swal.fire('Select From Date');
          const ListInput: InputData1 = {} as InputData1;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.GetList(ListInput)
          this.loader.close();

          return
        }
        else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
          Swal.fire('Select To Date');
          const ListInput: InputData1 = {} as InputData1;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.GetList(ListInput)
          this.loader.close();

          return
        }
        var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
        var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1,d2);
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: InputData1 = {} as InputData1;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.GetList(ListInput)
          this.loader.close();

          return
          
        }
        else if(days >= 95){
          Swal.fire(' Allow to get Only 95 Days Data');
          const ListInput: InputData1 = {} as InputData1;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.GetList(ListInput)
          this.loader.close();
          return
        }
        // this.from_date = this.AllFilters.value.from_date;
        // this.to_date = this.AllFilters.value.to_date;
        // console.log(this.from_date)
        // console.log(this.to_date)
        // if (this.from_date == "" || this.to_date == "" ) {
        //   if (this.from_date == "") {
        //     Swal.fire('Select From Date');
        //   }
        //   else if (this.to_date == "") {
        //     Swal.fire('Select To Date');
        //   }

        //   if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date !== null || this.AllFilters.value.from_date != "" && this.AllFilters.value.to_date !== "") {
        //     var d1 =  moment(this.AllFilters.value.from_date).subtract(1, 'months').format('yyyy-MM-DD')
        //     var d2 =  moment(this.AllFilters.value.to_date).subtract(1, 'months').format('yyyy-MM-DD')


        //     if (d1 > d2) {
        //       Swal.fire('From-Date Should be Less Than To-Date.');
        //     }
        //     else {
        //       //  var days = this.calculateDate(this.itemForm.value.from_date, this.itemForm.value.to_date);
        //       //  var days = this.calculateDate(this.datepipe.transform(this.itemForm.value.from_date, 'MM-dd-yyyy') ,this.datepipe.transform( this.itemForm.value.to_date, 'MM-dd-yyyy') );

        //       var days = this.calculateDate1(this.AllFilters.value.from_date, this.AllFilters.value.to_date);
        //       if (days == 90 || days <= 90) {

        //       }
        //       else {
        //         Swal.fire(' Allow to get Only 90 Days Data');
        //       }
        //     }
        //   }
        // }

        // else {
        this.from_date = this.AllFilters.value.from_date;
        this.to_date = this.AllFilters.value.to_date;
        this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
        this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
        // }
      }
      else if (this.isLastsevenDay == true) {
        this.from_date = moment(this.ToDate).subtract(7, 'days').format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.ToDate, 'yyyy-MM-dd')
      }
      else if (this.isToday == true) {
        this.from_date = moment(this.ToDate).format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.ToDate, 'yyyy-MM-dd')
      }
      else if (this.isThirtyDays == true) {
        this.from_date = this.datepipe.transform(this.FromDate, 'yyyy-MM-dd')
        this.to_date = this.datepipe.transform(this.ToDate, 'yyyy-MM-dd')
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

      const ListInput: InputData1 = {} as InputData1;

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.distributor_id) { ListInput.distributor_code = this.distributor_id; } else { ListInput.distributor_code = ""; }

      if (this.account_id) { ListInput.account_id = this.account_id; } else { ListInput.account_id = ""; }

      if (this.distributor_name) { ListInput.distributor_name = this.distributor_name; } else { ListInput.distributor_name = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

      ListInput.offset = 0
      ListInput.size = this.noofrecordsperpage
      ListInput.account_type = "RT"

      this.GetList(ListInput);

      // for (let item in this.AllFilters.controls) {

      //   if (this.AllFilters.controls[item].value) {
      //     var Json = { "Key": item, "Value": this.AllFilters.controls[item].value }

      //     this.Filterarray.push(Json)
      //   }
      // }
    }
    else if (this.tab == 2) {
      if (this.iscustomDate == true) {
        if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
          Swal.fire('Select From Date');
          const ListInput: InputData1 = {} as InputData1;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.GetList(ListInput)
          this.loader.close();

          return
        }
        else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
          Swal.fire('Select To Date');
          const ListInput: InputData1 = {} as InputData1;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.GetList(ListInput)
          this.loader.close();

          return
        }
        var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
        var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1,d2);
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: InputData1 = {} as InputData1;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.GetList(ListInput)
          this.loader.close();

          return
          
        }
        else if(days >= 95){
          Swal.fire(' Allow to get Only 95 Days Data');
          const ListInput: InputData1 = {} as InputData1;
          ListInput.from_date = localStorage.getItem("FromDate");
          ListInput.to_date = localStorage.getItem("ToDate");

          this.GetList(ListInput)
          this.loader.close();
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

      const ListInput: InputData1 = {} as InputData1;

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.distributor_id) { ListInput.distributor_code = this.distributor_id; } else { ListInput.distributor_code = ""; }

      if (this.account_id) { ListInput.account_id = this.account_id; } else { ListInput.account_id = ""; }

      if (this.distributor_name) { ListInput.distributor_name = this.distributor_name; } else { ListInput.distributor_name = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }
      ListInput.offset = 0
      ListInput.size = this.noofrecordsperpage
      ListInput.account_type = "FO"


      this.GetList(ListInput);
    }
    this.myDrop.close();
  }


  calculateDate1(Date1, date2) {
    Date1 = new Date(Date1);
    date2 = new Date(date2);
    var diffc = Date1.getTime() - date2.getTime();

    var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));

    return days;
  }

  resetALl() {
    this.currentPage = 1;
    this.AllFilters.reset();
    this.DistributorList.reset();
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.distributor_name = "";
    this.account_name = "";
    this.distributor_id = "";
    this.account_id = "";
    this.isThirtyDays = false;
    this.isToday = false;
    this.iscustomDate = false;
    this.isLastsevenDay = false;
    this.ShowCustom = false;
    // var d1 = new Date();
    // var x1 = 30;
    // d1.setDate(d1.getDate() - x1);

    // this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
    // this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')

    this.from_date = "";
    this.to_date = "";

    const data1: InputData = {} as InputData;
    data1.size = 5;
    data1.org_search_text = "";
    this.GetDistributor(data1);

    const data2: InputData3 = {} as InputData3;
    data2.size = 5;
    this.GetAccount(data2);

    if (this.tab == 1) {
      this.currDiv = "retailer"

      const ListInput: InputData1 = {} as InputData1;

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.distributor_id) { ListInput.distributor_code = this.distributor_id; } else { ListInput.distributor_code = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

      ListInput.offset = 0;

      ListInput.account_type = "RT"

      this.GetList(ListInput);

    }

    if (this.tab == 2) {
      this.currDiv = "fleet-owner"

      const ListInput: InputData1 = {} as InputData1;

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.distributor_id) { ListInput.distributor_code = this.distributor_id; } else { ListInput.distributor_code = ""; }

      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

      ListInput.offset = 0;
      ListInput.account_type = "FO"

      this.GetList(ListInput);
    }
    this.myDrop.close();
  }


  resetFilterFeild() {
    this.AllFilters.reset();
    this.DistributorList.reset();
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.distributor_name = "";
    this.account_name = "";
    this.distributor_id = "";
    this.isThirtyDays = false;
    this.isToday = false;
    this.iscustomDate = false;
    this.isLastsevenDay = false;
    this.ShowCustom = false;
    // var d1 = new Date(); // today!
    // var x1 = 30; // go back 5 days!
    // d1.setDate(d1.getDate() - x1);

    // this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
    // this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')

    const data1: InputData = {} as InputData;
    data1.size = 5;
    data1.org_search_text = "";
    this.GetDistributor(data1);

    const data2: InputData3 = {} as InputData3;
    data2.size = 5;
    this.GetAccount(data2);

  }

  FilterStrings(ListInput) {

    this.Filterarray = [];
    debugger
    for (let item in ListInput) {

      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'account_id');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'distributor_code');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'account_type');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');

    if (this.isToday == true || this.isLastsevenDay == true || this.isThirtyDays == true || this.iscustomDate == true) {
      var from_date1 = ListInput.from_date;
      var to_date1 = ListInput.to_date;
      // if (from_date1 != "" || from_date1 != null || to_date1 != "" || to_date1 != null) {
        var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');

        var Json1 = { "Key": 'from_date', "Value": finaldate }
        this.Filterarray.push(Json1)
      // }
      // else if (from_date1 == "" || from_date1 == null || to_date1 == "" || to_date1 == null) {
      //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
      //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
      // }
    }

    console.log(this.Filterarray)
  }

  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }

  orderDetailsModal: any;
  closeResult: string;
  TempDAta: any;
  creditDetails: any;
  opencreditLog(row) {
    debugger
    this.loader.open()
    this.TempDAta = [];
    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.account_id = row.account_id;
    ListInput1.distributor_id = row.organization_id;
    this.creditservice.CreditLog(ListInput1).subscribe(
      data => {
        if (data.success == true) {
          this.loader.close()
          if (data.data.total_count > 0) {
            this.TempDAta = data.data.result;
            this.creditDetails = this.TempDAta
            let ngbModalOptions: NgbModalOptions = {
              backdrop: true,
              keyboard: true
            };
            this.modalService.open(this.creditLog, ngbModalOptions).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason: any) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
          }
          else if (data.data.total_count == 0) {
            Swal.fire('No Data Found');
            // alert('Please Check Details After Some Time')
            // alert('No Data Found')

            this.loader.close()
          }
        }
        else {
          // Swal.fire('No Data Found');
          this.toastrService.error('No Data Found')
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

  SearchAccount(event) {
    if (event.key === "Enter") {

      if (this.tab == 1) {
        const ListInput: InputData1 = {} as InputData1;

        ListInput.account_name = "";
        ListInput.account_type = "RT";
        ListInput.customer_segment = "";
        ListInput.offset = 0;
        ListInput.from_date = "";
        ListInput.to_date = "";
        ListInput.account_id = event.target.value;
        ListInput.distributor_code = "";
        // ListInput.size = 10;
        this.loader.close();
        this.GetList(ListInput);
      }
      else if (this.tab == 2) {
        const ListInput: InputData1 = {} as InputData1;

        ListInput.account_name = "";
        ListInput.account_type = "FO"
        ListInput.customer_segment = "";
        ListInput.offset = 0;
        ListInput.from_date = "";
        ListInput.to_date = "";
        ListInput.account_id = event.target.value;
        ListInput.distributor_code = "";
        // ListInput.size = 10;
        this.loader.close();
        this.GetList(ListInput);
      }
    }
  }

  showAccount(event) {

    if (this.tab == 1) {
      const ListInput: InputData1 = {} as InputData1;

      ListInput.account_name = "";
      ListInput.account_type = "RT";
      ListInput.customer_segment = "";
      ListInput.offset = 0;
      ListInput.from_date = "";
      ListInput.to_date = "";
      ListInput.account_id = event.target.value;
      ListInput.distributor_code = "";
      this.loader.close();
      // ListInput.size = 10;
      this.GetList(ListInput);
    }
    else if (this.tab == 2) {
      const ListInput: InputData1 = {} as InputData1;

      ListInput.account_name = "";
      ListInput.account_type = "FO"
      ListInput.customer_segment = "";
      ListInput.offset = 0;
      ListInput.from_date = "";
      ListInput.to_date = "";
      ListInput.account_id = event.target.value;
      ListInput.distributor_code = "";
      // ListInput.size = 10;
      this.loader.close();
      this.GetList(ListInput);
    }
  }

  onRemoveFilter(filterString) {
    if (filterString.Key == "distributor_name") {
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
      this.AllFilters.get('account_id_search').setValue("");
      const data2: InputData3 = {} as InputData3;
      data2.size = 5;
      this.GetAccount(data2);
    }

    this.Search();
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
  addlimitlog: any;
  Tempdatata: any;
  addlimitdata: any;
  onAddLimit(row) {
    this.addlimitdata = row;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: false,
      keyboard: false,
    };
    this.modalService.open(this.addlimit, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}

export class InputData {
  size: number
  org_search_text: string
}

export class InputData3 {
  account_name: string;
  account_id: string;
  size: number;
  cust_search_text: string
}

export class InputData1 {
  account_id: string;
  account_name: string;
  account_type: string;
  customer_segment: string;
  distributor_code: string;
  distributor_name: string;
  from_date: string;
  offset: number
  to_date: string;
  size:number
}

export class InputOrderDetail {
  account_id: string;
  distributor_id: string;
}
