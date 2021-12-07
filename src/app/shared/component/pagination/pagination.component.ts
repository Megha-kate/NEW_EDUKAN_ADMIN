

import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { interval } from 'rxjs';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() siblings = 1;
  @Input() current = 1;
  @Input() total = 1;

  @Output() pageChange: EventEmitter<number> = new EventEmitter();
  @Output() pageChange1: EventEmitter<number> = new EventEmitter();

  pages: number[] = [];
  isPrev: boolean = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  @Input() totalRecords: number = 0;
  @Input() recordsPerPage: number = 0;
  @Input() showrecords: number = 0;

  @Output() onPageChange: EventEmitter<number> = new EventEmitter();

  // public pages: number [] = [];  
  // public pages: number [] = [];  

  @Input()
  activePage!: number;
  pageCount: any;

  currentpages: number[] = [];
  constructor(private _route: ActivatedRoute, private router: Router,
    private _router: Router) { }

  ngOnInit(): void {

    debugger
  //  alert(this.totalRecords + "pagination module")

    this.pageCount = this.getPageCount();
    this.pages = this.getArrayOfPage(this.pageCount);
    this.currentpages = []

    var count = Math.ceil(this.totalRecords / this.recordsPerPage)

    if (count >= 0) {
      count = 5
    }


    for (let index = 1; index <= Math.ceil(this.totalRecords / this.recordsPerPage); index++) {
      this.currentpages.push(index);
    }
    this.currentpages = this.getPageList(this.currentpages.length, this.activePage, 10);
  }


  trackByFn(index: number): number {
    return index;
  }

  registerOnChange(fn: any): void {

    this.onChange = fn;
  }

  Noofpagechange() {
    this.onRefresh()
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setPage1(value: number | undefined) {


    this.pageChange1.emit(value)
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

  private getPageCount(): number {
    let totalPage: number = 0;

    if (this.totalRecords > 0 && this.recordsPerPage > 0) {
      const pageCount = this.totalRecords / this.recordsPerPage;
      const roundedPageCount = Math.floor(pageCount);

      totalPage = roundedPageCount < pageCount ? roundedPageCount + 1 : roundedPageCount;
    }

    return totalPage;
  }

  private getArrayOfPage(pageCount: number): number[] {
    let pageArray: number[] = [];

    var temppagecount = 5


    if (pageCount > 0) {
      for (var i = 1; i <= pageCount; i++) {
        pageArray.push(i);
      }
    }
    return pageArray;
  }

  onClickPage(pageNumber: number) {


    this.pageCount = this.getPageCount();
    this.pages = this.getArrayOfPage(this.pageCount);
    this.currentpages = []
    for (let index = 1; index <= Math.ceil(this.totalRecords / this.recordsPerPage); index++) {
      this.currentpages.push(index);
    }
    this.currentpages = this.getPageList(this.currentpages.length, this.activePage, 10);




    // if (this.activePage < pageNumber && pageNumber > 10) {
    //   this.currentpages = this.pages.slice((this.activePage / 10) + (this.activePage % 10), (this.activePage / 10) + (this.activePage % 10) + 10)
    //   //  this.currentpages=this.pages.copyWithin(10,(pageNumber/10)+(pageNumber%10),pageNumber)
    // }
    // if (this.activePage > pageNumber && pageNumber < this.currentpages[0]) {
    //   this.currentpages = this.pages.slice(pageNumber - 1, pageNumber - 1 + 10)
    // }
    if (pageNumber < 1) return;
    if (pageNumber > this.pages.length) return;
    this.activePage = pageNumber;
    this.onPageChange.emit(pageNumber);
  }

  //   totalPages:     total number of pages
  //   page:           current page
  //   maxLength:      maximum size of returned array
  getPageList(totalPages: number, page: number, maxLength: number) {
    if (maxLength < 5) throw "maxLength must be at least 5";

    function range(start: number, end: number) {
      return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
    if (totalPages <= maxLength) {
      // no breaks in list
      return range(1, totalPages);
    }
    if (page <= maxLength - sideWidth - 1 - rightWidth) {
      // no break on left of page
      return range(1, maxLength - sideWidth - 1)
        .concat(0, range(totalPages - sideWidth + 1, totalPages));
    }
    if (page >= totalPages - sideWidth - 1 - rightWidth) {
      // no break on right of page
      return range(1, sideWidth)
        .concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
    }
    // Breaks on both sides
    return range(1, sideWidth)
      .concat(0, range(page - leftWidth, page + rightWidth),
        0, range(totalPages - sideWidth + 1, totalPages));
  }


}



