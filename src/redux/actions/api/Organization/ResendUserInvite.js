
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class ResendUserInviteAPI extends API {
   constructor(email, timeout = 2000) {
     super("POST", timeout, false);
     this.email = email
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}invite/regenerate/`;
   }  
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.resendinviteRes = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
    return {
      emails : this.email
    } 
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
     return this.resendinviteRes;
   }
 }
 