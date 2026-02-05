import { create } from "zustand";
import { loadCaptchaEnginge, validateCaptcha } from "react-simple-captcha";
import apiService from "../services/apiService";

const GET_CAPTCHA = "/encrypted/captcha/create";

const useCaptchaStore = create((set) => ({
  captchaInput: "",
  captchaError: "",
  captchaLoaded: false,
  CaptchaData: null,

  loadCaptcha: () => {
    // loadCaptchaEnginge(6, "#a8b4c4", "rgb(107 114 128 / 1)", "upper");
    // set({ captchaLoaded: true, captchaError: "" });
  },

  updateCaptchaInput: (input) => set({ captchaInput: input }),

  validateCaptchaInput: () => {
    const isValid = validateCaptcha(useCaptchaStore.getState().captchaInput);
    if (isValid) {
      set({ captchaError: "" });
      return true;
    } else {
      set({ captchaError: "Invalid CAPTCHA, please try again." });
      return false;
    }
  },


  GetCaptcha: async () => {

    try {
      const response = await apiService.post(GET_CAPTCHA);
      set({});

      set({
        CaptchaData: response.data.data,
      });

      return { success: true };
    } catch (xhr) {

      return { success: false };
    }
  },

  resetCaptcha: () => {
    useCaptchaStore.getState().loadCaptcha();
    set({ captchaInput: "", captchaError: "" });
  },
}));

export default useCaptchaStore;
