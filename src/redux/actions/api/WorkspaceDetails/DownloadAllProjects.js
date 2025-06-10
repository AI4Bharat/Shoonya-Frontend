
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class DownloadAllProjects extends API {
    constructor(id,userid,timeout = 2000) {
      super("POST", timeout, false);
    //   this.projectBody={}//object with key-value pair
    //   this.type = constants.DOWNLOAD_PROJECT_CSV;
    this.userid=userid
      this.endpoint = `${super.apiEndPointAuto()}/functions/download_all_projects?workspace_id=${id}`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.downloadProject = res;
      }
  }
  
    apiEndPoint() {
      return this.endpoint;
    }
 
    getBody() {
        return {
            user_id: this.userid,
          };
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
      return this.downloadProjectCsv;
    }
  }
  