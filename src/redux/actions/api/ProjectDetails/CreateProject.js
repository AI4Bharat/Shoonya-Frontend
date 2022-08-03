/**
 * Create Project API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class CreateProjectAPI extends API {
  constructor(projectObj, timeout = 2000) {
    super("POST", timeout, false);
    this.projectObj = projectObj;
    this.type = constants.CREATE_PROJECT;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.newProject = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.projectObj;
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
    return this.newProject;
  }
}
