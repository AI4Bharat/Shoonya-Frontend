/**
 * Delete Annotation API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constant from '../../../constants';

export default class DeleteAnnotationAPI extends API {
  constructor(annotationId, timeout = 2000) {
    super("DELETE", timeout, false);
    this.type = constant.DELETE_ANNOTATION;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.annotations}${annotationId}/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.deletedAnnotation = res;
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
    return this.deletedAnnotation;
  }
}
