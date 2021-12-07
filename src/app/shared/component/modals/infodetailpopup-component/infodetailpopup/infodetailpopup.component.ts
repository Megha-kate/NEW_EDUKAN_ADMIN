import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-infodetailpopup',
  templateUrl: './infodetailpopup.component.html',
  styleUrls: ['./infodetailpopup.component.scss']
})
export class InfodetailpopupComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public Data: any) { }
  DivData :any
  ngOnInit() {
    this.DivData = this.Data.payload

  }

}
