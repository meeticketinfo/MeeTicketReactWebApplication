import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export const IntercityMasterStore = create((set) => ({
  

    // Add Android and Ios count
    IntercityCititsData: [],
    isIntercityCititsLoading: false,
    AddIntercityCitits: async (Data) => {
        set({ isIntercityCititsLoading: true });
        try {
          const url = API_ENDPOINTS.MASTERS.INTERCITY.ADD_INTERCITY_CITIES;
          const method = "post" ;
    
          const response = await apiService[method](url, Data);
    
          set({
            IntercityCititsData: response.data,
            isIntercityCititsLoading: false,           
          });
    
          return { success: true, data: response };
        } catch (error) {
          set({  isIntercityCititsLoading: false });
          throw error;
        }
      },

}));
