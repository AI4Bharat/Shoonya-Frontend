

import API from "../../api";
import ENDPOINTS from "../../../config/apiendpoint";
import constants from "../../constants";
 
export default class GetNextProjectAPI extends API {
   constructor(projectID,userObj,timeout = 2000) {
     super("POST", timeout, false);
     this.userObj = userObj;
     this.type = constants.NEXT_PROJECT;
    let labellingMode = localStorage.getItem("labellingMode");
    let searchFilters = JSON.parse(localStorage.getItem("searchFilters"));
    let requestUrl = `${projectID}/next/`;
   
    for (let key in searchFilters) {
      if (searchFilters[key] && localStorage.getItem("labelAll")) {
        requestUrl += `?${key}=${searchFilters[key]}`;
      }
    }
     this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${requestUrl}`;
   }  
  
   processResponse(res) {
     super.processResponse(res);
     if (res) {
         this.getNextProject = res;
     }
 }
 
   apiEndPoint() {
     return this.endpoint;
   }

   getBody() {
    return this.userObj;
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
     return this.getNextProject;
   }
 }
 