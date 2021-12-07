import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import { CommonService } from 'src/app/shared/Services/common-service.service';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-helpline-query',
  templateUrl: './helpline-query.component.html',
  styleUrls: ['./helpline-query.component.scss']
})
export class HelplineQueryComponent implements OnInit {
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;

  items: any[];
  totalrecord: number;
  showRecords: number;
  currentPage: number;
  noofrecordsperpage: number;
  public AllFilters = new FormGroup({});
  CustomerList = new FormGroup({});
  account_name: string;
  account_id: string;
  AccountName: FormGroup;
  part_number: any;



  constructor(
    private OrderListService: OrderserviceService,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    private CommonService: CommonService, ) { 
   


  }

  ngOnInit(): void {
    this.currentPage = 1
    this.noofrecordsperpage = 10
    this.showRecords = 10;


    const ListInput: ListInput1 = {} as ListInput1;

    ListInput.offset = 0;
    ListInput.limit = 10;
    this.helplineQuery(ListInput)
    const data: InputData1 = {} as InputData1
    data.size = 5;
    this.GetAccount(data);
    this.BuildFrom();
     
    

  }
  BuildFrom(){
    this.AllFilters = this.fb.group({
      email_id:[''],
      account_id:[''],
      part_number:[''],
      refrence_number:[''],
      chassis_number:[''],
      registration_number:[''],
      account_name:['']

    });

  }

  filterMyOptionsCustname(row, event) {
    this.account_id = row.account_id;
    this.account_name = row.account_name;
    if (event.target.checked) {
      for (const field1 in this.CustomerList.controls) { // 'field' is a string
        if (field1 == this.account_id) {
          this.CustomerList.get(field1).setValue(true);
        }
        else {
          this.CustomerList.get(field1).setValue(false);
        }
      }
    }
    else {
      for (const field1 in this.CustomerList.controls) { // 'field' is a string

        this.CustomerList.get(field1).setValue(false);
      }
    }
  }
  Accountnamedata: any = []
  AccountnamedataOrignal;
  GetAccount(Data1) {
    this.Accountnamedata = [];
    this.CommonService.AccountName(Data1).subscribe(
      data => {
        if (data.success == true) {

          this.Accountnamedata = [];
          ///  this.filterValue2 = null;
          // this.AccountnamedataOrignal = data.data;
          this.Accountnamedata = data.data;
          this.Accountnamedata = this.Accountnamedata.slice(0, 5)
          // for (let i = 0; i < this.Accountnamedata.length; i++) {
          //   this.Accountnamedata[i].account_name = this.Accountnamedata[i].account_name.slice(0, 15) + '...'
          // }
          this.AccountName = new FormGroup({})
          for (let formModule of this.Accountnamedata) {
            this.AccountName.addControl(formModule.account_id, new FormControl(false))
          }
          this.CustomerList = new FormGroup({})
          for (let formModule of this.Accountnamedata) {
            this.CustomerList.addControl(formModule.account_id, new FormControl(false))
          }
        }
        else {

          //this.loader.close();
          //
        }
      }, (err) => {
        // this.loader.close();
      }
    );
  }
  accountType() {
    //  alert("hii");
    this.account_name = "";
    this.account_id = "";


    const data2: InputData1 = {} as InputData1;
    data2.size = 5;
    data2.account_name = this.AllFilters.value.account_name;
    this.GetAccount(data2)
  }
  pageChange(page:any){
    this.currentPage = page;
    page = page - 1;
    const ListInput: ListInput = {} as ListInput;
        
    ListInput.offset = page - 1;

    ListInput.limit = this.noofrecordsperpage;
      this.helplineQuery(ListInput);
  


  }
  
  helplineQuery(ListInput: any) {
    
  //  this.loader.open()
    this.items = [];
   this.totalrecord = 0

    this.OrderListService.helplineQuery(ListInput).subscribe(

      data => {



        if (data.success == true) {


         // this.loader.close()

          this.items = data.data;
       

         this.totalrecord = data.total_result;
        

         this.showRecords = data.data.length

         




        }


        else {
          this.loader.close()

          // this.page.totalElements = 0;
          // this.toastrService.error(data.msg)
        }
      }, (err) => {


      }

    );



  }

  SearchAllDate(){
    this.part_number = this.AllFilters.value.part_number;
    this.account_id =this.AllFilters.value.account_id
    const ListInput: ListInput = {} as ListInput;

    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
    if (this.account_id) { ListInput.account_id = this.account_id; } else { ListInput.account_id = ""; }

    
    //ListInput.offset = 0
    ListInput.limit = this.noofrecordsperpage;
      this.helplineQuery(ListInput);
  

    this.myDrop.close()
    
  }
  resetALl(){
    
  }

}
export class ListInput1 {
  offset: number;
  limit: number;
 


}
export class ListInput {
  offset: number;
  limit: number;
  part_number: any;
  account_id: string;
 


}
export class InputData1 {
  offset: number;
  limit: number;
  size: number;
  account_name: any;
 


}
