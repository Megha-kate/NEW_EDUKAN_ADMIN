import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { UserManagmentServiceService } from 'src/app/shared/Services/user-managment-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-web-rolemaster',
  templateUrl: './web-rolemaster.component.html',
  styleUrls: ['./web-rolemaster.component.scss']
})
export class WebRolemasterComponent implements OnInit {
  public itemForm: FormGroup | undefined;
  noofrecordsperpage: number;
  totalrecord: any;
  loader: any;
  role_name: any;
  constructor(private UserService: UserManagmentServiceService
    , private modalService: NgbModal,
    private fb: FormBuilder,
  ) { }

  btnSave: boolean | undefined;
  UpdateDetails = new FormGroup({})
  btnupdate: boolean | undefined;
  orders:any = [];
  currentPage:any;

  showRecords:number;

  ngOnInit(): void {

    this.showRecords=10;
    
    this.btnSave = true;

    this.btnupdate = false;
    this.currentPage = 1
    this.noofrecordsperpage = 10
    const ListInput: ListInput = {} as ListInput;

    ListInput.offset = 0;
    this.loadlist(ListInput)
    this.buildItemForm('')
    this.buildForm()
    //this.loader.close();
  }
  
  applyFilter(page = 0) {
    this.currentPage = 1;
   
  }
  RoleType: any;

  reset()
  {}

  GetRole() {

    this.UserService.BindRoleTypeOld('').subscribe(

      data => {

        if (data.success == true) {

          this.RoleType = data.data;


        }


        else {

        }
      }, (err) => {

      }

    );




  }
  closeResult = '';
  open(content: any) {

    this.btnSave = true;

    this.btnupdate = false;


    this.itemForm?.reset()

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


  Addpermissionpopup(content1: any, row: any) {

    this.itemForm?.reset;
    this.buildItemForm(row)

    this.bindList()

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

  rows: any
  temp: any
  FinalData: any;
  bindList() {
    debugger
    this.rows = [];
    this.temp = []
    this.FinalData = []

    var input = this.itemForm!.value;
    this.UserService.BindWebRoleType(input).subscribe(

      data => {
        this.rows = data
        if (data.success == true) {
          this.UpdateDetails = new FormGroup({})

          this.rows = data.data;
          for (let entry1 of this.rows) {

            if (entry1.is_permission == true) {
              this.selectedData.push(entry1);
            }

            this.UpdateDetails.addControl(entry1.access_id, new FormControl(entry1.is_permission))

            var tempdata = this.temp.filter((item: { category: any; }) => item.category === entry1.category);
            if (tempdata.length == 0) {
              var string = { category: entry1.category }
              this.temp.push(string)
            }
          }

          for (let rows of this.temp) {
            var tempdata = this.rows.filter((item: { category: any; }) => item.category === rows.category);


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

  selectedData: any = []
  eventCheck(event: any, Details: any) {



    if (event.target.checked) {
      // Pushing the object into array
      this.selectedData.push(Details);

    } else {
      let removeIndex = this.selectedData.findIndex((itm: { access_id: any; }) => itm.access_id === Details.access_id);

      if (removeIndex !== -1)
        this.selectedData.splice(removeIndex, 1);
    }






  }

  filterForm: FormGroup;

  buildForm() {
    this.filterForm = this.fb.group({
      'start': ['', [
        Validators.required
      ]],
      'end': ['', [
        Validators.required
      ]],
      'otcno': ['', [Validators.required]]
    });
  }

  Editpopup(content: any, row: any) {
    debugger
    this.itemForm?.reset()
    this.btnSave = false;

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
  Update() {
    if (this.itemForm!.invalid) {
      return;
    }

    const Final: Updateinfo = {} as Updateinfo;
    Final.role_name = this.itemForm!.value.role_name;
    Final.role_id = this.itemForm!.value.role_id
    Final.is_active = true;

    Final.action_type = "update"
    this.insertupdatePosition(Final);
  }
  omit_special_char(event: any) {
    var k;
    k = event.charCode;  //         k = event.keyCode;  (Both can be used)
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
  }

  save() {
    debugger

    if (this.itemForm!.invalid) {
      return;
    }

    const Final: Updateinfo = {} as Updateinfo;
    Final.role_name = this.itemForm!.value.role_name;
    Final.is_active = true


    this.insertupdatePosition(Final);
    //Swal.fire("Data save Successfully");
  }

  DataPushArray: any
  savepermission() {
    this.DataPushArray = []

    if (this.selectedData.length > 0) {


      for (let entry1 of this.selectedData) {
        const dataList1: FormArray = {} as FormArray;
        dataList1.access_id = entry1.access_id;
        dataList1.cust_page_id = entry1.cust_page_id;

        this.DataPushArray.push(dataList1);

      }


      const Final: FinalArray = {} as FinalArray;
      Final.role_id = this.itemForm!.value.role_id;
      Final.access_list = this.DataPushArray;


      this.UserService.InsertWebPageMapping(Final).subscribe(

        data => {
          debugger
          if (data.success == true) {

            alert('Data Saved Sucessfully')

            this.itemForm!.reset();
            this.UpdateDetails.reset();
            this.modalService.dismissAll()
            this.loadlist('')


          }



          else {



          }
        }, (err) => {


        }

      );


    }
    else {

    }


  }

  buildItemForm(row: any) {




    debugger;
    this.itemForm = this.fb.group({

      role_name: [row.role_name || '', Validators.required],
      role_id: [row.id],
      is_active: []




    })


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

  loadlist(json) {
    // var json = ''
     //this.loader.open()
    this.UserService.BindWebRoleTypeMaster(json).subscribe(

      data => {

        if (data.success == true) {

          this.RoleType = data.data;
          this.totalrecord = data.total_result;
          this.showRecords=data.data.length

        }


        else {
         
        }
      }, (err) => {

      }

    );
  }

  insertupdatePosition(Final: any) {



    this.UserService.InsertWebPannelUpdateRoleMaster(Final).subscribe(

      data => {

        if (data.success == true) {

          debugger


          //alert(data.data.msg);
          this.itemForm?.reset()
          this.modalService.dismissAll()
          this.loadlist('')
          //Swal.fire("Data save Successfully");



        }


        else {
          //alert(data.data.msg);
          Swal.fire("Data save Successfully");

        }
      }, (err) => {
        alert('Exception Occured!');
        Swal.fire("Data save Successfully");

      }

    );
  }
  pageChange(page: any) {

    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;


    // const ListInput: ListInput = {} as ListInput;
    const ListInput: ListInput = {} as ListInput;

    ListInput.offset = (page * 10);
    this.loadlist(ListInput)
    //this.loader.close();



  }


  SearchByRole(event) {
    debugger
    if (event.key === "Enter") {
 
      const ListInput: searchinput = {} as searchinput;
      ListInput.offset = 0;
      ListInput.role_name = event.target.value;
      this.loadlist(ListInput);
    }
  }

  showByRole(event) {
    const ListInput: searchinput = {} as searchinput;
    ListInput.offset = 0;
    ListInput.role_name = event.target.value;
    this.loadlist(ListInput);
  }
}

export interface Updateinfo {

  role_name: string;
  is_active: boolean;
  role_id: string;
  action_type: string;




}

export interface FormArray {

  access_id: string;
  cust_page_id: string;

}
export interface FinalArray {
  role_id: string;

  access_list: any[];

}
export interface ListInput {

  offset: number
}

export interface searchinput {
  offset: number,
  role_name:string;
}