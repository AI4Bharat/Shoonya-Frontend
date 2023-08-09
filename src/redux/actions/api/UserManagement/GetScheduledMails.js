
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetScheduledMailsAPI extends API {
  constructor(userId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_SCHEDULED_MAILS;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}${userId}/get_scheduled_mails/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.userScheduledMails = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
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
    return this.userScheduledMails;
  }
}
