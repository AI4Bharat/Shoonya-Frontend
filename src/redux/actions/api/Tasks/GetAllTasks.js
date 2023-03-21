

 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetAllTasksAPI extends API {
   constructor(projectId,pageNo,selectedFilters,currentRowPerPage, timeout = 2000) {
  
     super("GET", timeout, false);
     this.type = constants.GET_ALL_TASKS;
     let queryString = `?project_id=${projectId}${pageNo ? "&page="+pageNo : ""}${currentRowPerPage ?"&records="+currentRowPerPage : ""}`;
     for (let key in selectedFilters) {
        if (selectedFilters[key] && selectedFilters[key] !== -1) {
          if(key=="task_status"){  
              queryString +=  `&${key}=${JSON.stringify(selectedFilters[key])}`
          }else{
            queryString +=  `&${key}=${selectedFilters[key]}`
          }
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
 