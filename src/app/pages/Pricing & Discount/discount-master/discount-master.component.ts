import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import { CommonService } from '../../../shared/Services/common-service.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
// import { AppConfirmService } from 'src/app/shared/Services/app-confirm.service';
import { Router } from '@angular/router';
import { FileUploadService } from 'src/app/shared/Services/file-upload.service';
import { ExcelServiceService } from 'src/app/shared/Services/excel-service.service';
import { DataPassServiceService } from 'src/app/shared/Services/data-pass-service.service';
import { AppConfirmService } from 'src/app/shared/Services/app-confirm.service';
import { state } from '@angular/animations';
//import { SelectAutocompleteComponent } from 'mat-select-autocomplete';
import *  as XLSX from 'xlsx';


@Component({
  selector: 'app-discount-master',
  templateUrl: './discount-master.component.html',
  styleUrls: ['./discount-master.component.scss']
})
export class DiscountMasterComponent implements OnInit {

  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @ViewChild('offerpopup', { read: TemplateRef, static: false }) offerpopup: TemplateRef<any>;
  @ViewChild('inputFile', { static: false }) myInputVariable: ElementRef;
  @Output() closemodal = new EventEmitter<any>();



  closeResult = '';

  isActiveTab: any;
  DistrictLists = new FormGroup({});
  DivisionList = new FormGroup({});

  currDiv: any;
  offerdetails: boolean;
  productdetails: boolean;
  productsummary: boolean;
  locationdetails: boolean;

  isDistributor: boolean;
  ShowGeodrp: boolean = false;

  noofrecordsperpage: number;
  totalrecord: number;
  items: any[];
  temp: any[];

  isPgLine: boolean;
  isPart: boolean;
  isAllCustomer: boolean;
  isAccount: boolean;
  isFleetOwner: boolean;
  isRetailer: boolean;
  isAllDisable: boolean;

  isDistributorSearch: boolean;
  isDivisionSearch: boolean;

  SelectedCustomer = [];

  // public itemForm: FormGroup;
  public AllFilters: FormGroup;
  StateLists = new FormGroup({});


  ShowCustom: boolean;
  todaydate: boolean;
  sevenday: boolean;
  iscustomDate: boolean = false;
  isLastsevenDay: boolean = false;
  isToday: boolean = false;
  isThirtyDays: boolean;

  Filterarray: any = [];

  from_date: any;
  to_date: any;
  From_date: any;
  To_date: any;
  minDate: any
  now: any;

  selectedIndex: number = 0;

  errorselectmsg: any = "";
  errorlocationmsg: any = "";
  RoleName: any;

  isdist: boolean = true;

  isDistributorShow: boolean;

  disc_code: any;
  btnSave: boolean;
  btnUpdate: boolean;

  DisplayButton: boolean;
  StateData = []
  isvalidation: boolean = false;
  showRecords: number;
  filterValue: any;
  myControl: any;
  SelectProductPart: boolean;
  SelectedPartTemp: any;
  DisplayZone: any[];
  pgTitle: string;
  pgText: string;
  isCashDiscount: any;
  FileUploadService: any;
  DocumentFile: any;
  is_active: any;
  ismin_percentage: boolean;
  min_percentage: boolean;

  constructor(private modalService: NgbModal,
    private OrderListService: OrderserviceService,
    private CommonService: CommonService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    private toastrService: ToastrService,
    private datepipe: DatePipe,
    private confirmService: AppConfirmService,
    //private confirmService: AppConfirmService,
    private router: Router,
    private FileUpService: FileUploadService,
    private excelService: ExcelServiceService,
    private datapass: DataPassServiceService,

  ) { }

  open(content) {
    console.log("=====OPEN=====")
    this.offerdetails = true;
    this.productdetails = false;
    this.productsummary = false;
    this.locationdetails = false;

    this.SelectedCustomer = [];
    this.selectedPartArray = [];
    this.selectedSKUDisplay = [];
    this.selectedDisplayDistributor = [];
    this.selectedDisplayDivision = [];

    this.now = new Date();
    this.minDate = { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() };

    if (this.Role == "Distributor") {
      this.isdist = false;
      this.isDistributorShow = true;
      this.ShowGeodrp = false;

      var Json = {
        "multi_zone": [],
        "multi_state": [],
        "multi_district": [],
        "multi_distributor_code": [],
        "size": 1000
      }
      this.getdivisionDistributor(Json)
      var jsonn = { "multi_pg": ["pg1", "pg2", "pg3", "pg4", "pg5", "pg6"], "size": 1000 }
      this.Getpgline(jsonn);

    }
    else {
      this.isDistributorShow = false;
      var Json1 = {
        "size": 1000
      }
      this.getDistributor(Json1)
      // this.GetDistrict(Json1);
      // this.GetState(Json1);
      // this.getdivision(Json1)

      var jsonn = { "multi_pg": ["pg1", "pg2", "pg3", "pg4", "pg5", "pg6"], "size": 1000 }
      this.Getpgline(jsonn);
    }

    this.disc_code = this.datapass.getOption();

    if (this.setdiscout_code == "" || this.setdiscout_code == undefined || this.setdiscout_code == null) {
      this.btnSave = true;
      this.btnUpdate = false;

      this.buildItemForm("");
      // alert (this.ShowDiv+'_' + this.showlocationtype)
    } else {
      // this.GetGroup("");

      // var jsonn2 = { search_text: "", size: 100 };
      // this.getSKUItemSingle(jsonn2);

      // setTimeout(() => {
      this.SelectDiscountData(this.disc_code);
      // }, 250);
      this.btnSave = false;
      this.btnUpdate = true;
      // this.buildItemForm(this.disc_code);
      //this.btnUpdate = true;
    }

    //  console.log(this.isDistributorShow)

    var jsonn2 = { search_text: "", size: 5 };
    this.getSKUItemSingle(jsonn2);

    let ngbModalOptions: NgbModalOptions = {
      backdrop: true,
      keyboard: false
    };
    this.modalService.open(content, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
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

  ngOnInit(): void {
    
    const body = document.getElementsByTagName('body')[0];

    this.From_date = localStorage.getItem("FromDate");
    this.To_date = localStorage.getItem("ToDate");

    this.isActiveTab = "TML";

    this.offerdetails = true;
    this.productdetails = false;
    this.productsummary = false;
    this.locationdetails = false;

    this.isPgLine = true;
    this.isPart = false;

    this.isIndividual = true;
    this.isBulk = false;
    this.isDefault = true;
    this.isPartWise = false;

    this.DisplayButton = false;

    //console.log(this.ShowDiscountType)

    this.isDistributorSearch = true;

    this.currentPage = 1;
    this.noofrecordsperpage = 10

    const ListInput: ListInput = {} as ListInput;
    var RoleName = this.CommonService.getRole();
    this.Role = RoleName;
    if (this.RoleName == "Distributor") {
      this.isDistributor = true;
      // this.SelectedLoadIndex = 1;
      // this.curenttab = 1;
      ListInput.owner = 'DLR';
    }
    else {
      this.isDistributor = false;
      // this.SelectedLoadIndex = 0;
      // this.curenttab = 0;
      ListInput.owner = 'TML';
    }

    //  this.Getstatecode("Data1")
    ListInput.offset = 0;
    this.GetList(ListInput);

    this.BuildForm();
    const ExportArrayInput5: InputDat4 = {} as InputDat4;
    ExportArrayInput5.size = 5;
    this.GetStateData();

    const data3: InputDat4 = {} as InputDat4;
    // data3.size = 5;
    // data2.state_name = ""
    // data2.state_code ="";
    this.Getstatecode(data3)
    const data: InputDat4 = {} as InputDat4;

    this.DistrictList(data)

    this.myControl1.valueChanges.subscribe(value => {
      debugger

      this._filterforCust(value)
    });



    // var jsonn = { "multi_pg": ["pg1", "pg2", "pg3", "pg4", "pg5", "pg6"], "size": 1000 }
    // this.Getpgline(jsonn);

    // var RoleName = this.CommonService.getRole();


  }

  BuildForm() {
    this.AllFilters = this.fb.group({
      from_date: "",
      to_date: "",
      status: [''],
      discount_code: [''],
      discount_name: [''],
      created_by: [''],
      min_percentage: [''],
      max_percentage: [''],
      code: [''],
      organsization_name: [''],
      parts: [''],
      pgline: [''],
      division_name: [''],
      state: [''],
      //district_name: [''],
      zone_name: [''],
      part_number: [''],
      desc_text: [''],
      distributor_name: [''],
      state_code:[''],
      district_name:['']
      // state:['']
      //district_name:[]

    })
    // this.itemForm = this.fb.group({
    //   discount_name: [itemForm.discount_name || '', Validators.required],
    //   from_date: [''],
    //   to_date: [''],
    //   percentage: [''],
    //   All: [''],
    //   Fleetowner: [''],
    //   GovtCust: [''],
    //   Retiler: [''],
    //   quantity: ['']
    // })
  }

  buildItemForm(item) {
    var today = new Date().toJSON().split('T')[0];
    this.itemForm = this.fb.group({
      discount_name: [item.discount_name || '', Validators.required],
      percentage: [item.percentage || '', [Validators.required, Validators.max(100), Validators.min(0.1)]],
      from_date: [new Date(item.from_date) || '', Validators.required],
      to_date: [new Date(item.from_date) || '', Validators.required],
      // KeyAccount: [''] ,
      Fleetowner: [''],
      GovtCust: [''],
      Retiler: [''],
      All: [''],
      quantity: ['']
    })
  }
  // SelectDocumentFiles(event) {

  //   ;

  //   var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'

  //   this.confirmService.confirm({ message: msg })
  //     .subscribe(res => {
  //       if (res) {

  //         if (event.target.files && event.target.files[0]) {
  //           var Extension = event.target.files[0].name.substring(
  //             event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();


  //           if (Extension == "xlsx" || Extension == "Xlsx") {
  //             const reader = new FileReader();
  //             const file = event.target.files[0];
  //             this.DocumentFile = file;

  //             this.UploadCSV();
  //           }
  //           else {

  //             this.myInputVariable.nativeElement.value = '';

  //             Swal.fire('Upload only xlsx Files');

  //           }


  //         }

  //       }
  //     })





  // }


  // ShowProductExcel: any = "Single"
  // ChageExcelProduct(Event) {

  //   this.ShowProductExcel = Event.value;
  // }

  focusOutFunction(val: any) {


    console.log(val)
    if (val.target.value == null || val.target.value == undefined) {
      this.isvalidation = true;


    }

  }
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


  // SelectDocumentFiles(event) {

  //   ;

  //   var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'

  //   this.confirmService.confirm({ message: msg })
  //     .subscribe(res => {
  //       if (res) {

  //         if (event.target.files && event.target.files[0]) {
  //           var Extension = event.target.files[0].name.substring(
  //             event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();


  //           if (Extension == "xlsx" || Extension == "Xlsx") {
  //             const reader = new FileReader();
  //             const file = event.target.files[0];
  //             this.DocumentFile = file;

  //             this.UploadCSV();
  //           }
  //           else {

  //             this.myInputVariable.nativeElement.value = '';

  //             Swal.fire('Upload only xlsx Files');

  //           }


  //         }

  //       }
  //     })





  // }
  //DocumentFile: any;
  SuccessArray: any = []
  FailedArray: any = []

  SelectDocumentFiles(event) {
    var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'
    this.confirmService.confirm({ message: msg })
      .subscribe(res => {
        if (res) {
          if (event.target.files && event.target.files[0]) {
            var Extension = event.target.files[0].name.substring(
              event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
            if (Extension == "xlsx" || Extension == "Xlsx") {
              const reader = new FileReader();
              const file = event.target.files[0];
              this.DocumentFile = file;
              this.UploadCSV();
            }
            else {
              this.myInputVariable.nativeElement.value = '';
              Swal.fire('Upload only xlsx Files');
            }
          }
        }
      })
  }
  UploadCSV() {
    // this.loader.open();
    this.SuccessArray = []
    this.FailedArray = []
    var Check = false;
    let formData = new FormData();

    formData.append('files', this.DocumentFile);
    formData.append('from_date', moment(this.itemForm.value.from_date).format("YYYY-MM-DD"));
    formData.append('to_date', moment(this.itemForm.value.to_date).format("YYYY-MM-DD"));

    console.log(formData)

    Check = true
    if (Check) {
      this.FileUpService.uploadPartValidate(formData).subscribe(data => {
        debugger;

        if (data.success == true) {
          debugger
          this.loader.close();
          this.DocumentFile = "";
         // this.myInputVariable.nativeElement.value = "";

          this.SuccessArray = data.data.filter(book => book.is_valid === true);
          var FailedArrayteml = data.data.filter(book => book.is_valid === false);
         // console.log("CSV", this.SuccessArray)
          // this.SuccessArray = []
          // this.FailedArray = []
          for (let entry of this.SuccessArray) {
            var Json =
            {
              "display": entry.part_number,
              // + '_' + data2[0].desc_text
              "part_number": entry.part_number,
              "qty": entry.quantity,
              "default_discount": entry.default_discount.length > 0 ? entry.default_discount[0].percentage : '0',
              "quantity_discount": entry.quantity_discount.length > 0 ? entry.quantity_discount[0].percentage : '0',
              "is_available": entry.is_discount_available,

            }
            this.SKUPartQty.push(Json);
          }
          this.SKUPartQty = [...this.SKUPartQty]
          for (let entry1 of FailedArrayteml) {
            var Json1 =
            {
              "display": entry1.part_number,
              // + '_' + data2[0].desc_text
              "Message": entry1.msg,
              "is_available": entry1.is_discount_available,

            }
            this.FailedArray.push(Json1);
          }
          this.FailedArray = [...this.FailedArray]
         // this.excelService.exportCancellationAsExcelFile(this.FailedArray, 'FailedParts');
          //console.log(this.SuccessArray)
          //console.log(this.FailedArray)
        }
        else {
          this.loader.close();
          this.DocumentFile = "";
          this.myInputVariable.nativeElement.value = "";
          Swal.fire('Invalid Request. Please reupload using the assigned format only')
        }
      });
    }
    else {
      //  this.loader.close();
      Swal.fire('Error Occured , Please Try After Some Times')
    }
  }
  // DocumentFile: any;
  // SuccessArray: any = []
  // FailedArray: any = []
  // UploadCSV() {
  //   this.loader.open();
  //   this.SuccessArray = []
  //   this.FailedArray = []
  //     ;
  //   var Check = false;

  //   const formData = new FormData();

  //   formData.append('files', this.DocumentFile);
  //   formData.append('from_date', this.datepipe.transform(this.itemForm.value.from_date, 'yyyy-MM-dd'));
  //   formData.append('to_date', this.datepipe.transform( new Date ,this.itemForm.value.to_date, 'yyyy-MM-dd'));



  //   Check = true
  //   if (Check) {

  //     this.FileUpService.uploadPartValidate(formData).subscribe(data => {
        

  //       if (data.success == true) {

  //         this.loader.close();
  //         this.DocumentFile = "";
  //         this.myInputVariable.nativeElement.value = "";





  //         this.SuccessArray = data.data.filter(book => book.is_valid === true);
  //         var FailedArrayteml = data.data.filter(book => book.is_valid === false);

          



  //         for (let entry of this.SuccessArray) {

  //           var Json =
  //           {
  //             "display": entry.part_number,
  //             "value": entry.part_number,
  //             "qty": entry.quantity,
  //             "default_discount": entry.default_discount.length > 0 ? entry.default_discount[0].percentage : '0',
  //             "quantity_discount": entry.quantity_discount.length > 0 ? entry.quantity_discount[0].percentage : '0',
  //             "is_available": entry.is_discount_available,

  //           }


  //           var Defaultdis = entry.default_discount.length > 0 ? entry.default_discount[0].percentage : '0'

  //           var TempData = this.SKUPartQty.filter(book => book.value === entry.part_number);




  //           if (TempData.length == 0) {

  //             if (Number(Defaultdis) < Number(this.itemForm.value.percentage)) {

  //               this.SKUPartQty.push(Json);

  //               this.SKUPartQty = [...this.SKUPartQty]
  //             }

  //             else {
  //               var Json1 =
  //               {
  //                 "PartNumber": entry.part_number,

  //                 "Reason": "Discount should greater than Current Discount"

  //               }

  //               this.FailedArray.push(Json1);

  //             }

  //           }
  //         }



  //         this.SKUPartQty = [...this.SKUPartQty]



  //         for (let entry1 of FailedArrayteml) {

  //           var Json2 =
  //           {
  //             "PartNumber": entry1.part_number,
            
  //             "Reason": entry1.msg
              

  //           }


  //           var TempData = this.FailedArray.filter(book => book.value === entry1.part_number);



  //           if (TempData.length == 0) {
  //             this.FailedArray.push(Json2);
  //           }



  //         }



  //         this.FailedArray = [...this.FailedArray]


  //         if (this.FailedArray.length > 0) {
  //           this.excelService.exportCancellationAsExcelFile(this.FailedArray, 'FailedParts');
  //         }







  //       }
  //       else {
  //         this.loader.close();
  //         this.DocumentFile = "";



  //         this.myInputVariable.nativeElement.value = "";

  //         Swal.fire(data.data.msg)
       
  //       }

  //     });
  //   }
  //   else {
   
  //     Swal.fire('Error Occured , Please Try After Some Times')

  //   }




  // }
  // statenamedata: any[]
  // GetState(Data1) {
  //   this.statenamedata = [];

  //   this.CommonService.GetState(Data1).subscribe(
  //     data => {
  //       if (data.success == true) {
  //         debugger
  //         this.statenamedata = data.data.result

  //         console.log(this.statenamedata)

  //         this.StateLists = new FormGroup({})
  //         for (let formModule of this.statenamedata) {
  //           this.StateLists.addControl(formModule.state_code, new FormControl(false))
  //         }
  //       }
  //       else {

  //         this.loader.close();

  //       }
  //     }, (err) => {
  //     }
  //   );


  //   }



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
          this.StateData = data.data.States;
        }
        else {
        }
      }, (err) => {

      }
    );
  }


  // Disnamedata: any = []
  // DistrictList(Data1) {

  //   console.log(this.Disnamedata, "divs")

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
  // }

  onChanges(deviceValue) {
   // console.log(deviceValue);
    const data2: InputData2 = {} as InputData2;
    var jsonn = { "multi_zone": this.selected, "multi_state": [deviceValue], "size": 100 }
    this.DistrictList(jsonn)
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
  // isdist: boolean = true;
  ShowDiv: boolean = false;
  ChangeType(event) {


    this.showlocationtype = "";
    this.confirmService.LogOutOCnform({ title: this.pgTitle, message: this.pgText })
      .subscribe((result) => {
        var access = result;
        if (access == true) {
          this.errorlocationmsg = "";

          // ;
          if (event.value == "Dist") {
            //this.SearchReset();
            this.showlocationtype = "Dist";
            this.selected = [];
            this.selectedState = [];
            this.selectedDistict = [];

            this.TempselectedDisplayDistributor = [];
            this.tempselectedDisplayDivision = [];
            this.selectedDisplayDivision = [];
            this.selectedDisplayDistributor = []
            if (this.ShowGeodrp == false) {
              this.isdist = false

            }

            else {
              this.isdist = true
              this.ShowDiv = false
            }



          }
          if (event.value == "Div") {
            // this.SearchReset();
            this.showlocationtype = "Div";
            this.selected = [];
            this.selectedState = [];
            this.selectedDistict = [];
            this.TempselectedDisplayDistributor = []
            this.tempselectedDisplayDivision = []
            this.selectedDisplayDivision = [];
            this.selectedDisplayDistributor = []
            this.ShowDiv = true
            this.isdist = true
          }


          var Json = {
            // "multi_zone": [],
            "multi_state": [],
            "multi_district": [],
            //  "multi_distributor_code": [],
            "size": 1000
          }
          this.getDistributor(Json)
          var Jsons = {
            "size": 1000
          }
          //  this.getdivision(Jsons)

        }
        else {
          if (event.value == "Dist") {
            this.showlocationtype = "Div";
          }
          if (event.value == "Div") {
            this.showlocationtype = "Dist";
          }

        }
      });
  }
  onPageLoad: number = 0;
  prevDistID: any = 0;
  line: any;

  toggle_vehicle_list(vehicleId): void {
    console.log(vehicleId)

    if (document.getElementById(vehicleId.distributor_id).style.display == 'block') {
      document.getElementById(vehicleId.distributor_id).style.display = 'none';
    }
    else {
      document.getElementById(vehicleId.distributor_id).style.display = 'block';
    }
  }

  toggle_Part_list(row): void {
    console.log(row)
    console.log(document.getElementById(row))
    if (document.getElementById(row).style.display == 'block') {
      document.getElementById(row).style.display = 'none';
      console.log("inside if");
    }
    else {
      document.getElementById(row).style.display = 'block';
      console.log("inside else");
      // var dataLine = [];
      // dataLine.push(row)
      this.line = row
      var jsonn = { "search_text": this.line, "size": 10 }
      console.log(jsonn)

      this.getSKUItems(jsonn);
    }
  }

  // tabChange(tabName) {
  //   this.isActiveTab = tabName;
  // }


  tabchange: any = 1;
  onClickTab(check) {
    this.tabchange = check
    // this.AllFilters.get("code").setValue("")
    this.currentPage = 1
    if (this.tabchange == 1) {
      this.isActiveTab = "TML"
      const ListInput: ListInput = {} as ListInput;
      ListInput.owner = 'TML';
      ListInput.offset = 0;
      this.resetFeild();
      //this.itemForm.reset();
      this.GetList(ListInput);
    }

    if (this.tabchange == 2) {
      this.isActiveTab = "Distributor";
      const ListInput: ListInput = {} as ListInput;
      ListInput.owner = 'DLR';
      ListInput.offset = 0;
      this.resetFeild();
      //this.itemForm.reset();

      this.GetList(ListInput);
    }
  }


  SelectdFileType: any = 'Single'

  ChangeSingleProduct(value) {

    this.SelectdFileType = value
  }

  getSelectedOptions(selected) {
    this.TempDistributor = []

    this.Statedata = [];

    this.Districtdata = [];

    this.DisplayZone = [];
    this.DisplayState = [];
    this.DisplayDistrict = [];

    this.selected = selected;
    if (this.selected.length > 0) {
      this.DisplayZone = this.selected;

      var jsonn = { "multi_zone": this.selected, "size": 1000 }
      // this.GetstateNew(jsonn);





    }
  }
  // getSelectedOptions(selected) {
  //   debugger
  //   this.TempDistributor = []

  //   this.Statedata = [];

  //   this.Districtdata = [];

  //   this.DisplayZone = [];
  //   this.DisplayState = [];
  //   this.DisplayDistrict = [];

  //   this.selected = selected;
  //   if (this.selected.length > 0) {
  //     this.DisplayZone = this.selected;

  //     var jsonn = { "multi_zone": this.selected, "size": 1000 }
  //     this.GetState(jsonn);





  //   }
  // }
  // characters(event: any): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode < A && (charCode < Z || charCode > 57)) {
  //     return false;
  //   }
  //   return true;

  // }
  selectedDistrictOptions = [];
  selectedDistict = this.selectedDistrictOptions;
  showlocationtype: any;

  getStateSelectedOptions(selected1) {
    this.TempDistributor = []

    this.Districtdata = [];

    this.DisplayDistrict = [];

    this.selectedDistributor = []

    this.selectedState = selected1;
    if (this.selectedState.length > 0) {

      this.DisplayState = this.selectedState;
      var jsonn = { "multi_zone": this.selected, "multi_state": this.selectedState, "size": 1000 }
      this.GetDistrict(jsonn);


    }

  }
  tab: any = 1;
  currentPage: any;
  onClick(check) {
    this.tab = check
    this.currentPage = 1
    if (this.tab == 1) {
      this.currDiv = "productDetails";
      debugger
      if (this.itemForm.invalid) {
        this.Valdationmessage = "* marked fields are mandatory"
        return false;
      }
      // var s = this.itemForm.value.percentage.split('.');

      // if (s[0].length > 2) {

      //   this.Valdationmessage = "Only 2 digit allowed before decimal"
      //   return false;
      // }

      // if (s.length > 1) {
      //   if (s[1].length > 2) {

      //     this.Valdationmessage = "Only 2 digit allowed after decimal"
      //     return false;
      //   }
      // }

      if ((this.itemForm.value.from_date != null || this.itemForm.value.to_date != null || this.itemForm.value.from_date != "" || this.itemForm.value.to_date != "")) {
        if (this.itemForm.value.from_date == null && this.itemForm.value.to_date == null || this.itemForm.value.from_date == "" && this.itemForm.value.to_date == "") {
          // this.toastrService.error("Select To Date1")
          // Swal.fire("Select From Date & To Date");
          this.Valdationmessage = "Select start & end date";
        }
        else if (this.itemForm.value.from_date != null && this.itemForm.value.to_date == null || this.itemForm.value.from_date != "" && this.itemForm.value.to_date == "") {
          // Swal.fire("Select To Date");
          this.Valdationmessage = "Select end date";
        } else if (this.itemForm.value.to_date != null && this.itemForm.value.from_date == null || this.itemForm.value.to_date != "" && this.itemForm.value.from_date == "") {
          // Swal.fire("Select start date");
          this.Valdationmessage = "Select start date";
          // this.toastrService.error("Select From Date")
        }
        else if (
          this.itemForm.value.from_date != null &&
          this.itemForm.value.to_date != null || this.itemForm.value.from_date != "" &&
          this.itemForm.value.to_date != "") {
          var d1 = moment(this.itemForm.value.from_date);
          var d2 = moment(this.itemForm.value.to_date);
          if (d1 > d2) {
            // Swal.fire("Start date should be less than end date.");
            this.Valdationmessage = "Start date should be less than end date.";
          }
          else {
            if ((this.itemForm.value.All == false || this.itemForm.value.All == "")
              && (this.itemForm.value.Retiler == false || this.itemForm.value.Retiler == "")
              && (this.itemForm.value.GovtCust == false || this.itemForm.value.GovtCust == "")
              && (this.itemForm.value.Fleetowner == false || this.itemForm.value.Fleetowner == "")

            ) {
              this.Valdationmessage = "* marked fields are mandatory"
              return false;
            }
            else {

              if (this.selectedIndex == 1) {
                console.log(this.CustomerData)

                var Custtypetemp = []
                if (this.itemForm.value.All == true) {
                  Custtypetemp = [];
                  Custtypetemp = [];
                }
                else {
                  Custtypetemp = [];
                  // if (Event.KeyAccount == true) { Custtype.push('KEY') }
                  if (this.itemForm.value.Fleetowner == true) { Custtypetemp.push('FO') }
                  if (this.itemForm.value.GovtCust == true) { Custtypetemp.push('GOV') }
                  if (this.itemForm.value.Retiler == true) { Custtypetemp.push('RT') }

                }

                this.CustomerTempData = []
                this.CustomerData = [];
                var Json = { "offset": 0, "user_type_list": Custtypetemp, "search_text": "", "size": 50 }
                this.GetCustomer(Json)
              }

              this.Valdationmessage = ""
              this.selectedIndex = this.selectedIndex + 1;

              this.offerdetails = false;
              this.productdetails = true;
              this.productsummary = false;
              this.locationdetails = false;
            }
          }
        }
      }

      // var d3 = Date.parse(this.itemForm.value.from_date);
      // var d4 = Date.parse(this.itemForm.value.to_date);
      // if (d3 > d4) {
      //   this.Valdationmessage = "Start-Date Should be Less Than End-Date."
      //   return;
      // }
      // else {

      //   if ((this.itemForm.value.All == false || this.itemForm.value.All == "")
      //     && (this.itemForm.value.Retiler == false || this.itemForm.value.Retiler == "")
      //     && (this.itemForm.value.GovtCust == false || this.itemForm.value.GovtCust == "")
      //     && (this.itemForm.value.Fleetowner == false || this.itemForm.value.Fleetowner == "")

      //   ) {
      //     this.Valdationmessage = "* marked fields are mandatory"
      //     return false;
      //   }
      //   else {

      //     if (this.selectedIndex == 1) {
      //       console.log(this.CustomerData)

      //       var Custtypetemp = []
      //       if (this.itemForm.value.All == true) {
      //         Custtypetemp = [];
      //         Custtypetemp = [];
      //       }
      //       else {
      //         Custtypetemp = [];
      //         // if (Event.KeyAccount == true) { Custtype.push('KEY') }
      //         if (this.itemForm.value.Fleetowner == true) { Custtypetemp.push('FO') }
      //         if (this.itemForm.value.GovtCust == true) { Custtypetemp.push('GOV') }
      //         if (this.itemForm.value.Retiler == true) { Custtypetemp.push('RT') }

      //       }

      //       this.CustomerTempData = []
      //       this.CustomerData = [];
      //       var Json = { "offset": 0, "user_type_list": Custtypetemp, "search_text": "", "size": 50 }
      //       this.GetCustomer(Json)
      //     }

      //     this.Valdationmessage = ""
      //     this.selectedIndex = this.selectedIndex + 1;

      //     this.offerdetails = false;
      //     this.productdetails = true;
      //     this.productsummary = false;
      //     this.locationdetails = false;
      //   }
      // }
      this.errorlocationmsg = "";
      this.errorselectmsg = "";




      console.log(this.itemForm.value)

    }

    if (this.tab == 2) {
      this.currDiv = "productSummary";
      this.offerdetails = false;
      this.productdetails = false;
      this.productsummary = false;
      this.locationdetails = true;
    }

    if (this.tab == 3) {
      this.offerdetails = false;
      this.productdetails = false;
      this.productsummary = true;
      this.locationdetails = false;
    }
    if (this.tab == 4) {
      // this.offerdetails= false;
      // this.productdetails=false;
      // this.productsummary=true;
      // this.locationdetails=false;
    }


  }

  onClickBack(check) {
    this.tab = check
    if (this.tab == 1) {
      this.currDiv = "productDetails";
      this.offerdetails = true;
      this.productdetails = false;
      this.productsummary = false;
      this.locationdetails = false;
    }

    if (this.tab == 2) {
      this.currDiv = "productSummary";
      this.offerdetails = true;
      this.productdetails = false;
      this.productsummary = false;
      this.locationdetails = false;
    }

    if (this.tab == 3) {
      this.offerdetails = false;
      this.productdetails = true;
      this.productsummary = false;
      this.locationdetails = false;
    }
    if (this.tab == 4) {
      this.offerdetails = false;
      this.productdetails = false;
      this.productsummary = false;
      this.locationdetails = true;
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }


  calculateDate(date1, date2) {
    // debugger;
    // var diffc = date1 - date2;
    // var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));

    const days = Math.abs(date2 - date1);
    return days / (1000 * 60 * 60 * 24);
    // return days;
    alert(days)
  }
  calculateDate1(Date1, date2) {
    debugger
    Date1 = new Date(Date1);
    date2 = new Date(date2);
    var diffc = Date1.getTime() - date2.getTime();

    var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));

    return days;
  }

  discountCode: any;
  discountName: any;
  creatdBy: any;
  minPercentage: any;
  maxPercentage: any;
  status: any

  Search() {
    debugger
    this.Filterarray = [];
    this.currentPage = 1


    if (this.tabchange == 1) {
    //   if(this.min_percentage==true)
    // if (this.AllFilters.value.min_percentage == null || this.AllFilters.value.min_percentage == "" && this.AllFilters.value.min_percentage !== null) {
    //    Swal.fire('Select Min percentage');
    //     const ListInput: ListInput = {} as ListInput;

    //     ListInput.min_percentage = ""
    //     ListInput.offset = 0;
      
    //     ListInput.owner = 'TML';
    //     this.GetList(ListInput)
    //     this.loader.close()
    //     return
    //   }
    //   else if (this.AllFilters.value.min_percentage !== null && this.AllFilters.value.max_percentage == null || this.AllFilters.value.max_percentage == "") {
    //     Swal.fire('Select Max percentage');
    //     const ListInput: ListInput = {} as ListInput;

    //     ListInput.max_percentage = ""
    //     ListInput.offset = 0;
     
    //     ListInput.owner = 'TML';
    //     this.GetList(ListInput)
    //     this.loader.close()
    //     return
    //   }
    
  
      if (this.iscustomDate == true) {

        if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
          Swal.fire('Select From Date');
          const ListInput: ListInput = {} as ListInput;
          ListInput.offset = 0;
          ListInput.owner = 'TML';
          this.GetList(ListInput)
          this.loader.close()
          return
        }
        else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
          Swal.fire('Select To Date');
          const ListInput: ListInput = {} as ListInput;
          ListInput.offset = 0;
          ListInput.owner = 'TML';

          this.GetList(ListInput)
          this.loader.close()
          return
        }
        var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
        var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1, d2);
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: ListInput = {} as ListInput;
          ListInput.offset = 0;
          ListInput.owner = 'TML';
          this.GetList(ListInput)
          this.loader.close()
          return

        }
        else if (days >= 95) {
          Swal.fire(' Allow to get Only 95 Days Data');
          const ListInput: ListInput = {} as ListInput;
          ListInput.offset = 0;
          ListInput.owner = 'TML';
          this.GetList(ListInput)
          this.loader.close()
          return
        }
        this.from_date = this.AllFilters.value.from_date;
        this.to_date = this.AllFilters.value.to_date
        this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
        this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
      }
      else if (this.isLastsevenDay == true) {
        this.from_date = moment(this.To_date).subtract(7, 'days').format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.To_date, 'yyyy-MM-dd')
      }
      else if (this.isToday == true) {
        this.from_date = moment(this.To_date).format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.To_date, 'yyyy-MM-dd')
      }
      else if (this.isThirtyDays == true) {
        this.from_date = this.datepipe.transform(this.From_date, 'yyyy-MM-dd')
        this.to_date = this.datepipe.transform(this.To_date, 'yyyy-MM-dd')
      }

      if (this.from_date) {
        this.AllFilters.get('from_date').setValue(this.from_date);
      }
      if (this.to_date) {
        this.AllFilters.get('to_date').setValue(this.to_date);
      }

      this.discountCode = this.AllFilters.value.discount_code;
      this.discountName = this.AllFilters.value.discount_name;
      this.creatdBy = this.AllFilters.value.created_by;
      this.minPercentage = this.AllFilters.value.min_percentage;
      this.maxPercentage = this.AllFilters.value.max_percentage;
      this.is_active = this.AllFilters.value.is_active;

      const ListInput2: ListInput = {} as ListInput;

      if (this.to_date) { ListInput2.to_date = this.to_date; } else { ListInput2.to_date = ""; }

      if (this.from_date) { ListInput2.from_date = this.from_date; } else { ListInput2.from_date = ""; }

      if (this.discountCode) { ListInput2.discount_code = this.discountCode; } else { ListInput2.discount_code = ""; }

      if (this.discountName) { ListInput2.discount_name = this.discountName; } else { ListInput2.discount_name = ""; }

      if (this.creatdBy) { ListInput2.created_by_name = this.creatdBy; } else { ListInput2.created_by_name = ""; }

      if (this.minPercentage) { ListInput2.min_percentage = this.minPercentage; } else { ListInput2.min_percentage = ""; }

      if (this.maxPercentage) { ListInput2.max_percentage = this.maxPercentage; } else { ListInput2.max_percentage = ""; }

      
    if (this.is_active) {
      ListInput2.is_active = this.is_active;
    } else {
      ListInput2.is_active = "";
    }
     // console.log(this.status);

      ListInput2.offset = 0;
      ListInput2.size = this.noofrecordsperpage;
      ListInput2.owner = 'TML';

      this.GetList(ListInput2);
      this.loader.close();
    }
    else if (this.tabchange == 2) {






      // if (this.AllFilters.value.min_percentage == null || this.AllFilters.value.min_percentage == "" && this.AllFilters.value.min_percentage !== null) {
      //   Swal.fire('Select Min percentage');
      //   const ListInput: ListInput = {} as ListInput;

      //   ListInput.min_percentage = ""
      //   this.isActiveTab = "Distributor";
    
      //   ListInput.owner = 'TML';
      //   ListInput.offset = 0;
      //   this.GetList(ListInput);
      //   this.loader.close()
      //   return
      // }
      // else if (this.AllFilters.value.min_percentage !== null && this.AllFilters.value.max_percentage == null || this.AllFilters.value.max_percentage == "") {
      //   Swal.fire('Select Max percentage');
      //   const ListInput: ListInput = {} as ListInput;

      //   ListInput.max_percentage = ""
      //   this.isActiveTab = "Distributor";
     
      // ListInput.owner = 'DLR';
      // ListInput.offset = 0;
      // this.GetList(ListInput);
      //   return
      // }
      if (this.iscustomDate == true) {
        // this.from_date = this.AllFilters.value.from_date;
        // this.to_date = this.AllFilters.value.to_date;
        // this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
        // this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')

        if (this.AllFilters.value.from_date == null || this.AllFilters.value.from_date == "" && this.AllFilters.value.to_date !== null) {
          Swal.fire('Select From Date');
          const ListInput: ListInput = {} as ListInput;
          ListInput.offset = 0;
          ListInput.owner = 'DLR';
          this.GetList(ListInput)
          this.loader.close()
          return
        }
        else if (this.AllFilters.value.from_date !== null && this.AllFilters.value.to_date == null || this.AllFilters.value.to_date == "") {
          Swal.fire('Select To Date');
          const ListInput: ListInput = {} as ListInput;
          ListInput.offset = 0;
          ListInput.owner = 'DLR';

          this.GetList(ListInput)
          this.loader.close()
          return
        }
        var d1 = moment(this.AllFilters.value.from_date).format('yyyy-MM-DD')
        var d2 = moment(this.AllFilters.value.to_date).format('yyyy-MM-DD')
        var days = this.calculateDate1(d1, d2);
        if (d1 > d2) {
          Swal.fire('From-Date Should be Less Than To-Date.');
          const ListInput: ListInput = {} as ListInput;
          ListInput.offset = 0;
          ListInput.owner = 'DLR';
          this.GetList(ListInput)
          this.loader.close()
          return

        }
        else if (days >= 95) {
          Swal.fire(' Allow to get Only 95 Days Data');
          const ListInput: ListInput = {} as ListInput;
          ListInput.offset = 0;
          ListInput.owner = 'DLR';
          this.GetList(ListInput)
          this.loader.close()
          return
        }
        this.from_date = this.AllFilters.value.from_date;
        this.to_date = this.AllFilters.value.to_date
        this.from_date = moment(this.from_date).subtract(1, 'months').format('yyyy-MM-DD')
        this.to_date = moment(this.to_date).subtract(1, 'months').format('yyyy-MM-DD')
      }
      else if (this.isLastsevenDay == true) {
        this.from_date = moment(this.To_date).subtract(7, 'days').format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.To_date, 'yyyy-MM-dd')
      }
      else if (this.isToday == true) {
        this.from_date = moment(this.To_date).format('yyyy-MM-DD')
        this.to_date = this.datepipe.transform(this.To_date, 'yyyy-MM-dd')
      }
      else if (this.isThirtyDays == true) {
        this.from_date = this.datepipe.transform(this.From_date, 'yyyy-MM-dd')
        this.to_date = this.datepipe.transform(this.To_date, 'yyyy-MM-dd')
      }

      if (this.from_date) {
        this.AllFilters.get('from_date').setValue(this.from_date);
      }
      if (this.to_date) {
        this.AllFilters.get('to_date').setValue(this.to_date);
      }

      this.discountCode = this.AllFilters.value.discount_code;
      this.discountName = this.AllFilters.value.discount_name;
      this.creatdBy = this.AllFilters.value.created_by;
      this.minPercentage = this.AllFilters.value.min_percentage;
      this.maxPercentage = this.AllFilters.value.max_percentage;
      this.status = this.AllFilters.value.status;

      const ListInput2: ListInput = {} as ListInput;

      if (this.to_date) { ListInput2.to_date = this.to_date; } else { ListInput2.to_date = ""; }

      if (this.from_date) { ListInput2.from_date = this.from_date; } else { ListInput2.from_date = ""; }

      if (this.discountCode) { ListInput2.discount_code = this.discountCode; } else { ListInput2.discount_code = ""; }

      if (this.discountName) { ListInput2.discount_name = this.discountName; } else { ListInput2.discount_name = ""; }

      if (this.creatdBy) { ListInput2.created_by_name = this.creatdBy; } else { ListInput2.created_by_name = ""; }

      if (this.minPercentage) { ListInput2.min_percentage = this.minPercentage; } else { ListInput2.min_percentage = ""; }

      if (this.maxPercentage) { ListInput2.max_percentage = this.maxPercentage; } else { ListInput2.max_percentage = ""; }

      if (this.status) { ListInput2.is_active = this.status; } else { ListInput2.is_active = ""; }

      ListInput2.offset = 0;
      ListInput2.size = this.noofrecordsperpage;
      ListInput2.owner = 'DLR';

      this.GetList(ListInput2);
      this.loader.close();

    }
    this.myDrop.close();
  }

  reset() {

    this.currentPage = 1
    this.AllFilters.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.status = "";
    this.isThirtyDays = false;
    this.isToday = false;
    this.iscustomDate = false;
    this.isLastsevenDay = false;
    this.ShowCustom = false;
    this.discountCode = "";
    this.discountName = "";
    this.creatdBy = "";
    this.minPercentage = "";
    this.maxPercentage = "";
    this.status = "";
    this.from_date = ""
    this.to_date = "";

    if (this.tabchange == 1) {
      this.isActiveTab = "TML"
      const ListInput: ListInput = {} as ListInput;
      ListInput.owner = 'TML';
      ListInput.offset = 0;
      this.GetList(ListInput);
    }

    else if (this.tabchange == 2) {
      this.isActiveTab = "Distributor";
      const ListInput: ListInput = {} as ListInput;
      ListInput.owner = 'DLR';
      ListInput.offset = 0;
      this.GetList(ListInput);
    }

    this.myDrop.close();
  }

  resetFeild() {
    this.currentPage = 1
    this.AllFilters.reset();
    this.BuildForm();
    this.Filterarray = [];
    this.status = "";
    this.isThirtyDays = false;
    this.isToday = false;
    this.iscustomDate = false;
    this.isLastsevenDay = false;
    this.ShowCustom = false;
    this.discountCode = "";
    this.discountName = "";
    this.creatdBy = "";
    this.minPercentage = "";
    this.maxPercentage = "";
    this.status = "";
    this.from_date = ""
    this.to_date = "";
  }

  Submit() {
    this.offerdetails = true;
    this.productdetails = false;
    this.productsummary = false;
    this.locationdetails = false;
    this.modalService.dismissAll();
  }

  pageChange(page: any) {
    debugger;
    document.body.scrollTop = 0;
    this.currentPage = page;
    // page = page - 1;

    if (this.tabchange == 1) {

      const ListInput2: ListInput = {} as ListInput;

      if (this.to_date) { ListInput2.to_date = this.to_date; } else { ListInput2.to_date = ""; }

      if (this.from_date) { ListInput2.from_date = this.from_date; } else { ListInput2.from_date = ""; }

      if (this.discountCode) { ListInput2.discount_code = this.discountCode; } else { ListInput2.discount_code = ""; }

      if (this.discountName) { ListInput2.discount_name = this.discountName; } else { ListInput2.discount_name = ""; }

      if (this.creatdBy) { ListInput2.created_by_name = this.creatdBy; } else { ListInput2.created_by_name = ""; }

      if (this.minPercentage) { ListInput2.min_percentage = this.minPercentage; } else { ListInput2.min_percentage = ""; }

      if (this.maxPercentage) { ListInput2.max_percentage = this.maxPercentage; } else { ListInput2.max_percentage = ""; }

      if (this.status) { ListInput2.is_active = this.status; } else { ListInput2.is_active = ""; }

      ListInput2.offset = page - 1;
      ListInput2.size = this.noofrecordsperpage;
      ListInput2.owner = 'TML';

      this.GetList(ListInput2);

    }

    if (this.tabchange == 2) {

      const ListInput2: ListInput = {} as ListInput;

      if (this.to_date) { ListInput2.to_date = this.to_date; } else { ListInput2.to_date = ""; }

      if (this.from_date) { ListInput2.from_date = this.from_date; } else { ListInput2.from_date = ""; }

      if (this.discountCode) { ListInput2.discount_code = this.discountCode; } else { ListInput2.discount_code = ""; }

      if (this.discountName) { ListInput2.discount_name = this.discountName; } else { ListInput2.discount_name = ""; }

      if (this.creatdBy) { ListInput2.created_by_name = this.creatdBy; } else { ListInput2.created_by_name = ""; }

      if (this.minPercentage) { ListInput2.min_percentage = this.minPercentage; } else { ListInput2.min_percentage = ""; }

      if (this.maxPercentage) { ListInput2.max_percentage = this.maxPercentage; } else { ListInput2.max_percentage = ""; }

      if (this.status) { ListInput2.is_active = this.status; } else { ListInput2.is_active = ""; }

      ListInput2.offset = page - 1;
      ListInput2.size = this.noofrecordsperpage;
      ListInput2.owner = 'DLR';

      this.GetList(ListInput2);

    }
  }

  FilterStrings(ListInput) {
    this.Filterarray = [];
    for (let item in ListInput) {

      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'owner');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'is_active');


    if (this.status) {
      if (this.status == "True") {
        var JsonActive = { "Key": 'status', "Value": 'Publish' }
        this.Filterarray.push(JsonActive)
      }
      else if (this.status == "False") {
        var JsonActive = { "Key": 'status', "Value": 'Un-Publish' }
        this.Filterarray.push(JsonActive)
      }
    }

    if (this.isToday == true || this.isLastsevenDay == true || this.isThirtyDays == true || this.iscustomDate == true) {
      if (this.from_date == undefined || this.to_date == undefined || this.from_date == null || this.to_date == null || this.from_date == "" || this.to_date == "") {
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
      }
      else {
        this.from_date1 = ListInput.from_date;
        this.to_date1 = ListInput.to_date;
        var finaldate = this.dateformate(this.from_date1) + ' ' + 'to' + ' ' + this.dateformate(this.to_date1);
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
        this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');


        var Json1 = { "Key": 'from_date', "Value": finaldate }
        this.Filterarray.push(Json1)
      }
    }
  }

  from_date1: any;
  to_date1: any;
  dateformate(date) {
    return this.datepipe.transform(date, 'dd/MM/yyyy');
  }

  SearchByCode(event) {
    if (event.key === "Enter") {
      if (this.tabchange == 1) {
        const ListInput2: ListInput = {} as ListInput;
        ListInput2.owner = 'TML';
        ListInput2.discount_code = event.target.value;
        this.GetList(ListInput2);
      }
      else if (this.tabchange == 2) {
        const ListInput2: ListInput = {} as ListInput;
        ListInput2.owner = 'DLR';
        ListInput2.discount_code = event.target.value;
        this.GetList(ListInput2);
      }
    }
  }

  showByCode(event) {
    if (this.tabchange == 1) {
      const ListInput2: ListInput = {} as ListInput;
      ListInput2.owner = 'TML';
      ListInput2.discount_code = event.target.value;
      this.GetList(ListInput2);
    }
    else if (this.tabchange == 2) {
      const ListInput2: ListInput = {} as ListInput;
      ListInput2.owner = 'DLR';
      ListInput2.discount_code = event.target.value;
      this.GetList(ListInput2);
    }
  }

  onRemoveFilter(filterString) {
    let Filterarrays = this.Filterarray;
    if (filterString.Key == "discount_code") {
      this.discountCode = "";
      this.AllFilters.get("discount_code").setValue("")
      this.AllFilters.get("code").setValue("")
    }
    else if (filterString.Key == "discount_name") {
      this.discountName = "";
      this.AllFilters.get("discount_name").setValue("")
    }
    else if (filterString.Key == "created_by_name") {
      this.creatdBy = "";
      this.AllFilters.get("created_by").setValue("")
    }
    else if (filterString.Key == "min_percentage") {
      this.minPercentage = "";
      this.AllFilters.get("min_percentage").setValue("")
    }
    else if (filterString.Key == "max_percentage") {
      this.maxPercentage = "";
      this.AllFilters.get("max_percentage").setValue("")
    }
    else if (filterString.Key == "status") {
      this.maxPercentage = "";
      this.AllFilters.get("status").setValue("")
    }
    this.Search()
  }

  GetList(ListInput) {
    //this.loader.open();
    this.FilterStrings(ListInput)
    this.items = [];
    this.totalrecord = 0
    debugger
    this.CommonService.RulemasterList(ListInput).subscribe(
      data => {
        if (data.success == true) {

          this.totalrecord = data.data.total_results;
          this.items = this.temp = data.data.result;
          this.showRecords = data.data.result.length

          this.loader.close();
        }
        else {
          this.totalrecord = 0
          this.items = [];
          this.temp = [];
          this.loader.close();

        }
      }, (err) => {
        this.items = [];
        this.temp = [];
        this.loader.close();
      }
    );
  }
  closeModal() {
    this.closemodal.emit();
  }

  pgLine() {
    this.isPgLine = true;
    this.isPart = false;
  }

  Part() {
    this.isPgLine = false;
    this.isPart = true;
  }

  searchPart(row, event) {
    if (row == 'pg') {
      if (event.target.checked == true) {
        this.isPgLine = true;
        this.isPart = false;
        this.selectedPGLineArray = [];
        this.selectedSKUDisplay = [];
        this.productTypeDisplay = [];
        this.selectedPGLineArray = [];
      }
      else {
        this.isPgLine = false;
        this.isPart = true;
        this.selectedPGLineArray = [];
        this.selectedSKUDisplay = [];
        this.productTypeDisplay = [];
        this.selectedPGLineArray = [];
      }
    }
    else if (row == 'part') {
      if (event.target.checked == true) {
        this.isPgLine = false;
        this.isPart = true;
        this.selectedPGLineArray = [];
        this.selectedSKUDisplay = [];
        this.productTypeDisplay = [];
        this.selectedPGLineArray = [];
      }
      else {
        this.isPgLine = true;
        this.isPart = false;
        this.selectedPGLineArray = [];
        this.selectedSKUDisplay = [];
        this.productTypeDisplay = [];
        this.selectedPGLineArray = [];
      }
    }
  }
  searchParts(row, event) {
    if (row == 'Individual') {
      if (event.target.checked == true) {
        this.isIndividual = true;
        this.isBulk = false;
        this.selectedPartArray = [];
        this.selectedSKUDisplay = [];
        //this.productTypeDisplay = [];
       // this.selectedPGLineArray = [];
      }
      else {
        this.isBulk = false;
        this.isIndividual = true;
        this.selectedPartArray = [];
       // this.selectedSKUDisplay = [];
       // this.productTypeDisplay = [];
        //this.selectedPGLineArray = [];
      }
    }
    else if (row == 'bulk') {
      if (event.target.checked == true) {
        this.isBulk = true;
        this.isIndividual = false;
        this.selectedPartArray = [];
        this.selectedSKUDisplay = [];
      //  this.productTypeDisplay = [];
       // this.selectedPGLineArray = [];
      }
      else {
        this.isBulk = false;
        this.isIndividual = false;
        this.selectedPartArray = [];
        this.selectedSKUDisplay = [];
        //this.productTypeDisplay = [];
       // this.selectedPGLineArray = [];
      }
    }
  }

  change(event) {
    if (event == true) {
      this.isAllCustomer = true;
      this.isAccount = true;
      this.isFleetOwner = true;
      this.isRetailer = true;
      this.isAllDisable = true;
    }
    else if (event == false) {
      this.isAllCustomer = false;
      this.isAccount = false;
      this.isFleetOwner = false;
      this.isRetailer = false;
      this.isAllDisable = false;
    }
  }

  changeCustomer(event) {
    if (event == 'FO') {
      this.isAllCustomer = false;
      this.isAccount = true;
      this.isFleetOwner = false;
      this.isRetailer = false;
      this.isAllDisable = false;
    }
    else if (event == 'GOV') {
      this.isAllCustomer = false;
      this.isAccount = false;
      this.isFleetOwner = true;
      this.isRetailer = false;
      this.isAllDisable = false;
    }
    else if (event == 'RT') {
      this.isAllCustomer = false;
      this.isAccount = false;
      this.isFleetOwner = false;
      this.isRetailer = true;
      this.isAllDisable = false;
    }
  }

  changeSearch(row, event) {
    debugger;
    if (row == 'Dis') {
      this.confirmService.confirm({ title: this.CustTitle, message: this.CustText })

      if (event.target.checked == true) {
        this.isDistributorSearch = true;
        this.isDivisionSearch = false;
        this.showlocationtype = "Dist";
        this.selectedDistrArray = [];
        this.selectedDivArray = [];
        this.selectedDisplayDistributor = [];
        this.selectedDisplayDivision = [];
      }
      else {
        this.isDistributorSearch = false;
        this.isDivisionSearch = true;
        this.showlocationtype = "Div";
        this.selectedDistrArray = [];
        this.selectedDivArray = [];
        this.selectedDisplayDistributor = [];
        this.selectedDisplayDivision = [];
      }
    }
    else if (row == 'Div') {
      if (event.target.checked == true) {
        this.confirmService.confirm({ title: this.CustTitle, message: this.CustText })

        this.isDistributorSearch = false;
        this.isDivisionSearch = true;
        this.showlocationtype = "Div";
        this.selectedDistrArray = [];
        this.selectedDivArray = [];
        this.selectedDisplayDistributor = [];
        this.selectedDisplayDivision = [];
      }
      else {
        this.isDistributorSearch = true;
        this.isDivisionSearch = false;
        this.showlocationtype = "Dist";
        this.selectedDistrArray = [];
        this.selectedDivArray = [];
        this.selectedDisplayDistributor = [];
        this.selectedDisplayDivision = [];
      }
    }
  }

  changedatefilter(Value) {
    if (Value == 'Today') {
      this.ShowCustom = false;
      this.isToday = true;
      this.isThirtyDays = false;
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
      this.AllFilters.patchValue({
        Today: false,
        Custom: true,
        thirtyDays: false,
        Sevenday: false
      })
    }
  }

  orderDetailsModal: any;
  TempDAta: any;
  offerdetailsDetails: any;
  openOfferDetails(row) {
    var datas = this.datapass.getOption();
    console.log(datas)
    this.loader.open()
    this.TempDAta = [];
    const ListInput1: InputofferDetail = {} as InputofferDetail;
    ListInput1.discount_code = row.discount_code;
    this.CommonService.RuleDetailsListByDiscountcode(ListInput1).subscribe(
      data => {
        if (data.success == true) {
          this.loader.close()
          if (data.data.total_results > 0) {
            this.TempDAta = data.data.result;
            this.offerdetailsDetails = this.TempDAta
            let ngbModalOptions: NgbModalOptions = {
              backdrop: true,
              keyboard: true
            };
            this.modalService.open(this.offerpopup, ngbModalOptions).result.then((result) => {
              this.closeResult = `Closed with: ${result}`;
            }, (reason: any) => {
              this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
            });
          }
          else if (data.data.total_count == 0) {
            Swal.fire('No Data Found');
            // alert('Please Check Details After Some Time')
            // alert('No Data Found')

            this.loader.close()
          }
        }
        else {
          this.toastrService.error('No Data Found')
          this.loader.close()
        }
      }, (err) => {
      }
    );
  }

  selectedOption;
  title = 'Confirmation ';
  text = 'Are you sure want to Publish??';

  DeApproveTitle = 'Confirmation ';
  DeApproveText = 'Are you sure want to Un-publish??';

  Approve(row) {
    debugger
    this.confirmService.confirm({ title: this.title, message: this.text })
      .subscribe((result) => {
        this.selectedOption = result;

        if (this.selectedOption == true) {
          const ListInput: AprroveRejectJson = {} as AprroveRejectJson;
          ListInput.discount_code = row.discount_code
          this.ApproveReject(ListInput)
        }
      });
  }


  ApproveReject(ListInput) {
    this.CommonService.ApproveRejectRuleByCode(ListInput).subscribe(

      data => {
        debugger
        console.log(data);

        if (data.success == true) {
          const ListInput: ListInput = {} as ListInput;
          ListInput.offset = 0;
          if (this.tabchange == 1) {
            ListInput.owner = 'TML';
          }
          if (this.tabchange == 2) {
            ListInput.owner = 'DLR';
          }

          Swal.fire({
            title: data.data.msg,
            // text: "You won't be able to revert this!",
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              this.GetList(ListInput);
            }
            else {
              this.GetList(ListInput);
            }
          })
        }
        else {
          const ListInput: ListInput = {} as ListInput;

          ListInput.offset = 0;

          Swal.fire({
            title: data.data.msg,
            icon: 'error',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              this.items = this.temp = [];
              this.GetList(ListInput);
            }
            else {
              this.items = this.temp = [];
              this.GetList(ListInput);
            }
          })
        }
      }, (err) => {
      }
    );
  }

  DeApprove(row) {
    debugger
    this.confirmService.confirm({ title: this.DeApproveTitle, message: this.DeApproveText })
      .subscribe((result) => {
        this.selectedOption = result;
        if (this.selectedOption == true) {
          const ListInput: AprroveRejectJson = {} as AprroveRejectJson;
          ListInput.discount_code = row.discount_code
          this.ApproveReject(ListInput)
        }
      });
  }

  checkstatus(status, owner) {
    var statusq
    if (status == true) {
      statusq = false
    }
    else {
      statusq = true
    }

    if (owner == 'DLR' && this.isDistributor == false) {
      this.DisplayButton = false;
    }
    else {
      this.DisplayButton = true
    }
    return statusq;
  }

  // CREATE SCHEME

  GovtCustDis: any
  RetilerDis: any
  FleetownerDis: any
  Valdationmessage: any;
  KeyAccount: boolean;
  Fleetowner: boolean;
  GovtCust: boolean;
  Retiler: boolean;
  CustomerTempData = []
  CustomerData = []
  Showerror: boolean = false;

  public itemForm: FormGroup;
  myControl1 = new FormControl();
  userControl = new FormControl();

  CustTitle = 'Confirmation ';
  CustText = 'Changing selection will erase the selected data.  Are you sure you want to change the selection?';

  SelectedCustomerTemp = [];
  options1: string[] = [];

  Type = [];
  ProductGroupLine = [];
  selectedPGLineArray = [];
  productArray = [];

  State = [];
  Statedata = [];
  Districtdata = [];
  District = [];
  Division = [];
  TempDivision = [];
  TempDistributor = [];
  Distributor = [];
  Role: any

  onChange(event) {
    debugger
    if (event == true) {
      this.KeyAccount = true;
      this.Fleetowner = true;
      this.GovtCust = true;
      this.Retiler = true;
      this.GovtCustDis = true;
      this.RetilerDis = true;
      this.FleetownerDis = true;


      var Custtypetemp = []
      if (this.itemForm.value.All == true) {
        Custtypetemp = ['FO', 'GOV', 'RT'];
        this.CustomerTempData = []
        this.CustomerData = [];
        var Json = { "offset": 0, "user_type_list": Custtypetemp, "search_text": "", "size": 388 }
        this.GetCustomer(Json)
      }
      else {
        Custtypetemp = [];
        //if (Event.KeyAccount == true) { Custtype.push('KEY') }
        if (this.itemForm.value.Fleetowner == true) { Custtypetemp.push('FO') }
        if (this.itemForm.value.GovtCust == true) { Custtypetemp.push('GOV') }
        if (this.itemForm.value.Retiler == true) { Custtypetemp.push('RT') }
        this.CustomerTempData = []
        this.CustomerData = [];
        var Json = { "offset": 0, "user_type_list": Custtypetemp, "search_text": "", "size": 388 }
        this.GetCustomer(Json)

      }

    }
    else {
      // this.KeyAccount = false;
      this.Fleetowner = false;
      this.GovtCust = false;
      this.Retiler = false;
      this.GovtCustDis = false;
      this.RetilerDis = false;
      this.FleetownerDis = false;

      this.itemForm.patchValue({
        All: false,
        Fleetowner: false,
        GovtCust: false,
        Retiler: false,
      });

      this.SelectedCustomer = [];
      this.CustomerData = [];

    }

    if (this.Fleetowner == false && this.GovtCust == false && this.Retiler == false) {
      this.SelectedCustomer = [];
      this.CustomerData = [];
    }
    else if (this.Fleetowner == true && this.GovtCust == true && this.Retiler == true) {
      Custtypetemp = ['FO', 'GOV', 'RT'];
      this.CustomerTempData = []
      this.CustomerData = [];
      var Json = { "offset": 0, "user_type_list": Custtypetemp, "search_text": "", "size": 388 }
      this.GetCustomer(Json)
    }
  }

  async GetCustomer(input) {
    this.CustomerTempData = []
    this.CustomerData = [];
    await this.CommonService.GetCustomer(input).subscribe(

      data => {

        if (data.success == true) {

          for (let entry1 of data.Data) {
            const ListInput: CustDataPreapre = {} as CustDataPreapre;
            ListInput.display = entry1.account_name + '_' + entry1.account_id + '_' + entry1.city + '_' + entry1.state + '_' + entry1.user_type;
            ListInput.value = entry1.account_id;
            ListInput.type = entry1.user_type;
            this.CustomerTempData.push(ListInput);
          }

          this.CustomerData = this.CustomerTempData;
          console.log(this.CustomerData)
        }

        else {
          //  this.loader.close()
        }
      }, (err) => {
        // this.loader.close()
      }
    );
  }

 

  onChangeCustomer(type, ischek) {


    if (!ischek.checked) {
      this.confirmService.LogOutOCnform({ title: this.CustTitle, message: this.CustText })
        .subscribe((result) => {
          var access = result;
          if (access == true) {

            if (this.itemForm.value.Fleetowner == true && this.itemForm.value.GovtCust == true && this.itemForm.value.Retiler == true) {
              this.Fleetowner = true;
              this.GovtCust = true;
              this.Retiler = true;
              this.itemForm.patchValue({
                All: true,
              });
            }

            var Custtypetemp = []
            if (this.itemForm.value.All == true) {
              Custtypetemp = ['FO', 'GOV', 'RT'];
            }
            else {
              Custtypetemp = [];
              if (this.itemForm.value.Fleetowner == true) { Custtypetemp.push('FO') }
              if (this.itemForm.value.GovtCust == true) { Custtypetemp.push('GOV') }
              if (this.itemForm.value.Retiler == true) { Custtypetemp.push('RT') }

            }




            if (Custtypetemp.length == 0) {
              this.SelectedCustomer = []
              this.CustomerData = []
            }
            else {
              this.CustomerTempData = []
              this.CustomerData = [];
              var Json = { "offset": 0, "user_type_list": Custtypetemp, "search_text": "", "size": 50 }
              this.GetCustomer(Json)

              var FinalCust = []
              for (let entry1 of this.SelectedCustomer) {
                for (let entry2 of Custtypetemp) {


                  if (entry1.type == entry2) {
                    FinalCust.push(entry1)
                  }



                  this.SelectedCustomer = []
                  this.SelectedCustomer = FinalCust;

                }
              }
            }





          }
          else {

            if (type == 'FO') {
              if (this.itemForm.value.Fleetowner == false) {
                this.Fleetowner = true
              } if (this.itemForm.value.Fleetowner == true) {
                this.Fleetowner = false
              }

              this.itemForm.patchValue({

                Fleetowner: this.Fleetowner

              });

            }


            if (type == 'GOV') {
              if (this.itemForm.value.GovtCust == false) {
                this.GovtCust = true
              } if (this.itemForm.value.GovtCust == true) {
                this.GovtCust = false
              }
              this.itemForm.patchValue({

                GovtCust: this.GovtCust

              });
            }
            if (type == 'RT') {
              if (this.itemForm.value.Retiler == false) {
                this.Retiler = true
              } if (this.itemForm.value.Retiler == true) {
                this.Retiler = false
              }
              this.itemForm.patchValue({

                Retiler: this.Retiler

              });
            }



          }
        });
    }
    else {
      this.BindCustomerdata();

    }







  }

  BindCustomerdata() {
    if (this.itemForm.value.Fleetowner == true && this.itemForm.value.GovtCust == true && this.itemForm.value.Retiler == true) {
      this.Fleetowner = true;
      this.GovtCust = true;
      this.Retiler = true;


      this.FleetownerDis = true;
      this.GovtCustDis = true;

      this.RetilerDis = true;


      this.itemForm.patchValue({
        All: true,
      });
    }

    var Custtypetemp = []
    if (this.itemForm.value.All == true) {
      Custtypetemp = ['FO', 'GOV', 'RT'];
    }
    else {
      Custtypetemp = [];
      if (this.itemForm.value.Fleetowner == true) {
        Custtypetemp.push('FO')
        this.Fleetowner = true
      }
      if (this.itemForm.value.GovtCust == true) {
        Custtypetemp.push('GOV')
        this.GovtCust = true
      }
      if (this.itemForm.value.Retiler == true) {
        Custtypetemp.push('RT')
        this.Retiler = true
      }
      var Json = { "offset": 0, "user_type_list": Custtypetemp, "search_text": "", "size": 50 }
      this.GetCustomer(Json)
    }
  }
  AddSelectCustomer() {

    debugger


    if (this.SelectedCustomerTemp.length > 0) {
      for (let entry3 of this.SelectedCustomerTemp) {

        var TempData = this.SelectedCustomer.filter(book => book.value === entry3.value);
        if (TempData.length == 0) {
          this.SelectedCustomer.push(entry3);
          console.log(this.SelectedCustomer)
        }
      }

      this.SelectedCustomerTemp = [];
      this.BindCustomerdata();
     
    }
    else {
    }

  }
 
  filterMyOptionsPart(row, event) {
    debugger;
    this.selectedPartArray = [];

    this.skuindivdual = [];
    if (event.target.checked) {

      var partNumber = row.part_number
      for (const field1 in this.partList.controls) { // 'field' is a string
        if (field1 === partNumber) {
          this.partList.get(field1).setValue(true);


          this.skuindivdual.push(row);


        }
        else {
          this.partList.get(field1).setValue(false);
        }
      }
    }
    else {
      for (const field1 in this.partList.controls) { // 'field' is a string
        this.partList.get(field1).setValue(false);
        this.selectedPartArray = [];
      }

    }
  }


  filterMyOptions1(row, event) {
    debugger;
    this.selectedPartArray = [];

    this.skuindivdual = [];
    if (event.target.checked) {

      var partNumber = row.part_number
      for (const field1 in this.partList.controls) { // 'field' is a string
        if (field1 === partNumber) {
          this.partList.get(field1).setValue(true);


          this.skuindivdual.push(row);


        }
        else {
          this.partList.get(field1).setValue(false);
        }
      }
    }
    else {
      for (const field1 in this.partList.controls) { // 'field' is a string
        this.partList.get(field1).setValue(false);
        this.selectedPartArray = [];
      }

    }
  }

  optionClicked(event: Event, user) {
    event.stopPropagation();
    this.toggleSelection(user);
  }

  toggleSelection(user) {
    debugger
    var TempData = this.SelectedCustomerTemp.filter(book => book.value === user.value);
    if (TempData.length == 0) {

      this.SelectedCustomerTemp.push(user);
    }
    else {
      const i = this.SelectedCustomerTemp.findIndex(value => value.value === user.value && value.value === user.value);
      this.SelectedCustomerTemp.splice(i, 1);
    }
    this.userControl.setValue(this.SelectedCustomer);
    console.log(this.SelectedCustomer)
  }

  FilterCustValue: any;
  private _filterforCust(value: string): string[] {

    this.FilterCustValue = value;

    if (this.FilterCustValue == "") {
      this.FilterCustValue = null;
    }

    var Custtypetemp = []
    if (this.itemForm.value.All == true) {
      Custtypetemp = [];
      Custtypetemp = [];
    }
    else {
      Custtypetemp = [];
      if (this.itemForm.value.Fleetowner == true) { Custtypetemp.push('FO') }
      if (this.itemForm.value.GovtCust == true) { Custtypetemp.push('GOV') }
      if (this.itemForm.value.Retiler == true) { Custtypetemp.push('RT') }

    }

    if (this.Fleetowner == false && this.GovtCust == false && this.Retiler == false) {
      this.SelectedCustomer = [];
      this.CustomerData = [];

    }
    else if (this.Fleetowner == true && this.GovtCust == true && this.Retiler == true) {
      Custtypetemp = ['FO', 'GOV', 'RT'];
      this.CustomerTempData = []
      this.CustomerData = [];
      
    }

    this.CustomerTempData = []
    this.CustomerData = [];

    var Json = { "offset": 0, "user_type_list": Custtypetemp, "search_text": this.FilterCustValue, "size": 50 }
    this.GetCustomer(Json)

    return this.options1.filter(option => option.toLowerCase().includes(this.FilterCustValue));
  }

  removeCustomer(Display: any) {
    this.SelectedCustomer.splice(this.SelectedCustomer.findIndex(item => item.display === Display), 1)
  }

  ChangePercentage(event) {
    debugger
    var val = event.target.value;
    if (val == 0) {
      this.Showerror = true;
    }
    else if (val < 100) {
      this.Showerror = false;
    }
    else {
      this.Showerror = true;
    }
  }


  isNumberKey(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode == 46 && event.srcElement.value.split('.').length > 1) {
      return false;
    }
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
  ProductLineList: FormGroup;
  lineData = [];

  Getpgline(input) {
    //this.loader.open()
    //this.ProductGroupData=[];
    this.CommonService.GetproductLine(input).subscribe(
      data => {
        if (data.success == true) {
          // this.ProductGroupLine = []
          // for (let entry1 of data.data) {
          //   //   debugger
          //   const ListInput: DataPreapre = {} as DataPreapre;
          //   ListInput.display = entry1.LINE_2_s;
          //   ListInput.value = entry1.LINE_2_s;
          //   this.ProductGroupLine.push(ListInput);
          // }
          // this.Type = []
          // this.Type = this.ProductGroupLine;
          // console.log(this.Type)

          this.Type = data.data;

          console.log(this.Type)


          // new
          this.ProductLineList = new FormGroup({})
          for (let formModule of this.Type) {
            this.ProductLineList.addControl(formModule.LINE_2_s, new FormControl(false))
          }

          // for (let i = 0; i < this.Type.length; i++) {
          //   // const data: InputDataLine = {} as InputDataLine;
          //   // // this.AllDataArray.push(this.DistributorData[i].distributor_id)
          //   // data.multi_pg_line = this.Type[i].LINE_2_s;
          //   var line = this.Type[i].LINE_2_s;
          //   // var lineitem = [];
          //   // lineitem.push(line)
          //   // console.log(lineitem)
          //   var jsonn = { "search_text": line, "size": 10 }
          //   console.log(jsonn)

          //   this.getSKUItem(jsonn, i);

          //   // lineitem=[]

          // }
        }
        else {
        }
      }, (err) => {
        //this.loader.close()
      }
    );
  }

  ItemSKU = [];
  SKU = [];
  tempPartArray = [];
  partList = new FormGroup({});

  getSKUItem(input, i) {
    console.log(input)

    this.CommonService.GetSKU(input).subscribe(
      data => {
        // debugger;
        if (data.success == true) {
          this.SKU = data.data.result;
          console.log(data.data.result)
          var tempArray = [];
        
          console.log(this.Type)
          for (let q = 0; q < this.SKU.length; q++) {
            this.tempPartArray.push(this.SKU[q]);
          }

          this.partList = new FormGroup({})
          for (let formModule of this.tempPartArray) {
            this.partList.addControl(formModule.part_number, new FormControl(false))
          }
        }
        else {
          //this.loader.close()
        }
      }, (err) => {
        //this.loader.close()
      }

    );
  }


  async getSKUItems(input) {
    console.log(input)
   
    this.CommonService.GetSKU(input).subscribe(
      data => {
        // debugger;
        if (data.success == true) {
          this.SKU[input.search_text] = data.data.result;
          console.log(this.SKU)
          
        }
        else {
          //this.loader.close()
        }
      }, (err) => {
        //this.loader.close()
      }

    );
  }

  SelectedPGLine(row, event) {
  

    if (event.target.checked) {
      var data2 = this.selectedPGLineArray.filter(book => book.LINE_2_s === row.LINE_2_s)
      console.log('data', data2)
      if (data2.length == 0) {
        this.selectedPGLineArray.push(row);
      }
    }
    else {
      this.selectedPGLineArray.splice(this.selectedPGLineArray.findIndex(item => item.LINE_2_s === row.LINE_2_s), 1)
    }

    console.log(this.selectedPGLineArray)
  }

  selectedPartArray = [];

  SelectedPartLine(row, event) {
    if (event.target.checked) {
      var data2 = this.selectedPartArray.filter(book => book.part_number === row.part_number)
      console.log('data', data2)
      if (data2.length == 0) {
        this.selectedPartArray.push(row);
      }
    }
    else {
      this.selectedPartArray.splice(this.selectedPartArray.findIndex(item => item.part_number === row.part_number), 1)
    }

  }

  productTypeDisplay = [];
  selectedSKUDisplay = [];
  addProduct() {

    this.ProductLineList.reset();
    for (let i = 0; i < this.selectedPGLineArray.length; i++) {
      var data2 = this.productTypeDisplay.filter(book => book.LINE_2_s === this.selectedPGLineArray[i].LINE_2_s)
      console.log('data', data2)
      if (data2.length == 0) {
        this.productTypeDisplay.push(this.selectedPGLineArray[i])
      }
    }

    if (this.isPart == true) {
      for (let i = 0; i < this.selectedPartArray.length; i++) {
        var data2 = this.selectedSKUDisplay.filter(book => book.part_number === this.selectedPartArray[i].part_number)
        console.log('data', data2)
        if (data2.length == 0) {
          this.selectedSKUDisplay.push(this.selectedPartArray[i])
        }
      }
    }
    this.selectedPartArray = []
  }

  DistributorList: FormGroup;
  filteredOptions = [];

  getDistributor(input) {
    this.TempDistributor = []
    this.Distributor = []
    //debugger;
    // this.loader.open()
    //this.ProductGroupData=[];
    this.CommonService.GetDistributor(input).subscribe(
      data => {
        if (data.success == true) {
          // this.ProductGroupData = data.data;
          // for (let entry1 of data.data.result) {
          //   //debugger
          //   const ListInput: DataPreapre = {} as DataPreapre;
          //   ListInput.display = entry1.distributor_name;
          //   ListInput.value = entry1.distributor_id;
          //   this.TempDistributor.push(ListInput);
          // }
          // this.loader.close()
          this.Distributor = data.data.result;
          console.log(this.Distributor)


          // new
          this.filteredOptions = data.data.result
          this.DistributorList = new FormGroup({})
          for (let formModule of this.Distributor) {
            this.DistributorList.addControl(formModule.distributor_id, new FormControl(false))
          }

          for (let i = 0; i < this.Distributor.length; i++) {
            const data: InputData1 = {} as InputData1;
            // this.AllDataArray.push(this.DistributorData[i].distributor_id)
            data.distributor_id = this.Distributor[i].distributor_id;
            data.div_search_text = "";

            this.Getdivision(data, i);

          }

        }
        else {
          // this.loader.close()
        }
      }, (err) => {
        // this.loader.close()
      }
    );
  }

  AddSKUSingle() {
    // 
    this.errorselectmsg = "";
    var out = []
    if (this.filterValue) {
      this.errorselectmsg = "";
      var data2 = this.filteredOptions.filter(book => book.part_number === this.filterValue);


      const ListInput: DataPreapre = {} as DataPreapre;
      ListInput.display = data2[0].part_number + '_' + data2[0].part_description;
      ListInput.value = data2[0].part_number;

      var TempData = this.selectedSKUDisplay.filter(book => book.value === data2[0].part_number);




      if (TempData.length == 0) {
        this.SelectProductPart = false;
        this.selectedSKUDisplay.push(ListInput);
      }









      this.filterValue = "";
      this.myControl.reset();

      var jsonn = { "search_text": '', "size": 100 }
      this.getSKUItemSingle(jsonn);
    }
    else {

      this.errorselectmsg = "Please Select Part";
    }
  }
  tempDivisionArray = [];
  filterValue2: any;

  Getdivision(Data1, i) {
    // this.AllDataArray = [];
    if (this.Role == "TML") {
      this.Distributor[i]['divData'] = [];
    }
    this.CommonService.DivisionList(Data1).subscribe(
      data => {
        if (data.success == true) {
          this.Division = [];
          this.filterValue2 = null;
          this.Division = data.data.result;

          if (this.Role == "TML") {
            var tempArray = [];
            tempArray.push(data.data.result)
            this.Distributor[i]['divData'] = tempArray[0]
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

 

  GetDistrict(input) {
    this.CommonService.GetDistrict(input).subscribe(
      data => {
        if (data.success == true) {
          for (let entry1 of data.data.result) {
            const ListInput: DataPreapre = {} as DataPreapre;
            ListInput.display = entry1.district_name;
            ListInput.value = entry1.district_name;
            this.Districtdata.push(ListInput);
          }
          this.District = this.Districtdata;
        }
        else {
          //  this.loader.close()
        }
      }, (err) => {
        // this.loader.close()
      }
    );
  }

  DivisionList1: FormGroup;

  getdivisionDistributor(input) {
    this.Division = [];
    this.TempDivision = [];
    this.CommonService.GetDivision(input).subscribe(
      data => {
        if (data.success == true) {
          this.Division = [];
          this.filterValue2 = null;
          this.Division = data.data.result;
          this.DivisionList1 = new FormGroup({})
          for (let formModule of this.Division) {
            this.DivisionList1.addControl(formModule.div_id, new FormControl(false))
          }
        }
        else {
          //  this.loader.close()
        }
      }, (err) => {
        // this.loader.close()
      }
    );
  }

  DisplayDistrict = [];
  selectedDistributoroption = [];
  selectedDistributor = this.selectedDistributoroption;
  selectedStateOptions = [];
  selectedState = this.selectedStateOptions;
  DisplayState = [];
  selected = [];

  


  // onChanges(deviceValue) {
  //   console.log(deviceValue);
  //   const data2: InputData2 = {} as InputData2;
  //   var jsonn = { "multi_zone": this.selected, "multi_state": [deviceValue], "size": 100 }
  //   this.DistrictList(jsonn)
  // }



  getDistictSelectedOptions(selected2) {
    debugger
    this.TempDistributor = []
    console.log(selected2)
    //  this.Distributor = []
    this.selectedDistict = selected2;
    if (this.selectedDistict.length > 0) {
      this.DisplayDistrict = this.selectedDistict;

      if (this.isDivisionSearch == true) {
        var Json = {
          "multi_zone": this.selected,
          "multi_state": this.selectedState,
          "multi_district": this.selectedDistict,
          "size": 1000
        }
        this.getDistributor(Json)
      }

    }
  }

  TempselectedDisplayDistributor = [];
  selectedDistributors = [];
  tempselectedDisplayDivision = [];
  selectedDisplayDistributor = [];
  selectedDisplayDivision = [];

  getDistributorSelectedOptions(selected3) {
    if (selected3.length > 0) {
      this.TempselectedDisplayDistributor = [];
      var out = [];
      for (let entry1 of selected3) {
        this.selectedDistributors = selected3;
        var data = this.Distributor.filter((e) => e.value.includes(entry1));
        out.push(data[0]);
      }
      this.TempselectedDisplayDistributor = out;
    }
  }

  getDivisionSelectedOptions(selected3) {
    debugger
    if (selected3.length > 0) {
      this.tempselectedDisplayDivision = [];
      var out = [];
      for (let entry1 of selected3) {
        var data = this.Division.filter((e) => e.value.includes(entry1));
        out.push(data[0]);
      }
      this.tempselectedDisplayDivision = out;
    }

  }

  DistributorAdd() {
    this.errorlocationmsg = "";
    // debugger
    for (let entry1 of this.TempselectedDisplayDistributor) {
      var data = this.selectedDisplayDistributor.filter(book => book.value === entry1.value);
      if (data.length == 0) {
        this.selectedDisplayDistributor.push(entry1)
      }
    }
    for (let entry2 of this.tempselectedDisplayDivision) {

      var data = this.selectedDisplayDivision.filter(book => book.value === entry2.value);

      if (data.length == 0) {
        this.selectedDisplayDivision.push(entry2)
      }
    }
    this.Division = []
    if (this.isdist == false) {
      var Json111 = {
        "size": 1000
      }
      // this.getdivision(Json111)

    }
    if (this.showlocationtype == "Div") {
      var Json = {
        "multi_zone": this.selected,
        "multi_state": this.selectedState,
        "multi_district": this.selectedDistict,
        "multi_distributor_code": this.selectedDistributors,
        "size": 1000
      }
      // this.getdivision(Json)
      if (this.tempselectedDisplayDivision.length == 0) {
        this.errorlocationmsg = "Please Select Division"
      }

    }
    else {
      var Json1 = {
        ///"multi_zone": this.selected,
        "multi_state": this.selectedState,
        "multi_district": this.selectedDistict,
        "size": 1000
      }
      this.getDistributor(Json1)
      if (this.Role == "Distributor") {
        if (this.tempselectedDisplayDivision.length == 0) {
          this.errorlocationmsg = "Please Select Divsion"
        }
        else {
          this.errorlocationmsg = "";
        }
      }
      else {
        if (this.TempselectedDisplayDistributor.length == 0) {
          this.errorlocationmsg = "Please Select Distributor"
        }
      }
    }
    this.tempselectedDisplayDivision = [];
    this.TempselectedDisplayDistributor = [];
  }

  removeDistributor(Distributor: any) {
    this.selectedDisplayDistributor.splice(this.selectedDisplayDistributor.findIndex(item => item.distributor_name === Distributor), 1)
  }

  removeDivision(Division: any) {
    this.selectedDisplayDivision.splice(this.selectedDisplayDivision.findIndex(item => item.div_name === Division), 1)
  }

  removeLine(product: any) {
    // let index = this.productTypeDisplay.indexOf(product, 0);
    // if (index > -1) {
    //   this.productArray.splice(index, 1);
    // }
    this.productTypeDisplay.splice(this.productTypeDisplay.findIndex(item => item.LINE_2_s === product), 1)
  }

  removePart(part: any) {
    this.selectedSKUDisplay.splice(this.selectedSKUDisplay.findIndex(item => item.part_number === part), 1)
  }

  selectedDistrArray = [];
  selectedDivArray = [];

  SelectedDistributor(row, event) {
   


    if (event.target.checked) {
      var data2 = this.selectedDistrArray.filter(book => book.distributor_id === row.distributor_id)
      console.log('data', data2)
      if (data2.length == 0) {
        this.selectedDistrArray.push(row);
      }
    }
    else {
      this.selectedDistrArray.splice(this.selectedDistrArray.findIndex(item => item.distributor_id === row.distributor_id), 1)
    }
    console.log(this.selectedDistrArray)
  }

  SelectedDivision(row, event) {
    if (event.target.checked) {
      this.selectedDivArray.push(row);
    }
    else {
      for (var i = 0; i < this.Distributor.length; i++) {
        if (this.selectedDivArray[i] == row) {
          this.selectedDivArray.splice(i, 1);
        }
      }
    }
    console.log(this.selectedDivArray)
  }

  addDistributor() {
    debugger

    this.DistributorList.reset();
    for (let i = 0; i < this.selectedDistrArray.length; i++) {
      var data2 = this.selectedDisplayDistributor.filter(book => book.distributor_id === this.selectedDistrArray[i].distributor_id)
      console.log('data', data2)
      if (data2.length == 0) {
        this.selectedDisplayDistributor.push(this.selectedDistrArray[i])
      }
    }

    console.log(this.selectedDisplayDistributor)
    if (this.isDivisionSearch == true) {
      this.DivisionList.reset();
      for (let k = 0; k < this.selectedDivArray.length; k++) {
        var data3 = this.selectedDisplayDivision.filter(book => book.div_id === this.selectedDivArray[k].div_id)
        //console.log('data', data3)
        if (data3.length == 0) {
          this.selectedDisplayDivision.push(this.selectedDivArray[k])
        }
      }
      this.selectedDivArray = []
    }
    this.selectedDistrArray = [];

  }

  addDivision() {
    debugger
    this.DivisionList1.reset();
    // this.selectedDisplayDivision =[];
    for (let k = 0; k < this.selectedDivArray.length; k++) {
      var data3 = this.selectedDisplayDivision.filter(book => book.div_id === this.selectedDivArray[k].div_id)
      console.log('data', data3)
      if (data3.length == 0) {
        this.selectedDisplayDivision.push(this.selectedDivArray[k])
      }
    }
    this.selectedDivArray = []
  }

  SaveScheme() {
    debugger
    if (this.itemForm.invalid) {
      this.loader.close();
      this.Valdationmessage = "* marked fields are mandatory"
      return;
    }
    var d1 = Date.parse(this.itemForm.value.from_date);
    var d2 = Date.parse(this.itemForm.value.to_date);
    if (d1 > d2) {
      //this.loader.close();
      Swal.fire('From-Date Should be Less Than To-Date.');
      this.Valdationmessage = "Start-Date Should be Less Than or Equal To Expiry-Date."
      return;
    }

    if (this.selectedState.length > 0 || this.selectedDistict.length > 0 || this.selected.length > 0) {
      if (this.selectedDisplayDivision.length == 0 && this.selectedDisplayDistributor.length == 0) {
        this.loader.close();
        Swal.fire({
          title: 'Please first add selected data and save',
          // text: "You won't be able to revert this!",
          icon: 'error',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'OK'
        }).then((result) => {

        })
        return;
      }
    }
    // var ProductLine1 = ["ALL"]
    // var SKU1 = ["ALL"]
    // var Divvsion = ["ALL"]
    // var Distributors1 = ["NA"]
    // var Customer = ["ALL"]
    // if (this.selectedSKUDisplay.length == 0 && this.productTypeDisplay.length != 0) {
    //   ProductLine1 = this.productTypeDisplay
    //   SKU1 = ["ALL"]
    // }
    // if (this.selectedSKUDisplay.length != 0 && this.productTypeDisplay.length == 0) {
    //   ProductLine1 = ["ALL"]
    //   SKU1 = this.selectedSKUDisplay
    // }
    // if (this.selectedSKUDisplay.length != 0 && this.productTypeDisplay.length != 0) {
    //   ProductLine1 = ["ALL"]
    //   SKU1 = this.selectedSKUDisplay;
    // }
    // if (this.selectedDisplayDivision.length != 0) {
    //   Divvsion = this.selectedDisplayDivision
    // }
    // if (this.selectedDisplayDistributor.length != 0) {
    //   Distributors1 = this.selectedDisplayDistributor
    // }
    // if (this.SelectedCustomer.length != 0) {
    //   Customer = this.SelectedCustomer;
    // }

    var ProductLine1 = ["ALL"]
    var SKU1 = ["ALL"]
    var Divvsion = ["ALL"]
    var Distributors1 = ["NA"]
    var Customer = ["ALL"]

    if (this.selectedSKUDisplay.length == 0 && this.productTypeDisplay.length != 0) {

      ProductLine1 = this.productTypeDisplay
      SKU1 = ["ALL"]
    }



    if (this.isPartWise == true) {
      if (this.SKUPartQty.length != 0) {
        ProductLine1 = ["ALL"]
        SKU1 = this.SKUPartQty
      }
      else {
        Swal.fire('error', 'Please select atleast 1 Part and Quantity', 'error')
        return false
      }
    }
    else {
      if (this.selectedSKUDisplay.length != 0 && this.productTypeDisplay.length == 0) {
        ProductLine1 = ["ALL"]
        SKU1 = this.selectedSKUDisplay
      }

      if (this.selectedSKUDisplay.length != 0 && this.productTypeDisplay.length != 0) {
        ProductLine1 = ["ALL"]
        SKU1 = this.selectedSKUDisplay
      }
    }

    if (this.selectedDisplayDivision.length != 0) {
      Divvsion = this.selectedDisplayDivision
    }

    if (this.selectedDisplayDistributor.length != 0) {
      Distributors1 = this.selectedDisplayDistributor
    }


    if (this.SelectedCustomer.length != 0) {
      Customer = this.SelectedCustomer;
    }

    this.prepareData(this.itemForm.value, ProductLine1, SKU1, Divvsion, Distributors1, Customer)
  }

  FinalDataForInsert = [];
  Finaldata = []

  prepareData(Event, ProductLine1, SKU1, Divvsion, Distributors1, Customer) {
    debugger
    console.log(this.ShowDiscountType)
    console.log(Customer)
    console.log(Event)
    console.log(Distributors1)
    console.log(Divvsion)
    console.log(ProductLine1)
    console.log(SKU1)

   
    
    // this.FinalDataForInsert = []

    // if (Event.All == true) {
    //   Custtype = [];
    //   Custtype = ['ALL'];
    // }
    // else {
    //   Custtype = [];
    //   if (Event.Fleetowner == true) { Custtype.push('FO') }
    //   if (Event.GovtCust == true) { Custtype.push('GOV') }
    //   if (Event.Retiler == true) { Custtype.push('RT') }

    // }

    // if (ProductLine1[0] == "ALL") {
    //   var divi = Divvsion[0];
    //   var disti = Distributors1[0];
    //   if (divi == "ALL" && disti == "NA") {

    //     for (let SKU of SKU1) {
    //       for (let Type of Custtype) {
    //         const ListInput: DataInsert = {} as DataInsert;
    //         ListInput.account_id = "ALL"
    //         ListInput.customer_type = Type;
    //         ListInput.division = "ALL";
    //         ListInput.pg_line = "NA";
    //         if (SKU1[0] == "ALL") {

    //           ListInput.sku_item = "ALL"
    //         }
    //         else {
    //           ListInput.sku_item = SKU.part_number;
    //         }

    //         ListInput.organization_id = "NA";
    //         this.Finaldata.push(ListInput)
    //       }
    //     }

    //   }
    //   else if (divi == "ALL") {
    //     for (let SKU of SKU1) {
    //       for (let Type of Custtype) {
    //         for (let org_id of Distributors1) {
    //           const ListInput: DataInsert = {} as DataInsert;
    //           ListInput.account_id = "ALL"
    //           ListInput.customer_type = Type;
    //           ListInput.division = "NA";
    //           ListInput.pg_line = "NA";
    //           if (SKU1[0] == "ALL") {

    //             ListInput.sku_item = "ALL"
    //           }
    //           else {
    //             ListInput.sku_item = SKU.part_number;
    //           }
    //           ListInput.organization_id = org_id.distributor_id;
    //           this.Finaldata.push(ListInput)
    //         }
    //       }
    //     }
    //   }
    //   else {
    //     for (let SKU of SKU1) {
    //       for (let Type of Custtype) {
    //         for (let Division of Divvsion) {
    //           const ListInput: DataInsert = {} as DataInsert;
    //           ListInput.account_id = "ALL"
    //           ListInput.customer_type = Type;
    //           ListInput.division = Division.div_id;
    //           ListInput.pg_line = "NA";

    //           if (SKU1[0] == "ALL") {

    //             ListInput.sku_item = "ALL"
    //           }
    //           else {
    //             ListInput.sku_item = SKU.part_number;
    //           }
    //           ListInput.organization_id = "NA";
    //           this.Finaldata.push(ListInput)

    //         }
    //       }
    //     }
    //   }
    // }
    // else if (SKU1[0] == "ALL") {
    //   var divi = Divvsion[0];
    //   var disti = Distributors1[0];
    //   if (divi == "ALL" && disti == "NA") {

    //     for (let Pline of ProductLine1) {
    //       for (let Type of Custtype) {
    //         const ListInput: DataInsert = {} as DataInsert;
    //         ListInput.account_id = "ALL"
    //         ListInput.customer_type = Type;
    //         ListInput.division = "ALL";
    //         ListInput.pg_line = Pline.LINE_2_s;
    //         ListInput.sku_item = "NA";
    //         ListInput.organization_id = "NA";
    //         this.Finaldata.push(ListInput)
    //       }
    //     }
    //   }
    //   else if (divi == "ALL") {
    //     for (let Pline of ProductLine1) {
    //       for (let Type of Custtype) {
    //         for (let org_id of Distributors1) {
    //           const ListInput: DataInsert = {} as DataInsert;
    //           ListInput.account_id = "ALL"
    //           ListInput.customer_type = Type;
    //           ListInput.division = "NA";
    //           ListInput.pg_line = Pline.LINE_2_s;
    //           ListInput.sku_item = "NA";
    //           ListInput.organization_id = org_id.distributor_id;
    //           this.Finaldata.push(ListInput)
    //         }
    //       }
    //     }
    //   }
    //   else {
    //     for (let Pline of ProductLine1) {
    //       for (let Type of Custtype) {
    //         for (let Division of Divvsion) {
    //           const ListInput: DataInsert = {} as DataInsert;
    //           ListInput.account_id = "ALL"
    //           ListInput.customer_type = Type;
    //           ListInput.division = Division.div_id;
    //           ListInput.pg_line = Pline.LINE_2_s;
    //           ListInput.sku_item = "NA";
    //           ListInput.organization_id = "NA";
    //           this.Finaldata.push(ListInput)
    //         }
    //       }
    //     }
    //   }
    // }

    // if (Customer[0] == "ALL") {
    //   this.FinalDataForInsert = this.Finaldata;
    // }
    // else {
    //   for (let FinalData of this.Finaldata) {
    //     for (let CustData of Customer) {
    //       const ListInput: DataInsert = {} as DataInsert;
    //       ListInput.account_id = CustData.value;
    //       ListInput.customer_type = FinalData.customer_type;
    //       ListInput.division = FinalData.division;
    //       ListInput.pg_line = FinalData.pg_line;
    //       ListInput.sku_item = FinalData.sku_item;
    //       ListInput.organization_id = FinalData.organization_id;
    //       this.FinalDataForInsert.push(ListInput)
    //     }
    //   }
    // }

    // console.log(this.FinalDataForInsert)

    // var From_Date = moment(Event.from_date).format("YYYY-MM-DD");
    // var To_Date = moment(Event.to_date).format("YYYY-MM-DD");
    // const ListInput: FinalDataFor = {} as FinalDataFor;
    // ListInput.discount_name = Event.discount_name;

    // ListInput.from_date = From_Date;
    // ListInput.to_date = To_Date;
    // ListInput.percentage = Number(Event.percentage);
    // ListInput.discount_details = this.FinalDataForInsert;
    // console.log(ListInput)
    // this.loader.open()
    // this.CommonService.InsertRulemaster(ListInput).subscribe(
    //   data => {
    //     if (data.success == true) {
    //       this.loader.close();
    //       Swal.fire({
    //         title: "Scheme Created Successfully",
    //         icon: 'success',
    //         showCancelButton: false,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         confirmButtonText: 'OK'
    //       }).then((result) => {
    //         if (result.value) {
    //           this.loader.close();
    //           this.resetForm()
    //         }
    //         else {
    //           this.loader.close();
    //           this.resetForm()
    //         }
    //       })
    //     }
    //     else {
    //       this.loader.close()
    //       Swal.fire(data.data.msg);
    //     }
    //   }, (err) => {
    //     this.loader.close()
    //   }
    // );
    // this.modalService.dismissAll();


    var Custtype = ['ALL'];
    this.Finaldata = [];
    this.FinalDataForInsert = []

    if (Event.All == true) {
      Custtype = [];
      Custtype = ['ALL'];
    }
    else {
      Custtype = [];
      if (Event.Fleetowner == true) { Custtype.push('FO') }
      if (Event.GovtCust == true) { Custtype.push('GOV') }
      if (Event.Retiler == true) { Custtype.push('RT') }

    }

    if (ProductLine1[0] == "ALL") {
      var divi = Divvsion[0];
      var disti = Distributors1[0];
      if (divi == "ALL" && disti == "NA") {
        for (let SKU of SKU1) {
          for (let Type of Custtype) {
            const ListInput: DataInsert = {} as DataInsert;
            ListInput.account_id = "ALL"
            ListInput.customer_type = Type;
            ListInput.division = "ALL";
            ListInput.pg_line = "NA";
            if (SKU1[0] == "ALL") {
              ListInput.sku_item = "ALL"
            }
            else {
              ListInput.sku_item = SKU.part_number;
              if (this.isPartWise == true) {
                ListInput.quantity = SKU.qty
              }
            }
            ListInput.organization_id = "NA";
            this.Finaldata.push(ListInput)
          }
        }
      }
      else if (divi == "ALL") {
        for (let SKU of SKU1) {
          for (let Type of Custtype) {
            for (let org_id of Distributors1) {
              const ListInput: DataInsert = {} as DataInsert;
              ListInput.account_id = "ALL"
              ListInput.customer_type = Type;
              ListInput.division = "NA";
              ListInput.pg_line = "NA";
              if (SKU1[0] == "ALL") {
                ListInput.sku_item = "ALL"
              }
              else {
                ListInput.sku_item = SKU.part_number;
                if (this.isPartWise == true) {
                  ListInput.quantity = SKU.qty
                }
              }
              ListInput.organization_id = org_id.distributor_id;
              this.Finaldata.push(ListInput)
            }
          }
        }
      }
      else {
        for (let SKU of SKU1) {
          for (let Type of Custtype) {
            for (let Division of Divvsion) {
              const ListInput: DataInsert = {} as DataInsert;
              ListInput.account_id = "ALL"
              ListInput.customer_type = Type;
              ListInput.division = Division.div_id;
              ListInput.pg_line = "NA";
              if (SKU1[0] == "ALL") {

                ListInput.sku_item = "ALL"
              }
              else {
                ListInput.sku_item = SKU.part_number;
                if (this.isPartWise == true) {
                  ListInput.quantity = SKU.qty
                }
              }
              ListInput.organization_id = "NA";
              this.Finaldata.push(ListInput)

            }
          }
          //  }
        }
      }
    }
    else if (SKU1[0] == "ALL") {
      var divi = Divvsion[0];
      var disti = Distributors1[0];
      if (divi == "ALL" && disti == "NA") {

        for (let Pline of ProductLine1) {
          for (let Type of Custtype) {
            const ListInput: DataInsert = {} as DataInsert;
            ListInput.account_id = "ALL"
            ListInput.customer_type = Type;
            ListInput.division = "ALL";
            ListInput.pg_line = Pline.LINE_2_s;
            ListInput.sku_item = "NA";
            ListInput.organization_id = "NA";
            this.Finaldata.push(ListInput)
          }
        }
      }
      else if (divi == "ALL") {
        for (let Pline of ProductLine1) {
          for (let Type of Custtype) {
            for (let org_id of Distributors1) {
              const ListInput: DataInsert = {} as DataInsert;
              ListInput.account_id = "ALL"
              ListInput.customer_type = Type;
              ListInput.division = "NA";
              ListInput.pg_line = Pline.LINE_2_s;
              ListInput.sku_item = "NA";
              ListInput.organization_id = org_id.distributor_id;
              this.Finaldata.push(ListInput)
            }
          }
        }
      }
      else {
        for (let Pline of ProductLine1) {
          for (let Type of Custtype) {
            for (let Division of Divvsion) {
              const ListInput: DataInsert = {} as DataInsert;
              ListInput.account_id = "ALL"
              ListInput.customer_type = Type;
              ListInput.division = Division.div_id;
              ListInput.pg_line = Pline.LINE_2_s;
              ListInput.sku_item = "NA";
              ListInput.organization_id = "NA";
              this.Finaldata.push(ListInput)
            }
          }
        }
      }
    }
    if (Customer[0] == "ALL") {
      this.FinalDataForInsert = this.Finaldata;
    }
    else {
      for (let FinalData of this.Finaldata) {
        for (let CustData of Customer) {
          const ListInput: DataInsert = {} as DataInsert;
          ListInput.account_id = CustData.value;
          ListInput.customer_type = FinalData.customer_type;
          ListInput.division = FinalData.division;
          ListInput.pg_line = FinalData.pg_line;
          ListInput.sku_item = FinalData.sku_item;
          if (this.isPartWise == true) {
            ListInput.quantity = FinalData.quantity;
          }
          ListInput.organization_id = FinalData.organization_id;
          this.FinalDataForInsert.push(ListInput)
        }
      }
    }

    const ListInput1: FinalDataFor = {} as FinalDataFor;
    ListInput1.discount_name = Event.discount_name;
  

    // this.from_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
    // this.to_date = this.datepipe.transform(this.from_date, 'yyyy-MM-dd')
    // ListInput1.from_date = moment(Event.from_date).format("yyyy-dd-mm");
    // ListInput1.to_date = moment(Event.to_date).format("yyyy-dd-mm");
   // ListInput1.from_date = moment(this.from_date).format("DD-MM-YYYY")
    //ListInput1.to_date = moment(this.from_date).format("DD-MM-YYYY")
    ListInput1.from_date = moment(this.from_date).format("YYYY-MM-DD")
    ListInput1.to_date = moment(this.from_date).format("YYYY-MM-DD")
    ListInput1.percentage = Number(Event.percentage);
    ListInput1.discount_details = this.FinalDataForInsert;
    ListInput1.discount_type = this.ShowDiscountType;

    this.loader.open()

    console.log(ListInput1)

    this.CommonService.InsertRulemasterNew(ListInput1).subscribe(
      data => {
        if (data.success == true) {
          this.loader.close();
          Swal.fire({

            title: "Scheme Created Successfully",

            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              this.loader.close();
              this.resetForm();
              const ListInput: ListInput = {} as ListInput;
              ListInput.offset = 0;
              if (this.tabchange == 1) {
                ListInput.owner = 'TML';
              }
              if (this.tabchange == 2) {
                ListInput.owner = 'DLR';
              }
              this.items = this.temp = [];
              this.GetList(ListInput);
            }
            else {
              this.loader.close();
              this.resetForm();
              const ListInput: ListInput = {} as ListInput;
              ListInput.offset = 0;
              if (this.tabchange == 1) {
                ListInput.owner = 'TML';
              }
              if (this.tabchange == 2) {
                ListInput.owner = 'DLR';
              }
              this.items = [];
              this.GetList(ListInput);
            }
          })
        }
        else {
          this.loader.close()
          Swal.fire(data.data.msg);
        }
      }, (err) => {
        this.loader.close()

      }
    );
    this.modalService.dismissAll();
  }

  resetForm() {
  }

  Distributortype() {
    const data1: InputData = {} as InputData;

    // data1.size = 5;
    data1.org_search_text = this.AllFilters.value.organsization_name;

    this.getDistributor(data1);
  }

  // file: any;
  // arrayBuffer: any;
  // PartNumber: any;
  // FailArray: any = []
  // fileUpload(event) {
  //   debugger
  //   this.FailArray = []
  //   this.PartNumber = []
  //   var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'

  //   this.confirmService.confirm({ message: msg })
  //     .subscribe(res => {
  //       if (res) {
  //         if (event.target.files && event.target.files[0]) {
  //           var Extension = event.target.files[0].name.substring(
  //             event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
  //           if (Extension == "Xlsx" || Extension == "xlsx") {
  //             const fileReader = new FileReader();
  //             this.file = event.target.files[0];
  //             this.DocumentFile = this.file;

  //             if (this.file.size < 5000000) {
  //               fileReader.readAsArrayBuffer(this.file);

  //               fileReader.onload = (e) => {

  //                 this.arrayBuffer = fileReader.result;
  //                 var data = new Uint8Array(this.arrayBuffer);
  //                 var arr = new Array();
  //                 for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
  //                 var bstr = arr.join("");
  //                 var workbook = XLSX.read(bstr, { type: "binary" });
  //                 var first_sheet_name = workbook.SheetNames[0];
  //                 var worksheet = workbook.Sheets[first_sheet_name];
  //                 var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
  //                 for (var j = 0; j < arraylist.length; j++) {
  //                   var partNo = "";


  //                   partNo = arraylist[j]["part_number"]


  //                   var PartNumber = partNo.toString()
  //                   this.PartNumber.push(PartNumber.trim())


  //                 }


  //                 if (this.PartNumber.length == 0) {
  //                   this.loader.close()

  //                   Swal.fire('Oops...', 'Max 1-500 parts Allowed in 1 Excel!')
  //                   return false
  //                 }

  //                 if (this.PartNumber.length > 500) {
  //                   this.loader.close()
  //                   Swal.fire('Oops...', 'Max 1-500 parts Allowed in 1 Excel!')
  //                   return false
  //                 }




  //                 var Json = { "validate_type": "part_validation", "parts_array": this.PartNumber }

  //                 this.CommonService.ValidatePaRTS(Json).subscribe(

  //                   data => {

  //                     if (data.success == true) {

  //                       this.loader.close()
  //                       console.log(data.data)


  //                       debugger
  //                       console.log(data.records_valid)


                      
  //                       for (var i = 0; i < data.records_valid.length; i++) {
  //                         var json = {
  //                           "part_number": data.records_valid[i].part_number,
  //                           "part_description": data.records_valid[i].part_description
  //                         }
  //                       }
  //                       this.selectedSKUDisplay.push(json);


                        




  //                       if (data.records_not_valid.length > 0) {
  //                         for (let Part of data.records_not_valid) {
  //                           var Json2 =
  //                           {
  //                             "PartNumber": Part,
  //                             "Reason": 'Invalid Part'
  //                           }
  //                           this.FailArray.push(Json2)

  //                         }
  //                         this.excelService.exportCancellationAsExcelFile(this.FailArray, 'InvalidParts');
  //                       }

  //                     }
  //                     else {

  //                       Swal.fire('Please try Again')

  //                     }
  //                   }, (err) => {
  //                     this.loader.close()
  //                   }

  //                 );




  //               }
  //             }

  //             else {
  //               Swal.fire('Oops...', 'Upload only 5 MB size files!')
  //             }
  //           }
  //           else {
            
  //             Swal.fire('Upload only Xlsx Files');

  //           }

  //         }

  //       }
  //     })

  // }
  file: any;
  arrayBuffer: any;
  PartNumber: any;
  FailArray: any = []
  fileUpload(event) {
    this.FailArray = []
    this.PartNumber = []
    var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'

    this.confirmService.confirm({ message: msg })
      .subscribe(res => {
        if (res) {
          this.loader.open()
          if (event.target.files && event.target.files[0]) {
            var Extension = event.target.files[0].name.substring(
              event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
            if (Extension == "Xlsx" || Extension == "xlsx") {
              const fileReader = new FileReader();
              this.file = event.target.files[0];
              this.DocumentFile = this.file;

              if (this.file.size < 5000000) {
                fileReader.readAsArrayBuffer(this.file);

                fileReader.onload = (e) => {

                  this.arrayBuffer = fileReader.result;
                  var data = new Uint8Array(this.arrayBuffer);
                  var arr = new Array();
                  for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
                  var bstr = arr.join("");
                  var workbook = XLSX.read(bstr, { type: "binary" });
                  var first_sheet_name = workbook.SheetNames[0];
                  var worksheet = workbook.Sheets[first_sheet_name];
                  // console.log(XLSX.utils.sheet_to_json(worksheet, { raw: true }))
                  var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                  for (var j = 0; j < arraylist.length; j++) {
                    var partNo = "";


                    partNo = arraylist[j]["part_number"]


                    var PartNumber = partNo.toString()
                    this.PartNumber.push(PartNumber.trim())


                  }


                  if (this.PartNumber.length == 0) {
                    this.loader.close()

                    Swal.fire('Oops...', 'Max 1-500 parts Allowed in 1 Excel!')
                    return false
                  }

                  if (this.PartNumber.length > 500) {
                    this.loader.close()
                    Swal.fire('Oops...', 'Max 1-500 parts Allowed in 1 Excel!')
                    return false
                  }




                  // var Json = { "parts_list": this.PartNumber, "from_date": "2021-07-30", "to_date": "2021-07-31" }
                  var Json = { "validate_type": "part_validation", "parts_array": this.PartNumber }

                  this.CommonService.ValidatePaRTS(Json).subscribe(

                    data => {

                      if (data.success == true) {

                        this.loader.close()
                        console.log(data.data)


                        debugger



                        for (let Part of data.records_valid) {



                          const ListInput: DataPreapre = {} as DataPreapre;
                          ListInput.display = Part.part_number + '_' + Part.part_description;
                          ListInput.value = Part.part_number;

                          var TempData = this.selectedSKUDisplay.filter(book => book.value === Part);




                          if (TempData.length == 0) {
                            this.SelectProductPart = false;
                            this.selectedSKUDisplay.push(ListInput);
                          }

                        }




                        if (data.records_not_valid.length > 0) {
                          for (let Part of data.records_not_valid) {
                            var Json2 =
                            {
                              "PartNumber": Part,
                              "Reason": 'Invalid Part'
                            }
                            this.FailArray.push(Json2)

                          }
                          this.excelService.exportCancellationAsExcelFile(this.FailArray, 'InvalidParts');
                        }

                      }
                      else {

                        Swal.fire('Please try Again')

                      }
                    }, (err) => {
                      this.loader.close()
                    }

                  );




                }
              }

              else {
                Swal.fire('Oops...', 'Upload only 5 MB size files!')
              }
            }
            else {
              // this.myInputVariable.nativeElement.value = '';
              Swal.fire('Upload only Xlsx Files');

            }

          }

        }
      })

  }
  Divisiontype() {
    var div = this.AllFilters.value.division_name;
    console.log(div)
    const data1: InputDataDivision = {} as InputDataDivision;

    // data1.size = 5;
    data1.multi_zone = this.AllFilters.value.division_name;

    this.getdivisionDistributor(data1);
  }

  isIndividual: boolean;
  isBulk: boolean;
  isDefault: boolean;
  isPartWise: boolean;
  individualParts = [];
  ShowDiscountType: any = "default_discount";

  searchPartWise(row, event) {
    if (row == 'individual') {
      if (event.target.checked == true) {
        this.isIndividual = true;
        this.isBulk = false;
        this.selectedPartArray = [];
        this.selectedSKUDisplay = [];
      }
      else {
        this.isIndividual = false;
        this.isBulk = true;
        this.selectedPartArray = [];
        this.selectedSKUDisplay = [];
      }
    }
    else if (row == 'bulk') {
      if (event.target.checked == true) {
        this.isIndividual = false;
        this.isBulk = true;
        this.selectedPartArray = [];
        this.selectedSKUDisplay = [];
      }
      else {
        this.isIndividual = true;
        this.isBulk = false;
        this.selectedPartArray = [];
        this.selectedSKUDisplay = [];
      }
    }
    // else if (row == 'bulk') {
    //   if (event.target.checked == true) {
    //     this.isIndividual = false;
    //     this.isBulk = true;
    //     this.selectedPartArray = [];
    //     this.selectedSKUDisplay = [];
    //   }
    //   else {
    //     this.isIndividual = false;
    //     this.isBulk = true;
    //     this.selectedPartArray = [];
    //     this.selectedSKUDisplay = [];
    //   }
    // }
    // else if (row == 'single') {
    //   if (event.target.checked == true) {
    //     this.isIndividual = false;
    //     this.isBulk = true;
    //     this.selectedPartArray = [];
    //     this.selectedSKUDisplay = [];
    //   }
    //   else {
    //     this.isIndividual = true;
    //     this.isBulk = false;
    //     this.selectedPartArray = [];
    //     this.selectedSKUDisplay = [];
    //   }
    // }
  }


  searchDiscountType(row, event) {
    // console.log(this.disc_code)
    if (row == 'Default') {
      if (event.target.checked == true) {
        this.isDefault = true;
        this.isPartWise = false;
        this.isCashDiscount = false;
        this.ShowDiscountType = 'default_discount'
      }
      else {
        this.isDefault = false;
        this.isPartWise = true;

        this.ShowDiscountType = 'quantity_discount'
      }
    }
    else if (row == 'partwise') {
      if (event.target.checked == true) {
        this.isDefault = false;
        this.isPartWise = true;
        this.isCashDiscount = false;
        this.ShowDiscountType = 'quantity_discount'
        var jsonn2 = { search_text: "", size: 5 };
        this.getSKUItemSingle(jsonn2);
      }
      else {
        this.isDefault = true;
        this.isPartWise = false;
        this.ShowDiscountType = 'default_discount'
      }
    }
    else if (row == 'cashdiscount') {
      if (event.target.checked == true) {
        this.isDefault = false;
        this.isPartWise = false;
        this.isCashDiscount = true;
        this.ShowDiscountType = 'cash_discount'
        var jsonn2 = { search_text: "", size: 5 };
        this.getSKUItemSingle(jsonn2);
      }
      else {
        this.isDefault = false;
        this.isPartWise = false;
        this.isCashDiscount = true;
        this.ShowDiscountType = 'cash_discount'
      }

    }

    console.log(this.ShowDiscountType)
  }

  filterMyOptions(Event) {


    this.filterValue = Event;




  }

  getSKUItemSingle(input) {
    this.CommonService.GetSKU(input).subscribe(
      data => {
        if (data.success == true) {
          this.individualParts = data.data.result;
       


          this.partList = new FormGroup({})
          for (let formModule of this.individualParts) {
            this.partList.addControl(formModule.part_number, new FormControl(false))
          }
        }
        else {
          //this.loader.close()
        }
      }, (err) => {
        //this.loader.close()
      }
    );
  }

  SearchByPart() {
    var part = this.AllFilters.value.parts;
    // console.log(part)
    var jsonn2 = { search_text: part, size: 5 };
    this.getSKUItemSingle(jsonn2);
  }

  pgLineType() {
    var pgLine = this.AllFilters.value.pgline;

    console.log(pgLine)
    var jsonn3 = { search_text: pgLine };

    this.Getpgline(jsonn3);
  }

  SKUPartQty: any = [];

  addIndividualParts() {
    debugger
    this.partList.reset();
    for (let i = 0; i < this.selectedPartArray.length; i++) {
      var data2 = this.selectedSKUDisplay.filter(book => book.part_number === this.selectedPartArray[i].part_number)
      console.log('data', data2)
      if (data2.length == 0) {
        var quantity = this.itemForm.value.quantity;
        console.log('quantity', quantity)
        var Json = { "selectedPartArray": this.selectedPartArray[i], "quantity": quantity }
        this.selectedSKUDisplay.push(Json)
        quantity = "";
        this.itemForm.get('quantity').setValue("");
      }
    }
    console.log(this.itemForm.value.quantity)
    if (!this.itemForm.value.quantity) {
      Swal.fire('Opps', 'Please select Quantity', 'error')
      return false
    }
    if (this.skuindivdual.length == 0) {
      Swal.fire('Opps', 'Please select Part', 'error')
      return false
    }

    var data2 = this.skuindivdual.filter(book => book.part_number === this.partList.value.part_number);
    console.log(data2)

    this.partList.reset();

    var input = {
      "parts_list": [this.skuindivdual[0].part_number],
      "from_date": moment(this.itemForm.value.from_date).format("YYYY-MM-DD"),
      "to_date": moment(this.itemForm.value.to_date).format("YYYY-MM-DD"),
    }

    this.CommonService.GetPArtDiscountData(input).subscribe(
      data => {
        if (data.success == true) {
          debugger
          console.log(data.data)
          var Json =
          {
            "display": data.data[0].part_number,
            "part_number": data.data[0].part_number,
            "qty": this.itemForm.value.quantity,
            "default_discount": data.data[0].default_discount.length > 0 ? data.data[0].default_discount[0].percentage : '0',
            "quantity_discount": data.data[0].quantity_discount.length > 0 ? data.data[0].quantity_discount[0].percentage : '0',
            "is_available": data.data[0].quantity_discount.is_available,
          }
          var TempData = this.SKUPartQty.filter(book => book.value === this.skuindivdual[0].part_number);
          if (TempData.length == 0) {
            this.SKUPartQty.push(Json);
            this.SKUPartQty = [...this.SKUPartQty]
          }

          this.itemForm.get('quantity').setValue("");

        }
        else {

        }
      }, (err) => {

      }
    );
   
  }

  quantity: any
  skuindivdual = [];

  SelectedPartWise(row, event) {
    this.selectedPartArray = [];


    this.skuindivdual = [];
    if (event.target.checked) {
      var partNumber = row.part_number
      for (const field1 in this.partList.controls) { // 'field' is a string
        if (field1 === partNumber) {
          this.partList.get(field1).setValue(true);

        
          this.skuindivdual.push(row);
         
        }
        else {
          this.partList.get(field1).setValue(false);
        }
      }
    }
    else {
      for (const field1 in this.partList.controls) { // 'field' is a string
        this.partList.get(field1).setValue(false);
        this.selectedPartArray = [];
      }

    }

    
  }

  removePartWise(part: any) {
    this.SKUPartQty.splice(this.SKUPartQty.findIndex(item => item.display === part), 1)
  }


  // DocumentFile: any;
  // SuccessArray: any = []
  // FailedArray: any = []

  // SelectDocumentFiles(event) {
  //   var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'
  //   this.confirmService.confirm({ message: msg })
  //     .subscribe(res => {
  //       if (res) {
  //         if (event.target.files && event.target.files[0]) {
  //           var Extension = event.target.files[0].name.substring(
  //             event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
  //           if (Extension == "xlsx" || Extension == "Xlsx") {
  //             const reader = new FileReader();
  //             const file = event.target.files[0];
  //             this.DocumentFile = file;
  //             this.UploadCSV();
  //           }
  //           else {
  //             this.myInputVariable.nativeElement.value = '';
  //             Swal.fire('Upload only xlsx Files');
  //           }
  //         }
  //       }
  //     })
  // }

  // UploadCSV() {
  //   // this.loader.open();
  //   this.SuccessArray = []
  //   this.FailedArray = []
  //   var Check = false;
  //   let formData = new FormData();

  //   formData.append('files', this.DocumentFile);
  //   formData.append('from_date', moment(this.itemForm.value.from_date).format("YYYY-MM-DD"));
  //   formData.append('to_date', moment(this.itemForm.value.to_date).format("YYYY-MM-DD"));

  //   console.log(formData)

  //   Check = true
  //   if (Check) {
  //     this.fileservice.uploadPartValidate(formData).subscribe(data => {
  //       debugger;

  //       if (data.success == true) {
  //         debugger
  //         this.loader.close();
  //         this.DocumentFile = "";
  //         this.myInputVariable.nativeElement.value = "";

  //         this.SuccessArray = data.data.filter(book => book.is_valid === true);
  //         var FailedArrayteml = data.data.filter(book => book.is_valid === false);
  //         console.log("CSV", this.SuccessArray)
  //         // this.SuccessArray = []
  //         // this.FailedArray = []
  //         for (let entry of this.SuccessArray) {
  //           var Json =
  //           {
  //             "display": entry.part_number,
  //             // + '_' + data2[0].desc_text
  //             "part_number": entry.part_number,
  //             "qty": entry.quantity,
  //             "default_discount": entry.default_discount.length > 0 ? entry.default_discount[0].percentage : '0',
  //             "quantity_discount": entry.quantity_discount.length > 0 ? entry.quantity_discount[0].percentage : '0',
  //             "is_available": entry.is_discount_available,

  //           }
  //           this.SKUPartQty.push(Json);
  //         }
  //         this.SKUPartQty = [...this.SKUPartQty]
  //         for (let entry1 of FailedArrayteml) {
  //           var Json1 =
  //           {
  //             "display": entry1.part_number,
  //             // + '_' + data2[0].desc_text
  //             "Message": entry1.msg,
  //             "is_available": entry1.is_discount_available,

  //           }
  //           this.FailedArray.push(Json1);
  //         }
  //         this.FailedArray = [...this.FailedArray]
  //         this.excelService.exportCancellationAsExcelFile(this.FailedArray, 'FailedParts');
  //         console.log(this.SuccessArray)
  //         console.log(this.FailedArray)
  //       }
  //       else {
  //         this.loader.close();
  //         this.DocumentFile = "";
  //         this.myInputVariable.nativeElement.value = "";
  //         Swal.fire('Invalid Request. Please reupload using the assigned format only')
  //       }
  //     });
  //   }
  //   else {
  //     //  this.loader.close();
  //     Swal.fire('Error Occured , Please Try After Some Times')
  //   }
  // }

  // Copy Data
  ProductGrouptemp = [];
  Group = [];

  setdiscout_code: string;
  SetFormDiscountData(data: any = {}, content: any) {
    this.setdiscout_code = data.discount_code;
    this.datapass.setOption(this.setdiscout_code)

    var a = this.datapass.getOption()
    console.log(a);

    console.log(this.setdiscout_code);

    // if (this.setdiscout_code == "" || this.setdiscout_code == undefined || this.setdiscout_code == null) {
    //   this.btnSave = true;
    //   this.btnUpdate = false;

    //   this.buildItemForm("");
    // } else {
    //   console.log("====Copy===")
    //   this.btnSave = false;
    //   this.btnUpdate = true;
    // }

    this.open(content)

    // let ngbModalOptions: NgbModalOptions = {
    //   backdrop: true,
    //   keyboard: false
    // };
    // this.modalService.open(content, ngbModalOptions).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
    this.buildItemForm(data);
  }

  GetGroup(input) {
    this.CommonService.GetproductGroup(input).subscribe(
      data => {
        if (data.success == true) {
          // this.ProductGroupData = data.data;
          this.ProductGrouptemp = []
          for (let entry1 of data.data) {
            // debugger
            const ListInput: DataPreapre = {} as DataPreapre;
            ListInput.display = entry1;
            ListInput.value = entry1;
            this.ProductGrouptemp.push(ListInput);
          }
          this.Group = [];
          //this.ProductType = []
          this.Group = this.ProductGrouptemp;
          console.log(this.Group)
        }
        else {
          //this.loader.close()
        }
      }, (err) => {
        // this.loader.close()
      }
    );
  }


  ThisFilternameSKU: any;
  edititems: any;
  selectedSKUDisplay1 = [];

  SelectDiscountData(disc_code) {


    var jsonn = { discount_code: disc_code };
    this.CommonService.RuleDetailsListByDiscountcode(jsonn).subscribe(
      (data) => {
        if (data.success == true) {

          this.edititems = data.data.result;
          console.log(this.edititems)

          if (this.edititems.discount_type == "default_discount") {
            this.isDefault = true;
            this.isPartWise = false;
          }
          else if (this.edititems.discount_type == "quantity_discount") {
            this.isDefault = false;
            this.isPartWise = true
          }

          var percentage = this.edititems.percentage;
          this.itemForm.patchValue({ percentage: percentage })

          var customer_typedata = [];
          this.edititems.disount_detail.filter(function (item) {
            var i = customer_typedata.findIndex(
              (x) => x.customer_type == item.customer_type
            );
            if (i <= -1) {
              customer_typedata.push({ customer_type: item.customer_type });
            }
            return null;
          });
          for (let entry1 of customer_typedata) {
            if (entry1.customer_type == "ALL") {
              this.itemForm.patchValue({
                All: true,
              });
              this.onChange(true);
            } else if (entry1.customer_type == "FO") {
              this.itemForm.patchValue({
                Fleetowner: true,
              });
              // this.Fleetowner = true;
            } else if (entry1.customer_type == "GOV") {
              this.itemForm.patchValue({
                GovtCust: true,
              });
              //this.GovtCust = true;
            } else {
              this.itemForm.patchValue({
                Retiler: true,
              });
              // this.Retiler = true;
            }
          }

          var pg_linedata = [];
          this.edititems.disount_detail.filter(function (item) {
            var i = pg_linedata.findIndex((x) => x.pg_line == item.pg_line);
            if (i <= -1) {
              pg_linedata.push({ pg_line: item.pg_line });
            }
            return null;
          });


          if (pg_linedata[0].pg_line == "ALL" || pg_linedata[0].pg_line == "NA") {
            if (pg_linedata[0].pg_line == "ALL") {
              this.isPart = false;
              this.isPgLine = true;
            }
            if (pg_linedata[0].pg_line == "NA") {
              this.isPart = true;
              this.isPgLine = false;
            }
          } else {
            var productTypeDisplaydata = [];
            for (let entry1 of pg_linedata) {
              var json4 = { LINE_2_s: entry1.pg_line }
              this.productTypeDisplay.push(json4);
            
            }

           
            this.isPgLine = false;
            this.isPart = true;
            this.getProductTypeSelectedOptions(productTypeDisplaydata);
          }


          var sku_itemdata = [];
          this.edititems.disount_detail.filter(function (item) {
            var i = sku_itemdata.findIndex((x) => x.sku_item == item.sku_item);
            if (i <= -1) {
              sku_itemdata.push({ sku_item: item.sku_item });
            }
            return null;
          });

          if (sku_itemdata[0].sku_item == "ALL" || sku_itemdata[0].sku_item == "NA") {
            if (sku_itemdata[0].sku_item == "ALL") {
              this.isPart = true;
              this.isPgLine = false;
            }
            if (sku_itemdata[0].sku_item == "NA") {
              this.isPart = false;
              this.isPgLine = true;
            }
          } else {
            var SKUDisplaydata = [];
            var DisplayName = []

            for (let entry1 of sku_itemdata) {

              var jsonn = { "search_text": entry1.sku_item, "size": 100 }

              this.CommonService.GetSKU(jsonn).subscribe(
                data => {
                  if (data.success == true) {

                    debugger
                    var results = data.data.result

                    var json = { desc_text: results[0].part_number + '_' + results[0].desc_text, value: results[0].part_number }
                    this.selectedSKUDisplay.push(json);
                  }

                  else {
                    var json2 = { desc_text: entry1.sku_item, value: entry1.sku_item }
                    this.selectedSKUDisplay.push(json2);
                  }
                }, (err) => {
                }
              );
            }

            this.selectedSKUDisplay1 = SKUDisplaydata;
          }

          var divisiondata = [];
          this.edititems.disount_detail.filter(function (item) {
            var i = divisiondata.findIndex((x) => x.division == item.division);
            if (i <= -1) {
              divisiondata.push({ division: item.division_id, Name: item.division_name });
            }
            return null;
          });
          if (divisiondata[0].Name == "ALL" || divisiondata[0].Name == "NA") {
            if (divisiondata[0].Name == "ALL") {
              this.isDivisionSearch = true
              this.isDistributorSearch = false;
            }
            if (divisiondata[0].Name == "NA") {
              this.isDivisionSearch = false
              this.isDistributorSearch = true
            }
          } else {
            var DisplayDivisionData = [];
            for (let entry1 of divisiondata) {

              var json = { div_name: entry1.Name, value: entry1.division }
              this.selectedDisplayDivision.push(json);

            }

          
            this.selected = [];
            this.selectedState = [];
            this.selectedDistict = [];
            this.TempselectedDisplayDistributor = []
            
            this.selectedDisplayDistributor = []
            this.SelectedCustomer = []
            this.isDivisionSearch = true
            this.isDistributorSearch = false
         
            if (this.Role == "Distributor") {
              this.isDistributorSearch = false
             
            }

            
          }

          var CustomerData = [];
          this.edititems.disount_detail.filter(function (item) {
            var i = CustomerData.findIndex((x) => x.account_id == item.account_id);
            if (i <= -1) {
              CustomerData.push({ display: item.account_name, value: item.account_id });
            }
            return null;
          });

          if (CustomerData[0].value == "ALL") {
          } else {
            var DisplayDivisionData = [];

            for (let entry1 of CustomerData) {

              var TempData = this.SelectedCustomer.filter(book => book.value === entry1.value);

              if (TempData.length == 0) {
                var json1 = { display: entry1.display, value: entry1.value }
                this.SelectedCustomer.push(json1);
              }

            }
          }
          var organizationdata = [];
          this.edititems.disount_detail.filter(function (item) {

            var i = organizationdata.findIndex(
              (x) => x.organization == item.organization
            );
            if (i <= -1) {
              organizationdata.push({ organization: item.organization_id, Name: item.organization_name });

            }
            return null;
          });
          if (organizationdata[0].Name == "NA" || organizationdata[0].Name == "ALL") {
            if (organizationdata[0].Name == "ALL") {
              this.isDivisionSearch = false
              this.isDistributorSearch = true;
            }
            if (organizationdata[0].Name == "NA") {
              this.isDivisionSearch = true
              this.isDistributorSearch = false;
            }
          } else {
            var DisplayDistributor = [];
            for (let entry1 of organizationdata) {
              var json2 = { distributor_name: entry1.Name, value: entry1.organization }
              DisplayDistributor.push(json2);

            }
            this.selectedDisplayDistributor = DisplayDistributor;
          }
         
        }
        else {
       
          this.edititems = [];
        }
      },
      (err) => {
        this.edititems = [];
      }
    );

    console.log(this.selectedSKUDisplay)
    console.log(this.selectedSKUDisplay.length)
    console.log(this.productTypeDisplay)
    console.log(this.productTypeDisplay)
    console.log(this.selectedDisplayDivision)
  }

  TempproductTypeDisplay: any;
  ProductType = [];
  getProductTypeSelectedOptions(selected2) {

    this.ProductType = selected2;

    this.TempproductTypeDisplay = [];


    if (this.ProductType.length > 0) {

      if (this.isPart == true) {
        this.ProductType = [this.ProductType]
      }

      this.ItemSKU = [];
      this.TempproductTypeDisplay = this.ProductType;
      this.SKU = [];
      this.SKU = []
      // this.selectedSKU = []
      // this.productTypeDisplay=[];
      var jsonn = { "multi_pg_line": this.ProductType, "size": 10000 }
      this.getSKUItems(jsonn);

    }
  }

  
}

export class ListInput {
  offset: number
  owner: string
  discount_code: string
  from_date: string
  to_date: string
  min_percentage: string
  max_percentage: string
  size: number;
  created_by_name: string;
  discount_name: string
  is_active: string
  status: string;
}

export class InputofferDetail {
  discount_code: string
}

export class AprroveRejectJson {
  discount_code: string;
}

// CREATE SCHEME
export class CustDataPreapre {
  display: string
  value: string
  type: string
}

export class DataPreapre {
  display: string;
  value: string;
}

export class DataInsert {
  customer_type: string
  pg_line: string
  sku_item: string
  division: string
  organization_id: string
  account_id: string;
  quantity: string
}

export class FinalDataFor {
  discount_name: string
  percentage: number
  from_date: string
  to_date: string
  discount_details: any
  discount_type: any;
}

export class InputData1 {
  distributor_id: string
  div_search_text: string
}

export class InputDataLine {
  multi_pg_line: string
}

export class InputData {
  size: number
  org_search_text: string;
}

export class InputDataDivision {
  size: number
  div_search_text: string;
  multi_zone: string
} export class InputData2 {





  size: number;
  district: any;
  district_name: any;
  state_code: any;
  state_name: any;


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
