import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-popup',
  templateUrl: './order-popup.component.html',
  styleUrls: ['./order-popup.component.scss']
})
export class OrderPopupComponent implements OnInit {
  @Input() items: any;
  @Output() closemodal = new EventEmitter<any>();
  constructor(private modalService: NgbModal,) { }

  ngOnInit(): void {
  }
  closeModal() {
    this.modalService.dismissAll();
  }
}
