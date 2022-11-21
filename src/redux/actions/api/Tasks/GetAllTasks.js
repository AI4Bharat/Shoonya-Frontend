

 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetAllTasksAPI extends API {
   constructor(projectId, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_ALL_TASKS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}?project_id=${projectId}`;
   }

 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.allTasks = res;
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
     return this.allTasks
   }
 }
 