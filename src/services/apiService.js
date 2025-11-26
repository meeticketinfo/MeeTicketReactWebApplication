import axios from "axios";
import useAuthStore from "../store/authStore";
import { amrabadAuthStore } from "../store/amarabad/user/amrabadAuthStore";
// dev

// const API_BASE_URL = "https://meeticketdevui.vmaxtechservices.help/parkapi/api/";

// uat
// const API_BASE_URL = "https://uat.meeticket.telangana.gov.in/parkuatapi/api/";

// prod
const API_BASE_URL =  "https://meeticket.telangana.gov.in/parkuatapi/api/"

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    const amrabadState = amrabadAuthStore.getState();
    if (amrabadState.tokenType === "amrabad" && amrabadState.token) {
      config.headers["Authorization"] = `Bearer ${amrabadState.token}`;
    } else if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }


    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optional: Handle specific error responses
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      // For example, you might want to logout the user or redirect to login
      useAuthStore.getState().logout(); // Logging out the user
      // Optionally, you could redirect to login or show a message
    }
    // if (error.response && error.response.status === 500) {
    //   toast.error("Internal Server Error")
    // }
    return Promise.reject(error);
  }
);

const apiService = {
  get: (url, params = {}, headers = {}) => api.get(url, { params, headers }),

  post: (url, body = {}, headers = {}) => api.post(url, body, { headers }),

  put: (url, body = {}, headers = {}) => api.put(url, body, { headers }),

  delete: (url, params = {}, headers = {}) =>
    api.delete(url, { params, headers }),

  uploadFile: (url, file, additionalData = {}, headers = {}) => {
    const formData = new FormData();
    formData.append("employeePhotoDoc", file);
    Object.keys(additionalData).forEach((key) =>
      formData.append(key, additionalData[key])
    ); 

    return api.post(url, formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadFileWithPut: (url, file, additionalData = {}, headers = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    Object.keys(additionalData).forEach((key) =>
      formData.append(key, additionalData[key])
    );
    return api.put(url, formData, {
      headers: {
        ...headers,
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default apiService;
