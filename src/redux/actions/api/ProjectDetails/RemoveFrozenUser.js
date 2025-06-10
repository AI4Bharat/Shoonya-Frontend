
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class RemoveFrozenUserAPI extends API {
    constructor(projectId,projectObj, timeout = 2000) {
      super("POST", timeout, false);
      this.projectObj = projectObj;
    //   this.type = constants.REMOVE_PROJECT_MEMBER;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/remove_frozen_user/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.removeFrozenUser = res;
      }
  }
  
    apiEndPoint() {
      return this.endpoint;
    }
 
    getBody() {
      return this.projectObj;
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
      return this.removeFrozenUser;
    }
  }
  