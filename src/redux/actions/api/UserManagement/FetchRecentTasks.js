/**
 * FetchRecentTasks
 */

 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class FetchRecentTasksAPI extends API {
   constructor(user_id, task_type, pageNo, countPerPage, timeout = 2000) {
     super("POST", timeout, false);
     this.userId = user_id;
     this.taskType = task_type;
     this.type = constants.GET_RECENT_TASKS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}annotated_and_reviewed_tasks/get_users_recent_tasks/?${pageNo ? "page="+pageNo : ""}${countPerPage ?"&records="+countPerPage : ""}`;
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
 
   getBody() {
        return {
            user_id: this.userId,
            task_type: this.taskType,
        };
   }
 
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
 