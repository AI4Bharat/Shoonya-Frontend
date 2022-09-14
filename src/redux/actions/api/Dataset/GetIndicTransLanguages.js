/**
 * indicTrans Languages API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class GetIndicTransLanguagesAPI extends API {
   constructor(timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_INDIC_TRANS_LANGUAGES;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.functions}get_indic_trans_supported_languages`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.langList = res;
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
     return this.langList;
   }
 }
 