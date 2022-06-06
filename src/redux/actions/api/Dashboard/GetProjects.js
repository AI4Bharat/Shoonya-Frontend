/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constant from '../../../constants';

 export default class GetProjectsAPI extends API {
   constructor(timeout = 2000) {
     super("GET", timeout, false);
     this.type = constant.GET_PROJECT_DATA
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}`;
   }

   processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.report = res;
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
     return this.report
   }
 }
 