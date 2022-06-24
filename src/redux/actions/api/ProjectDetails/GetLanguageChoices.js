/**
 * Get Language Choices API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class GetLanguageChoicesAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_LANGUAGE_CHOICES;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}language_choices/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (Array.isArray(res)) {
        this.languageChoices = res;
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
    return this.languageChoices;
  }
}
