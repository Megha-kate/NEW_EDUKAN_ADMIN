import { Component, EventEmitter, Input, OnInit, Output ,NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataPassServiceService } from 'src/app/shared/Services/data-pass-service.service';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import Swal from 'sweetalert2';
//import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-po-details',
  templateUrl: './po-details.component.html',
  styleUrls: ['./po-details.component.scss'],
  
})
export class PoDetailsComponent implements OnInit {
  @Input() items: any;
  @Output() closemodal = new EventEmitter<any>();
  dialog: any;
  constructor(private modalService: NgbModal,private OrderListService: OrderserviceService, private dataPass: DataPassServiceService,) { }

  ngOnInit(): void {
    console.log(this.items);
    const ListInput1: InputOrderDetail = {} as InputOrderDetail;
    ListInput1.po_row_id =""
    this.viewPodetails(ListInput1)
    
  }

  
  closeModal() {
    this.modalService.dismissAll();
}

viewPodetails (data: any, isNew?) {


  // debugger
  // if (data.otc_number == null) {
  //   Swal.fire('Please Check Details After Some Time')
  //   return false
  // }


  

  //  this.dataPass.setPoDetails(data);
//  this.CommonService.PoDetailCheck.next('show');
  // this.router.navigate(['pages/PoOrderDetails']);
  
  //this.loader.open();
  const ListInput1: InputOrderDetail = {} as InputOrderDetail;
  ListInput1.po_row_id = data

  this.OrderListService.PoList1(ListInput1).subscribe(

    data => {
      debugger

      if (data.success == true) {
        //this.loader.close();

       // console.log(data.data);

        // if (data.data.result.line_items[0].length > 0) {
          var TempDAta = data.data.result;
          this.dataPass.setOrderListData(TempDAta);
          let title = '';
          // po_row_id = '';
          let dialogRef: MatDialogRef<any> = this.dialog.open(PoDetailsComponent, {
            panelClass: 'my-class',
            disableClose: false,
            data: { title: title, }

          })
         // this.loader.close();
        // }
        // else {
        //   Swal.fire('Please Check Details After Some Time');
        //   this.loader.close();
        // }
      }
      else {
        Swal.fire('Please Check Details After Some Time');
        //this.loader.close();
      }
    }, (err) => {
      Swal.fire('Please Check Details After Some Time');
      //this.loader.close();

    }

  );

}
}
export class InputOrderDetail {
  otc_order_no: string
  otc_number: any;
  po_row_id: any;
}