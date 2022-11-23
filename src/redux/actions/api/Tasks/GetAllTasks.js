

 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetAllTasksAPI extends API {
   constructor(projectId, selectedFilters, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_ALL_TASKS;
     let queryString = `?project_id=${projectId}`;
     for (let key in selectedFilters) {
        if (selectedFilters[key] && selectedFilters[key] !== -1) {
          queryString += `&${key}=["${selectedFilters[key].join('", "')}"]`
          
        }
      }
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks+queryString}`;
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
 