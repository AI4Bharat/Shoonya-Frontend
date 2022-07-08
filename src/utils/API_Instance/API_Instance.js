// import { message } from "antd";
import axios from "axios";
// import {  apiData } from "./apiData";
import configs from "../../config/config"

const ACCESS_TOKEN = "shoonya_access_token";
const REFRESH_TOKEN = "shoonya_refresh_token";
const TOKEN_NOT_VALID = "token_not_valid";

const REFRESH_URL = "users/auth/jwt/refresh";
const VERIFY_URL = "users/auth/jwt/verify";

const axiosInstance = axios.create({
  baseURL: configs.BASE_URL_AUTO,
  timeout: 500000,
  headers: {
    Authorization: `JWT ${localStorage.getItem(ACCESS_TOKEN)}`,
    "Content-Type": "application/json",
    accept: "application/json",
  },
  validateStatus: (status) => {
    return true;
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Authorization"] = localStorage.getItem(ACCESS_TOKEN)
      ? `JWT ${localStorage.getItem(ACCESS_TOKEN)}`
      : null;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    console.log(error, 'was the error');
    const originalRequest = error.config;
    if (typeof error.response === "undefined") {
      alert("Unknown server error!");
      return Promise.reject(error);
    }

    if (
      error.response.status === 401 &&
      originalRequest.url === configs.BASE_URL + REFRESH_URL
    ) {
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (
      error.response.data.code === TOKEN_NOT_VALID &&
      error.response.status === 401 &&
      error.response.statusText === "Unauthorized"
    ) {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);

      if (refreshToken) {
        // const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));
        // const now = Math.ceil(Date.now() / 1000);

        const data = await axiosInstance.post(VERIFY_URL, {
          token: refreshToken,
        });

        if (data.status === 200) {
          return axiosInstance
            .post(REFRESH_URL, {
              refresh: refreshToken,
            })
            .then((response) => {
              localStorage.setItem(ACCESS_TOKEN, response.data.access);
              localStorage.setItem(REFRESH_TOKEN, response.data.refresh);

              axiosInstance.defaults.headers["Authorization"] =
                "JWT " + response.data.access;
              originalRequest.headers["Authorization"] =
                "JWT " + response.data.access;

              return axiosInstance(originalRequest);
            })
            .catch((err) => {
              // message.alert("Error refreshing token.");
              return err;
            });
        } else if (data.response.status !== 200) {
          localStorage.removeItem(ACCESS_TOKEN);
          localStorage.removeItem(REFRESH_TOKEN);
          window.location.pathname = "/login";
        } else {
          window.location.href = "/";
        }
      } else {
        // window.location.href = "/";
      }

      return Promise.reject(error);
    }
    if (error.response.status === 404) {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;