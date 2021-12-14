import { DatePipe, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { OrderserviceService } from 'src/app/shared/Services/orderservice.service';
import { ExcelServiceService } from 'src/app/shared/Services/excel-service.service';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ReportServicesService } from 'src/app/shared/Services/report-services.service';
import { CommonService } from 'src/app/shared/Services/common-service.service';
import { PoInput } from 'src/app/pages/Order Managment/Po-List/po-list/po-list.component';

@Component({
  selector: 'app-report-download-popup',
  templateUrl: './report-download-popup.component.html',
  styleUrls: ['./report-download-popup.component.scss']
})
export class ReportDownloadPopupComponent implements OnInit {
  @Input() data: any;
  @ViewChild('myDrop', { static: true }) myDrop: NgbDropdown;
  @Input() pageName: any;
  @Input() count: any;
  @Input() fileType: any;
  @Output() closemodal = new EventEmitter<any>();
  offset: any;
  isdistributor: boolean

  part_num: any;
  to_date: any;
  from_date: string;
  pg: any;
  distributor_category: any;
  discount_code_cvbu: any;
  desc_text: any;
  isactiveforecom: any;
  minquantity: any;
  large_description: any;
  isassamrifile: any;
  GROSS_AMOUNT: any;
  PoDataPrepareArray: any;
  po_number: any;
  otc_number: any;
  TemparrayNew: any[];
  isdivision_Name: boolean;
  //: any;
  constructor(
    private OrderListService: OrderserviceService,
    private datepipe: DatePipe,
    private excelService: ExcelServiceService,
    private modalService: NgbModal,
    private MISService: ReportServicesService,
    private Commonservice: CommonService
    // private titlecasePipe: TitleCasePipe,

  ) { }

  ngOnInit(): void {
    // alert(this.data)
    // alert(this.pageName)
    // alert(this.count)
    debugger

    var RoleName = this.Commonservice.getRole();
    if (RoleName == "Distributor") {
      this.isdistributor = true
    }
    else {

      this.isdistributor = false
    }

    if (this.pageName == "e-order") {
      this.reportEOrder();
    }
    else if (this.pageName == "CRM") {
      this.CRMreport();
    }
    else if (this.pageName == "tracking-All") {
      this.TrackingAll();
    }
    else if (this.pageName == "tracking") {
      this.Tracking();
    }
    else if (this.pageName == "deliverytracking") {
      this.trackingDelivery()
    }
    else if (this.pageName == "deliveryTimeLine") {
      this.deliveryTimeLine()
    }
    else if (this.pageName == "invoiceTimeLine") {
      this.invoiceTimeLine()
    }
    else if (this.pageName == "orderDetailsMIS") {
      this.orderDetailsMIS()
    }
    else if (this.pageName == "ETAReport") {
      this.etaReport()
    }
    else if (this.pageName == "invoiceDetailsMIS") {
      this.invoiceDetailsMIS()
    }
    else if (this.pageName == "feedback") {
      this.feedback()
    }
    else if (this.pageName == "cancel") {
      this.cancel()
    }
    else if (this.pageName == "return") {
      this.return()
    }
    else if (this.pageName == "DivisionMaster") {
      this.DivisionMaster()
    }
    else if (this.pageName == "PartMaster") {
      this.partmaster()
    }
    else if (this.pageName == "POList") {
      this.poList()
    }
    else if (this.pageName == "CustomerDetails") {
      this.CustomerDetails();
    }
    else if (this.pageName == "PartMaster") {
      this.reportDownloadTemplatepartmaster()
    }
    else if (this.pageName == "InvoicePaymentList") {
      this.invoicepaymentList()
    }
  }

  async invoicepaymentList() {

    if (this.count <= 250) {

      await this.OrderListService.InvoicePayment(this.data).subscribe(

        data => {
          debugger

          if (data.success == true) {


            for (let entry of data.data) {

              //this.CancellDataPrepareArray  = data.data.result;

              const ListInput: ExpotInputdataInvoice = {} as ExpotInputdataInvoice;
              ListInput.Invoice_Number = entry.invoice_no
              ListInput.OTC_Number = entry.otc_order_number
              ListInput.Invoice_Date = this.datepipe.transform(entry.invoice_date, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Order_Number = entry.order_number
              ListInput.Invoice_Status = entry.invoice_status
              ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')

              ListInput.Invoice_Pdf_Url = entry.invoice_pdf_url
              ListInput.Order_Amount = entry.order_amount
              ListInput.Tracking_Date = this.datepipe.transform(entry.tracking_date, 'dd-MM-yyyy hh:mm:ss a')

              ListInput.Payment_Status = entry.payment_status
              ListInput.Payment_Method = entry.payment_method
              ListInput.Payment_Date = this.datepipe.transform(entry.payment_date, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.action_type = "payment_invoice_list",

                this.TemparrayALL.push(ListInput)

            }

            //this.loader.close();
            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'InvoicePaymentList');
            this.modalService.dismissAll();

          }

          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {
      var Size = 250
      var offset = 0

      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        this.OrderListService.InvoicePayment(this.data).subscribe(

          data => {
            debugger

            if (data.success == true) {

              for (let entry of data.data) {


                const ListInput: ExpotInputdataInvoice = {} as ExpotInputdataInvoice;
                ListInput.Invoice_Number = entry.invoice_no
                ListInput.OTC_Number = entry.otc_order_number
                ListInput.Invoice_Date = this.datepipe.transform(entry.invoice_date, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.Order_Number = entry.order_number
                ListInput.Invoice_Status = entry.invoice_status
                ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')

                ListInput.Invoice_Pdf_Url = entry.invoice_pdf_url
                ListInput.Order_Amount = entry.order_amount
                ListInput.Tracking_Date = this.datepipe.transform(entry.tracking_date, 'dd-MM-yyyy hh:mm:ss a')

                ListInput.Payment_Status = entry.payment_status
                ListInput.Payment_Method = entry.payment_method
                ListInput.Payment_Date = this.datepipe.transform(entry.payment_date, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.action_type = "payment_invoice_list",

                  this.datafoexpot2(ListInput)


              }


            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();
            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
         Size = Size + 250;
        offset = offset + 250;
      }

    }
  }
  datafoexpot2(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'InvoicePaymentList');
      this.modalService.dismissAll();
    }
  }


  async return() {

    if (this.count <= 250) {

      await this.OrderListService.CancelOrderList(this.data).subscribe(

        data => {
          debugger

          if (data.success == true) {


            for (let entry of data.data.result) {

              //this.CancellDataPrepareArray  = data.data.result;

              const ListInput: ExpotInputdata = {} as ExpotInputdata;
              ListInput.Request_Number = entry.cancel_order_number
              ListInput.Request_Date = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')



              ListInput.OTC_Number = entry.otc_order_number
              ListInput.Order_No = entry.order_number
              ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Customer_Type = "order_return"

              if (this.isdistributor == false) {

                ListInput.Distributor_Name = entry.organization_name
              }



              ListInput.Account_ID = entry.account_data.account_id
              ListInput.Customer_Name = entry.account_data.name
              ListInput.Returned_Amount = Number(entry.cancel_line_items_total_amount)

              ListInput.Dist_Approval = entry.approved_status;
              ListInput.Return_Status = entry.cr_request_status



              this.TemparrayALL.push(ListInput)

            }

            //this.loader.close();
            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'ReturnList');
            this.modalService.dismissAll();

          }

          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {
      var Size = 250
      var offset = 0

      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        this.OrderListService.CancelOrderList(this.data).subscribe(

          data => {
            debugger

            if (data.success == true) {

              for (let entry of data.data.result) {


                const ListInput: ExpotInputdata = {} as ExpotInputdata;
                ListInput.Request_Number = entry.cancel_order_number
                ListInput.Request_Date = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')



                ListInput.OTC_Number = entry.otc_order_number
                ListInput.Order_No = entry.order_number
                ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.Customer_Type = entry.user_type

                if (this.isdistributor == false) {

                  ListInput.Distibutor_Name = entry.organization_name
                }



                ListInput.Customer_ID = entry.account_data.account_id
                ListInput.Customer_Name = entry.account_data.name
                ListInput.Cancel_Amount = Number(entry.cancel_line_items_total_amount)
                ListInput.Dist_Approval = entry.approved_status
                ListInput.Cancellation_Status = entry.cr_request_status



                //this.CancellDataPrepareArray.push(ListInput)


                this.datafoexpot1(ListInput)

              }


            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();
            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        Size = Size + 250;
        offset = offset + 250;
      }

    }
  }
  datafoexpot1(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'ReturnList');
      this.modalService.dismissAll();
    }
  }

  DataPrepareArray: any
  async etaReport() {
    this.DataPrepareArray = []
    if (this.count <= 250) {

      await this.MISService.GetEtatReport(this.data).subscribe(
        data => {

          if (data.Success == true) {

            for (let entry of data.data) {

              const ListInput: FinalData = {} as FinalData;
              ListInput.OTC_No = entry.otc_order_number
              ListInput.Order_No = entry.order_number
              ListInput.Customer_name = entry.account_name
              ListInput.Distributor_name = entry.distributor_name

              if (this.isdistributor == true) {
                ListInput.Distributor_name = entry.distributor_name
              }
              ListInput.Part_No = entry.part_number
              ListInput.Part_Desc = entry.part_desc
              ListInput.Quantity = Number(entry.total_quantity).toString()
              ListInput.Order_date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Expected_Delivery_date = this.datepipe.transform(entry.delivery_date, 'dd-MM-yyyy')
              this.DataPrepareArray.push(ListInput)

            }

            this.excelService.exportCancellationAsExcelFile(this.DataPrepareArray, 'EtaReport');
            this.isdiableeporrt = true

          }



          else {
            Swal.fire('Please try Again')
            this.isdiableeporrt = true

          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.isdiableeporrt = true
        }

      );
    }
    else {

      var Size = 250
      var offset = 0

      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        this.MISService.GetEtatReport(this.data).subscribe(

          data => {
            debugger

            if (data.success == true) {
              for (let entry of data.data) {
                const ListInput: FinalData = {} as FinalData;
                ListInput.OTC_No = entry.otc_order_number
                ListInput.Order_No = entry.order_number
                ListInput.Customer_name = entry.account_name
                ListInput.Distributor_name = entry.distributor_name

                if (this.isdistributor == true) {
                  ListInput.Distributor_name = entry.distributor_name
                }
                ListInput.Part_No = entry.part_number
                ListInput.Part_Desc = entry.part_desc
                ListInput.Quantity = Number(entry.total_quantity).toString()
                ListInput.Order_date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.Expected_Delivery_date = this.datepipe.transform(entry.delivery_date, 'dd-MM-yyyy')
                //ListInput.Datefosort = entry.order_date;
                this.etaReportM(ListInput)
              }
            }

            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();
            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        offset = offset + 250;
      }
    }
  }

  etaReportM(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {
      this.TemparrayALL.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.TemparrayALL.forEach(function (x) { delete x.SortDate });
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'EtaReport');
      this.modalService.dismissAll();
    }
  }

  async reportEOrder() {
    var rou = (Math.ceil(this.count / 250))
    // debugger;
    var offset = this.data.offset + 1

    for (let i = 0; i < rou; i++) {
      // this.data.offset = this.offset
      let createdEmployee = await this.OrderListService.OrderListnew(this.data);
      console.log(createdEmployee.data)
      if (createdEmployee.success == true) {

        var FinallGros = 0
        var FinalTax = 0
        var InvoiceTotal = 0
        for (let entry of createdEmployee.data) {
          console.log(entry)
          FinallGros = 0
          FinalTax = 0
          // var keys = Object.keys(entry.line_items);
          // var len = keys.length;
          // if (len > 0) {
          //   for (let entry1 of entry.line_items) {
          //     var Gross = entry1.GROSS_AMOUNT;
          //     var Tax = entry1.TOTAL_TAX_s;

          //     if (entry1.GROSS_AMOUNT == undefined || entry1.GROSS_AMOUNT == "" || entry1.GROSS_AMOUNT == NaN) {
          //       Gross = 0;
          //     }

          //     if (entry1.TOTAL_TAX_s == undefined || entry1.TOTAL_TAX_s == "" || entry1.TOTAL_TAX_s == NaN) {
          //       Tax = 0;
          //     }

          //     FinalTax = FinalTax + Number(Tax);
          //     FinallGros = FinallGros + Number(Gross);
          //   }
          // }

          // var keys = Object.keys(entry.invoice_order);
          // var len2 = keys.length;

          // InvoiceTotal = 0

          // if (len2 > 0) {
          //   for (let entry2 of entry.invoice_order) {

          //     var InvImt = entry2.INVOICE_AMT_s;

          //     if (entry2.STATUS_CD_s !== 'Cancelled') {
          //       if (entry2.INVOICE_AMT_s == undefined || entry2.INVOICE_AMT_s == "" || entry2.INVOICE_AMT_s == NaN) {
          //         InvImt = 0;
          //       }
          //       InvoiceTotal = InvoiceTotal + Number(InvImt);
          //     }
          //   }
          // }
          // else {
          //   InvoiceTotal = 0;
          // }

          const Input: ExportData = {} as ExportData;
          Input.Portal_Order_Number = entry.order_number

          Input.OTC_Number = entry.otc_number
          Input.Status = entry.status
          Input.Customer_Name = entry.account_name
          Input.Account_Id = entry.account_id
          Input.Distributor_Name = entry.distributor_name
          Input.Parts_Qty = entry.total_line_items_total_quantity


          Input.Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
          Input.OrderAmount = Number((entry.order_amount).toFixed(2))
          Input.InvoiceAmount = Number((entry.invoice_amount).toFixed(2))
          Input.Total_Invoice = entry.invoice_count
          Input.Region = entry.region
          Input.State = entry.state
          Input.PO_Number = entry.po_number
          Input.Accidental_Chassis_Number = entry.accedential_chassis_no
          Input.Accidental_Registration_No = entry.accedential_licence_no

          if (entry.payment_method == 'COD') { Input.Payment_Mode = 'On Credit' }
          else if (entry.payment_method == 'COD_LOYALTY') { Input.Payment_Mode = 'On Credit & Loyalty' }
          else if (entry.payment_method == 'WIRE_TRANSFER') { Input.Payment_Mode = 'Online Transfer' }
          else if (entry.payment_method == 'WIRE_TRANSFER_LOYALTY') { Input.Payment_Mode = 'Online Transfer & Loyalty' }
          else { Input.Payment_Mode = entry.payment_method_db }
          this.Datapepare(Input);
        }
      }


      offset = offset + 250
    }
  }

  testaay = []
  pendingcount: any = 0;
  Datapepare(aray) {
    debugger;
    this.testaay.push(aray)
    this.pendingcount = this.testaay.length
    if (this.testaay.length == this.count) {
      debugger;
      this.testaay.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.testaay.forEach(function (x) { delete x.SortDate });
      this.excelService.exportAsExcelFile(this.testaay, 'e-Dukaan Orders');
      this.isdiableeporrt = true
      this.modalService.dismissAll();
    }
  }

  async CRMreport() {
    var rou = (Math.ceil(this.count / 250))
    debugger;
    var offset = this.data.offset + 1
    for (let i = 0; i < rou; i++) {
      let createdEmployee = await this.OrderListService.OrderListnew(this.data);
      if (createdEmployee.success == true) {
        var FinallGros = 0
        var FinalTax = 0
        var InvoiceTotal = 0
        for (let entry of createdEmployee.data) {
          console.log(entry)
          FinallGros = 0
          FinalTax = 0
          // var keys = Object.keys(entry.line_items);
          // var len = keys.length;
          // if (len > 0) {
          //   for (let entry1 of entry.line_items) {
          //     var Gross = entry1.GROSS_AMOUNT;
          //     var Tax = entry1.TOTAL_TAX_s;

          //     if (entry1.GROSS_AMOUNT == undefined || entry1.GROSS_AMOUNT == "" || entry1.GROSS_AMOUNT == NaN) {
          //       Gross = 0;
          //     }

          //     if (entry1.TOTAL_TAX_s == undefined || entry1.TOTAL_TAX_s == "" || entry1.TOTAL_TAX_s == NaN) {
          //       Tax = 0;
          //     }

          //     FinalTax = FinalTax + Number(Tax);
          //     FinallGros = FinallGros + Number(Gross);
          //   }
          // }

          // var keys = Object.keys(entry.invoice_order);
          // var len2 = keys.length;

          // InvoiceTotal = 0

          // if (len2 > 0) {
          //   for (let entry2 of entry.invoice_order) {

          //     var InvImt = entry2.INVOICE_AMT_s;

          //     if (entry2.STATUS_CD_s !== 'Cancelled') {
          //       if (entry2.INVOICE_AMT_s == undefined || entry2.INVOICE_AMT_s == "" || entry2.INVOICE_AMT_s == NaN) {
          //         InvImt = 0;
          //       }
          //       InvoiceTotal = InvoiceTotal + Number(InvImt);
          //     }
          //   }
          // }
          // else {
          //   InvoiceTotal = 0;
          // }

          const Input: ExportData = {} as ExportData;

          Input.OTC_Number = entry.otc_number
          Input.Customer_Name = entry.account_name
          Input.Account_Id = entry.account_id


          Input.Distributor_Name = entry.distributor_name
          Input.OrderAmount = Number((entry.order_amount).toFixed(2))
          // Input.InvoiceAmount = Number((entry.invoice_amount).toFixed(2))
          Input.Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
          Input.Status = entry.status
          this.DatapepareCRM(Input);

        }
      }
      else {
        Swal.fire('Please try Again')
        this.modalService.dismissAll();
      }
    } (err) => {
      Swal.fire('Please try Again')
      this.modalService.dismissAll();
    }

    offset = offset + 250
  }


  DatapepareCRM(aray) {
    this.testaay.push(aray)
    this.pendingcount = this.testaay.length
    if (this.testaay.length == this.count) {
      debugger;
      this.testaay.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.testaay.forEach(function (x) { delete x.SortDate });
      this.excelService.exportAsExcelFile(this.testaay, 'CRM Orders');
    }
    this.isdiableeporrt = true
    this.modalService.dismissAll();
  }

  async poList() {
    debugger
    if (this.count <= 250) {

      await this.OrderListService.PoOrderList(this.data).subscribe(

        data => {
          debugger

          if (data.success == true) {



            for (let entry of data.data) {

              const ListInput: PoInput = {} as PoInput;

              ListInput.Po_Number = entry.po_number
              ListInput.OTC_Number = entry.otc_number
              //  ListInput.Order_Status = entry.order_status

              ListInput.Customer_Name = entry.account_name

              ListInput.Division_Name = entry.ord_division_name
              // if (this.isdivision_Name == false) {
              //   ListInput.Division_Name = entry.ord_division_name
              // }

              if (this.isdistributor == false) {
                ListInput.Distributor_Name = entry.organization_name
              }
              ListInput.Sap_Order_Number = entry.sap_order_number


              // ListInput.CreatedDate = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')
              //ListInput.UpadteDate = this.datepipe.transform(entry.update_at, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.OrderDate = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Order_Status = entry.order_status


              this.PolistExcel(ListInput)
            }

            // for (let entry of data.total_result) {

            //   const ListInput: PoInput = {} as PoInput;

            //   ListInput.Po_Number = entry.po_number
            //   ListInput.OTC_Number = entry.otc_number


            //   ListInput.Customer_Name = entry.account_name
            //   ListInput.Division_Name = entry.ord_division_name
            //   if (this.isdivision_Name == false) {
            //     ListInput.Division_Name = entry.ord_division_name
            //   }

            //   if (this.isdistributor == false) {
            //     ListInput.Distributor_Name = entry.organization_name
            //   }

            //   ListInput.Sap_Order_Number = entry.sap_order_number



            //   ListInput.OrderDate = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
            //   ListInput.Order_Status = entry.order_status




            //   this.TemparrayALL.push(ListInput)
            // }

            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'POList');
            this.modalService.dismissAll();
          }
          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        }, (err) => {

          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {
      var limit = 250
      var offset = 0
      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        await this.OrderListService.PoOrderList(this.data).subscribe(

          data => {


            if (data.success == true) {

              for (let entry of data.total_result) {
                const ListInput: PoInput = {} as PoInput;

                ListInput.Po_Number = entry.po_number
                ListInput.OTC_Number = entry.otc_number
                //  ListInput.Order_Status = entry.order_status

                ListInput.Customer_Name = entry.account_name

                ListInput.Division_Name = entry.ord_division_name
                // if (this.isdivision_Name == false) {
                //   ListInput.Division_Name = entry.ord_division_name
                // }

                if (this.isdistributor == false) {
                  ListInput.Distributor_Name = entry.organization_name
                }
                ListInput.Sap_Order_Number = entry.sap_order_number


                // ListInput.CreatedDate = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')
                //ListInput.UpadteDate = this.datepipe.transform(entry.update_at, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.OrderDate = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.Order_Status = entry.order_status


                this.PolistExcel(ListInput)
              }
            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();
            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        limit = limit + 250;
        offset = offset + 250;
      }
    }
  }

  PolistExcel(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length
    if (this.TemparrayALL.length == this.count) {
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'POList');
      this.modalService.dismissAll();
    }

  }
  // async poList() {
  //   if (this.count <= 250) {

  //     await this.OrderListService.PoOrderList(this.data).subscribe(

  //       data => {
  //         debugger



  //         if (data.success == true) {

  //           for (let entry of data.data.result) {

  //             const ListInput: ExpotInputdata = {} as ExpotInputdata;

  //             ListInput.po_number = entry.po_number
  //             ListInput.otc_number = entry.otc_number

  //             ListInput.sap_order_number = entry.sap_order_number



  //             ListInput.customer_name = entry.bill_to_account_name
  //             ListInput.Distributor_Name = entry.organization_name
  //             ListInput.division_name = entry.ord_division_name

  //             ListInput.order_date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
  //             ListInput.order_status = entry.order_status

  //             this.TemparrayALL.push(ListInput)
  //           }

  //           this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'FeedbackList');
  //           this.modalService.dismissAll();
  //         }
  //         else {
  //           Swal.fire('Please try Again')
  //           this.modalService.dismissAll();
  //         }
  //       }, (err) => {

  //         Swal.fire('Please try Again')
  //         this.modalService.dismissAll();
  //       }
  //     );
  //   }
  //   else {
  //     var limit = 250
  //     var offset = 0
  //     var rou = (Math.ceil(this.count / 250))

  //     for (let i = 0; i < rou; i++) {

  //       await this.OrderListService.PoOrderList(this.data).subscribe(

  //         data => {
  //           debugger

  //           if (data.success == true) {

  //             // for (let entry of data.data.result) {

  //               // const ListInput: feedback = {} as feedback;

  //               // ListInput.Invoice_No = entry.invoice_no
  //               // ListInput.OTC_Number = entry.otc_order_number
  //               // ListInput.Portal_Order_No = entry.order_no

  //               // ListInput.Customer_Name = entry.account_data.name

  //               // if (this.isdistributor == false) {
  //               //   ListInput.Distributor_Name = entry.org_name
  //               // }




  //             //   this.polistExcel(ListInput)
  //             // }
  //           }
  //           else {
  //             Swal.fire('Please try Again')
  //             this.modalService.dismissAll();
  //           }
  //         }, (err) => {
  //           Swal.fire('Please try Again')
  //           this.modalService.dismissAll();
  //         }
  //       );
  //       //const size = size + 250;
  //       offset = offset + 250;
  //     }
  //   }
  // }

  // polistExcel(ListInput) {
  //   this.TemparrayALL.push(ListInput)
  //   this.pendingcount = this.TemparrayALL.length
  //   if (this.TemparrayALL.length == this.count) {
  //     this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'POList');
  //     this.modalService.dismissAll();
  //   }
  // }

  // closeModal() {
  //   this.closemodal.emit();
  // }
  TemparrayALL = [];
  async TrackingAll() {
    this.TemparrayALL = [];
    debugger;
    var offset = this.data.offset + 1
    if (this.count <= 250) {

      this.OrderListService.OrderTrackingALlList(this.data).subscribe(
        data => {
          if (data.success == true) {

            for (let entry1 of data.data) {
              // console.log("entry1",entry1)
              const ExportArrayInput1: ExportArrayALL = {} as ExportArrayALL;
              ExportArrayInput1.Order_No = entry1.order_number
              ExportArrayInput1.OTC_No = entry1.otc_number
              ExportArrayInput1.Invoice_No = entry1.invoice_no
              ExportArrayInput1.Customer_name = entry1.account_data.name
              ExportArrayInput1.Account_Id = entry1.account_id

              ExportArrayInput1.Distributor_Name = entry1.org_name
              ExportArrayInput1.Order_Date = this.datepipe.transform(entry1.order_date, 'dd-MM-yyyy hh:mm:ss a')
              ExportArrayInput1.Invoice_Date = this.datepipe.transform(entry1.invoice_date, 'dd-MM-yyyy hh:mm:ss a')
              ExportArrayInput1.Order_Amount = Math.round(entry1.order_amount)
              ExportArrayInput1.Invoice_Amount = Math.round(entry1.invoice_amount)
              ExportArrayInput1.Last_Status_Update = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')

              if (entry1.payment_method == 'COD') { ExportArrayInput1.Payment_Mode = 'On Credit' }
              else if (entry1.payment_method == 'COD_LOYALTY') { ExportArrayInput1.Payment_Mode = 'On Credit & Loyalty' }
              else if (entry1.payment_method == 'WIRE_TRANSFER') { ExportArrayInput1.Payment_Mode = 'Online Transfer' }
              else if (entry1.payment_method == 'WIRE_TRANSFER_LOYALTY') { ExportArrayInput1.Payment_Mode = 'Online Transfer & Loyalty' }
              else { ExportArrayInput1.Payment_Mode = entry1.payment_method }

              if (this.fileType == "Delayed") {
                var WaitHours = entry1.waiting_hours
                var Output

                if (WaitHours <= 0) {
                  Output = 0 + ' Hours'

                }
                else if (WaitHours > 0 && WaitHours <= 8) {
                  Output = WaitHours.toFixed(0) + ' Hours'

                }

                else if (WaitHours > 8 && WaitHours <= 12) {
                  Output = WaitHours.toFixed(0) + ' Hours'

                }
                else if (WaitHours > 12 && WaitHours <= 24) {
                  Output = WaitHours.toFixed(0) + ' Hours'

                }
                else if (WaitHours > 24) {
                  Output = (Number(WaitHours) / 24).toFixed(0) + ' Days'

                }
                // ExportArrayInput1.Pending_Since = Output
              }
              ExportArrayInput1.Status = entry1.invoice_status
              // ExportArrayInput1.Order_Tracking_Status = this.titlecasePipe.transform(entry1.invoice_status)

              this.pendingcount = this.TemparrayALL.length;
              this.TemparrayALL.push(ExportArrayInput1)


            }
            // this.excelService.exportAllAsExcelFileTracking(this.TemparrayALL, ListInput1.order_status);
            this.excelService.exportAllAsExcelFileTracking(this.TemparrayALL, this.fileType);
            this.modalService.dismissAll();

            // this.isdiableeporrt = true
          }



          else {
            this.modalService.dismissAll();
            // Swal.fire('Please try Again')
            // this.isdiableeporrt = true
          }
        }, (err) => {
          this.modalService.dismissAll();
          // Swal.fire('Please try Again')
          // this.isdiableeporrt = true
        }
      );
    }
    else {
      // var Size = 250
      // var offset = 0

      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        // ListInput1.offset = offset
        // ListInput1.size = Size

        this.OrderListService.OrderTrackingALlList(this.data).subscribe(
          data => {

            if (data.success == true) {

              for (let entry1 of data.data) {

                const ExportArrayInput1: ExportArrayALL = {} as ExportArrayALL;

                ExportArrayInput1.Order_No = entry1.order_number
                ExportArrayInput1.OTC_No = entry1.otc_number
                ExportArrayInput1.Invoice_No = entry1.invoice_no
                ExportArrayInput1.Customer_name = entry1.account_data.name
                ExportArrayInput1.Account_Id = entry1.account_id

                ExportArrayInput1.Distributor_Name = entry1.org_name
                ExportArrayInput1.Order_Date = this.datepipe.transform(entry1.order_date, 'dd-MM-yyyy hh:mm:ss a')
                ExportArrayInput1.Invoice_Date = this.datepipe.transform(entry1.invoice_date, 'dd-MM-yyyy hh:mm:ss a')
                ExportArrayInput1.Order_Amount = Math.round(entry1.order_amount)
                ExportArrayInput1.Invoice_Amount = Math.round(entry1.invoice_amount)
                ExportArrayInput1.Last_Status_Update = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')
                ExportArrayInput1.Datefosort = entry1.order_date;
                if (this.fileType == "Delayed") {
                  var WaitHours = entry1.waiting_hours
                  var Output

                  if (WaitHours <= 0) {
                    Output = 0 + ' Hours'

                  }
                  else if (WaitHours > 0 && WaitHours <= 8) {
                    Output = WaitHours.toFixed(0) + ' Hours'

                  }

                  else if (WaitHours > 8 && WaitHours <= 12) {
                    Output = WaitHours.toFixed(0) + ' Hours'

                  }
                  else if (WaitHours > 12 && WaitHours <= 24) {
                    Output = WaitHours.toFixed(0) + ' Hours'

                  }
                  else if (WaitHours > 24) {
                    Output = (Number(WaitHours) / 24).toFixed(0) + ' Days'

                  }
                  //ExportArrayInput1.Pending_Since = Output
                }
                ExportArrayInput1.Status = entry1.invoice_status
                // ExportArrayInput1.Order_Tracking_Status = this.titlecasePipe.transform(entry1.invoice_status)

                //    this.TemparrayALL.push(ExportArrayInput1)

                this.dataprepareAllTracking(ExportArrayInput1, this.fileType);

              }
              // this.excelService.exportAllAsExcelFileTracking(this.TemparrayALL, fileType);
              // this.loader.close()
            }

            else {
              Swal.fire('Please try Again')
              // this.isdiableeporrt = true
            }
          }, (err) => {
            Swal.fire('Please try Again')
            // this.isdiableeporrt = true
          }

        );
        offset = offset + 250
      }
    }
  }

  isdiableeporrt: any
  dataprepareAllTracking(Data, type) {
    this.TemparrayALL.push(Data)
    this.pendingcount = this.TemparrayALL.length
    if (this.TemparrayALL.length == this.count) {
      this.TemparrayALL.sort((a: any, b: any) => { return Date.parse(b.Datefosort) - Date.parse(a.Datefosort) });
      this.TemparrayALL.forEach(function (x) { delete x.Datefosort });
      this.excelService.exportAsExcelFile(this.TemparrayALL, type);
      this.modalService.dismissAll();
    }
  }

  // Temparray = [];
  async Tracking() {
    this.TemparrayALL = [];
    this.OrderListService.OrderTrackingList(this.data).subscribe(
      data => {

        if (data.success == true) {

          for (let entry1 of data.data) {
            const ExportArrayInput: ExportArray = {} as ExportArray;

            var WaitHours = entry1.waiting_hours
            var Output

            if (WaitHours <= 0) {
              Output = 0 + ' Hours'

            }
            else if (WaitHours > 0 && WaitHours <= 8) {
              Output = WaitHours.toFixed(0) + ' Hours'

            }

            else if (WaitHours > 8 && WaitHours <= 12) {
              Output = WaitHours.toFixed(0) + ' Hours'

            }
            else if (WaitHours > 12 && WaitHours <= 24) {
              Output = WaitHours.toFixed(0) + ' Hours'

            }
            else if (WaitHours > 24) {
              Output = (Number(WaitHours) / 24).toFixed(0) + ' Days'
            }
            ExportArrayInput.Order_No = entry1.order_number;

            ExportArrayInput.OTC_No = entry1.otc_order_number
            ExportArrayInput.Invoice_no = entry1.invoice_no;
            ExportArrayInput.Customer_Name = entry1.account_name
            ExportArrayInput.Account_Id = entry1.account_id
            ExportArrayInput.Distributor_Name = entry1.organization_name
            ExportArrayInput.Order_date = this.datepipe.transform(entry1.order_date, 'dd-MM-yyyy hh:mm:ss a')
            if (this.data.invoice_status == "out for Delivery") {
              ExportArrayInput.Out_For_Delivery_date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')

            }
            else if (this.data.invoice_status == "delivered") {
              ExportArrayInput.Delivered_date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')
            }
            else if (this.data.invoice_status == "invoiced") {
              ExportArrayInput.Invoice_Date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')
            }

            else {
              ExportArrayInput.Out_For_Delivery_Date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')
            }

            ExportArrayInput.Order_amount = Math.round(entry1.order_amount)
            ExportArrayInput.Invoice_amount = Math.round(entry1.invoice_amount)


            if (this.data.invoice_status == "delivered" || this.data.invoice_status == "Cancelled") {
            } else {
              ExportArrayInput.Pending_Since = Output;
            }


            if (entry1.payment_method == 'COD') { ExportArrayInput.Payment_Mode = 'On Credit' }
            else if (entry1.payment_method == 'COD_LOYALTY') { ExportArrayInput.Payment_Mode = 'On Credit & Loyalty' }
            else if (entry1.payment_method == 'WIRE_TRANSFER') { ExportArrayInput.Payment_Mode = 'Online Transfer' }
            else if (entry1.payment_method == 'WIRE_TRANSFER_LOYALTY') { ExportArrayInput.Payment_Mode = 'Online Transfer & Loyalty' }
            else { ExportArrayInput.Payment_Mode = entry1.payment_method }
            ExportArrayInput.Status = entry1.invoice_status

            this.TemparrayALL.push(ExportArrayInput)




          }






          this.excelService.exportAsExcelFileTracking(this.TemparrayALL, this.data.invoice_status);



          this.modalService.dismissAll();

        }
        else {
          Swal.fire('No Data for export.')
          this.modalService.dismissAll();
        }
      }, (err) => {
        this.modalService.dismissAll();
      }

    );

  }


  async trackingDelivery() {
    this.TemparrayALL = []
    if (this.count <= 250) {
      await this.OrderListService.OrderTrackingList(this.data).subscribe(
        data => {
          debugger;
          if (data.success == true) {

            for (let entry1 of data.data) {

              const ExportArrayInput: ExportArray = {} as ExportArray;

              var WaitHours = entry1.waiting_hours
              var Output

              if (WaitHours <= 0) {
                Output = 0 + ' Hours'

              }
              else if (WaitHours > 0 && WaitHours <= 8) {
                Output = WaitHours.toFixed(0) + ' Hours'
              }

              else if (WaitHours > 8 && WaitHours <= 12) {
                Output = WaitHours.toFixed(0) + ' Hours'
              }
              else if (WaitHours > 12 && WaitHours <= 24) {
                Output = WaitHours.toFixed(0) + ' Hours'

              }
              else if (WaitHours > 24) {
                Output = (Number(WaitHours) / 24).toFixed(0) + ' Days'

              }

              ExportArrayInput.Order_No = entry1.order_number;

              ExportArrayInput.OTC_No = entry1.otc_order_number;
              ExportArrayInput.Invoice_no = entry1.invoice_no;
              ExportArrayInput.Customer_Name = entry1.account_name
              ExportArrayInput.Account_ID = entry1.account_id;

              ExportArrayInput.Distributor_Name = entry1.organization_name


              //ExportArrayInput.Distributor_Name = entry1.org_name
              ExportArrayInput.Order_date = this.datepipe.transform(entry1.order_date, 'dd-MM-yyyy hh:mm:ss a')
              if (this.data.invoice_status == "out for delivery") {
                ExportArrayInput.Out_For_Delivery_date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')

              }
              else if (this.data.invoice_status == "delivered") {
                ExportArrayInput.Delivered_date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')
              }

              else {
                ExportArrayInput.Cancelled_Date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')
              }

              ExportArrayInput.Order_amount = Math.round(entry1.order_amount)
              ExportArrayInput.Invoice_amount = Math.round(entry1.invoice_amount)

              //  ExportArrayInput.Division_ID = entry1.div_id
              //  ExportArrayInput.Division_Name = entry1.div_name;
              if (this.data.invoice_status == "delivered" || this.data.invoice_status == "Cancelled") {
              } else {
                ExportArrayInput.Pending_Since = Output;
              }




              if (entry1.payment_method == 'COD') { ExportArrayInput.Payment_Mode = 'On Credit' }
              else if (entry1.payment_method == 'COD_LOYALTY') { ExportArrayInput.Payment_Mode = 'On Credit & Loyalty' }
              else if (entry1.payment_method == 'WIRE_TRANSFER') { ExportArrayInput.Payment_Mode = 'Online Transfer' }
              else if (entry1.payment_method == 'WIRE_TRANSFER_LOYALTY') { ExportArrayInput.Payment_Mode = 'Online Transfer & Loyalty' }
              else { ExportArrayInput.Payment_Mode = entry1.payment_method }
              // ExportArrayInput.Status = this.titlecasePipe.transform(entry1.invoice_status)
              ExportArrayInput.Status = entry1.invoice_status

              this.TemparrayALL.push(ExportArrayInput)
            }

            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'Delivered');
            this.modalService.dismissAll();

          }

          else {
            Swal.fire('Please try Again')
            // this.modalService.dismissAll();
          }
        }, (err) => {

          Swal.fire('Please try Again')
          //this.modalService.dismissAll();
        }
      );
      //this.modalService.dismissAll();
    }
    else {
      var rou = (Math.ceil(this.count / 250))
      for (let i = 0; i < rou; i++) {

        await this.OrderListService.OrderTrackingList(this.data).subscribe(

          data => {

            if (data.success == true) {

              for (let entry1 of data.data) {

                const ExportArrayInput: ExportArray = {} as ExportArray;


                var WaitHours = entry1.waiting_hours
                var Output

                if (WaitHours <= 0) {
                  Output = 0 + ' Hours'
                }
                else if (WaitHours > 0 && WaitHours <= 8) {
                  Output = WaitHours.toFixed(0) + ' Hours'
                }

                else if (WaitHours > 8 && WaitHours <= 12) {
                  Output = WaitHours.toFixed(0) + ' Hours'

                }
                else if (WaitHours > 12 && WaitHours <= 24) {
                  Output = WaitHours.toFixed(0) + ' Hours'

                }
                else if (WaitHours > 24) {
                  Output = (Number(WaitHours) / 24).toFixed(0) + ' Days'

                }

                ExportArrayInput.Order_No = entry1.order_number;

                ExportArrayInput.OTC_No = entry1.otc_order_number;
                ExportArrayInput.Invoice_no = entry1.invoice_no;
                ExportArrayInput.Customer_Name = entry1.account_name
                ExportArrayInput.Account_ID = entry1.account_id;
                ExportArrayInput.Distributor_Name = entry1.organization_name


                // ExportArrayInput.Distributor_Name = entry1.org_name
                ExportArrayInput.Order_date = this.datepipe.transform(entry1.order_date, 'dd-MM-yyyy hh:mm:ss a')
                if (this.data.invoice_status == "out for delivery") {
                  ExportArrayInput.Out_For_Delivery_date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')

                }
                else if (this.data.invoice_status == "delivered") {
                  ExportArrayInput.Delivered_date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')
                }

                else {
                  ExportArrayInput.Cancelled_Date = this.datepipe.transform(entry1.tracking_date, 'dd-MM-yyyy hh:mm:ss a')
                }

                ExportArrayInput.Tackdatefosot = entry1.tracking_date


                ExportArrayInput.Order_amount = Math.round(entry1.order_amount)
                ExportArrayInput.Invoice_amount = Math.round(entry1.invoice_amount)

                //  ExportArrayInput.Division_ID = entry1.div_id
                // ExportArrayInput.Division_Name = entry1.div_name;
                if (this.data.invoice_status == "delivered" || this.data.invoice_status == "Cancelled") {
                } else {
                  ExportArrayInput.Pending_Since = Output;
                }

                // ExportArrayInput.Status = this.titlecasePipe.transform(entry1.invoice_status)
                ExportArrayInput.Status = entry1.invoice_status

                // this.pepaeDate(ExportArrayInput, this.data.invoice_status)
                // this.deliveryExcel(ExportArrayInput, this.fileType);

                this.peparDataDelivery(ListInput)

              }
              // this.excelService.exportAsExcelFileTracking(this.TemparrayNew, ListInput.invoice_status);
            }

            else {
              //Swal.fire('Please try Again')
              this.modalService.dismissAll();

            }
          }, (err) => {
            // Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );

        // Size = Size + 250;
        //offset = offset + 250;
      }
    }
  }



  async deliveryTimeLine() {
    if (this.count <= 250) {

      await this.MISService.Deliverytimeline(this.data).subscribe(

        data => {
          debugger
          if (data.success == true) {
            for (let entry of data.data) {
              const ListInput: DeliveryData = {} as DeliveryData;
              ListInput.OTC_Number = entry.otc_order_number
              //ListInput.Order_Date= entry.order_date
              ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Order_Amount = Number(entry.order_total_amount)
              ListInput.Order_Month_Year = entry.order_month_year
              ListInput.Account_ID = entry.account_id

              ListInput.Customer_Name = entry.account_data.name
              ListInput.Distributor_Name = entry.org_name
              ListInput.Latest_Delivery_Timelines = entry.latest_delivery_timeline_in_hrs
              ListInput.Amt_of_order_value_invoiced = Number(entry.order_value_invoiced)
              ListInput.Amt_of_value_delivered_upto_24_hrs = Number(entry.day_ago_invoice_amt)
              ListInput.Amt_of_value_delivered_in_24_48_hrs = Number(entry.two_days_ago_invoice_amt)
              ListInput.Amt_of_value_delivered_in_48_72_hrs = Number(entry.three_days_ago_invoice_amt)
              ListInput.Amt_of_value_delivered_upto_72_hrs = Number(entry.day_ago_invoice_amt) + Number(entry.two_days_ago_invoice_amt) + Number(entry.three_days_ago_invoice_amt)
              ListInput.Amt_of_value_delivered_more_than_72_hrs = Number(entry.long_time_ago_invoice_amt)
              ListInput.Amt_of_value_Invoiced_but_not_delivered = Number(entry.order_value_exclude_delivery)
              ListInput.Percentage_of_order_value_invoiced = entry.order_value_invoiced_perc
              ListInput.Percentage_of_value_delivered_upto_24_hrs = entry.day_ago_invoice_amt_perc
              ListInput.Percentage_of_value_delivered_in_24_48_hrs = entry.two_days_ago_invoice_amt_perc
              ListInput.Percentage_of_value_delivered_in_48_72_hrs = entry.three_days_ago_invoice_amt_perc
              ListInput.Percentage_of_value_delivered_upto_72_hrs = Number(entry.day_ago_invoice_amt_perc) + Number(entry.two_days_ago_invoice_amt_perc) + Number(entry.three_days_ago_invoice_amt_perc)
              ListInput.Percentage_of_value_delivered_more_than_72_hrs = entry.long_time_ago_invoice_amt_perc
              ListInput.Percentage_of_value_Invoiced_but_not_delivered = entry.order_value_perc_exclude_delivery
              ListInput.Cancelled_invoice_count = Number(entry.total_cancelled)
              this.TemparrayALL.push(ListInput)

            }

            //this.loader.close();
            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'DeliveryTimeline');
            this.modalService.dismissAll();

          }

          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        }, (err) => {
          //Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {

      var Size = 250
      var offset = 0

      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        this.MISService.Deliverytimeline(this.data).subscribe(

          data => {
            debugger
            if (data.success == true) {

              for (let entry of data.data) {
                const ListInput: DeliveryData = {} as DeliveryData;
                ListInput.OTC_Number = entry.otc_order_number
                //ListInput.Order_Date= entry.order_date
                ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.SortDate = entry.Order_Date
                ListInput.Order_Amount = Number(entry.order_total_amount)
                ListInput.Order_Month_Year = entry.order_month_year
                ListInput.Account_ID = entry.account_id

                ListInput.Customer_Name = entry.account_data.name
                ListInput.Distributor_Name = entry.org_name
                ListInput.Latest_Delivery_Timelines = entry.latest_delivery_timeline_in_hrs

                ListInput.Amt_of_order_value_invoiced = Number(entry.order_value_invoiced)
                ListInput.Amt_of_value_delivered_upto_24_hrs = Number(entry.day_ago_invoice_amt)
                ListInput.Amt_of_value_delivered_in_24_48_hrs = Number(entry.two_days_ago_invoice_amt)
                ListInput.Amt_of_value_delivered_in_48_72_hrs = Number(entry.three_days_ago_invoice_amt)
                ListInput.Amt_of_value_delivered_upto_72_hrs = Number(entry.day_ago_invoice_amt) + Number(entry.two_days_ago_invoice_amt) + Number(entry.three_days_ago_invoice_amt)
                ListInput.Amt_of_value_delivered_more_than_72_hrs = Number(entry.long_time_ago_invoice_amt)
                ListInput.Amt_of_value_Invoiced_but_not_delivered = Number(entry.order_value_exclude_delivery)

                ListInput.Percentage_of_order_value_invoiced = entry.order_value_invoiced_perc
                ListInput.Percentage_of_value_delivered_upto_24_hrs = entry.day_ago_invoice_amt_perc
                ListInput.Percentage_of_value_delivered_in_24_48_hrs = entry.two_days_ago_invoice_amt_perc
                ListInput.Percentage_of_value_delivered_in_48_72_hrs = entry.three_days_ago_invoice_amt_perc
                ListInput.Percentage_of_value_delivered_upto_72_hrs = Number(entry.day_ago_invoice_amt_perc) + Number(entry.two_days_ago_invoice_amt_perc) + Number(entry.three_days_ago_invoice_amt_perc)
                ListInput.Percentage_of_value_delivered_more_than_72_hrs = entry.long_time_ago_invoice_amt_perc
                ListInput.Percentage_of_value_Invoiced_but_not_delivered = entry.order_value_perc_exclude_delivery

                //  ListInput.id= Number(entry.id)
                ListInput.Cancelled_invoice_count = Number(entry.total_cancelled)

                this.peparDataDelivery(ListInput)
              }
            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();

            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        // Size = Size + 250;
        offset = offset + 250;
      }
    }
  }

  peparDataDelivery(ListInput) {

    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {
      this.TemparrayALL.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.TemparrayALL.forEach(function (x) { delete x.SortDate });
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'DeliveryTimeline');
      this.modalService.dismissAll();
    }

  }

  async invoiceTimeLine() {

    if (this.count <= 250) {

      await this.MISService.Invoicetimeline(this.data).subscribe(

        data => {
          debugger

          if (data.success == true) {
            for (let entry of data.data) {
              const ListInput: invoiceData = {} as invoiceData;
              ListInput.OTC_Number = entry.otc_order_number
              //ListInput.Order_Date= entry.order_date
              ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Order_Amount = Number(entry.order_total_amount)
              ListInput.Order_Month_Year = entry.order_month_year
              ListInput.Account_ID = entry.account_id

              ListInput.Customer_Name = entry.account_data.name
              ListInput.Distributor_Name = entry.org_name
              ListInput.Latest_invoicing_Timelines_Hrs = entry.latest_invoicing_timeline_in_hrs
              ListInput.Amt_of_order_value_invoiced = Number(entry.order_value_invoiced)
              ListInput.Amt_of_value_Invoiced_upto_24_hrs = Number(entry.day_ago_invoice_amt)
              ListInput.Amt_of_value_Invoiced_in_24_48_hrs = Number(entry.two_days_ago_invoice_amt)
              ListInput.Amt_of_value_Invoiced_upto_48_hrs = Number(entry.day_ago_invoice_amt) + Number(entry.two_days_ago_invoice_amt)
              ListInput.Amt_of_value_Invoiced_in_48_72_hrs = Number(entry.three_days_ago_invoice_amt)
              ListInput.Amt_of_value_Invoiced_more_than_72_hrs = Number(entry.long_time_ago_invoice_amt)
              //   ListInput.Percentage_of_order_value_invoicedof_value_Invoiced_but_not_delivered_Amount= entry.order_value_exclude_delivery
              ListInput.Percentage_of_order_value_invoiced = entry.order_value_invoiced_perc
              ListInput.Percentage_of_value_Invoiced_upto_24_hrs = entry.day_ago_invoice_amt_perc
              ListInput.Percentage_of_value_Invoiced_in_24_48_hrs = entry.two_days_ago_invoice_amt_perc
              ListInput.Percentage_of_value_Invoiced_upto_48_hrs = Number(entry.day_ago_invoice_amt_perc) + Number(entry.two_days_ago_invoice_amt_perc)
              ListInput.Percentage_of_value_Invoiced_in_48_72_hrs = entry.three_days_ago_invoice_amt_perc
              ListInput.Percentage_of_value_Invoiced_more_than_72_hrs = entry.long_time_ago_invoice_amt_perc
              // ListInput.Percentage_of_order_value_invoicedof_value_Invoiced_but_not_delivered= entry.order_value_perc_exclude_delivery
              ListInput.Cancelled_invoice_count = Number(entry.total_cancelled)
              this.TemparrayALL.push(ListInput)
            }

            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'InvoicingTimeLine');
            this.modalService.dismissAll();
          }

          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();

          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {
      var Size = 250
      var offset = 0
      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        this.MISService.Invoicetimeline(this.data).subscribe(

          data => {
            debugger

            if (data.success == true) {

              for (let entry of data.data) {
                const ListInput: invoiceData = {} as invoiceData;

                ListInput.OTC_Number = entry.otc_order_number
                // ListInput.Order_Date= entry.order_date
                ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.SortDate = entry.Order_Date
                ListInput.Order_Amount = Number(entry.order_total_amount)
                ListInput.Order_Month_Year = entry.order_month_year
                ListInput.Account_ID = entry.account_id

                ListInput.Customer_Name = entry.account_data.name
                ListInput.Distributor_Name = entry.org_name
                ListInput.Latest_invoicing_Timelines_Hrs = entry.latest_invoicing_timeline_in_hrs
                ListInput.Amt_of_order_value_invoiced = Number(entry.order_value_invoiced)
                ListInput.Amt_of_value_Invoiced_upto_24_hrs = Number(entry.day_ago_invoice_amt)
                ListInput.Amt_of_value_Invoiced_in_24_48_hrs = Number(entry.two_days_ago_invoice_amt)
                ListInput.Amt_of_value_Invoiced_upto_48_hrs = Number(entry.day_ago_invoice_amt) + Number(entry.two_days_ago_invoice_amt)
                ListInput.Amt_of_value_Invoiced_in_48_72_hrs = Number(entry.three_days_ago_invoice_amt)
                ListInput.Amt_of_value_Invoiced_more_than_72_hrs = Number(entry.long_time_ago_invoice_amt)
                // ListInput.Percentage_of_order_value_invoicedof_value_Invoiced_but_not_delivered_Amount= entry.order_value_exclude_delivery
                ListInput.Percentage_of_order_value_invoiced = entry.order_value_invoiced_perc
                ListInput.Percentage_of_value_Invoiced_upto_24_hrs = entry.day_ago_invoice_amt_perc
                ListInput.Percentage_of_value_Invoiced_in_24_48_hrs = entry.two_days_ago_invoice_amt_perc
                ListInput.Percentage_of_value_Invoiced_upto_48_hrs = Number(entry.day_ago_invoice_amt_perc) + Number(entry.two_days_ago_invoice_amt_perc)
                ListInput.Percentage_of_value_Invoiced_in_48_72_hrs = entry.three_days_ago_invoice_amt_perc
                ListInput.Percentage_of_value_Invoiced_more_than_72_hrs = entry.long_time_ago_invoice_amt_perc

                ListInput.Cancelled_invoice_count = Number(entry.total_cancelled)

                this.dataInvoice(ListInput)
              }
            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();

            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        //Size = Size + 250;
        offset = offset + 250;
      }
    }
  }

  dataInvoice(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {
      this.TemparrayALL.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.TemparrayALL.forEach(function (x) { delete x.SortDate });
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'InvoicingTimeLine');
      this.modalService.dismissAll();
    }
  }

  async orderDetailsMIS() {
    if (this.count <= 250) {

      await this.MISService.PartwiseList(this.data).subscribe(
        data => {

          if (data.Success == true) {

            for (let entry of data.data) {

              const ListInput: orderMis = {} as orderMis;

              ListInput.Month_Year = entry.month_year
              ListInput.State = entry.state
              ListInput.Distributor_name = entry.


                ListInput.Customer_name = entry.account_data.
                  ListInput.Account_ID = entry.account_id
              ListInput.Order_No = entry.edukan_orders
              ListInput.Order_Status = entry.status
              ListInput.OTC_No = entry.otc_number
              ListInput.Order_Date = entry.order_date//  this.datepipe.transform(entry.order_date, 'dd-MM-yyyy')//entry.order_date
              ListInput.Part_No = entry.part_number
              ListInput.Part_Status = entry.order_status
              ListInput.Part_Desc = entry.part_desc

              ListInput.Order_Quantity = Number(entry.order_quantity)
              // ListInput.Pending = Number(entry.pending)
              ListInput.Pending = Number(entry.pending)
              ListInput.Shipped = Number(entry.shipped_quantity)
              ListInput.Invoiced_but_not_dispatched = Number(entry.invoiced_but_not_dispatched)

              ListInput.Out_For_Delivery = Number(entry.out_for_delivery)
              ListInput.Delivered = Number(entry.delivered)
              ListInput.Cancelled = Number(entry.cancelled_order)
              ListInput.Total_Inoviced_QTY = Number(entry.total_invoiced_qty)
              this.TemparrayALL.push(ListInput)
            }

            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'PartWiseDetails');
            this.modalService.dismissAll();

          }
          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();

          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }

      );
    }
    else {

      var Size = 250
      var offset = 0

      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        this.MISService.PartwiseList(this.data).subscribe(

          data => {
            debugger

            if (data.Success == true) {

              for (let entry of data.data) {

                const ListInput: orderMis = {} as orderMis;

                ListInput.Month_Year = entry.month_year
                ListInput.State = entry.state
                ListInput.Distributor_name = entry.distributor_name
                ListInput.Customer_name = entry.account_data.name
                ListInput.Account_ID = entry.account_id
                ListInput.Order_No = entry.edukan_orders
                ListInput.Order_Status = entry.status

                ListInput.OTC_No = entry.otc_number
                ListInput.Order_Date = entry.order_date// this.datepipe.transform(entry.order_date, 'dd-MM-yyyy')//entry.order_date
                ListInput.SortDate = entry.ord_date
                ListInput.Part_No = entry.part_number
                ListInput.Part_Status = entry.order_status
                ListInput.Part_Desc = entry.part_desc
                // ListInput.id = Number(entry.id)

                ListInput.Order_Quantity = Number(entry.order_quantity)
                // ListInput.Pending = Number(entry.pending)
                ListInput.Pending = Number(entry.pending)
                ListInput.Shipped = Number(entry.shipped_quantity)
                ListInput.Invoiced_but_not_dispatched = Number(entry.invoiced_but_not_dispatched)

                ListInput.Out_For_Delivery = Number(entry.out_for_delivery)
                ListInput.Delivered = Number(entry.delivered)
                ListInput.Cancelled = Number(entry.cancelled_order)

                ListInput.Total_Inoviced_QTY = Number(entry.total_invoiced_qty)

                this.dataOrderMis(ListInput)
              }
            }

            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();
            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        offset = offset + 250;
      }
    }
  }

  dataOrderMis(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {
      this.TemparrayALL.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.TemparrayALL.forEach(function (x) { delete x.SortDate });
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'PartWiseDetails');
      this.modalService.dismissAll();
    }
  }

  async invoiceDetailsMIS() {
    if (this.count <= 250) {

      await this.MISService.InvoiceWiseList(this.data).subscribe(

        data => {
          debugger

          if (data.Success == true) {

            for (let entry of data.data) {

              const ListInput: InvoiceMis = {} as InvoiceMis;

              ListInput.Month_Year = entry.month_year
              ListInput.State = entry.state

              ListInput.Distributor_id = entry.org_id
              ListInput.Distributor_name = entry.distributor_name
              ListInput.Division_id = entry.division_id
              ListInput.Account_ID = entry.account_id
              ListInput.Customer_name = entry.account_name
              ListInput.Order_No = entry.edukan_orders
              ListInput.Order_Status = entry.status

              ListInput.OTC_No = entry.otc_number
              ListInput.order_amount = entry.order_amount

              ListInput.Order_Date = entry.order_date//this.datepipe.transform(entry.order_date, 'dd-MM-yyyy')// entry.order_date

              ListInput.Part_No = entry.part_number

              ListInput.Part_Status = entry.order_status
              ListInput.Part_Desc = entry.part_desc

              ListInput.invoice_no = entry.invoice_no
              // ListInput.Invoice_Status= this.titlecasePipe.transform(entry.invoice_status); 
              ListInput.Invoice_Status = entry.invoice_status;
              ListInput.Invoice_Date = this.datepipe.transform(entry.invoiced_date, 'dd-MM-yyyy')// entry.order_date
              // ListInput.Order_Quantity = entry.order_quantity
              ListInput.Order_Quantity = Number(entry.order_quantity)

              ListInput.Pending = Number(entry.pending)
              ListInput.Shipped = Number(entry.shipped_quantity)
              ListInput.Invoiced_but_not_dispatched = Number(entry.invoiced_but_not_dispatched)

              ListInput.Out_For_Delivery = Number(entry.out_for_delivery)
              ListInput.Delivered = Number(entry.delivered)

              ListInput.Cancelled = Number(entry.cancelled_order)

              ListInput.Total_Inoviced_QTY = Number(entry.total_invoiced_qty)

              ListInput.Tracking_date = this.datepipe.transform(entry.tracking_date_ist, 'dd-MM-yyyy')

              ListInput.Tracking_time = this.datepipe.transform(entry.tracking_date_ist, 'shortTime')

              ListInput.Mrp = Number(entry.mrp)
              ListInput.Rate = Number(entry.rate)

              ListInput.Base_discount = Number(entry.base_discount)
              ListInput.Base_discount_amount = Number(entry.base_discount_amount)
              // ListInput.Masterial_discount= Number(entry.masterial_discount)
              // ListInput.Masterial_discount_amount= Number(entry.masterial_discount_amount)

              // ListInput.Rule_discount= Number(entry.rule_discount)
              // ListInput.Rule_discount_amount= Number(entry.rule_discount_amount)

              ListInput.Dealer_discount = Number(entry.dealer_rule_discount)
              ListInput.Dealer_discount_amount = Number(entry.dealer_rule_discount_amount)

              ListInput.Tml_discount = Number(entry.tml_rule_discount)
              ListInput.Tml_discount_amount = Number(entry.tml_rule_discount_amount)

              ListInput.Scheme_discount = Number(entry.scheme_discount)
              ListInput.Scheme_discount_amount = Number(entry.scheme_discount_amount)
              ListInput.Tax_amount = Number(entry.tax_amount)
              ListInput.Amount_without_tax_with_quantity = Number(entry.amount_without_tax_with_quantity)
              ListInput.Amount_with_tax_quantity = Number(entry.amount_with_tax_quantity)

              ListInput.Rating = entry.rating
              this.TemparrayALL.push(ListInput)
            }

            //this.loader.close();
            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'InvoiceWiseDetails');
            this.modalService.dismissAll();

          }

          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {

      var Size = 250
      var offset = 0
      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        this.MISService.InvoiceWiseList(this.data).subscribe(

          data => {
            debugger

            if (data.Success == true) {

              for (let entry of data.data) {

                const ListInput: InvoiceMis = {} as InvoiceMis;

                ListInput.Month_Year = entry.month_year
                ListInput.State = entry.state
                ListInput.Distributor_id = entry.org_id
                ListInput.Distributor_name = entry.distributor_name
                ListInput.Division_id = entry.division_id
                ListInput.Account_ID = entry.account_id
                ListInput.Customer_name = entry.account_name
                ListInput.Order_No = entry.edukan_orders
                ListInput.Order_Status = entry.status

                ListInput.OTC_No = entry.otc_number
                ListInput.order_amount = entry.order_amount

                ListInput.Order_Date = entry.order_date//this.datepipe.transform(entry.order_date, 'dd-MM-yyyy')// entry.order_date
                ListInput.SortDate = entry.ord_date
                ListInput.Part_No = entry.part_number

                ListInput.Part_Status = entry.order_status
                ListInput.Part_Desc = entry.part_desc

                ListInput.invoice_no = entry.invoice_no
                // ListInput.Invoice_Status= this.titlecasePipe.transform(entry.invoice_status); 
                ListInput.Invoice_Status = entry.invoice_status;
                ListInput.Invoice_Date = this.datepipe.transform(entry.invoiced_date, 'dd-MM-yyyy')// entry.order_date
                // ListInput.Order_Quantity = entry.order_quantity
                ListInput.Order_Quantity = Number(entry.order_quantity)

                ListInput.Pending = Number(entry.pending)
                ListInput.Shipped = Number(entry.shipped_quantity)
                ListInput.Invoiced_but_not_dispatched = Number(entry.invoiced_but_not_dispatched)

                ListInput.Out_For_Delivery = Number(entry.out_for_delivery)
                ListInput.Delivered = Number(entry.delivered)

                ListInput.Cancelled = Number(entry.cancelled_order)

                ListInput.Total_Inoviced_QTY = Number(entry.total_invoiced_qty)
                ListInput.Tracking_date = this.datepipe.transform(entry.tracking_date_ist, 'dd-MM-yyyy')

                ListInput.Tracking_time = this.datepipe.transform(entry.tracking_date_ist, 'shortTime')

                ListInput.Mrp = Number(entry.mrp)
                ListInput.Rate = Number(entry.rate)

                ListInput.Base_discount = Number(entry.base_discount)
                ListInput.Base_discount_amount = Number(entry.base_discount_amount)
                // ListInput.Masterial_discount= Number(entry.masterial_discount)
                // ListInput.Masterial_discount_amount= Number(entry.masterial_discount_amount)
                //  ListInput.Rule_discount= Number(entry.rule_discount)
                // ListInput.Rule_discount_amount= Number(entry.rule_discount_amount)

                ListInput.Dealer_discount = Number(entry.dealer_rule_discount)
                ListInput.Dealer_discount_amount = Number(entry.dealer_rule_discount_amount)

                ListInput.Tml_discount = Number(entry.tml_rule_discount)
                ListInput.Tml_discount_amount = Number(entry.tml_rule_discount_amount)

                ListInput.Scheme_discount = Number(entry.scheme_discount)
                ListInput.Scheme_discount_amount = Number(entry.scheme_discount_amount)
                ListInput.Tax_amount = Number(entry.tax_amount)

                ListInput.Amount_without_tax_with_quantity = Number(entry.amount_without_tax_with_quantity)

                ListInput.Amount_with_tax_quantity = Number(entry.amount_with_tax_quantity)

                ListInput.Rating = entry.rating
                // Input.Date = this.datepipe.transform(entry.ORDER_dt, 'dd-MM-yyyy hh:mm:ss a')
                //   ListInput.id= Number(entry.id)

                this.datainvoiceMIS(ListInput)

              }
            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();

            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );

        // Size = Size + 250;
        offset = offset + 250;
      }
    }
  }

  datainvoiceMIS(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {
      this.TemparrayALL.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.TemparrayALL.forEach(function (x) { delete x.SortDate });
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'InvoiceWiseDetails');
      this.modalService.dismissAll();
    }

  }

  async feedback() {
    debugger
    if (this.count <= 250) {

      await this.OrderListService.FeedbackList(this.data).subscribe(

        data => {
          debugger

          if (data.success == true) {

            for (let entry of data.data.result) {

              const ListInput: feedback = {} as feedback;

              ListInput.Invoice_No = entry.invoice_no
              ListInput.OTC_Number = entry.otc_order_number
              ListInput.Portal_Order_No = entry.order_no

              ListInput.Customer_Name = entry.account_data.name

              if (this.isdistributor == false) {
                ListInput.Distributor_Name = entry.org_name
              }

              ListInput.CreatedDate = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Delivery_Date = this.datepipe.transform(entry.tracking_date, 'dd-MM-yyyy hh:mm:ss a')

              ListInput.Rating = entry.rating
              ListInput.Comment = entry.comment

              this.TemparrayALL.push(ListInput)
            }

            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'FeedbackList');
            this.modalService.dismissAll();
          }
          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        }, (err) => {

          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {
      var Size = 250
      var offset = 0
      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        await this.OrderListService.FeedbackList(this.data).subscribe(

          data => {
            debugger

            if (data.success == true) {

              for (let entry of data.data.result) {

                const ListInput: feedback = {} as feedback;

                ListInput.Invoice_No = entry.invoice_no
                ListInput.OTC_Number = entry.otc_order_number
                ListInput.Portal_Order_No = entry.order_no

                ListInput.Customer_Name = entry.account_data.name

                if (this.isdistributor == false) {
                  ListInput.Distributor_Name = entry.org_name
                }

                ListInput.CreatedDate = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.Delivery_Date = this.datepipe.transform(entry.tracking_date, 'dd-MM-yyyy hh:mm:ss a')

                ListInput.Rating = entry.rating
                ListInput.Comment = entry.comment
                this.feedbacklistExcel(ListInput)
              }
            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();
            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        // Size = Size + 250;
        //offset = offset + 250;
      }
    }
  }

  feedbacklistExcel(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length
    if (this.TemparrayALL.length == this.count) {
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'FeedbackList');
      this.modalService.dismissAll();
    }

  }

  async cancel() {

    if (this.count <= 250) {

      await this.OrderListService.CancelOrderList(this.data).subscribe(

        data => {
          debugger

          if (data.success == true) {

            for (let entry of data.data.result) {

              const ListInput: Canceldata = {} as Canceldata;
              ListInput.Cancel_Number = entry.cancel_order_number
              ListInput.Cancel_Date = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')

              ListInput.OTC_Number = entry.otc_order_number
              ListInput.Order_No = entry.order_number
              ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Customer_Type = entry.user_type

              if (this.isdistributor == false) {
                ListInput.Distributor_Name = entry.organization_name
              }

              // ListInput.Customer_ID = entry.account_data.account_id
              ListInput.Customer_Name = entry.account_data.name
              ListInput.Account_ID = entry.account_id

              ListInput.Cancel_Amount = Number(entry.cancel_line_items_total_amount)

              ListInput.Dist_Approval = entry.approved_status
              ListInput.Cancellation_Status = entry.cr_request_status

              this.TemparrayALL.push(ListInput)
            }
            //this.loader.close();
            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'CancelList');
            this.modalService.dismissAll();

          }

          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {
      var Size = 250
      var offset = 0

      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        this.OrderListService.CancelOrderList(this.data).subscribe(

          data => {
            debugger

            if (data.success == true) {

              for (let entry of data.data.result) {

                const ListInput: Canceldata = {} as Canceldata;
                ListInput.Request_Number = entry.cancel_order_number
                ListInput.Request_Date = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')

                ListInput.OTC_Number = entry.otc_order_number
                ListInput.Order_No = entry.order_number
                ListInput.Order_Date = this.datepipe.transform(entry.order_date, 'dd-MM-yyyy hh:mm:ss a')
                ListInput.Customer_Type = entry.user_type

                if (this.isdistributor == false) {

                  ListInput.Distibutor_Name = entry.organization_name
                }

                ListInput.Account_ID = entry.account_data.account_id
                ListInput.Customer_Name = entry.account_data.name
                ListInput.Cancel_Amount = Number(entry.cancel_line_items_total_amount)
                ListInput.Dist_Approval = entry.approved_status
                ListInput.Cancellation_Status = entry.cr_request_status

                this.datafoexpot(ListInput)
              }

            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();
            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        Size = Size + 250;
        offset = offset + 250;
      }

    }
  }

  datafoexpot(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'CancelList');
      this.modalService.dismissAll();
    }
  }


  async CustomerDetails() {

    if (this.count <= 250) {

      await this.OrderListService.GetAccountList(this.data).subscribe(

        data => {
          debugger

          if (data.success == true) {

            for (let entry of data.Data) {

              const ListInput: Canceldata = {} as Canceldata;
              ListInput.Customer_ID = entry.account_id
              ListInput.Customer_Name = entry.account_name
              ListInput.Contact_No = entry.contact_no


              ListInput.Customer_Location = entry.address_1
              ListInput.Created_Date = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Customer_Type = entry.user_type

              // ListInput.Cancel_Amount = Number(entry.cancel_line_items_total_amount)

              //ListInput.Request_Number = entry.cancel_order_number
              //ListInput.Request_Date = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')

              //ListInput.OTC_Number = entry.otc_order_number
              //  ListInput.Order_No = entry.order_number


              // if (this.isdistributor == false) {
              //   ListInput.Distibutor_Name = entry.organization_name
              // }


              // ListInput.Dist_Approval = entry.approved_status
              //ListInput.Cancellation_Status = entry.cr_request_status

              this.TemparrayALL.push(ListInput)
            }
            //this.loader.close();
            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'CustomerList');
            this.modalService.dismissAll();

          }

          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {
      var Size = 250
      var offset = 0

      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        this.OrderListService.GetAccountList(this.data).subscribe(

          data => {
            debugger

            if (data.success == true) {

              for (let entry of data.Data) {

                const ListInput: Canceldata = {} as Canceldata;


                // ListInput.Customer_ID = entry.account_id
                ListInput.Customer_ID = entry.account_id
                ListInput.Customer_Name = entry.account_name
                ListInput.Contact_No = entry.contact_no
                ListInput.Address_1 = entry.address_1

                ListInput.Customer_Type = entry.user_type



                this.customerexpot(ListInput)
              }

            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();
            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        Size = Size + 250;
        offset = offset + 250;
      }

    }
  }

  customerexpot(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'CustomerList');
      this.modalService.dismissAll();
    }
  }

  async DivisionMaster() {
    if (this.count <= 250) {



      await this.OrderListService.DivisionMaster(this.data).subscribe(

        data => {



          if (data.success == true) {

            // console.log(data.data)
            for (let entry of data.data) {

              const ListInput: Listinputs = {} as Listinputs;

              ListInput.Date = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')
              ListInput.Division_id = entry.division_id
              ListInput.Division_category = entry.division_category
              ListInput.Division_name = entry.division_name
              ListInput.District = entry.district

              ListInput.State = entry.state


              this.TemparrayALL.push(ListInput)
            }

            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'List');
            // this.modalService.dismissAll();
          }
          else {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        }, (err) => {

          Swal.fire('Please try Again')
          this.modalService.dismissAll();
        }
      );
    }
    else {
      var limit = 250
      var offset = 0
      var rou = (Math.ceil(this.count / 250))

      for (let i = 0; i < rou; i++) {

        await this.OrderListService.DivisionMaster(this.data).subscribe(

          data => {
            if (data.success == true) {

              for (let entry of data.data) {
                const ListInput: Listinputs = {} as Listinputs;
                ListInput.Division_id = entry.division_id
                ListInput.Division_category = entry.division_category
                ListInput.Division_name = entry.division_name
                ListInput.District = entry.district
                ListInput.Date = this.datepipe.transform(entry.created_at, 'dd-MM-yyyy hh:mm:ss a')


                ListInput.State = entry.state

                this.divisionExcel(ListInput)
                // this.modalService.dismissAll();

              }
            }
            else {
              Swal.fire('Please try Again')
              this.modalService.dismissAll();
            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.modalService.dismissAll();
          }
        );
        limit = limit + 250;
        offset = offset + 250;
      }
    }
  }

  divisionExcel(ListInput) {
    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length
    // alert(this.TemparrayALL.length)

    if (this.TemparrayALL.length == this.count) {
      debugger
      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'DivisionMaster');
      this.modalService.dismissAll();
    }

  }




  async partmaster() {


    const ListInput: ListInput = {} as ListInput;


    // if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    // if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }



    // if (this.part_num) { ListInput.part_num = this.part_num; } else { ListInput.part_num = ""; }
    // if (this.pg) { ListInput.pg = this.pg; } else { ListInput.pg = ""; }
    // if (this.distributor_category) { ListInput.distributor_category = this.distributor_category; } else { ListInput.distributor_category = ""; }
    // if (this.discount_code_cvbu) { ListInput.discount_code_cvbu = this.discount_code_cvbu; } else { ListInput.discount_code_cvbu = ""; }
    // if (this.desc_text) { ListInput.desc_text = this.desc_text; } else { ListInput.desc_text = ""; }
    // if (this.isactiveforecom) { ListInput.isactiveforecom = this.isactiveforecom; } else { ListInput.isactiveforecom = ""; }
    // if (this.minquantity) { ListInput.minquantity = this.minquantity; } else { ListInput.minquantity = ""; }
    // if (this.large_description) { ListInput.large_description = this.large_description; } else { ListInput.large_description = ""; }
    // if (this.isassamrifile) { ListInput.isassamrifile = this.isassamrifile; } else { ListInput.isassamrifile = ""; }

    if (this.count <= 250) {

      ListInput.size = this.count
      ListInput.offset = 0

      await this.OrderListService.partmaster(ListInput).subscribe(

        data => {
          debugger

          if (data.success == true) {



            for (let entry of data.data) {



              const ListInput: FinalData = {} as FinalData;




              ListInput.Part_Number = entry.part_number
              ListInput.Distributor_Category = entry.distributor_category
              ListInput.Group_Category = entry.group_category
              ListInput.Description = entry.large_description
              ListInput.Advantages = entry.advantages
              ListInput.Other_Instruction = entry.other_instruction
              ListInput.Tmgo_Qty = entry.tmgo_qty
              ListInput.Is_home_page = entry.is_home_page

              this.TemparrayALL.push(ListInput)

            }

            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'PartMaster');
            //  this.modalService.dismissAll();



          }



          else {
            Swal.fire('Please try Again')
            this.isdiableeporrt = true

          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.isdiableeporrt = true
        }

      );
    }
    else {

      var Size = 250
      var offset = 0


      var rou = (Math.ceil(this.count / 250))





      for (let i = 0; i < rou; i++) {

        ListInput.offset = offset
        ListInput.size = Size

        this.OrderListService.partmaster(ListInput).subscribe(

          data => {
            debugger

            if (data.success == true) {

              for (let entry of data.data) {


                const ListInput: FinalData = {} as FinalData;



                ListInput.Part_Number = entry.part_number
                ListInput.Distributor_Category = entry.distributor_category
                ListInput.Group_Category = entry.group_category
                ListInput.Description = entry.large_description
                ListInput.Advantages = entry.advantages
                ListInput.Other_Instruction = entry.other_instruction
                ListInput.Tmgo_Qty = entry.tmgo_qty
                ListInput.Is_home_page = entry.is_home_page




                this.partmasterExcel(ListInput)
                //  this.modalService.dismissAll();


              }





            }



            else {
              Swal.fire('Please try Again')
              this.isdiableeporrt = true
              this.modalService.dismissAll();

            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.isdiableeporrt = true

          }

        );


        Size = Size + 250;
        offset = offset + 250;
      }
      //this.modalService.dismissAll();
      this.myDrop.close()
    }
  }

  partmasterExcel(ListInput) {

    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {

      this.TemparrayALL.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.TemparrayALL.forEach(function (x) { delete x.SortDate });


      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'PartMaster');
      this.modalService.dismissAll();

    }

  }


  async reportDownloadTemplatepartmaster() {


    const ListInput: ListInput = {} as ListInput;


    //   if (this.to_date) { ListInput.to_date = this.to_date; } else { ListInput.to_date = ""; }

    //   if (this.from_date) { ListInput.from_date = this.from_date; } else { ListInput.from_date = ""; }
    //  if (this.part_num) { ListInput.part_num = this.part_num; } else { ListInput.part_num = ""; }
    //   if (this.pg) { ListInput.pg = this.pg; } else { ListInput.pg = ""; }
    //   if (this.distributor_category) { ListInput.distributor_category = this.distributor_category; } else { ListInput.distributor_category = ""; }
    //   if (this.discount_code_cvbu) { ListInput.discount_code_cvbu = this.discount_code_cvbu; } else { ListInput.discount_code_cvbu = ""; }
    //   if (this.desc_text) { ListInput.desc_text = this.desc_text; } else { ListInput.desc_text = ""; }
    //   if (this.isactiveforecom) { ListInput.isactiveforecom = this.isactiveforecom; } else { ListInput.isactiveforecom = ""; }
    //   if (this.minquantity) { ListInput.minquantity = this.minquantity; } else { ListInput.minquantity = ""; }
    //   if (this.large_description) { ListInput.large_description = this.large_description; } else { ListInput.large_description = ""; }
    //   if (this.isassamrifile) { ListInput.isassamrifile = this.isassamrifile; } else { ListInput.isassamrifile = ""; }

    if (this.count <= 250) {

      ListInput.size = this.count
      ListInput.offset = 0

      await this.OrderListService.partmaster(ListInput).subscribe(

        data => {
          debugger

          if (data.success == true) {



            for (let entry of data.data) {



              const ListInput: FinalData = {} as FinalData;




              ListInput.Part_Number = entry.part_number
              ListInput.Distributor_Category = entry.distributor_category
              ListInput.Group_Category = entry.group_category
              ListInput.Description = entry.large_description
              ListInput.Advantages = entry.advantages
              ListInput.Other_Instruction = entry.other_instruction
              ListInput.Tmgo_Qty = entry.tmgo_qty
              ListInput.Is_home_page = entry.is_home_page
              // ListInput.PG = entry.pg

              this.TemparrayALL.push(ListInput)

            }

            this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'PartMaster');
            // this.modalService.dismissAll();



          }



          else {
            Swal.fire('Please try Again')
            this.isdiableeporrt = true

          }
        }, (err) => {
          Swal.fire('Please try Again')
          this.isdiableeporrt = true
        }

      );
    }
    else {

      var Size = 250
      var offset = 0


      var rou = (Math.ceil(this.count / 250))





      for (let i = 0; i < rou; i++) {

        ListInput.offset = offset
        ListInput.size = Size

        this.OrderListService.partmaster(ListInput).subscribe(

          data => {
            debugger

            if (data.success == true) {

              for (let entry of data.data) {


                const ListInput: FinalData = {} as FinalData;



                ListInput.Part_Number = entry.part_number
                ListInput.Distributor_Category = entry.distributor_category
                ListInput.Group_Category = entry.group_category
                ListInput.Description = entry.large_description
                ListInput.Advantages = entry.advantages
                ListInput.Other_Instruction = entry.other_instruction
                ListInput.Tmgo_Qty = entry.tmgo_qty
                ListInput.Is_home_page = entry.is_home_page




                this.reportDownloadTemplatepartmasterExcel(ListInput)


              }





            }



            else {
              Swal.fire('Please try Again')
              this.isdiableeporrt = true

            }
          }, (err) => {
            Swal.fire('Please try Again')
            this.isdiableeporrt = true
          }

        );


        Size = Size + 250;
        offset = offset + 250;
      }

    }
  }

  reportDownloadTemplatepartmasterExcel(ListInput) {

    this.TemparrayALL.push(ListInput)
    this.pendingcount = this.TemparrayALL.length;
    if (this.TemparrayALL.length == this.count) {

      this.TemparrayALL.sort((a: any, b: any) => { return Date.parse(b.SortDate) - Date.parse(a.SortDate) });
      this.TemparrayALL.forEach(function (x) { delete x.SortDate });


      this.excelService.exportCancellationAsExcelFile(this.TemparrayALL, 'PartMaster');
      this.modalService.dismissAll();

    }

  }

}

export class ExportData {
  OTC_Number: string
  Customer_Name: string
  OrderAmount: number
  Total_Invoice: string
  Date: string
  Status: string
  Payment_Mode: string
  Distributor_Name: string
  Distributor_Id: string
  Division: string
  Portal_Order_Number: string
  SortDate: string
  InvoiceAmount: number
  PO_Number: string
  Accidental_Chassis_Number: string
  Accidental_Registration_No: string
  Parts: any;
  Qty: any;
  Region: any;
  State: any;
  region: any;
  state: any;
  Amount: any;
  Account_Id: any;
  Parts_Qty: any;
}

export interface ExportArrayALL {
  Status: any;
  Account_Id: any;
  Payment_Mode: any;
  Order_No: string
  OTC_No: string
  Invoice_No: string
  Customer_name: string
  Distributor_Name: string
  Order_Date: string
  Invoice_Date: string
  Order_Amount: number
  Invoice_Amount: number
  Last_Status_Update: string
  Pending_Since: string
  Order_Tracking_Status: string
  Datefosort: string
  payment_method: string
}

export interface ExportArray {
  Out_For_Delivery_Date: string;
  Payment_Mode: string;
  Invoice_Date: string;
  Account_Id: any;
  Account_ID: any;
  Order_No: string;
  OTC_No: string;
  Distributor_Name: string
  Invoice_no: string;
  Order_amount: number;
  Invoice_amount: number;
  Order_date: string;
  Cancelled_Date: string;
  Out_For_Delivery_date: string;
  Delivered_date: string;
  Pending_Since: string;
  Color: string;
  Division_Name: String
  Division_ID: string
  Organization_id: string
  Customer_Name: string
  Status: string
  Tackdatefosot: string
}

export interface DeliveryData {
  Account_ID: any;
  OTC_Number: string
  Order_Date: string
  Order_Amount: Number
  Order_Month_Year: string
  Customer_Name: string
  Distributor_Name: string
  Latest_Delivery_Timelines: string
  Amt_of_order_value_invoiced: number
  Amt_of_value_delivered_upto_24_hrs: number
  Amt_of_value_delivered_in_24_48_hrs: number
  Amt_of_value_delivered_in_48_72_hrs: number
  Amt_of_value_delivered_upto_72_hrs: number
  Amt_of_value_delivered_more_than_72_hrs: number
  Amt_of_value_Invoiced_but_not_delivered: number
  Percentage_of_order_value_invoiced: string
  Percentage_of_value_delivered_upto_24_hrs: string
  Percentage_of_value_delivered_in_24_48_hrs: string
  Percentage_of_value_delivered_in_48_72_hrs: string
  Percentage_of_value_delivered_more_than_72_hrs: string
  Percentage_of_value_Invoiced_but_not_delivered: string
  Percentage_of_value_delivered_upto_72_hrs: number
  Cancelled_invoice_count: number
  SortDate: string
  id: number
}

export interface invoiceData {
  Account_ID: any;
  Latest_invoicing_Timelines_Hrs: any;
  Latest_invoicing_Timelines_hrs: any;
  OTC_Number: string
  Order_Date: string
  Order_Amount: Number
  Order_Month_Year: string
  Customer_Name: string
  Distributor_Name: string
  Latest_invoicing_Timelines: string
  Amt_of_order_value_invoiced: Number
  Amt_of_value_Invoiced_upto_24_hrs: Number
  Amt_of_value_Invoiced_in_24_48_hrs: Number
  Amt_of_value_Invoiced_upto_48_hrs: Number
  Amt_of_value_Invoiced_in_48_72_hrs: Number
  Amt_of_value_Invoiced_more_than_72_hrs: Number
  Percentage_of_order_value_invoiced: string
  Percentage_of_value_Invoiced_upto_24_hrs: string
  Percentage_of_value_Invoiced_in_24_48_hrs: string
  Percentage_of_value_Invoiced_upto_48_hrs: Number
  Percentage_of_value_Invoiced_in_48_72_hrs: string
  Percentage_of_value_Invoiced_more_than_72_hrs: string
  Cancelled_invoice_count: number
  SortDate: String
  id: number
}

export interface orderMis {
  Account_ID: any;
  Total_Inoviced_QTY: Number
  Cancelled: Number
  Delivered: Number
  Out_For_Delivery: Number
  Invoiced_but_not_dispatched: Number
  Shipped: Number
  Pending: Number
  Order_Quantity: Number
  Part_Status: String
  Part_Desc: String
  Part_No: String
  Order_Date: String
  OTC_No: String
  Order_Status: String
  Order_No: String
  Customer_name: String
  Distributor_name: String
  State: String
  Month_Year: String
  SortDate: String
  id: number
}

export interface InvoiceMis {
  Account_ID: any;
  Total_Inoviced_QTY: Number
  Cancelled: Number
  Delivered: Number
  Shipped: Number
  Out_For_Delivery: Number
  Invoiced_but_not_dispatched: Number
  Pending: Number
  Order_Quantity: Number
  Invoice_Date: any;
  Part_Status: String
  Part_Desc: String
  Part_No: String
  Order_Date: String
  OTC_No: String
  Order_Status: String
  Order_No: String
  Customer_name: String
  Distributor_name: String
  State: String
  Month_Year: String
  SortDate: String
  invoice_no: string
  Tracking_date: String
  order_amount: String
  Rating: String
  id: number
  Invoice_Status: String
  Amount_with_tax_quantity: Number
  Amount_without_tax_with_quantity: Number
  Base_discount: Number
  Base_discount_amount: Number
  Masterial_discount: Number
  Masterial_discount_amount: Number
  Mrp: Number
  Rate: Number
  Rule_discount: Number
  Rule_discount_amount: Number
  Scheme_discount: Number
  Scheme_discount_amount: Number
  Tax_amount: Number
  Tracking_time: String
  Dealer_discount: Number
  Dealer_discount_amount: Number
  Tml_discount: Number
  Tml_discount_amount: Number
  Distributor_id: String
  Division_id: String
}

export class feedback {
  Invoice_No: string
  OTC_Number: string
  Portal_Order_No: string
  Distributor_Name: string
  Customer_Name: string
  CreatedDate: string
  Order_Date: string
  Delivery_Date: string
  Rating: string
  Comment: string
}

export class Canceldata {
  Request_Number: string
  Request_Date: string
  OTC_Number: string
  Order_No: string
  Order_Date: string
  Customer_Type: string
  Customer_ID: string
  Distibutor_Name: string
  Customer_Name: string
  Dist_Approval: string
  Cancellation_Status: string
  shipping_city: string
  shipping_taluka: string
  shipping_pincode: string
  otc_order_no: string
  portal_order_number: string
  Cancel_Amount: number
  Address_1: any;
  Contact_No: any;
  Address_3: any;
  Address_2: any;
  Account_ID: any;
  Created_Date: string;
  Cancel_Number: any;
  Cancel_Date: string;
  Distributor_Name: any;
  Customer_Location: any;
}

export class Listinputs {
  district: any;
  offset: number;
  size: number;
  state: string;
  division_category: string;
  division_id: string;
  division_name: string;
  from_date: string;
  to_date: string;
  state_code: string;
  Division_id: any;
  Division_category: any;
  Division_name: any;
  CreatedDate: string;
  District: any;
  State: any;
  State_code: any;
  Action_type: any;
  Date: string;
}
export class ListInput {


  offset: number;
  size: number;
  from_date: string;
  to_date: string;
  part_number: string;
  discount_code_cvbu: string;
  isecom: string;
  isactiveforecom: string;
  distributor_category: any;
  large_description: string;
  minquantity: any;
  isassamrifile: any;
  pg: any;
  part_num: any;
  desc_text: any;
  limit: any;
  po_number: any;
  otc_number: any;

}
export interface FinalData {
  Is_home_page: any;
  Tmgo_Qty: any;
  Other_Instruction: any;
  Advantages: any;
  Group_Category: any;
  Distributor_Category: any;
  Datefosort: any;
  Expected_Delivery_date: string;
  Order_date: string;
  Quantity: string;
  Part_Desc: any;
  Part_No: any;
  Distributor_name: any;
  Customer_name: any;
  Order_No: any;
  OTC_No: any;


  Part_Number: String
  is_Ecommerce: String
  is_Assamrifile: String
  Description: String
  Min_Qty: String
  Is_Active_for_ecom: String
  Discount_Code: String
  Discount_Category: String
  PG: String
}
export class ExpotInputdata {
  po_id: string;
  opos_id: string;
  po_number: string;
  stp_name: string;
  order_pos: string;
  order_date: string;
  order_type: string;
  order_raiserd: string;
  order_div_id: string;
  order_for: string;
  sta_as_of_date: string;
  stp_code: string;
  order_status: string;
  otc_number: string;
  customer_name: string;
  division_name: string;
  Distributor_Name: any;
  sap_order_number: any;
  Cancellation_Status: any;
  Dist_Approval: any;
  Cancel_Amount: number;
  Customer_Name: any;
  Customer_ID: any;
  Distibutor_Name: any;
  Customer_Type: any;
  Order_Date: string;
  Order_No: any;
  OTC_Number: any;
  Request_Date: string;
  Request_Number: any;
  Account_ID: any;
  Returned_Amount: number;
  Retruned_Status: any;
  cr_request_type: string;
  Return_Status: any;
}
export class ExpotInputdataInvoice {
  OTC_Number: any;
  action_type: string;
  Invoice_Number: any;
  Invoice_Date: string;
  Invoice_Status: any;
  Order_Number: any;
  Order_Date: string;
  Invoice_Pdf_Url: any;
  Order_Amount: any;
  Tracking_Date: string;
  Payment_Status: any;
  Payment_Method: any;
  Payment_Date: string;

}