/**
 * Dataset List API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constant from '../../../constants';

 export default class GetDatasetsAPI extends API {
   constructor(selectedFilters,timeout = 2000) {
     super("GET", timeout, false);
     this.type = constant.GET_DATASET_LIST
     let queryString = "";

    for (let key in selectedFilters) {
      if (selectedFilters[key] && selectedFilters[key] !== "") {
        switch (key) {
          case 'dataset_visibility':
            queryString += `${key}=${selectedFilters[key]}`
            break;
          case 'dataset_type':
            queryString += `&${key}=${selectedFilters[key]}`
            break;
         
          default:
            queryString += ``

        }
      }
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/optimized-list/?${queryString}`;
   }
  }
   processResponse(res) {
    super.processResponse(res);
    if (res) {
        this.datasetList = res;
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
     return this.datasetList;
   }
 }
 