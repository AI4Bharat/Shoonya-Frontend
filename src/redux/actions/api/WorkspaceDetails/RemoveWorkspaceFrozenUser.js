
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class RemoveWorkspaceFrozenUserAPI extends API {
   constructor(workspacesId,workspacesObj, timeout = 2000) {
     super("POST", timeout, false);
     this.workspacesObj = workspacesObj;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${workspacesId}/remove_frozen_user/`;
   }  
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.removeWorkspaceFrozenUser = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
     return this.workspacesObj;
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
     return this.removeWorkspaceFrozenUser;
   }
 }
 