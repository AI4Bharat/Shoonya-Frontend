/**
 * Get Task Annotations API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetTaskAnnotationsAPI extends API {
  constructor(taskId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_TASK_ANNOTATIONS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}${taskId}/annotations/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.taskAnnotations = res;
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
    return this.taskAnnotations;
  }
}
