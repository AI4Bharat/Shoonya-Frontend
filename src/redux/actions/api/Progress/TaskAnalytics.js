import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";
 
 export default class TaskAnalyticsDataAPI extends API {
   constructor(OrgId,progressObj, timeout = 2000) {
     super("GET", timeout, false);
     this.progressObj = progressObj;
     this.type = C.FETCH_TASK_ANALYTICS_DATA;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}public/1/cumulative_tasks_count/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.fetchTaskAnalyticsData = res;
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
     return this.fetchTaskAnalyticsData;
   }
 }