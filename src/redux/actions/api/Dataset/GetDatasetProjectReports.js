/**
 * Dataset Instance Project Reports API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetDatasetInstanceProjectReportsAPI extends API {
  constructor(datasetId, projectType, language, timeout = 2000) {
    super("POST", timeout, false);
    this.type = constants.GET_DATASET_PROJECT_REPORTS;
    this.projectType = projectType;
    this.language = language;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/${datasetId}/project_analytics/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.datasetProjectReports = res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.language === "all" ? {
      project_type: this.projectType
    } : {
      project_type: this.projectType,
      tgt_language: this.language,
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
    return this.datasetProjectReports
  }
}
