import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { toast } from "react-toastify";

export const useCartStore = create((set) => ({
  cartItems: [],
  loadingCart: false,

  fetchCartItems: async () => {
    set({ loadingCart: true });
    try {
      const response = await apiService.get(API_ENDPOINTS.AMRABAD.USER.GET_CART_ITEMS);
      set({ loadingCart: false, cartItems: response.data.data });
    } catch (error) {
      set({ loadingCart: false });
      toast.error(error.message || "Some thing went wrong");
    }
  }
}));