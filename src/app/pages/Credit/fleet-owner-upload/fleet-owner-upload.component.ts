import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { FileUploadService } from '../../../shared/Services/file-upload.service';
import { CreditServiceService } from '../../../shared/Services/credit-service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewEncapsulation } from '@angular/core';
import { AppConfirmService } from '../../../shared/Services/app-confirm.service';
import { AppLoaderService } from '../../../shared/component/app-loader/app-loader.service';
// import { Page } from '../../../../src/app/shared/models/PaginationPage'
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ExcelServiceService } from '../../../shared/Services/excel-service.service';

@Component({
  selector: 'app-fleet-owner-upload',
  templateUrl: './fleet-owner-upload.component.html',
  styleUrls: ['./fleet-owner-upload.component.scss']
})
export class FleetOwnerUploadComponent implements OnInit {

  // page = new Page();
  DocumentFile: any;
  public itemsFleetOwner: any[];
  temp = [];
  public itemForm: FormGroup;
  selectedIndexL: number;
  @ViewChild('inputFile', { static: false }) myInputVariable: ElementRef;
  public ServiceData: Subscription;
  isActiveTab: any = 'upload';
  currentPage: number;
  noofrecordsperpage: number;
  totalrecord: any;
  currDiv: string;
  showRecords: any;
  constructor(private router: Router, private FileUpService: FileUploadService, private Service: CreditServiceService, private loader: AppLoaderService,
    private confirmService: AppConfirmService, private excelService: ExcelServiceService,
    private fb: FormBuilder,
  ) {
    // this.page.pageNumber = 0;
    // this.page.size = 10;
    // this.page.totalElements = 0;
  }


  ngOnInit() {
    this.currDiv = "retailer";
    this.currDiv = "fleet-owner";
    this.showRecords=10;

    this.selectedIndexL = 0;
    this.Type = 'RT'
    this.currentPage = 1

    this.noofrecordsperpage = 10;

    const ListInput: Input = {} as Input;
    ListInput.offset = 0

    ListInput.account_type = this.Type
    this.getList(ListInput);
    this.buildItemform();
    //this.UploadCSV();
   // this.Upload();

  }
  buildItemform() {
    this.itemForm = this.fb.group({
      Usertype: ['RT' || '',]


    })
  }

  


  Type: any
  Change(value) {
    this.Type = value


    const ListInput: Input = {} as Input;
    ListInput.offset = 0
    ListInput.account_type = this.Type
    this.getList(ListInput);


  }

  tab: any = 1;
  onClick1(check) {
    this.tab = check
    this.currentPage = 1
    // this.isThirtyDays = false;
    // this.isToday = false;
    // this.iscustomDate = false;
    // this.isLastsevenDay = false;
    // this.ShowCustom = false;
    //this.Filterarray = [];
    if (this.tab == 1) {
    
      this.currDiv = "retailer"

      const ListInput: InputData1 = {} as InputData1;

      ListInput.account_name = "";
      ListInput.account_type = "RT";
      ListInput.customer_segment = "";
      ListInput.offset = 0;
      ListInput.from_date = "";
      ListInput.to_date = "";
      ListInput.account_id = "";
      ListInput.distributor_code = "";
      // ListInput.size = 10;
      
      this.getList(ListInput);
    }

    if (this.tab == 2) {
    
      this.currDiv = "fleet-owner"

      const ListInput: InputData1 = {} as InputData1;

      ListInput.account_name = "";
      ListInput.account_type = "FO";
      ListInput.customer_segment = "";
      ListInput.offset = 0;
      ListInput.from_date = "";
      ListInput.to_date = "";
      ListInput.account_id = "";
      ListInput.distributor_code = "";
      // ListInput.size = 10;
    
      this.getList(ListInput);
    }
  }


  setPage(pageInfo) {


    debugger

    const ListInput: Input = {} as Input;
    ListInput.offset = pageInfo.offset
    ListInput.account_type = this.Type
    this.getList(ListInput);



  }
  updateFilter(event) {
    const val = event.target.value.toLowerCase();
    var columns = Object.keys(this.temp[0]);
    columns.splice(columns.length - 1);


    if (!columns.length)
      return;

    const rows = this.temp.filter(function (d) {
      for (let i = 0; i <= columns.length; i++) {
        let column = columns[i];

        if (d[column] && d[column].toString().toLowerCase().indexOf(val) > -1) {
          return true;
        }
      }
    });

    this.itemsFleetOwner = rows;
  }

  onClick() {
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;

    fileUpload.click();
  }
 




  getList(ListImput) {
    this.itemsFleetOwner = this.temp = []
    this.itemsFleetOwner = [];

    debugger;



    this.Service.FleetOwnerList(ListImput).subscribe(

      data => {
        debugger
        if (data.success == true) {
          // this.page.totalElements = data.rangeInfo.total_row;
          this.itemsFleetOwner = this.temp = data.data;
          this.totalrecord = data.rangeInfo.total_row;
          this.showRecords=data.data.length
        }
        else {
          // this.page.totalElements
          this.itemsFleetOwner = this.temp = []
          this.loader.close();
        }
      }, (err) => {
        // this.page.totalElements
        this.loader.close();
        this.itemsFleetOwner = this.temp = []
      }

    );
  }

  SelectDocumentFiles(event) {

  debugger;
   console.log(event ,"ebnt")
   

    var msg = 'Are You Sure to upload ' + event.target.files[0].name 

    this.confirmService.confirm({ message: msg })
      .subscribe(res => {
        if (res) {

          if (event.target.files && event.target.files[0]) {
            var Extension = event.target.files[0].name.substring(
              event.target.files[0].name.lastIndexOf('.') + 1).toLowerCase();
             //alert(Extension);
            // if (Extension == "csv") {
            debugger
            if (Extension == "xlsx") {
              const reader = new FileReader();
              const file = event.target.files[0];
              this.DocumentFile = file;

              if (file.size < 5000000) {
                reader.readAsDataURL(event.target.files[0]);
                 reader.onload = (event) => {
                  let target: any = event.target;
                //  this.DocumentFile = target.result;
                  this.UploadCSV();
               }
              // this.UploadCSV();
              }
              else {
                Swal.fire('Oops...', 'Upload only 5 MB size files!')
              }
            }
            else {

              this.myInputVariable.nativeElement.value = '';
              // Swal.fire('Upload only CSV Files');
              Swal.fire('Upload only xlsx Files');

            }
          }
        }
      })
  }
  Upload() {
    this.UploadCSV();

  }

  UploadCSV() {
    this.loader.open();

    debugger;
    var Check = false;

    const formData = new FormData();
    formData.append('files', this.DocumentFile);
    //this.httpClient.post('api/data_loader/file/', formData);



      
    Check = true
    //console.log(Check, "fille uploade");
    // if (Check) {

      this.FileUpService.uploadvehicleCSV(formData).subscribe(data => {
        debugger;

        if (data.success == true) {
          debugger
          this.loader.close();
          this.DocumentFile = "";
          this.myInputVariable.nativeElement.value = "";

          //console.log(data)
          if (data.records_not_inserted.length > 0) {

            Swal.fire({
              title: 'File Uploaded Successfully!! Please check downloaded sheet for Status',
              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
              if (result.value) {

                this.excelService.exportAsExcelFile(data.records_not_inserted, 'Account Mapping Status file');

              }
              else {
                this.excelService.exportAsExcelFile(data.records_not_inserted, 'Account Mapping Status file');
              }
            })


          }
          //    Swal.fire("Success, Some ids are not inserted" + "<br>" + data.invalid_account_ids.join())  }
          else {
            Swal.fire({
              title: 'File Uploaded Successfully!! ',

              icon: 'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'OK'
            }).then((result) => {
            })

          }

          this.onRefresh();



        }
        else {
          this.loader.close();
          this.DocumentFile = "";



          this.myInputVariable.nativeElement.value = "";


          Swal.fire('Invalid Request. Please reupload using the assigned format only')

        }

      });
    // }
    // else {
    //   Swal.fire('Error Occured , Please Try After Some Times')

    // }




  }
  onRefresh() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () { return false; };

    let currentUrl = this.router.url;

    this.router.navigateByUrl(currentUrl)
      .then(() => {
        this.router.navigated = false;
        this.router.navigate([this.router.url]);
      });


  }
  tabChange(tabName){
    this.isActiveTab = tabName;

  }
 
  pageChange(page: any) {
    debugger;
    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;

    if (this.tab == 1) {
      this.currDiv = "retailer"

      const ListInput: InputData1 = {} as InputData1;

      // if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      // if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      // if (this.distributor_id) { ListInput.distributor_code = this.distributor_id; } else { ListInput.distributor_code = ""; }

      // if (this.account_id) { ListInput.account_id = this.account_id; } else { ListInput.account_id = ""; }


      ListInput.offset = page;
      ListInput.size = this.noofrecordsperpage
      ListInput.account_type = "RT"

      this.getList(ListInput);

    }

    if (this.tab == 2) {
      this.currDiv = "fleet-owner"

      const ListInput: InputData1 = {} as InputData1;

      // if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }

      // if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

      // if (this.distributor_id) { ListInput.distributor_code = this.distributor_id; } else { ListInput.distributor_code = ""; }

      // if (this.account_id) { ListInput.account_id = this.account_id; } else { ListInput.account_id = ""; }

      ListInput.offset = page;
      ListInput.size = this.noofrecordsperpage
      ListInput.account_type = "FO"

      this.getList(ListInput);
    }

  
  //pleae

}
}

export class Input {
  offset: number;
  account_type: string;
  //size:number
}
export class InputData1 {
  account_id: string;
  account_name: string;
  account_type: string;
  customer_segment: string;
  distributor_code: string;
  distributor_name: string;
  from_date: string;
  offset: number
  to_date: string;
  size:number
}