//import { Component, OnInit } from '@angular/core';
//import { DataPassService } from 'app/shared/services/MyServices/data-pass.service';
import { DataPassServiceService } from "../../../../shared/Services/data-pass-service.service"
import { Router } from '@angular/router';
//import { OrderListService } from '../../../shared/services/MyServices/order-list.service';
import { OrderserviceService } from '../../../../shared/Services/orderservice.service';
//import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { AppLoaderService } from '../../../../shared/component/app-loader/app-loader.service'
import { Component, OnInit, Input,  TemplateRef, ViewChild } from "@angular/core";
import { MatDialogRef, MatDialog,  } from '@angular/material/dialog';
//import { OrderPopupComponent } from '../order-popup/order-popup.component';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { CommentPopupComponent } from '../../../component/modals/comment-popup/comment-popup.component'
import { ModalDismissReasons, NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { DatePipe } from "@angular/common";
import { InfoPopupComponent } from "../info-popup/info-popup.component";
import { OrderPopupComponent } from "../order-popup/order-popup.component";
//import { CommentPopupComponent } from '../../orders-list/feedback-list/comment-popup/comment-popup.component'
@Component({
  selector: 'app-invoice-copy',
  templateUrl: './invoice-copy.component.html',
  styleUrls: ['./invoice-copy.component.scss']
})
export class InvoiceCopyComponent implements OnInit {
  @Input() appChildMessage: string;
  @Input() data: any;
  @Input() otcnumber: any;
  @Input() titile: any;

  @ViewChild('invoiceDetails', { read: TemplateRef, static: false }) invoiceDetails: TemplateRef<any>;
  @ViewChild('invoicePopup', { read: TemplateRef, static: false }) invoicePopup: TemplateRef<any>;

  // url: string = "";
  url: string = "";
  urlSafe: SafeResourceUrl;
  InvoiceSpecificRating: any

  public InvoiceItem = [];
  InvoiceCopyURL: any;
  InvoiceStatus: any;
  TrackDate: any;
  invoiceNo: any;
  OTCNumber: any
  Date: any;
  Rating:any
  closeResult: string;

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: any,
  // public dialogRef: MatDialogRef<CommentPopupComponent>, 
    private dataPass: DataPassServiceService, private router: Router,
    private OrderListService: OrderserviceService, private loader: AppLoaderService, private dialog: MatDialog,
    public sanitizer: DomSanitizer,
    private modalService: NgbModal,
    private datepipe: DatePipe,
  ) { }


  TabChange(tab) {





  }



  ngOnInit() {


    this.InvoiceItem = this.data;
    this.InvoiceCopyURL = this.data.invoice_url;
    this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.InvoiceCopyURL);

    this.invoiceNo = this.titile;
    this.OTCNumber = this.otcnumber;
    this.InvoiceStatus = this.data.invoice_status
    this.Date = this.data.tracking_date
    this.Rating = this.data.payload.rating;


  }

  GetInvoiceRatingInvoice() {


    const ListInput: RatingList = {} as RatingList;
    ListInput.otc_number = this.OTCNumber;
    ListInput.invoice_no = this.invoiceNo;


    // setTimeout(() => {

    // }, 50);

    if (this.InvoiceSpecificRating == "" || this.InvoiceSpecificRating == undefined) {
      this.GetIndividualInvoiceRating(ListInput);
    }


    return this.InvoiceSpecificRating


  }


  GetIndividualInvoiceRating(ListInput) {

    var Rating

    debugger
    this.OrderListService.FeedbackList(ListInput).subscribe(

      data => {
        debugger



        if (data.success == true) {


          this.InvoiceSpecificRating = data.data.result[0].rating
          //   Rating = 3


        }



        else {
          //  Rating = 1
          this.InvoiceSpecificRating = 0;
        }
      }, (err) => {

        this.InvoiceSpecificRating = 0;
      }

    );



  }




  openPopUp(isNew?) {
    let title = isNew ? '' : '';

    const ListInput: Input1 = {} as Input1;

    ListInput.invoice_no = this.invoiceNo;


    // //var Josn: { "invoice_no": "Bafna-T-OTC-1516-00047" };
    // //let data1: 'Bafna-T-OTC-1516-00047';
    let OrderNo = this.data;
    let dialogRef: MatDialogRef<any> = this.dialog.open(InfoPopupComponent, {
      width: '700px',
      disableClose: false,
      data: { title: title, payload: ListInput, OrderNo: OrderNo }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if (!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        // if (isNew) {
        //   //this.crudService.addItem(res)
        //   // .subscribe(data => {
        //   //   this.items = data;
        //   //   this.loader.close();
        //   //   this.snack.open('Member Added!', 'OK', { duration: 4000 })
        //   // })
        // } else {
        //   // this.crudService.updateItem(data._id, res)
        //   //   .subscribe(data => {
        //   //     this.items = data;
        //   //     this.loader.close();
        //   //     this.snack.open('Member Updated!', 'OK', { duration: 4000 })
        //   //   })
        // }
      })
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

  openPopUpRating() {
    //this.loader.open();

    const ListInput: RatingList = {} as RatingList;
    ListInput.otc_number = this.OTCNumber;
    ListInput.invoice_no = this.invoiceNo;

    this.GetInvoiceRating(ListInput);
  }

  GetInvoiceRating(ListInput) {


    debugger
    this.OrderListService.FeedbackList(ListInput).subscribe(

      data => {
        debugger

        if (data.success == true) {

          let title = "";
          let dialogRef: MatDialogRef<any> = this.dialog.open(CommentPopupComponent, {
            width: '720px',
            disableClose: false,
            data: { title: title, payload: data.data.result[0] }
          })



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
    openInvoicePopup() {
      this.loader.open();
        const ListInput1: Input1 = {} as Input1;
        ListInput1.invoice_no = this.invoiceNo;

        this.OrderListService.InvoiceTAT(ListInput1).subscribe(

            data => {
                debugger
                if (data.success == true) {

                    this.invoiceData = data.data
                    //console.log(this.invoiceData)

                    // let ngbModalOptions: NgbModalOptions = {
                    //     backdrop: true,
                    //     keyboard: true
                    // };
                    // this.modalService.open(this.invoicePopup, ngbModalOptions).result.then((result) => {
                    //     this.closeResult = `Closed with: ${result}`;
                    // }, (reason: any) => {
                    //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
                    // });
                    var title = ''
                    let dialogRef: MatDialogRef<any> = this.dialog.open(OrderPopupComponent, {
                        width: '800px',
                        disableClose: false,
                        data: { title: title, payload: data.data }
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




export class PaymentInfo {

  order_number: string

}
export class RatingList {

  otc_number: string
  invoice_no: string
}

export class Input1 {

  invoice_no: string
  position_id: string;
  position_name: string;
  role_id: string;


  // offset:number
}

export class InputInvoiceDetail {
  invoice_no: number;
}






