/**
 * Workspace User Reports API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetUserAnalyticsAPI extends API {
   constructor(fromDate, toDate, projectType, workspaces, timeout = 2000) {
     super("POST", timeout, false);
     this.type = constants.GET_USER_ANALYTICS;
     this.fromDate = fromDate;
     this.toDate = toDate;
     this.projectType = projectType;
     this.workspaces = workspaces;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}user_analytics/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.userAnalytics = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return {
        from_date: this.fromDate,
        to_date: this.toDate,
        project_type: this.projectType,
        workspace_id: this.workspaces
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
     return this.userAnalytics
   }
 }
 