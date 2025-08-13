import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { toast } from "react-toastify";

export const useCartStore = create((set) => ({
  cartItems: [],
  loadingCart: false,
  loadingAddToCart: false,
  loadingRemoveFromCart: false,
  loadingClearCart: false,

  fetchCartItems: async () => {
    set({ loadingCart: true });
    try {
      const response = await apiService.get(API_ENDPOINTS.AMRABAD.USER.GET_CART_ITEMS);
      set({ loadingCart: false, cartItems: response.data.data });
    } catch (error) {
      set({ loadingCart: false });
      toast.error(error.message || "Some thing went wrong");
    }
  },

  addToCart: async (data) => {
    set({ loadingAddToCart: true });
    try {
      const response = await apiService.post(API_ENDPOINTS.AMRABAD.USER.ADD_TO_CART, data);
      return response.data;
    } catch (error) {
      console.log(error, "error");
      return error;
    } finally {
      set({ loadingAddToCart: false });
    }
  },

  removeFromCart: async (cartItemId) => {
    set({ loadingRemoveFromCart: true });
    try {
      const response = await apiService.delete(API_ENDPOINTS.AMRABAD.USER.REMOVE_FROM_CART + "/" + cartItemId);
      return response.data;
    } catch (error) {
      console.log(error, "error");
      return error;
    }
    finally {
      set({ loadingRemoveFromCart: false });
    }
  },

  clearCart: async () => {
    set({ loadingClearCart: true });
    try {
      const response = await apiService.delete(API_ENDPOINTS.AMRABAD.USER.CLEAR_CART);
      return response.data;
    } catch (error) {
      console.log(error, "error");
      return error;
    } finally {
      set({ loadingClearCart: false });
    }
  },
}));