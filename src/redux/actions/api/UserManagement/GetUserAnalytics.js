/**
 * Workspace User Reports API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetUserAnalyticsAPI extends API {
   constructor( progressObj , timeout = 2000) {
     super("POST", timeout, false);
     this.progressObj = progressObj;
     this.type = constants.GET_USER_ANALYTICS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}user_analytics/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.userAnalytics = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return this.progressObj;
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
     return this.userAnalytics
   }
 }
 