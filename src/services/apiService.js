import axios from "axios";
// import { API_BASE_URL } from "../constants/apiEndpoints";

const API_BASE_URL =
  "https://meeticketservice-dev-dotnet.azurewebsites.net/api/";
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
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
};

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

export default apiService;
