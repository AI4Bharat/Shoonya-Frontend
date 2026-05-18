/**
 * Get Sample Dataset Download API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class GetSampleDatasetDownloadCSV extends API {
  constructor(datasetId, timeout = 2000) {
    super("GET", timeout, false);
    this.type = constants.GET_SAMPLE_DATASET_DOWNLOAD_CSV;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/${datasetId}/download_sample_dataset`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.downloadSampleDatasetCsv = res;
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
        Authorization: `JWT ${localStorage.getItem("shoonya_access_token")}`,
      },
    };
    return this.headers;
  }

  getPayload() {
    return this.downloadSampleDatasetCsv;
  }
}
