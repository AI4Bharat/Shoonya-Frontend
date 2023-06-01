
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class RemoveProjectReviewerAPI extends API {
    constructor(projectId,projectObj,type, timeout = 2000) {
      super("POST", timeout, false);
      this.projectObj = projectObj;
      this.type = constants.REMOVE_PROJECT_REVIEWER;
      let queryStr = type == "PROJECT_SUPERCHECKER" ? "remove_superchecker" : "remove_reviewer";
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/${queryStr}/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.removeProjectReviewer = res;
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
      return this.removeProjectReviewer;
    }
  }
  