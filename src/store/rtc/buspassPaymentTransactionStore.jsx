import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";

export const useBuspassPaymentTransactionStore = create((set) => ({
    allBusPassPaymentTransactions: [],
    isBusPassPaymentTransactionsLoading: false,

    fetchBusPassPaymentTransactions: async (queryParams) => {
        const queryString = new URLSearchParams(queryParams).toString();

        set({ isBusPassPaymentTransactionsLoading: true });
        try {
            const response = await apiService.get(
                `${API_ENDPOINTS.REPORTS.RTC_REPORTS.BUS_PASS_PAYMENT_TRANSACTION.GET_BUS_PASS_PAYMENT_TRANSACTION}?${queryString}`
            );
            set({
                allBusPassPaymentTransactions: response.data,
            });
            return { response: response.data };
        } catch (error) {
            set({
                error: error.message,
            });
        } finally {
            set({
                isBusPassPaymentTransactionsLoading: false,
            });
        }
    },



}));
