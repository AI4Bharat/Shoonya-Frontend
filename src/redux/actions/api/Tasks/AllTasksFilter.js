

 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class AllTasksFilterAPI extends API {
   constructor(projectId, selectedFilters, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.ALL_TASKS_FILTER;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}?project_id=${projectId}&task_status=['reviewed','exported']`;
   }

 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.allTasksFilter = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {}
 
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
     return this.allTasksFilter
   }
 }
 