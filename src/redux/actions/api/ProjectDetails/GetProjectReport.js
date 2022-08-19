/**
 * Login API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
export default class GetProjectReportAPI extends API {
   constructor(projectId, startDate, endDate,reports_type, timeout = 2000) {
     super("POST", timeout, false);
     this.startDate = startDate;
     this.endDate = endDate;
     this. reports_type= reports_type;
     this.type = constants.GET_PROJECT_REPORT;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/get_analytics/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.projectReport = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
    return {
      from_date: this.startDate,
      to_date: this.endDate,
      reports_type:this. reports_type,
    };
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
     return this.projectReport;
   }
 }
 