/**
 * Login API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetSaveButtonAPI extends API {
  constructor(DatasetId,datasetObj, timeout = 2000) {
    super("PUT", timeout, false);
    this.datasetObj = datasetObj;
    // this.type = constants.GET_SAVE_BUTTON;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/${DatasetId}/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.saveButton= res;
    }
}

  apiEndPoint() {
    return this.endpoint;
  }
  getBody() {
   return this.datasetObj;
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
    return this.saveButton 
  }
}
