

import API from "../../api";
import ENDPOINTS from "../../../config/apiendpoint";
import constants from "../../constants";
 
export default class SaveTranscriptAPI extends API {
   constructor(annotationsId,GlossaryObj,timeout = 2000) {
     super("PATCH", timeout, false);
     this.GlossaryObj = GlossaryObj;
     //this.type = constants.Add_GLOSSARY;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.annotations}${annotationsId}/?cl_format=true`;
   }
  
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.saveTranscript = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
    return this.GlossaryObj;
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
     return this.saveTranscript;
   }
 }
 