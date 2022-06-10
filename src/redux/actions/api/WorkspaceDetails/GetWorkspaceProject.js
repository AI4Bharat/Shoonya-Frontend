/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetWorkspacesProjectDetailsAPI extends API {
   constructor(workspaceId, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_WORKSPACE_PROJECT_DATA;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${workspaceId}/projects/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.workspaceProjectDetails = res;
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
     return this.workspaceProjectDetails
   }
 }
 