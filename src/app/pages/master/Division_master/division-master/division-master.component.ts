import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
//import { OrderserviceService } from '../../../shared/Services/orderservice.service';
import { CommonService } from '../../../../shared/Services/common-service.service'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { UserManagmentServiceService } from 'src/app/shared/Services/user-managment-service.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import { Action } from 'rxjs/internal/scheduler/Action';
@Component({
  selector: 'app-division-master',
  templateUrl: './division-master.component.html',
  styleUrls: ['./division-master.component.scss']
})
export class DivisionMasterComponent implements OnInit {
  Data:any
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>;
  public AllFilters = new FormGroup({});
  public itemForm = new FormGroup({});
  DivisionCategoryList = new FormGroup({});
  DistrictLists = new FormGroup({});
  StateLists = new FormGroup({});
  items: any[];
  totalrecord: number;
  toastrService: any;
  temp: any;
  from_date: any;
  to_date: any;
  DistCode: any
  state_codes: any

  currentPage: any;
  noofrecordsperpage: number;
  ShowCustom: boolean;
  iscustomDate: boolean;
  isThirtyDays: boolean;
  isToday: boolean;
  isLastsevenDay: boolean;
  Filterarray: any;
  StateData = [];
  StateDatacode = [];
  district: any;
  state: string;
  division_category: any;
  division_id: any;
  division_name: any;
  date: Date;
  Valdationmessage: string;
  showiscontrator: string;
  isvaliddist: boolean;
  //Role: string;
  btnSave: boolean;
  Roletypedisable: boolean;
  btnupdate: boolean;
  // RoleId: string;
  state_code: string;
  DivisionName: FormGroup;
  district_name: any;
  state_name: string;
  isDistrictVisible: boolean;
  isRegistrationForm: boolean;
  div_Id: any;
  div_name: any;
  item_from: any;
  showRecords: number;
  TotalCount: any;
  From_date: string;
  To_date: string;
  id: string;

  constructor(
    private UserService: UserManagmentServiceService,
    private OrderListService: OrderserviceService,
    private loader: AppLoaderService,
    private CommonService: CommonService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datepipe: DatePipe,
    private router: Router,
  ) { }
  ngOnInit(): void {
    this.date = new Date();

    this.currentPage = 1
    this.noofrecordsperpage = 10
    this.showRecords = 10; 
    debugger;

    this.From_date = localStorage.getItem("FromDate");
    this.To_date = localStorage.getItem("ToDate");
    
    
    const ListInput: ListInput1 = {} as ListInput1;
    
    ListInput.offset = 1;
    ListInput.limit = 10;
    



    
    this.DivisionMaster(ListInput)
    this.buildItemForm('')
    const data1: InputData1 = {} as InputData1
    data1.size = 5;
    data1.division_category = "";
    this.DivisionCategory(data1);
    const data: InputData1 = {} as InputData1

     this.DistrictList(data)
    
    const data3: InputData3 = {} as InputData3;
   
    this.Getstatecode(data3)
   


    this.BuildForm();

  }

  buildItemForm(row: any) {



    debugger;
    this.itemForm = this.fb.group({

      division_name: [row.division_name],
      division_id: [row.division_id],
     // state: [row.state],
      division_category: [row.division_category],
      district_name: [row.district_name],
      state_code: [row.state_code]

      //is_active: []




    })


  }
  division_allocation_id: any



  Editpopup(content: any, row: any) {
    debugger
   
    this.division_allocation_id = row.id
    this.btnupdate = true;
    this.buildItemForm(row)
    let ngbModalOptions: NgbModalOptions = {
      backdrop: false,
      keyboard: false,
    };

    this.modalService.open(content, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  showAccount(event) {

    const ListInput: ListInput2 = {} as ListInput2;
    
    ListInput.division_id = event.target.value
     ListInput.offset=0
    this.DivisionMaster(ListInput);
  }
  SearchAccount(event) {

    if (event.key === "Enter") {
      const ListInput: Listinputs = {} as Listinputs;
     
      ListInput.division_id = event.target.value
      this.DivisionMaster(ListInput);

    }

  }

  closeResult = '';
  open(content: any) {

    this.itemForm?.reset()
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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
  page: any
  pageChange(page: any) {
    debugger;
    document.body.scrollTop = 0;
    this.currentPage = page;

    page = page - 1;
    const ListInput: Listinputs = {} as Listinputs;
  

    // if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    // if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

    if (this.district_name) { ListInput.district_name = this.district_name; } else { ListInput.district_name = ""; }
    if (this.division_category) { ListInput.division_category = this.division_category; } else { ListInput.division_category = ""; }
    if (this.division_id) { ListInput.division_id = this.division_id; } else { ListInput.division_id = ""; }
    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }
    if (this.division_allocation_id) { ListInput.division_allocation_id = this.division_allocation_id; } else { ListInput.division_allocation_id = ""; }
    if (this.state_code) { ListInput.state_code = this.state_code; } else { ListInput.state_code = ""; }


    // this.List(this.AllFilters)

    ListInput.offset = (page * 10)

     ListInput.limit = this.noofrecordsperpage;
    // ListInput.offset = 10;
    // ListInput.limit = this.noofrecordsperpage;


    ///pageSizeOptions = [5, 10, 25, 100];

    this.DivisionMaster(ListInput);



  }

  FilterStrings(ListInput) {
    this.Filterarray = [];
    ///console.log(ListInput, "filterarrayvalue")
    for (let item in ListInput) {

      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'limit');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    var from_date1 = ListInput.from_date;
    var to_date1 = ListInput.to_date;
    if(from_date1!=null ){
    var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'action_type');
    

    var Json1 = { "Key": 'from_date', "Value": finaldate }
    
    this.Filterarray.push(Json1)
  }
  }
  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }


  
  resetALl() {
    

    this.BuildForm();
    this.Filterarray = [];
    this.AllFilters.reset();
    this.from_date = "";
    this.to_date = "";
    this.district = "";
    this.division_category = " ";
    this.division_id = "";
    this.id="";
    this.division_name = "";
    this.isThirtyDays = true;
    this.isToday = false;
    this.iscustomDate = false;
    this.isLastsevenDay = false;
    this.ShowCustom = false;
    // this.state_codes = "";
    this.state_code = "";
    this.state = "";
    this.division_id="";

    var d1 = new Date(); // today!
    var x1 = 30; // go back 5 days!
    d1.setDate(d1.getDate() - x1);

    this.from_date = this.datepipe.transform(d1, 'yyyy-MM-dd')
    this.to_date = this.datepipe.transform(new Date(), 'yyyy-MM-dd')
    const ListInput: Listinput5 = {} as Listinput5;
    // ListInput.from_date = this.from_date
    // ListInput.to_date = this.to_date
    ListInput.offset = 0;
    ListInput.limit = 10;

    this.DivisionMaster(ListInput)
    this.myDrop.close();

  }
  SearchAllDate() {
    debugger;
    this.currentPage = 1
    let fromDate = localStorage.getItem("FromDate");
    let todate = localStorage.getItem("ToDate");
     
    if (this.iscustomDate == true) {

      this.from_date = this.AllFilters.value.from_date;
      this.to_date = this.AllFilters.value.to_date
     
      this.from_date = moment(this.from_date).subtract(1, 'months').format('"yyyy-mm-dd')
      this.to_date = moment(this.to_date).subtract(1, 'months').format('"yyyy-mm-dd')
    
    }
    else if (this.isLastsevenDay == true) {
      this.from_date = moment(todate).subtract(7, 'days').format('yyyy-MM-DD')
      this.to_date = this.datepipe.transform(todate, 'yyyy-MM-dd')
    }
    else if (this.isToday == true) {
      this.from_date = moment(todate).format('yyyy-MM-DD')
      this.to_date = this.datepipe.transform(todate, 'yyyy-MM-dd')
    }
    else {
      this.from_date = this.datepipe.transform(fromDate, 'yyyy-MM-dd')
      this.to_date = this.datepipe.transform(todate, 'yyyy-MM-dd')
    }
  
    
  //  console.log(this.to_date, this.from_date)
    if (this.from_date) {
      this.AllFilters.get('from_date').setValue(this.from_date);
    }
    if (this.to_date) {
      this.AllFilters.get('to_date').setValue(this.to_date);
    }


    this.AllFilters.value.to_date = this.to_date;
    this.AllFilters.value.from_date = this.from_date
    const ListInput: Listinputs = {} as Listinputs;

    this.district_name = this.AllFilters.value.district_name
    this.state_code = this.AllFilters.value.state_code;
    //this.id = this.AllFilters.value.id;
    this.division_id = this.AllFilters.value.division_id;


    
   

    this.division_category = this.AllFilters.value.division_category;
    this.division_name = this.AllFilters.value.division_name;
   this.division_allocation_id = this.AllFilters.value.division_allocation_id;

   if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

  if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

    if (this.district_name) { ListInput.district_name = this.district_name; } else { ListInput.district_name = ""; }
    if (this.state_code) { ListInput.state_code = this.state_code; } else { ListInput.state_code = ""; }
    if (this.division_category) { ListInput.division_category = this.division_category; } else { ListInput.division_category = ""; }
    if (this.division_id) { ListInput.division_id = this.division_id; } else { ListInput.division_id = ""; }
    if (this.division_name) { ListInput.division_name = this.division_name; } else { ListInput.division_name = ""; }
   // if (this.state_code) { ListInput.state_code = this.state_code; } else { ListInput.state_code = ""; }
    if (this.division_allocation_id) { ListInput.division_allocation_id = this.division_allocation_id; } else { ListInput.division_allocation_id = ""; }
    //ListInput.offset = 0;
    //ListInput.limit = 10;


    this.DivisionMaster(ListInput);

    this.myDrop.close();

  }


  EDownload: any;
  count: any;
  pageName: any;

  ExportDownload() {
    debugger;

    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // } 
    
    // else if (event.target.value == "Excel") {
    


    //     if (this.totalrecord == 0) {
    //       Swal.fire("No Data For Downloding.....");
    //     } else {
      
      const exportList: Listinput5 = {} as Listinput5;

      if (this.to_date) { exportList.to_date = this.to_date; } else { exportList.to_date = ""; }

      if (this.from_date) { exportList.from_date = this.from_date; } else { exportList.from_date = ""; }

      if (this.district) { exportList.district = this.district; } else { exportList.district = ""; }
      //if (this.state_code) { ListInput.state_code = this.state_code; } else { ListInput.state_code = ""; }
      if (this.division_category) { exportList.division_category = this.division_category; } else { exportList.division_category = ""; }
      if (this.division_id) { exportList.division_id = this.division_id; } else { exportList.division_id = ""; }
      if (this.division_name) { exportList.division_name = this.division_name; } else { exportList.division_name = ""; }
      if (this.state_code) { exportList.state_code = this.state_code; } else { exportList.state_code = ""; }
      this.EDownload = exportList;
      console.log(exportList)
      //console.log(this.to_date,this.from_date,this.state_code,this.district,this.division_category,this.division_id,this.division_name)
      //console.log(this.EDownload, "EDownloadllll")
      var limit = 250
      var offset = 0

      //Listinput5.offset = 0
      //Listinput5.limit = limit;
      this.count = this.totalrecord;



      this.pageName = "DivisionMaster";
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

  // }
// }

  changedatefilter(Value) {
    if (Value == 'Today') {
      this.ShowCustom = false;
      this.isToday = true;
      this.isThirtyDays = false;
      this.isLastsevenDay = false;
      this.iscustomDate = false;
      this.from_date = "";
      this.to_date = "";
      this.AllFilters.patchValue({
        Today: true,
        Custom: false,
        thirtyDays: false,
        Sevenday: false
      })
    }

    if (Value == 'Sevenday') {
      this.ShowCustom = false;
      this.isLastsevenDay = true;
      this.isThirtyDays = false;
      this.isToday = false;
      this.iscustomDate = false;
      this.from_date = "";
      this.to_date = "";
      this.AllFilters.patchValue({
        Today: false,
        Custom: false,
        thirtyDays: false,
        Sevenday: true
      })
    }

    if (Value == 'thirtyDays') {
      this.ShowCustom = false;
      this.isThirtyDays = true;
      this.isToday = false;
      this.isLastsevenDay = false;
      this.iscustomDate = false;
      // this.from_date = "";
      // this.to_date = "";
      this.AllFilters.patchValue({
        Today: false,
        Custom: false,
        thirtyDays: true,
        Sevenday: false
      })
    }

    if (Value == 'Custom') {
      this.ShowCustom = true;
      this.iscustomDate = true;
      this.isThirtyDays = false;
      this.isToday = false;
      this.isLastsevenDay = false;
      this.from_date = "";
      this.to_date = "";
      this.AllFilters.patchValue({
        Today: false,
        Custom: true,
        thirtyDays: false,
        Sevenday: false
      })
    }
  }

  BuildForm() {
    this.AllFilters = this.fb.group({

      district_name:[''],

      division_id:[''],

      from_date:[''],
      to_date:[''],
      state:[''],
      state_code:[''],
      division_category:[''],
      division_name:[''],
      action_type:[''],
      state_name:[''],
      division_allocation_id:['']
    });



  }

  // GetStateCode() {
  //   //this.statenamedata = []

  //   var Json = {
  //     "dropdown_type": "state_name",
  //     "multi_zone": [],
  //     "multi_state": [],
  //     "multi_city": [],
  //     "offset": 0,
  //     "size":10000
  //     //"limit": 10000
  //   }

  //   this.CommonService.Getstatecode(Json).subscribe(
  //     data => {
  //       if (data.success == true) {
  //         // this.StateData = data.data.States;

  //         // this.GetstateNew = new FormGroup({})
  //         // for (let formModule of this.StateData) {
  //         //   this.GetstateNew.addControl(formModule.state_code, new FormControl(false))
  //         // }

  //         for (let entry of data.data.result) {

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

  // GetStateData() {
  //   this.StateData = []

  //   var Json = {
  //     "dropdown_type": "state",
  //     "multi_district": [],
  //     "multi_taluka": [],
  //     "multi_city": [],
  //     "offset": 0,
  //     "limit": 10000
  //   }

  //   this.CommonService.GetstateNew(Json).subscribe(
  //     data => {
  //       if (data.success == true) {
  //         // this.StateData = data.data.States;
  //         console.log(data.data.States)
  //         // this.GetstateNew = new FormGroup({})
  //         // for (let formModule of this.StateData) {
  //         //   this.GetstateNew.addControl(formModule.state_code, new FormControl(false))
  //         // }

  //         for (let entry of data.data.States) {

  //           if (entry.state_code != undefined) {
  //             this.StateData.push(entry)
  //           }
  //         }

  //         console.log(this.StateData)
  //       }
  //       else {
  //       }
  //     }, (err) => {

  //     }

  //   );
  // }
  DivisionMaster(ListInput: any) {
   // console.log(ListInput)
    this.FilterStrings(ListInput)

    //this.loader.open()
    this.items = [];
    this.totalrecord = 0

    this.OrderListService.DivisionMaster(ListInput).subscribe(

      data => {



        if (data.success == true) {


          this.loader.close()

          this.items = data.data;
          this.totalrecord = data.total_result;
     
          this.showRecords=data.data.length
         



        }


        else {
          this.loader.close()
          this.items = [];
          // this.page.totalElements = 0;
         // this.toastrService.error(data.msg)
        }
      }, (err) => {


      }

    );



  }

  Update(Formvalue) {
    debugger
   // console.log(Formvalue, "fromvalues")
    var data = Formvalue
    data.action_type = "update"
    data.division_allocation_id = this.division_allocation_id;




    this.UserService.UpdateDivisionMaster(data).subscribe(

      data => {

        if (data.success == true) {


          this.modalService.dismissAll()
          this.itemForm?.reset()
          // window.location.reload()
        }


        else {
          Swal.fire(data.data.msg);
        }
      }, (err) => {
        Swal.fire('Exception Occured!');

      }

    )
  }
  // AddUpdate(Action) {

  //   console.log(Formvalue);
  //   var data = Formvalue
 
  //   data.division_id = this.division_id;
  //   this.UserService.InsertUpdateDivisionMaster(data).subscribe(

  //     data => {

  //       if (data.success == true) {

  //         this.modalService.dismissAll()

  //       }


  //       else {
  //         Swal.fire(data.data.msg);
  //       }
  //     }, (err) => {
  //       alert('Exception Occured!');

  //     }


  //   )


  // }
  AddUpdate(Action) {
    debugger




    if (!this.itemForm.valid) {
      Swal.fire('Please enter all Data')
      return
    }


    var Json

    // if (this.Data.id == undefined) {
    if (Action == 'insert') {
      Json =
      {
        "action_type": "insert",
        "division_name": this.itemForm.value.division_name,
        "division_id": this.itemForm.value.division_id,
        "state_code": this.itemForm.value.state_code,
        "district": this.itemForm.value.district_name,
        "division_category": this.itemForm.value.division_category,
      }

    }
    else {

      Json =
      {
        "action_type": "update",
        "division_allocation_id": this.Data.id,
        "division_name": this.itemForm.value.division_name,
        "division_id": this.itemForm.value.division_id,
        "state_code": this.itemForm.value.state_code,
        "district": this.itemForm.value.district_name,
        "division_category": this.itemForm.value.division_category,
      }
    }
    this.loader.open()
    this.CommonService.AddUpdateDivision(Json).subscribe(

      data => {
        debugger
        if (data.success == true) {



         



          Swal.fire({

            title: data.data.msg,

            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              const ListInput: ListInput1 = {} as ListInput1;
    
              ListInput.offset = 0;
              ListInput.limit = 10;
               this.DivisionMaster(ListInput)
              this.itemForm.reset()
             this.router.navigate(['pages/DivisionMaster']);
            }
            else {

              this.itemForm.reset()

              this.router.navigate(['pages/DivisionMaster']);
            }
          })
          //this.dialogRef.close()
          this.loader.close()





        }


        else {

          this.loader.close()


          Swal.fire({

            title: data.data.msg,

            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {


            }
            else {


            }
          })
        }
      }, (err) => {
        this.loader.close()
      }

    );





  }
  refresh(): void {
    window.location.reload();
}

  // nextStep(Acion) {

  //   debugger
    
  //   if (!this.itemForm.valid) {
  //     Swal.fire('Please enter all Data')
  //     return
  //   }


  //   var Json

  //   if (Acion == 'insert') {
  //     Json =
  //     {
  //       "action_type": "insert",
  //       "division_name": this.itemForm.value.division_name,
  //       "division_id": this.itemForm.value.division_id,
  //       "state_code": this.itemForm.value.state_code,
  //       "district": this.itemForm.value.district,
  //       "division_category": this.itemForm.value.division_category,
  //     }

  //   }
  //   else {

  //     Json =
  //     {
  //       "action_type": "update",
  //       "division_allocation_id": this.Data.id,
  //       "division_name": this.itemForm.value.division_name,
  //       "division_id": this.itemForm.value.division_id,
  //       "state_code": this.itemForm.value.state_code,
  //       "district": this.itemForm.value.district,
  //       "division_category": this.itemForm.value.division_category,
  //     }
  //   }
  //   this.loader.open()
  //   this.UserService.InsertUpdateDivisionMaster(Json).subscribe(

  //     data => {
  //       debugger
  //       if (data.success == true) {







  //         Swal.fire({

  //           title: data.data.msg,

  //           icon: 'success',
  //           showCancelButton: false,
  //           confirmButtonColor: '#3085d6',
  //           cancelButtonColor: '#d33',
  //           confirmButtonText: 'OK'
  //         }).then((result) => {
  //           if (result.value) {

  //             this.itemForm.reset()
  //           }
  //           else {

  //             this.itemForm.reset()

  //           }
  //         })
  //         this.loader.close()




  //       }


  //       else {

  //         this.loader.close()


  //         Swal.fire({

  //           title: data.data.msg,

  //           icon: 'error',
  //           showCancelButton: false,
  //           confirmButtonColor: '#3085d6',
  //           cancelButtonColor: '#d33',
  //           confirmButtonText: 'OK'
  //         }).then((result) => {
  //           if (result.value) {


  //           }
  //           else {


  //           }
  //         })
  //       }
  //     }, (err) => {
  //       this.loader.close()
  //     }

  //   );



  // }

  saveuserdata(Action) {

    if (!this.itemForm.valid) {
      Swal.fire('Please enter all Data')
      return
    }


    var JSON = {
      "division_id": [this.itemForm.value.division_id]

    }
    
    this.UserService.DivisionMasterID(JSON).subscribe(

      data => {

        if (data.success == true) {

          this.modalService.dismissAll();
          this.AddUpdate(Action) ;
        }


        else {
          // Swal.fire(data.data.msg);
          Swal.fire('Invaild Division Id');

          //this.save(Formvalue);
        }
      }, (err) => {

      }


    )

    //window.location.reload();
    
    


  }


  onRemoveFilter(filterString) {
    let Filterarrays = this.Filterarray;
    if (filterString.Key == "division_category") {
      this.division_category = "";
      this.AllFilters.get("division_category").setValue("")
    }
    else if (filterString.Key == "division_name") {
      this.division_name = ""
      this.AllFilters.get("division_name").setValue("")
    }
   
    else if (filterString.Key == "district_name") {
      this.district = ""
      this.AllFilters.get("district_name").setValue("")
    }
    // else if (filterString.Key == "state") {
    //   this.state = ""
    //   this.AllFilters.get("state").setValue("")
    // }
    else if (filterString.Key == "state_code") {
      this.state = ""
      this.AllFilters.get("state_code").setValue("")
    }
    else if (filterString.Key == "state_name") {
      this.state = ""
      this.AllFilters.get("state_name").setValue("")
    }
    else if (filterString.Key == "division_id") {
      this.division_allocation_id = ""
      this.AllFilters.get("division_id").setValue("")
    }
    else if (filterString.Key == "division_allocation_id") {
      this.division_allocation_id = ""
      this.AllFilters.get("division_allocation_id").setValue("")
    }

    this.SearchAllDate();
  }

  Divnamedata: any = []
  DivisionCategory(Data1) {

    console.log(this.Divnamedata, "divs")

    this.CommonService.DivisionName(Data1).subscribe(
      data => {
        if (data.success == true) {

          this.Divnamedata = [];


          this.Divnamedata = data.data["Division categories"].slice(0, 5);


          this.DivisionCategoryList = new FormGroup({})
          for (let formModule of this.Divnamedata) {
            this.DivisionCategoryList.addControl(formModule.division_category, new FormControl(false))
          }
        }
        else {

          this.loader.close();

        }
      }, (err) => {
        // this.loader.close();
      }
    );
  }


  // divisionType() {
  //   //  alert("hii");
  //   this.division_category = "";


  //   const data2: InputData1 = {} as InputData1;
  //   data2.size = 5;
  //   data2.division_category = this.AllFilters.value.division_category;
  //   this.DivisionCategory(data2)
  // }
  filterMyOptionsCustname(row, event) {



    if (event.target.checked) {
      this.division_category = row.division_category;
      for (const field1 in this.DivisionCategoryList.controls) { // 'field' is a string
        if (field1 == this.division_category) {
          this.DivisionCategoryList.get(field1).setValue(true);
        }
        else {
          this.DivisionCategoryList.get(field1).setValue(false);
        }
      }
    }
    else {
      this.division_category = "";
      for (const field1 in this.DivisionCategoryList.controls) { // 'field' is a string

        this.DivisionCategoryList.get(field1).setValue(false);
      }
    }
  }
  // Disnamedata: any = []
  // DistrictList(Data1) {
  //   debugger
  //   this.CommonService.DistrictListName(Data1).subscribe(
  //     data => {
  //       if (data.success == true) {

  //         this.Disnamedata = [];


  //         this.Disnamedata = data.data.result;


  //         this.DistrictLists = new FormGroup({})
  //         for (let formModule of this.Disnamedata) {
  //           this.DistrictLists.addControl(formModule.district_name, new FormControl(false))
  //         }
  //       }
  //       else {

  //         this.loader.close();

  //       }
  //     }, (err) => {
  //       // this.loader.close();
  //     }
  //   );
  //   // this.DistrictList(Data1)

  // }

  // districtType() {

  //   this.district_name = "";


  //   const data2: InputData2 = {} as InputData2;
  //   data2.size = 5;
  //   data2.district_name = this.AllFilters.value.district_name;
  //   this.DistrictList(data2)
  // }

  Disnamedata: any = []
  DistrictList(Data1) {

    console.log(this.Disnamedata, "divs")

    this.CommonService.DistrictListName(Data1).subscribe(
      data => {
        if (data.success == true) {

          this.Disnamedata = [];


          this.Disnamedata = data.data.result;


          this.DistrictLists = new FormGroup({})
          for (let formModule of this.Disnamedata) {
            this.DistrictLists.addControl(formModule.district_name, new FormControl(false))
          }
        }
        else {

          this.loader.close();

        }
      }, (err) => {
        // this.loader.close();
      }
    );
  }
  filterMyOptionsDisname(row, event) {


    // this.account_name = row.account_name;
    if (event.target.checked) {
      this.district_name = row.district_name;
      for (const field1 in this.DistrictLists.controls) { // 'field' is a string
        if (field1 == this.district_name) {
          this.DistrictLists.get(field1).setValue(true);
        }
        else {
          this.DistrictLists.get(field1).setValue(false);
        }
      }
    }
    else {
      this.district_name = "";
      for (const field1 in this.DistrictLists.controls) { // 'field' is a string

        this.DistrictLists.get(field1).setValue(false);
      }
    }
  }

  statenamedata: any[]
  Getstatecode(Data1) {
    this.statenamedata = [];


    this.CommonService.Getstatecode(Data1).subscribe(
      data => {
        if (data.success == true) {
          this.statenamedata = data.data.result

          console.log(this.statenamedata)

          this.StateLists = new FormGroup({})
          for (let formModule of this.statenamedata) {
            this.StateLists.addControl(formModule.state_code, new FormControl(false))
          }
        }
        else {

          this.loader.close();

        }
      }, (err) => {
        // this.loader.close();
      }
    );


  }

  onChange(deviceValue) {
    console.log(deviceValue);
    const data2: InputData2 = {} as InputData2;
    var jsonn = { "multi_zone": this.selected, "multi_state": [deviceValue], "size": 100 }
    this.DistrictList(jsonn)
  }
 

  selected = [];

  filterMyOptionsStatename(row, event) {

    debugger;
    console.log(row, event)
    console.log(this.StateLists.controls)
    this.state_name = row.state_name;
    if (event.target.checked) {
      this.state_name = row.state_name;
      for (const field1 in this.StateLists.controls) { // 'field' is a string
        if (field1 == this.state_name) {
          this.StateLists.get(field1).setValue(true);

          const data2: InputData2 = {} as InputData2;

          var jsonn = { "multi_zone": this.selected, "multi_state": [this.state_name], "size": 100 }

          this.DistrictList(jsonn)


        }
        else {
          this.StateLists.get(field1).setValue(false);


        }
      }
    }
    else {
      //this.state_name = "";
      // this.district_name = "";
      for (const field1 in this.StateLists.controls) { // 'field' is a string

        this.StateLists.get(field1).setValue(false);
        // this.Disnamedata = [];
        //this.isDistrictVisible = false;
      }
    }
  }

}


export class ListInput1 {

  district: string;
  state: string;
  division_category: string;
  division_name: string;
  division_id: string;
  // size: number;
  from_date: any;
  to_date: any;
  // offset: number;
  action_type: string;
  offset: number;
  size: number;
  state_code: string;
  region: string;
  limit: number;
  //state:string

}

export class InputData1 {



  division_category: string;
  size: number;
  district: any;


}
export class InputData2 {





  size: number;
  district: any;
  district_name: any;
  state_code: any;
  state_name: any;


}
export class InputData3 {
  state_name: string;
  state_code: string
  size: number
  district_name: any;
}
export class Listinput5 {
  offset: number;
  size: number;
  from_date: any;
  to_date: any;
  division_id: any;
  division_name: any;
  division_category: any;
  district: any;
  state: string;
  state_code: string;
 // offset: number;
  limit: number;
  //state_code: any;
}
export class ListInput2 {
  from_date: string
  offset: 0
  to_date: string;
  division_id: any;
  static offset: number;
  static limit: number;
}
export class Listinputs {
  district: any;
  offset: number;
  size: number;
  state: string;
  division_category: string;
  division_id: string;
  division_name: string;
  from_date: string;
  to_date: string;
  state_code: string;
  district_name: string;
  state_name: string;
  limit: number;
  id: string;
  division_allocation_id: string;
}
export interface input {
  role_id: string,
  position_name: string,
  position_id: string,
  offset: number
}

export interface Updateinfo {
  action_type: string;
  is_active: boolean;
  division_id: any;
  division_name: any;

  // position_name: string;
  // position_id: string;
  // status: string;
  // role_id: string;





}
