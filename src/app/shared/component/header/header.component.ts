import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppLoaderService } from '../app-loader/app-loader.service';
import {AuthorizeService} from './../../Services/authorize.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loginData: any;

  constructor(private router: Router, private modalService: NgbModal,private auth: AuthorizeService,
    private loader: AppLoaderService) { }
  pagedetails = [];
  tab: any = 0;
  ngOnInit() {

    var list = JSON.parse(localStorage.getItem('PageDetails') || '{}')
    this.pagedetails = list;
    if(localStorage.getItem('tab')){
      this.tab = Number(localStorage.getItem('tab')) - 1;
      console.log(this.tab,'inside condition')
    }
    console.log('tab == ', this.tab)
    // var Page = this.pagedetails[0].page_detail[0].page_url
    // var Pagemasterid = this.pagedetails[0].page_master_id;
    // alert(Page + Pagemasterid)
    // this.router.navigate([Page], { queryParams: { page: Pagemasterid } });
    this.loginData = JSON.parse(localStorage.getItem('loginData'))

  }

  

  Report() {

    this.router.navigate(['pages/InvoicingTimeLine']);

  }

 
  onClick(check, row) {

    debugger

    this.tab = check
    console.log(row.page_detail[0].page_url)
    var Page = row.page_detail[0].page_url
    var Pagemasterid = row.page_master_id;
    localStorage.setItem('tab',row.page_master_id)
    this.router.navigate([Page], { queryParams: { page: Pagemasterid } });


  }

  User() {

    this.router.navigate(['pages/RegistrationList']);
  }

  Dashoabrd() { this.router.navigate(['pages/Dashboard']); }


  closeResult = '';
  modalRef2: any;
  open(content) {
    // this.modalRef2 = this.modalService.show(this.template2, { class: 'modal-dialog-centered modal-md', backdrop: 'static' });

    
    this.modalRef2 = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }
  logo(){
    //this.router.navigate(['pages/Dashboard']);
  }

  Logout()
  {

    // this.loader.open()
    this.auth.loggedOut()
    localStorage.clear();
    

  //   setTimeout(() => {
  //     this.loader.close()
  // }, 200); 

  this.modalService.dismissAll()
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
}
