import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDropdown, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { AppLoaderService } from 'src/app/shared/component/app-loader/app-loader.service';
import { AppConfirmService } from 'src/app/shared/Services/app-confirm.service';
import Swal from 'sweetalert2';
import { CommonService } from './../../../shared/Services/common-service.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @Output() closemodal = new EventEmitter<any>();

  currentPage: any
  totalrecord: any
  noofrecordsperpage: any;

  items: any;

  banner: any;

  btnSave: boolean | undefined;
  Roletypedisable: boolean | undefined;
  btnupdate: boolean | undefined;

  exampleForm = new FormGroup({})
  Filters = new FormGroup({});

  showRecords: number;
  edit: boolean;

  constructor(
    private CommonService: CommonService,
    private modalService: NgbModal,
    private loader: AppLoaderService,
    private fb: FormBuilder,
    private confirmService: AppConfirmService,
  ) { this.createForm(''); }

  ngOnInit(): void {

    this.currentPage = 1
    this.noofrecordsperpage = 10;
    this.showRecords = 10;

    this.edit = false;

    const ListInput: Input = {} as Input;
    ListInput.offset = 0,
      ListInput.size = 10,

      this.getBannerList(ListInput)

    this.buildForm()
  }

  buildForm() {
    this.Filters = this.fb.group({
      bannerType: [''],
    });
  }



  SearchBanner(event) {
    
    if (event.key === "Enter") {
      const ListInput: Input= {} as Input;
     // ListInput.from_date = localStorage.getItem("FromDate");
     // ListInput.to_date = localStorage.getItem("ToDate");
     // ListInput.bannerType = "order_cancellation";
      ListInput.bannerType = event.target.value;
      this.getBannerList(ListInput)
    }
  }

  showBanner(event) {
    const ListInput: Input = {} as Input;
    
    ListInput.bannerType = event.target.value;
    this.getBannerList(ListInput)
  }
  createForm(row: any) {
    this.exampleForm = this.fb.group({
      banner_url: row.banner_url,
      // bannerType: row.banner_type,
      bannerType: [row.banner_type || '', Validators.required],
      description: [row.description || '', Validators.required],
      // description: row.description,
      bannerId: row.id
    });
  }

  getBannerList(ListInput) {
    this.totalrecord = 0

    this.FilterStrings(ListInput);

    this.loader.open();

    this.CommonService.GetBannerList(ListInput).subscribe(

      data => {
        this.loader.close();
        debugger
        if (data.success == true) {
          this.totalrecord = data.total_result;
          this.showRecords = data.data.length
          this.items = []
          this.items = data.data;
          console.log('this.items')
          console.log(this.items)

        }

        else {

          this.totalrecord = 0;

          this.items = [];

          this.loader.close();

        
        }
      }, (err) => {
      //  this.loader.close();
        this.modalService.dismissAll();
           
      }
    );

  }
  closeModal() {
    this.closemodal.emit();
  }

  Filterarray = [];
  FilterStrings(ListInput) {

    this.Filterarray = [];
    debugger
    for (let item in ListInput) {

      if (ListInput[item]) {
        var Json = { "Key": item, "Value": ListInput[item] }
        this.Filterarray.push(Json)
      }
    }
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'size');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'offset');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'description');
    this.Filterarray = this.Filterarray.filter(book => book.Key !== 'api_url');

    console.log(this.banner)

    if (this.banner == "" || this.banner == null || this.banner == undefined) {
      this.Filterarray = this.Filterarray.filter(book => book.Key !== 'banner_type');
    }
    console.log(this.Filterarray)

  }

  onRemoveFilter(filterString) {
    if (filterString.Key == "banner_type") {
      this.banner = "";

      const ListInput: Input = {} as Input;
      ListInput.offset = 0,
        ListInput.size = 10,

        this.getBannerList(ListInput)
    }
    // else if (filterString.Key == "banner_type") {
    //   this.banner = "";

    // }
    this.currentPage = 1;
  }

  addFilter() {

    this.banner = this.Filters.value.bannerType;

    this.Filters.reset()

    const ListInput: Input = {} as Input;

    if (this.banner) { ListInput.banner_type = this.banner; } else { ListInput.banner_type = ""; }
     ListInput.offset = 0,
      ListInput.size = 10,
    this.getBannerList(ListInput)
    console.log(this.banner)
    this.myDrop.close();
  }

  removeFilter() {
    this.banner = "";
    this.Filters.reset()

    const ListInput: Input = {} as Input;
    ListInput.offset = 0,
      ListInput.size = 10,

      this.getBannerList(ListInput)
    this.currentPage = 1
    this.myDrop.close();
  }


  pageChange(page: any) {
    debugger;
    document.body.scrollTop = 0;
    this.currentPage = page;
    page = page - 1;

    const ListInput: Input = {} as Input;

    if (this.banner) { ListInput.banner_type = this.banner; } else { ListInput.banner_type = ""; }
    ListInput.offset = (page * 10);
    ListInput.size = (page * 10) + 10
    this.getBannerList(ListInput)
  }

  closeResult = '';

  open(content: any) {

    this.btnSave = true;
    this.Roletypedisable = true
    this.btnupdate = false;
    this.exampleForm.reset();

     //this.exampleForm.reset()
    // this.createForm('')

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

  editImageUrl: any
  Editpopup(content1: any, row: any) {

    this.btnSave = false;
    this.Roletypedisable = false
    this.btnupdate = true;

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
      this.editImageUrl = row.banner_url;
    }, 200);

  }

  imageUrl: any
  onImageClick(content2: any, row: any) {

    console.log(row)
    let ngbModalOptions: NgbModalOptions = {
      backdrop: true,
      keyboard: true,
    };
    this.modalService.open(content2, ngbModalOptions).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    setTimeout(() => {
      this.imageUrl = row
      console.log(this.imageUrl)
    }, 200);

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

  ImageBase64: any
  ImageSrc: any

  selectedImage(e) {
    console.log(e)

    if (e.target.files && e.target.files[0]) {
      // Size Filter Bytes

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        console.log(image.src)
        this.ImageSrc = image.src
        this.edit = true;
        image.onload = rs => {
          const imgBase64Path = e.target.result;
          this.ImageBase64 = reader.result;
          // this.previewImagePath = imgBase64Path;
          console.log(this.ImageBase64)
        };
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  }

  Valdationmessage: string
  saveBanner() {
    console.log(this.ImageSrc)
    console.log(this.exampleForm?.value.bannerType)

    if (this.exampleForm.controls.bannerType.invalid) {
      this.Valdationmessage = "Please Select Banner Type"
      return false
    }

    if (this.exampleForm.controls.description.invalid) {
      this.Valdationmessage = "Please Enter Description"
      return false
    }

    if (this.ImageSrc == null || this.ImageSrc == "" || this.ImageSrc == undefined) {
      this.Valdationmessage = "Please Upload Banner Image"
      return false
    }

    if (this.exampleForm?.invalid) {
      this.Valdationmessage = "* marked fields are mandatory"
      return false
    }
    else {

      //     if(this.exampleForm?.value.bannerType =="" || this.exampleForm?.value.bannerType == null || this.exampleForm?.value.bannerType == undefined){
      // alert("Banner Type compulsory")
      //     }

      const Final: saveInput = {} as saveInput;
      Final.banner_type = this.exampleForm?.value.bannerType;
      Final.banner_id = "";
      Final.description = this.exampleForm?.value.description;
      Final.banner_image = this.ImageSrc;
      Final.api_url = "api_url";
      Final.banner_parameter = [{ "key": "KEY1", "value": "VALUE1" }];
      Final.action_type = "add_banner";
      this.AddBanner(Final)
      console.log(Final)
    }
  }

  UpdateBanner() {

    if (this.ImageSrc == null || this.ImageSrc == "" || this.ImageSrc == undefined) {
      var srcimage = this.EditselectedImage(this.editImageUrl)
      console.log(srcimage)
    }

    if (this.exampleForm.controls.bannerType.invalid) {
      this.Valdationmessage = "Please Select Banner Type"
      return false
    }

    if (this.exampleForm.controls.description.invalid) {
      this.Valdationmessage = "Please Enter Description"
      return false
    }

    // if (this.ImageSrc == null || this.ImageSrc == "" || this.ImageSrc == undefined || this.editImageUrl == null || this.editImageUrl == "" || this.editImageUrl == undefined ) {
    //   this.Valdationmessage = "Please Upload Banner Image"
    //   return false
    // }
    console.log(this.edit)
    if (this.exampleForm?.invalid) {
      this.Valdationmessage = "* marked fields are mandatory"
      return false
    }
    else {
      const Final: saveInput = {} as saveInput;
      Final.banner_type = this.exampleForm?.value.bannerType;
      Final.banner_id = this.exampleForm?.value.bannerId
      Final.description = this.exampleForm?.value.description;
      Final.banner_image = (this.ImageSrc == '' || this.ImageSrc == null || this.ImageSrc == undefined) ? "" : this.ImageSrc,
       Final.api_url = "api_url";
      Final.banner_parameter = [{ "key": "KEY1", "value": "VALUE1" }];
      Final.action_type = "update_banner";

      this.AddBanner(Final)

      console.log(Final)
    }
  }

  AddBanner(Final: any) {
    this.loader.open();

    this.CommonService.AddBanner(Final).subscribe(
      data => {
        this.loader.close();

        console.log(data)
        if (data.success == true) {
          this.exampleForm.reset();
          this.ImageSrc = "";
          this.editImageUrl = "";
          this.ImageBase64 = ""
          this.modalService.dismissAll()
          const ListInput: Input = {} as Input;
          ListInput.offset = 0,
            ListInput.size = 10,

            this.getBannerList(ListInput)
          this.currentPage = 1
        }
        else {
          this.exampleForm.reset();
          this.ImageSrc = "";
          this.editImageUrl = ""
          alert(data.data.msg);
        }
      }, (err: any) => {
        alert('Exception Occured!');
      }
    );
  }

  title = 'Confirmation ';
  text = 'Are you sure want to Remove Banner??';
  selectedOption: any;

  RemoveBanner(row) {
    debugger
//     this.confirmService.confirm({ title: this.title, message: this.text })
//       .subscribe((result) => {
//         this.selectedOption = result;
// console.log(this.selectedOption)
//         if (this.selectedOption == true) {
//           console.log(row.id)
//           // const Final: saveInput = {} as saveInput;
//           // Final.banner_id = row.id
//           // Final.action_type = "remove_banner";

//           // this.removeBannerApi(Final)

//         }
//       });

         const Final: saveInput = {} as saveInput;
          Final.banner_id = row.id
          Final.action_type = "remove_banner";

          this.removeBannerApi(Final)
  }

  removeBannerApi(Final: any) {
    //this.loader.open();
    Swal.fire(" Are you sure you want remove Banner?");


    this.CommonService.AddBanner(Final).subscribe(
      data => {
      this.loader.close();
        console.log(data)
        if (data.success == true) {
          this.exampleForm.reset();
          this.ImageSrc = "";
          this.editImageUrl = ""
          this.modalService.dismissAll()
          const ListInput: Input = {} as Input;
           ListInput.offset = 0,
            ListInput.size = 10,

            this.getBannerList(ListInput)
          this.currentPage = 1;
        }
        else {
          this.exampleForm.reset();
          this.ImageSrc = "";
          this.editImageUrl = ""
          alert(data.data.msg);
        }
      }, (err: any) => {
        alert('Exception Occured!');
      }
    );
  }

  EditselectedImage(src) {
    const image = new Image();
    image.src = src;

    var srcImage = image.src
    console.log(srcImage)
    // Size Filter Bytes
    return srcImage
    // reader.readAsDataURL(e.target.files[0]);
  }
}

export class Input {
  banner_type: string;
  description: string;
  api_url: string;
  offset: number
  size: number
  bannerType: any;
}

export class saveInput {
  banner_image: string;
  banner_type: string;
  description: string;
  api_url: string;
  action_type: string;
  banner_id: string;
  banner_parameter: any;
}