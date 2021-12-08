import { Component, ViewChild, TemplateRef, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

// import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import Swal from 'sweetalert2';
import { AppLoaderService } from '../../app-loader/app-loader.service';
import { CommonService } from '../../../../shared/Services/common-service.service';
import { DigiVorStockPopupComponent } from '../../modals/digi-vor-stock-popup/digi-vor-stock-popup.component'
import { MatDialogRef, MatDialog } from '@angular/material/dialog';


// import { ProductService } from '../../services/REST/product.service';
// import { MatDialogConfig, MatDialog } from '@angular/material';
// import { EDTpopupComponent } from 'src/app/shared/components/edtpopup/edtpopup.component';


@Component({
    selector: 'order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {
    @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;

    @ViewChild('etapopup', { read: TemplateRef, static: false }) etapopup: TemplateRef<any>;
    @ViewChild('paymentdetailspopup', { read: TemplateRef, static: false }) paymentdetailspopup: TemplateRef<any>;
    @ViewChild('invoicePopup', { read: TemplateRef, static: false }) invoicePopup: TemplateRef<any>;

    isshowEtaValidation: boolean = false;
    partStatus: any;
    totalpartCount: any = 0;
    partConfirmedCount: any = 0;
    isdiscountavaiable: boolean=false  //discount strike
    //@ViewChild("etamodal", { read: TemplateRef, static: false }) etatemplate: TemplateRef<any>;
    etamodalRef: any;
    OrderDetailData: any;
    isshowOrderDetails: boolean = false;
    modalRef: any;
    //@ViewChild('modal', { read: TemplateRef, static: false }) template: TemplateRef<any>;
    total_tml_rule_discount: any;
    total_dealer_rule_discount: any;
    cash_discount_rate:any;
    paymentvai: any;
    @Input() order: any;
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
    divisionAddress: any;
    showGatewayDetails: boolean = false;
    closeResult: string;

    Qty: any;
    filterValuesLECTEDsku: string;
    Divisinid: any;
    dealer_id: any;
    datas: any;
    rows: any;
    division_id: any;
    dealer_location_latitude: string;
    dealer_location_longitude: string;
    cash_discount_amt: any;
    cash_discount_amount: number;
    total_tax: number;
    constructor(
        private dialog: MatDialog,

        private toastrService: ToastrService,
        private CommonService: CommonService,
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

        const ListInput: RatingList = {} as RatingList;
        ListInput.otc_number = this.order.otc_order_number;
        this.GetRating(ListInput);

        // var Json = {
        //     "otc_number": this.order.ORDER_NO_s
        //   }
        //   this.GetPatmenthistory(Json)
        const ListInputq: PaymentInfo = {} as PaymentInfo;
        ListInputq.order_number = this.order.order_number;
        setTimeout(() => {
            this.GetPaymentInfo(ListInputq);
        }, 250);

        if (this.order.total_invoice_count > 0) {
            const ListInput1: InputOrderInvoiceDetail = {} as InputOrderInvoiceDetail;
            ListInput1.order_number = this.order.order_number;
            this.InvoiceDetails(ListInput1)
        }

        this.billingAddress = this.order.billing_address;
        this.shippingAddress = this.order.shipping_address;
        this.divisionAddress = this.order.division_address;





    }


    ERROR(msg) {
        this.toastrService.error(msg)

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

    getTotal(lineitem) {
        if (!this.isReturn && !this.isOrderInProcessSelected) {
            let finalePrice = lineitem.item_final_amount;
            let qty = lineitem.quantity
            if (lineitem.item_final_amount == "" || lineitem.item_final_amount == undefined || lineitem.item_final_amount == NaN) {
                finalePrice = 0;
            }
            if (lineitem.quantity == "" || lineitem.quantity == undefined || lineitem.quantity == NaN) {
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


            }

        );





    }

    calculation() {
        this.subTotal = 0;
        this.baseDiscount = 0;
        this.schemediscount = 0;
        this.taxTotal = 0;
        this.FinalGross = 0;
        this.total_tml_rule_discount = 0;
        this.total_dealer_rule_discount = 0;
         this.cash_discount_amount=0;
         this.order.order_line_items.forEach(element => {
            this.subTotal = Number(this.subTotal) + Number(element.rate * element.quantity);
            this.baseDiscount = Number(this.baseDiscount) + Number(element.base_discount_amount * element.quantity);
            this.schemediscount = Number(this.schemediscount) + Number(element.scheme_discount_amount * element.quantity);
            this.taxTotal = Number(this.taxTotal) + (Number(element.quantity) * Number(this.getTax(element)));
            this.FinalGross = Number(this.FinalGross) + Number(element.gross_amount);
            this.total_tml_rule_discount = Number(this.total_tml_rule_discount) + Number(element.tml_rule_discount_amount * element.quantity);
            this.total_dealer_rule_discount = Number(this.total_dealer_rule_discount) + Number(element.rule_discount_amount * element.quantity);
            this.cash_discount_amount=Number(this.cash_discount_amount) +Number(element.cash_discount_amount * element.quantity);
        });

        if(this.baseDiscount>0){
            this.isdiscountavaiable=true;
        }
        //this.orderFinalTotal = this.subTotal - this.baseDiscount - this.schemediscount - this.total_tml_rule_discount - this.total_dealer_rule_discount + this.taxTotal;
        this.orderFinalTotal = this.FinalGross;


    }

    getTax(lineitem) {
        let tax = lineitem.total_tax;
        if (lineitem.total_tax == "" || lineitem.total_tax == undefined || lineitem.total_tax == NaN) {
          tax = 0;
        }
        return Number(tax).toFixed(5);
        //return Number(tax);
      }

    orderDetailsModal: any;
   // closeResult: string;
    TempDAta: any;
    orderInformations: any;
    details(order) {
        debugger
     // this.loader.open()
      
      this.TempDAta = [];
     // debugger
  
      
      const ListInput1: InputOrderDetail = {} as InputOrderDetail;
      ListInput1.otc_number =  order.otc_order_number;
     // ListInput1.otc_number= row.otc_order_number
      //console.log(order);
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



    closeModal() {

        this.modalService.dismissAll();
        //this.etapopup.dismiss();
    }

    etadata: any;
    GetEta(orderno) {
        // this.loader.open()
        var json = {
            "order_number": orderno
        }
        this.OrderListService.GetETA(json).subscribe(

            data => {
                if (data.success == true) {

                    let ngbModalOptions: NgbModalOptions = {
                        backdrop: true,
                        keyboard: true
                    };
                    this.etadata = data.data;
                    this.modalService.open(this.etapopup, ngbModalOptions).result.then((result) => {
                        this.closeResult = `Closed with: ${result}`;
                    }, (reason: any) => {
                        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                    });
                }
                else {

                    Swal.fire(data.data.msg)
                    // this.loader.close()
                }
            }
            , (err) => {

                // this.loader.close()
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


    Data: any
    PartWiseStock(Data, item) {

        // alert(this.Divisinid);
        console.log("item", item)
        console.log("data", Data)
        this.division_id = Data.division_address.division_id
        var json = {

            "location_id": this.division_id,

            "location_type": "division",

            "app_name": "com.tatamotors.dvor"

        }
        Data.PRODUCTNAME_s = item.part_number;
        Data.QUANTITY_s = item.quantity;
        Data.DESCRIPTION_s = item.part_desc;

        this.GetDivInfo(json, Data);

        // let title = '';
        // let PartNumber = item.part_number;
        // let Qty = item.quantity;

        // let Partname = Name[0].
        // let userlatlong ="73.791199";
        // let userlat = "18.644835";
        // let OrderNo = '4f26-9574-f17373fdaaa1';
        // let dialogRef: MatDialogRef<any> = this.dialog.open(DigiVorStockPopupComponent, {
        //   panelClass: 'my-class',
        // width: '1100px',
        // height: '700px',

        //   disableClose: false,
        //   data: { title: title, payload: item, PartNumber, Qty, userlatlong, userlat }

        // })




    }




    userlat: any;
    userlong: any;



    getDetails(json1, Part, qty, partDesc) {
        document.body.scrollTop = 0;

        this.loader.open();
        console.log(json1)

        this.userlat = json1.user_latitude;
        this.userlong = json1.user_longitude;



        this.OrderListService.GETDivisorDetailData(json1).subscribe(

            data => {






                if (data.data?.length > 0) {

                    this.loader.close();
                    let title = '';
                    let PartNumber = partDesc
                    let Qty = qty
                    let userlatlong = this.userlong;
                    let userlat = this.userlat;


                    let OrderNo = '4f26-9574-f17373fdaaa1';
                    let dialogRef: MatDialogRef<any> = this.dialog.open(DigiVorStockPopupComponent, {
                        panelClass: 'my-class',
                        // width: '1100px',
                        // height: '700px',

                        disableClose: false,
                        data: { title: title, payload: data.data, PartNumber, Qty, userlatlong, userlat }

                    })


                    this.loader.close();
                }



                else {

                 Swal.fire(' Latitude/ Longitude not Available (Please Select Another Division)');


                }
            }, (err) => {

            }

        );



    }

    InvoiceBaseRating = [];
    Avergerating: any;
    async GetRating(ListInput) {
        debugger;
        this.Avergerating = "0"
        await this.OrderListService.FeedbackList(ListInput).subscribe(
            data => {
                if (data.success == true) {
                    for (let entry of data.data.result) {
                        this.Avergerating = Number(this.Avergerating) + Number(entry.rating);
                        this.InvoiceBaseRating.push(entry)
                        // alert(this.Avergerating );
                    }
                    this.Avergerating = (this.Avergerating / data.data.result.length)
                }
                else {
                    this.Avergerating = "0"
                }
            }, (err) => {
                this.Avergerating = "0"
            }
        );
    }

    GetInvoiceRatingInvoice(InvNo) {
        var Rating
        var FinalRating
        if (this.InvoiceBaseRating.length > 0) {
            Rating = this.InvoiceBaseRating.filter(book => book.invoice_no === InvNo.invoice_no);
            try {
                FinalRating = Rating[0].rating
            }
            catch (e) {
                FinalRating = 0
            }
        }
        else {
            FinalRating = 0;
        }
        return FinalRating;
    }

    OrderAmount: any;
    MenberID: any;
    rowsPaymentHistory = [];
    GetPatmenthistory(ListInput) {

        this.OrderListService.PaymentHistory(ListInput).subscribe(

            data => {

                if (data.success == true) {

                    this.rowsPaymentHistory = data.data.result;
                    this.MenberID = this.rowsPaymentHistory[0].member_id;
                    //   this.page.totalElements = this.rowsPaymentHistory.length;
                    this.OrderAmount = this.rowsPaymentHistory[0].order_amount;
                }
                else {
                }
            }, (err) => {

            }
        );
    }

    paymentDetails(orderno) {
        debugger
        var Json = {
            "order_number": orderno
        }

        this.OrderListService.GetPaymentDetails(Json).subscribe(

            data => {

                if (data.success == true) {

                    let ngbModalOptions: NgbModalOptions = {
                        backdrop: true,
                        keyboard: true
                    };
                    this.rowsPaymentHistory = data.data;
                    // this.MenberID = this.rowsPaymentHistory[0].member_id;
                    // this.OrderAmount = this.rowsPaymentHistory[0].order_amount;
                    this.modalService.open(this.paymentdetailspopup, ngbModalOptions).result.then((result) => {
                        this.closeResult = `Closed with: ${result}`;
                    }, (reason: any) => {
                        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                    });
                }
                else {
                }
            }, (err) => {

            }
        )
    }
    clear() {
        this.dealer_address = "";
        this.dealer_contact_no = "";
        this.dealer_location_latitude = "";
        this.div_city_name = "";
        this.dealer_location_longitude = "";
        this.div_name = "";
        this.dealer_name = "";
    }
    dealer_address: any
    dealer_contact_no: any

    div_city_name: any

    isaddressshow: boolean
    div_name: any;
    dealer_name: any;
    GetDivInfo(json, Data) {

        document.body.scrollTop = 0;



        var qty = Data.QUANTITY_s;
        var Part = Data.PRODUCTNAME_s;
        var partDesc = Data.PRODUCTNAME_s + '_' + Data.DESCRIPTION_s;
        this.CommonService.GETDivisiorDivisionData(json).subscribe(

            data => {

                if (data.data?.length > 0) {

                    var dealer_location_latitude = data.data[0].dealer_location_latitude

                    var dealer_location_longitude = data.data[0].dealer_location_longitude


                    var json1 = {

                        "part_num": Part,

                        "user_latitude": dealer_location_latitude,

                        "user_longitude": dealer_location_longitude,

                        "kms_range": 300,

                        "qty": qty,

                        "app_name": "com.tatamotors.dvor"

                        // "part_num": "263241303105",

                        // "user_latitude": "28.634544",

                        // "user_longitude": "77.206384",

                        // "kms_range": 300,

                        // "qty": "1",

                        // "app_name": "com.tatamotors.dvor"

                    }

                    this.getDetails(json1, Part, qty, partDesc)

                }



                else {
                this.loader.close();
                Swal.fire(' Latitude/ Longitude not Available (Please Select Another Division)');
                }

                this.loader.close()
            }, (err) => {
                alert('Error');
                this.loader.close()
               // Swal.fire(' Latitude/ Longitude not Available (Please Select Another Division)');



            }

        );
    }

    // SearchDetails(Data) {

    //     var Message = ''
    //     var Message1 = ''

    //     var qty = Data.QUANTITY_s;
    //     var Part = Data.PRODUCTNAME_s;
    //     var partDesc = Data.PRODUCTNAME_s + '_' + Data.DESCRIPTION_s;
    //     if ((this.dealer_location_latitude == "" || this.dealer_location_latitude == undefined || this.dealer_location_latitude == 'undefined')
    //         || (this.dealer_location_longitude == "" || this.dealer_location_longitude == undefined || this.dealer_location_longitude == 'undefined')) {




    //         Swal.fire(' Latitude/ Longitude not Available (Please Select Another Division)');


    //     }
    //     else {




    //         if ((this.filterValuesLECTEDsku == "" || this.filterValuesLECTEDsku == undefined || this.filterValuesLECTEDsku == 'undefined')) {
    //             if (Message == '') { Message = 'Please Select ' }

    //             Message = Message + ' Part'
    //         }

    //         if ((this.Qty.value == "" || this.Qty.value == undefined || this.Qty.value == 'undefined')) {
    //             if (Message == '') { Message = 'Please Select ' }
    //             Message = Message + ' Quantity'
    //         }


    //         // if ((this.dealer_location_latitude == "" || this.dealer_location_latitude == undefined || this.dealer_location_latitude == 'undefined')
    //         //   || (this.dealer_location_longitude == "" || this.dealer_location_longitude == undefined || this.dealer_location_longitude == 'undefined')) {
    //         //   Message1 = ' Latitude/ Longitude not Avaialble (Please Select Another Division)'
    //         // }



    //         if ((this.filterValuesLECTEDsku == "" || this.filterValuesLECTEDsku == undefined || this.filterValuesLECTEDsku == 'undefined')
    //             || (this.dealer_location_latitude == "" || this.dealer_location_latitude == undefined || this.dealer_location_latitude == 'undefined')
    //             || (this.dealer_location_longitude == "" || this.dealer_location_longitude == undefined || this.dealer_location_longitude == 'undefined')
    //             || (this.Qty.value == "" || this.Qty.value == undefined || this.Qty.value == 'undefined')
    //         ) {
    //             Swal.fire(Message + '<br/>' + Message1)
    //         }
    //         else {
    //             var json1 = {

    //                 "part_num": Part,

    //                 "user_latitude": this.dealer_location_latitude,

    //                 "user_longitude": this.dealer_location_longitude,

    //                 "kms_range": 300,

    //                 "qty": qty,

    //                 "app_name": "com.tatamotors.dvor"

    //                 // "part_num": "263241303105",

    //                 // "user_latitude": "28.634544",

    //                 // "user_longitude": "77.206384",

    //                 // "kms_range": 300,

    //                 // "qty": "1",

    //                 // "app_name": "com.tatamotors.dvor"

    //             }



    //         }
    //         this.getDetails(json1, Part, qty, partDesc)

    //     }


    // }



    DisplayInfo: boolean
    CreditBalance: any = 0
    CreditLimit: any = 0
    CreditDays: any = 0
    PaymentinfoDataAll = []
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


    invoiceDetails = []
    InvoiceDetails(ListInput1) {
        this.OrderListService.GetInvoiceList(ListInput1).subscribe(
            data1 => {
                if (data1.success == true) {
                    this.invoiceDetails = data1.data;
                    this.loader.close();
                }
                else {
                    this.loader.close()
                    this.toastrService.error(data1.msg)
                }
            }, (err) => {
                this.loader.close();
            }
        );
    }

    invoiceData = [];
    Titile: string;
    invoiceotc: string;
    openInvoicePopup(row) {
        console.log(row)
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
            }
        );
    }


}

export interface cancel_parts_detail {
    part_number: string;
    row_id: string;
}

export class RatingList {
    otc_number: string
    invoice_no: string
}

export class PaymentInfo {
    order_number: string
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

export class ListInput {
    invoice_no: string
}

export class InputOrderDetail {
    order_number: string
    otc_number: string;
  }




