/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetWorkspacesDetailsAPI extends API {
   constructor(workspaceId, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_WORKSPACE_DETAILS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${workspaceId}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.workspaceDetails = res;
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
     return this.workspaceDetails
   }
 }
 