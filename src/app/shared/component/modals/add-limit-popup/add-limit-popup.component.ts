import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreditServiceService } from 'src/app/shared/Services/credit-service.service';
import Swal from 'sweetalert2';
import { AppLoaderService } from '../../app-loader/app-loader.service';
@Component({
  selector: 'app-add-limit-popup',
  templateUrl: './add-limit-popup.component.html',
  styleUrls: ['./add-limit-popup.component.scss']
})
export class AddLimitPopupComponent implements OnInit {
  @Input() item: any;
  @Output() closemodal = new EventEmitter<any>();
  constructor(
    private fb: FormBuilder,
    private loader: AppLoaderService,
    private creditservice: CreditServiceService,
    private modalService: NgbModal,
  ) { }

  public itemForm: FormGroup;
  Accounttype: any
  AccountId: any;
  
  ngOnInit(): void {
    
    this.Accounttype = this.item.account_type
    this.AccountId = this.item.account_id

    this.BuilditemForm();
  }

  BuilditemForm() {
    this.itemForm = this.fb.group({
      account_id: [],
      limit_amount: [],
      no_of_days: [],
      account_type: [],
      current_balance: [],
    })
  }

  items: any;
  ErrorValidation : boolean;

  save() {
    debugger
    if (this.itemForm.invalid) {
      Swal.fire('Please fill all mandatory details');
      return;
    }

    if (this.itemForm.value.no_of_days < 0 || this.itemForm.value.no_of_days >= 365) {
      Swal.fire('Please Enter Days between 1 to 365');
      return;
    }

    if (Number(this.itemForm.value.current_balance) > Number(this.itemForm.value.limit_amount)) {
      // this.ErrorValidation= true
      Swal.fire('Balance cannot be more than credit limit');
      return;
    }

    this.itemForm.get('account_id').setValue(this.AccountId);
    this.itemForm.get('account_type').setValue(this.Accounttype);

    this.loader.open();

    debugger
    this.creditservice.SaveCredit(this.itemForm.value).subscribe(
      data => {
        debugger
        if (data.success == true) {
          this.items = [];
          this.items = data.data;

          Swal.fire({
            title: 'Saved Successfully!',
            icon: 'success',
            showCancelButton: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.value) {
              // this.dialogRef.close(this.itemForm.value)
            }
            else {
              // this.dialogRef.close(this.itemForm.value)
             }
          })
          this.loader.close();
          this.modalService.dismissAll();
        }
        else {
          this.items = [];
          this.loader.close();
          this.modalService.dismissAll();
        }
      }, (err) => {
        this.loader.close();
        this.modalService.dismissAll();
      }
    );
  }
  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  closeModal() {
    this.modalService.dismissAll();
  }
}
