import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class PostTransliterationForLogging extends API {
  constructor(source_text, target_text, transliterated_text, timeout = 2000) {
    super("POST", timeout, false);
    this.transliterationLog = {
      source_text: source_text,
      target_text: target_text,
      transliterated_text: transliterated_text
    };
    this.type = constants.POST_TRANSLITERATION_LOG;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.transliteration_log}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.newTransliterationLog = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return this.transliterationLog;
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
    return this.newTransliterationLog;
  }
}
