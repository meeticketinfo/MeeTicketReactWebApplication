import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const useIntercitySettlementStore = create((set) => ({
    allIntercitySettlementTransactions: [],
    isIntercitySettlementTransactionsLoading: false,

    fetchIntercitySettlementTransactions: async (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();

        set({ isIntercitySettlementTransactionsLoading: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_SETTLEMENT_TRANSACTIONS.GET_INTERCITY_SETTLEMENT_TRANSACTIONS}?${queryString}`
            );
            set({
                allIntercitySettlementTransactions: response.data,
            });
            return { response: response.data };
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isIntercitySettlementTransactionsLoading: false,
            });
        }
    },



}));
