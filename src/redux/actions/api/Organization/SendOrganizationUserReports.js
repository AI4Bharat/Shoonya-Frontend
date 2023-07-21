/**
 * Send Organization User Reports API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class SendOrganizationUserReportsAPI extends API {
  constructor(orgId, userId, projectType, participationTypes, timeout = 2000) {
    super("POST", timeout, false);
    this.projectType = projectType;
    this.participationTypes = participationTypes;
    this.userId = userId;
    this.type = constants.SEND_ORGANIZATION_USER_REPORTS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}${orgId}/send_user_analytics/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.orgUserReport = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      project_type: this.projectType,
      participation_types: this.participationTypes,
      user_id: this.userId
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
    return this.orgUserReport;
  }
}