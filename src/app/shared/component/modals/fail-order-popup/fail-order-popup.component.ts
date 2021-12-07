import { Component, ComponentFactoryResolver, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import { AppLoaderService } from '../../app-loader/app-loader.service';
import { DataPassServiceService } from 'src/app/shared/Services/data-pass-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-fail-order-popup',
  templateUrl: './fail-order-popup.component.html',
  styleUrls: ['./fail-order-popup.component.scss']
})
export class FailOrderPopupComponent implements OnInit {
  @Input() item: any;
  @Output() closemodal = new EventEmitter<any>();

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
  total: any;
  total1: any;
  total2: any;
  basediscount: any;
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

  href: any;
  pagevalid: boolean
  iserror = "No";

  selectedIndexL: number;
  public datas = [];
  ErorCode: any;
  Errormessage:any;
  rows = [];
  rows1 = [];
  billingaddress : any
  shippingaddress :any
  appParentMessage: any;

  currency: string = '₹';

  constructor(
    private OrderListService: OrderserviceService,
     private router: Router,
     private loader: AppLoaderService, 
     private dataPass: DataPassServiceService,

       private modalService: NgbModal,

  ) { }

  ngOnInit(): void {

    const ListInputq: PaymentInfo = {} as PaymentInfo;
      ListInputq.order_number = this.item.order_number;

      debugger

      this.GetPaymentInfo(ListInputq)

    this.href = this.router.url;

    var splitted = this.href.split("/", 3);

    this.pagevalid = this.dataPass.GetPageVlidation(splitted[2])

    this.selectedIndexL = 0;
    this.appParentMessage = "This message is from parent"

    debugger;

    this.datas = this.item;

    if (this.item.order_number == '' ||this.item.order_number == undefined || this.item.order_number == null) {

      this.router.navigate(['pages/OrdersList']);

    }
    else {

      if (this.item.if_failed.error_1 == 'undefined' || this.item.if_failed.error_1 == "" || this.item.if_failed.error_1 == 'undefined' || this.item.if_failed.error_1 == null) {
        this.iserror = "Yes"
      }
      else {
        this.iserror = "No"
      }


      try {
        this.ErorCode = '<b>Error Code:</b>' + this.item.if_failed.error_2;
      }
      catch
      {
        this.ErorCode = '<b>Error Code:</b>';
      }
      try {
        this.Errormessage = '<b>Reason For In-Process :</b>' + this.item.if_failed.error_1;
      }
      catch
      {
        this.Errormessage = '<b>Reason For In-Process :</b>';
      }


      var XMl = "<?xml version=\\\"1.0\\\" encoding=\\\"UTF-8\\\"?><SOAP-ENV:Envelope xmlns:SOAP-ENV=\\\"http://schemas.xmlsoap.org/soap/envelope/\\\"><SOAP-ENV:Body><SOAP-ENV:Fault><faultcode>SOAP-ENV:Server</faultcode><faultstring>Cannot perform &apos;NewRecord&apos; on the business component &apos;Internal Division&apos;(SBL-EAI-04421)</faultstring><detail><siebelf:siebdetail xmlns:siebelf=\\\"http://www.siebel.com/ws/fault\\\"><siebelf:logfilename>EAIMobilityAppObjMgr_enu_0028_29360144.log</siebelf:logfilename><siebelf:errorstack><siebelf:error><siebelf:errorcode>SBL-EAI-04421</siebelf:errorcode><siebelf:errorsymbol>IDS_WRN_EAI_SA_DML</siebelf:errorsymbol><siebelf:errormsg>Cannot perform &apos;NewRecord&apos; on the business component &apos;Internal Division&apos;(SBL-EAI-04421)</siebelf:errormsg></siebelf:error></siebelf:errorstack></siebelf:siebdetail></detail></SOAP-ENV:Fault></SOAP-ENV:Body></SOAP-ENV:Envelope>"

      this.rows = this.item;
      var tempaddressarray = this.item.order_address;

      this.billingaddress = tempaddressarray.filter(
        Data => Data.address_type === "billing_address")[0];

      this.shippingaddress = tempaddressarray.filter(
        Data => Data.address_type === "shipping_address")[0];

    }
  }



  closeModal() {
    this.modalService.dismissAll();
  }

  // public CardData = [];
  DisplayInfo: boolean
  CreditBalance: any = 0
  CreditLimit: any = 0
  CreditDays: any = 0
  PaymentinfoDataAll = [];
  PaymentinfoData = [];

  card: boolean
  netbanking: boolean
  wallet: boolean
  emi: boolean
  upi: boolean

  async GetPaymentInfo(ListInput) {
    await this.OrderListService.PaymentInfo(ListInput).subscribe(

      data => {

        if (data.success == true) {


          debugger
          this.PaymentinfoData.push(data.data.gateway_detail[0])

          this.PaymentinfoDataAll = data.data;

          this.totalpartCount = data.data.order_lines.length;

          this.partConfirmedCount = data.data.order_lines.filter(ord => ord.api_status == 'Confirmed').length;
          if (this.partConfirmedCount == 0) {
            this.partStatus = "Pending"
          }
          else if (this.totalpartCount == this.partConfirmedCount) {
            this.partStatus = "Confirmed"
          }
          else if (this.partConfirmedCount > 0) {
            this.partStatus = "Partially Confirmed"
          }

          this.CreditBalance = data.data.credit_details.current_balance;
          this.CreditDays = data.data.credit_details.no_of_days;
          this.CreditLimit = data.data.credit_details.limit_amount;

          if (data.data.gateway_detail.length > 0) {
            this.DisplayInfo = true;
            if (this.PaymentinfoData[0].method == "card") {

              try {
                var jsonObj: any = JSON.parse(this.PaymentinfoData[0].card);
                this.CardData.push(jsonObj);
                this.card = true

              } catch { }
            }

            if (this.PaymentinfoData[0].method == "netbanking") {
              this.netbanking = true
            }
            if (this.PaymentinfoData[0].method == "wallet") {
              this.wallet = true
            }
            if (this.PaymentinfoData[0] == "emi") {
              this.emi = true
            }
            if (this.PaymentinfoData[0] == "upi") {
              this.upi = true
            }
          }

        }
        else {
          this.PaymentinfoData = [];
        }
      }, (err) => {
      }

    );
  }


}

export class PaymentInfo {
  order_number: string
}
