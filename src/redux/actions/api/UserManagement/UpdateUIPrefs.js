
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class UpdateUIPrefsAPI extends API {
    constructor(preferUI, timeout = 2000) {
        super("POST", timeout, false);
        this.preferUI = preferUI;
        this.type = constants.UPDATE_UI_PREFS;
        this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.fetch}update_ui_prefs/`;
    }

    processResponse(res) {
        super.processResponse(res);
    }

    apiEndPoint() {
        return this.endpoint;
    }

    getBody() {
        return {
            prefer_cl_ui: this.preferUI,
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
        return this.updateUIPrefs;
    }
}
