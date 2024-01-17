
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class PerformanceAnalyticsAPI extends API {
  constructor(progressObj, OrgId, metaInfo, timeout = 2000) {
    super("POST", timeout, false);
    this.progressObj = progressObj;
    this.type = constants.PERFORMANCE_ANALYTICS_DATA;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}${OrgId}/performance_analytics_data/${metaInfo ? "?metainfo=true" : ""}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.PerformanceAnalytics = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.progressObj;
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
    return this.PerformanceAnalytics;
  }
}
