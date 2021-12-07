import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-credit-log',
  templateUrl: './credit-log.component.html',
  styleUrls: ['./credit-log.component.scss']
})
export class CreditLogComponent implements OnInit {
  @Input() order: any;
  @Output() closemodal = new EventEmitter<any>();
  constructor( private modalService: NgbModal,) { }

  ngOnInit(): void {
  }
  closeModal() {
  this.modalService.dismissAll();
  }

}
