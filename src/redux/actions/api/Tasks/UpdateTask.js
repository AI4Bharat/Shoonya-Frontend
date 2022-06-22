/**
 * Update Task API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class UpdateTaskAPI extends API {
  constructor(taskId, taskObj, timeout = 2000) {
    super("PATCH", timeout, false);
    this.taskObj = taskObj;
    this.type = constants.UPDATE_TASK;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}${taskId}/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.updatedTask = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.taskObj;
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
    return this.updatedTask;
  }
}
