
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class getDownloadProjectAnnotationsAPI extends API {
   constructor(projectId, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.DOWNLOAD_PROJECT_ANNOTATIONS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/export_project_tasks/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.downloadProjectAnnotations = res;
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
     return this.downloadProjectAnnotations;
   }
 }
 