/**
 * Send Workspace User Reports API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class SendWorkspaceUserReportsAPI extends API {
  constructor(wsId, userId, projectType, participationTypes, fromDate, toDate, timeout = 2000) {
    super("POST", timeout, false);
    this.projectType = projectType;
    this.participationTypes = participationTypes;
    this.userId = userId;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.type = constants.SEND_WORKSPACE_USER_REPORTS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${wsId}/send_user_analytics/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.wsUserReport = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      project_type: this.projectType,
      participation_types: this.participationTypes,
      user_id: this.userId,
      from_date: this.fromDate,
      to_date: this.toDate
    };
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.wsUserReport;
  }
}
