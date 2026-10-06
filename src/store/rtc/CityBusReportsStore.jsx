import { create } from "zustand";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";
import { formatDateOnly, naToEmpty } from "../../utils/Helper";

const CITY_BUS_CONSOLIDATED_REPORT = API_ENDPOINTS.REPORTS.RTC_REPORTS.CITY_BUS_REPORTS.GET_CITY_BUS_CONSOLIDATED_REPORT;
const CITY_BUS_REFUND_TRANSACTION_REPORT =
  API_ENDPOINTS.REPORTS.RTC_REPORTS.CITY_BUS_REPORTS.GET_CITY_BUS_REFUND_TRANSACTION_REPORT;
const CITY_STOPS =
  API_ENDPOINTS.REPORTS.RTC_REPORTS.CITY_BUS_REPORTS.GET_CITY_STOPS;

const REFUND_STATUS_LABELS = {
  "-1": "ALL",
  0: "Not Initiated",
  1: "Initiated",
  2: "Refunded",
  3: "Failed",
};

const getRefundStatusLabel = (status) => {
  if (status === null || status === undefined || status === "") return "N/A";
  const key = Number(status);
  return REFUND_STATUS_LABELS[key] ?? String(status);
};

const buildCityRefundReportBody = (payload = {}) => {
  const refundStatus = payload?.refundStatus ?? payload?.RefundStatus ?? -1;
  const paymentMode = payload?.paymentMode ?? payload?.PaymentMode ?? "";
  const paymentStatusRaw = payload?.paymentStatus ?? payload?.PaymentStatus;
  const mobileNo =
    payload?.mobileNumber ||
    payload?.mobileNo ||
    payload?.MobileNo ||
    payload?.phoneNumber ||
    "";
  const pnrNumber = payload?.PNRNumber || payload?.pnrNumber || "";

  const params = {
    FromDate: formatDateOnly(payload?.fromDate || payload?.FromDate),
    ToDate: formatDateOnly(payload?.toDate || payload?.ToDate),
    PaymentMode: paymentMode || "ALL",
    RefundStatus: Number(refundStatus),
  };

  if (
    paymentStatusRaw !== undefined &&
    paymentStatusRaw !== null &&
    paymentStatusRaw !== ""
  ) {
    const paymentStatus = Number(paymentStatusRaw);
    if (!Number.isNaN(paymentStatus)) {
      params.PaymentStatus = paymentStatus;
    }
  }

  if (mobileNo) {
    params.MobileNo = mobileNo;
  }
  if (pnrNumber) {
    params.PNRNumber = pnrNumber;
  }

  return params;
};

const mapCityBusRefundTransactionItem = (item, idx, summary = {}, totalCount = 0) => {
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
    sno: item.SNo || idx + 1,
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
    totalCount: summary?.TotalCount ?? item.totalCount ?? totalCount,
  };
};

const resolveDateType = (payload = {}) => {
  if (payload?.dateType) return payload.dateType;
  if (
    payload?.purchaseOrBooking === "Booking" ||
    payload?.purchaseOrBooking === "JOURNEY"
  ) {
    return "JOURNEY";
  }
  return "BOOKING";
};

const buildCityBookingReportParams = (payload = {}, reportType) => {
  const params = {
    ReportType: payload?.reportType || reportType,
    DateType: resolveDateType(payload),
    FromDate: formatDateOnly(
      payload?.fromDate || payload?.startDate || payload?.FromDate
    ),
    ToDate: formatDateOnly(
      payload?.toDate || payload?.endDate || payload?.ToDate
    ),
    ServiceTypeID:
      Number(payload?.serviceTypeID || payload?.typeOfBus || payload?.busType || 0) ||
      0,
    PassengerTypeID: Number(payload?.passengerTypeID || 0) || 0,
  };

  const paymentMode = payload?.paymentMode || "";
  const bookingStatusRaw = payload?.bookingStatus;
  const paymentStatusRaw = payload?.paymentStatus ?? payload?.PaymentStatus;
  const fromStageID =
    Number(
      payload?.fromStageBoardingID ||
        payload?.departureLocation ||
        payload?.destinationLocation ||
        0
    ) || 0;
  const toStageID =
    Number(payload?.toStageBoardingID || payload?.arrivalLocation || 0) || 0;
  const orderID = payload?.orderId || payload?.OrderID || "";
  const mobileNo =
    payload?.mobileNumber ||
    payload?.mobileNo ||
    payload?.MobileNo ||
    payload?.phoneNumber ||
    "";
  const pnrNumber = payload?.PNRNumber || payload?.pnrNumber || "";
  const transactionID = payload?.transactionId || payload?.TransactionID || "";

  if (paymentMode) params.PaymentMode = paymentMode;
  if (
    bookingStatusRaw !== undefined &&
    bookingStatusRaw !== null &&
    bookingStatusRaw !== ""
  ) {
    const bookingStatus = Number(bookingStatusRaw);
    if (!Number.isNaN(bookingStatus)) {
      params.BookingStatus = bookingStatus;
    }
  }
  if (
    paymentStatusRaw !== undefined &&
    paymentStatusRaw !== null &&
    paymentStatusRaw !== ""
  ) {
    const paymentStatus = Number(paymentStatusRaw);
    if (!Number.isNaN(paymentStatus)) {
      params.PaymentStatus = paymentStatus;
    }
  }
  if (fromStageID) params.FromStageID = fromStageID;
  if (toStageID) params.ToStageID = toStageID;
  if (orderID) params.OrderID = orderID;
  if (mobileNo) params.MobileNo = mobileNo;
  if (pnrNumber) params.PNRNumber = pnrNumber;
  if (transactionID) params.TransactionID = transactionID;

  return params;
};

const extractRawList = (response) => {
  if (Array.isArray(response?.data)) {
    return { rawList: response.data, summary: {} };
  }

  if (Array.isArray(response?.data?.result)) {
    return { rawList: response.data.result, summary: {} };
  }

  if (response?.data?.Data != null) {
    const parsed =
      typeof response.data.Data === "string"
        ? JSON.parse(response.data.Data)
        : response.data.Data;

    if (Array.isArray(parsed)) {
      return { rawList: parsed, summary: {} };
    }

    return {
      rawList: parsed?.Table || [],
      summary: parsed?.Table1?.[0] || {},
    };
  }

  return { rawList: [], summary: {} };
};

const mapCityBusReportItem = (item, idx, summary = {}, totalCount = 0) => ({
  SNo: item.SNo ?? idx + 1,
  BookingID: item.BookingID ?? "",
  PNRNumber: item.PNRNumber || "",
  ReturnPNRNo: naToEmpty(item.ReturnPNRNo),
  DepartureLocation: item.DepartureLocation || "",
  ArrivalLocation: item.ArrivalLocation || "",
  MobileNumber: item.MobileNumber || "",
  BusType: item.BusType || "",
  SeatLayoutType: naToEmpty(item.SeatLayoutType),
  PassengerType: item.PassengerType || "",
  TravelType: item.TravelType || "",
  MID: naToEmpty(item.MID),
  PurchaseDate: item.PurchaseDate || "",
  TravelDate: item.TravelDate || "",
  ReturnJourneyTravelDate: naToEmpty(item.ReturnJourneyTravelDate),
  AdultCount: item.AdultCount ?? 0,
  ChildCount: item.ChildCount ?? 0,
  TicketQuantity: item.TicketQuantity ?? 0,
  BasicFare: item.BasicFare ?? 0,
  TotalLevies: item.TotalLevies ?? 0,
  TotalTollFare: item.TotalTollFare ?? 0,
  TotalGreenCess: item.TotalGreenCess ?? 0,
  TotalPassengerFee: item.TotalPassengerFee ?? 0,
  TotalSafetyFee: item.TotalSafetyFee ?? 0,
  TotalGSTAmount: item.TotalGSTAmount ?? 0,
  TotalOtherCharges: item.TotalOtherCharges ?? 0,
  TotalRoundOffAmount: item.TotalRoundOffAmount ?? 0,
  TotalAmount: item.TotalAmount ?? 0,
  OrderID: naToEmpty(item.OrderID),
  PaymentMode: item.PaymentMode || "",
  PGPaymentID: naToEmpty(item.PGPaymentID),
  TransactionID: item.TransactionID || "",
  PaymentDateTime: item.PaymentDateTime || "",
  BookingStatus: item.BookingStatus,
  BookingStatusName: item.BookingStatusName || "",
  PaymentStatus: item.PaymentStatus,
  PaymentStatusName: item.PaymentStatusName || "",
  TotalCharges: item.TotalCharges ?? 0,
  // aliases used by filters / totals / ticket link
  sno: item.SNo ?? idx + 1,
  bookingID: item.BookingID ?? "",
  pnrNumber: item.PNRNumber || "",
  returnPNRNumber: naToEmpty(item.ReturnPNRNo),
  departureLocation: item.DepartureLocation || "",
  arrivalLocation: item.ArrivalLocation || "",
  mobileNumber: item.MobileNumber || "",
  busType: item.BusType || "",
  seatLayoutType: naToEmpty(item.SeatLayoutType),
  passengerType: item.PassengerType || "",
  travelType: item.TravelType || "",
  mid: naToEmpty(item.MID),
  bookingDate: item.PurchaseDate || "",
  purchaseDate: item.TravelDate || item.PurchaseDate || "",
  travelDate: item.TravelDate || "",
  returnJourneyTravelDate: naToEmpty(item.ReturnJourneyTravelDate),
  ticketQuantity: item.TicketQuantity ?? 0,
  basicFare: item.BasicFare ?? 0,
  totalLeviesFee: item.TotalLevies ?? 0,
  totalTollFare: item.TotalTollFare ?? 0,
  serviceTaxGST: item.TotalGSTAmount ?? 0,
  totalAmount: item.TotalAmount ?? 0,
  amount: item.TotalAmount ?? 0,
  orderId: naToEmpty(item.OrderID),
  paymentMode: item.PaymentMode || "",
  modeOfPayment: item.PaymentMode || "",
  paymentStatus: item.PaymentStatusName || "",
  bookingStatus: item.BookingStatusName || item.BookingStatus || "",
  phoneNumber: item.MobileNumber || "",
  isReturnType: item.TravelType || "",
  gender: item.Gender || "",
  concessionType: item.ConcessionType || item.PassengerType || "",
  ticketID: item.TicketID || item.BookingID || "",
  returnJourneyTicketID: item.ReturnJourneyTicketID || "",
  returnDate: naToEmpty(item.ReturnJourneyTravelDate),
  passengerFee: item.TotalPassengerFee ?? 0,
  waterBottle: item.WaterBottle ?? item.waterBottle ?? "",
  safetyCess: item.TotalSafetyFee ?? item.safetyCess ?? "",
  srt: item.SRT ?? item.srt ?? "",
  serviceFee: item.TotalCharges ?? 0,
  serviceTax_GST: item.TotalGSTAmount ?? 0,
  flexiFare: item.FlexiFare ?? item.flexiFare ?? 0,
  eachTicketAmount: item.EachTicketAmount ?? item.eachTicketAmount ?? 0,
  paymentGatewayTransactionId: item.TransactionID || item.PGPaymentID || "",
  grandTotalAmount: summary.GrandTotalAmount ?? 0,
  totalCount: summary.TotalCount ?? totalCount,
});

const mapCityBusPaymentTransactionItem = (item, idx, summary = {}, totalCount = 0) => {
  const purchaseDateVal =
    item.PurchaseDate ||
    item.PaymentDateTime ||
    item.BookingDateTime ||
    item.purchaseDate ||
    item.bookingDate ||
    "";
  const travelDateVal = item.TravelDate || item.travelDate || "";
  const returnTravelDateVal =
    item.ReturnJourneyTravelDate ||
    item.returnJourneyTravelDate ||
    item.returnDate ||
    "";

  return {
    ...item,
    sno: item.SNo ?? idx + 1,
    bookingID: item.BookingID || item.bookingID || 0,
    bookingId: item.BookingID || item.bookingId || 0,
    orderID: item.OrderID || item.orderID || "",
    orderId: item.OrderID || item.orderId || "",
    pnrNumber: item.PNRNumber || item.pnrNumber || "",
    returnPNRNumber:
      item.ReturnPNRNo || item.ReturnPNRNumber || item.returnPNRNumber || "",
    returnPNRNo:
      item.ReturnPNRNo || item.ReturnPNRNumber || item.returnPNRNumber || "",
    MobileNumber:
      item.MobileNumber ||
      item.MobileNo ||
      item.mobileNo ||
      item.mobileNumber ||
      item.phoneNumber ||
      "",
    phoneNumber:
      item.MobileNumber ||
      item.MobileNo ||
      item.mobileNo ||
      item.mobileNumber ||
      item.phoneNumber ||
      "",
    mobileNumber:
      item.MobileNumber ||
      item.MobileNo ||
      item.mobileNo ||
      item.mobileNumber ||
      item.phoneNumber ||
      "",
    TicketQuantity: item.TicketQuantity ?? item.ticketQuantity ?? 0,
    ticketQuantity: item.TicketQuantity ?? item.ticketQuantity ?? 0,
    amount: item.TotalAmount ?? item.amount ?? item.totalAmount ?? 0,
    totalAmount: item.TotalAmount ?? item.totalAmount ?? item.amount ?? 0,
    purchaseDate: travelDateVal || purchaseDateVal,
    travelDate: travelDateVal,
    bookingDate: purchaseDateVal,
    paymentStatus:
      item.PaymentStatusName ||
      item.PaymentStatus ||
      item.paymentStatus ||
      "",
    actualPaymentStatus:
      item.BookingStatusName ||
      item.BookingStatus ||
      item.actualPaymentStatus ||
      "",
    refundDate:
      item.RefundDateTime ||
      item.RefundInitiatedDateTime ||
      item.refundDate ||
      "",
    PGRefundID: item.PGRefundID || item.refundId || "",
    RefundStatusName:
      item.RefundStatusName || item.RefundStatus || item.refundStatus || "",
    grandTotalAmount: summary.GrandTotalAmount ?? item.grandTotalAmount ?? 0,
    totalCount: summary.TotalCount ?? totalCount,
    canBeRefundInitiate: item.CanBeRefundInitiate ?? item.canBeRefundInitiate,
    verifyStatus: item.VerifyStatus ?? item.verifyStatus,
    generateTicket: item.GenerateTicket ?? item.generateTicket,
    bookingDetailsId: item.BookingDetailsID ?? item.bookingDetailsId,
    tentativebookingId: item.TentativeBookingID ?? item.tentativebookingId,
  };
};

const fetchCityBookingReport = async (
  payload,
  reportType,
  mapItem = mapCityBusReportItem
) => {
  const queryParams = buildCityBookingReportParams(payload, reportType);
  const response = await apiService.get(CITY_BUS_CONSOLIDATED_REPORT, queryParams, {
    token: "AmxsG7zkJB",
    Accept: "application/json",
  });

  const { rawList, summary } = extractRawList(response);
  return rawList.map((item, idx) =>
    mapItem(item, idx, summary, rawList.length)
  );
};

export const useCityBusReportsStore = create((set) => ({
  // ----------------- City Stops (Departure / Arrival) -----------------
  cityDepartureStages: [],
  cityArrivalStages: [],
  isFetchCityStops: false,
  fetchCityStops: async () => {
    set({ isFetchCityStops: true });
    try {
      const response = await apiService.get(
        CITY_STOPS,
        {},
        { token: "AmxsG7zkJB", Accept: "application/json" }
      );

      let stopsList = [];
      if (response?.data?.Data != null) {
        const parsed =
          typeof response.data.Data === "string"
            ? JSON.parse(response.data.Data)
            : response.data.Data;
        stopsList = Array.isArray(parsed)
          ? parsed
          : parsed?.Table || parsed?.table || [];
      } else if (Array.isArray(response?.data)) {
        stopsList = response.data;
      } else if (Array.isArray(response?.data?.result)) {
        stopsList = response.data.result;
      }

      const uniqueStops = new Map();
      stopsList.forEach((item) => {
        const stopId = item.StopID ?? item.stopID;
        const stopName = item.StopName ?? item.stopName;
        if (stopId == null || !stopName) return;
        if (!uniqueStops.has(stopId)) {
          uniqueStops.set(stopId, { StopID: stopId, StopName: stopName });
        }
      });

      const sortedStops = Array.from(uniqueStops.values()).sort((a, b) =>
        (a.StopName || "").localeCompare(b.StopName || "")
      );

      // Shape matches CurrentBookingDepartureField / CurrentBookingArrivalField
      const cityDepartureStages = sortedStops.map((stop) => ({
        FromStageID: stop.StopID,
        FromStageName: stop.StopName,
        FromStageBoardingID: stop.StopID,
      }));
      const cityArrivalStages = sortedStops.map((stop) => ({
        ToStageID: stop.StopID,
        ToStageName: stop.StopName,
        ToStageBoardingID: stop.StopID,
      }));

      set({ cityDepartureStages, cityArrivalStages });
      return { cityDepartureStages, cityArrivalStages };
    } catch (error) {
      console.error("Error fetching city stops:", error);
      set({ cityDepartureStages: [], cityArrivalStages: [] });
    } finally {
      set({ isFetchCityStops: false });
    }
  },

  // ----------------- Consolidated Report -----------------
  CityBusConsolidateData: [],
  isFetchCityBusConsolidateData: false,
  fetchCityBusConsolidateData: async (payload = {}) => {
    set({ isFetchCityBusConsolidateData: true });
    try {
      const reportData = await fetchCityBookingReport(payload, "CONSOLIDATED");
      set({ CityBusConsolidateData: reportData });
      return { response: reportData };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        CityBusConsolidateData: [],
      });
    } finally {
      set({ isFetchCityBusConsolidateData: false });
    }
  },

  // ----------------- Individual Report -----------------
  CityBusIndividualData: [],
  isFetchCityBusIndividualData: false,
  fetchCityBusIndividualData: async (payload = {}) => {
    set({ isFetchCityBusIndividualData: true });
    try {
      const reportData = await fetchCityBookingReport(
        { ...payload, reportType: "INDIVIDUAL" },
        "INDIVIDUAL"
      );
      set({ CityBusIndividualData: reportData });
      return { response: reportData };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        CityBusIndividualData: [],
      });
    } finally {
      set({ isFetchCityBusIndividualData: false });
    }
  },

  // ----------------- Payment Transactions Report -----------------
  CityBusPaymentTransactionsData: [],
  isFetchCityBusPaymentTransactionsData: false,
  fetchCityBusPaymentTransactionsData: async (payload = {}) => {
    set({ isFetchCityBusPaymentTransactionsData: true });
    try {
      const reportData = await fetchCityBookingReport(
        { ...payload, reportType: "TRANSACTION" },
        "TRANSACTION",
        mapCityBusPaymentTransactionItem
      );
      set({ CityBusPaymentTransactionsData: reportData });
      return { response: reportData };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        CityBusPaymentTransactionsData: [],
      });
    } finally {
      set({ isFetchCityBusPaymentTransactionsData: false });
    }
  },

  // ----------------- Refund Transactions Report -----------------
  CityBusRefundTransactionsData: [],
  isFetchCityBusRefundTransactionsData: false,
  fetchCityBusRefundTransactionsData: async (payload = {}) => {
    set({ isFetchCityBusRefundTransactionsData: true });
    try {
      const queryParams = buildCityRefundReportBody(payload);
      const response = await apiService.get(
        CITY_BUS_REFUND_TRANSACTION_REPORT,
        queryParams,
        {
          token: "AmxsG7zkJB",
          Accept: "application/json",
        }
      );

      const { rawList, summary } = extractRawList(response);
      const reportData = rawList.map((item, idx) =>
        mapCityBusRefundTransactionItem(item, idx, summary, rawList.length)
      );
      set({ CityBusRefundTransactionsData: reportData });
      return { response: reportData };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        CityBusRefundTransactionsData: [],
      });
    } finally {
      set({ isFetchCityBusRefundTransactionsData: false });
    }
  },
}));
