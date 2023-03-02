import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class DeallocationAnnotatorsAndReviewersAPI extends API {
   constructor(projectId,radiobutton,annotatorsUser,reviewerssUser,annotationStatus,reviewStatus,projectObj, timeout = 2000) {
     super("GET", timeout, false);
     this.projectObj = projectObj;
     const queryString = radiobutton === true ? `unassign_tasks/?annotator_id=${annotatorsUser}&annotation_status=["${annotationStatus}"]` : `unassign_review_tasks/?${reviewerssUser}&[${reviewStatus}]`;
     console.log(queryString,"queryStringqueryString")
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/${queryString}`;
   }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.deallocationAnnotatorsAndReviewers= res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }
   getBody() {
    return this.projectObj;
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
     return this.deallocationAnnotatorsAndReviewers 
   }
 }
 