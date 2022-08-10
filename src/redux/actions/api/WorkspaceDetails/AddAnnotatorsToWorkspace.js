/**
 * API to add members to a project
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class AddAnnotatorsToWorkspaceAPI extends API {
  constructor(workspaceId, userEmails, timeout = 2000) {
    super("POST", timeout, false);
    this.type = constants.ADD_MEMBERS_TO_WORKSPACE;
    this.emails = userEmails;
    this.endpoint = `${super.apiEndPointAuto()}${
      ENDPOINTS.getWorkspaces
    }${workspaceId}/addmembers/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.msg = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      user_id: this.emails,
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("shoonya_access_token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.msg;
  }
}
