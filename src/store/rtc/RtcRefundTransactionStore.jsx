import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const useRtcRefundStore = create((set) => ({
    allBusPassUserReports: [],
    isBusPassUserReportsLoading: false,

    isFetchBusPassRefundTransactionsReport: false,
    refundBusPassTransactionsReport: [],
    // Pagination state for refund transactions report
    refundTransactionsPagination: {
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10
    },

    isFetchBusPassRefundTransactions: false,
    BusPassRefundTransactions: [],

    isInitiateRefund: false,

    fetchBusPassRefundTransactions: async (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();

        set({ isFetchBusPassRefundTransactions: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.BusPass.REPORTS.GET_REFUND_TRANSACTION_DASHBOARD}?${queryString}`
            );
            set({
                BusPassRefundTransactions: response.data,
            });
            return { response: response.data };
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isFetchBusPassRefundTransactions: false,
            });
        }
    },
    fetchBusPassRefundTransactionsReport: async (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        set({ isFetchBusPassRefundTransactionsReport: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.BusPass.REPORTS.GET_REFUND_TRANSACTION_REPORT}?${queryString}`
            );
            
            // Extract records and pagination data from the response
            const { records, totalCount, pageNumber, pageSize } = response.data;
            
            set({
                refundBusPassTransactionsReport: records || [],
                refundTransactionsPagination: {
                    totalCount: totalCount || 0,
                    pageNumber: pageNumber || 1,
                    pageSize: pageSize || 10
                }
            });
            return { response: response.data };
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isFetchBusPassRefundTransactionsReport: false,
            });
        }
    },
    fetchBusPassInitiateRefundOrderId: async (orderID) => {
        set({ isInitiateRefund: true });
        try {
            const url = `${API_ENDPOINTS.BusPass.REPORTS.GET_INITIATE_REFUND}`;
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
