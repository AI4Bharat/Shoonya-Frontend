/**
 * GetTasksByProjectId
 */

 import API from "../../../api";
 import ENDPOINTS from "../../../../config/apiendpoint";
 import constants from "../../../constants";
 
 export default class GetTasksByProjectIdAPI extends API {
   constructor(projectId, pageNo, countPerPage, selectedFilters, taskType, pullvalue,rejected,pull, timeout = 2000) {
     // console.log(pullvalue,"pullvaluepullvalue")
     super("GET", timeout, false);
     const datavalue = []
     this.type = constants.GET_TASK_LIST;
     let queryString = `?project_id=${projectId}${pageNo ? "&page="+pageNo : ""}${countPerPage ?"&records="+countPerPage : ""}`;
     let querystr = pull === "All" ?"": `&editable=${pullvalue}`
     let querystr1 = rejected === true ?`&rejected=`+"True":""
     for (let key in selectedFilters) {
      if (selectedFilters[key] && selectedFilters[key] !== -1) {
     switch (key) {
            case 'annotation_status':
          queryString +=`&${key}=["${selectedFilters[key]}"] ${querystr}${querystr1}`
              break;
              case 'review_status':
              queryString +=`&${key}=["${selectedFilters[key]}"] ${querystr} ${querystr1}`
                  break;
              case 'supercheck_status':
                   queryString +=`&${key}=["${selectedFilters[key]}"]`
                       break;
              default:
              queryString +=`&${key}=${selectedFilters[key]}`
             
          }
      }
      console.log(queryString);
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getTasks+queryString}`;
   }
 }
 
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.taskList = res;
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
     return this.taskList
   }
 }
 