import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";
 
export default class TaskAnalyticsDataAPI extends API {
  constructor(orgId, projectTypeFilter, startDate, endDate, timeout = 2000) {
    super("GET", timeout, false);
    this.type = C.FETCH_TASK_ANALYTICS_DATA;
    const queryParams = new URLSearchParams();

    if (projectTypeFilter !== "AllTypes") {
      queryParams.set("project_type_filter", projectTypeFilter);
    }
    if (startDate && endDate) {
      queryParams.set("start_date", startDate);
      queryParams.set("end_date", endDate);
    }

    const queryString = queryParams.toString();
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}public/${orgId}/cumulative_tasks_count/${queryString ? `?${queryString}` : ""}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.fetchTaskAnalyticsData = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {};
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
     return this.fetchTaskAnalyticsData;
   }
 }
