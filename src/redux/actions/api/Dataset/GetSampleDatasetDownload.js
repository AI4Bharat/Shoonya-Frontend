import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

const CONSTANT_MAP = {
  csv: constants.GET_SAMPLE_DATASET_DOWNLOAD_CSV,
  tsv: constants.GET_SAMPLE_DATASET_DOWNLOAD_TSV,
  json: constants.GET_SAMPLE_DATASET_DOWNLOAD_JSON,
};

export default class GetSampleDatasetDownload extends API {
  constructor(datasetId, exportType = "csv", timeout = 2000) {
    super("GET", timeout, false);
    this.type = CONSTANT_MAP[exportType.toLowerCase()];
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/${datasetId}/download_sample_dataset/?export_type=${exportType}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.downloadSampleDataset = res;
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
    return this.downloadSampleDataset;
  }
}