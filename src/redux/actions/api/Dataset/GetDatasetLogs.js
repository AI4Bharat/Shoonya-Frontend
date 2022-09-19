/**
 * Dataset Logs API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class GetDatasetLogsAPI extends API {
   constructor(instanceId, taskName, timeout = 2000) {
     super("GET", timeout, false);
     this.type = constants.GET_DATASET_LOGS;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getDatasets}instances/${instanceId}/get_async_task_results/?task_name=${taskName}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.datasetLogs = res;
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
     return this.datasetLogs;
   }
 }
 