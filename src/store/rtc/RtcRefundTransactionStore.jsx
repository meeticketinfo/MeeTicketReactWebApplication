import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const useRtcRefundStore = create((set) => ({
    allBusPassUserReports: [],
    isBusPassUserReportsLoading: false,

    isFetchBusPassRefundTransactionsReport: false,
    refundBusPassTransactionsReport: [],

    isFetchBusPassRefundTransactionsInnerReport: false,
    refundBusPassTransactionsInnerReport: [],

    // Pagination state for refund transactions report
    refundTransactionsPagination: {
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10
    },

    isFetchBusPassRefundTransactions: false,
    BusPassRefundTransactions: [],

    isInitiateRefund: false,
    InitiateRefundByOrderIdData:[],

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
                `${API_ENDPOINTS.REPORTS.RTC_REPORTS.REFUND_TRANSACTIONS_REPORT.GET_REFUND_TRANSACTIONS_REPORT}?${queryString}`
            );
            set({
                refundBusPassTransactionsReport: response.data || [],
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


    fetchBusPassRefundTransactionsInnerReport: async (queryParams) => { 
        const queryString = new URLSearchParams(queryParams).toString();
        set({ isFetchBusPassRefundTransactionsInnerReport: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.REPORTS.RTC_REPORTS.REFUND_TRANSACTIONS_REPORT.GET_REFUND_TRANSACTIONS_INNER_REPORT}?${queryString}`
            );
            set({
                refundBusPassTransactionsInnerReport: response.data.records || [],
                refundTransactionsPagination: {
                    totalCount: response.data.totalCount || 0,
                    pageNumber: response.data.pageNumber || 1,
                    pageSize: response.data.pageSize || 10
                }
            });
            return { response: response.data };
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isFetchBusPassRefundTransactionsInnerReport: false,
            });
        }
    },      



    fetchBusPassInitiateRefundOrderId: async (orderID) => {
        set({ isInitiateRefund: true });
        try {
            const url = `${API_ENDPOINTS.REPORTS.RTC_REPORTS.REFUND_TRANSACTIONS_REPORT.GET_INITIATE_REFUND_BY_ORDER_ID}/${orderID}`;
            const method = "post";
            const response = await apiService[method](url);

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
