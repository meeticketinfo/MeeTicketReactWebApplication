import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const WalkersPassStore = create((set) => ({
  walkersPassEditDetails: {},
  setCurrentWalkersPassEditDetails: (walkersPassEditDetails) => {
    set({
      walkersPassEditDetails,
    });
  },
      
  isWalkersPassEdit: false,
  setIsWalkersPassEdit: (isWalkersPassEdit) => {
    set({
      isWalkersPassEdit,
    });
  },

  isWalkersPassAdd: false,
  setIsWalkersPassAdd: (isWalkersPassAdd) => {
    set({
      isWalkersPassAdd,
    });
  },

  AddWalkersPassData: [],
  isSaveWalkersPassDetailsLoading: false,
  saveWalkersPass: async (WalkersPassData, isUpdate = false) => {
    console.log(isUpdate)
    set({ isSaveWalkersPassDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.WALKERS_PASS.UPDATE_WALKERS_PASS
        : API_ENDPOINTS.MASTERS.WALKERS_PASS.ADD_NEW_WALKERS_PASS;
      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, WalkersPassData);

      set({
        AddWalkersPassData: response.data,
        isSaveWalkersPassDetailsLoading: false,
      });

      return { success: true, data: response };
    } catch (error) {
    //   toast.error(error.response.data);
      set({ isSaveWalkersPassDetailsLoading: false });
      throw error;
    }
  },
}));
