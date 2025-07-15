// stores/amrabadAuthStore.js
import { create } from "zustand";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";
import { toast } from "react-toastify";
import { handleApiError } from "../../../utils/apiErrorHandler";

export const UseOtpStore = create((set, get) => ({
  isForgetOtpRequestLoading: false,

  isverifyForgetPinOtpLoading: false,
  isverifyRegisterOtpLoading: false,
  isResetPinLoading: false,
  getForgetPinOtpFromMobile: async (payload) => {
    set({ isForgetOtpRequestLoading: true });

    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.AMRABAD.GET_FORGET_PIN_OTP_FROM_MOBILE,
        payload
      );

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
      set({ isverifyForgetPinOtpLoading: false });

      return { success: true, data: response };
    } catch (error) {
      console.log(error?.message);
      set({ isForgetOtpRequestLoading: false });
      return { success: false };
    }
  },
  verifyRegisterOtp: async (payload) => {
    set({ isverifyRegisterOtpLoading: true });

    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.AMRABAD.AMRABAD_REGISTER_OTP,
        payload
      );
      set({ isverifyRegisterOtpLoading: false });

      return { success: true, data: response };
    } catch (error) {
      console.log(error?.message);
      set({ isverifyRegisterOtpLoading: false });
      return { success: false };
    }
  },
    verifyResendOtp: async (payload) => {
    set({ isverifyResendOtpLoading: true });

    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.AMRABAD.AMRABAD_RESEND_OTP,
        payload
      );
      set({ isverifyResendOtpLoading: false });

      return { success: true, data: response };
    } catch (error) {
      console.log(error?.message);
      set({ isverifyResendOtpLoading: false });
      return { success: false };
    }
  },
  // reset pin
  resetPin: async (payload) => {
    set({ isResetPinLoading: true });
 
    try {
      const response = await apiService.post(
        API_ENDPOINTS.AUTH.AMRABAD.RESET_PIN,
        payload
      );
      set({ isResetPinLoading: false });
      return { success: true, data: response };
    } catch (error) {
      console.log(error?.message);
      set({ isResetPinLoading: false });
      // return { success: false, data: error };
    }
  },
}));
