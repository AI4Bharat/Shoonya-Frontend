import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class WorkspaceMetaAnalyticsAPI extends API {
   constructor(wsId, project_type_filter, progressObj, timeout = 2000) {
     super("GET", timeout, false);
     this.progressObj = progressObj;
     this.type = constants.WS_META_ANALYTICS;
     project_type_filter=='AllTypes'?
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${wsId}/cumulative_tasks_count_all/?metainfo=true`
     :
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${wsId}/cumulative_tasks_count_all/?metainfo=true&project_type_filter=${project_type_filter}`
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.wsMetaAnalytics = res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
     return this.progressObj;
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
     return this.wsMetaAnalytics;
   }
 }