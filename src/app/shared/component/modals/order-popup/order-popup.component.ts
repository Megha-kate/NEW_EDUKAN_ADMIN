import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-order-popup',
  templateUrl: './order-popup.component.html',
  styleUrls: ['./order-popup.component.scss']
})
export class OrderPopupComponent implements OnInit {
  @Input() items: any;
  @Output() closemodal = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  closeModal() {
    this.closemodal.emit();
}
}
