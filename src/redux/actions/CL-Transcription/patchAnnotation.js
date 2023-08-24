

import API from "../../api";
import ENDPOINTS from "../../../config/apiendpoint";
import constants from "../../constants";
 
export default class PatchAnnotationAPI extends API {
   constructor(annotationsId,userObj,timeout = 2000) {
     super("PATCH", timeout, false);
     this.userObj = userObj;
     this.type = constants.PATCH_ANNOTATION;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.annotations}${annotationsId}/?cl_format=true`;
   }
  
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.patchAnnotation = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
    return this.userObj;
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
     return this.patchAnnotation;
   }
 }
 