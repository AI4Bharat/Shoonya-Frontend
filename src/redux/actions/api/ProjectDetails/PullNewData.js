
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class GetPullNewDataAPI extends API {
    constructor(projectId, timeout = 2000) {
      super("POST", timeout, false);
      this.type = constants.GET_PULL_NEW_ITEMS;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/pull_new_items/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.pullNewData = res;
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
      return this.pullNewData;
    }
  }
  