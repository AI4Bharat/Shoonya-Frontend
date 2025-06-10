
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetUserDetailUpdateAPI extends API {
  constructor(Id,projectObj,timeout = 2000) {
    super("PATCH", timeout, false);
    this.projectObj = projectObj;
    // this.type = constants.GET_USER_DETAILS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch}${Id}/edit_user_details/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.userDetailUpdate = res;
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
    return this.userDetailUpdate
  }
}
