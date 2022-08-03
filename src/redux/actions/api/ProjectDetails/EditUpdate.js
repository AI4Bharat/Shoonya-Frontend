/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetSaveButtonAPI extends API {
   constructor(projectId,projectObj, timeout = 2000) {
     super("PUT", timeout, false);
     this.projectObj = projectObj;
    //  this.type = constants.GET_SAVE_BUTTON;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.saveButton= res;
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
        "Content-Type": "application/json", 
         "Authorization":`JWT ${localStorage.getItem('shoonya_access_token')}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.saveButton 
   }
 }
 