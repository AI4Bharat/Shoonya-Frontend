
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class RemoveWorkspaceManagerAPI extends API {
   constructor(workspaceId,projectObj, timeout = 2000) {
     super("POST", timeout, false);
     this.projectObj = projectObj;
      //this.type = constants;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${workspaceId}/unassign_manager/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.removeWorkspaceManager= res;
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
     return this.removeWorkspaceManager 
   }
 }
 