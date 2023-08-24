
import API from "../../api";
import ENDPOINTS from "../../../config/apiendpoint";
import constants from "../../constants";
 
export default class GetAnnotationsTaskAPI extends API {
   constructor(taskId,timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_ANNOTATIONS_TASK;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}${taskId}/annotations/?enable_chitralekha_UI=true`;
   }
  
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.getAnnotationsTask = res;
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
     return this.getAnnotationsTask;
   }
 }
 