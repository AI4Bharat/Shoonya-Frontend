import API from "../../../api";

export default class GetOrganizationDetailedProjectReportsAPI extends API {
  constructor(orgId, projectType, userId, statistics, timeout = 2000) {
    super("POST", timeout, false);
    this.orgId = orgId;
    this.projectType = projectType;
    this.userId = userId;
    this.statistics = statistics;
    this.endpoint = `${super.apiEndPointAuto()}/functions/schedule_project_reports_email`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.orgDetailedProjectReport = res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    const body = {
      organization_id: this.orgId,
      user_id: this.userId,
      project_type: this.projectType,
    };

    if(this.statistics === 1){
      body.annotation_statistics = true;
    }else if(this.statistics === 2){
      body["meta-info_statistics"] = true;
    }else if(this.statistics === 3){
      body.complete_statistics = true;
    }

    return body;
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
    return this.orgDetailedProjectReport;
  }
}
