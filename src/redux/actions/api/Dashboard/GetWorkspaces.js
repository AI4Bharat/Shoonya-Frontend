/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constant from '../../../constants';

 export default class GetWorkspacesAPI extends API {
   constructor(pageNo, records, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constant.GET_WORKSPACES_DATA
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}user-workspaces/loggedin-user-workspaces/`;
   }

   processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.workspaceData = res;
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
     return this.workspaceData;
   }
 }
 