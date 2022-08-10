/**
 * Update Profile API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";

 export default class UpdateProfileAPI extends API {
    constructor(username, first_name, last_name, languages, phone,availability_status, timeout = 2000) {
      super("POST", timeout, false);
      this.username = username;
      this.first_name = first_name;
      this.last_name = last_name;
      this.languages = languages;
      this.phone = phone;
      this.availability_status = availability_status;
      this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch}update/`;
    }
  
    processResponse(res) {
      super.processResponse(res);
      if (res) {
          this.report = res;
      }
  }
  
    apiEndPoint() {
      return this.endpoint;
    }
  
    getBody() {
      return {
        username: this.username,
        first_name: this.first_name,
        last_name: this.last_name,
        languages: this.languages,
        phone: this.phone,
        availability_status:this.availability_status,
      };
    }
  
    getHeaders() {
      this.headers = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `JWT ${localStorage.getItem("shoonya_access_token")}`
        },
      };
      return this.headers;
    }
  
    getPayload() {
      return this.report
    }
  }
  