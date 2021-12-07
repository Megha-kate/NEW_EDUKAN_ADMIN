//import { Component, OnInit } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import { AppLoaderService } from '../../app-loader/app-loader.service';


@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.scss']
})
export class InfoPopupComponent implements OnInit {

  @Output() closemodal = new EventEmitter<any>();
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private OrderListService: OrderserviceService,
    private loader: AppLoaderService,
    private dialog: MatDialog) { }

    // items:any;
    @Input() items: any;

  ngOnInit(): void {
 
     this.loader.open();
    console.log(this.items)
    const ListInput: Input1 = {} as Input1;
    ListInput.invoice_no = this.data.payload.invoice_no;
    // this.GetList(ListInput);
  }

  
  // GetList(ListInput) {
  //   debugger
  //   //alert(this.DistCode);



  //   // var json ={
  //   //   "size":10,
  //   //   "offset":0,
  //   //   "account_id":this.DistCode,
  //   //   "distributor_id":"",
  //   //   "division_id":"",
  //   //   "order_type":"",
  //   //   "from_date":"",
  //   //   "to_date":"",
  //   //   "channel":"all"
  //   //   }

  //   this.loader.open();

  //   this.OrderListService.InvoiceTAT(ListInput).subscribe(

  //     data => {
  //       debugger

  //       if (data.success == true) {
  //         // this.items=[];
  //         this.items = data.data;
  //         console.log(this.items)
  //         this.loader.close();

  //       }

  //       else {
  //         this.loader.close();
  //       }
  //     }, (err) => {
  //       this.loader.close();

  //     }
  //   );
  // }

  closeModal() {
    this.dialog.closeAll();
  }


}

export class Input1 {

  invoice_no: number
}