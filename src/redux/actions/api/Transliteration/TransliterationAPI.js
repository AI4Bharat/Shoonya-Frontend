/**
 * Upload data API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class TransliterationAPI extends API {
   constructor(transliterateObj,id, timeout = 2000) {
     super("POST",  false);
     this.transliterateObj = transliterateObj;
     this.type = constants.UPLOAD_DATA;
     this.endpoint = `${super.apiEndPointAuto()}/logs/transliteration_selection/`;
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
    return this.transliterateObj;
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
     return this.transliterateObj;
   }
 }