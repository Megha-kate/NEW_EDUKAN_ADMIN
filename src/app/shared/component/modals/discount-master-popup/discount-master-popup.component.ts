import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-discount-master-popup',
  templateUrl: './discount-master-popup.component.html',
  styleUrls: ['./discount-master-popup.component.scss']
})
export class DiscountMasterPopupComponent implements OnInit {

  @Input() item: any;
  @Output() closemodal = new EventEmitter<any>();

  CustsegmentArray = [];
  KeyAccount: boolean;
  Fleetowner: boolean;
  GovtCust: boolean;
  Retiler: boolean;
  CustSegment: any;
  ROPGline: any

  productTypeDisplay = [];
  showProduct: any;
  issku: boolean;
  ispgline: boolean;

  ROProductSKU: any;
  selectedSKUDisplay1 = [];

  DisplayDivisionData = [];
  Division: any;

  constructor(    private modalService: NgbModal,
    ) { }

  ngOnInit(): void {
    console.log(this.item)
    this.discountDetails()
  }

  discountDetails() {
    var customer_typedata = [];
    this.item.disount_detail.filter(function (item) {
      var i = customer_typedata.findIndex(x => x.customer_type == item.customer_type);
      if (i <= -1) {
        customer_typedata.push({ customer_type: item.customer_type });
      }
      return null;
    });
    console.log(customer_typedata);

    for (let entry1 of customer_typedata) {
      if (entry1.customer_type == 'ALL') {
        this.CustsegmentArray.push('ALL');
      }
      else if (entry1.customer_type == 'FO') {
        this.Fleetowner = true;
        this.CustsegmentArray.push('Key Account');
      }
      else if (entry1.customer_type == 'GOV') {

        this.GovtCust = true;
        this.CustsegmentArray.push('Goverment');
      }
      else {
        this.Retiler = true;
        this.CustsegmentArray.push('Retailer');
      }
    }
    this.CustSegment = this.CustsegmentArray.join();


    var pg_linedata = [];
    this.item.disount_detail.filter(function (item) {
      var i = pg_linedata.findIndex(x => x.pg_line == item.pg_line);
      if (i <= -1) {
        pg_linedata.push({ pg_line: item.pg_line });
      }
      return null;
    });
    //console.log(pg_linedata);
    if (pg_linedata[0] == "ALL" || pg_linedata[0] == "NA") {
      if (pg_linedata[0] == "ALL") {
        this.issku = false
        this.ispgline = true
      }
      if (pg_linedata[0] == "NA") {
        this.issku = true
        this.ispgline = false
      }
    }
    else {
      var productTypeDisplaydata = [];
      for (let entry1 of pg_linedata) {
        productTypeDisplaydata.push(entry1.pg_line);
      }

      this.showProduct = "Pg Line";
      this.productTypeDisplay = productTypeDisplaydata;
      this.ispgline = false;
      this.issku = true;
    }
    this.ROPGline = this.productTypeDisplay.join();
    console.log(this.productTypeDisplay)
    console.log(this.ROPGline)

    var sku_itemdata = [];
    this.item.disount_detail.filter(function (item) {
      var i = sku_itemdata.findIndex(x => x.sku_item == item.sku_item);
      if (i <= -1) {
        sku_itemdata.push({ sku_item: item.sku_item });
      }
      return null;
    });

    if (sku_itemdata[0] == "ALL" || sku_itemdata[0] == "NA") {

      if (sku_itemdata[0] == "ALL") {
        this.issku = true
        this.ispgline = false

      }
      if (sku_itemdata[0] == "NA") {
        this.issku = false
        this.ispgline = true
      }
    }
    else {
      var SKUDisplaydata = [];
      for (let entry1 of sku_itemdata) {
        SKUDisplaydata.push(entry1.sku_item);
      }
      this.showProduct = "SKU";
      this.ispgline = false;
      this.issku = true;
      this.selectedSKUDisplay1 = SKUDisplaydata;
    }
    this.ROProductSKU = this.selectedSKUDisplay1.join();


    var divisiondata = [];
    this.item.disount_detail.filter(function (item) {
      var i = divisiondata.findIndex(x => x.division == item.division_name);
      if (i <= -1) {
        divisiondata.push({ division: item.division_name });
      }
      return null;
    });
    if (divisiondata[0] == "ALL" || divisiondata[0] == "NA") {

    }
    else {
      this.DisplayDivisionData = [];
      for (let entry1 of divisiondata) {
        if (entry1.division == "NA") {
          this.DisplayDivisionData.push('ALL');
        }
        else {
          this.DisplayDivisionData.push(entry1.division);
        }
      }
    }
    this.Division = this.DisplayDivisionData.join();


    // ======Distributor=====
    var organizationdata = [];
    this.item.disount_detail.filter(function (item) {
      var i = organizationdata.findIndex(x => x.organization == item.organization_name);
      if (i <= -1) {
        organizationdata.push({ organization: item.organization_name });
      }
      return null;
    });
    if (organizationdata[0] == "NA") {
    }
    else {
      var DisplayDistributor = [];
      for (let entry1 of organizationdata) {
        DisplayDistributor.push(entry1.organization);
      }
      this.selectedDisplayDistributor = DisplayDistributor
    }

    this.RODistributor = this.selectedDisplayDistributor.join();



    var CustomerData = [];
    this.item.disount_detail.filter(function (item) {
      var i = CustomerData.findIndex(x => x.account_name == item.account_name);
      if (i <= -1) {
        CustomerData.push({ account_name: item.account_name });
      }
      return null;
    });
    //console.log(organizationdata);
    if (CustomerData[0] == "NA") {
      DisaplyaCust.push("ALL");
    }
    else {
      var DisaplyaCust = [];
      for (let entry2 of CustomerData) {
        DisaplyaCust.push(entry2.account_name);
      }

      this.selectedDisplayCustomer = DisaplyaCust
    }

    var ROCust = this.selectedDisplayCustomer.filter((v, i, a) => a.indexOf(v) === i);
    console.log(this.selectedDisplayCustomer)
    console.log(ROCust)
    this.ROCust = ROCust.join();
  }

  selectedDisplayDistributor = [];
  RODistributor: any;

  selectedDisplayCustomer = [];
  ROCust: any;

  closeModal() {
    this.modalService.dismissAll();
  }

}
