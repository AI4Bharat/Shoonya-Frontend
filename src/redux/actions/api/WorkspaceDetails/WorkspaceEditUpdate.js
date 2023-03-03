/**
 * Login API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetWorkspaceSaveButtonAPI extends API {
  constructor(id,workspaceObj, timeout = 2000) {
    super("PUT", timeout, false);
    this.workspaceObj = workspaceObj;
    console.log(workspaceObj)
    // this.type = constants.GET_SAVE_BUTTON;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${id}/`;
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
   return this.workspaceObj;
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
