import { create } from "zustand";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import apiService from "../../../../services/apiService";

export const PosUserCreationStore = create((set) => ({
    GetPosUsers: [],
  isSavePosUserDetailsLoading: false,
  // Fetch all Bookings
    fetchAllPosUsers: async () => {
      set({ isFetchAllPosUsersLoading: true });
      try {

        const response = await apiService.get(
          `${API_ENDPOINTS.MASTERS.POS_USER.GET_POS_USERS}?pageSize=${10}&pageNumber=${1}`
        );
        set({
          allPosUsers: response.data,
          isFetchAllPosUsersLoading: false,
        });
      } catch (error) {
        set({ isFetchAllPosUsersLoading: false });
      }
    },

  allPosUsers: [],
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
        allPosUsers: response.data,
        isSavePosUserDetailsLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      set({ isSavePosUserDetailsLoading: false });
      throw error;
    }
  },
}));
