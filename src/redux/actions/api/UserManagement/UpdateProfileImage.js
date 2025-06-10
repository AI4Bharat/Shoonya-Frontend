/**
 * Update ProfileImage API
 */
import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";
import constants from "../../../constants";

export default class UpdateProfileImageAPI extends API {
  constructor(userId,pickedFile, timeout = 2000) {
    super("POST", timeout, false);
    this.pickedFile = pickedFile;
    this.type = constants.UPDATE_PROFILE_IMAGE;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getUsers}account/${userId}/edit_user_profile_image/`;
  }

  processResponse(res) {
    super.processResponse(res);
    if (res) {
      this.updateProfileImage = res;
    }
  }

  apiEndPoint() {
    return this.endpoint;
  }

  getBody() {
    const formData=new FormData()
    formData.append('image',this.pickedFile)
    return formData
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
    return this.updateProfileImage;
  }
}
