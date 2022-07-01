/**
 * EditOrganization API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
  
 export default class InviteUsersToOrgAPI extends API {
    constructor(orgId, emails, role, timeout = 2000) {
      super("POST", timeout, false);
      this.type = constants.INVITE_USERS_TO_ORG;
      this.organization_id = orgId;
      this.emails = emails;
      this.role = role;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}invite/generate/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.inviteRes = res;
      }
  }
  
    apiEndPoint() {
      return this.endpoint;
    }
 
    getBody() {
        return {
            organization_id: this.organization_id,
            emails : this.emails,
            role : this.role
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
      return this.inviteRes;
    }
  }
  