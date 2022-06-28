/**
 * Workspace User Reports API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetWorkspaceUserReportsAPI extends API {
   constructor(workspaceId, projectType, fromDate, toDate, language, timeout = 2000) {
     super("POST", timeout, false);
     this.type = constants. GET_WORKSPACE_USER_REPORTS;
     this.projectType = projectType;
     this.fromDate = fromDate;
     this.toDate = toDate;
      this.language = language;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${workspaceId}/user_analytics/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.workspaceUserReports = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return {
        project_type: this.projectType,
        from_date: this.fromDate,
        to_date: this.toDate,
        tgt_language: this.language
    }
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
     return this.workspaceUserReports
   }
 }
 