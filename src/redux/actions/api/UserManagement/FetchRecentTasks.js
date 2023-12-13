/**
 * FetchRecentTasks
 */

 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class FetchRecentTasksAPI extends API {
   constructor(task_type, pageNo, filter,countPerPage, timeout = 2000) {
    console.log(task_type,"task_typetask_type")
     super("GET", timeout, false);
    //  this.userId = user_id;
     this.taskType = task_type;
     let queryString = `${pageNo ? "page="+pageNo : ""}${countPerPage ?"&records="+countPerPage : ""}${task_type ? "&task_type="+task_type:""}`;
     for (let key in filter) {
      if (filter[key] && filter[key] !== -1) {
          queryString +=  `&${key}=${filter[key]}`
      }
    }
     this.type = constants.GET_RECENT_TASKS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}annotated_and_reviewed_tasks/get_users_recent_tasks/?${queryString}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.Tasks = res;
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
         "Authorization": `JWT ${localStorage.getItem("shoonya_access_token")}`
       },
     };
     return this.headers;
   }
 
   getPayload() {
     return this.Tasks
   }
 }
 