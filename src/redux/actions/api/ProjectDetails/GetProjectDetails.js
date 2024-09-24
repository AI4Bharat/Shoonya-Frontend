/**
 * Login API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetProjectDetailsAPI extends API {
  constructor(projectId, method = 'GET', payload = null, timeout = 2000) {
    super(method, timeout, false);
    this.projectId = projectId;
    this.method = method.toUpperCase();
    this.payload = payload;

    if (this.method === 'GET') {
      this.type = constants.GET_PROJECT_DETAILS;
    } else if (this.method === 'PATCH') {
      this.type = constants.PATCH_PROJECT_DETAILS;
    } else {
      throw new Error(`Unsupported HTTP method: ${method}`);
    }
    
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}${this.method === 'PATCH' ? '/' : ''}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      if (this.method === 'GET') {
        this.projectDetails = res;
      } else if (this.method === 'PATCH') {
        this.updatedProjectDetails = res;
      }
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    if (this.method === 'PATCH' && this.payload) {
      return JSON.stringify(this.payload);
    }
    return null;
  }

  getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    if (this.method === 'GET') {
      return this.projectDetails;
    } else if (this.method === 'PATCH') {
      return this.updatedProjectDetails;
    }
    return null;
  }
}
