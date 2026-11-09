import { create } from "zustand";
import { toast } from "react-toastify";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

// Keep selected calendar date as-is (avoid UTC shift from toISOString()).
const getDateOnly = (dateStr) => {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const toIsoStartOfDay = (dateStr) => {
  const dateOnly = getDateOnly(dateStr);
  return dateOnly ? `${dateOnly}T00:00:00.000Z` : "";
};

const toIsoEndOfDay = (dateStr) => {
  const dateOnly = getDateOnly(dateStr);
  return dateOnly ? `${dateOnly}T23:59:59.999Z` : "";
};

const extractParkBookingReportList = (response) => {
  const raw = response?.data;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.result)) return raw.result;
  if (Array.isArray(raw?.data?.result)) return raw.data.result;
  return [];
};

export const useNzpReportsStore = create((set) => ({
  dayWiseBookingData: [],
  isFetchDayWiseBookingData: false,

  fetchDayWiseBookingData: async (payload = {}) => {
    set({ isFetchDayWiseBookingData: true });
    try {
      const fromDate =
        payload.fromDate || payload.bookingFromDate || "";
      const toDate = payload.toDate || payload.bookingToDate || "";

      const requestBody = {
        reportType: "DAYWISE",
        fromDate: toIsoStartOfDay(fromDate),
        toDate: toIsoEndOfDay(toDate),
        mobileNumber: "",
      };

      const response = await apiService.post(
        API_ENDPOINTS.REPORTS.BOOKING_REPORTS.GET_PARK_BOOKING_REPORTS,
        requestBody
      );

      const reportData = extractParkBookingReportList(response);
      set({
        dayWiseBookingData: reportData,
        isFetchDayWiseBookingData: false,
      });
    } catch (error) {
      set({
        dayWiseBookingData: [],
        isFetchDayWiseBookingData: false,
      });
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    }
  },

  clearDayWiseBookingData: () => {
    set({ dayWiseBookingData: [] });
  },

  ticketBookingsTransactionData: [],
  isFetchTicketBookingsTransactionData: false,

  fetchTicketBookingsTransactionData: async (payload = {}) => {
    set({ isFetchTicketBookingsTransactionData: true });
    try {
      const fromDate =
        payload.fromDate || payload.bookingFromDate || "";
      const toDate = payload.toDate || payload.bookingToDate || "";
      const mobileNumber =
        payload.mobileNumber ?? payload.mobile ?? "";

      const requestBody = {
        reportType: "TICKET",
        fromDate: toIsoStartOfDay(fromDate),
        toDate: toIsoEndOfDay(toDate),
        mobileNumber: mobileNumber ? String(mobileNumber).trim() : "",
      };

      const response = await apiService.post(
        API_ENDPOINTS.REPORTS.BOOKING_REPORTS.GET_PARK_BOOKING_REPORTS,
        requestBody
      );

      const reportData = extractParkBookingReportList(response);
      set({
        ticketBookingsTransactionData: reportData,
        isFetchTicketBookingsTransactionData: false,
      });
    } catch (error) {
      set({
        ticketBookingsTransactionData: [],
        isFetchTicketBookingsTransactionData: false,
      });
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    }
  },

  clearTicketBookingsTransactionData: () => {
    set({ ticketBookingsTransactionData: [] });
  },

  deskWiseBookingData: [],
  isFetchDeskWiseBookingData: false,

  fetchDeskWiseBookingData: async (payload = {}) => {
    set({ isFetchDeskWiseBookingData: true });
    try {
      const fromDate =
        payload.fromDate || payload.bookingFromDate || "";
      const toDate = payload.toDate || payload.bookingToDate || "";

      const requestBody = {
        reportType: "DESKWISE_SUCCESS",
        fromDate: toIsoStartOfDay(fromDate),
        toDate: toIsoEndOfDay(toDate),
        mobileNumber: "",
      };

      const response = await apiService.post(
        API_ENDPOINTS.REPORTS.BOOKING_REPORTS.GET_PARK_BOOKING_REPORTS,
        requestBody
      );

      const reportData = extractParkBookingReportList(response);
      set({
        deskWiseBookingData: reportData,
        isFetchDeskWiseBookingData: false,
      });
    } catch (error) {
      set({
        deskWiseBookingData: [],
        isFetchDeskWiseBookingData: false,
      });
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again."
      );
    }
  },

  clearDeskWiseBookingData: () => {
    set({ deskWiseBookingData: [] });
  },
}));
