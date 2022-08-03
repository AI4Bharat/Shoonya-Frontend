/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetProjectDetailsAPI extends API {
   constructor(projectId, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_PROJECT_DETAILS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.projectDetails = res;
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
     return this.projectDetails
   }
 }
 