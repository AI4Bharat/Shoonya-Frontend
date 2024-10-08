
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class EditProjectPermission extends API {
   constructor(projectId, timeout = 2000) {
     super("POST", timeout, false);
     this.type = constants.EDIT_PROJECT_PERMISSION;
     this.endpoint = `${super.apiEndPointAuto()}/organizations/project_permission/?permission_name=can_view_upload_dataset&fetch_all=True`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.EditProjectPermission = res;
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
     return this.EditProjectPermission;
   }
 }
 