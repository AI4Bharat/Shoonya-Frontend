//glossary SuggestAnEdit

import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class SuggestAnEditAPI extends API {
   constructor(GlossaryObj,timeout = 2000) {
     super("POST", timeout, false);
     this.GlossaryObj = GlossaryObj;
     //this.type = constants.GLOSSARY;
    //  console.log(GlossaryObj,"GlossaryObj")
     this.endpoint = `${"https://glossary-api.ai4bharat.org/glossary-explorer"}${ENDPOINTS.Glossary}suggest`;
   }
  
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.suggestAnEdit = res;
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
     return this.suggestAnEdit;
   }
 }
 