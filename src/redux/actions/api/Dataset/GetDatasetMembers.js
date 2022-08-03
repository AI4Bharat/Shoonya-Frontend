/**
 * Get Dataset Members API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class GetDatasetProjects extends API {
     constructor(datasetId, timeout = 2000) {
         super("GET", timeout, false);
         this.type = constants.GET_DATASET_MEMBERS;
         this.endpoint = `${super.apiEndPointAuto()}${
             ENDPOINTS.getDatasets
         }instances/${datasetId}/users/`;
     }
 
     processResponse(res) {
         super.processResponse(res);
         if (res) {
             this.datasetMembers = res;
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
                 Authorization: `JWT ${localStorage.getItem(
                     "shoonya_access_token"
                 )}`,
             },
         };
         return this.headers;
     }
 
     getPayload() {
         return this.datasetMembers;
     }
 }
 