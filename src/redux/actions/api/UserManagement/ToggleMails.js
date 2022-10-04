/**
 * Toggle Mails API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class ToggleMailsAPI extends API {
   constructor(user_id, enable_mails, timeout = 2000) {
     super("POST", timeout, false);
     this.userId = user_id;
     this.enableMails = enable_mails;
     this.type = constants.TOGGLE_MAILS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch}enable_email/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.toggleMails = res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
     return {
       user_id: this.userId,
       enable_mail: this.enableMails,
     };
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
     return this.toggleMails;
   }
 }
 