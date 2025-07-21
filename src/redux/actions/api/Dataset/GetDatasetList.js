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

    if (selectedFilters.page_number) {
      queryString += `page_number=${selectedFilters.page_number}`;
    }
    if (selectedFilters.page_size) {
      queryString += queryString ? `&page_size=${selectedFilters.page_size}` : `page_size=${selectedFilters.page_size}`;
    }
    if (selectedFilters.search) {
      queryString += queryString ? `&search=${selectedFilters.search}` : `search=${selectedFilters.search}`;
    }

    for (let key in selectedFilters) {
      if (selectedFilters[key] && selectedFilters[key] !== "" && 
          key !== 'page_number' && key !== 'page_size' && key !== 'search') {
        if (key === 'dataset_visibility' || key === 'dataset_type') {
          queryString += queryString ? `&${key}=${selectedFilters[key]}` : `${key}=${selectedFilters[key]}`;
        }
      }
    }
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/?${queryString}`;
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
 