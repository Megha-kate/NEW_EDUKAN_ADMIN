import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import Swal from 'sweetalert2';
import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AppLoaderService } from '../../app-loader/app-loader.service';



@Component({
  selector: 'app-cancel-list-popup',
  templateUrl: './cancel-list-popup.component.html',
  styleUrls: ['./cancel-list-popup.component.scss']
})
export class CancelListPopupComponent implements OnInit {
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @Input() item: any;
  //items:items []=[];
  //length=[0];
  isshowEtaValidation: boolean = false;
  partStatus: any;
  totalpartCount: any = 0;
  partConfirmedCount: any = 0;
  //@ViewChild("etamodal", { read: TemplateRef, static: false }) etatemplate: TemplateRef<any>;
  etamodalRef: any;
  OrderDetailData: any;
  isshowOrderDetails: boolean = false;
  modalRef: any;
  //@ViewChild('modal', { read: TemplateRef, static: false }) template: TemplateRef<any>;
  total_tml_rule_discount: any;
  total_dealer_rule_discount: any;
  paymentvai: any;
  @Input() order: any;
  total: any;
  total1: any;
  total2: any;
  FinalMrp = 0
  FinalBaseDisc = 0
  FinalSchemeDic = 0
  FinalMatDiscount = 0
  DealerDiscount = 0
  TMLDiscount = 0
  FinalTax = 0
  FinallGros = 0
  currency: any
  base_discount_amount: any;
  schemediscount: any;
  tax: any;
  orderTotal: any;
  discountedprice: any;
  lineItemdiscount: any;
  FinalPrice1: any;
  TotalTax1: any;
  LineQty: any;
  subTotal: number;
  baseDiscount: number;
  taxTotal: number;
  FinalGross: number;
  orderFinalTotal: number;
  @Output() closemodal = new EventEmitter<any>();
  grandTotal: number = 0;
  @Input() isFeedBackSelected: boolean = false;
  @Input() isOTCSelected: boolean = false;
  @Input() isReturn: boolean = false;
  @Input() isOrderInProcessSelected: boolean = false;
  partsToReturn = [];
  sumOfParts: number = 0;
  orderCancelForm: FormGroup;
  showOther: boolean = false;
  @ViewChild('cancelOrder', { read: TemplateRef, static: false }) template: TemplateRef<any>;
  @ViewChild('InvoiceDetails', { read: TemplateRef, static: false }) InvoiceDetails: TemplateRef<any>;

  orderCancel: boolean = false;
  showLoader: boolean = false;
  DataPushArray = [];
  chkService: boolean = false;
  isSelected = {};
  isSelectedAll: boolean = false;
  isDisabledchk: boolean = false;
  returnOrderList: any;
  returnOrderSumAmount: number = 0;
  otcOrderSubmit: number = 0;
  feedbackOrderSubmit: number = 0;
  showPaymentDetails: boolean = false;
  paymentHistory = [];
  PaymentDetailData = [];
  CardData = [];
  billingAddress: any;
  shippingAddress: any;
  showGatewayDetails: boolean = false;
  // loader: any;
  dialog: any;
  closeResult: string;
  TempDAta: any[];
  ApprovedStatus: any;
  DisplayAction: any

  RejectReason: any;
  UserCnacelReason: any;
  UserCancelOthereason: any
  title = 'Confirmation ';
  text = 'Are you sure want to Approve??';


  textReject = 'Are you sure want to Reject??';
  ApproveReject: any;
  CancelOrderNumber: string;
  inputOptions = [
    { id: "1", reason: 'Incorrect Part From Stores' },
    { id: "2", reason: 'Wrong Discount Assigned' },
    { id: "3", reason: 'Wrong UMRP/Sales Price' },
    { id: "4", reason: 'Wrong Customer Selected' },
    { id: "5", reason: 'Wrong Item Inside Box' },
    { id: "6", reason: 'Part damaged Pre Fitment' },
    { id: "7", reason: 'Partial Warranty of Parts' },
    { id: "8", reason: 'Part damaged Post Fitment' },
    { id: "9", reason: 'Wrong Invoice' },
    { id: "10",reason: 'Vehicle Incorrect' },
    { id: "11",reason: 'Paid Parts to warranty Parts' }
  ]
  //ReasonList: FormGroup;
  ReasonList = new FormGroup({});
  ReasonControl=new FormControl();


  reason_id:any;
  reason: any;
  constructor(
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loader: AppLoaderService,
    private modalService: NgbModal,
    private OrderListService: OrderserviceService,
  ) {


  }



  ngOnInit() {

    this.calculation();
    this.ReasonList = new FormGroup({})
          for (let formModule of this.inputOptions) {
            this.ReasonList.addControl(formModule.id, new FormControl(false))
          }
          console.log(this.item)
  }


  ERROR(msg) {
    this.toastrService.error(msg)

  }

  getTotal(lineitem) {
    if (!this.isReturn && !this.isOrderInProcessSelected) {
      let finalePrice = lineitem.ITEM_FINAL_AMOUNT;
      let qty = lineitem.QUANTITY_s
      if (lineitem.ITEM_FINAL_AMOUNT == "" || lineitem.ITEM_FINAL_AMOUNT == undefined || lineitem.ITEM_FINAL_AMOUNT == NaN) {
        finalePrice = 0;
      }
      if (lineitem.QUANTITY_s == "" || lineitem.QUANTITY_s == undefined || lineitem.QUANTITY_s == NaN) {
        qty = 0;
      }
      return (finalePrice * qty);
    }
    else if (this.isReturn || this.isOrderInProcessSelected) {
      let finalePrice = lineitem.rate;
      let qty = lineitem.total_quantity
      if (lineitem.umrp == "" || lineitem.umrp == undefined || lineitem.umrp == NaN) {
        finalePrice = 0;
      }
      if (lineitem.total_quantity == "" || lineitem.total_quantity == undefined || lineitem.total_quantity == NaN) {
        qty = 0;
      }
      return (finalePrice * qty);
    }
  }

  Invoiceclick(row) {





    var Json


    Json = {
      "invoice_no": row.INVC_NUM_s
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


      }

    );



    // 

  }
  reasonType(value){
    // this.distributor_id = ""
    // this.distributor_name = ""

    // const data1: InputData = {} as InputData;

    // data1.size = 5;
    // data1.org_search_text = this.AllFilters.value.org_name;

    // //this.GetDistributor(data1);

    //this.inputOptions=this.inputOptions.filter(obj => Object.values(obj).some(val => val.includes(this.ReasonControl.value)));
    // const text =this.inputOptions.filter(obj => Object.values(obj).some(val => val.includes(this.ReasonControl.value)));
    var __FOUND = this.inputOptions.find(function(post, index) {
      if(post.reason == value)
        return true;
    });
    
  }



  reasonFilter(row, event) {
    this.reason_id = row.id
    this.reason = row.reason

    if (event.target.checked) {
      for (const field1 in this.ReasonList.controls) { // 'field' is a string
        if (field1 == this.reason_id) {
          this.ReasonList.get(field1).setValue(true);
        }
        else {
          this.ReasonList.get(field1).setValue(false);
        }
      }
    }
    else {
      for (const field1 in this.ReasonList.controls) { // 'field' is a string
        this.ReasonList.get(field1).setValue(false);
      }
    }
    //this.Getdivision(row)
  }
  Approve1() {
    var reason
    var ordernunmber = this.CancelOrderNumber;
    Swal.fire({
      title: 'Reason',
      input: 'select',

      inputOptions: {
        'Incorrect Part From Stores': 'Incorrect Part From Stores',
        'Wrong Discount Assigned': 'Wrong Discount Assigned',
        'Wrong UMRP/Sales Price': 'Wrong UMRP/Sales Price',
        'Wrong Customer Selected': 'Wrong Customer Selected',
        'Wrong Item Inside Box': 'Wrong Item Inside Box',
        'Part damaged Pre Fitment': 'Part damaged Pre Fitment',
        'Partial Warranty of Parts': 'Partial Warranty of Parts',
        'Part damaged Post Fitment': 'Part damaged Post Fitment',
        'Wrong Invoice': 'Wrong Invoice',
        'Vehicle Incorrect': 'Vehicle Incorrect',
        'Paid Parts to warranty Parts': 'Paid Parts to warranty Parts',
      },
      inputPlaceholder: 'Select',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write reason!'
        }
      }

    }).then((result) => {
      debugger;
      if (result.value) {


        if (this.CancelOrderNumber != "") {
          const ListInput: AprroveRejectJson = {} as AprroveRejectJson;
          ListInput.cancel_order_number = this.CancelOrderNumber
          ListInput.invoice_cancel_reason = String(result.value)
          ListInput.cancel_status = "Approved"
          ListInput.admin_reject_reason = String(result.value);
          this.ApproveReject(ListInput)
        }

      }


    }, (error: any) => console.log(error));
  }

  ApproveDemo(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  // ApproveReject(ListInput) {




  //   this.OrderListService.ApproveRejectCancelorder(ListInput).subscribe(

  //     data => {
  //       debugger


  //       if (data.success == true) {


  //         Swal.fire({
  //           title: "Success",
  //           // text: "You won't be able to revert this!",
  //           icon: 'success',
  //           showCancelButton: false,
  //           confirmButtonColor: '#3085d6',
  //           cancelButtonColor: '#d33',
  //           confirmButtonText: 'OK'
  //         }).then((result) => {
  //           if (result.value) {
  //             this.router.navigate(['pages/CancelOrders']);
  //           }
  //           else {
  //             this.router.navigate(['pages/CancelOrders']);
  //           }
  //         })



  //         //  this.loader.close();
  //       }



  //       else {

  //         Swal.fire({
  //           title: data.data.msg,
  //           // text: "You won't be able to revert this!",
  //           icon: 'error',
  //           showCancelButton: false,
  //           confirmButtonColor: '#3085d6',
  //           cancelButtonColor: '#d33',
  //           confirmButtonText: 'OK'
  //         }).then((result) => {
  //           if (result.value) {
  //             this.router.navigate(['pages/CancelOrders']);
  //           }
  //           else {
  //             this.router.navigate(['pages/CancelOrders']);
  //           }
  //         })



  //       }
  //     }, (err) => {

  //     }

  //   );

  // }

  Reject() {
    var reason
    var ordernunmber = this.CancelOrderNumber;
    Swal.fire({
      title: 'Reason For Rejection',
      input: 'textarea',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write reason!'
        }
      }

    }).then((result) => {
      // if (result.value != '') {
      if (result.value) {
        if (this.CancelOrderNumber != "") {
          const ListInput: AprroveRejectJson = {} as AprroveRejectJson;
          ListInput.cancel_order_number = this.CancelOrderNumber

          ListInput.cancel_status = "Rejected"
          ListInput.admin_reject_reason = String(result.value);
          this.ApproveReject(ListInput)
        }

      }
      // else {
      //   Swal.fire('Enter Reason')
      //   return false;
      // }

    }, (error: any) => console.log(error));

  }
  calculation() {
    // this.subTotal = 0;
    // this.baseDiscount = 0;
    // this.schemediscount = 0;
    // this.taxTotal = 0;
    // this.FinalGross = 0;
    // this.total_tml_rule_discount = 0;
    // this.total_dealer_rule_discount = 0;
    // this.item.order_cancelation_line.forEach(element => {
    //   this.subTotal = Number(this.subTotal) + Number(element.rate * element.total_quantity);
    //   this.baseDiscount = Number(this.baseDiscount) + Number(element.base_discount_amount * element.total_quantity);
    //   this.schemediscount = Number(this.schemediscount) + Number(element.scheme_discount_amount * element.total_quantity);
    //   this.taxTotal = Number(this.taxTotal) + (Number(element.total_quantity) * Number(this.getTax(element)));
    //   this.FinalGross = Number(this.FinalGross) + Number(element.total_amount);
    //   this.total_tml_rule_discount = Number(this.total_tml_rule_discount) + Number(element.tml_rule_discount_amount * element.total_quantity);
    //   this.total_dealer_rule_discount = Number(this.total_dealer_rule_discount) + Number(element.dealer_rule_discount_amount * element.total_quantity);
    // });
    //this.orderFinalTotal = this.subTotal - this.baseDiscount - this.schemediscount - this.total_tml_rule_discount - this.total_dealer_rule_discount + this.taxTotal;
    // this.orderFinalTotal = this.FinalGross;


    
    for (let entry of this.item.order_cancelation_line) {

      // var Mrp = entry.rate;
      var Mrp = entry.umrp;
      var BaseDiscount = entry.base_discount_amount;
      var SchemeDic = entry.scheme_discount_amount;
      var MatDiscount = 0;
      var Qty = entry.total_quantity;
      var Gross = entry.total_amount;
      var Tax = entry.tax_cgst_sgst_amount;
      var DealerDicount = entry.rule_discount_amount
      var TMLDiscount = entry.tml_rule_discount_amount





      this.FinalMrp = this.FinalMrp + (Number(Mrp) * Number(Qty));
      this.FinalBaseDisc = this.FinalBaseDisc + (Number(BaseDiscount) * Number(Qty));
      this.FinalSchemeDic = this.FinalSchemeDic + (Number(SchemeDic) * Number(Qty));
      this.FinalMatDiscount = this.FinalMatDiscount + (Number(MatDiscount) * Number(Qty));
      this.DealerDiscount = this.DealerDiscount + (Number(DealerDicount) * Number(Qty));
      this.TMLDiscount = this.TMLDiscount + (Number(TMLDiscount) * Number(Qty));
      this.FinalTax = this.FinalTax + (Number(Tax));
      this.FinallGros = this.FinallGros + Number(Gross);

      this.FinallGros = Math.round(this.FinallGros)




    }
    console.log(this.FinalMrp)
  }

  Calculate(val1, val2, val3) {

    var val11 = val1;
    var val22 = val2;
    var val33 = val3;
    //var val44 = val4

    if (val1 == undefined || val1 == "" || val1 == NaN) {
      val11 = 0;
    }

    if (val2 == undefined || val2 == "" || val2 == NaN) {
      val22 = 0;
    }

    if (val3 == undefined || val3 == "" || val3 == NaN) {
      val33 = 0;
    }
    // if (val4 == undefined || val4 == "" || val4 == NaN) {
    //   val44 = 0;
    // }





    var Finalval33 = Number(val11) + Number(val22) + Number(val33);

    //var Final  = Finalval33 / Number(val44)

    return Finalval33;


  }
  CalculateDiscountPrice(FinalPrice, TotalTax, qty) {
    var FinalPrice1 = FinalPrice;
    var TotalTax1 = TotalTax;
    var qtyy = qty;

    if (FinalPrice == undefined || FinalPrice == "" || FinalPrice == NaN) {
      FinalPrice1 = 0;
    }

    if (TotalTax == undefined || TotalTax == "" || TotalTax == NaN) {
      TotalTax1 = 0;
    }


    if (qty == undefined || qty == "" || qty == NaN) {
      qtyy = 0;
    }


    var DiscountedPrice = (Number(FinalPrice1) - Number(TotalTax1));
    return DiscountedPrice / Number(qtyy)

  }
  calculateatax(taxvlue, qty) {
    var tax = taxvlue;
    //console.log(taxvlue);
    //console.log(tax);
    if (taxvlue == undefined || taxvlue == "" || taxvlue == NaN) {
      tax = 0.0000;
    }

    return Number(tax) / Number(qty);



  }
 
  getTax(lineitem) {
    let tax = lineitem.TOTAL_TAX_s;
    if (lineitem.TOTAL_TAX_s == "" || lineitem.TOTAL_TAX_s == undefined || lineitem.TOTAL_TAX_s == NaN) {
      tax = 0;
    }
    return Number(tax).toFixed(5);
    //return Number(tax);
  }
  



  submit1()
  {
    Swal.fire('Are you sure want to Approve??');
  }  

ViewOrderInfromation
  details(row) {
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
            this.ViewOrderInfromation = this.TempDAta
            let ngbModalOptions: NgbModalOptions = {
              backdrop: true,
              keyboard: true
            };
            this.modalService.open(this.InvoiceDetails, ngbModalOptions).result.then((result) => {
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
  closeModal() {

    this.modalService.dismissAll();
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

  orderDetailsModal: any;
  orderInformations: any;
  OTCPopup() {
    debugger
    this.loader.open()

    this.TempDAta = [];

    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.otc_number = this.item.otc_order_number;
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



}

export class AprroveRejectJson {
  cancel_order_number: string;
  cancel_status: string;
  admin_reject_reason: string;
  invoice_cancel_reason: string;




}

export interface cancel_parts_detail {
  part_number: string;
  row_id: string;
}
export class InputOrderDetail {
  order_number: string
  otc_number:string;
}