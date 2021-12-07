import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
//import { ChartDataSets, ChartType, ChartOptions } from '@chart.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(config: NgbModalConfig, private modalService: NgbModal) { 
    config.backdrop = 'static';
    config.keyboard = false;
  }
  barchartString: any;


  ngOnInit(): void {
  }

  barChartLegend = true;

  colors = [
    {
      //pending // 1st Year.
      backgroundColor: ["#ff3300", "#ff3300", "#ff3300", "#ff3300", "#ff3300"]
    },
    { // Invoiced.
      backgroundColor: ["#00bfff", "#00bfff", "#00bfff", "#00bfff", "#00bfff"]
    },
    { // OutForDelivery.
      backgroundColor: ["#FF7F00", "#FF7F00", "#FF7F00", "#FF7F00", "#FF7F00"]
    },
    { // Delivered.
      backgroundColor: ["#39f200", "#39f200", "#39f200", "#39f200", "#39f200"]
    },

    { // Cancelled
      backgroundColor: ['#999999', '#999999', '#999999', '#999999', '#999999']
    },




    { // Freez.
      backgroundColor: ["#b642f5", "#b642f5", "#b642f5", "#b642f5", "#b642f5"]
    },





  ]


}
