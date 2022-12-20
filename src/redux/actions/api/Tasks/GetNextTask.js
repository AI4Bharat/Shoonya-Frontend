/**
 * Get Next Task API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetNextTaskAPI extends API {
  constructor(projectId,projectObj ,timeout = 2000) {
    super("POST", timeout, false);
    this.projectId = projectId;
    this.labellingMode = localStorage.getItem("labellingMode");
    this.searchFilters = JSON.parse(localStorage.getItem("searchFilters"));
    this.projectObj = projectObj;
    this.type = constants.GET_NEXT_TASK;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/next/`;
    if (localStorage.getItem("labelAll") ) {
      Object.keys(this.searchFilters).forEach(key => {
        this.endpoint += `?${key}=${this.searchFilters[key]}`;
      });
    }
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
    return this.projectObj;
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
 