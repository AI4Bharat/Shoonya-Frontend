/**
 * GetManagerSuggestion API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class GetManagerSuggestionsAPI extends API {
   constructor(orgId, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_MANAGER_SUGGESTIONS;
     this.orgId = orgId;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getPendingUsers}pending_users/?organisation_id=${this.orgId}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.managerSuggestions = res;
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
     return this.managerSuggestions;
   }
 }
 