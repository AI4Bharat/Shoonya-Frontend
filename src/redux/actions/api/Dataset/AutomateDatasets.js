/**
 * Automate Datasets API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from '../../../constants';

export default class AutomateDatasetsAPI extends API {
  constructor(srcInstanceId, tgtInstanceId, languages, organizationId, model, checks, timeout = 2000) {
    super("POST", timeout, false);
    this.type = constants.AUTOMATE_DATASETS;
    this.input_dataset_instance_id = srcInstanceId;
    this.languages = languages;
    this.output_dataset_instance_id = tgtInstanceId;
    this.organization_id = organizationId;
    this.checks_for_particular_languages = checks;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.functions}${model === 1 ? "schedule_ai4b_translate_job": "schedule_google_translate_job"}`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.res = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      input_dataset_instance_id: this.input_dataset_instance_id,
      languages: this.languages,
      output_dataset_instance_id: this.output_dataset_instance_id,
      organization_id: this.organization_id,
      checks_for_particular_languages: this.checks_for_particular_languages
    }
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
    return this.res;
  }
}
