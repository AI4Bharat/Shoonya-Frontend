/**
 * FetchLoggedInUserData
 */

 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class FetchLoggedInUserDataAPI extends API {
   constructor(timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_LOGGED_IN_USER_DATA;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch}me/fetch/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.UserData = res;
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
         "Authorization": `JWT ${localStorage.getItem("shoonya_access_token")}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.UserData
   }
 }
 