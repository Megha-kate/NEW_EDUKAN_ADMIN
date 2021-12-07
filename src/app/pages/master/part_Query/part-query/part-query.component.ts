import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { List } from 'src/app/pages/digi-vor-search/search-details/search-details.component';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import { CommonService } from './../../../../shared/Services/common-service.service'

@Component({
  selector: 'app-part-query',
  templateUrl: './part-query.component.html',
  styleUrls: ['./part-query.component.scss']
})
export class PartQueryComponent implements OnInit {
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;

  totalrecord: any;
  showRecords: any;
  items: any;
  currentPage: any;
  noofrecordsperpage: number;
  page: any;
  public AllFilters = new FormGroup({});
  CustomerList = new FormGroup({});
  AccountName: FormGroup;
  account_name: string;
  account_id: string;
  otc_number: any;
  part_number: any;
  Filterarray: any;
  // datepipe: any;
  date: Date;




  constructor(
    private OrderListService: OrderserviceService,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    private CommonService: CommonService,
    private datepipe: DatePipe,



  ) {

  }

  ngOnInit(): void {
    this.date = new Date();

    this.currentPage = 1;
    this.noofrecordsperpage = 10;
    this.showRecords = 10;


    const ListInput: ListInput1 = {} as ListInput1;
    // ListInput.from_date = localStorage.getItem("FromDate");
    // ListInput.to_date = localStorage.getItem("ToDate");
    ListInput.part_number = "";
    ListInput.account_id = "";
    ListInput.query = ""
    ListInput.offset = 0;
    ListInput.limit = 10;
    this.partQuery(ListInput);
    this.BuildForm();
    const data: InputData1 = {} as InputData1
    data.size = 5;
    data.account_name = "";
    this.GetAccount(data);
  }


  BuildForm() {
    this.AllFilters = this.fb.group({
      from_date: [''],
      to_date: [''],
      part_number: [''],
      account_id: [''],
      account_name: ['']
      // isecom: [''],
      // minquantity: [''],
      // distributor_category: [''],
      // pg: [''],
      // large_description: [''],
      // isassamrifile: [''],
      // isactiveforecom: ['']

    });



  }
  pageChange(page: any) {
    debugger;

    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;
    const ListInput: ListInput1 = {} as ListInput1;
    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }

    ListInput.offset = (page * 10);
  //  ListInput.limit = (page * 10) + 10;
    ListInput.limit = this.noofrecordsperpage;

    
    this.partQuery(ListInput);

  }

  partQuery(ListInput: any) {
    //console.log(ListInput)
    //
    this.FilterStrings(ListInput)

  //  this.loader.open()
    this.items = [];
    this.totalrecord = 0

    this.OrderListService.partQuery(ListInput).subscribe(

      data => {



        if (data.success == true) {


          this.loader.close()

          this.items = data.data;
          // this.page.totalElements = data.rangeInfo.total_row;

          //  this.totalrecord = data.rangeInfo.total_result;
        //  this.totalrecord = data.data.total_count;

          this.showRecords = data.data.length

          this.totalrecord = data.total_result;

          //alert(this.totalrecord)
          // this.page.totalElements = data.data.total_results;
          //this.items = this.temp = data.data.result;





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
  SearchAllDate() {
    this.account_name = this.AllFilters.value.account_name
    this.part_number = this.AllFilters.value.part_number
    const ListInput: PoInput = {} as PoInput;

    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }

    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }

    ListInput.offset = 0;
    ListInput.limit = 10;
    this.partQuery(ListInput)
    this.myDrop.close();


  }
  FilterStrings(ListInput) {
    this.Filterarray = [];
    for (let item in ListInput) {

      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'distributor_id');
    //this.Filterarray = this.Filterarray.filter(book => book.Key !== 'cr_request_type');
    var from_date1 = ListInput.from_date;
    var to_date1 = ListInput.to_date;
    var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');

    var Json1 = { "Key": 'from_date', "Value": finaldate }
    this.Filterarray.push(Json1)
  }
  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }
  resetALl() {
    this.Filterarray = [];
    this.AllFilters.reset();

    this.CustomerList.reset();
    this.BuildForm();
    this.partQuery('');
  
  }
  SearchAccount($event) {
    if ($event.key === "Enter") {
      const ListInput: ListInput1 = {} as ListInput1;
     // ListInput.from_date = localStorage.getItem("FromDate");
     // ListInput.to_date = localStorage.getItem("");
      ListInput.part_number = $event.target.value
      this.partQuery(ListInput);
    }
  }

  showAccount($event) {
    const ListInput: ListInput1 = {} as ListInput1;
    //ListInput.from_date = localStorage.getItem("FromDate");
    // ListInput.to_date = localStorage.getItem("ToDate");
    ListInput.part_number = $event.target.value
    this.partQuery(ListInput);
  }
}
export class ListInput1 {
  offset: number;
  limit: number;
  part_number: string;
  account_id: string;
  query: string;
  size: number;
  account_name: string;
  from_date: string;
  to_date: string;


}
export class InputData1 {

  size: number
  org_search_text: string
  account_name: string;
  div_search_text: string
  distributor_id: any;


}
export class PoInput {
  otc_number: any;
  account_name: string;
  part_number: any;
  offset: number;
  Size: number;
  limit: number;

  // size: number
  // org_search_text: string
  // account_name: string;
  // div_search_text: string
  // distributor_id: any;


}
