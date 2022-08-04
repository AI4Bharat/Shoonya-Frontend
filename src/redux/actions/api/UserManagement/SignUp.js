/**
 * SignUp API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class SignUpAPI extends API {
   constructor(projectObj,inviteCode, timeout = 2000) {
     super("PATCH", timeout, false);
     this.projectObj = projectObj;
     this.type = constants.SIGN_UP_PAGE;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}invite/${inviteCode}/accept/`;
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
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.changepassword;
   }
 }
 