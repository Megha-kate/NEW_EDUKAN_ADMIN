import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { egretAnimations } from 'app/shared/animations/egret-animations';

@Component({
  selector: 'app-comment-popup',
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.scss']
})
export class CommentPopupComponent implements OnInit {

constructor( @Inject(MAT_DIALOG_DATA
  ) public data: any,
public dialogRef: MatDialogRef<CommentPopupComponent>,) { }
@Output() closemodal = new EventEmitter<any>();

Comment :any;
Rating :any;
FisrtName: any;
AccountId:any
lastname: any
Mobilenumber: any;
Address: any;
Fullname: any;
Category: any;
FinalComment: any;
ContactDetails :any;


  ngOnInit() {
    this.Comment = this.data.payload.comment;
    this.Rating = this.data.payload.rating;


    // this.AccountId= this.data.payload.account_data.account_id;
    // this.FisrtName = this.data.payload.account_data.name;
    // this.Mobilenumber = this.data.payload.account_data.phone_number;
    this.Address = this.data.payload.account_data.address +this.data.payload.account_data.address_line_2 +  this.data.payload.account_data.address_line_3


   // this.Comment ='this is very usefull comment nt test ok ang setr vd sdfsdfgfju fdgfdhhfufdsfdsf  dgfgffhti  gdsgfsdgii fdsgfdgfiii dcvfdfdhhfu dffdgvfewtewt dfgfdfdhtunsvgfsdgfsj'

  }
  closeModal() {

    this.dialogRef.close();
  }
}

