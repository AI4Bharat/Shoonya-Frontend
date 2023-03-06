
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class DownloadProjectJSONAPI extends API {
    constructor(projectId, taskStatus ,downloadMetadataToggle=false, timeout = 2000) {
      super("POST", timeout, false);
      this.projectBody={}//object with key-value pair
      this.type = constants.DOWNLOAD_PROJECT_JSON;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/download/?export_type=JSON&task_status=${taskStatus}&include_input_data_metadata_json=${downloadMetadataToggle}`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.downloadProjectJSON = res;
      }
  }
  
    apiEndPoint() {
      return this.endpoint;
    }
 
    getBody() {
      return this.projectBody
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
      return this.downloadProjectJSON;
    }
  }
  