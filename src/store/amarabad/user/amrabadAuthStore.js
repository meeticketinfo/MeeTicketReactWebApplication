import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/apiErrorHandler";

export const amrabadAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      AmrabadLoginData: null,
      AmrabadLoginLoading: false,
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      AmrabadLogin: async (loginData) => {
        console.log("loginData", loginData);
        set({ AmrabadLoginLoading: true });
        try {
          const response = await apiService.post(
            API_ENDPOINTS.AUTH.AMRABAD.AMRABAD_LOGIN,
            loginData
          );
          set({
            AmrabadLoginData: response.data,
            AmrabadLoginLoading: false,
          });

          return { success: true, data: response };
        } catch (xhr) {
         handleApiError(xhr);
          set({
            AmrabadLoginLoading: false,
          });

          return { success: false };
        }
      },
    }),
    {
      name: "amrabadlogin-store",
      partialize: (state) => ({
        AmrabadLoginData: state.AmrabadLoginData,
      }),
    }
  )
);
