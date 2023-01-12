/**
 * Get Project Domains API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from '../../../constants';

export default class GetProjectTypeDetailsAPI extends API {
  constructor(projecType,timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_PROJECT_TYPE_DETAILS
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}types/?project_type=${projecType}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.domains = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() { }

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
    return this.domains;
  }
}