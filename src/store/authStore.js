import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiService from "../services/apiService"; // Replace with your API service setup

const LOGIN_API_ENDPOINT = "/Authentication/login";
const DECODED_TOKEN_ENDPOINT = "/Authentication/GetDecodedToken";

const useAuthStore = create(
  persist(
    (set) => ({
      isLoading: false,
      isAuthenticated: false,
      token: null,
      error: null,
      decodedTokenData: null, // New state to store decoded token data

      login: async (loginData) => {
        set({ isLoading: true });
        try {
          const response = await apiService.post(LOGIN_API_ENDPOINT, loginData);
          const token = response.data;

          set({ token, error: null, isLoading: false, isAuthenticated: true });

          // Fetch decoded token data upon successful login
          await useAuthStore.getState().fetchDecodedToken();

          return { success: true };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Fetch decoded token data from the API
      fetchDecodedToken: async () => {
        try {
          const response = await apiService.get(DECODED_TOKEN_ENDPOINT);
          set({ decodedTokenData: response.data, error: null });
        } catch (error) {
          set({ error: error.message });
        }
      },

      logout: () =>
        set({
          token: null,
          error: null,
          isAuthenticated: false,
          decodedTokenData: null,
        }),
    }),
    {
      name: "auth-store",
      getStorage: () => localStorage,
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        decodedTokenData: state.decodedTokenData, // Persist decoded token data if needed
      }),
    }
  )
);

export default useAuthStore;
