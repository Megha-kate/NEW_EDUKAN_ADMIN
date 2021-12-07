import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-eta-popup',
  templateUrl: './eta-popup.component.html',
  styleUrls: ['./eta-popup.component.scss']
})
export class EtaPopupComponent implements OnInit {

  @Input() item: any;
  @Output() closemodal = new EventEmitter<any>();
  Displaylable : boolean = false
  constructor(private modalService: NgbModal,
    ) { }

  ngOnInit(): void {

    var TempData = this.item.filter(book => book.is_defined === false);

  
   
    if (TempData.length !== 0) {
      this.Displaylable = true;
    }
  }

  closeModal() {
    this.modalService.dismissAll();
  }

}
