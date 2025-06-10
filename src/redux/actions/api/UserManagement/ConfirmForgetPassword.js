/**
 * Confirm Forgot Password API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class ConfirmForgetPasswordAPI extends API {
   constructor(projectObj, timeout = 2000) {
     super("POST", timeout, false);
     this.projectObj = projectObj;
     this.type = constants.CONFIRM_FORGOT_PASSWORD;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.authUser}reset_password/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.confirmforgetPassword = res;
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
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.confirmforgetPassword;
   }
 }
 