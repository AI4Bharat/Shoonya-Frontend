
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class GetPublishProjectButtonAPI extends API {
    constructor(projectId, timeout = 2000) {
      super("POST", timeout, false);
      this.type = constants.GET_PUBLISH_PROJECT_BUTTON;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/project_publish/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.publishProjectButton = res;
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
      return this.publishProjectButton;
    }
  }
  