import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-customer-list-popup',
  templateUrl: './customer-list-popup.component.html',
  styleUrls: ['./customer-list-popup.component.scss']
})
export class CustomerListPopupComponent implements OnInit {
  @Input() data: any;
  @Input() accountname: any;
  @Input() accountid: any;
  @Output() closemodal = new EventEmitter<any>();

  constructor(  private modalService: NgbModal
    ) {
 

  
  }


 
  ngOnInit() {
    console.log("account Name =" + this.accountname)
    console.log("account ID =" + this.accountid)
    console.log("data" + this.data)
  }

  closeModal() {
    this.modalService.dismissAll();
  }


  
}


export class ListInput {
  offset: number
  size:number
  account_id: string
}




export class responsedata {

  ORGANIZATION_ID_s: string
  organization_name: string
  DISCOUNT_CODE_s: string
  CUSTOMER_SEG_s: string
  START_DATE_dt: string
  LAST_UPD_dt: string
  DIV_ID_s: string
  DIV_NAME_s: string
  ADJUSTMENT_AMOUNT_s: string
  contentType: string
  CREATED_dt: string
}

export enum ColumnMode {
  standard = 'standard',
  flex = 'flex',
  force = 'force'
}