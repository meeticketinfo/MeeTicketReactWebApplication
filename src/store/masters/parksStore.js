import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

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
      set({ error: error.message, isFetchAllParksLoading: false });
    }
  },

  fetchCurrentEntityDetailsByParkId: async (parkId) => {
    set({ isFetchCurrentEntityDetailsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.PARK.GET_ENTITIES_PARK_ID}/${parkId}`
      );
      // Ensure correct setting of the bookingDetails state
      set({
        isFetchCurrentEntityDetailsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ error: error.message, isFetchCurrentEntityDetailsLoading: false });
      return { success: false };
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

      return { success: true, data: response };
    } catch (error) {
      set({ error: error.message, isSaveParkDetailsLoading: false });
      throw error;
    }
  },

  setCurrentParkEditDetails: (parkEditDetails) => {
    console.log("parkEditDetails", parkEditDetails);
    set({
      parkEditDetails,
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
}));
