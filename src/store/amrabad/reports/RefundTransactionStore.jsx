import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export const useAmrabadRefundStore = create((set) => ({
    allAmrabadUserReports: [],
    isAmrabadUserReportsLoading: false,

    isFetchAmrabadRefundTransactionsReport: false,
    refundAmrabadTransactionsReport: [],
    // Pagination state for refund transactions report
    refundTransactionsPagination: {
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10
    },

    isFetchAmrabadRefundTransactions: false,
    amrabadRefundTransactions: [],

    isInitiateRefund: false,

    fetchAmrabadRefundTransactions: async (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();

        set({ isFetchAmrabadRefundTransactions: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.AMRABAD.REPORTS.GET_REFUND_TRANSACTION_DASHBOARD}?${queryString}`
            );
            set({
                amrabadRefundTransactions: response.data,
            });
            return { response: response.data };
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isFetchAmrabadRefundTransactions: false,
            });
        }
    },
    fetchAmrabadRefundTransactionsReport: async (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        set({ isFetchAmrabadRefundTransactionsReport: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.AMRABAD.REPORTS.GET_REFUND_TRANSACTION_REPORT}?${queryString}`
            );
            
            // Extract records and pagination data from the response
            const { records, totalCount, pageNumber, pageSize } = response.data;
            
            set({
                refundAmrabadTransactionsReport: records || [],
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
                isFetchAmrabadRefundTransactionsReport: false,
            });
        }
    },
    fetchAmrabadInitiateRefundOrderId: async (orderID) => {
        set({ isInitiateRefund: true });
        try {
            const url = `${API_ENDPOINTS.AMRABAD.REPORTS.GET_INITIATE_REFUND}`;
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
