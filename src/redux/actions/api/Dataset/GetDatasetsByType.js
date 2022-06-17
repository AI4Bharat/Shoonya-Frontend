/**
 * Dataset List API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from '../../../constants';

export default class GetDatasetsByTypeAPI extends API {
  constructor(datasetType, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_DATASETS_BY_TYPE;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/?dataset_type=${datasetType}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.datasetList = res;
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
    return this.datasetList;
  }
}
