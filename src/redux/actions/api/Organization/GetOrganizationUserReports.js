/**
 * Get Organization User Reports API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetOrganizationUserReportsAPI extends API {
  constructor(orgId, projectType, startDate, endDate,reportsType, targetLanguage, sendMail, onlyReviewProjects,sortByColumn, descOrder, timeout = 2000) {
    super("POST", timeout, false);
    this.projectType = projectType;
    this.startDate = startDate;
    this.endDate = endDate;
    this.targetLanguage = targetLanguage === "all" ? undefined : targetLanguage;
    this.sendMail = sendMail ?? false;
    this.onlyReviewProjects = onlyReviewProjects;
    this.sortByColumn = sortByColumn ?? undefined;
    this.descOrder = descOrder ?? undefined;
    this.reportsType = reportsType ;
    this.type = constants.GET_ORGANIZATION_USER_REPORTS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}${orgId}/user_analytics/`;
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
      from_date: this.startDate,
      to_date: this.endDate,
      tgt_language: this.targetLanguage,
      ...{project_progress_stage: this.onlyReviewProjects},
      sort_by_column_name: this.sortByColumn,
      descending_order: this.descOrder,
      reports_type: this.reportsType,
      send_mail: this.sendMail,
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
