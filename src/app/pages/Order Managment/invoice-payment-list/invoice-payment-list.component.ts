import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { CommonService } from 'src/app/shared/Services/common-service.service';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-invoice-payment-list',
  templateUrl: './invoice-payment-list.component.html',
  styleUrls: ['./invoice-payment-list.component.scss']
})
export class InvoicePaymentListComponent implements OnInit {

  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;

  public AllFilters = new FormGroup({});
  items: any[];
  totalrecord: number;
  showRecords: any;
  currentPage: any;
  noofrecordsperpage: number;
  isInvoicedate: boolean;
  ShowCustom: boolean;
  isThirtyDays: boolean;
  isToday: boolean;
  isLastsevenDay: boolean;
  //isLastsevenDay: boolean;
  iscustomDate: boolean;
  from_date: any;
  to_date: any;
  invoice_from_date: string;
  invoice_to_date: string;
  date:Date ;
  invoice_no: any;
  invoice_status: any;
  otc_order_number: any;
  otc_number: any;
  order_number: any;
  //order_number: any;
  payment_method: any;


  constructor(  private OrderListService: OrderserviceService,
    private CommonService: CommonService,
    private modalService: NgbModal,
    private loader: AppLoaderService,
    private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService,
    private datepipe: DatePipe,
    ) { }

  ngOnInit(): void {
    this.currentPage = 1
    this.noofrecordsperpage = 10
    this.showRecords = 10;
    this.date = new Date();

    const ListInput: ListInput = {} as ListInput;
  
    ListInput.action_type="payment_invoice_list",
    

    ListInput.offset = 0;
    ListInput.limit = 10;

    this.InvoicePayment(ListInput);
    this.BuildFrom()
  }
  BuildFrom(){
    this.AllFilters = this.fb.group({
      otc_number: [''],
      invoice_no: [''],
      otc_order_number: [''],
      order_number: [''],
      invoice_status: [''],
      invoice_from_date: [''],
      invoice_to_date: [''],
      payment_status: [''],


    });

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
  InvoicePayment(ListInput: any) {

  
    this.items = [];
    this.totalrecord = 0

    this.OrderListService.InvoicePayment(ListInput).subscribe(

      data => {



        if (data.success == true) {


          this.loader.close()


          this.items = data.data;
       

         this.totalrecord = data.total_result;
        

         this.showRecords = data.data.length





        }


        else {
          this.loader.close()

        }
      }, (err) => {


      }

    );


  }
  SearchAccount($event) {
    if ($event.key === "Enter") {
      const ListInput: ListInput = {} as ListInput;
     
      ListInput.invoice_no = $event.target.value
      this.InvoicePayment(ListInput);
    }
  }
  showAccount($event) {
   
    const ListInput: ListInput = {} as ListInput;
   
    ListInput.invoice_no = $event.target.value
    this.InvoicePayment(ListInput);
  
}
  pageChange(page:any){
    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;
    const ListInput: ListInput = {} as ListInput;
    if (this.otc_number) { ListInput.otc_number = this.otc_number; } else { ListInput.otc_number = ""; }


    if (this.invoice_no) { ListInput.invoice_no = this.invoice_no; } else { ListInput.invoice_no = ""; }
    if (this.invoice_status) { ListInput.invoice_status = this.invoice_status; } else { ListInput.invoice_status = ""; }
    if (this.order_number) { ListInput.order_number = this.order_number; } else { ListInput.order_number = ""; }
    if (this.payment_method) { ListInput.payment_method = this.payment_method; } else { ListInput.payment_method = ""; }

    // ListInput.offset = 0;
    // ListInput.limit = this.noofrecordsperpage
    ListInput.offset = 0
    ListInput.limit = this.noofrecordsperpage
    ListInput.action_type="payment_invoice_list",
    
    this.InvoicePayment(ListInput)

  }
  SearchAllDate(){
    
    let fromDate = localStorage.getItem("FromDate");
    let toDate = localStorage.getItem("ToDate");
    this.currentPage = 1
    //this.Filterarray = [];
    if (this.iscustomDate == true) {
      if (this.AllFilters.value.invoice_from_date == null || this.AllFilters.value.invoice_from_date == "" && this.AllFilters.value.invoice_to_date !== null) {
        Swal.fire('Select From Date');
        const ListInput1: ListInput = {} as ListInput;
        ListInput1.invoice_from_date = localStorage.getItem("FromDate");
        ListInput1.invoice_to_date = localStorage.getItem("ToDate");
        ListInput1.offset = 0;
        ListInput1.limit = 10;
        this.InvoicePayment(ListInput1);
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

    this.otc_number = this.AllFilters.value.otc_number;
    this.invoice_no = this.AllFilters.value.invoice_no
    this.invoice_status = this.AllFilters.value.invoice_status
    this.order_number = this.AllFilters.value.order_number
    this.payment_method = this.AllFilters.value.payment_method
    const AllFilters: ListInput = {} as ListInput;

    if (this.otc_number) { AllFilters.otc_number = this.otc_number; } else { AllFilters.otc_number = ""; }


    if (this.invoice_no) { AllFilters.invoice_no = this.invoice_no; } else { AllFilters.invoice_no = ""; }
    if (this.invoice_status) { AllFilters.invoice_status = this.invoice_status; } else { AllFilters.invoice_status = ""; }
    if (this.order_number) { AllFilters.order_number = this.order_number; } else { AllFilters.order_number = ""; }
    if (this.payment_method) { AllFilters.payment_method = this.payment_method; } else { AllFilters.payment_method = ""; }
    AllFilters.action_type="payment_invoice_list",

    AllFilters.offset=0;
      AllFilters.limit=10;
      this.InvoicePayment(AllFilters)
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

  resetALl(){
    //this.Filterarray = [];
    this.AllFilters.reset();
    

    const ListInput: ListInput = {} as ListInput;
   
    ListInput.offset = 0;
    ListInput.limit = 10;
   
    this.InvoicePayment(ListInput);
    this.myDrop.close();

  
  }
}
export class ListInput {
  offset: number;
  limit: number;
  action_type: any;
  invoice_no: string;
  order_number: string;
  otc_number: string;
  invoice_status: string;
  invoice_from_date: string;
  invoice_to_date: string;
  order_from_date: string;
  order_to_date: string;
  payment_method: string;
  otc_order_number: any;
  static action_type: string;

}