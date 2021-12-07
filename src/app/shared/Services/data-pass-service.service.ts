import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataPassServiceService {

  private data = {};  
  private OrderData = {}; 
  private FailOrderData ={};
  OrderTabid :number
  private CancelorderData ={};
  private OrderAdvancedFilterData = {}; 
  private CustomerData ={};
  setPoDetails: any;
  setOption(value) {      
    this.data = value;  
  }  
  
  getOption() {  
    return this.data;  
  } 
  private approvalStageMessage = new BehaviorSubject('');
 currentApprovalStageMessage = this.approvalStageMessage.asObservable();
 cast = this.approvalStageMessage.asObservable();

  constructor() { }
  updateApprovalMessage(message: string) {
    this.approvalStageMessage.next(message)
    }


    getAuditButtonStatus(data) {
      this.approvalStageMessage.next(data);
    }


    setOrderListData(value) {

      this.OrderData = value; 

    }

    getOrderHistroyTabid ()
    {
      return this.OrderTabid 

    }


    public GetPageVlidation (value)
    {
      var Valid ;
      Valid = false
      var list = JSON.parse(localStorage.getItem('PageDetails'))
     //console.log('list')
 
     for (let entry1 of list) {
      
      for (let entry2 of entry1.page_detail) {
        if (entry2.page_url==value)
        {
          Valid = true
        }
        
      }


     }

      return Valid

    }

    setOrderHistroyTabid (id)
    {
      this.OrderTabid = id

    }

    getOrderListData() {  
      return this.OrderData;  
    } 
//

    setFailedOrderListData(value) {

      this.FailOrderData = value; 

    }

    getFailOrderListData() {  
      return this.FailOrderData;  
    } 

    //


    setCancelorderdetails(value) {

      this.CancelorderData = value; 

    }

    getCancelorderdetails() {

      return this.CancelorderData ; 

    }



    setOrderFilterData(value) {

      this.OrderAdvancedFilterData = value; 

    }

    getOrderFiltertData() {  
      return this.OrderAdvancedFilterData;  
    } 


    setCustomerDetails(value) {
      this.CustomerData = value; 
    }

    getCustomerDetails() {
      return this.CustomerData ; 
    }   

}
