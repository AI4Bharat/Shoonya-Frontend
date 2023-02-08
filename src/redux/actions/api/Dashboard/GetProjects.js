/**
 * Login API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constant from '../../../constants';

export default class GetProjectsAPI extends API {
  constructor(selectedFilters, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constant.GET_PROJECT_DATA
    let queryString = "";

    for (let key in selectedFilters) {
      if (selectedFilters[key] && selectedFilters[key] !== "") {
        switch (key) {
          case 'project_type':
            queryString += `${key}=${selectedFilters[key]}`
            break;
          case 'project_user_type':
            queryString += `&${key}=${selectedFilters[key]}`
            break;
          case 'archived_projects':
            queryString += `&${key}=${selectedFilters[key]}`
            break;
          default:
            queryString += ``

        }
      }
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}projects_list/optimized/?${queryString}`;
    }
  }
  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.projectData = res;
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
    return this.projectData;
  }
}
