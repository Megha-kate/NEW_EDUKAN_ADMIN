import { DatePipe } from '@angular/common';
import { Component, ElementRef, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { AppConfirmService } from 'src/app/shared/Services/app-confirm.service';
import { ExcelServiceService } from 'src/app/shared/Services/excel-service.service';
//import { FileUploadService } from 'src/app/shared/Services/file-upload.service';
import { FileUploadService } from './../../../../app/shared/Services/file-upload.service';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import Swal from 'sweetalert2';
import { CommonService } from '../../../shared/Services/common-service.service';
import { HttpClient } from '@angular/common/http';
import * as _ from 'lodash';
import * as XLSX from 'xlsx';
//import * as FileSaver from 'file-saver';
import * as FileSaver from 'file-saver'



@Component({
  selector: 'app-part-master',
  templateUrl: './part-master.component.html',
  styleUrls: ['./part-master.component.scss']
})
export class PartMasterComponent implements OnInit {
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @ViewChild('UploadFileInput', { static: false }) uploadFileInput: ElementRef;
  @ViewChild('ExcelDownload', { read: TemplateRef, static: false }) ExcelDownload: TemplateRef<any>;
  @ViewChild('reportDownloadTemplate', { read: TemplateRef, static: false }) reportDownloadTemplate: TemplateRef<any>;

  @Output() closemodal = new EventEmitter<any>();



  public AllFilters = new FormGroup({});
  SelectCategoryList = new FormGroup({});
  public itemForm = new FormGroup({});



  items: any[];
  totalrecord: number;
  toastrService: any;
  currentPage: any;
  noofrecordsperpage: number;
  from_date: any;
  to_date: any;
  ShowCustom: boolean;
  iscustomDate: boolean;
  isThirtyDays: boolean;
  isToday: boolean;
  isLastsevenDay: boolean;
  date: Date;
  //myDrop: any;
  part_number: any;
  discount_code_cvbu: any;
  distributor_category: any;
  large_description: any;
  minquantity: any;
  isassamrifile: any;
  pg: any;
  isecom: string;
  isactiveforecom: any;
  part_num: any;
  desc_text: any;
  Filterarray: any;
  FromDate: string;
  ToDate: string;
  myInputVariable: any;
  fileInputLabel: any;
  fileUploadForm: any;
  // fileUploaded: any;
  storeData: any;
  worksheet: XLSX.WorkSheet;
  fileUploaded: File
  Data: any;
  searchList: any;
  nativeElement: any;
  //ExcelDownload: any;

  //searchList: any;
  //worksheet: any;
  showRecords: any;
  group_category: any;
  nls_status: any;
  order_flag_status: any;
  pg_line: any;
  DataPrepareArray: any[];
  Line: string;
  Part_Number: any;
  advantages: any;
  other_instruction: any;
  tmgo_qty: any;
  is_home_page: any;
  From_date: string;
  To_date: string;


  constructor(
    private http: HttpClient,

    private OrderListService: OrderserviceService,
    private loader: AppLoaderService,
    private datepipe: DatePipe,
    private CommonService: CommonService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private FileUpService: FileUploadService,
    private excelService: ExcelServiceService,
    private confirmService: AppConfirmService,
   // private modalService: NgbModal,
  ) { }



  ngOnInit(): void {


    this.date = new Date();
    this.currentPage = 1;
    this.noofrecordsperpage = 10;
    this.searchList = [];
    this.showRecords = 10;
    this.From_date = localStorage.getItem("FromDate");
    this.To_date = localStorage.getItem("ToDate");

    

   this.GetsetCategory();
    this.GetGroup();
    this.GetLine();

    this.ProductCategory();


    this.buildItemForm('');
    const ListInput: ListInput1 = {} as ListInput1;
  // ListInput.from_date = localStorage.getItem("FromDate");
    //ListInput.to_date = localStorage.getItem("ToDate");
   // ListInput.from_date = this.from_date
    //ListInput.to_date = this.to_date
   ListInput.from_date = this.from_date
   ListInput.to_date = this.to_date
    ListInput.offset = 0;
    ListInput.size = 10;
   
    this.partmaster(ListInput)
    this.BuildForm();

  }

  closeModal() {
    this.modalService.dismissAll();
  }
  BuildForm() {
    this.AllFilters = this.fb.group({
      from_date: [''],
      to_date: [''],
      part_number:[],
      discount_code_cvbu: [''],
      isecom: [''],
      minquantity: [''],
      distributor_category: [''],
      pg: [''],
      desc_text: [''],
      isassamrifile: [''],
      isactiveforecom: [''],
      nls_status:[''],
      order_flag_status:[''],
      Line:[''],
      pg_line:[],
      group_category:['']

    });



  }
  CategoryMaster: any = []
  GetsetCategory() {
    var json = {
      "category_dropdown": true
    }

   // console.log(this.CategoryMaster, "divs")

    this.CommonService.GetsetCategory(json).subscribe(
      data => {
        if (data.success == true) {

          this.CategoryMaster = [];


          this.CategoryMaster = data.data

           
          // this.SelectCategoryList = new FormGroup({})
          // for (let formModule of this.CategoryMaster) {
          //   this.SelectCategoryList.addControl(formModule.distributor_category, new FormControl(false))
          // }
        }
        else {

          this.loader.close();

        }
      }, (err) => {
        // this.loader.close();

      }
    );
  }

  ProductGroup: any = []
  GetGroup() {

    var json = {
      "pg_dropdown": true
    }

    this.CommonService.GetsetCategory(json).subscribe(

      data => {


        if (data.success == true) {
          this.ProductGroup = [];

          this.loader.close()

          this.ProductGroup = data.data


        }


        else {

        }
      }, (err) => {

      }

    );




  }

  GetPgLine: any[];

  GetLine() {

    var json = {
    "pg_line_dropdown": true }

    this.CommonService.BindCategoryDistributor(json).subscribe(

      data => {
        this.GetPgLine= []

        if (data.success == true) {

          this.GetPgLine = data.data;


        }


        else {

        }
      }, (err) => {

      }

    );




  }

  ProductGroupCategory :  any[];
  ProductCategory() {

    var json = {
    "group_category_dropdown": true }

    this.CommonService.BindProductCategory(json).subscribe(

      data => {

        if (data.success == true) {

          this.ProductGroupCategory = data.data;


        }


        else {

        }
      }, (err) => {

      }

    );




  }

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
  page: any
  pageChange(page: any) {
    debugger;
    document.body.scrollTop = 0;
    this.currentPage = page;
      page = page - 1;
    const ListInput: ListInput1 = {} as ListInput1;
    
   
  

   if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }



    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
    if (this.pg) { ListInput.pg = this.pg; } else { ListInput.pg = ""; }
    if (this.distributor_category) { ListInput.distributor_category = this.distributor_category; } else { ListInput.distributor_category = ""; }
    if (this.discount_code_cvbu) { ListInput.discount_code_cvbu = this.discount_code_cvbu; } else { ListInput.discount_code_cvbu = ""; }
    if (this.desc_text) { ListInput.desc_text = this.desc_text; } else { ListInput.desc_text = ""; }
    if (this.isactiveforecom) { ListInput.isactiveforecom = this.isactiveforecom; } else { ListInput.isactiveforecom = ""; }
    if (this.minquantity) { ListInput.minquantity = this.minquantity; } else { ListInput.minquantity = ""; }
    if (this.large_description) { ListInput.large_description = this.large_description; } else { ListInput.large_description = ""; }
    if (this.isassamrifile) { ListInput.isassamrifile = this.isassamrifile; } else { ListInput.isassamrifile = ""; }
    if (this.isecom) { ListInput.isecom = this.isecom; } else { ListInput.isecom = ""; }
    if (this.group_category) { ListInput.group_category = this.group_category; } else { ListInput.group_category = ""; }


    if (this.nls_status) { ListInput.nls_status = this.nls_status; } else { ListInput.nls_status = ""; }
    if (this.order_flag_status) { ListInput.order_flag_status = this.order_flag_status; } else { ListInput.order_flag_status = ""; }
    if (this.pg_line) { ListInput.pg_line = this.pg_line; } else { ListInput.pg_line = ""; }


  
    ListInput.offset = (page * 10);
    ListInput.size = (page * 10) + 10;
  
   this.partmaster(ListInput);



  }
 // items: any
  isdiableeporrt: any
  partmaster(ListInput) {
    debugger
    this.totalrecord= 0

    this.FilterStrings(ListInput);



    //this.loader.open();

    this.OrderListService.partmaster(ListInput).subscribe(

      data => {


        this.loader.close();
        if (data.success == true) {
          debugger
          this.totalrecord = data.rangeInfo.total_row;
          this.items = []
          this.items = data.data;
          this.showRecords = data.data.length

         





        }



        else {
          this.items = []
          this.loader.close();
        }
      }, (err) => {
        this.loader.close();

      }

    );




  }


  SearchAccount($event) {
    if ($event.key === "Enter") {
      const ListInput: ListInput1 = {} as ListInput1;
     // ListInput.from_date = localStorage.getItem("FromDate");
      //ListInput.to_date = localStorage.getItem("ToDate");
      ListInput.part_number = $event.target.value
      this.partmaster(ListInput);
    }
  }

  showAccount($event) {
   
      const ListInput: ListInput1 = {} as ListInput1;
     // ListInput.from_date = localStorage.getItem("FromDate");
     // ListInput.to_date = localStorage.getItem("ToDate");
      ListInput.part_number = $event.target.value
      this.partmaster(ListInput);
    
  }
  SearchAllDate() {
    debugger
    let fromDate = localStorage.getItem("FromDate");
    let todate = localStorage.getItem("ToDate");
     
    if (this.iscustomDate == true) {

      let customfromdate = this.AllFilters.value.from_date;
      let customtodate = this.AllFilters.value.to_date
     
      // this.from_date = moment(this.from_date).subtract(1, 'months').format('"yyyy-mm-dd')
      // this.to_date = moment(this.to_date).subtract(1, 'months').format('"yyyy-mm-dd')
      this.from_date = this.onDateSelect(customfromdate)
      this.to_date = this.onDateSelect(customtodate)

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
    const ListInput: ListInput = {} as ListInput;
    
    this.part_number = this.AllFilters.value.part_number;
    this.discount_code_cvbu = this.AllFilters.value.discount_code_cvbu;
    this.distributor_category = this.AllFilters.value.distributor_category;
    this.large_description = this.AllFilters.value.large_description;
    this.minquantity = this.AllFilters.value.minquantity;
    this.isassamrifile = this.AllFilters.value.isassamrifile;
    this.pg = this.AllFilters.value.pg;
    this.isecom = this.AllFilters.value.isecom;
    this.isassamrifile = this.AllFilters.value.isassamrifile;
    this.isactiveforecom = this.AllFilters.value.isactiveforecom;
    this.desc_text = this.AllFilters.value.desc_text
    this.group_category=this.AllFilters.value.group_category
    this.nls_status=this.AllFilters.value.nls_status
    this.order_flag_status=this.AllFilters.value.order_flag_status
    this.pg_line=this.AllFilters.value.pg_line







    if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }
  
    if (this.part_number) { ListInput.part_number = this.part_number; } else { ListInput.part_number = ""; }
    
    if (this.pg) { ListInput.pg = this.pg; } else { ListInput.pg = ""; }
    if (this.distributor_category) { ListInput.distributor_category = this.distributor_category; } else { ListInput.distributor_category = ""; }
    if (this.discount_code_cvbu) { ListInput.discount_code_cvbu = this.discount_code_cvbu; } else { ListInput.discount_code_cvbu = ""; }
    if (this.desc_text) { ListInput.desc_text = this.desc_text; } else { ListInput.desc_text = ""; }
    if (this.isactiveforecom) { ListInput.isactiveforecom = this.isactiveforecom; } else { ListInput.isactiveforecom = ""; }
    if (this.minquantity) { ListInput.minquantity = this.minquantity; } else { ListInput.minquantity = ""; }
    if (this.large_description) { ListInput.large_description = this.large_description; } else { ListInput.large_description = ""; }
    if (this.isassamrifile) { ListInput.isassamrifile = this.isassamrifile; } else { ListInput.isassamrifile = ""; }
    if (this.isecom) { ListInput.isecom = this.isecom; } else { ListInput.isecom = ""; }
    if (this.group_category) { ListInput.group_category = this.group_category; } else { ListInput.group_category = ""; }


    if (this.nls_status) { ListInput.nls_status = this.nls_status; } else { ListInput.nls_status = ""; }
    if (this.order_flag_status) { ListInput.order_flag_status = this.order_flag_status; } else { ListInput.order_flag_status = ""; }
    if (this.pg_line) { ListInput.pg_line = this.pg_line; } else { ListInput.pg_line = ""; }

    

    this.partmaster(ListInput);

   this.myDrop.close();

  }

  onDateSelect(event) {
    let year = event.year;
    let month = event.month <= 9 ? '0' + event.month : event.month;
    let day = event.day <= 9 ? '0' + event.day : event.day;
    let finalDate = year + "-" + month + "-" + day;
    return finalDate
   }
  calculateDate1(Date1, date2) {
    Date1 = new Date(Date1);
    date2 = new Date(date2);
    var diffc = Date1.getTime() - date2.getTime();

    var days = Math.round(Math.abs(diffc / (1000 * 60 * 60 * 24)));

    return days;
  }

  dayscalculate() {
    var days = this.calculateDate1(this.from_date, this.to_date);
  }
  resetALl() {
    this.Filterarray = [];
    this.AllFilters.reset();
   
    this.from_date = "";
    this.to_date = "";
   
    this.part_number = "";
    this.discount_code_cvbu = "";
    this.large_description = "";
    this.distributor_category = "";
    this.minquantity = "";
    this.pg = ""
    this.large_description = ""
    this.isassamrifile = ""
    this.isactiveforecom = ""
    this.nls_status = ""

    this.order_flag_status = ""

    this.Line = ""
    this.pg_line = ""

    this.group_category = ""

   this.partmaster('')

    
    this.myDrop.close();

  }
 
  FilterStrings(ListInput) {
    this.Filterarray = [];
   // console.log(ListInput, "filterarrayvalue")
    for (let item in ListInput) {

      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
      
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    var from_date1 = ListInput.from_date;
    var to_date1 = ListInput.to_date;
    if(from_date1!=null ){
    var finaldate = this.dateformate(from_date1) + ' ' + 'to' + ' ' + this.dateformate(to_date1);
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'from_date');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'to_date');
   // this.Filterarray = this.Filterarray.filter(book => book.Key !== 'action_type');
    

    var Json1 = { "Key": 'from_date', "Value": finaldate }
    
    this.Filterarray.push(Json1)
  }
}

dateformate(date) {
  return this.datepipe.transform(date, 'dd/MM/yyyy');
}


  onRemoveFilter(filterString) {
    let Filterarrays = this.Filterarray;

    if (filterString.Key == "part_number") {
      this.part_number = "";
      this.AllFilters.get("part_number").setValue("")
    }
    else if (filterString.Key == "discount_code_cvbu") {
      this.discount_code_cvbu = ""
      this.AllFilters.get("discount_code_cvbu").setValue("")
    }
    else if (filterString.Key == "distributor_category") {
      this.distributor_category = ""
      this.AllFilters.get("distributor_category").setValue("")
    }
    else if (filterString.Key == "large_description") {
      this.large_description = ""
      this.AllFilters.get("large_description").setValue("")
    }
   
    else if (filterString.Key == "minquantity") {
      this.minquantity = ""
      this.AllFilters.get("minquantity").setValue("")
    }
    else if (filterString.Key == "pg") {
      this.pg = ""
      this.AllFilters.get("pg").setValue("")
    }
    else if (filterString.Key == "isactiveforecom") {
      this.isactiveforecom = ""
      this.AllFilters.get("isactiveforecom").setValue("")
    }
    else if (filterString.Key == "isassamrifile") {
      this.isassamrifile = ""
      this.AllFilters.get("isassamrifile").setValue("")
    }
    else if (filterString.Key == "isecom") {
      this.isecom = ""
      this.AllFilters.get("isecom").setValue("")
    }
    else if (filterString.Key == "group_category") {
      this.isecom = ""
      this.AllFilters.get("group_category").setValue("")
    }
    else if (filterString.Key == "nls_status") {
      this.isecom = ""
      this.AllFilters.get("nls_status").setValue("")
    }
    else if (filterString.Key == "order_flag_status") {
      this.isecom = ""
      this.AllFilters.get("order_flag_status").setValue("")
    }
    else if (filterString.Key == "pg_line") {
      this.isecom = ""
      this.AllFilters.get("pg_line").setValue("")
    }
    // else if (filterString.Key == "from_date") {
    //   this.from_date = ""
    //   this.AllFilters.get("from_date").setValue("")
    // }
    //order_flag_status
    //pg_line
    this.SearchAllDate();
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
  buildItemForm(row: any) {
    debugger;
    this.itemForm = this.fb.group({
      myfile: ['']

      




    })


  }


  ishome = ['Yes', 'No']
  category = ['MHV', 'COM', 'D', 'MHVA', 'NULL', 'RCO', 'RMH', 'RSL', 'SCV', 'SLV', 'SLVA']

  DocumentFile: any;
  arrayBuffer: any;
  filelist: any;
  file: File;
  details = [];
  totalCount: number;
  test = [];
  arrayslice = [];
  fileSize: any;
  RoundOf = 0;

  count = 0

  fail = [];

  FailedArray = []

  errorMessage = [];

  validateHomeInput(home, category) {

    // for (var i = 0; i < this.ishome.length; i++) {
    // for (let entry of this.ishome) {
    // var homevalue = this.ishome[i];
    if (home == 'Yes' || home == 'No') {
      // this.errorMessage.push({errorKey:"Home", errorMessage:"home value should be Yes or No"})
      // break;
    }
    else {
      this.errorMessage.push({ errorKey: "Home", errorMessage: "home value should be Yes or No" })
    }

    if (category == 'D' || category == 'MHV' || category == 'COM' || category == 'MHVA' || category == 'NULL' || category == 'RCO' || category == 'RSL' || category == 'SCV' || category == 'SLV' || category == 'SLVA') {

    }
    else {
      this.errorMessage.push({ errorKey: "category", errorMessage: "category value should be Proper" })
    }
    // // }
    if (this.errorMessage.length > 0) {
      return false
    }
    else {
      return true
    }
  }

  validateCategoryInput(Category) {
    var status = false
    // for (var i = 0; i < this.category.length; i++) {
    //   if (this.category[i] == Category) {
    //     // this.errorMessage.push({errorKey:"category", errorMessage:"category value should be Yes or No"})
    //     status = true
    //     break
    //   }
    // }
    return status
  }

  // SelectDocumentFiles(event) {
  //  debugger
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
  //                   var distributorcategory = "";
  //                   var groupcategoryFromSAP = "";
  //                   var large_description = "";
  //                   var advantages = "";
  //                   var other_instruction = "";
  //                   var defaultQuantity = "";
  //                   var ishomepage = "";
  //                   var homePage = "";

  //                   partNo = arraylist[j]["Part Number"]
  //                   ishomepage = arraylist[j]["Is Home Page"]
  //                   distributorcategory = arraylist[j]["distributor_category"]
  //                   groupcategoryFromSAP = arraylist[j]["group_category -From SAP"]
  //                   large_description = arraylist[j]["large_description"]
  //                   advantages = arraylist[j]["advantages"]
  //                   other_instruction = arraylist[j]["other_instruction"]
  //                   defaultQuantity = arraylist[j]["column_4 (Defualt Qty for TMGO)"]

  //                   var validateHome = this.validateHomeInput(ishomepage, distributorcategory)
  //                   var validateCategory = this.validateCategoryInput(distributorcategory)

  //                   if (validateHome == false) {
  //                     for (let entry of this.errorMessage) {
  //                       Swal.fire(entry.errorMessage)
  //                     }
  //                   }
  //                   else if (validateHome == true) {
  //                     homePage = ((ishomepage == 'Yes') ? 'active' : (ishomepage == 'No') ? 'deactive' : ' ')
  //                     this.details.push(
  //                       {
  //                         Part_Number: partNo,
  //                         Is_Home_Page: homePage,
  //                         distributor_category: distributorcategory,
  //                         group_category: groupcategoryFromSAP,
  //                         large_description: large_description,
  //                         advantages: advantages,
  //                         other_instruction: other_instruction,
  //                         tmgo_qty: defaultQuantity,
  //                       }
  //                     );
  //                   }

                    
  //                 }

  //                 var len = this.details.length

  //                 var size = 10

  //                 this.fileSize = (Math.ceil(this.details.length / size))

  //                 // WORKING LOGIC
  //                 if (this.errorMessage.length == 0) {
  //                   for (var k = 0; k < this.fileSize; k++) {
  //                     this.RoundOf = 0;
  //                     this.RoundOf = k + 1;
  //                     this.arrayslice = this.details.slice(k * 10, size)

  //                     for (var l = 0; l < this.arrayslice.length; l++) {
  //                       var row = []
  //                       row = this.arrayslice[l]
  //                       this.temp.push(
  //                         row
  //                       )

  //                     }

  //                     var json1 = { "data": this.temp }

  //                     this.UploadFile(json1, k, this.fileSize)
  //                     this.CommonService.bulkPartUpdate(json1).subscribe(
  //                       data => {

  //                         if (data.success == true) {

  //                           debugger
  //                           if (data.records_not_inserted != null) {
  //                             var FailedArrayteml = data.records_not_inserted
  //                             for (let entry1 of FailedArrayteml) {

  //                               var Json2 =
  //                               {
  //                                 "PartNumber": entry1.part_number,
  //                                 "Reason": entry1.reason
  //                               }

  //                               // this.datapass(Json2);

  //                               this.FailedArray.push(Json2);
  //                             }
  //                             console.log(this.FailedArray)
  //                           }

  //                           if (k == this.fileSize ) {
  //                             this.excelService.exportCancellationAsExcelFile(this.FailedArray, 'FailedParts');
  //                           }
  //                         }
  //                         else {
  //                           Swal.fire('Please try Again')
  //                         }
  //                       }, (err) => {
  //                         Swal.fire('Please try Again')
  //                       }
  //                     );
  //                     this.temp = [];
  //                     // arrayslice=[];
  //                     size = size + 10;
                    


  //                   }

                   
  //                 }



  //               }
  //             }

  //             else {
  //               Swal.fire('Oops...', 'Upload only 5 MB size files!')
  //             }
  //           }
  //           else {
  //             // this.myInputVariable.nativeElement.value = '';
  //             Swal.fire('Upload only Xlsx Files');

  //           }

  //         }

  //       }
  //     })
  // }

  request = []
  temp = []

  UploadFile(json, k, size) {
    debugger

    this.CommonService.bulkPartUpdate(json).subscribe(
      data => {
      debugger
        if (data.success == true) {

          if (data.records_not_inserted != null) {
            var FailedArrayteml = data.records_not_inserted
            for (let entry1 of FailedArrayteml) {

              var Json2 =
              {
                "PartNumber": entry1.part_number,
                "Reason": entry1.reason
              }

              // this.datapass(Json2);

              this.FailedArray.push(Json2);
              // this.fail.push(Json2)
            }
            //console.log(this.FailedArray)
          }

          if (k == size - 1) {

            debugger
            console.log(this.FailedArray)
            this.excelService.exportCancellationAsExcelFile(this.FailedArray, 'FailedParts');
            this.FailedArray = [];
            this.temp = [];
          }
        }
        else {
          Swal.fire('Please try Again')
        }
      }, (err) => {
        Swal.fire('Please try Again')
      }
    );

  }



  fileUploads(event) {
    debugger
    console.log("file upload called")
    
 
    var msg = 'Are You Sure to upload ' + event.target.files[0].name + '?'

    this.confirmService.confirm({ message: msg })
      .subscribe(res => {
        if (res) {
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
                  var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
                  for (var j = 0; j < arraylist.length; j++) {
                    var partNo = "";
                    var distributorcategory = "";
                    var groupcategoryFromSAP = "";
                    var large_description = "";
                    var advantages = "";
                    var other_instruction = "";
                    var defaultQuantity = "";
                    var ishomepage = "";
                    var homePage = "";

                    partNo = arraylist[j]["part_number"]
                    ishomepage = arraylist[j]["is_home_page"]
                    distributorcategory = arraylist[j]["distributor_category"]
                    groupcategoryFromSAP = arraylist[j]["group_category"]
                    large_description = arraylist[j]["large_description"]
                    advantages = arraylist[j]["advantages"]
                    other_instruction = arraylist[j]["other_instruction"]
                    defaultQuantity = arraylist[j]["tmgo_qty"]

                    var validateHome = this.validateHomeInput(ishomepage, distributorcategory)

                    if (validateHome == false) {
                      for (let entry of this.errorMessage) {
                        Swal.fire(entry.errorMessage)
                      }
                 
                    }
                    else if (validateHome == true) {
                      homePage = ((ishomepage == 'Yes') ? 'true' : (ishomepage == 'No') ? 'false' : ' ')
                      this.details.push(
                        {
                          part_number: partNo.toString(),
                          is_home_page: homePage,
                          distributor_category: distributorcategory,
                          group_category: groupcategoryFromSAP,
                          large_description: large_description,
                          advantages: advantages,
                          other_instruction: other_instruction,
                          tmgo_qty: defaultQuantity,
                        }
                      );
                    }


                  }


                  



                }
              }

              else {
                Swal.fire('Oops...', 'Upload only 5 MB size files!')
              }
            }
            else {
            
              Swal.fire('Upload only Xlsx Files');

            }

          }

        }
      })

  }

  EDownload: any;
  //count: any;
  pageName: any;

  ExportDownload() {
    debugger;

    // if (event.target.value == " ") {
    //   Swal.fire('Please select download type')
    // }
    // else if (event.target.value == "Excel") {
      //const exportList: ListInput = {} as ListInput;
      const ListInput: ListInput = {} as ListInput;

      if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }



      if (this.part_num) { ListInput.part_num = this.part_num; } else { ListInput.part_num = ""; }
      if (this.pg) { ListInput.pg = this.pg; } else { ListInput.pg = ""; }
      if (this.distributor_category) { ListInput.distributor_category = this.distributor_category; } else { ListInput.distributor_category = ""; }
      if (this.discount_code_cvbu) { ListInput.discount_code_cvbu = this.discount_code_cvbu; } else { ListInput.discount_code_cvbu = ""; }
      if (this.desc_text) { ListInput.desc_text = this.desc_text; } else { ListInput.desc_text = ""; }
      if (this.isactiveforecom) { ListInput.isactiveforecom = this.isactiveforecom; } else { ListInput.isactiveforecom = ""; }
      if (this.minquantity) { ListInput.minquantity = this.minquantity; } else { ListInput.minquantity = ""; }
      if (this.large_description) { ListInput.large_description = this.large_description; } else { ListInput.large_description = ""; }
      if (this.isassamrifile) { ListInput.isassamrifile = this.isassamrifile; } else { ListInput.isassamrifile = ""; }
      if (this.isecom) { ListInput.isecom = this.isecom; } else { ListInput.isecom = ""; }

      this.EDownload = ListInput;
      console.log(ListInput)
      //console.log(this.to_date,this.from_date,this.state_code,this.district,this.division_category,this.division_id,this.division_name)
      //console.log(this.EDownload, "EDownloadllll")
      this.count = this.totalrecord;
      this.pageName = "PartMaster";
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

   
    reportDownloadTemplate1() {
      debugger;
      this.isdiableeporrt = false;
      
        const ListInput: ListInput = {} as ListInput;
  
  
  
        if (this.Part_Number) { ListInput.Part_Number = this.Part_Number; } else { ListInput.Part_Number = ""; }
        if (this.distributor_category) { ListInput.distributor_category = this.distributor_category; } else { ListInput.distributor_category = ""; }
        if (this.group_category) { ListInput.group_category = this.group_category; } else { ListInput.group_category = ""; }
        if (this.large_description) { ListInput.large_description = this.large_description; } else { ListInput.large_description = ""; }
        if (this.advantages) { ListInput.advantages = this.advantages; } else { ListInput.advantages = ""; }
        if (this.other_instruction) { ListInput.other_instruction = this.other_instruction; } else { ListInput.other_instruction = ""; }
        if (this.large_description) { ListInput.large_description = this.large_description; } else { ListInput.large_description = ""; }
        if (this.tmgo_qty) { ListInput.tmgo_qty = this.tmgo_qty; } else { ListInput.tmgo_qty = ""; }
        if (this.is_home_page) { ListInput.is_home_page = this.is_home_page; } else { ListInput.is_home_page = ""; }
       
        this.EDownload = ListInput;
        console.log(ListInput)
       
        this.count = this.totalrecord;
        this.pageName = "PartMaster";
        let ngbModalOptions: NgbModalOptions = {
          backdrop: true,
          keyboard: true
        };
        this.modalService.open(this.reportDownloadTemplate, ngbModalOptions).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason: any) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
 
    
  }





  export class Input {
    offset: number
    size: number
    part_number: string
    isecom: string
    isassamrifile: string
    large_description: string
    minquantity: string
    isactiveforecom: string
    desc_text: string
    discount_code_cvbu: string
    distributor_category: string
    pg: string
    from_date: string
    to_date: string
    group_category: string
  
  
    nls_status  : string
    order_flag_status: string
    pg_line: string
  }
export interface FinalDataTemplate {
  part_number: String
  distributor_category: String
  group_category: String
  large_description: String
  advantages: String

  other_instruction: String
  tmgo_qty: String
  is_home_page: String
}
export class ListInput1 {
  offset: number;
  size: number;
  from_date: string;
  to_date: string;
  part_number: string;
  discount_code_cvbu: string;
  isecom: string;
  isactiveforecom: string;
  distributor_category: any;
  large_description: string;
  minquantity: any;
  isassamrifile: any;
  pg: any;
  group_category: any;
  nls_status: any;
  order_flag_status: any;
  pg_line: string;
  desc_text: any;

}
export class ListInput {
  offset: number;
  advantages:string
  size: number;
  from_date: string;
  to_date: string;
  part_number: string;
  discount_code_cvbu: string;
  isecom: string;
  isactiveforecom: string;
  distributor_category: any;
  large_description: string;
  minquantity: any;
  isassamrifile: any;
  pg: any;
  part_num: any;
  desc_text: any;
  //to_date: any;
  group_category: any;
  nls_status: any;
  order_flag_status: any;
  pg_line: any;
  Part_Number: any;
  other_instruction: string;
  tmgo_qty: string;
  is_home_page: string;

}
export interface FinalData {

  Part_Number: String;
  distributor_category: String;
  group_category: string;
  large_description: string;
  advantages: string;
  other_instruction: string;
  Is_Home_Page: string;
  tmgo_qty: string;
}

// export class InputData1 {




//   size: number;
//   distributor_category: string;


// }