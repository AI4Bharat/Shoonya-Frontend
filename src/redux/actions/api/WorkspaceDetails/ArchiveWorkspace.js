/**
 * ArchiveWorkspace API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class ArchiveWorkspaceAPI extends API {
   constructor(workspaceObj,workspaceId, timeout = 2000) {
     super("POST", timeout, false);
     this.workspaceObj = workspaceObj;
     this.type = constants.ARCHIVE_WORKSPACE;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${workspaceId}/archive/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.archiveworkspace= res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return this.workspaceObj;
  }
 
 
   getHeaders() {
     this.headers = {
       headers: {
         "Content-Type": "application/json",
         "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.archiveworkspace;
   }
 }
 