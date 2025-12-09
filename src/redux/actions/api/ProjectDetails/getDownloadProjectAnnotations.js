import API from "../../../api";
import ENDPOINTS from "../../../../config/apiendpoint";

export default class getDownloadProjectAnnotationsAPI extends API {
  constructor(projectId, timeout = 2000) {
    super("GET", timeout, false);
    this.projectId = projectId;
    this.endpoint = `${super.apiEndPointAuto()}${ENDPOINTS.getProjects}${projectId}/export_project_tasks/`;
  }

  async downloadAnnotations() {
    try {
      const response = await fetch(this.endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.getItem("shoonya_access_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status}`);
      }

      const blob = await response.blob();

      // ✅ Extract filename from headers
      const contentDisposition = response.headers.get("Content-Disposition") || "";
      const projectType = response.headers.get("Project-Type") || "project";
      let filename = `project_${this.projectId}_${projectType}_annotations.csv`;

      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = `project_${this.projectId}_${match[1]}`;
      }

      // ✅ Trigger download
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log(`[✔] Downloaded as: ${filename}`);
    } catch (error) {
      console.error("❌ Error downloading annotations:", error);
    }
  }

  // Base API overrides (not used in this manual fetch setup)
  processResponse() {}
  apiEndPoint() {
    return this.endpoint;
  }
  getBody() {}
  getHeaders() {
    return {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("shoonya_access_token")}`,
      },
    };
  }
  getPayload() {
    return {};
  }
}
