import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";


export const useWalkerpassStore = create((set) => ({
    isAddWalkerPassLoading: false,
    addWalkerPassResponse: null,

    passLocationData: null,
    isPassLocationLoading: false,

    error: null,

    // Add Walker Pass
    addWalkerPass: async (formData) => {
        set({
            isAddWalkerPassLoading: true,
            error: null,
        });

        try {
            const response = await apiService.uploadMultipart(
                "post",
                API_ENDPOINTS.WALKERS_PASS_BOOKING.ADD_WALKERS_PASS,
                formData
            );

            set({
                addWalkerPassResponse: response.data,
                isAddWalkerPassLoading: false,
            });

            return response.data;
        } catch (error) {
            set({
                error: error.response?.data || error.message,
                isAddWalkerPassLoading: false,
            });

            throw error;
        }
    },

    // Get Pass Location Masters
    getPassLocationMasters: async (parkId) => {
        try {
            set({
                isPassLocationLoading: true,
                error: null,
            });

            const url =
                `${API_ENDPOINTS.WALKERS_PASS_BOOKING.GET_PASS_LOCATION_MASTERS}?parkId=${parkId}`;

            console.log("REQUEST URL:", url);

            const response = await apiService.get(url);

            console.log("API RESPONSE:", response);

            set({
                passLocationData: response.data,
                isPassLocationLoading: false,
            });

            return response.data;
        } catch (error) {
            console.log("STATUS:", error.response?.status);
            console.log("DATA:", error.response?.data);
            console.log("MESSAGE:", error.message);

            set({
                error: error.response?.data || error.message,
                isPassLocationLoading: false,
            });

            throw error;
        }
    },

    // INITIATE PAYMENT
    initiatePayment: async (payload) => {
        try {
            const response = await apiService.post(
                API_ENDPOINTS.WALKERS_PASS_BOOKING.INITIATE_PAYMENT,
                payload
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    //ORDER STATUSCALL
    checkOrderStatus: async (orderId) => {
        try {
            const response = await apiService.post(
                `${API_ENDPOINTS.WALKERS_PASS_BOOKING.ORDER_STATUS_CALL}/${orderId}`
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // VIEW PASS
    viewPass: async (passUserDetailsId) => {
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.WALKERS_PASS_BOOKING.VIEW_PASS}/${passUserDetailsId}`
            );

            return response.data;
        } catch (error) {
            throw error;
        }
    },
}));