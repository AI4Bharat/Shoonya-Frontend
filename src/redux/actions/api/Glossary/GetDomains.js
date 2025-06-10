//glossary sentence

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class GetDomainsAPI extends API {
   constructor(GlossaryObj,timeout = 2000) {
     super("GET", timeout, false);
     this.GlossaryObj = GlossaryObj;
     this.type = constants.GET_ALL_DOMAINS;
     this.endpoint = `${"https://glossary-api.ai4bharat.org/glossary-explorer"}${ENDPOINTS.Glossary}domain`;
   }
  
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.getDomain = res;
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
     return this.getDomain;
   }
 }
 