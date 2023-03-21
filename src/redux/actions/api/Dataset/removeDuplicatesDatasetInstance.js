
/**
 * remove Duplicates Dataset Instance
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class removeDuplicatesDatasetInstanceAPI extends API {
   constructor( datasetId,dataitemsvalues,timeout = 2000) {
     super("GET", timeout, false);
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/${datasetId}/remove_duplicates_from_dataset_instance/?deduplicate_fields_list=${dataitemsvalues}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.removeDuplicatesDatasetInstance = res;
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
     return this.removeDuplicatesDatasetInstance;
   }
 }
 