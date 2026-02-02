import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

const GET_LOGIN_DASHBOARD = "/DashBoard/GetAppDashboard"

export const LoginDashboardStore = create((set) => ({
    // Fetch Login Dashboard Data
    LoginDashboardData: [],
    isLoginDashboardDataLoading: false,
    fetchLoginDashboardData: async () => {
        set({ isLoginDashboardDataLoading: true });
        try {
            const response = await apiService.get( `${GET_LOGIN_DASHBOARD}`);
            set({
                LoginDashboardData: response.data,
                isLoginDashboardDataLoading: false,
            });
        } catch (error) {
            set({ error: error.message, isLoginDashboardDataLoading: false });
        }
    },

    // Update Android and Ios count
    AndroidIosCountData: [],
    isAndroidIosCountLoading: false,
    UpdateAndroidIosCount: async (AndriodIosData) => {
        set({ isAndroidIosCountLoading: true });
        try {
          const url = API_ENDPOINTS.MASTERS.ANDROID_IOS.UPDATE_ANDROID_IOS_COUNT;
          const method = "post" ;
    
          const response = await apiService[method](url, AndriodIosData);
    
          set({
            AndroidIosCountData: response.data,
            isAndroidIosCountLoading: false,           
          });
    
          return { success: true, data: response };
        } catch (error) {
          set({  isAndroidIosCountLoading: false });
          throw error;
        }
      },

}));
