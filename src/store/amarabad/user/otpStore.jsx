// stores/amrabadAuthStore.js
import { create } from "zustand";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/apiErrorHandler";

export const UseOtpStore = create((set, get) => ({
  isForgetOtpRequestLoading: false,

  isverifyForgetPinOtpLoading: false,

  getForgetPinOtpFromMobile: async (payload) => {
    set({ isForgetOtpRequestLoading: true });

    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.AMRABAD.GET_FORGET_PIN_OTP_FROM_MOBILE,
        payload
      );
      console.log(response.data);

      set({ isForgetOtpRequestLoading: false });

      return { success: true, data: response };
    } catch (error) {
      console.log(error?.message);
      set({ isForgetOtpRequestLoading: false });
      return { success: false };
    }
  },
  verifyForgetPinOtp: async (payload) => {
    set({ isverifyForgetPinOtpLoading: true });

    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.AMRABAD.VERIFY_FORGET_PIN_OTP_FROM_MOBILE,
        payload
      );
      console.log(response.data.mobileNumber);
      set({ isverifyForgetPinOtpLoading: false });

      return { success: true, data: response };
    } catch (error) {
      console.log(error?.message);
      set({ isForgetOtpRequestLoading: false });
      return { success: false };
    }
  },
}));
