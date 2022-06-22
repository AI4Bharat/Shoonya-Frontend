/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetSaveButtonAPI extends API {
   constructor(projectId,ProjectDetails,description,title, timeout = 2000) {
    console.log(projectId,"projectId",ProjectDetails,"ProjectDetails")
     super("PUT", timeout, false);
     this.title = ProjectDetails.title;
     this.description = ProjectDetails.description;
     this.project_mode = ProjectDetails.project_mode;
     this.project_type = ProjectDetails.project_type;
     this.type = constants.GET_SAVE_BUTTON;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.saveButton= res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return {
      title:this.title,
      description: this.description, 
      project_mode:this.project_mode,
      project_type:this.project_type,
    };
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
     return this.saveButton 
   }
 }
 