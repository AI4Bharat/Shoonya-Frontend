/**
 * Change Password API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class ChangePasswordAPI extends API {
   constructor(user_id,projectObj, timeout = 2000) {
     super("POST", timeout, false);
     this.projectObj = projectObj;
     this.type = constants.CHANGE_PASSWORD;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.changepassword}${user_id}/update_my_password/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.changepassword = res;
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
         "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.changepassword;
   }
 }
 