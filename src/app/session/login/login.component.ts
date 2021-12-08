import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { AuthorizeService } from './../../shared/Services/authorize.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginData: any;

  constructor(private fb: FormBuilder,
    private datepipe: DatePipe,
    private router: Router,
    private AuthService: AuthorizeService, private loader: AppLoaderService
  ) { }

  ToDate: any;
  FromDate: any;
  signupForm!: FormGroup;
  ngOnInit() {
    localStorage.setItem('tab','1')
    this.signupForm = this.fb.group(
      {
        username: ["JSS530248", Validators.required],
        password: ["IlandCnada@2223", Validators.required],
       
      }
    );


  }
 page_listNew = [
    {
      "page_master_id": 1,
      "HeaderSequence": 1,
      "MenuHeaderName": "Dashboard",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 8,
          "page_display_name": "Order History",
          "page_url": "pages/Dashboard",
          "icon": null,
          "tooltip": null,

        }
      ]

    },
    {
      "page_master_id": 2,
      "HeaderSequence": 1,
      "MenuHeaderName": "Orders",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 7,
          "page_display_name": "Active Order",
          "page_url": "pages/OrderTracking",
          "icon": null,
          "tooltip": null,
        },
        {
          "page_detail_id": 8,
          "page_display_name": "Return Request",
          "page_url": "pages/ReturnList",
          "icon": null,
          "tooltip": null,
        },
        {
          "page_detail_id": 9,
          "page_display_name": "Cancel Request",
          "page_url": "pages/CancleList",
          "icon": null,
          "tooltip": null,
        },

        {
          "page_detail_id": 10,
          "page_display_name": "Order History",
          "page_url": "pages/OrderHistory",
          "icon": null,
          "tooltip": null,

        },
        {
          "page_detail_id": 11,
          "page_display_name": "EDN PO List",
          "page_url": "pages/POList",
          "icon": null,
          "tooltip": null,

        },
        {
          "page_detail_id": 12,
          "page_display_name": "Invoice Payment List",
          "page_url": "pages/InvoicePaymentList",
          "icon": null,
          "tooltip": null,

        },
      ]
    },
    {
      "page_master_id": 3,
      "HeaderSequence": 1,
      "MenuHeaderName": "User",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        // {
        //   "page_detail_id": 7,
        //   "page_display_name": "User Registration",
        //   "page_url": "pages/RegistrationList",
        //   "icon": null,
        //   "tooltip": null,

        // },
        {
          "page_detail_id": 8,
          "page_display_name": "User Registration",
          "page_url": "pages/UserRegistrationList",
          "icon": null,
          "tooltip": null,

        },
        {
          "page_detail_id": 9,
          "page_display_name": "Admin Configuration",
          "page_url": "pages/RolePosition",
          "icon": null,
          "tooltip": null,

        },

        {
          "page_detail_id": 9,
          "page_display_name": "Web Configuration",
          "page_url": "pages/WebRolePosition",
          "icon": null,
          "tooltip": null,

        }
      ]
    },
    {
      "page_master_id": 4,
      "HeaderSequence": 1,
      "MenuHeaderName": "FeedBack",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 9,
          "page_display_name": "FeedBack List",
          "page_url": "pages/FeedBackList",
          "icon": null,
          "tooltip": null,
        },
      ]
    },
    {
      "page_master_id": 5,
      "HeaderSequence": 1,
      "MenuHeaderName": "Reports",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 8,
          "page_display_name": "Invoice Timeline",
          "page_url": "pages/InvoicingTimeLine",
          "icon": null,
          "tooltip": null,

        },
        {
          "page_detail_id": 9,
          "page_display_name": "Delivery Timeline",
          "page_url": "pages/DeliveryTimeLine",
          "icon": null,
          "tooltip": null,

        },
        {
          "page_detail_id": 10,
          "page_display_name": "Invoice Level Mis",
          "page_url": "pages/InvoiceLevelMis",
          "icon": null,
          "tooltip": null,

        },
        {
          "page_detail_id": 11,
          "page_display_name": "Order Details Mis",
          "page_url": "pages/OrderDetailslMis",
          "icon": null,
          "tooltip": null,

        },
        {
          "page_detail_id": 12,
          "page_display_name": "ETA Report",
          "page_url": "pages/ETAReport",
          "icon": null,
          "tooltip": null,

        }
      ]
    },
    {
      "page_master_id": 6,
      "HeaderSequence": 1,
      "MenuHeaderName": "Credit",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 9,
          "page_display_name": "Credit Limit",
          "page_url": "pages/CreditLimit",
          "icon": null,
          "tooltip": null,
        },
        {
          "page_detail_id": 10,
          "page_display_name": "FO/RT Mapping",
          "page_url": "pages/FleetOwnerUpload",
          "icon": null,
          "tooltip": null,
        },
      ]
    },
    {
      "page_master_id": 7,
      "HeaderSequence": 1,
      "MenuHeaderName": "DigiVor Search",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 12,
          "page_display_name": "DigiVorSearch",
          "page_url": "pages/DigiVorSearch",
          "icon": null,
          "tooltip": null,

        },
      ]
    },
    {
      "page_master_id": 8,
      "HeaderSequence": 1,
      "MenuHeaderName": "Pricing & Discount",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 13,
          "page_display_name": "Customer Details",
          "page_url": "pages/CustomerDetails",
          "icon": null,
          "tooltip": null,

        },
        {
          "page_detail_id": 14,
          "page_display_name": "Discount Master",
          "page_url": "pages/DiscountMaster",
          "icon": null,
          "tooltip": null,
        },

      ]
    },
    {
      "page_master_id": 9,
      "HeaderSequence": 1,
      "MenuHeaderName": "Master",
      "icon": "dashboard",
      "page_url": "",
      "tooltip": "History",
      "type": "link",
      "page_detail": [
        {
          "page_detail_id": 10,
          "page_display_name": "Division Master",
          "page_url": "pages/DivisionMaster",
          "icon": null,
          "tooltip": null,
        },
        // {
        //   "page_detail_id": 15,
        //   "page_display_name": "List",
        //   "page_url": "pages/List",
        //   "icon": null,
        //   "tooltip": null,
        // },
       
        {
          "page_detail_id": 16,
          "page_display_name": "Part Master",
          "page_url": "pages/PartMaster",
          "icon": null,
          "tooltip": null,
        },
         {
          
            "page_detail_id": 17,
            "page_display_name": "Banner",
            "page_url": "pages/Banner",
            "icon": null,
            "tooltip": null,
          },
          {
          
            "page_detail_id": 12,
            "page_display_name": "Part Query",
            "page_url": "pages/PartQuery",
            "icon": null,
            "tooltip": null,
          },
          {
          
            "page_detail_id": 13,
            "page_display_name": "HelpLine Query",
            "page_url": "pages/HelpLineQuery",
            "icon": null,
            "tooltip": null,
          },

      ]
    },



    

// {
//   "page_master_id": 10,
//   "HeaderSequence": 1,
//   "MenuHeaderName": "Banner",
//   "icon": "dashboard",
//   "page_url": "",
//   "tooltip": "History",
//   "type": "link",
//   "page_detail": [
//     {
//       "page_detail_id": 16,
//       "page_display_name": "Banner",
//       "page_url": "pages/Banner",
//       "icon": null,
//       "tooltip": null,
//     },
//   ]
// }
  ]
  


  onSubmit() {

    this.loader.open();
    this.AuthService.loginAuth(this.signupForm.value).subscribe(

      data => {
        if (data.success == true) {
          this.loader.close();
          this.setSession(data);

          this.router.navigate(['pages/Dashboard']);
          //  this.loader.close();
        }


        else {

          this.loader.close();
          // Swal.fire ('Oops...', data.data.msg, 'error')
          alert(data.data.msg)

        }
      }, (err) => {

        alert('SORRY! Service is currently unavailable. Please Try again after some time.')
        this.loader.close();
        // Swal.fire('Oops...', 'SORRY! Service is currently unavailable. Please Try again after some time.', 'error')
      }

    );

  }

  setSession(data: any) {

    localStorage.setItem('token', data.data.token.access_token);

    localStorage.setItem('loginData', JSON.stringify(data.data));


    // localStorage.setItem('PageDetails', JSON.stringify(data.data.page_list));
    localStorage.setItem('PageDetails', JSON.stringify(this.page_listNew));


    localStorage.setItem('ORGName', data.data.account_info.organization_name);
    let Minutes = data.data.token.expires_in * 1000;
    let date1 = new Date();
    let date2 = new Date(date1.getTime() + Minutes);
    localStorage.setItem('timer', JSON.stringify(date2));


    var d = new Date(); // today!
    var x = 30; // go back 30 days!
    d.setDate(d.getDate() - x);


    this.FromDate = this.datepipe.transform(d, 'yyyy-MM-dd')
    this.ToDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd')

    localStorage.setItem("ToDate", this.ToDate);
    localStorage.setItem("FromDate", this.FromDate);

  }

}
