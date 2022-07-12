/**
 * Fetch User By ID API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class FetchUserByIdAPI extends API {
  constructor(userId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.FETCH_USER_BY_ID;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}account/${userId}/fetch/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.userDetails = res;
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
        "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.userDetails;
  }
}
