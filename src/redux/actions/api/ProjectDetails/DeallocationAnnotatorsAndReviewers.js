import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export class DeallocateTaskById extends API {
  constructor(projectId, taskId, selectedUser, timeout = 2000) {
    super("POST", timeout, false);
    this.projectId = projectId;

    this.payload = {
      task_ids: Array.isArray(taskId) ? taskId.map(id => parseInt(id)) : [parseInt(taskId)],
    };
    const baseEndpoint = `${super.apiEndPointAuto()}/${ENDPOINTS.getProjects}${projectId}/`;

    const endpointMap = {
      annotation: 'unassign_tasks/',
      review: `unassign_review_tasks/`,
      superChecker: 'unassign_supercheck_task/',
    };
    
    const selectedUserEndpoint = endpointMap[selectedUser];
    
    if (selectedUserEndpoint) {
      this.endpoint = baseEndpoint + selectedUserEndpoint;
    } else {
      console.error('Invalid selectedUser:', selectedUser);
    }
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.deallocateTaskById = res;
    }
  }
  apiEndPoint() {
    return this.endpoint;
  }
  getBody() {
    return this.payload;
  }
  getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: `JWT ${localStorage.getItem("shoonya_access_token")}`,
    };
  }
  getPayload() {
    return this.deallocateTaskById;
  }
}

export default class DeallocationAnnotatorsAndReviewersAPI extends API {
  constructor(projectId,radiobutton,annotatorsUser,reviewerssUser,annotationStatus,reviewStatus,superCheckUser,SuperCheckStatus,projectObj, timeout = 2000) {
   super("POST", timeout, false);
    this.projectObj = projectObj;
    const queryString = radiobutton === "annotation" ? `unassign_tasks/?annotator_id=${annotatorsUser}&annotation_status=["${annotationStatus}"]` : radiobutton === "review"? `unassign_review_tasks/?reviewer_id=${reviewerssUser}&review_status=["${reviewStatus}"]`:`unassign_supercheck_tasks/?superchecker_id=${superCheckUser}&supercheck_status=["${SuperCheckStatus}"]`;
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
