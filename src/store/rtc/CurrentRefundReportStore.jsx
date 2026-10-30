import { create } from "zustand";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";
import { toast } from "react-toastify";

const formatDateOnly = (dateStr) => {
  if (!dateStr) return "";
  return String(dateStr).split("T")[0];
};

const REFUND_STATUS_LABELS = {
  "-1": "ALL",
  0: "Not Initiated",
  1: "Initiated",
  2: "Refunded",
  3: "Failed",
};

const TRANSACTION_STATUS_LABELS = {
  0: "PENDING",
  1: "CONFIRMED",
  2: "USED",
  3: "EXPIRED",
  4: "CANCELLED",
  5: "FAILED",
};

const getRefundStatusLabel = (status) => {
  if (status === null || status === undefined || status === "") return "N/A";
  const key = Number(status);
  return REFUND_STATUS_LABELS[key] ?? String(status);
};

const parseStatus = (value, fallback = -1) => {
  if (value === undefined || value === null || value === "") return fallback;
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

const buildPostBody = (payload = {}) => {
  const refundStatus = payload?.refundStatus ?? payload?.RefundStatus ?? -1;
  // Transaction Status: 0 PENDING … 5 FAILED (All / empty = -1)
  const transactionStatus = parseStatus(
    payload?.transactionStatus ?? payload?.TransactionStatus,
    -1
  );

  return {
    FromDate: formatDateOnly(payload?.fromDate),
    ToDate: formatDateOnly(payload?.toDate),
    MobileNo: payload?.mobileNumber || "",
    PNRNumber: payload?.pnrNumber || "",
    PaymentMode: "ALL",
    RefundStatus: Number(refundStatus),
    TransactionStatus: transactionStatus,
    PaymentStatus: -1,
  };
};

const mapInnerReportItem = (item, idx, summary, rawList) => {
  const transactionDate =
    item.TransactionDateandTime ||
    item.PaymentDateTime ||
    item.BookingDateTime ||
    item.PurchaseDate ||
    item.transactionDateandTime ||
    "";

  const refundStatusValue =
    item.p_RefundStatus ??
    item.RefundStatus ??
    item.refundStatus ??
    item.RefundStatusID ??
    "";

  return {
    ...item,
    pnrNumber: item.PNRNumber || item.pnrNumber || "",
    transactionDateandTime: transactionDate,
    orderID: item.OrderID || item.orderID || "",
    bookingID: item.BookingID || item.bookingID || 0,
    mobileNumber:
      item.MobileNumber || item.MobileNo || item.mobileNumber || "",
    departureLocation:
      item.DepartureLocation ||
      item.FromStageName ||
      item.departureLocation ||
      "",
    arrivalLocation:
      item.ArrivalLocation || item.ToStageName || item.arrivalLocation || "",
    amount: item.TotalAmount ?? item.amount ?? item.totalAmount ?? 0,
    noOfTickets:
      item.TicketQuantity ?? item.noOfTickets ?? item.ticketQuantity ?? 0,
    modeofPayment:
      item.PaymentMode || item.paymentMode || item.modeofPayment || "",
    transactionStatus:
      item.PaymentStatusName ||
      item.PaymentStatus ||
      item.transactionStatus ||
      "",
    refundAmount: item.RefundAmount ?? item.refundAmount ?? 0,
    refundDate:
      item.RefundDateTime ||
      item.RefundInitiatedDateTime ||
      item.refundDate ||
      "",
    refundStatus: getRefundStatusLabel(refundStatusValue),
    p_RefundStatus: refundStatusValue,
    totalCount: summary?.TotalCount ?? item.totalCount ?? rawList.length,
    sno: item.SNo || idx + 1,
  };
};

export const useCurrentRefundReportStore = create((set) => ({
  isFetchCurrentRefundTransactionsInnerReport: false,
  refundCurrentTransactionsInnerReport: [],

  fetchCurrentRefundTransactionsInnerReport: async (queryParams = {}) => {
    set({ isFetchCurrentRefundTransactionsInnerReport: true });
    try {
      const postBody = buildPostBody(queryParams);
      const response = await apiService.post(
        API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS
          .GET_CURRENT_REFUND_INNER_REPORT,
        postBody,
        { token: "AmxsG7zkJB" }
      );

      let reportData = [];
      if (response?.data?.Data) {
        try {
          const parsed =
            typeof response.data.Data === "string"
              ? JSON.parse(response.data.Data)
              : response.data.Data;
          const rawList = parsed?.Table || (Array.isArray(parsed) ? parsed : []);
          const summary = parsed?.Table1?.[0] || {};
          reportData = rawList.map((item, idx) =>
            mapInnerReportItem(item, idx, summary, rawList)
          );
        } catch (err) {
          console.error("Error parsing current refund report:", err);
          reportData = [];
        }
      } else if (Array.isArray(response?.data)) {
        reportData = response.data.map((item, idx) =>
          mapInnerReportItem(item, idx, {}, response.data)
        );
      } else if (Array.isArray(response?.data?.result)) {
        reportData = response.data.result.map((item, idx) =>
          mapInnerReportItem(item, idx, {}, response.data.result)
        );
      }

      const transactionStatus =
        queryParams?.transactionStatus ?? queryParams?.TransactionStatus ?? "";
      if (
        transactionStatus !== "" &&
        transactionStatus !== null &&
        transactionStatus !== undefined &&
        String(transactionStatus) !== "-1"
      ) {
        const selectedNum = Number(transactionStatus);
        const selectedLabel = (
          TRANSACTION_STATUS_LABELS[selectedNum] || String(transactionStatus)
        ).toUpperCase();
        reportData = reportData.filter((item) => {
          const raw =
            item.BookingStatus ??
            item.TransactionStatus ??
            item.PaymentStatus ??
            item.transactionStatus ??
            "";
          const rawNum = Number(raw);
          if (!Number.isNaN(rawNum) && rawNum === selectedNum) return true;
          const status = String(
            item.transactionStatus ||
              item.PaymentStatusName ||
              item.BookingStatusName ||
              raw ||
              ""
          )
            .trim()
            .toUpperCase();
          return status === selectedLabel || status === String(selectedNum);
        });
      }

      set({ refundCurrentTransactionsInnerReport: reportData });
      return { response: reportData };
    } catch (error) {
      toast.error(error.message);
      set({ error: error.message, refundCurrentTransactionsInnerReport: [] });
    } finally {
      set({ isFetchCurrentRefundTransactionsInnerReport: false });
    }
  },
}));
