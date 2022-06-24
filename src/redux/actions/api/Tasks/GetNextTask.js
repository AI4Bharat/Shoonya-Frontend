/**
 * Get Next Task API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetNextTaskAPI extends API {
  constructor(projectId, taskId, timeout = 2000) {
    super("POST", timeout, false);
    this.projectId = projectId;
    this.labellingMode = localStorage.getItem("labellingMode");
    this.type = constants.GET_NEXT_TASK;
    this.endpoint = this.labellingMode ? `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/next/?current_task_id=${taskId}&task_status=${this.labellingMode}` : `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/next/?current_task_id=${taskId}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.nextTask = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return { id: this.projectId };
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
    return this.nextTask;
  }
}
 