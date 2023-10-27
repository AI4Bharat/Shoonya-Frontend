/**
 * Workspace User Reports API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetWorkspaceProjectReportsAPI extends API {
   constructor(workspaceId, projectType, language, sendMail, reportsType, timeout = 2000) {
     super("POST", timeout, false);
     this.type = constants.GET_WORKSPACE_PROJECT_REPORTS;
     this.projectType = projectType;
     this.language = language;
     this.sendMail = sendMail ;
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
      project_type: this.projectType,
      reports_type: this.reportsType,
      send_mail: this.sendMail,
    } : {
        project_type: this.projectType,
        tgt_language: this.language,
        reports_type: this.reportsType,
        send_mail: this.sendMail,
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
 
