import API from "../../../api";

export default class GetWorkspaceDetailedProjectReportsAPI extends API {
  constructor(workId, projectType, userId, statistics, language, timeout = 2000) {
    super("POST", timeout, false);
    this.workId = workId;
    this.projectType = projectType;
    this.userId = userId;
    this.statistics = statistics;
    this.language = language;
    this.endpoint = `${super.apiEndPointAuto()}/functions/schedule_project_reports_email`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.workspaceDetailedProjectReport = res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    const body = {
      workspace_id: this.workId,
      user_id: this.userId,
      project_type: this.projectType,
      language: this.language
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
    return this.workspaceDetailedProjectReport;
  }
}
