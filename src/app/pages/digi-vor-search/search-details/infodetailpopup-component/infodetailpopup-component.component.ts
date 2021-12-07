import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-infodetailpopup-component',
  templateUrl: './infodetailpopup-component.component.html',
  styleUrls: ['./infodetailpopup-component.component.scss']
})
export class InfodetailpopupComponentComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  DivData :any
  ngOnInit() {
    this.DivData = this.data.payload

  }

}
