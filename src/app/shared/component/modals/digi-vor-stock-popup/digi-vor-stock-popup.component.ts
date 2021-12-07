import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { egretAnimations } from 'app/shared/animations/egretAnimations';
import Swal from 'sweetalert2';
// import { AppLoaderComponent } from "../../../shared/component/app-loader/app-loader.component";
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { CommonService } from '../../../../shared/Services/common-service.service';
import { InfodetailpopupComponent } from '../infodetailpopup-component/infodetailpopup/infodetailpopup.component';

@Component({
  selector: 'app-digi-vor-stock-popup',
  templateUrl: './digi-vor-stock-popup.component.html',
  styleUrls: ['./digi-vor-stock-popup.component.scss']
})
export class DigiVorStockPopupComponent implements OnInit {

  users = [

  ]

MapCenterLat: any;
MapCenterlang: any;

zoom = 6;
mapCenter = {
lat: 18.621946,
lng: 73.825351
}

mylocations = [
{ lat: 18.644835, lng: 73.791199 },
{ lat: 18.621946, lng: 73.825351 },
{ lat: 19.033211, lng: 73.029577 }
];
polylinePoints = [

];

temparay: any
circleMapRadius = 50000;

PartNumber: any;
Qty: any;
userlat: any;
userlong: any;
Users1 = [];
dealer_id: any;
division_id: any;

constructor(@Inject(MAT_DIALOG_DATA) public data: any
, private loader: AppLoaderService,
private CommonService: CommonService,
private dialog: MatDialog,) { }

async ngOnInit() {


this.Isshow = false

this.Users1 = [];

debugger

this.MapCenterLat = 18.621946;
this.MapCenterlang = 73.825351;


this.userlat = this.data.userlat;
this.userlong = this.data.userlatlong;







this.users = this.data.payload
this.PartNumber = this.data.PartNumber;


this.Qty = this.data.Qty


var i
i = 1
for (let entry of this.users) {



  var KM = this.getDistanceFromLatLonInKm(this.userlat, this.userlong, Number(entry.dealer_location_latitude), Number(entry.dealer_location_longitude))
  // var KM1 =this.distance(this.userlat,this.userlong,Number(entry.dealer_location_latitude),Number(entry.dealer_location_longitude))


  const ListInput: Map = {} as Map;
  ListInput.lat = Number(entry.dealer_location_latitude)
  ListInput.lng = Number(entry.dealer_location_longitude)
  ListInput.lABLE = i;
  ListInput.Range = KM
  ListInput.Quantity = entry.part_count
  ListInput.Name = entry.dealer_name
  ListInput.dealer_id=entry.dealer_id
  this.mylocations.push(ListInput)
  i = Number(i) + Number(1);
  this.mapCenter = {
    lat: Number(entry.dealer_location_latitude),
    lng: Number(entry.dealer_location_longitude)
  }


}



// for (let entry of this.users) {




//   debugger

//   var jsonq = {

//     "location_id": entry.dealer_id,

//     "location_type": "division",

//     "app_name": "com.tatamotors.dvor"

//   }



//   await this.CommonService.GETDivisiorDivisionData(jsonq).subscribe(
 

    
//     data => {



//       if (data.data?.length > 0) {


//         this.temparay = data.data[0]

//       }




//     }, (err) => {


//     }

//   );



//   // var KM =this.calculateDistance(this.userlat,this.userlong,Number(entry.dealer_location_latitude),Number(entry.dealer_location_longitude))
//   var KM = this.getDistanceFromLatLonInKm(Number(this.userlat), Number(this.userlong), Number(entry.dealer_location_latitude), Number(entry.dealer_location_longitude))
//   var SSS = this.getDirectionsUrl(Number(this.userlat), Number(this.userlong), Number(entry.dealer_location_latitude), Number(entry.dealer_location_longitude))

//   const ListInput: List = {} as List;
//   // ListInput. = Number(entry.dealer_location_latitude)
//   // ListInput.lng = Number(entry.dealer_location_longitude)

//   ListInput.Range = KM;
//   ListInput.part_count = entry.part_count
//   ListInput.dealer_name = entry.dealer_name
//   ListInput.dealer_id = entry.dealer_id
//   //ListInput.DivDetails = this.temparay;
//   this.Users1.push(ListInput)




// }

}





getDirectionsUrl(lat1, lon1, lat2, lon2) {

var str_origin = "origin=" + lat1 + "," + lon1;

var str_dest = "destination=" + lat2 + "," + lon2;

var sensor = "sensor=false";

var mode = "mode=driving";

var parameters = str_origin + "&" + str_dest + "&" + sensor + "&" + mode;

var output = "json";

return "https://maps.googleapis.com/maps/api/directions/" + output + "?" + parameters;
}


distance(lat1, lon1, lat2, lon2) {
var p = 0.017453292519943295;    // Math.PI / 180
var c = Math.cos;
var a = 0.5 - c((lat2 - lat1) * p) / 2 +
c(lat1 * p) * c(lat2 * p) *
(1 - c((lon2 - lon1) * p)) / 2;

return 12742 * Math.asin(Math.sqrt(a)); // 2 * R; R = 6371 km
}



getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
var R = 6371; // Radius of the earth in km
var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
var dLon = this.deg2rad(lon2 - lon1);
var a =
Math.sin(dLat / 2) * Math.sin(dLat / 2) +
Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
Math.sin(dLon / 2) * Math.sin(dLon / 2)
;
var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
var d = R * c; // Distance in km
return d;
}

deg2rad(deg) {
return deg * (Math.PI / 180)
}




DivData: any

Isshow: boolean
show: {[key: number]: boolean} = {};

async GetDivInfo(dealer_id,index) {

   debugger
//  let itemIndex = this.Users1.findIndex(item => item.dealer_id == LocationId);
  


  this.DivData = ""

  var jsonq = {

    "location_id":dealer_id,

    "location_type": "division",

    "app_name": "com.tatamotors.dvor"

  }



  await this.CommonService.GETDivisiorDivisionData(jsonq).subscribe(

    data => {
     if (data.data?.length > 0) {
        this.loader.open()
        this.Isshow = true;
 
        this.DivData = data.data[0]
       // console.log(this.DivData)
        //  this.loader.close()
        //  this.loader.close();
      //  this.Users1[itemIndex].DivData =this.DivData;

      //  console.log(this.Users1)



      let dialogRef: MatDialogRef<any> = this.dialog.open(InfodetailpopupComponent, {
        panelClass: 'my-class',
        //  width: '1100px',
        //  height: '700px',

        disableClose: false,
        data: {  payload:data.data[0]}

      })


      this.loader.close()
      }



      else {
        Swal.fire(' Latitude/ Longitude not Available (Please Select Another Division)');




      }

      // this.loader.close()
    }, (err) => {
      Swal.fire('Please try Again')

    }

  );

}

_eQuatorialEarthRadius = 6378.1370;
_d2r = (Math.PI / 180.0);

HaversineInM(lat1, long1, lat2, long2) {
return (1000.0 * this.HaversineInKM(lat1, long1, lat2, long2));
}

HaversineInKM(lat1, long1, lat2, long2) {
var dlong = (long2 - long1) * this._d2r;
var dlat = (lat2 - lat1) * this._d2r;
var a = Math.pow(Math.sin(dlat / 2.0), 2.0) + Math.cos(lat1 * this._d2r) * Math.cos(lat2 * this._d2r) * Math.pow(Math.sin(dlong / 2.0), 2.0);
var c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
var d = this._eQuatorialEarthRadius * c;

return d;



}








calculateDistance(lat1, long1, lat2, long2) {

//radians
lat1 = (lat1 * 2.0 * Math.PI) / 60.0 / 360.0;
long1 = (long1 * 2.0 * Math.PI) / 60.0 / 360.0;
lat2 = (lat2 * 2.0 * Math.PI) / 60.0 / 360.0;
long2 = (long2 * 2.0 * Math.PI) / 60.0 / 360.0;


// use to different earth axis length    
var a = 6378137.0;        // Earth Major Axis (WGS84)    
var b = 6356752.3142;     // Minor Axis    
var f = (a - b) / a;        // "Flattening"    
var e = 2.0 * f - f * f;      // "Eccentricity"      

var beta = (a / Math.sqrt(1.0 - e * Math.sin(lat1) * Math.sin(lat1)));
var cos = Math.cos(lat1);
var x = beta * cos * Math.cos(long1);
var y = beta * cos * Math.sin(long1);
var z = beta * (1 - e) * Math.sin(lat1);

beta = (a / Math.sqrt(1.0 - e * Math.sin(lat2) * Math.sin(lat2)));
cos = Math.cos(lat2);
x -= (beta * cos * Math.cos(long2));
y -= (beta * cos * Math.sin(long2));
z -= (beta * (1 - e) * Math.sin(lat2));

return (Math.sqrt((x * x) + (y * y) + (z * z)) / 1000);
}

previous;
clickedMarker(infowindow) {
if (this.previous) {
this.previous.close();
}
this.previous = infowindow;
}



onMouseOver(infoWindow, $event: MouseEvent) {



infoWindow.open();
}

// onMouseOut(infoWindow, $event: MouseEvent) {
//   infoWindow.close();
// }

TabChange(tab) {


debugger;




if (tab.index == 1) {
}
}






}


export class Map {

lat: any
lng: any
lABLE: any
Name: string
Quantity: any
Range: any
dealer_id :any;

}



export class List {

dealer_name: any
dealer_id: any
part_count: any
Range: any
DivData: []



}
