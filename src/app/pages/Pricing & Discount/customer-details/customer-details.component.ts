import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import Swal from 'sweetalert2';
import { CommonService } from '../../../shared/Services/common-service.service';
import { List } from '../../digi-vor-search/search-details/search-details.component';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {
  @ViewChild('orderDetails', { read: TemplateRef, static: false }) orderDetails: TemplateRef<any>;
  @ViewChild('customerdetails', { read: TemplateRef, static: false }) customerdetails: TemplateRef<any>;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;

  items: any;
  totalrecord: number;
  AccountCount: any;
  currentPage: any;
  CustomerList = new FormGroup({});
  public AllFilters= new FormGroup({});
  account_name: string;
  account_id: string;
  AccountName: FormGroup;
  //StateData = [];
  status: any;
  city: any;
  contact_no: any;
  district: any;
  page: any;
  temp: any;
  noofrecordsperpage: number;
  Filterarray: any[];
  closeResult: string;
  // ExcelDownload: any;
  toastrService: any;
  dataPass: any;
  // dialog: any;
  CustomerData: any;
  totalElements: number;
  total: any;
  state: string;
  // getDismissReason: any;
  showRecords: number;
  EDownload: any;
  count: number;
  pageName: string;
  ContactNo: any;
  Custname: any;
  tableOffset: any;




  constructor(
    private OrderListService: OrderserviceService,
    private CommonService: CommonService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private dialog: MatDialog,

    private loader: AppLoaderService,
  ) {

  }

  ngOnInit(): void {
    this.currentPage = 1
    this.noofrecordsperpage = 10
    this.showRecords = 10;

    const ListInput: ListInput1 = {} as ListInput1;
    ListInput.offset = 10
    ListInput.size = 10
    ListInput.account_name = ""
    ListInput.contact_no = ""
    ListInput.state = ""
    ListInput.city = ""
    ListInput.district = ""
     ListInput.user_type = "FO"


    this.GetList(ListInput);
    const data: InputData1 = {} as InputData1
    data.size = 5;
    data.account_name = "";
    this.GetAccount(data);
    const ExportArrayInput5: InputDat4 = {} as InputDat4;
    ExportArrayInput5.size = 5;
    this.GetStateData();

    this.BuildForm();
  }


  Total_Element: any;

  //AccountCount:any
  GetList(ListInput) {
   this.FilterStrings(ListInput)

    this.Total_Element;


    debugger
    this.OrderListService.GetAccountList(ListInput).subscribe(

      data => {



        if (data.success == true) {


          this.loader.close()
         

          this.items = data.Data;



          this.totalrecord = data.Total_Element;
          this.showRecords = data.Data.length
         



        }


        else {
          this.loader.close()

          this.toastrService.error(data.data.msg)
        }
      }, (err) => {


      }

    );



  }

  SearchAccount(event) {
    if (event.key === "Enter") {


      const ListInput: Input = {} as Input;

      ListInput.account_name = "";
      // ListInput.account_type = "RT";
      ListInput.customer_segment = "";
      ListInput.offset = 0;
      ListInput.from_date = "";
      ListInput.to_date = "";
      ListInput.account_id = event.target.value;

      this.GetList(ListInput);
    }
  }
  // GetStateData() {
  //   this.StateData = []

  //   var Json = {
  //     "dropdown_type": "state",
  //     "multi_district": [],
  //     "multi_taluka": [],
  //     "multi_city": [],
  //     "offset": 0,
  //     "limit": 10000    }

  //   this.CommonService.GetstateNew(Json).subscribe(
  //     data => {
  //       if (data.success == true) {


  //         for (let entry of data.data.States) {

  //           if (entry.state_code != undefined) {
  //             this.StateData.push(entry)
  //           }
  //         }
  //       }
  //       else {
  //       }
  //     }, (err) => {

  //     }
  //   );
  // }
  StateData: any;
  GetStateData() {
    this.StateData = []

    var Json = {
      "dropdown_type": "state",
      "multi_district": [],
      "multi_taluka": [],
      "multi_city": [],
      "offset": 0,
      "limit": 10000
    }

    this.CommonService.GetstateNew(Json).subscribe(
      data => {
        if (data.success == true) {
          for (let entry of data.data.States) {

            if (entry.state_code != undefined) {
              this.StateData.push(entry)
            }
          }
        }
        else {
        }
      }, (err) => {

      }
    );
  }


  Data = {
    "success": true,
    "data": [
      {
        "state_name": "Andaman and Nicobar Islands",
        "state_code": "AN"
      },
      {
        "state_name": "Andhra Pradesh",
        "state_code": "AP"
      },
      {
        "state_name": "Arunachal Pradesh",
        "state_code": "AR"
      },
      {
        "state_name": "Assam",
        "state_code": "AS"
      },
      {
        "state_name": "Bihar",
        "state_code": "BR"
      },
      {
        "state_name": "Chhattisgarh",
        "state_code": "CG"
      },
      {
        "state_name": "Chandigarh",
        "state_code": "CH"
      },
      {
        "state_name": "Daman and Diu",
        "state_code": "DD"
      },
      {
        "state_name": "Delhi",
        "state_code": "DL"
      },
      {
        "state_name": "Dadra and Nagar Haveli",
        "state_code": "DN"
      },
      {
        "state_name": "Goa",
        "state_code": "GA"
      },
      {
        "state_name": "Gujarat",
        "state_code": "GJ"
      },
      {
        "state_name": "Himachal Pradesh",
        "state_code": "HP"
      },
      {
        "state_name": "Haryana",
        "state_code": "HR"
      },
      {
        "state_name": "Jharkhand",
        "state_code": "JH"
      },
      {
        "state_name": "Jammu and Kashmir",
        "state_code": "JK"
      },
      {
        "state_name": "Karnataka",
        "state_code": "KA"
      },
      {
        "state_name": "Kerala",
        "state_code": "KL"
      },
      {
        "state_name": "Lakshadweep",
        "state_code": "LD"
      },
      {
        "state_name": "karnataka",
        "state_code": "KA"
      },
      {
        "state_name": "Maharashtra",
        "state_code": "MH"
      },
      {
        "state_name": "Meghalaya",
        "state_code": "ML"
      },
      {
        "state_name": "Manipur",
        "state_code": "MN"
      },
      {
        "state_name": "Madhya Pradesh",
        "state_code": "MP"
      },
      {
        "state_name": "Mizoram",
        "state_code": "MZ"
      },
      {
        "state_name": "Nagaland",
        "state_code": "NL"
      },
      {
        "state_name": "Odisha",
        "state_code": "OD"
      },
      {
        "state_name": "Odisha",
        "state_code": "OR"
      },
      {
        "state_name": "Punjab",
        "state_code": "PB"
      },
      {
        "state_name": "Puducherry",
        "state_code": "PY"
      },
      {
        "state_name": "Rajasthan",
        "state_code": "RJ"
      },
      {
        "state_name": "Sikkim",
        "state_code": "SK"
      },
      {
        "state_name": "Tamil Nadu",
        "state_code": "TN"
      },
      {
        "state_name": "Tripura",
        "state_code": "TR"
      },
      {
        "state_name": "Telangana",
        "state_code": "TS"
      },
      {
        "state_name": "Uttarakhand",
        "state_code": "UK"
      },
      {
        "state_name": "Uttar Pradesh",
        "state_code": "UP"
      },
      {
        "state_name": "West Bengal",
        "state_code": "WB"
      }
    ]
  }


  // StateData = []

  // GetState() {
  //   debugger

  //   this.CommonService.GetstateNew(Date).subscribe(
  //     data => {
  //       if (data.success == true) {
  //         this.StateData = data.data;




  //       }
  //       else {
  //       }
  //     }, (err) => {
  //     });
  // }

  // state: any;
  // selectedOptions = [];
  // TempproductTypeDisplay: any;
  // getstateoption(selected2) {

  //   this.state = selected2;
  //   console.log(this.selectedOptions)
  //   // this.ItemSKU = [];
  //   /// this.SKU = [];
  //   //this.SKU = []
  //   // this.selectedSKU = []
  //   //  this.selectedSKUDisplay = [];

  //   this.TempproductTypeDisplay = [];


  //   if (this.state.length > 0) {


  //     alert(this.state)



  //   }
  // }
  BuildForm() {
    this.AllFilters = this.fb.group({
      account_name: [''],
      district: [''],
      city: [''],
      contact_no: [''],
      state: ['']

    });
  }
  resetALl() {
    this.AllFilters.reset();
    this.CustomerList.reset();
    this.BuildForm();
    const data: InputData1 = {} as InputData1
   // data.size = 5;
    data.account_name = "";
    this.GetAccount(data);
    const ListInput: ListInput = {} as ListInput;
    ListInput.size = 10;

    this.GetList(ListInput);




  }
  SearchAllDate() {
    const ListInput: Customerinput = {} as Customerinput;
   // this.currentPage = this.page;

    ListInput.offset = 0;
    ListInput.user_type = "FO"
    
    this.contact_no = this.AllFilters.value.contact_no
    this.city = this.AllFilters.value.city
    this.status = this.AllFilters.value.status
    this.district = this.AllFilters.value.district
    this.state = this.AllFilters.value.state;
    //this.state = $event.state


    if (this.status) { ListInput.status = this.status; } else { ListInput.status = ""; }
    if (this.city) { ListInput.city = this.city; } else { ListInput.city = ""; }
    // if (this.state) { ListInput.shipping_state = this.state; } else { ListInput.shipping_state = ""; }
    if (this.state) { ListInput.state = this.state; } else { ListInput.state = ""; }

    if (this.contact_no) { ListInput.contact_no = this.contact_no; } else { ListInput.contact_no = ""; }
    if (this.district) { ListInput.district = this.district; } else { ListInput.district = ""; }
    if (this.account_name) { ListInput.account_name = this.account_name; } else { ListInput.account_name = ""; }


   // ListInput.offset = this.page - 1;
    ListInput.size = this.noofrecordsperpage;

    // ListInput.offset = 0
    // ListInput.size = 10;

    this.GetList(ListInput);
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
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'user_type');

  }


  ExportDownload() {
    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
    //   if (this.totalrecord == 0) {
    //     Swal.fire("No Data For downloding");
    //   } else {
        const AllFilters: ListInput5 = {} as ListInput5;

        // if (this.distributor_name) { AllFilters.org_name = this.distributor_name; } else { AllFilters.org_name = ""; }

        // if (this.AllFilters.value.otc_number) { AllFilters.otc_order_number = this.AllFilters.value.otc_number; } else { AllFilters.otc_order_number = ""; }

        // if (this.AllFilters.value.cancel_order_number) { AllFilters.cancel_order_number = this.AllFilters.value.cancel_order_number; } else { AllFilters.cancel_order_number = ""; }

        // if (this.from_date) { AllFilters.from_date = this.from_date; } else { AllFilters.from_date = ""; }

        // if (this.to_date) { AllFilters.to_date = this.to_date; } else { AllFilters.to_date = ""; }

        // if (this.account_name) { AllFilters.account_name = this.account_name; } else { AllFilters.account_name = ""; }
        // if (this.division_id) { AllFilters.division_name = this.division_id; } else { AllFilters.division_name = ""; }

        AllFilters.size = this.totalrecord;
        AllFilters.offset = 0;

        this.EDownload = AllFilters;
        this.count = this.totalrecord;
        this.pageName = "CustomerDetails";
        let ngbModalOptions: NgbModalOptions = {
          backdrop: true,
          keyboard: true
        };
        this.modalService.open(this.ExcelDownload, ngbModalOptions).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });

      }
    
  


  orderDetailsModal: any;
  TempDAta: any;
  orderInformations: any;
  //GetAccountList 
  //AccountCount: any;
  AccountDataPrepareArray = [];
  accountName: string;
  accountID: string;
  details = [];
  GetAccountList(row) {
    debugger;
    this.AccountDataPrepareArray = [];
    //this.totalElements=0;
    this.total = 0;
    this.loader.open();
    const ListInput4: Inputaccount = {} as Inputaccount;
    ListInput4.account_id = row.account_id;

    this.OrderListService.GetAccountDiscountMatrix(ListInput4).subscribe(
      data => {
        if (data.success == true) {
          debugger;

          for (let entry of data.discount_data) {
            var discountmatrix = entry.discount_matrix.sort((a, b) => a.DISCOUNT_CODE_s > b.DISCOUNT_CODE_s ? 1 : -1);
            for (let objmatrix of discountmatrix) {
              const objdata: InputOrderDetail = {} as InputOrderDetail;
              objdata.ORGANIZATION_ID_s = entry.ORGANIZATION_ID_s
              objdata.organization_name = entry.organization_name
              objdata.DISCOUNT_CODE_s = objmatrix.DISCOUNT_CODE_s
              objdata.CUSTOMER_SEG_s = objmatrix.CUSTOMER_SEG_s
              objdata.START_DATE_dt = objmatrix.START_DATE_dt
              objdata.LAST_UPD_dt = objmatrix.LAST_UPD_dt
              objdata.DIV_ID_s = objmatrix.DIV_ID_s
              objdata.DIV_NAME_s = objmatrix.DIV_NAME_s
              objdata.ADJUSTMENT_AMOUNT_s = objmatrix.ADJUSTMENT_AMOUNT_s
              objdata.contentType = objmatrix.contentType
              objdata.CREATED_dt = objmatrix.CREATED_dt
              this.AccountDataPrepareArray.push(objdata);
            }

          }
          this.loader.close();
        }
        else {
          this.total = data.TotalElement;
          //this.items = [];
          //this.temp = [];
          this.loader.close();

        }
      });

    console.log(this.AccountDataPrepareArray);
    this.details = this.AccountDataPrepareArray;
    this.accountID = row.account_id;
    this.accountName = row.account_name;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: true,
      keyboard: true
    };

    this.modalService.open(this.customerdetails, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });



  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // openPopUp(data: any = {}, isNew?) {
  //   // this.dataPass.setCustomerDetails(data);
  //   let dialogRef: MatDialogRef<any> = this.dialog.open(CustomerListComponent, {
  //     width: '800px',
  //     disableClose: false,
  //     data: { payload: data }
  //   })
  //   dialogRef.afterClosed()
  //     .subscribe(res => {
  //       if (!res) {
  //         return;
  //       }
  //     })
  // }

  onRemoveFilter(filterString) {
    let Filterarrays = this.Filterarray;
    if (filterString.Key == "contact_no") {
      this.contact_no = "";
      this.AllFilters.get("contact_no").setValue("")
      this.AllFilters.get('contact_no').setValue("");
    }
    else if (filterString.Key == "account_name") {
      this.account_id = "";
      this.account_name = "";
      this.AllFilters.get('account_name').setValue("");

    }
    else if (filterString.Key == "account_name") {
      this.account_id = "";
      this.account_name = "";
      this.AllFilters.get('account_name').setValue("");
      const data: InputData1 = {} as InputData1
      data.size = 5;
      data.account_name = "";
      this.GetAccount(data);
    }
    else if (filterString.Key == "district") {
      this.district = ""
      this.AllFilters.get("district").setValue("")
    }
    else if (filterString.Key == "state") {
      this.state = ""
      this.AllFilters.get("state").setValue("")
    }
    else if (filterString.Key == "city") {
      this.city = ""
      this.AllFilters.get("city").setValue("")
    }

    this.SearchAllDate();
  }

  showAccount(event) {

    const ListInput: Input = {} as Input;

    ListInput.account_name = "";
    //ListInput.account_type = "RT";
    ListInput.customer_segment = "";
    ListInput.offset = 10;

    ListInput.account_id = event.target.value;
    this.GetList(ListInput);


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
  pageChange(page) {
    document.body.scrollTop = 0;
    this.currentPage = page;

    
    //this.tableOffset = page.offset;
    const ListInput: ListInputAll = {} as ListInputAll;

    if (this.Custname) { ListInput.account_name = this.Custname; } else { ListInput.account_name = ""; }
    if (this.ContactNo) { ListInput.contact_no = this.ContactNo; } else { ListInput.contact_no = ""; }
    if (this.state) { ListInput.state = this.state; } else { ListInput.state = ""; }
    if (this.city) { ListInput.city = this.city; } else { ListInput.city = ""; }
    if (this.district) { ListInput.district = this.district; } else { ListInput.district = ""; }

    
    ListInput.offset = page - 1;

    ListInput.size = this.noofrecordsperpage;
    this.GetList(ListInput);


  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  omitSpecialChar(event) {
    const keyPressed = String.fromCharCode(event.keyCode);
    const verifyKeyPressed = /^[a-zA-Z\' \u00C0-\u00FF]*$/.test(keyPressed);
    return verifyKeyPressed === true;
}


}
export class ListInput1 {
  offset: number;
  user_type: any;
  account_name: string;
  contact_no: string;
  size: number;
  state: string;
  city: string;
  district: string;

}
export class ListInputAll {
  offset: number;
  size: number;
  status: any;
  city: any;
  contact_no: any;
  district: any;
  account_name: string;
  state: string;
  user_type: string;

}

export class InputData1 {

  size: number
  org_search_text: string
  account_name: string;
  // div_search_text: string
  // distributor_id: any;


}
export class InputDat4 {
  dropdown_type: "state";
  multi_district: any;
  multi_taluka: any;
  multi_city: any;
  offset: 0;
  limit: 10000;
  state_name: string;
  state_code: string;
  size: number;
  state_search_text: string
}
export class Customerinput {
  status: any;
  offset: number;
  size: number;
  city: any;
  contact_no: string;
  district: string;
  account_name: string;
  shipping_state: string;
  state: string;
  user_type: string;

}
export class ListInput {
  size: number;
  account_name: string;
  offset: number;
  status: any;
  city: any;
  contact_no: any;
  district: any;

}
export class Input {
  account_id: string;
  account_name: string;
  account_type: string;
  customer_segment: string;
  distributor_code: string;
  distributor_name: string;
  from_date: string;
  offset: number
  to_date: string;
}
export class InputOrderDetail {

  ORGANIZATION_ID_s: string
  organization_name: string
  DISCOUNT_CODE_s: string
  CUSTOMER_SEG_s: string
  START_DATE_dt: string
  LAST_UPD_dt: string
  DIV_ID_s: string
  DIV_NAME_s: string
  ADJUSTMENT_AMOUNT_s: string
  contentType: string
  CREATED_dt: string
}

export class Inputaccount {

  account_id: string

}
export class ListInput5 {

  cancel_order_number: string
  otc_order_number: string

  from_date: string
  to_date: string
  offset: number
  size: number
  order_number: string


  //distributor_id: string
  //division_id: string
  // account_id: string

  division_name: string
  account_name: string
  org_name: string



}