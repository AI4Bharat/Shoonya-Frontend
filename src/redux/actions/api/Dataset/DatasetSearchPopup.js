/**
 * Create New DatasetInstance API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class DatasetSearchPopupAPI extends API {
   constructor(taskObj,timeout = 2000) {
     super("POST", timeout, false);
     this.taskObj = taskObj;
     this.type = constants.DATASET_SEARCH_POPUP;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}dataitems/get_data_items/`;
   }
     
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.DatasetSearchPopup = res;
     }
   }
   
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return this.taskObj;
  }
 
   getHeaders() {
     this.headers = {
       headers: {
         "Content-Type": "application/json",
         "Authorization":`JWT ${localStorage.getItem('shoonya_access_token')}`
       },
     };
     return this.headers;
   }
     
   getPayload() {
     return this.DatasetSearchPopup;
   }
 }