import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";
 
 export default class DeallocationAnnotatorsAndReviewersAPI extends API {
   constructor(projectId,radiobutton,annotatorsUser,reviewerssUser,annotationStatus,reviewStatus,superCheckUser,SuperCheckStatus,projectObj, timeout = 2000) {
    super("GET", timeout, false);
     this.projectObj = projectObj;
     const queryString = radiobutton === "annotation" ? `unassign_tasks/?annotator_id=${annotatorsUser}&annotation_status=["${annotationStatus}"]` : radiobutton === "review"? `unassign_review_tasks/?reviewer_id=${reviewerssUser}&review_status=["${reviewStatus}"]`:`unassign_supercheck_tasks/?superchecker_id=${superCheckUser}&supercheck_status=["${SuperCheckStatus}"]`;
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
 