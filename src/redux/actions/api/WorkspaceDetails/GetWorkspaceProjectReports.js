/**
 * Workspace User Reports API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetWorkspaceProjectReportsAPI extends API {
   constructor(workspaceId, language,reportsType, timeout = 2000) {
     super("POST", timeout, false);
     this.type = constants.GET_WORKSPACE_PROJECT_REPORTS;
     this.language = language;
     this.reportsType = reportsType ;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${workspaceId}/project_analytics/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.workspaceProjectReports = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return this.language === "all" ? {
      reports_type: this.reportsType,
    } : {
        tgt_language: this.language,
        reports_type: this.reportsType,
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
     return this.workspaceProjectReports
   }
 }
 