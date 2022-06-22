/**
 * EditOrganization API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class EditOrganizationAPI extends API {
    constructor(orgId, editedName, timeout = 2000) {
      super("PUT", timeout, false);
      this.type = constants.EDIT_ORGANIZATION_USERS;
      this.title = editedName
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}${orgId}/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.organizationMembers = res;
      }
  }
  
    apiEndPoint() {
      return this.endpoint;
    }
 
    getBody() {
        return {
            title : this.title
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
      return this.organizationMembers;
    }
  }
  