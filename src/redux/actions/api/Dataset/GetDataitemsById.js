/**
 * GetDatasetById
 */

 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class GetDataitemsByIdAPI extends API {
   constructor(instanceIds, pageNo, countPerPage, datasetType,searchKeys, timeout = 2000) {
     super("POST", timeout, false);
     this.type = constants.GET_DATAITEMS_BY_ID;
     this.instanceIds = instanceIds;
     this.datasetType = datasetType;
     this.searchKeys = searchKeys;
     const queryString = `?${pageNo ? "&page="+pageNo : ""}${countPerPage ?"&records="+countPerPage : ""}`
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}dataitems/get_data_items/${queryString}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.dataitems = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
    return {
      instance_ids: this.instanceIds,
      dataset_type: this.datasetType,
      search_keys:this.searchKeys,
    }
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
     return this.dataitems
   }
 }
 