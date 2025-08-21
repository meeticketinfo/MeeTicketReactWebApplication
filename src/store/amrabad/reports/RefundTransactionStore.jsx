import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export const useAmrabadRefundStore = create((set) => ({
    allAmrabadUserReports: [],
    isAmrabadUserReportsLoading: false,

    isFetchAmrabadRefundTransactionsReport: false,
    refundAmrabadTransactionsReport: [],

    isInitiateRefund: false,


    fetchAmrabadUserReports: async (payload) => {
        set({ isAmrabadUserReportsLoading: true });
        try {
            const url = `${API_ENDPOINTS.AMRABAD.REPORTS.GET_USER_REPORT}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
            const method = "get";
            const response = await apiService[method](url);
            set({
                allAmrabadUserReports: response.data,
                isAmrabadUserReportsLoading: false,
            });
        } catch (error) {
            set({
                error: error.message,
                isAmrabadUserReportsLoading: false,
            });
        }
    },
    fetchAmrabadRefundTransactionsReport: async (payload) => {
        set({ isFetchAmrabadRefundTransactionsReport: true });
        try {
            const url = `${API_ENDPOINTS.AMRABAD.REPORTS.GET_USER_DETAILED_REPORT}?fromDate=${payload.fromDate}&toDate=${payload.toDate}&mobileNumber=${payload.mobileNumber}&packageId=${payload.packageId}&houseId=${payload.houseId}&pageNumber=${payload.pageNumber}&pageSize=${payload.pageSize}`;
            const method = "get";
            const response = await apiService[method](url);
            set({
                refundAmrabadTransactionsReport: response.data,
                isFetchAmrabadRefundTransactionsReport: false,
            });
        } catch (error) {
            set({
                error: error.message,
                isFetchAmrabadRefundTransactionsReport: false,
            });
        }
    },
    fetchAmrabadInitiateRefundOrderId: async (orderID) => {
        set({ isInitiateRefund: true });
        try {
            const url = `${API_ENDPOINTS.FAILED_TRANSACTIONS.INITIATE_REFUND}`;
            const method = "post";
            const response = await apiService[method](url, { orderId: orderID });

            set({
                InitiateRefundByOrderIdData: response.data,
            });
            return { response: response };
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isInitiateRefund: false,
            });
        }
    },
}));
