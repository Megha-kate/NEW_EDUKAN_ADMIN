import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order-popup',
  templateUrl: './order-popup.component.html',
  styleUrls: ['./order-popup.component.scss']
})
export class OrderPopupComponent implements OnInit {
  @Input() items: any;
  @Output() closemodal = new EventEmitter<any>();
  Displaylable : boolean = false
  constructor(private modalService: NgbModal,public dialogRef: MatDialogRef<OrderPopupComponent>,@Inject(MAT_DIALOG_DATA
    ) public data: any
    ) { }

  ngOnInit(): void {
    var TempData = this.data.payload;
    this.items=this.data.payload
   
    if (TempData.length !== 0) {
      this.Displaylable = true;
    }
  }

  closeModal() {
  //  this.modalService.dismissAll();
    this.dialogRef.close();
  }
}
