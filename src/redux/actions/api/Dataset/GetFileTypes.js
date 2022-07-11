/**
 * Get File Types API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class GetFileTypesAPI extends API {
   constructor( timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_FILE_TYPES;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/accepted_filetypes/`;
   }
     
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.filetypes = res;
     }
   }
   
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {}
 
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
     return this.filetypes;
   }
 }