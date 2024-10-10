
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class EditDatasetPermission extends API {
   constructor(name,roles, timeout = 2000) {
     super("POST", timeout, false);
     this.type = constants.EDIT_PROJECT_PERMISSION;
     this.roles = roles;
     this.endpoint = `${super.apiEndPointAuto()}/organizations/dataset_permission/?permission_name=${name}&fetch_all=True`;
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

   getBody() {
    return {
      new_roles: [5]
    }
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
     return this.EditProjectPermission;
   }
 }
 