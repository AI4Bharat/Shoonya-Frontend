/**
 * Automate Datasets API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class aiModel extends API {
   constructor(srcInstanceId,translationmodel,org_id,checked,srcDatasetType, timeout = 2000) {
     super("POST", timeout, false);
    //  this.type = constants.AUTOMATE_DATASETS;
     this.input_dataset_instance_id = srcInstanceId;
     this.api_type = translationmodel;
     this.org = org_id;
     this.automate_missing_data_items= checked;
    const queryString  = srcDatasetType === "OCRDocument" ? "schedule_ocr_prediction_json_population" :  "schedule_asr_prediction_json_population";
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.functions}${queryString}`;
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
     return {
        dataset_instance_id: this.input_dataset_instance_id,
        api_type: this.api_type,
        organization_id: this.org,
        automate_missing_data_items:this.automate_missing_data_items
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
     return this.res;
   }
 }
 