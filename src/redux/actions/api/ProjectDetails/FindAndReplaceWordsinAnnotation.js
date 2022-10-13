/**
 * Login API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class FindAndReplaceWordsInAnnotationAPI extends API {
   constructor(projectId,AnnotationObj, timeout = 2000) {
     super("POST", timeout, false);
     this.AnnotationObj = AnnotationObj;
      this.type = constants.FIND_AND_REPLACE;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks}${projectId}/find_and_replace_words_in_annotation/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.findAndReplace= res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
   getBody() {
    return this.AnnotationObj;
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
     return this.findAndReplace 
   }
 }
 