import { create } from "zustand";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import apiService from "../../../../services/apiService";
import { toast } from "react-toastify";

export const PosUserCreationStore = create((set) => ({
  posUserEditDetails: {},
  setCurrentPosUserEditDetails: (posUserEditDetails) => {
    set({
      posUserEditDetails,
    });
  },
  GetPosUsers: [],
  isSavePosUserDetailsLoading: false,
  // Fetch all Bookings
  fetchAllPosUsers: async (payload) => {
    set({ isFetchAllPosUsersLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.POS_USER.GET_POS_USERS}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&pageSize=${payload.PageSize}&pageNumber=${payload.pageNumber}`
      );
      set({
        allPosUsers: response.data,
        isFetchAllPosUsersLoading: false,
      });
    } catch (error) {
      console.log("error", error.response.data);
      set({ isFetchAllPosUsersLoading: false, allPosUsers: [] });
      toast.error(error.response.data);
    }
  },

  AddedUser: [],
  isSavePosUserDetailsLoading: false,
  savePosUser: async (PosUserData, isUpdate = false) => {
    set({ isSavePosUserDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.POS_USER.UPDATE_POS_USER
        : API_ENDPOINTS.MASTERS.POS_USER.ADD_NEW_POS_USER;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, PosUserData);

      set({
        AddedUser: response.data,
        isSavePosUserDetailsLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      toast.error(error.response.data);
      set({ isSavePosUserDetailsLoading: false });
      throw error;
    }
  },
}));
