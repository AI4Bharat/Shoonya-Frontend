
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class WorkspacePeriodicalTasksAPI extends API {
   constructor(wsId, progressObj, metaInfo, timeout = 2000) {
     super("POST", timeout, false);
     this.progressObj = progressObj;
     this.type = constants.WS_PERODICAL_TASK;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${wsId}/periodical_tasks_count/${metaInfo ? "?metainfo=true" : ""}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.wsPeriodicalTasks = res;
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
     return this.wsPeriodicalTasks;
   }
 }
 