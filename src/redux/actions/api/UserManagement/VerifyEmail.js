/**
 * Verify Email API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class VerifyEmailAPI extends API {
  constructor(oldEmailCode, newEmailCode, timeout = 2000) {
    super("POST", timeout, false);
    this.oldEmailCode = oldEmailCode;
    this.newEmailCode = newEmailCode;
    this.type = constants.VERIFY_EMAIL;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch}verify_email_updation/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.verifyEmail = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      old_email_update_code: this.oldEmailCode,
      new_email_verification_code: this.newEmailCode,
    };
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
    return this.verifyEmail;
  }
}
