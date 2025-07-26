import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResult,
} from "axios";
import toast from "react-hot-toast";
import { ACCESS_TOKEN } from "../../constants/cookie";
import { getCookie } from "../../utils/cookie";
import { eventBus } from "../../utils/eventBus";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 60000,
  withCredentials: false,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    // Add random parameter to GET requests to prevent caching
    if (/GET/i.test(config.method || "")) {
      const t = Math.random().toString(36).slice(2, 9);
      config.params = { ...config.params, t };
    }
    // Append authorization token to headers
    const token = getCookie(ACCESS_TOKEN);
    config.headers = {
      Authorization: token ? `Bearer ${token}` : "",
      ...config.headers,
    };

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  async (response: AxiosResponse) => {
    // Clear any existing loading toasts
    toast.dismiss();

    // Handle binary stream data (file downloads, etc.)
    if (response.request.responseType === "blob") {
      return response;
    }

    // Handle response codes and errors uniformly
    const { status, message } = response.data as unknown as AxiosResult;

    if (status === "success") {
      return response.data;
    } else if (status === "error") {
      return Promise.reject(new Error(message));
    } else {
      toast.error(message || "An error occurred");
      return response.data;
    }
  },
  (error: AxiosError) => {
    // Clear any existing loading toasts
    toast.dismiss();

    // Log error details for debugging
    console.log("[Request Error] > ", error);

    // Handle specific HTTP status codes
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message =
            (error.response.data as any).message || "Bad Request (400)";
          break;
        case 401:
          error.message = "Unauthorized, please log in again (401)";
          toast.dismiss();
          eventBus.emit("sessionExpired");
          break;
        case 403:
          error.message = "Access Forbidden (403)";
          break;
        case 404:
          error.message = "Resource Not Found (404)";
          break;
        case 405:
          error.message = "Method Not Allowed (405)";
          break;
        case 408:
          error.message = "Request Timeout (408)";
          break;
        case 500:
          error.message = "Internal Server Error (500)";
          break;
        case 501:
          error.message = "Service Not Implemented (501)";
          break;
        case 502:
          error.message = "Bad Gateway (502)";
          break;
        case 503:
          error.message = "Service Unavailable (503)";
          break;
        case 504:
          error.message = "Gateway Timeout (504)";
          break;
        case 505:
          error.message = "HTTP Version Not Supported (505)";
          break;
        default:
          error.message = `Connection Error (${error.response.status})!`;
      }
    } else {
      error.message = "Network connection failed";
    }

    toast.error(error.message);
    return Promise.reject(error);
  }
);

const request = (options: AxiosRequestConfig): Promise<AxiosResult> => {
  return axiosInstance(options);
};

export default request;
