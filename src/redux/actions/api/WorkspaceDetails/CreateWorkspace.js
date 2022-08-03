/**
 * API to add members to a project
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class CreateWorkspaceAPI extends API {
    constructor(orgId, workspaceName, timeout = 2000) {
        super("POST", timeout, false);
        this.type = constants.ADD_MEMBERS_TO_PROJECT;
        this.organization = orgId;
        this.workspace_name = workspaceName;
        this.is_archived = false;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getWorkspaces
            }`;
    }

    processResponse(res) {
        super.processResponse(res);
        if (res) {
            this.msg = res;
        }
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            organization: this.organization,
            workspace_name: this.workspace_name,
            is_archived: this.is_archived,
        };
    }

    getHeaders() {
        this.headers = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `JWT ${localStorage.getItem("shoonya_access_token")}`,
            },
        };
        return this.headers;
    }

    getPayload() {
        return this.msg;
    }
}
