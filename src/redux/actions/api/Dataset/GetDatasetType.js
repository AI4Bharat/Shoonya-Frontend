/**
 * Get Dataset Type API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class GetDatasetTypeAPI extends API {
   constructor(datasetType, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_DATASET_TYPE;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/dataset_types/`;
   }
     
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.datasetType = res;
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
     return this.datasetType;
   }
 }