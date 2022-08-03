/**
 * Post Annotation API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class PostAnnotationAPI extends API {
  constructor(result, task, completed_by, load_time, task_status, notes, timeout = 2000) {
    super("POST", timeout, false);
    this.annotation = {
      result: result,
      task: task,
      completed_by: completed_by,
      lead_time: (Date.now() - load_time) / 1000,
      task_status: task_status,
      notes: notes
    };
    this.type = constants.POST_ANNOTATION;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.annotations}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.newAnnotation = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.annotation;
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
    return this.newAnnotation;
  }
}
