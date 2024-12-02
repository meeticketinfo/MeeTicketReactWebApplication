import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

const getFileTypeFromUrl = (url) => {
  const extension = url.split(".").pop().toLowerCase();
  const mimeTypes = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    pdf: "application/pdf",
    // Add more mime types as needed
  };
  return mimeTypes[extension] || "application/octet-stream"; // Default if not found
};

export const useParkStore = create((set) => ({
  allParks: [],
  ParkDetails: [],
  isSaveParkDetailsLoading: false,
  isFetchParkDetailsLoading: false,
  isFetchAllParksLoading: false,
  fetchParkDetailsError: null,
  parkEditDetails: {},
  error: null,
  success: null,
  fileInputs: {
    ImageUrl: null,
  },
  filePreviews: {
    ImageUrl: null,
  },
  addFilePreviews: {
    ImageUrl: null,
  },
  isFetchAllNodalOfficerParksLoading: false,
  allNodalOfficerParks: [],
  nodalOfficerParksError: null,

  serializeFilters: (filters) =>
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  // Fetch all parks
  fetchAllParks: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    set({ isFetchAllParksLoading: true });
    try {
      //   const filterString = useParkStore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.PARK.GET_PARKS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.PARK.GET_PARKS}`
      );
      console.log(response);

      set({
        allParks: response.data,
        isFetchAllParksLoading: false,
      });
    } catch (error) {
      set({ isFetchAllParksLoading: false });
    }
  },

  // Fetch all Nodal Officers
  fetchAllNodalOfficerParks: async (
    pageIndex = 1,
    pageSize = 10,
    filters = {},
    userId
  ) => {
    set({ isFetchAllNodalOfficerParksLoading: true });
    try {
      //   const filterString = useServicestore.getState().serializeFilters(filters);
      const response = await apiService.get(
        // `${API_ENDPOINTS.MASTERS.Service.GET_Services}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
        `${API_ENDPOINTS.MASTERS.NODAL_OFFICERS.GET_ENTITIES}?userId=${userId}`
      );

      set({
        allNodalOfficerParks: response.data,
        isFetchAllNodalOfficerParksLoading: false,
      });
    } catch (error) {
      set({
        nodalOfficerParksError: error.message,
        isFetchAllNodalOfficerParksLoading: false,
      });
    }
  },

  // Save park details
  saveParkDetails: async (ParkData, isUpdate = false) => {
    set({ isSaveParkDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.PARK.UPDATE_PARK_DETAILS
        : API_ENDPOINTS.MASTERS.PARK.ADD_NEW_PARK;

      // Prepare form data

      let response;
      if (isUpdate) {
        response = await apiService.uploadFileWithPut(
          url,
          ParkData.file,
          ParkData
        );
      } else {
        response = await apiService.uploadFile(url, ParkData.file, ParkData);
      }

      set({
        ParkDetails: response.data,
        isSaveParkDetailsLoading: false,
        success: "Park saved successfully.",
      });

      set((state) => ({
        filePreviews: {
          ...state.filePreviews,
          ImageUrl: { fileUrl: null, fileType: null },
        },
      }));

      return { success: true, data: response };
    } catch (error) {
      set({  isSaveParkDetailsLoading: false });
      throw error;
    }
  },

  setCurrentParkEditDetails: (parkEditDetails) => {
    console.log("parkEditDetails", parkEditDetails);
    set({
      parkEditDetails,
    });
  },

  resetFilePreview: () => {
    set({
      filePreviews: {},
    });
  },

  handleFileChange: (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type;

      // Set both file and preview
      set((state) => ({
        fileInputs: { ...state.fileInputs, [fieldName]: file },
        filePreviews: {
          ...state.filePreviews,
          [fieldName]: { file, fileType, fileUrl },
        },
      }));
    }
  },

  addHandleFileChange: (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      const fileType = file.type;

      // Set both file and preview
      set((state) => ({
        fileInputs: { ...state.fileInputs, [fieldName]: file },
        addFilePreviews: {
          ...state.addFilePreviews,
          [fieldName]: { file, fileType, fileUrl },
        },
      }));
    }
  },

  updateFilePreview: (ImageUrl) => {
    set((state) => ({
      filePreviews: {
        ...state.filePreviews,
        ImageUrl: ImageUrl
          ? {
              fileUrl: ImageUrl,
              fileType: getFileTypeFromUrl(ImageUrl),
            }
          : { fileUrl: null, fileType: null },
      },
    }));
  },
}));
