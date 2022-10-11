/**
 * Get Organization Project Reports API
 */
 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class GetOrganizationAnnotatorQualityAPI extends API {
   constructor(orgId, projectType, startDate, endDate, targetLanguage,sortByColumn, descOrder, timeout = 2000) {
     super("POST", timeout, false);
     this.projectType = projectType;
     this.startDate = startDate;
     this.endDate = endDate;
     this.targetLanguage = targetLanguage === "all" ? undefined : targetLanguage;
     this.sortByColumn = sortByColumn ?? undefined;
     this.descOrder = descOrder ?? undefined;
     this.type = constants.GET_ORGANIZATION_ANNOTATOR_QUALITY;
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getOrganizations}${orgId}/quality_reports/`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.orgAnnotatorQuality = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
 
   getBody() {
     return {
       project_type: this.projectType,
       from_date: this.startDate,
       to_date: this.endDate,
       tgt_language: this.targetLanguage,
       sort_by_column_name: this.sortByColumn,
       descending_order: this.descOrder,
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
     return this.orgAnnotatorQuality;
   }
 }
 