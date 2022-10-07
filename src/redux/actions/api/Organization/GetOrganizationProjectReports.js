/**
 * Get Organization Project Reports API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetOrganizationProjectReportsAPI extends API {
  constructor(orgId, projectType, startDate, endDate,reportsType, targetLanguage ,onlyReviewProjects, sortByColumn, descOrder, timeout = 2000) {
    super("POST", timeout, false);
    this.projectType = projectType;
    this.startDate = startDate;
    this.endDate = endDate;
    this.targetLanguage = targetLanguage === "all" ? undefined : targetLanguage;
    this.onlyReviewProjects = onlyReviewProjects;
    this.sortByColumn = sortByColumn ?? undefined;
    this.descOrder = descOrder ?? undefined;
    this.reportsType = reportsType ;
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
      from_date: this.startDate,
      to_date: this.endDate,
      tgt_language: this.targetLanguage,
      ...(  this.onlyReviewProjects == true ||this.onlyReviewProjects == false ) && {only_review_projects: this.onlyReviewProjects},
      sort_by_column_name: this.sortByColumn,
      descending_order: this.descOrder,
      reports_type: this.reportsType,
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
