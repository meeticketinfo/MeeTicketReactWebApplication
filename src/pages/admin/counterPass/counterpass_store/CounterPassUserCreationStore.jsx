import { create } from "zustand";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import apiService from "../../../../services/apiService";
import { toast } from "react-toastify";

export const CounterPassUserCreationStore = create((set) => ({
  counterPassUserEditDetails: {},
  setCurrentCounterPassUserEditDetails: (counterPassUserEditDetails) => {
    set({
      counterPassUserEditDetails,
    });
  },
  GetCounterPassUsers: [],
  isFetchAllCounterPassUsersLoading: false,
  // Fetch all Bookings
  fetchAllCounterPassUsers: async (payload) => {
    set({ isFetchAllCounterPassUsersLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.COUNTER_PASS_USER.GET_COUNTER_PASS_USERS}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&pageSize=${payload.PageSize}&pageNumber=${payload.pageNumber}`
      );
      set({
        allCounterPassUsers: response.data,
        isFetchAllCounterPassUsersLoading: false,
      });
    } catch (error) {
      console.log("error", error.response?.data);
      set({ isFetchAllCounterPassUsersLoading: false, allCounterPassUsers: [] });
      toast.error(error.response?.data);
    }
  },

  AddedUser: [],
  isSaveCounterPassUserDetailsLoading: false,
  saveCounterPassUser: async (CounterPassUserData, isUpdate = false) => {
    set({ isSaveCounterPassUserDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.COUNTER_PASS_USER.UPDATE_COUNTER_PASS_USER
        : API_ENDPOINTS.MASTERS.COUNTER_PASS_USER.ADD_NEW_COUNTER_PASS_USER;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, CounterPassUserData);

      set({
        AddedUser: response.data,
        isSaveCounterPassUserDetailsLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
      toast.error(error.response.data);
      set({ isSaveCounterPassUserDetailsLoading: false });
      throw error;
    }
  },
}));

