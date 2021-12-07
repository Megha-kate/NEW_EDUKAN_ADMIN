import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tacking-reject-invoice-popup',
  templateUrl: './tacking-reject-invoice-popup.component.html',
  styleUrls: ['./tacking-reject-invoice-popup.component.scss']
})
export class TackingRejectInvoicePopupComponent implements OnInit {
  
  @Input() reject: any;
  @Output() closemodal = new EventEmitter<any>();
  constructor( private modalService: NgbModal,) { }

  Title: any;
  Message :any;
  
  ngOnInit(): void {

    if (this.reject.Title == "Invoiced")
    {
      this.Title = "Invoiced Date"
      this.Message="Selected date should be equal or greater than Invoice date" 
    }
    else{
      this.Title = "Out For Delivery Date"
      this.Message="Out For Delivery date should be equal or greater than Invoice date" 
    }
  }

  closeModal() {
    this.closemodal.emit();
  }
}
