import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  constructor(private modalService: NgbModal,public dialogRef: MatDialogRef<EtaPopupComponent>,@Inject(MAT_DIALOG_DATA
    ) public data: any
    ) { }

  ngOnInit(): void {

    // var TempData = this.item.filter(book => book.is_defined === false);

    var TempData = this.data.payload;
    this.item=this.data.payload
   
    if (TempData.length !== 0) {
      this.Displaylable = true;
    }
  }

  closeModal() {
  //  this.modalService.dismissAll();
    this.dialogRef.close();
  }

}
