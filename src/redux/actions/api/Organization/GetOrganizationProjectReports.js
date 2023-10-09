/**
 * Get Organization Project Reports API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetOrganizationProjectReportsAPI extends API {
  constructor(orgId, projectType, targetLanguage , sortByColumn, descOrder, timeout = 2000) {
    super("POST", timeout, false);
    this.projectType = projectType;
    this.targetLanguage = targetLanguage === "all" ? undefined : targetLanguage;
    this.sortByColumn = sortByColumn ?? undefined;
    this.descOrder = descOrder ?? undefined;
    this.emailId = localStorage.getItem("email_id");
    this.type = constants.GET_ORGANIZATION_PROJECT_REPORTS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}${orgId}/project_analytics/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.orgProjectReport = res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      project_type: this.projectType,
      tgt_language: this.targetLanguage,
      sort_by_column_name: this.sortByColumn,
      descending_order: this.descOrder,
      email_id: this.emailId,
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
    return this.orgProjectReport;
  }
}
