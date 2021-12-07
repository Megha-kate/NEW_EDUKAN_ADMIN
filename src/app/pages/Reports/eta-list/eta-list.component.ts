import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import { ReportServicesService } from 'src/app/shared/Services/report-services.service';
import Swal from 'sweetalert2';
import { ListInput } from '../../Order Managment/Cancle-List/cancle-list/cancle-list.component';
import { CommonService } from './../../../shared/Services/common-service.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-eta-list',
  templateUrl: './eta-list.component.html',
  styleUrls: ['./eta-list.component.scss']
})
export class EtaListComponent implements OnInit {
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>;
  totalrecord: any;
  items: any;
  noofrecordsperpage: any;
  from_date: string;
  to_date: string;
  currDiv: any;
  showRecords: any;
  currentPage: any;
  otc_number: any;
  public itemForm = new FormGroup({});
  DistributorList = new FormGroup({});
  CustomerList = new FormGroup({});
  ShowCustom: boolean;
  iscustomDate: boolean;
  isThirtydays: boolean;
  isLastsevenDay: boolean;
  isToday: boolean;
  order_quantity: any;
  part_number: any;
  distributor_name: any;
  account_name: any;
  distributor_id: any;
  account_id: any;
  DistributorData = [];
  Filterarray: any;

  AllDistributorData: any;
  selectedDistributor: any;
  selectedAccountname: any;
  date: Date;
 // datepipe: any;
  isThirtyDays: boolean;
  division_id: string;
  state_code: string;
  order_no: any;
  org_name: any;
  division_name: any;
  otc_order_number: string;

  constructor(private MISService: ReportServicesService,
    private OrderListService: OrderserviceService,
    private datepipe: DatePipe,

    private loader: AppLoaderService,private fb: FormBuilder,
    private CommonService: CommonService,
    private modalService: NgbModal,


  ) { }

  ngOnInit(): void {

    this.currentPage = 1
    this.noofrecordsperpage = 10;
    this.showRecords = 10;
    this.isThirtydays = true;
   // this.currDiv = "All"
   this.currDiv = "All"
   this.date = new Date();
   this.from_date = moment(this.date).subtract(30, 'days').format('yyyy-MM-DD')
   this.to_date = localStorage.getItem("ToDate");
      const ExportArrayInput: InputData = {} as InputData;
    const ListInput1: AllInput = {} as AllInput;
    ExportArrayInput.size = 5;
    this.GetDistributor(ExportArrayInput);

    const ExportArrayInput4: InputData2 = {} as InputData2;
    ExportArrayInput4.size = 5;
    this.GetAccount(ExportArrayInput4)

  

    const ExportArrayInput1: InputData = {} as InputData;
    ExportArrayInput1.offset = 0;
    ExportArrayInput1.size = this.noofrecordsperpage

    ExportArrayInput1.from_date = localStorage.getItem("FromDate");
    ExportArrayInput1.to_date = localStorage.getItem("ToDate");

    this.AllorderList(ExportArrayInput1)

      this.BuildForm();



  }
  BuildForm() {
    this.itemForm = this.fb.group({
      from_date: [],
     // to_date: [],
      to_date:[],
      otc_number: [],
      account_name: [],
      distributor_name: [],
      division_name: [],
      days: [],
      to_percentage: [],
      from_percentage: [],
     // part_number: [],
      order_quantity: [],
      org_name: [],
      invoice_no: [],
      Today: [],
      Custom: [],
      thirtyDays: [],
      Sevenday: [],
      Distributor_Id: [''],
      part_number:[]

     // rating: [],
     // state: [],
     // state_code:[''],
     // state_name:['']
    })
  }
  orderDetailsModal: any;
  closeResult = ''
  TempDAta: any;
  orderInformations: any;
  otcOpen(row) {
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



  accountType() {
    //  alert("hii");
    // this.account_name = "";
    // //this.account_id="";
    // const data1: InputData2 = {} as InputData2;
    // data1.size = 5;
    // data1.cust_search_text = this.itemForm.value.account_name

    // this.Accountnamedata = this.AccountnamedataOrignal.filter(obj => obj.account_name.toLowerCase().indexOf(data1.cust_search_text) > -1)
    // this.GetAccount(this.Accountnamedata);

    const data2: InputData = {} as InputData;
    data2.size = 5;
    data2.account_name = this.itemForm.value.account_name;
    this.GetAccount(data2)
  }

 EDownload: any;
  count: any;
  pageName: any;

  ReportDownlod() {
    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
    //   if(this.totalrecord==0){
    //     Swal.fire("No Data Found in Excel File")
    //   }else{
      const ListInput: Input = {} as Input;

   // if (this.days) { ListInput.days = this.days; } else { ListInput.days = ""; }

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }
  
      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }
  
      if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
  
      if (this.otc_number) { ListInput.otc_order_number = this.otc_number; } else { ListInput.otc_order_number = ""; }
  
      if (this.order_no) { ListInput.order_number = this.order_no; } else { ListInput.order_number = ""; }
      if (this.org_name) { ListInput.distributor_name = this.org_name; } else { ListInput.distributor_name = ""; }
      if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }
      
      ListInput.offset = 0
      ListInput.size = this.totalrecord;

      this.EDownload = ListInput;
      this.count = this.totalrecord;
      this.pageName = "ETAReport";
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
        //  this.isDivisionVisible = true;
          const data: InputData1 = {} as InputData1;
          data.distributor_id = this.distributor_id;
          data.div_search_text = "";
          //this.Getdivision(data);
        }
        else {
          this.DistributorList.get(field1).setValue(false);
          //this.Division = [];
        }
      }
    }
    else {
      this.distributor_id = "";
      this.distributor_name = "";
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        this.DistributorList.get(field1).setValue(false);
      //  this.Division = [];
        //this.isDivisionVisible = false;
      }
    }
  }
  reset() {
    debugger;
  
    this.currentPage = 1
   
    this.itemForm.reset();
    this.DistributorList.reset();
   
    this.CustomerList.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.otc_order_number = "";
    this.isLastsevenDay = false;
    this.isToday = false;
    this.iscustomDate = false;
    this.ShowCustom = false;
    this.isThirtyDays = true;
    this.distributor_name = "";
    this.distributor_id = "";
    this.account_name = "";
    
    this.org_name = "";
    this.part_number = "";
    this.order_quantity = "";
   
    var d1 = new Date();
    var x1 = 30;
    d1.setDate(d1.getDate() - x1);

    this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
    this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')

    const ExportArrayInput: InputData = {} as InputData;
    ExportArrayInput.size = 5;
    this.GetDistributor(ExportArrayInput);

    const ExportArrayInput4: InputData2 = {} as InputData2;
    ExportArrayInput4.size = 5;
    this.GetAccount(ExportArrayInput4)

   
    const ListInput: Input = {} as Input;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }
    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
    if (this.order_quantity) { ListInput.order_quantity = this.order_quantity; } else { ListInput.order_quantity = ""; }
   
    // if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.distributor_name) { ListInput.org_name = this.distributor_name; } else { ListInput.org_name = ""; }

    if (this.distributor_id) { ListInput.distributor_id = this.distributor_id; } else { ListInput.distributor_id = ""; }


    ListInput.offset = 0
    ListInput.size = this.noofrecordsperpage

    this.AllorderList(ListInput);

  }
  Search() {
   this.Filterarray = [];
    this.currentPage = 1
    var a = this.DistributorList.valid;

    if (this.itemForm.value.to_percentage !== null) {
      if (this.itemForm.value.to_percentage !== "") {
        if (Number(this.itemForm.value.to_percentage) > 100) {
          Swal.fire("To Percentage should be less than or equal to 100");
          return false
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

    // if (this.iscustomDate == true) {
    //   if (this.itemForm.value.from_date == null || this.itemForm.value.from_date == "" && this.itemForm.value.to_date !== null) {
    //     Swal.fire('Select From Date');
    //     const ListInput: Input = {} as Input;
    //     ListInput.from_date = localStorage.getItem("FromDate");
    //     ListInput.to_date = localStorage.getItem("ToDate");

    //     this.AllorderList(ListInput)
    //     return
    //   }
    //   else if (this.itemForm.value.from_date !== null && this.itemForm.value.to_date == null || this.itemForm.value.to_date == "") {
    //     Swal.fire('Select To Date');
    //     const ListInput: Input = {} as Input;
    //     ListInput.from_date = localStorage.getItem("FromDate");
    //     ListInput.to_date = localStorage.getItem("ToDate");
    //     this.AllorderList(ListInput)
    //     return
    //   }
    //   var d1 = moment(this.itemForm.value.from_date).format('yyyy-MM-DD')
    //   var d2 = moment(this.itemForm.value.to_date).format('yyyy-MM-DD')
    //   if (d1 > d2) {
    //     Swal.fire('From-Date Should be Less Than To-Date.');
    //     const ListInput: Input = {} as Input;
    //     ListInput.from_date = localStorage.getItem("FromDate");
    //     ListInput.to_date = localStorage.getItem("ToDate");

    //     this.AllorderList(ListInput)
    //     return
        
    //   }
      
    //   this.from_date = this.itemForm.value.from_date;
    //   this.to_date = this.itemForm.value.to_date
    //   this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
    //   this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
    // }
    // else if (this.isLastsevenDay == true) {
    //   this.from_date = this.itemForm.value.from_date;
    //   this.to_date = this.itemForm.value.to_date
    //   this.from_date = moment(this.to_date).subtract(7, 'days').format('yyyy-MM-DD')
    //   this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
    // }
    // else if (this.isToday == true) {
    //   this.from_date = this.itemForm.value.from_date;
    //   this.to_date = this.itemForm.value.to_date
    //   this.from_date = moment(this.to_date).format('yyyy-MM-DD')
    //   this.to_date = moment(this.to_date).format('yyyy-MM-DD')
    // }
    // else if (this.isThirtyDays == true) {
    //   this.from_date = this.itemForm.value.from_date;
    //   this.to_date = this.itemForm.value.to_date
    //   this.from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
    //   this.to_date = this.datepipe.transform(this.to_date, 'yyyy-MM-dd')
    // }

    
    
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

    if (this.from_date) {
      this.itemForm.get('from_date').setValue(this.from_date);
    }
    if (this.to_date) {
      this.itemForm.get('to_date').setValue(this.to_date);
    }
    this.currentPage = 1
    let fromDate = localStorage.getItem("FromDate");
    let todate = localStorage.getItem("ToDate");

    if (this.iscustomDate == true) {
      this.from_date = this.itemForm.value.from_date;
      this.to_date = this.itemForm.value.to_date
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
    else {
      this.from_date = this.datepipe.transform(fromDate, 'yyyy-MM-dd')
      this.to_date = this.datepipe.transform(todate, 'yyyy-MM-dd')
    }
  
    
    console.log(this.to_date, this.from_date)
    if (this.from_date) {
      this.itemForm.get('from_date').setValue(this.from_date);
    }
    if (this.to_date) {
      this.itemForm.get('to_date').setValue(this.to_date);
    }


   // this.itemForm.value.size = 10;
    this.itemForm.value.to_date = this.to_date;
    this.itemForm.value.from_date = this.from_date

    // this.part_number= $event.part_number
    // this.otc_number= $event.otc_order_number
    // this.order_no = $event.order_number
    this.otc_number = this.itemForm.value.otc_number;
    this.part_number = this.itemForm.value.part_number;
    this.order_quantity = this.itemForm.value.order_quantity;
   // this.part_number = this.itemForm.value.part_number
    this.otc_number = this.itemForm.value.otc_number

    this.order_no = this.itemForm.value.order_no


    const ListInput: Input = {} as Input;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }
    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }
    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
    if (this.otc_number) { ListInput.otc_order_number = this.otc_number; } else { ListInput.otc_order_number = ""; }
    if (this.order_no) { ListInput.order_number = this.order_no; } else { ListInput.order_number = ""; }
    if (this.org_name) { ListInput.distributor_id = this.org_name; } else { ListInput.distributor_name = ""; }
    
    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }
    ListInput.offset = 0
    ListInput.size = this.noofrecordsperpage

    this.AllorderList(ListInput)

    // for (let item in this.itemForm.controls) {

    //   if (this.itemForm.controls[item].value) {
    //     var Json = { "Key": item, "Value": this.itemForm.controls[item].value }

    //     this.Filterarray.push(Json)
    
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
    var from_date1 = ListInput.from_date;
    var to_date1 = ListInput.to_date;
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
    var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
    var Json1 = { "Key": 'from_date', "Value": finaldate }
    this.Filterarray.push(Json1)
  }
  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }
  onRemoveFilter(filterString) {
    //this.isDivisionVisible =false;

    //let Filterarrays = this.Filterarray;

     //this.itemForm.reset();
    if (filterString.Key == "otc_order_number") {
      this.itemForm.get("otc_order_number").setValue("")
    }
    else if (filterString.Key == "org_name") {
      //this.Division = [];
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
    else if (filterString.Key == "part_number") {
      this.itemForm.get("part_number").setValue("")
    }
    else if (filterString.Key == "order_no") {
      this.itemForm.get("order_no").setValue("")
    }
       else if (filterString.Key == "part_number") {
      this.order_quantity = ""
      this.itemForm.get("part_number").setValue("")
    }
   
   
    // else if (filterString.Key == "invoice_no") {
    //   this.itemForm.get("invoice_no").setValue("")
    // }
    this.Search();
    //this.AllorderList(ListInput)
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
  pageChange(page: any) {
    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;

    const ListInput: Input = {} as Input;

    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }
    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }
    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
    if (this.otc_number) { ListInput.otc_order_number = this.otc_number; } else { ListInput.otc_order_number = ""; }
    if (this.order_no) { ListInput.order_number = this.order_no; } else { ListInput.order_number = ""; }
    if (this.org_name) { ListInput.distributor_id = this.org_name; } else { ListInput.distributor_name = ""; }
    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }
    ListInput.offset = (page * 10);
    ListInput.size = this.noofrecordsperpage
    this.AllorderList(ListInput)
  }

  AllorderList(ListInput) {
  //  this.totalrecord = 0;
  this.Filterarray = [];
  this.MISService.GetEtatReport(ListInput).subscribe(

      data => {
        //this.loader.close();
        if (data.success == true) {



          this.totalrecord = data.total_count;
          //this.items = [];
          this.items = data.data;
          this.showRecords = data.data.length




        }



        else {



          this.loader.close();
        }
      }, (err) => {
        this.loader.close();

      }

    );

  }
  

}



export class InputData {
  offset: number;
  size: number;
  from_date: string;
  to_date: string;
  account_name: any;
  org_search_text: any;

}



export class Input {
  offset: number;
  size: number;
  from_date: string;
  to_date: string;
  otc_number: any;
  order_quantity: any;
  part_number: any;
  org_name: string;
  account_name: any;
  distributor_id: any;
  otc_order_number: any;
  order_number: any;
  distributor_name: string;

}
export class InputData1 {
  account_name: string
  cust_search_text: string
  size: number;
  distributor_id: string;
  div_search_text: string;
}
export class InputData2 {
  size: number;
  account_name: any;
 
}
export class AllInput {
 
}
export class InputOrderDetail {
  order_number: string
  otc_number: string;
}