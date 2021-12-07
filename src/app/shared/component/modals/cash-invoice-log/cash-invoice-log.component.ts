import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cash-invoice-log',
  templateUrl: './cash-invoice-log.component.html',
  styleUrls: ['./cash-invoice-log.component.scss']
})
export class CashInvoiceLogComponent implements OnInit {
  @Input() cashes: any;
  @Output() closemodal = new EventEmitter<any>();
  constructor(
    private modalService: NgbModal,

  ) { }

  ngOnInit(): void {
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
