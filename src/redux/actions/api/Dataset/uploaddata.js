/**
 * Upload data API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class UploaddataAPI extends API {
   constructor(datasetId,projectObj, timeout = 2000) {
     super("POST",  false);
     this.projectObj = projectObj;
     this.type = constants.UPLOAD_DATA;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/${datasetId}/upload/`;
   }
     
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.uploaddata = res;
     }
   }
   
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return this.projectObj;
  }
 
   getHeaders() {
     this.headers = {
       headers: {
        // "Content-Type": "application/json",
         "Authorization":`JWT ${localStorage.getItem('shoonya_access_token')}`
       },
     };
     return this.headers;
   }
     
   getPayload() {
     return this.uploaddata;
   }
 }