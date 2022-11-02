import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class DeleteProjectTasksAPI extends API {
   constructor(projectId,projectObj, timeout = 2000) {
     super("PUT", timeout, false);
     this.projectObj = projectObj;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}${projectId}/delete_project_tasks/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.deleteProjectTasks= res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
   getBody() {
    return this.projectObj;
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
     return this.deleteProjectTasks 
   }
 }
 