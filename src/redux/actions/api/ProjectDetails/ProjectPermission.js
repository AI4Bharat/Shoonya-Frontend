
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class ProjectPermission extends API {
   constructor(projectId, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_PROJECT_PERMISSION;
     this.endpoint = `${super.apiEndPointAuto()}/organizations/project_permission/?fetch_all=True`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.ProjectPermission = res;
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
     return this.ProjectPermission;
   }
 }
 