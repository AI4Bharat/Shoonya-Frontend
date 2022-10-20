/**
 * Automate Datasets API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from '../../../constants';

export default class AutomateDatasetsAPI extends API {
  constructor(srcInstanceId, tgtInstanceId, languages, organizationId,apitype, model, checks, timeout = 2000) {
    super("POST", timeout, false);
    this.type = constants.AUTOMATE_DATASETS;
    this.input_dataset_instance_id = srcInstanceId;
    this.languages = languages;
    this.output_dataset_instance_id = tgtInstanceId;
    this.organization_id = organizationId;
    this.checks_for_particular_languages = checks;
    this.apitype=apitype;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.functions}automated_sentence_text_translation_job`;
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
      checks_for_particular_languages: this.checks_for_particular_languages,
      apitype:this.apitype
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
