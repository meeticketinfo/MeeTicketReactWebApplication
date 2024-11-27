import axios from "axios";
import useAuthStore from "../store/authStore";

const API_BASE_URL = "https://meeticket.vmaxtechservices.life/parkapi/api/";
  // prod
// const API_BASE_URL =
  //  "https://meeticketservicedevapi.vmaxtechservices.life/api/";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token; // Get the token from Zustand store
    if (token) {
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
    formData.append("file", file);
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

// // GET example with params
// apiService.get(API_ENDPOINTS.MASTERS.PARK.GET_PARKS, { location: 'downtown' })
//   .then(response => console.log(response.data))
//   .catch(error => console.error(error));

// // POST example with body payload
// apiService.post(API_ENDPOINTS.MASTERS.PARK.CREATE_PARK, { name: 'Central Park', city: 'New York' })
//   .then(response => console.log(response.data))
//   .catch(error => console.error(error));

// // File upload example with additional data
// const file = document.querySelector('#fileInput').files[0];
// apiService.uploadFile(API_ENDPOINTS.MASTERS.PARK.CREATE_PARK, file, { parkId: 123 })
//   .then(response => console.log(response.data))
//   .catch(error => console.error(error));
