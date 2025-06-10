/**
 * GetTaskDetails
 */

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetQueuedTaskDetailsAPI extends API {
  constructor(taskId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_QUEUED_TASK_DETAILS;
    this.endpoint = `${super.apiEndPointAuto()}/tasks/get_celery_tasks`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.queuedTaskDetails = res;
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
        "Authorization":`JWT ${localStorage.getItem('shoonya_access_token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.queuedTaskDetails
  }
}
