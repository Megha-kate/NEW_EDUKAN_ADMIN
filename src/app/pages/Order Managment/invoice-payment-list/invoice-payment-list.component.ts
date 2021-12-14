import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabBody } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
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
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>
  exampleForm = new FormGroup({ firstName: new FormControl(), lastName: new FormControl(), role_id: new FormControl(), position_name: new FormControl() });
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
  isDisabled: boolean;
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
  closeResult: string;
  Filterarray: any[];
  payment_status: string;
  EDownload: ListInput;
  count: number;
  pageName: string;
  Action: string;
  Disabled: boolean;
  order_date: any;
  invoice_date: any;
  invoice_pdf_url: any;
  order_amount: any;
  invoice_amount: any;
  tracking_date: any;
  payment_date: any;
  rowFailed: any[];


  constructor(  private OrderListService: OrderserviceService,
    private CommonService: CommonService,
    private modalService: NgbModal,
    private loader: AppLoaderService,
    private router: Router, private fb: FormBuilder,
    private toastrService: ToastrService,
    private datepipe: DatePipe,
    ) {  this.createForm('');}
    createForm(row: any) {

      this.exampleForm = this.fb.group({
  
    //  banner_url: row.banner_url,
      // bannerType: row.banner_type,
      payment_method: [row.payment_method || '', Validators.required],
      remark: [row.remark || '', Validators.required],
      invoice_no: [row.invoice_no || '', Validators.required],

      });
    }

  ngOnInit(): void {
    this.currentPage = 1
    this.noofrecordsperpage = 10
    this.showRecords = 10;
    this.date = new Date();

    const ListInput: ListInput = {} as ListInput;
 
    

    ListInput.offset = 0;
    ListInput.limit = 10;
     
    ListInput.action_type="payment_invoice_list",

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

  
   // this.items = [];
    this.totalrecord = 0

    this.OrderListService.InvoicePayment(ListInput).subscribe(

      data => {



        if (data.success == true) {


         // this.loader.close()


          this.items = data.data;
       

         this.totalrecord = data.total_result;
        

         this.showRecords = data.data.length





        }


        else {
          this.items=[]
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
    if (this.payment_status) { ListInput.payment_status = this.payment_status; } else { ListInput.payment_status = ""; }
    // ListInput.offset = 0;
    // ListInput.limit = this.noofrecordsperpage
    ListInput.offset = (page*10)
    ListInput.limit = this.noofrecordsperpage
    ListInput.action_type="payment_invoice_list",
    
    this.InvoicePayment(ListInput)

  }

  ExportDownload() {
    debugger
    //  if (event.target.value == " ") {
    //    Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
      if (this.totalrecord == 0) {
        Swal.fire("No Data For downloding");
      } else {
        const ListInput: ListInput = {} as ListInput;
        if (this.otc_order_number) { ListInput.otc_order_number = this.otc_order_number; } else { ListInput.otc_order_number = ""; }
    
    
        if (this.invoice_no) { ListInput.invoice_no = this.invoice_no; } else { ListInput.invoice_no = ""; }
        if (this.invoice_status) { ListInput.invoice_status = this.invoice_status; } else { ListInput.invoice_status = ""; }
        if (this.order_number) { ListInput.order_number = this.order_number; } else { ListInput.order_number = ""; }
        if (this.payment_method) { ListInput.payment_method = this.payment_method; } else { ListInput.payment_method = ""; }
        if (this.order_date) { ListInput.order_date = this.order_date; } else { ListInput.order_date = ""; }
        if (this.invoice_date) { ListInput.invoice_date = this.invoice_date; } else { ListInput.invoice_date = ""; }
        if (this.invoice_pdf_url) { ListInput.invoice_pdf_url = this.invoice_pdf_url; } else { ListInput.invoice_pdf_url = ""; }
        if (this.order_amount) { ListInput.order_amount = this.order_amount } else { ListInput.order_amount = ""; }

        if (this.tracking_date) { ListInput.tracking_date = this.tracking_date; } else { ListInput.tracking_date = ""; }
        if (this.payment_date) { ListInput.payment_date = this.payment_date; } else { ListInput.payment_date = ""; }
        //if (this.invoice_amount) { ListInput.invoice_amount = this.invoice_amount; } else { ListInput.invoice_amount = ""; }

         ListInput.action_type="payment_invoice_list",
         ListInput.limit = this.totalrecord;
         ListInput.offset = 0;
         this.EDownload = ListInput;
         this.count = this.totalrecord;
        this.pageName = "InvoicePaymentList";
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
    orderDetailsModal: any;
//closeResult: string;
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
  onDateSelect(event) {
    
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;;
    let day = event.day <= 9 ? '0' + event.day : event.day;;
    let finalDate = year + "-" + month + "-" + day;
    return finalDate
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
      var d1 = moment(this.invoice_from_date).format('yyyy-MM-DD')
      var d2 = moment(this.invoice_to_date).format('yyyy-MM-DD')
      var days = this.calculateDate1(d1, d2);
      if (d1 > d2) {
        Swal.fire('From-Date Should be Less Than To-Date.');
        return

      }
      else if (days >= 95) {
        Swal.fire(' Please select the date range up to 95 days ');
        return
      }
      let customfromdate = this.AllFilters.value.from_date;
      let customtodate = this.AllFilters.value.to_date
      this.from_date = this.onDateSelect(customfromdate)
      this.to_date = this.onDateSelect(customtodate)
      // this.from_date = this.AllFilters.value.invoice_from_date;
      // this.to_date = this.AllFilters.value.invoice_to_date;
      // this.invoice_from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
      // this.invoice_to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
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
    this.payment_status = this.AllFilters.value.payment_status
    const ListInput1: ListInput = {} as ListInput;

    if (this.otc_number) { ListInput1.otc_number = this.otc_number; } else { ListInput1.otc_number = ""; }


    if (this.invoice_no) { ListInput1.invoice_no = this.invoice_no; } else { ListInput1.invoice_no = ""; }
    if (this.invoice_status) { ListInput1.invoice_status = this.invoice_status; } else { ListInput1.invoice_status = ""; }
    if (this.order_number) { ListInput1.order_number = this.order_number; } else { ListInput1.order_number = ""; }
    if (this.payment_method) { ListInput1.payment_method = this.payment_method; } else { ListInput1.payment_method = ""; }
    if (this.payment_status) { ListInput1.payment_status = this.payment_status; } else { ListInput1.payment_status = ""; }
    ListInput1.action_type="payment_invoice_list",

    ListInput1.offset=0;
    ListInput1.limit=10;
      this.InvoicePayment(ListInput1)
      this.myDrop.close();
  }
  checkButton(){
    if (this.Action== 'paid') {
      this.Disabled = true;
    }
    else {

    }
  
  }


  invoiceDetails = []
  InvoiceDetails(row) {
    console.log(row)

    const ListInput1: InputInvoiceDetail = {} as InputInvoiceDetail;
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
  saveuserdata() {

   

     
    var data  = {
      "reference_number": '',
      "payment_method" :this.exampleForm.value.payment_method,
      "invoice_no": this.action_invoice_no
    }

    // Body.refNo=tempRef
    // tempRef{

    // }
    
    // const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    // ListInput1.invoice_number = row.invoice_no;
    this.OrderListService.InvoicePaymentUpdate(data).subscribe(

      data => {

        if (data.success == true) {

      
          this.modalService.dismissAll();
         
        }


        else {
          // Swal.fire(data.data.msg);
        
          //this.save(Formvalue);
        }
      }, (err) => {

      }


    )

 this.myDrop.close()    
    


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
  //this.myDrop.close();
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
    this.BuildFrom();
    this.Filterarray = [];

 
    this.otc_number = "";
    this.invoice_status="";
    this.payment_status="";
    this.order_number="";
    this.invoice_no="";
    var d1 = new Date(); // today!
    var x1 = 30; // go back 5 days!
    d1.setDate(d1.getDate() - x1);

    this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
    this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    const ListInput: ListInput = {} as ListInput;
    ListInput.offset = 0;
    ListInput.limit = 10;
   
    this.InvoicePayment(ListInput);
    this.myDrop.close();

  
  }


  action_invoice_no:any
  //reference_number:any
  Editpopup( content,row: any) {

    debugger
      this.action_invoice_no=''
      this.action_invoice_no=row
      //this.reference_number=row
      console.log(this.action_invoice_no)
    // this.btnSave = false;
    // this.Roletypedisable = false
    // this.btnupdate = true;

    //this.GetRole()
     //this.createForm(row)

    let ngbModalOptions: NgbModalOptions = {
      backdrop: false,
      keyboard: false,
    };
    this.modalService.open(content, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    setTimeout(() => {
      this.createForm(row)
    }, 200);

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
  payment_status: string;
  invoice_date: string;
  order_date: any;
  invoice_pdf_url: string;
  order_amount: any;
  invoice_amount: any;
  tracking_date: any;
  payment_date: any;

}
export class InputOrderDetail{
  invoice_number: any;
  otc_number: any;

}
export class InputInvoiceDetail{
  order_number: any;

}