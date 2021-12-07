import { Component, EventEmitter, Input, OnInit, Output ,NgModule,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
//import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'app-po-details',
  templateUrl: './po-details.component.html',
  styleUrls: ['./po-details.component.scss'],
  
})
export class PoDetailsComponent implements OnInit {
  @Input() items: any;
  @Output() closemodal = new EventEmitter<any>();
  constructor(private modalService: NgbModal,) { }

  ngOnInit(): void {
  }
  closeModal() {
    this.modalService.dismissAll();
}
}
