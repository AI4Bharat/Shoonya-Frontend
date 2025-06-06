/**
 * RejectManagerSuggestions API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class RejectManagerSuggestionsAPI extends API {
   constructor(userId, timeout = 2000) {
     super("DELETE", timeout, false);
     this.type = constants.DELETE_MANAGER_SUGGESTIONS;
     this.userId = userId;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getPendingUsers}reject_user/?userId=${this.userId}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.rejecManagerSuggestion = res;
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
     return this.rejecManagerSuggestion;
   }
 }
 