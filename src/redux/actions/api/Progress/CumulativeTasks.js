
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class CumulativeTasksAPI extends API {
   constructor(progressObj1, OrgId, metaInfo, timeout = 2000) {
     super("POST", timeout, false);
     this.progressObj1 = progressObj1;
     this.type = constants.CUMULATIVE_TASK_DATA;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}${OrgId}/cumulative_tasks_count/${metaInfo ? "?metainfo=true" : ""}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.CumulativeTasks = res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
     return this.progressObj1;
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
     return this.CumulativeTasks;
   }
 }
 