// stores/amrabadAuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/apiErrorHandler";

export const amrabadAuthStore = create(
  persist(
    (set, get) => ({
      AmrabadRegisterLoading: false,
      isLoggedIn: false,
      isRegisterIn: false,
      AmrabadLoginLoading: false,
      token: null,
      tokenType: null, // ✅ add tokenType here
      decodedTokenData: null,
      isAuthenticated: false,

      setTokenType: (tokenType) => set({ tokenType }),

      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setIsRegisterIn: (isRegisterIn) => set({ isRegisterIn }),
      AmrabadLogin: async (loginData) => {
        localStorage.clear();
        set({ AmrabadLoginLoading: true });
        try {
          const response = await apiService.post(
            API_ENDPOINTS.AUTH.AMRABAD.AMRABAD_LOGIN,
            loginData
          );
      
          // ✅ Check HTTP status
          if (response.status === 200 && response.data?.token) {
            set({
              AmrabadLoginLoading: false,
              token: response.data.token,
              tokenType: "amrabad",
              isLoggedIn: true,
              isAuthenticated: true,
            });
      
            // ✅ Safely call fetchDecodedToken
            const fetchDecodedToken = get().fetchDecodedToken;
            if (typeof fetchDecodedToken === "function") {
              await fetchDecodedToken();
            } else {
              console.warn("fetchDecodedToken is not defined in the store.");
            }
      
            return { success: true, data: response };
          }
      
          // Optional: handle non-200s here
          set({ AmrabadLoginLoading: false });
          return { success: false, data: response };
        } catch (error) {
          handleApiError(error);
          set({ AmrabadLoginLoading: false });
          return { success: false };
        }
      },
      
      AmrabadRegister: async (registerData) => {
        set({ AmrabadRegisterLoading: true, isRegisterIn: true });
        try {
          const response = await apiService.post(
            API_ENDPOINTS.AUTH.AMRABAD.AMRABAD_REGISTER,
            registerData
          );
          set({ AmrabadRegisterLoading: false });
          return { success: true, data: response };
        } catch (error) {
          toast.error(error.response.data.message);
          set({ AmrabadRegisterLoading: false });
        }
      },

      fetchDecodedToken: async () => {
        try {
          const response = await apiService.get(
            API_ENDPOINTS.AUTH.AMRABAD.AMRABAD_DECODE_TOKEN
          );
          set({ decodedTokenData: response.data.data, error: null });
          return { success: true, data: response.data }; // ✅ Return data cleanly
        } catch (error) {
          set({ error: error.message });
          return { success: false, error: error.message }; // ✅ Return failure cleanly
        }
      },

      clearAmrabadSession: () =>
        set({
          token: null,
          tokenType: null,
          isLoggedIn: false,
          isAuthenticated: false,
          decodedTokenData: null,
        }),
    }),
    {
      name: "amrabadlogin-store",
    }
  )
);
