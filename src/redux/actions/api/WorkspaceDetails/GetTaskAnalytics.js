import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class WorkspaceTaskAnalyticsAPI extends API {
  constructor(wsId, projectTypeFilter, startDate, endDate, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.WS_TASK_ANALYTICS;
    const queryParams = new URLSearchParams();

    if (projectTypeFilter !== "AllTypes") {
      queryParams.set("project_type_filter", projectTypeFilter);
    }
    if (startDate && endDate) {
      queryParams.set("start_date", startDate);
      queryParams.set("end_date", endDate);
    }

    const queryString = queryParams.toString();
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces}${wsId}/cumulative_tasks_count_all/${queryString ? `?${queryString}` : ""}`;
  }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.wsTaskAnalytics = res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {}
 
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
     return this.wsTaskAnalytics;
   }
 }