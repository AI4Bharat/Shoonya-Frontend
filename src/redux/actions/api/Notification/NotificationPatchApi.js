/**
 * GetOragnizationUsers API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class NotificationPatchAPI extends API {
    constructor( id,timeout = 2000) {
      super("PATCH", timeout, false);
      this.id = id;
      this.type = constants.NOTIFICATION;
      this.endpoint = `${super.apiEndPointAuto()}/notifications/changeState`;
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
 
    getBody() {
      return {
        notif_id:this.id
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
      return this.notification;
    }
  }
  