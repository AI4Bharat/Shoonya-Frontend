
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetUserDetailAPI extends API {
  constructor(timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_USER_DETAILS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch}user_details`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.userDetail = res;
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
    return this.userDetail
  }
}
