
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class DeleteScheduledMailsAPI extends API {
  constructor(userId, taskId, timeout = 2000) {
    super("POST", timeout, false);
    this.type = constants.DELETE_SCHEDULED_MAILS;
    this.taskId = taskId;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}${userId}/delete_scheduled_mail/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.deleteScheduledMails = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      task_id: this.taskId,
    }
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
    return this.deleteScheduledMails;
  }
}
