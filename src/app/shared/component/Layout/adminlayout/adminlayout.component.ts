import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-adminlayout',
  templateUrl: './adminlayout.component.html',
  styleUrls: []
})
export class AdminlayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(){
   }

  
  onActivate() {
    var scrollElem= document.querySelector('#moveTop');
   
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    let scrollToTop = window.setInterval(() => {
      let pos = window.pageYOffset;
      if (pos > 0) {
          window.scrollTo(0, pos - 20); // how far to scroll on each step
      } else {
          window.clearInterval(scrollToTop);
      }
  }, 16);
    //or document.body.scrollTop = 0;
    //or document.querySelector('body').scrollTo(0,0)
    
}
}
