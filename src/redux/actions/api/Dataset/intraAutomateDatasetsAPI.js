/**
 * Automate Datasets API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from '../../../constants';
 
 export default class intraAutomateDatasetsAPI extends API {
   constructor(srcInstanceId,org_id,field, timeout = 2000) {
     super("POST", timeout, false);
    //  this.type = constants.AUTOMATE_DATASETS;
     this.input_dataset_instance_id = srcInstanceId;
     this.org = org_id;
     this.field = field.map((element,index)=>{
       return element
     });
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.functions}schedule_draft_data_json_population`;
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
      fields_list: this.field.toString().trim(),
      organization_id: this.org
      
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
 