import axios from "axios";
import i18n from "@/i18n";
import { ElNotification } from "element-plus";

let baseURL = "http://34.116.193.242:8080/api";
// let baseURL = "http://136.114.26.167:8080/api";


export const axiosInstance = axios.create({
  baseURL,
  timeout: 20000,
  
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: any) => {
    for (const key in config.params) {
      if (Object.prototype.hasOwnProperty.call(config.params, key)) {
        const element = config.params[key];
        if (!element && typeof element !== "boolean") delete config.params[key];
      }
    }
    
    const token = localStorage.getItem("token");
    if (config.url.includes("NO_TOKEN")) delete config.headers.Authorization;
    else if (token) config.headers.Authorization = `Bearer ${token}`;
    config.url = config.url.replace("/NO_TOKEN", "");

    return config;
  },

  (error) => {
    console.error("Request Interceptor Error:", error);
    return Promise.reject(error);
  }
);


axiosInstance.interceptors.response.use(
  (response) => {
    return response.data.response;
  },

  (error) => {
    const { t } = i18n.global;
    const url = error.config?.url || "";
    const errorMessage = error.response?.data?.errorDescription || "Xatolik yuz berdi";

    if (url.includes("logout")) {
      return Promise.reject(error);
    }

    ElNotification({
      type: "error",
      message: errorMessage,
      title: t('common.error'),
    });

    return Promise.reject(error);
  }
);
