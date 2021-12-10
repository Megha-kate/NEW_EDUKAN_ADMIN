import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { UserManagmentServiceService } from 'src/app/shared/Services/user-managment-service.service';
import Swal from 'sweetalert2';
import { CommonService } from './../../../shared/Services/common-service.service'




@Component({
  selector: 'app-admin-rolemaster',
  templateUrl: './admin-rolemaster.component.html',
  styleUrls: ['./admin-rolemaster.component.scss']
})
export class AdminRolemasterComponent implements OnInit {
  exampleForm = new FormGroup({ firstName: new FormControl(), lastName: new FormControl(), role_id: new FormControl(), position_name: new FormControl() });
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;

  items: any;

  RoleType: any=[];
  Position: any=[];
  Role: any;
  btnSave: boolean | undefined;
  Roletypedisable: boolean | undefined;
  btnupdate: boolean | undefined;
  UpdateDetails = new FormGroup({})
  private modalRef!: NgbModalRef;
  public itemForm: FormGroup | undefined;
  public userVehicleForm!: FormGroup;
  currentPage: any;
  totalrecord: any;
  noofrecordsperpage: number;
  RoleId: string;

  showRecords: number;
  loder: any;
  loader: any;
  position_id: string;

  constructor(private UserService: UserManagmentServiceService, private modalService: NgbModal,
    private CommonService: CommonService,

    private fb: FormBuilder,) { this.createForm(''); }
  createForm(row: any) {

    this.exampleForm = this.fb.group({

      role_id: row.role_id,
      position_name: row.position_name,
      position_id: row.position_id
    });
  }
  ngOnInit(): void {



    this.btnSave = true;
    this.Roletypedisable = true
    this.btnupdate = false;
    this.currentPage = 1
    this.noofrecordsperpage = 10
    this.showRecords = 10;
    var RoleName = this.CommonService.getRole();
    this.Role = RoleName;



    this.loadlist()



  }

  loadlist() {
    const ListInput: input = {} as input;
    ListInput.position_id = ""
    ListInput.position_name = ""

    if (this.Role == 'TML') {
      ListInput.role_id = "1"
      this.RoleId = "1"
    }
    else {
      this.RoleId = "2"
      ListInput.role_id = "2"
    }

   
   
    this.GetList(ListInput)
  }

  buildItemForm(row: any) {







    if (this.Role == "Distributor") {
      this.itemForm?.get('role_id')?.setValue(2);
      this.GetPosition(2)
      // this.RoleTypeDisabled = true;
      var input = this.itemForm?.value;
      this.GetList(input);
      this.loader.close();


    }


  }

  closeResult = '';

  open(content: any) {

    this.btnSave = true;
    this.Roletypedisable = true
    this.btnupdate = false;

    this.exampleForm.reset()
    this.createForm('')

    this.GetRole()
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



  Editpopup(content1: any, row: any) {

    debugger

    this.btnSave = false;
    this.Roletypedisable = false
    this.btnupdate = true;

    this.GetRole()
    //  this.createForm(row)
    let ngbModalOptions: NgbModalOptions = {
      backdrop: false,
      keyboard: false,
    };
    this.modalService.open(content1, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    setTimeout(() => {
      this.createForm(row)
    }, 200);

  }

  Update() {

    if (this.exampleForm?.invalid) {
      return;
    }

    const Final: Updateinfo = {} as Updateinfo;
    Final.role_id = this.exampleForm?.value.role_id;
    Final.position_id = this.exampleForm?.value.position_id;;
    Final.position_name = this.exampleForm?.value.position_name;
    Final.status = "update";

    this.insertupdatePosition(Final);
  }



  omit_special_char(event: any) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  OnselectedRole(value: any) {






    this.GetList(value);





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

  Addpermissionpopup(content1: any, row: any) {


    this.GetRole()



    this.createForm(row);

    this.bindList(row)
    let ngbModalOptions: NgbModalOptions = {
      backdrop: false,
      keyboard: false,
    };
    this.modalService.open(content1, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  GetList(input: any) {
    this.items = [];
     console.log(this.items,"array")
    // this.loader.open();
     this.totalrecord=0;

    this.UserService.GetPostionList(input).subscribe(

      data => {
      //  this.items = data
        if (data.success == true) {

          this.items = data.data;
          this.totalrecord = data.total_result;
          // alert(this.totalrecord)
          this.showRecords = data.data.length
        }


        else {

          // this.loader.close();

        }
      }, (err) => {
        //this.loader.close();


      }

    );

  }

  //  async GetRole() {

  //       let data = await this.UserService.BindRoleType('');

  //           if (data.success == true) {
  //           this.RoleType = data.data;


  //         }
  //         else {
  //         }





  //   }

  GetRole() {


    this.UserService.BindRoleTypeOld('').subscribe(

      data => {

        if (data.success == true) {

          this.RoleType = data.data;

          console.log(this.RoleType);
        }


        else {

        }
      }, (err) => {

      }

    );

   // this.myDrop.close();


  }

  rows: any;
  temp: any;
  FinalData: any;
  bindList(row: any) {
    this.rows = [];
    this.temp = []
    this.FinalData = []
    this.selectedData = []

    this.UserService.GetPagemasterData(row).subscribe(

      data => {
        this.rows = data
        if (data.success == true) {

          this.rows = data.data;



          this.UpdateDetails = new FormGroup({})
          for (let entry1 of this.rows) {


            if (entry1.page_master_id != 1) {

              this.UpdateDetails.addControl(entry1.page_master_detail_id, new FormControl(entry1.page_status))



              if (entry1.page_status == true) {
                this.selectedData.push(entry1);
              }

              var tempdata = this.temp.filter((item: { page_master_id: any; }) => item.page_master_id === entry1.page_master_id);
              if (tempdata.length == 0) {
                var string = { page_master_id: entry1.page_master_id, page_master_name: entry1.page_master_name }
                this.temp.push(string)
              }
            }

          }


          for (let rows of this.temp) {
            var tempdata = this.rows.filter((item: { page_master_id: any; }) => item.page_master_id === rows.page_master_id);


            var Final = { Header: rows, Detail: tempdata }
            this.FinalData.push(Final)



          }







        }


        else {


        }
      }, (err) => {


      }

    );



  }


  GetPosition(id: any) {




    var Json = {
      "role_id": id
    }


    this.UserService.BindPosition(Json).subscribe(

      data => {

        if (data.success == true) {

          this.Position = data.data;

        }


        else {

        }
      }, (err) => {

      }

    );




  }



 
  save() {


    if (this.exampleForm?.invalid) {
      return;
    }

    const Final: Updateinfo = {} as Updateinfo;
    Final.role_id = this.exampleForm?.value.role_id;
    Final.position_id = "";
    Final.position_name = this.exampleForm?.value.position_name;
    Final.status = "insert";

    this.insertupdatePosition(Final);
  }


  selectedData: any = []
  eventCheck(event: any, Details: any) {



    if (event.target.checked) {
      // Pushing the object into array
      this.selectedData.push(Details);

    } else {
      let removeIndex = this.selectedData.findIndex((itm: { page_master_detail_id: any; }) => itm.page_master_detail_id === Details.page_master_detail_id);

      if (removeIndex !== -1)
        this.selectedData.splice(removeIndex, 1);
    }






  }
  DataPushArray: any;
  Savepermission() {
    debugger

    this.DataPushArray = []


    if (this.selectedData.length == 0) {
      alert('Please Assign atleast 1 Permission ')
      return
    }





    for (let entry1 of this.selectedData) {
      const dataList1: FormArray = {} as FormArray;
      dataList1.page_detail_id = entry1.page_master_detail_id;
      dataList1.page_id = entry1.page_master_id;
      this.DataPushArray.push(dataList1);

    }



    const Final: FinalArray = {} as FinalArray;
    Final.role_id = this.exampleForm.value.role_id;
    Final.position_id = this.exampleForm.value.position_id;
    Final.page_list = this.DataPushArray;


    this.UserService.InsertPageMapping(Final).subscribe(

      data => {
        debugger


        if (data.success == true) {


          alert('Data Saved Sucessfully')

          this.exampleForm.reset();
          this.UpdateDetails.reset();
          this.modalService.dismissAll()
          this.loadlist()

        }



        else {



        }
      }, (err) => {


      }

    );

  }



  insertupdatePosition(Final: any) {



    this.UserService.InsertUpdatePositionMaspping(Final).subscribe(

      (data: { success: boolean; data: { data: { msg: any; }; msg: any; }; }) => {

        if (data.success == true) {




          // alert(data.data.data.msg);

          this.modalService.dismissAll()
          this.loadlist()
        }


        else {
          Swal.fire(data.data.msg);
        }
      }, (err: any) => {
        Swal.fire('Exception Occured!');

      }

    );



  }
  pageChange(page: any) {

    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;


    const ListInput: input = {} as input;
    ListInput.role_id = this.RoleId;
    ListInput.offset = (page * 10);

    this.GetList(ListInput)



  }

  SearchByRole(event) {
    debugger
    if (event.key === "Enter") {
      const ListInput: searchinput = {} as searchinput;
      ListInput.offset = 0;
      ListInput.limit = 1
      ListInput.role_id ="1"
      ListInput.role_id = event.target.value;
      //  ListInput.position_id = this.position_id;
      this.GetList(ListInput);
      // this.loader.close();

    }
  }

  showByRole(event) {
    const ListInput: searchinput = {} as searchinput;
    ListInput.offset = 0;
    ListInput.limit = 1

    ListInput.role_id = event.target.value;
 //   ListInput.position_id = this.position_id;

    this.GetList(ListInput);
    //this.loader.close();

  }


}



export interface input {
  role_id: string,
  position_name: string,
  position_id: string,
  offset: number
}

export interface Updateinfo {
  role_name: any;

  position_name: string;
  position_id: string;
  status: string;
  role_id: string;





}

export interface FinalArray {
  role_id: string;
  position_id: string;
  page_list: any[];

}

export interface FormArray {
  page_id: string;
  page_detail_id: string;

}

export interface searchinput {
  limit: number;
  position_id: string;
  position_name: string,
  offset: number,
  role_id: string;
}