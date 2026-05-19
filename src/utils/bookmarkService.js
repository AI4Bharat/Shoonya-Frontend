import axios from "axios";
import config from "../config/config";

const getHeaders = () => ({
  headers: {
    "Content-Type": "application/json",
    Authorization: `JWT ${localStorage.getItem("shoonya_access_token")}`,
  },
});

export const getUserProjects = async () => {
  try {
    const response = await axios.get(
      `${config.BASE_URL_AUTO}/projects/user-projects/`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user projects:", error);
    throw error;
  }
};

export const bookmarkProject = async (projectId) => {
  try {
    const response = await axios.post(
      `${config.BASE_URL_AUTO}/projects/${projectId}/bookmark/`,
      {},
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error bookmarking project:", error);
    throw error;
  }
};

export const unbookmarkProject = async (projectId) => {
  try {
    const response = await axios.delete(
      `${config.BASE_URL_AUTO}/projects/${projectId}/unbookmark/`,
      getHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error unbookmarking project:", error);
    throw error;
  }
};
