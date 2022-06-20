
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class DownloadProjectButtonAPI extends API {
    constructor(projectId, timeout = 2000) {
      super("POST", timeout, false);
      this.type = constants.DOWNLOAD_PROJECT_BUTTON;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/download/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.downloadProjectButton = res;
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
      return this.downloadProjectButton;
    }
  }
  