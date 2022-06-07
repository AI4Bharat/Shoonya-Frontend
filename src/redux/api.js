/**
 * base class for API object
 */
import config from '../config/config';

export default class API {
  constructor(method = "POST", timeout = 2000, auth = false, reqType = "") {
    this.code = null;
    this.message = null;
    this.reqType = reqType;
    this.domain = null;
    this.method = method;
    this.timeout = timeout;
    this.auth = auth;
    this.baseUrl = config.BASE_URL;
    this.baseUrlAuto = config.BASE_URL_AUTO;
  }

  toString() {
    return `( code: ${this.code} message: ${this.message} domain: ${this.domain} method: ${this.method} timeout: ${this.timeout} auth: ${this.auth}`;
  }

  apiEndPoint() {
    return this.baseUrl;
  }

  dontShowApiLoader() {
    return false;
  }

  apiEndPointAuto() {
    return this.baseUrlAuto;
  }

  processResponse(res) {
    this.code = res.code;
    this.message = res.message;
    this.domain = res.domain;
  }
}
