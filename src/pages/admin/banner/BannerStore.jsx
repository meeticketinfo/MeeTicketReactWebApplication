import { create } from "zustand";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";
import { toast } from "react-toastify";


export const useBannerStore = create((set) => ({

  BannerEditDetails: {},
  setCurrentBannerEditDetails: (BannerEditDetails) => {
    set({
      BannerEditDetails,
    });
  },

  allBanners: [],
  isFetchAllBannersLoading: false,
  // Fetch all Bookings
  fetchAllBanners: async (payload) => {
    set({ isFetchAllBannersLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.BANNER.GET_BANNERS}?pageSize=${payload.PageSize}&pageNumber=${payload.pageNumber}`
      );
      // console.log("response",response)
      set({
        allBanners: response.data,
        isFetchAllBannersLoading: false,
      });
    } catch (error) {
      console.log("error", error.response?.data);
      set({ isFetchAllBannersLoading: false, allBanners: [] });
      toast.error(error.response?.data);
    }
  },
  // Save Banner details
  BannerDetails: [],
  isBannerDetailsLoading: false,
  saveBannersDetails: async (BannerData, isUpdate = false) => {
    set({ isBannerDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.BANNER.UPDATE_BANNER
        : API_ENDPOINTS.MASTERS.BANNER.ADD_NEW_BANNER;

      // Prepare form data
      let response;
      if (isUpdate) {
        response = await apiService.uploadFileWithPut(
          url,
          BannerData.file,
          BannerData
        );
      } else {
        response = await apiService.uploadFile(
          url,
          BannerData.file,
          BannerData
        );
      }
      set({
        BannerDetails: response.data,
        isBannerDetailsLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      set({ isBannerDetailsLoading: false });
      throw error;
    }
  },
  // Delete Banner
  DeleteBannerDetailsLoading: false,
  DeleteBannerDetails: async (BannerData) => {
    set({ DeleteBannerDetailsLoading: true });
    try {
      const url = API_ENDPOINTS.MASTERS.BANNER.DELETE_BANNER;

      const response = await apiService.delete(
        `${url}/${BannerData}`
      );
      set({
        DeleteBannerDetailsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({DeleteBannerDetailsLoading: false,});
      throw error;
    }
  },
}));
