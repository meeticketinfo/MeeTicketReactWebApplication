import {create} from "zustand";
import { loadCaptchaEnginge, validateCaptcha } from "react-simple-captcha";

const useCaptchaStore = create((set) => ({
  captchaInput: "",
  captchaError: "",
  captchaLoaded: false,

  loadCaptcha: () => {
    loadCaptchaEnginge(6, "#0c3771", "#fff");
    set({ captchaLoaded: true, captchaError: "" });
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

  resetCaptcha: () => {
    useCaptchaStore.getState().loadCaptcha();
    set({ captchaInput: "", captchaError: "" });
  },
}));

export default useCaptchaStore;
