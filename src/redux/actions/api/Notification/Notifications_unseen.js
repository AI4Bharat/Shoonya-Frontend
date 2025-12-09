/**
 * GetOragnizationUsers API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class FetchunreadcountAPI extends API {
    constructor( timeout = 2000) {
      super("GET", timeout, false);
      this.type = constants.NOTIFICATION;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.notification}unread/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.notification = res;
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
      return this.notification;
    }
  }
  