
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class CreateScheduledMailsAPI extends API {
  constructor(userId, reportLevelId, reportLevel, projectType, schedule, scheduleDay, timeout = 2000) {
    super("POST", timeout, false);
    this.type = constants.CREATE_SCHEDULED_MAILS;
    this.reportLevelId = reportLevelId;
    this.reportLevel = reportLevel;
    this.projectType = projectType;
    this.schedule = schedule;
    this.scheduleDay = scheduleDay;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}${userId}/schedule_mail/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.createScheduledMails = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    return {
      id: this.reportLevelId,
      report_level: this.reportLevel,
      project_type: this.projectType,
      schedule: this.schedule,
      schedule_day: this.scheduleDay
    }
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
    return this.createScheduledMails;
  }
}
