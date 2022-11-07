
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class DeleteDataItemsAPI extends API {
   constructor(instanceIds,datasetObj, timeout = 2000) {
     super("POST", timeout, false);
     this.datasetObj = datasetObj;
     //this.type = constants.DELETE_DATAITEMS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}dataitems/${instanceIds}/delete_data_items/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.deleteDataItems= res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
   getBody() {
    return this.datasetObj;
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
     return this.deleteDataItems 
   }
 }
 