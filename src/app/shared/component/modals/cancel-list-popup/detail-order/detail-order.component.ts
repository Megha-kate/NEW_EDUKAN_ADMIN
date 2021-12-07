import { Component, ViewChild, TemplateRef, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';

// import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
// import { ProductService } from '../../services/REST/product.service';
// import { MatDialogConfig, MatDialog } from '@angular/material';
// import { EDTpopupComponent } from 'src/app/shared/components/edtpopup/edtpopup.component';


@Component({
    selector: 'details-order',
    templateUrl: './details-order.component.html',
    styleUrls: ['./details-order.component.scss']
})
export class DetailsOrderComponent implements OnInit {
   
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
    showGatewayDetails: boolean = false;
    constructor(
        private toastrService: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,

        private modalService: NgbModal,
        private OrderListService: OrderserviceService,
    ) {


    }

    ngOnInit() {

        console.log(this.order)
        this.calculation();

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
        console.log(row)





        var Json


        Json = {
            "invoice_no": row.INVC_NUM_s
        }




        this.OrderListService.InvoiceList(Json).subscribe(

            data => {


                if (data.success == true) {

                    console.log(data)

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
        this.order.line_items.forEach(element => {
            this.subTotal = Number(this.subTotal) + Number(element.RATE_s * element.QUANTITY_s);
            this.baseDiscount = Number(this.baseDiscount) + Number(element.BASE_DISCOUNT_AMNT * element.QUANTITY_s);
            this.schemediscount = Number(this.schemediscount) + Number(element.SCHEME_DISCOUNT_AMNT * element.QUANTITY_s);
            this.taxTotal = Number(this.taxTotal) + (Number(element.QUANTITY_s) * Number(this.getTax(element)));
            this.FinalGross = Number(this.FinalGross) + Number(element.GROSS_AMOUNT);
            this.total_tml_rule_discount = Number(this.total_tml_rule_discount) + Number(element.TML_RULE_DISCOUNT_AMNT * element.QUANTITY_s);
            this.total_dealer_rule_discount = Number(this.total_dealer_rule_discount) + Number(element.DEALER_RULE_DISCOUNT_AMNT * element.QUANTITY_s);
        });
        //this.orderFinalTotal = this.subTotal - this.baseDiscount - this.schemediscount - this.total_tml_rule_discount - this.total_dealer_rule_discount + this.taxTotal;
        this.orderFinalTotal = this.FinalGross;
    }

    getTax(lineitem) {
        let tax = lineitem.TOTAL_TAX_s;
        if (lineitem.TOTAL_TAX_s == "" || lineitem.TOTAL_TAX_s == undefined || lineitem.TOTAL_TAX_s == NaN) {
            tax = 0;
        }
        return Number(tax).toFixed(5);
        //return Number(tax);
    }





    closeModal() {

        this.modalService.dismissAll();
    }



}

export interface cancel_parts_detail {
    part_number: string;
    row_id: string;
}