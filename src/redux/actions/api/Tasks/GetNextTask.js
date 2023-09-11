/**
 * Get Next Task API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetNextTaskAPI extends API {
  constructor(projectId,projectObj, mode="annotation", timeout = 2000) {

    // console.log(projectObj,"projectObjprojectObj")
    super("POST", timeout, false);
    let queryStr = "";
    this.projectId = projectId;
    this.labellingMode = localStorage.getItem("labellingMode");
    this.searchFilters = JSON.parse(localStorage.getItem("searchFilters"));
    console.log(this.searchFilters = JSON.parse(localStorage.getItem("searchFilters")),"searchFilterssearchFilters")
    this.projectObj = projectObj;
    this.type = constants.GET_NEXT_TASK;
    if (localStorage.getItem("labelAll") ) {
      Object.keys(this.searchFilters).forEach((key,index) => {
        let keyValStr = `${key}=${this.searchFilters[key]}`;
        queryStr += index === 0 ? keyValStr : `&${keyValStr}`;
      });
    }
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/next/?${queryStr}`;
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
 