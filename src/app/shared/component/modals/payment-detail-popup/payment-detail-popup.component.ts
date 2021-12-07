import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';

@Component({
  selector: 'app-payment-detail-popup',
  templateUrl: './payment-detail-popup.component.html',
  styleUrls: ['./payment-detail-popup.component.scss']
})
export class PaymentDetailPopupComponent implements OnInit {
  @Input() payment: any;
  @Output() closemodal = new EventEmitter<any>();

  currency: string = '₹';

  constructor(
    private OrderListService: OrderserviceService,
    private  modalService: NgbModal,
  ) { }

  ngOnInit(): void {

    const ListInputq: PaymentInfo = {} as PaymentInfo;
    ListInputq.order_number = this.payment.order_number;
    setTimeout(() => {
        this.GetPaymentInfo(ListInputq);
    }, 250);
  }

  closeModal() {
    this.modalService.dismissAll();
  }

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


                  this.CreditBalance = data.data.credit_details.current_balance;
                  this.CreditDays = data.data.credit_details.no_of_days;
                  this.CreditLimit = data.data.credit_details.limit_amount;

                  if (data.data.gateway_detail.length > 0) {
                      this.DisplayInfo = true;
                      if (this.PaymentinfoData[0].method == "card") {

                          try {
                              // var jsonObj: any = JSON.parse(this.PaymentinfoData[0].card);
                              // this.CardData.push(jsonObj);
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