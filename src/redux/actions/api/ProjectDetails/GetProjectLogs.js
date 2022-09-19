/**
 * Project Logs API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class GetProjectLogsAPI extends API {
   constructor(projectId, taskName, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_PROJECT_LOGS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/get_async_task_results/?task_name=${taskName}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.projectLogs = res;
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
     return this.projectLogs;
   }
 }
 