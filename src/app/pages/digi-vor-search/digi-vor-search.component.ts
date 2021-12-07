import { Component, OnInit } from '@angular/core';
// import { OrderListService } from '../../shared/services/MyServices/order-list.service';
import { CommonService } from '../../shared/Services/common-service.service';
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable } from 'rxjs';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import Swal from 'sweetalert2';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SearchDetailsComponent } from './search-details/search-details.component'
// import { DataPassService } from '../../shared/services/MyServices/data-pass.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-digi-vor-search',
  templateUrl: './digi-vor-search.component.html',
  styleUrls: ['./digi-vor-search.component.scss']
})
export class DigiVorSearchComponent implements OnInit {
  myControl = new FormControl();
  myControl1 = new FormControl();
  myControlSKU = new FormControl();
  Qty = new FormControl('' || '', [Validators.required, Validators.max(100), Validators.min(1)]);
  filterValue: any;
  filterValue2: any;
  Division = [];
  DistributorData = [];
  filterValue1: any;
  options: string[] = [];
  filterValue3: any;
  RoleName: any;
  filteredOptions: Observable<string[]>;
  filteredOptionsSKU: any;
  // filteredOptionsSKU: Observable<string[]>;
  DistCode: any;
  isDistDrpDownVisible: boolean;
  division_name: any;
  division_id: any;
  DivisionList: FormGroup;
  divisionName = new FormControl();
  distributor_name: string;
  distributor_id: string;
  DistributorList: FormGroup;
  AllFilters: any;
  partNumberList: FormGroup;
  part_number: any;
  desc_text: any;
  AllDataArray: any[];
  tempDivisionArray: any[];
  prevDistID: any = 0;
  onPageLoad: number = 0;
  constructor(
    private dialog: MatDialog,
    private CommonService: CommonService, private loader: AppLoaderService,
    private router: Router, private fb: FormBuilder,

  ) { }
  href: any;
  pagevalid: boolean
  ngOnInit() {

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
    this.partNumberList = new FormGroup({
      part_number: new FormControl()
    });

    this.href = this.router.url;

    var splitted = this.href.split("/", 3);
    this.pagevalid = this.CommonService.GetPageVlidation(splitted[2])
    document.getElementById('products-subnav-c').style.display = 'block';
    // const data: InputData = {} as InputData;

    // data.size = 10;
    // data.org_search_text = "";

    // this.GetDistributor(data);
    // if (this.pagevalid == true) {



    this.isaddressshow = false;
    this.filterValue = null;
    this.myControl.valueChanges.subscribe(value => {
      this._filter(value)
    });


    this.myControl1.valueChanges.subscribe(value => {
      this._filter1(value)
    });


    this.myControlSKU.valueChanges.subscribe(value => {
      this._filter2(value)
    });








    this.isDistDrpDownVisible = true;


    this.RoleName = this.CommonService.getRole();
    this.DistCode = this.CommonService.GetDistributorCode()
    // alert(this.DistCode);

    if (this.RoleName != "TML") {
      this.isDistDrpDownVisible = false;
      const data: InputData1 = {} as InputData1;

      // data.distributor_id = Event.distributor_id;
      data.distributor_id = this.DistCode;
      data.div_search_text = "";

      this.Getdivision(data, 0);




    }
    else {


      const data: InputData = {} as InputData;

      data.size = 5;
      data.org_search_text = "";

      this.GetDistributor(data);




    }


    var jsonn2 = { "search_text": '', "size": 10 }
    this.getSKUItemSingle(jsonn2);







    // }
    // else {
    //   this.router.navigate(['pages/NOTFound']);
    // }






  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    if ((this.Qty.value == "" || this.Qty.value == undefined || this.Qty.value == 0) && charCode == 48) {
      return false;
    }

    else if (charCode > 31 && (charCode < 48 || charCode > 57)) {



      return false;
    }


    return true;


  }

  filteredOptionsSKU1 = []

  getSKUItemSingle(input) {
    // debugger;

    //this.loader.open()
    //this.ProductGroupData=[];
    this.filteredOptionsSKU1 = []
    this.CommonService.GetSKU(input).subscribe(

      data => {

        if (data.success == true) {




          // alert('Hi');

          this.filteredOptionsSKU = data.data.result;
          this.filteredOptionsSKU1 = data.data.result;
          this.partNumberList = new FormGroup({})
          for (let formModule of this.filteredOptionsSKU) {
            this.partNumberList.addControl(formModule.part_number, new FormControl(false))
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


  userlat: any;
  userlong: any;

  getDetails(json1, qty) {
    this.loader.open();


    this.userlat = json1.user_latitude;
    this.userlong = json1.user_longitude;


    this.CommonService.GETDivisorDetailData(json1).subscribe(




      data => {
        //


        // if (data.data.length > 0) {
        if (data.data) {

          var Name = this.filteredOptionsSKU1.filter(book => book.part_number === this.filterValuesLECTEDsku);

          this.loader.close();
          let title = '';
          let PartNumber = this.filterValuesLECTEDsku + '_' + Name[0].desc_text
          let Qty = qty
          // let Partname = Name[0].
          let userlatlong = this.userlong;
          let userlat = this.userlat;
          let OrderNo = '4f26-9574-f17373fdaaa1';
          let dialogRef: MatDialogRef<any> = this.dialog.open(SearchDetailsComponent, {
            panelClass: 'my-class',
            // width: '1100px',
            // height: '700px',

            disableClose: false,
            data: { title: title, payload: data.data, PartNumber, Qty, userlatlong, userlat }

          })


          this.loader.close();
        }



        else {
          this.loader.close();
          Swal.fire(data.error.msg);

        }
      }, (err) => {

      }

    );


  }

  clear() {
    this.dealer_address = "";
    this.dealer_contact_no = "";
    this.dealer_location_latitude = "";
    this.div_city_name = "";
    this.dealer_location_longitude = "";
    this.div_name = "";
    this.dealer_name = "";
  }

  dealer_address: any
  dealer_contact_no: any
  dealer_location_latitude: any
  div_city_name: any
  dealer_location_longitude: any
  isaddressshow: boolean
  div_name: any;
  dealer_name: any
  GetDivInfo(json) {


    this.clear()

    this.CommonService.GETDivisiorDivisionData(json).subscribe(

      data => {

        if (data.data.length > 0) {

          this.isaddressshow = true;

          var loc_type = data.data[0].loc_type;
          // alert(loc_type)

          this.dealer_address = data.data[0].dealer_address
          this.dealer_contact_no = data.data[0].dealer_contact_no
          this.dealer_location_latitude = data.data[0].dealer_location_latitude
          this.div_city_name = data.data[0].div_city_name
          this.dealer_location_longitude = data.data[0].dealer_location_longitude
          this.div_name = data.data[0].div_name

          this.dealer_name = data.data[0].dealer_name
          //  this.loader.close()
          //  this.loader.close();
        }



        else {
          // alert('No data');
          this.isaddressshow = false;
          // this.loader.close()


        }

        // this.loader.close()
      }, (err) => {
        // alert('Error');
        this.loader.close()
        this.isaddressshow = false;

      }

    );

  }


  SearchDetails() {

    var Message = ''
    var Message1 = ''
    if ((this.dealer_location_latitude == "" || this.dealer_location_latitude == undefined || this.dealer_location_latitude == 'undefined')
      || (this.dealer_location_longitude == "" || this.dealer_location_longitude == undefined || this.dealer_location_longitude == 'undefined')) {




      Swal.fire(' Latitude/ Longitude not Available (Please Select Another Division)');


    }
    else {




      if ((this.filterValuesLECTEDsku == "" || this.filterValuesLECTEDsku == undefined || this.filterValuesLECTEDsku == 'undefined')) {
        if (Message == '') { Message = 'Please Select ' }

        Message = Message + ' Part'
      }

      if ((this.Qty.value == "" || this.Qty.value == undefined || this.Qty.value == 'undefined')) {
        if (Message == '') { Message = 'Please Select ' }
        Message = Message + ' Quantity'
      }


      // if ((this.dealer_location_latitude == "" || this.dealer_location_latitude == undefined || this.dealer_location_latitude == 'undefined')
      //   || (this.dealer_location_longitude == "" || this.dealer_location_longitude == undefined || this.dealer_location_longitude == 'undefined')) {
      //   Message1 = ' Latitude/ Longitude not Avaialble (Please Select Another Division)'
      // }



      if ((this.filterValuesLECTEDsku == "" || this.filterValuesLECTEDsku == undefined || this.filterValuesLECTEDsku == 'undefined')
        || (this.dealer_location_latitude == "" || this.dealer_location_latitude == undefined || this.dealer_location_latitude == 'undefined')
        || (this.dealer_location_longitude == "" || this.dealer_location_longitude == undefined || this.dealer_location_longitude == 'undefined')
        || (this.Qty.value == "" || this.Qty.value == undefined || this.Qty.value == 'undefined')
      ) {
        Swal.fire(Message + '<br/>' + Message1)
      }
      else {
        var json1 = {

          "part_num": this.filterValuesLECTEDsku,

          "user_latitude": this.dealer_location_latitude,

          "user_longitude": this.dealer_location_longitude,

          "kms_range": 300,

          "qty": this.Qty.value,

          "app_name": "com.tatamotors.dvor"

          // "part_num": "263241303105",

          // "user_latitude": "28.634544",

          // "user_longitude": "77.206384",

          // "kms_range": 300,

          // "qty": "1",

          // "app_name": "com.tatamotors.dvor"

        }

        this.getDetails(json1, this.Qty.value)
      }
    }

  }

  SearchReset() {

    this.myControl.setValue('');

    this.myControl1.setValue('');

    this.myControlSKU.setValue('');
    this.AllFilters.get('division_name').setValue('');
    this.AllFilters.get('org_name').setValue('');
    this.AllFilters.get('partNumber').setValue('');

    this.Qty.reset();

    this.filterValuesLECTEDsku = ''
    this.dealer_location_latitude = ''
    this.dealer_location_longitude = ''
    this.filterValuesLECTEDsku = ''


    this.filterValue = ''
    this.filterValue2 = ''

    this.filterValue1 = ''

    this.filterValue3 = ''

    this.Division = []


    this.dealer_address = ''
    this.dealer_contact_no = ''

    this.div_city_name = ''

    this.dealer_name = ''
    this.div_name = ''
    this.isaddressshow = false;

    if (this.RoleName != "TML") {
      const data: InputData1 = {} as InputData1;

      // data.distributor_id = Event.distributor_id;
      data.distributor_id = this.DistCode;
      data.div_search_text = "";

      this.Getdivision(data, 0);
    }

  }



  filterValuesLECTEDsku: any

  filterMyOptionsSKU(Event) {

    // this.myControl1.setValue('');


    this.filterValuesLECTEDsku = Event;


  }




  filterMyOptions(Event, event) {

    if (event.isUserInput) {
      this.dealer_address = ""
      this.dealer_contact_no = ""
      this.dealer_location_latitude = ""
      this.div_city_name = ""
      this.dealer_location_longitude = ""


      this.myControl1.setValue('');


      this.filterValue = Event;

      const data: InputData1 = {} as InputData1;

      data.distributor_id = Event;
      data.div_search_text = "";

      this.Getdivision(data, 0);
    }


  }
  Getdivision(Data1, i) {
    // this.AllDataArray = [];
    if (this.RoleName == "TML") {
      this.DistributorData[i]['divData'] = [];
    }
    this.CommonService.DivisionList(Data1).subscribe(

      data => {



        if (data.success == true) {

          //     this.dataPreparation(data.data);
          this.Division = [];
          this.filterValue2 = null;
          this.Division = data.data.result;

          if (this.RoleName == "TML") {
            var tempArray = [];
            tempArray.push(data.data.result)
            this.DistributorData[i]['divData'] = tempArray[0]
            // this.DistributorData[i]['divData'].push(data.data.result)
            for (let q = 0; q < this.Division.length; q++) {
              this.tempDivisionArray.push(this.Division[q]);
            }
  
            this.DivisionList = new FormGroup({})
            for (let formModule of this.tempDivisionArray) {
              this.DivisionList.addControl(formModule.div_id, new FormControl(false))
            }
          }else{
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

  private _filter(value: string): string[] {


    this.filterValue1 = value;
    // this.filterValue = filterValue1;
    // alert(filterValue);
    if (this.filterValue1 == "") {
      this.filterValue = null;
    }

    const data: InputData = {} as InputData;

    data.size = 10;
    data.org_search_text = this.filterValue1;

    this.GetDistributor(data);
    // alert(filterValue1);

    return this.options.filter(option => option.toLowerCase().includes(this.filterValue1));
  }
  filterValueSKU: any;
  filterValue4: any;

  private _filter2(value: string): string[] {



    this.filterValue4 = value;
    // this.filterValue = filterValue1;
    // alert(filterValue);
    if (this.filterValue4 == "") {
      this.filterValueSKU = null;
    }

    const data: InputData = {} as InputData;

    // data.size = 10;
    // data.org_search_text = this.filterValue4;

    // this.GetDistributor(data);


    var jsonn2 = { "search_text": this.filterValue4, "size": 10 }
    this.getSKUItemSingle(jsonn2);


    // alert(filterValue1);

    return this.options.filter(option => option.toLowerCase().includes(this.filterValue4));
  }

  GetDistributor(Data) {
    this.AllDataArray = [];
    this.tempDivisionArray = [];

    this.CommonService.DistributorList(Data).subscribe(

      data => {




        if (data.success == true) {

          //     this.dataPreparation(data.data);

          this.DistributorData = data.data.result;
          console.log( this.DistributorData)
          this.filteredOptions = data.data.result
          this.DistributorList = new FormGroup({})
          for (let formModule of this.DistributorData) {
            this.DistributorList.addControl(formModule.distributor_id, new FormControl(false))
          }

          for (let i = 0; i < this.DistributorData.length; i++) {
            const data: InputData1 = {} as InputData1;
            // this.AllDataArray.push(this.DistributorData[i].distributor_id)
            data.distributor_id = this.DistributorData[i].distributor_id;
            data.div_search_text = "";

            this.Getdivision(data, i);

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

  private _filter1(value: string): string[] {

    this.filterValue3 = value;

    if (this.filterValue3 == "") {
      this.filterValue2 = null;
    }


    return this.options.filter(option => option.toLowerCase().includes(this.filterValue3));
  }

  filterMyOptions1(Event) {



    //alert(Event);
    this.filterValue2 = Event;

    // alert(this.filterValue2 );


    var json = {

      "location_id": this.filterValue2,

      "location_type": "division",

      "app_name": "com.tatamotors.dvor"

    }

    this.GetDivInfo(json);

  }
  filterMyOptions2(Event, event) {

    if (event.isUserInput) {    // ignore on deselection of the previous option
      this.filterValue2 = Event;




      var json = {

        "location_id": this.filterValue2,

        "location_type": "division",

        "app_name": "com.tatamotors.dvor"

      }

      this.GetDivInfo(json);
      this.filterValue2 = ""

    }

    //alert(Event);

  }


  divisionfilteradd(row, event) {
    this.division_name = row.div_name
    this.division_id = row.div_id

    this.AllFilters.get('division_name').setValue(row.div_name);
    var json = {

      "location_id": this.division_id,

      "location_type": "division",

      "app_name": "com.tatamotors.dvor"

    }

    this.GetDivInfo(json);
    if (event.target.checked) {
      for (const field1 in this.DivisionList.controls) { // 'field' is a string
        if (field1 == this.division_id) {
          this.DivisionList.get(field1).setValue(true);
        }
        else {
          this.DivisionList.get(field1).setValue(false);
        }
      }
    }
    else {
      for (const field1 in this.DivisionList.controls) { // 'field' is a string
        this.AllFilters.get('division_name').setValue('');
        this.DivisionList.get(field1).setValue(false);
      }
    }

  }

  Divisiontype(value) {
    this.division_id = ""
    this.division_name = ""

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.division_search_text = this.AllFilters.value.division_name;
    this.Getdivision(data1, 0);
  }

  Distributortype() {

    this.distributor_id = ""
    this.distributor_name = ""

    const data1: InputData = {} as InputData;

    data1.size = 5;
    data1.org_search_text = this.AllFilters.value.org_name;

    this.GetDistributor(data1);
  }

  dstfilteradd(row, event) {

    // debugger

    this.distributor_id = row.distributor_id
    this.distributor_name = row.distributor_name
    this.AllFilters.get('org_name').setValue(this.distributor_name);
    if (event.target.checked) {
      for (const field1 in this.DistributorList.controls) { // 'field' is a string
        if (field1 == this.distributor_id) {
          this.DistributorList.get(field1).setValue(true);
        }
        else {
          this.DistributorList.get(field1).setValue(false);
        }

      }
    }

    else {
      for (const field1 in this.DistributorList.controls) { // 'field' is a string

        this.DistributorList.get(field1).setValue(false);


      }
    }


    this.Getdivision(row, 0)

  }

  partNumberfilteradd(row, event) {
    this.part_number = row.part_number
    this.desc_text = row.desc_text
    // this.divisionName.value(this.division_name)
    this.AllFilters.get('partNumber').setValue(this.part_number);
    this.filterValuesLECTEDsku = this.part_number;
    if (event.target.checked) {
      for (const field2 in this.partNumberList.controls) { // 'field' is a string
        if (field2 == this.part_number) {
          this.partNumberList.get(field2).setValue(true);
        }
        else {
          this.partNumberList.get(field2).setValue(false);
        }
      }
    }
    else {
      for (const field2 in this.partNumberList.controls) { // 'field' is a string
        this.AllFilters.get('partNumber').setValue('');
        this.partNumberList.get(field2).setValue(false);
      }
    }
    this.filterMyOptionsSKU(this.part_number);

  }

  partNumbertype(value) {
    this.part_number = ""
    this.desc_text = ""


    var jsonn2 = { "search_text": this.AllFilters.value.partNumber, "size": 10 }
    this.getSKUItemSingle(jsonn2);
  }

  toggle_vehicle_list(vehicleId): void {
    this.AllFilters.get('org_name').setValue(vehicleId.distributor_name);
    if (this.onPageLoad == 0) {
      this.onPageLoad = 1;
      this.prevDistID = vehicleId.distributor_id;
    }

    if (this.prevDistID != vehicleId.distributor_id) {
      for (let q = 0; q < this.DistributorData.length; q++) {
        if (this.prevDistID == this.DistributorData[q].distributor_id) {
          document.getElementById(this.prevDistID).style.display = 'none';
        }
      }

      this.prevDistID = vehicleId.distributor_id;
    }

    if (document.getElementById(vehicleId.distributor_id).style.display == 'block') {
      document.getElementById(vehicleId.distributor_id).style.display = 'none';
      // this.AllFilters.get('org_name').setValue('');
      //  document.getElementById(el).classList.remove("active");
    }
    else {
      document.getElementById(vehicleId.distributor_id).style.display = 'block';

      // document.getElementById(el).classList.add("active");
    }
  }
  toggle_partNumber(vehicleId): void {
    // this.AllFilters.get('partNumber').setValue(vehicleId);

    if (document.getElementById(vehicleId).style.display == 'block') {
      document.getElementById(vehicleId).style.display = 'none';
      //  document.getElementById(el).classList.remove("active");
    }
    else {
      document.getElementById(vehicleId).style.display = 'block';
      // document.getElementById(el).classList.add("active");
    }
  }

}


export class InputData {

  size: number
  org_search_text: string
  division_search_text: string
  partNumber_search_text: string


}

export class DetailInputData {

  Lat: number
  Long: string
  Division: string
  Quantity: string
  Part: string;

}

export class InputData1 {
  distributor_id: string
  div_search_text: string
  // size: number
  // org_search_text: string


}


