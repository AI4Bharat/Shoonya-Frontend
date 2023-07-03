
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class WorkspaceCumulativeTasksAPI extends API {
   constructor(wsId, progressObj, metaInfo, timeout = 2000) {
     super("POST", timeout, false);
     this.progressObj = progressObj;
     this.type = constants.WS_CUMULATIVE_TASK;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${wsId}/cumulative_tasks_count/${metaInfo ? "?metainfo=true" : ""}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.wsCumulativeTasks = res;
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
     return this.wsCumulativeTasks;
   }
 }
 