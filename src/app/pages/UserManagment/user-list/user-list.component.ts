import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
//import { NgbModal, ModalDismissReasons, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';
import { timestamp } from 'rxjs/operators';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import Swal from 'sweetalert2';
import { CommonService } from '../../../shared/Services/common-service.service';
import { UserManagmentServiceService } from './../../../shared/Services/user-managment-service.service'

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  exampleForm = new FormGroup({ firstName: new FormControl(), lastName: new FormControl(), role_id: new FormControl(), position_name: new FormControl() });
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @ViewChild('content1', { static: true }) content1: NgbDropdown;
  @Output() closemodal = new EventEmitter<any>();


  //@ViewChild('content') content


  items: any;
  RoleType: any[] | undefined;
  Position: any[] | undefined;

  public itemForm: FormGroup | undefined;
  public AllFilters = new FormGroup({});
  isDisabled: boolean;

  // setOption(value) {      
  //   this.data = value;  
  // }
  currentPage: any
  totalrecord: any
  noofrecordsperpage: any;
  GeoDiv: boolean | undefined;
  Valdationmessage: string;
  showiscontrator: string;
  isvaliddist: boolean;
  Role: string;
  // RoleName: any;
  isDistributor: boolean = false;
  distributor_code: string;
  loginData: string;
  isRegistrationForm: boolean = true;
  isDistDrpDownVisible: boolean;
  distributor_id: string;
  distributor_name: string;
  // AllFilters: FormGroup;
  showlocationtype: string = "Div";
  DistributorList: FormGroup;
  DivisionList: FormGroup;
  TempDistributor: any[];
  Districtdata: any[];
  DisplayDistrict: any[];
  selectedDistributor: any[];
  selectedState: any;
  DisplayState: any;
  selected: any;
  District: any[];
  showDist: boolean = true;
  showDiv: boolean = false;
  Distributor: any[];
  Division: any[];
  TempDivision: any[];
  DistributorData: any;
  filteredOptions: any;
  division_name: any;
  division_id: any;
  RoleName: any;
  DistCode: string;
  selectedDisplayDivision = [];
  tempselectedDisplayDivision: [];
  selectedDivisions = [];
  selectedDivArray: any = [];
  onPageLoad: number = 0;
  tempDivisionArray: any = [];
  role_id: any;
  PositioNname: any;
  status: any;
  first_name: any;
  last_name: any;
  user_name: any;
  role_name: any;
  position_id: string;
  messageEvent: any;
  isCustomizerOpen: boolean;
  tableOffset: number;
  contact_no: any;
  email_id: any;
  position: any;
  roleName: any;
  Positionname: any;
  PositionType: any;
  account_type: string;
  typeData: any;

  showRecords: number;
  data: any;
  btnSave: boolean;
  Roletypedisable: boolean;
  btnupdate: boolean;
  //myDrop: any;
  page: any;
  temp: any;
  click: Subscription;
  div_id: any;
  Filterarray: any;
  datepipe: any;
  Finaldata = []
  selectedDisplayDistributor = [];
  Divvsion: any;
  Distributors1: any;
  account_name: string;
  account_id: string;
  // prepareData: any;


  constructor(private UserService: UserManagmentServiceService, private modalService: NgbModal,
    private fb: FormBuilder, private CommonService: CommonService, private fb1: FormBuilder,
    private router: Router,


    private loader: AppLoaderService) { this.createForm(''); }
  createForm(row: any) {

    this.exampleForm = this.fb.group({

      role_id: row.role_id,
      position_name: row.position_name,
      position_id: row.position_id
    });
  }

  ngOnInit(): void {


    this.showRecords = 10;
    this.noofrecordsperpage = 10
    this.isRegistrationForm = true

    console.log(this.isRegistrationForm, "registration")
    this.AllFilters = this.fb.group({
      partNumber: [''],
      org_name: [''],
      division_name: [''],

    })
    this.DistributorList = new FormGroup({
      distributor_name: new FormControl()
    });
    this.DivisionList = new FormGroup({
      div_name: new FormControl()
    });
    // this.selectedDisplayDivision[''];
    // this.selectedDisplayDistributor[''];



    this.GeoDiv = true
    this.showiscontrator = "No"
    this.currentPage = 1
  //  this.totalrecord =0
    //this.noofrecordsperpage = 10
    var RoleName = this.CommonService.getRole();
    this.Role = RoleName;
    this.isDistDrpDownVisible = true;
    if (this.Role != "TML") {
      this.isDistDrpDownVisible = false;
    }
    this.RoleName = this.CommonService.getRole();
    this.DistCode = this.CommonService.GetDistributorCode()
    // alert(this.DistCode);

    // if (this.RoleName != "TML") {
    //   this.isDistDrpDownVisible = false;
    //   const data: InputData1 = {} as InputData1;

    //   // data.distributor_id = Event.distributor_id;
    //   data.distributor_id = this.DistCode;
    //   data.div_search_text = "";

    //   this.Getdivision(data, 0);
    // }
    // else {
    //   const data: InputData = {} as InputData;

    //   data.size = 5;
    //   data.org_search_text = "";

    //   this.GetDistributor(data);
    // }

    // if(this.showDist == true){
    const data: InputData = {} as InputData;

    data.size = 5;
    data.org_search_text = "";

    this.GetDistributor(data);
    // }

    // if(this.showDiv == true){
    // const data1: InputData1 = {} as InputData1;
    // data1.distributor_id = this.DistCode;
    // data1.div_search_text = "";

    // this.Getdivision(data1, 0);
    // }
// this.GetRole()
    // this.GetPosition('')

    // this.save();
    const ListInput: ListInput = {} as ListInput;

    ListInput.offset = 0
    ListInput.size = this.noofrecordsperpage
    this.GetList(ListInput);
   // const ListInput1: ListInput = {} as ListInput;

    //ListInput1.offset = 0;
    // this.d(ListInput);
    // this.RoleName = this.CommonService.getRole();
    // alert(this.RoleName);
    this.BuildForm()
    this.buildItemForm('')

  }

  BuildForm() {

    this.AllFilters = this.fb.group({
      account_type: [''],
      status: [''],
      user_name: [''],
      contact_no: [''],
      email_id: [''],
      first_name: [''],
      last_name: [''],
      distributor_code: [''],
      position: [''],
      position_id: [''],
      role_id: [''],
      positionname: [''],
      Rolename: ['']



    });
  }
  Editpopup(content1: any, row: any) {

    

    

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


  Editpopup1(content: any, row: any) {
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
    this.myDrop.close();
  }
  GetList(ListInput: any) {

    // this.FilterStrings(ListInput)

    // this.loader.open();



    this.UserService.RegistrationList(ListInput).subscribe(

      data => {



        if (data.success == true) {
          
          this.items = data.data;
          this.totalrecord = data.rangeInfo.total_row;
          this.showRecords = data.data.length
         // this.loader.close()

        }



        else {

          //  this.loader.close()


        }
      }, (err) => {

      }

    );




  }
  onChange(value: any) {




    this.GetPosition(value.target.value);
  }
  saveuserdata() {
    this.nextStep();
    
  }
  nextStep() {

    
    //  this.itemForm.reset();

    if (this.itemForm.valid) {
      this.isRegistrationForm = false
    }

    if (this.isvaliddist == false) {
      this.Valdationmessage = "Please Enter Valid Distributor Code"
      return false;

    }

    if (this.showiscontrator == "Yes") {
      var validemail = this.isValidMail(this.itemForm.value.username)


      if (validemail == false) {
        this.Valdationmessage = "In Case of Contractor registration , Username must be same as  email-id (xxx@tatamotors.com) "
        return false

      }

    }


    if (this.itemForm.controls.email_id.invalid) {
      this.Valdationmessage = "Please Enter Valid Email-id"
      return false;

    }

    if (this.itemForm.invalid) {
      this.Valdationmessage = " marked fields are mandatory *"
      return false;

    }
    else {
      this.Valdationmessage = ""
      // this.selectedIndex = this.selectedIndex + 1;
      // return false;
    }
  }
  closeModal() {
    this.closemodal.emit();
  }
  Edit(data: any = {}) {

    //console.log(data);

    //alert('Edit');
    if (data != '') {
      this.data.setOption(data);
    }
    else {

    }

    // this.router.navigate(['pages/UserRegistration']);

    this.router.navigate(['pages/NewRegistration']);
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

  statuschange(data: any) {
    if (status === 'pending') {
      this.isDisabled = true;
    }
    else {

    }

    // this.router.navigate(['pages/UserRegistration']);

    this.router.navigate(['pages/NewRegistration']);
  }


  buildItemForm(item: any) {


    debugger;
    this.itemForm = this.fb.group({
      username: [item.user_name || '', Validators.required],
      first_name: [item.first_name || ''],
      last_name: [item.last_name || ''],
      email_id: [item.email_id || '', Validators.email],
      phone_number: [item.contact_no || '', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      role_id: [item.role_id || 'none', Validators.required],
      position_id: [item.position_id || 'none', Validators.required],
      distributor_code: [item.distributor_code || ''],
      userid: [item.userid || ''],
      is_active: [item.is_active],
      division_id: [item.division_id],
      organization_id: [item.organization_id]


    })
    var Distcode = this.CommonService.GetDistributorCode()
    // alert(Distcode)
    if (this.Role == "Distributor") {
      // alert('condition')
      // console.log('controls  ==  ', this.itemForm.controls)
      this.itemForm.get('role_id').setValue(2);
      this.itemForm.get('distributor_code').setValue(Distcode);

      this.GetPosition(2);
      this.isvaliddist = true
      this.isDistributor = true
      // this.hideSelection = false
    }
    else {
      this.isDistributor = false
      // this.hideSelection = true
    }

    if (item.is_active == undefined || item.is_active == null) { this.itemForm.get('is_active').setValue(true); }

    if (item.is_contractor == undefined || item.is_contractor == null) {
      this.showiscontrator = "No"
      // this.EmailHide = false;
      // this.itemForm.get('is_contractor').setValue(false);
    }
    if (item.is_contractor == true) {
      this.showiscontrator = "Yes"
      // this.EmailHide = true;
      // this.itemForm.get('is_contractor').setValue(true);
    }
    if (item.is_contractor == false) {
      this.showiscontrator = "No"
      // this.EmailHide = false;
      // this.itemForm.get('is_contractor').setValue(false);
    }
  }



  save() {






    ///this.isRegistrationForm=true



    var Divvsion = ["ALL"]
    var Distributors1 = ["NA"]
    this.AllFilters.reset();
    if (this.selectedDisplayDivision.length != 0) {
      Divvsion = this.selectedDisplayDivision
    }

    if (this.selectedDisplayDistributor.length != 0) {
      Distributors1 = this.selectedDisplayDistributor
    }


    this.prepareData(this.itemForm.value, Divvsion, Distributors1)

    

  }

  prepareData(Event, Divvsion, Distributors1) {
  
  
    this.Finaldata = [];

    var divi = Divvsion[0];
    var disti = Distributors1[0];



    if (divi == "ALL" && disti == "NA") {

      const ListInput: DataInsert = {} as DataInsert;
      ListInput.division_id = "NA";
      ListInput.organization_id = "ALL";
      this.Finaldata.push(ListInput)
    }
    else if (divi == "ALL" && disti != "NA") {
      for (let Distibutor of Distributors1) {
        const ListInput: DataInsert = {} as DataInsert;
        ListInput.division_id = "NA";
        ListInput.organization_id = Distibutor.value;
        this.Finaldata.push(ListInput)
      }

    }
    else if (divi != "ALL" && disti != "NA") {
      for (let Division of Divvsion) {
        const ListInput: DataInsert = {} as DataInsert;
        ListInput.division_id = Division.value;
        ListInput.organization_id = "NA";
        this.Finaldata.push(ListInput)
      }



    }
    else if ((divi != "ALL" || divi != "NA") && (disti == "NA" || disti == "ALL")) {
      for (let Division of Divvsion) {
        const ListInput: DataInsert = {} as DataInsert;
        ListInput.division_id = Division.value;
        ListInput.organization_id = "NA";
        this.Finaldata.push(ListInput)
      }



    }





    const ListInputGFinal: FinalData = {} as FinalData;



    ListInputGFinal.username = Event.username
    ListInputGFinal.first_name = Event.first_name
    ListInputGFinal.last_name = Event.last_name

    ListInputGFinal.phone_number = Event.phone_number
    ListInputGFinal.role_id = Event.role_id
    ListInputGFinal.position_id = Event.position_id
    ListInputGFinal.distributor_code = Event.distributor_code
    ListInputGFinal.userid = Event.userid
    ListInputGFinal.is_active = Event.is_active
    ListInputGFinal.mapping_data = this.Finaldata

    // if (Event.is_contractor == null) {
    //   ListInputGFinal.is_contractor = false
    // }
    // else {
    //   ListInputGFinal.is_contractor = Event.is_contractor
    // }


    // if (this.showiscontrator == "Yes") {
    //   ListInputGFinal.is_contractor = true
    //   ListInputGFinal.email_id = Event.username
    // } else {
    //   ListInputGFinal.is_contractor = false
    //   ListInputGFinal.email_id = Event.email_id
    // }


    //alert(Distcode)
    if (this.Role == "Distributor") {

      ListInputGFinal.is_contractor = false
    }

    ListInputGFinal.password = ""//Event.password
    //  console.log(ListInputGFinal)


    this.click = this.CommonService.RegistrationSave(ListInputGFinal).subscribe(
      data => {

        debugger;
        if (data.success == true) {

          this.isRegistrationForm = true

          Swal.fire({
            title: 'Member Added!',
            // text: "You won't be able to revert this!",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {

              this.selectedDivisions = []
              this.itemForm.reset();
              this.content1.close();
              //this.content.nativeElement.click();

              // this.router.navigate(['pages/RegistrationList']);
            }
            else {
              // this.router.navigate(['pages/RegistrationList']);
            }
          })




          //    Swal.fire('Member Added!')
          //  this.router.navigate(['pages/RegistrationList']);

        }
        else {

          Swal.fire({
            title: data.error.data.msg,
            // text: "You won't be able to revert this!",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {

          })
          // Swal.fire(data.error.data.msg)


        }
      }, (err) => {


        debugger;


      }

    );


   // this.myDrop.close();

   this.modalService.dismissAll();



  }


  closeResult = '';
  open(content: any) {

    // this.itemForm?.reset()
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      // console.log('controls open function  ==  ', this.itemForm.controls)
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
  handleChange() {
  }

  pageChange(page: any) {

   // document.body.scrollTop = 0;
     //this.noofrecordsperpage = 10
     

     debugger;
    this.currentPage = page;
    page = page - 1;


    const ListInput: ListInput = {} as ListInput;





  

    if (this.position_id) {

      ListInput.position_id = this.position_id;
    }
    else {

      ListInput.position_id = "";
    }


    if (this.role_id) {

      ListInput.role_id = this.role_id;
    }
    else {

      ListInput.role_id = "";
    }

    if (this.position) {

      ListInput.position = this.position;
    }
    else {

      ListInput.position = "";
    }


    if (this.distributor_code) {

      ListInput.distributor_code = this.distributor_code;
    }
    else {

      ListInput.distributor_code = "";
    }


    if (this.last_name) {

      ListInput.last_name = this.last_name;
    }
    else {

      ListInput.last_name = "";
    }


    if (this.first_name) {

      ListInput.first_name = this.first_name;
    }
    else {

      ListInput.first_name = "";
    }


    if (this.email_id) {

      ListInput.email_id = this.email_id;
    }
    else {

      ListInput.email_id = "";
    }



    if (this.contact_no) {

      ListInput.contact_no = this.contact_no;
    }
    else {

      ListInput.contact_no = "";
    }



    if (this.user_name) {

      ListInput.user_name = this.user_name;
    }
    else {

      ListInput.user_name = "";
    }




    if (this.status) {

      ListInput.status = this.status;
    }
    else {

      ListInput.status = "";
    }
    ListInput.offset = (page *10);
    ListInput.size = this.noofrecordsperpage
    // this.AllFilters.get('positionname').setValue(this.PositioNname);
    // this.AllFilters.get('Rolename').setValue(this.RoleName);
   //ListInput.offset = 0;
   //ListInput.offset = (page * 10);

    this.GetList(ListInput);
    //this.loader.close();
   // this.myDrop.close();

  }


  selectedRole(value) {


    let Rolename = this.RoleType.find(x => x.role_id === value);

    this.RoleName = Rolename.role_name;
    this.GetPosition(value);
    this.AllFilters.reset()




  }

  selectedPosition(value) {
    debugger
    let Positionname = this.Position.find(x => x.position_id == value);
    this.PositioNname = Positionname.position_name;
    this.AllFilters.reset();


  }
  SearchAllDate() {
    debugger;
  //  this.tableOffset = 0
    const ListInput: ListInput = {} as ListInput;
     this.currentPage = 1

    // this.account_type = this.AllFilters.value.account_type;
    this.status = this.AllFilters.value.status;
    this.user_name = this.AllFilters.value.user_name;
    this.contact_no = this.AllFilters.value.contact_no;
    this.email_id = this.AllFilters.value.email_id;
    this.first_name = this.AllFilters.value.first_name;
    this.last_name = this.AllFilters.value.last_name;
    this.distributor_code = this.AllFilters.value.distributor_code;
    this.position = this.AllFilters.value.position;
    this.position_id = this.AllFilters.value.position_id;
    this.role_id = this.AllFilters.value.role_id;


    this.roleName = this.AllFilters.value.Rolename;
    this.Positionname = this.AllFilters.value.positionname;

    if (this.position_id) {

      ListInput.position_id = this.position_id;
    }
    else {

      ListInput.position_id = "";
    }




    if (this.role_id) {

      ListInput.role_id = this.role_id;
    }
    else {

      ListInput.role_id = "";
    }

    if (this.position) {

      ListInput.position = this.position;
    }
    else {

      ListInput.position = "";
    }


    if (this.distributor_code) {

      ListInput.distributor_code = this.distributor_code;
    }
    else {

      ListInput.distributor_code = "";
    }


    if (this.last_name) {

      ListInput.last_name = this.last_name;
    }
    else {

      ListInput.last_name = "";
    }


    if (this.first_name) {

      ListInput.first_name = this.first_name;
    }
    else {

      ListInput.first_name = "";
    }


    if (this.email_id) {

      ListInput.email_id = this.email_id;
    }
    else {

      ListInput.email_id = "";
    }



    if (this.contact_no) {

      ListInput.contact_no = this.contact_no;
    }
    else {

      ListInput.contact_no = "";
    }



    if (this.user_name) {
      ListInput.user_name = this.user_name;
    }
    else {

      ListInput.user_name = "";
    }





    if (this.status) {

      ListInput.status = this.status;
    }
    else {

      ListInput.status = "";
    }

    this.AllFilters.get('positionname').setValue(this.PositioNname);
    this.AllFilters.get('Rolename').setValue(this.RoleName);

    //ListInput.offset = (page *10)
   // ListInput.size = this.noofrecordsperpage

    this.GetList(ListInput);
    //this.loader.close();
    this.myDrop.close();
    //this.resetALl();


  }
  // FilterStrings(ListInput) {
  //   this.Filterarray = [];

  //   for (let item in ListInput) {

  //     if (ListInput[item]) {
  //       var Json = { "Key": item, "Value": ListInput[item] }
  //       this.Filterarray.push(Json)

  //     }
  //   }
  //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
  //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
  //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'distributor_id');
  //   var from_date1 = ListInput.from_date;
  //   var to_date1 = ListInput.to_date;
  //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
  //   this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
  //   var finaldate = this.dateformate(from_date1) + ' '+ 'to' + ' ' + this.dateformate(to_date1);
  //   var Json1 = { "Key": 'from_date', "Value": finaldate }
  //   this.Filterarray.push(Json1)
  // }
  // dateformate(date) {
  //   return this.datepipe.transform(date, 'dd/MM/yyyy');
  // }

  // onRemoveFilter(Filterarray){
  //   this.SearchAllDate();
  // }
  onRemoveFilter(filterString) {
    // this.isDivisionVisible = false;

    let Filterarrays = this.Filterarray;
    if (filterString.Key == "contact_no") {
      this.contact_no = "";
      this.AllFilters.get("contact_no").setValue("")
      //  this.AllFilters.get('otc_no_search').setValue("");
    }

    else if (filterString.Key == "first_name") {
      this.first_name = "";
      this.AllFilters.get("first_name").setValue("")



    }

    this.SearchAllDate();
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
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'range_gt');
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
    this.AllFilters.reset();
    this.itemForm.reset();
    this.DistributorList.reset();
    this.DivisionList.reset();
    this.BuildForm();
    this.buildItemForm('')
     this.currentPage = 1,
     this.account_type = "",
      this.status = " ",
      this.role_name = ""
      this.user_name = "",
      this.contact_no = "",
      this.email_id = "",
      this.first_name = "",
      this.last_name = "",
      this.distributor_code = "",
      this.position = "",
      this.position_id = "",
      this.role_id = "",
      this.GetRole();
     this.GetPosition('');
    this.GetList('')
    this.Add();
   // this.OnselectedPosition('');
    // this.save();
    //this.myDrop.close();




  }
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

    this.myDrop.close();


  }
  resetFilterFeild() {
    this.AllFilters.reset();
    this.itemForm.reset();
    this.buildItemForm('');
    this.BuildForm()
    this.currentPage = 1,
      this.account_type = "",
      this.status = " ",

      this.user_name = "",
      this.contact_no = "",
      this.email_id = "",
      this.first_name = "",
      this.last_name = "",
      this.distributor_code = "",
      this.position = "",
      this.position_id = "",
      this.role_id = ""
      this.role_name="",
      this.GetRole();
     this.GetPosition('')
     this.myDrop.close();


  }


  GetPosition(id) {

    debugger;

    var Json = {
      "role_id": id
    }


    this.UserService.BindPosition(Json).subscribe(

      data => {

        if (data.success == true) {

          this.PositionType = data.data;
          console.log(this.PositionType);
        }


        else {

        }
      }, (err) => {

      }

    );

    this.myDrop.close();


  }

  isValidMail(email) {
    debugger
    var mailPattern = /^[a-zA-Z0-9._-]+@tatamotors.com$/;
    return mailPattern.test(email)
    // var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if(re.test(email)){
    //     //Email valid. Procees to test if it's from the right domain (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
    //     if(email.indexOf("@thedomain.com", email.length - "@thedomain.com".length) !== -1){
    //         //VALID
    //     }
    // }
  }


  SearchByContact(event) {
    if (event.key === "Enter") {
      const ListInput: searchinput = {} as searchinput;
      ListInput.offset = 0;
      ListInput.contact_no = event.target.value;
      this.GetList(ListInput);
      // this.loader.close()

    }
  }

  showByContact(event) {
    const ListInput: searchinput = {} as searchinput;
    ListInput.offset = 0;
    ListInput.contact_no = event.target.value;
    this.GetList(ListInput);
    this.loader.close()

  }
  Distributortype() {

    this.distributor_id = ""
    this.distributor_name = ""

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = this.AllFilters.value.org_name;

    this.GetDistributor(data1);
  }
  GetDistributor(Data) {
    // this.AllDataArray = [];
    // this.tempDivisionArray = [];

    this.CommonService.DistributorList(Data).subscribe(

      data => {




        if (data.success == true) {

          //     this.dataPreparation(data.data);

          this.DistributorData = data.data.result;
          this.filteredOptions = data.data.result
          this.DistributorList = new FormGroup({})
          for (let formModule of this.DistributorData) {
            this.DistributorList.addControl(formModule.distributor_id, new FormControl(false))
          }

          for (let i = 0; i < this.DistributorData.length; i++) {
            const data: InputData = {} as InputData;
            // this.AllDataArray.push(this.DistributorData[i].distributor_id)
            data.distributor_id = this.DistributorData[i].distributor_id;
            data.div_search_text = "";
            // if (this.showDiv) {
            this.Getdivision(data, i);
            // }


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

  Getdivision(Data1, i) {
    // this.AllDataArray = [];
    if (this.showDiv) {
      this.DistributorData[i]['divData'] = [];
    }
    this.CommonService.DivisionList(Data1).subscribe(

      data => {



        if (data.success == true) {

          //     this.dataPreparation(data.data);
          this.Division = [];
          // this.filterValue2 = null;
          this.Division = data.data.result;
          if (this.showDiv) {
            var tempArray = [];
            tempArray.push(data.data.result)
            // alert(tempArray)
            this.DistributorData[i]['divData'] = tempArray[0]
            // this.DistributorData[i]['divData'].push(data.data.result)
            for (let q = 0; q < this.Division.length; q++) {
              this.tempDivisionArray.push(this.Division[q]);
            }

            this.DivisionList = new FormGroup({})
            for (let formModule of this.tempDivisionArray) {
              this.DivisionList.addControl(formModule.div_id, new FormControl(false))
            }
          } else {
            this.DivisionList = new FormGroup({})
            for (let formModule of this.Division) {
              this.DivisionList.addControl(formModule.div_id, new FormControl(false))
            }
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

  toggle_vehicle_list(vehicleId): void {
    // this.AllFilters.get('org_name').setValue(vehicleId.distributor_name);
    // if (this.onPageLoad == 0) {
    //   this.onPageLoad = 1;
    //   this.prevDistID = vehicleId.distributor_id;
    // }

    // if (this.prevDistID != vehicleId.distributor_id) {
    //   for (let q = 0; q < this.DistributorData.length; q++) {
    //     if (this.prevDistID == this.DistributorData[q].distributor_id) {
    //       document.getElementById(this.prevDistID).style.display = 'none';
    //     }
    //   }

    //   this.prevDistID = vehicleId.distributor_id;
    // }

    if (document.getElementById(vehicleId.distributor_id).style.display == 'block') {
      document.getElementById(vehicleId.distributor_id).style.display = 'none';
    }
    else {
      document.getElementById(vehicleId.distributor_id).style.display = 'block';
    }
  }

  // divisionfilteradd(row, event) {
  //   // this.selectedDivisions = []
  //   // this.division_name = row.div_name
  //   // if (this.onPageLoad == 0) {
  //   //   this.onPageLoad = 1;
  //   //   this.division_id = row.div_id
  //   //   this.selectedDivisions.push(row);
  //   //   // this.selectedDisplayDivision = this.selectedDivisions;
  //   // }

  //   var isArray = false;

  //   if (event.target.checked) {

  //     for(let i = 0; i < this.selectedDivisions.length; i++){
  //       if(this.selectedDivisions[i].div_id == row.div_id){
  //         isArray = true;
  //       }
  //     }
  //     var data2 = this.selectedDivisions.filter(book => book.div_id === 'xyz')

  //     if(data2.length == 0){
  //       this.selectedDivisions.push(row);
  //     }
  //     if(isArray == false){
  //       this.division_id = row.div_id;

  //       // this.selectedDisplayDivision = this.selectedDivisions;
  //     }

  //   }else{
  //     this.selectedDivisions.splice(this.selectedDivisions.findIndex(item => item.div_id === row.div_id), 1)
  //   }
  //   console.log('selected division  ', this.selectedDivisions)
  // }

  onChangeEvent(row, event) {
    // debugger
    // console.log('selectedDivArray', this.selectedDivArray)
    // console.log('row', row,event.target.checked,this.showDiv)
    if (event.target.checked) {
      if (this.showDiv) {
        var data2 = this.selectedDivArray.filter(book => book.div_id === row.div_id)
        // console.log('data', data2,data2.length)
        if (data2.length == 0) {
          this.selectedDivisions.push(row);
        }
      }
      if (this.showDist) {
        var data = this.selectedDivArray.filter(book => book.distributor_id === row.distributor_id)
        // console.log('data', data)
        if (data.length == 0) {
          this.selectedDivisions.push(row);
        }
      }

    }
    else {
      this.selectedDivisions.splice(this.selectedDivisions.findIndex(item => item.div_id === row.div_id), 1)
    }
  }

  Add() {


    if (this.showDiv) {

      this.DivisionList.reset();
      for (let i = 0; i < this.selectedDivisions.length; i++) {
        // for (let j = 0; j < this.selectedDivisions[i].divData.length; j++) {
        var data2 = this.selectedDivArray.filter(book => book.div_id === this.selectedDivisions[i].div_id)
        console.log('data', data2)
        if (data2.length == 0) {
          this.selectedDivArray.push(this.selectedDivisions[i])
        }

      }
    }
    if (this.showDist) {
      this.DistributorList.reset();
      for (let entry1 of this.selectedDivisions) {
        this.selectedDivArray.push(entry1)
      }
    }

   // this.myDrop.close();
  }

  // getDivisionSelectedOptions(selected3) {
  //   if (selected3.length > 0) {

  //     this.tempselectedDisplayDivision = [];


  //     var out = [];
  //     for (let entry1 of selected3) {
  //       var data = this.Division.filter((e) => e.value.includes(entry1));
  //       out.push(data[0]);
  //     }


  //     this.tempselectedDisplayDivision = out;


  //   }


  // }
  removeDivision(Division: any) {
    debugger;
    // this.selectedDisplayDivision.splice(this.selectedDisplayDivision.findIndex(item => item.display === Division), 1)
    this.selectedDivArray.splice(this.selectedDivArray.findIndex(item => item.div_id === Division.div_id), 1)

  }

  removeDist(Distributor: any) {
    debugger;
    // this.selectedDisplayDivision.splice(this.selectedDisplayDivision.findIndex(item => item.display === Division), 1)
    this.selectedDivArray.splice(this.selectedDivArray.findIndex(item => item.distributor_name === Distributor.distributor_name), 1)

  }

  ChangeType(event) {
    console.log('event  ', event)
    this.selectedDivArray = []
    const data: InputData = {} as InputData;

    data.size = 5;
    data.org_search_text = "";

    this.GetDistributor(data);
    if (event.value == "Dist") {
      this.showDiv = false
      this.showDist = true
    }
    else if (event.value == "Div") {
      this.showDiv = true
      this.showDist = false
    }

  }
  omitSpecialChar(event) {
    const keyPressed = String.fromCharCode(event.keyCode);
    const verifyKeyPressed = /^[a-zA-Z\' \u00C0-\u00FF]*$/.test(keyPressed);
    return verifyKeyPressed === true;
  }

  // Divisiontype(value) {
  //   this.division_id = ""
  //   this.division_name = ""

  //   const data1: InputData = {} as InputData;

  //   data1.size = 5;
  //   data1.division_search_text = this.AllFilters.value.division_name;
  //   this.Getdivision(data1, 0);
  // }

  back() {
    this.isRegistrationForm = true;

  }
  OnselectedPosition(value) {
    console.log(value)


  }
}

export class DataPreapre {

  display: string
  value: string

}

export class InputData {

  size: number
  org_search_text: string
  division_search_text: string
  partNumber_search_text: string
  distributor_id: string
  div_search_text: string


}
export interface ListInput {
  size: any;

  offset: number

  account_type: string
  status: string
  user_name: string
  contact_no: string
  email_id: string
  first_name: string
  last_name: string
  distributor_code: string
  position: string
  position_id: string
  role_id: string
}

export interface searchinput {
  contact_no: string,
  offset: number,
}

export class InputData1 {
  distributor_id: string
  div_search_text: string
  account_name: string;
  size: number;
  // size: number
  // org_search_text: string


}
export class DataInsert {
  division_id: string
  organization_id: string
}
export class FinalData {
  username: string
  first_name: string
  last_name: string
  email_id: string
  phone_number: string
  role_id: string
  position_id: string
  distributor_code: string
  userid: string
  is_active: string
  mapping_data: any
  is_contractor: any
  password: string
}