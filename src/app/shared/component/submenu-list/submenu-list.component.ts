import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-submenu-list',
  templateUrl: './submenu-list.component.html',
  styleUrls: ['./submenu-list.component.scss']
})
export class SubmenuListComponent implements OnInit {
  @Input() ActiveMenu: any;
  constructor(private router: Router, private route: ActivatedRoute) { }
  href: any
  pagedetails: any
  MenuDetails: any;
  Pagemasterid:any;
  page:any;
  totalElements
  isdiableeporrt:true;
  FilterString:any
  ngOnInit(): void {

debugger

    this.href = this.router.url;


    var list = JSON.parse(localStorage.getItem('PageDetails') || '{}')
    this.pagedetails = list;

    this.Pagemasterid = this.route.snapshot.queryParamMap.get('page');

    var data2 = this.pagedetails.filter(book => book.page_master_id === Number(this.Pagemasterid));
    this.MenuDetails = data2[0].page_detail;


  }

  tab: any = 0
  onClick(check, row) {
    debugger
    this.tab = check

    var Page = row.page_url
 
    this.router.navigate([Page], { queryParams: { page: this.Pagemasterid } });


  }

}
