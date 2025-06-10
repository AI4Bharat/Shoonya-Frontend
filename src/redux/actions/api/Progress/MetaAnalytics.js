import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import C from "../../../constants";
 
 export default class MetaAnalyticsDataAPI extends API {
   constructor(OrgId,project_type_filter,progressObj, timeout = 2000) {
     super("GET", timeout, false);
     this.progressObj = progressObj;
     this.type = C.FETCH_META_ANALYTICS_DATA;
     project_type_filter=='AllTypes'?
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}public/${OrgId}/cumulative_tasks_count/?metainfo=true`
     : 
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}public/${OrgId}/cumulative_tasks_count/?metainfo=true&project_type_filter=${project_type_filter}`
   }
  
   processResponse(res) {
     super.processResponse(res);
     if (res) {
       this.fetchMetaAnalyticsData = res;
     }
   }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
     return this.progressObj;
   }
 
   getHeaders() {
    this.headers = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `JWT ${localStorage.getItem('shoonya_access_token')}`
      },
    };
    return this.headers;
  }

 
   getPayload() {
     return this.fetchMetaAnalyticsData;
   }
 }