import { create } from "zustand";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import apiService from "../../../services/apiService";

export const useIntercityRefundReportStore = create((set) => ({
    allBusPassUserReports: [],
    isBusPassUserReportsLoading: false,

    isFetchIntercityRefundTransactionsReport: false,
    refundIntercityTransactionsReport: [],

    isFetchIntercityRefundTransactionsInnerReport: false,
    refundIntercityTransactionsInnerReport: [],

    // Pagination state for refund transactions report
    refundTransactionsPagination: {
        totalCount: 0,
        pageNumber: 1,
        pageSize: 10
    },

    isFetchBusPassRefundTransactions: false,
    BusPassRefundTransactions: [],

    isInitiateRefund: false,
    InitiateRefundByOrderIdData: [],

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



    fetchIntercityRefundTransactionsReport: async (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        set({ isFetchIntercityRefundTransactionsReport: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.INTERCITY.REPORTS.GET_REFUND_TRANSACTION_DASHBOARD}?${queryString}`
            );
            set({
                refundIntercityTransactionsReport: response.data || [],
            });
            return { response: response.data };
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isFetchIntercityRefundTransactionsReport: false,
            });
        }
    },


    fetchIntercityRefundTransactionsInnerReport: async (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();
        set({ isFetchIntercityRefundTransactionsInnerReport: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.INTERCITY.REPORTS.GET_REFUND_TRANSACTION_INNER_REPORT}?${queryString}`
            );
            set({
                refundIntercityTransactionsInnerReport: response.data || [],
            });
            return { response: response.data };
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isFetchIntercityRefundTransactionsInnerReport: false,
            });
        }
    },



    fetchIntercityInitiateRefundOrderId: async (orderID) => {
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
