import { create } from "zustand";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";
import { formatDateOnly, naToEmpty } from "../../utils/Helper";

const CITY_BUS_CONSOLIDATED_REPORT = API_ENDPOINTS.REPORTS.RTC_REPORTS.CITY_BUS_REPORTS.GET_CITY_BUS_CONSOLIDATED_REPORT;

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

const buildCityBookingReportParams = (payload = {}, reportType) => ({
  ReportType: payload?.reportType || reportType,
  DateType: resolveDateType(payload),
  FromDate: formatDateOnly( payload?.fromDate || payload?.startDate || payload?.FromDate ),
  ToDate: formatDateOnly( payload?.toDate || payload?.endDate || payload?.ToDate),
  ServiceTypeID:Number(payload?.serviceTypeID || payload?.typeOfBus || payload?.busType || 0) ||0,
  PassengerTypeID: Number(payload?.passengerTypeID || 0) || 0,
  PaymentMode: payload?.paymentMode || "",
  BookingStatus: Number(payload?.bookingStatus ?? payload?.paymentStatus ?? -1),
  FromStageID: Number( payload?.fromStageBoardingID || payload?.departureLocation || payload?.destinationLocation || 0 ) || 0,
  ToStageID: Number(payload?.toStageBoardingID || payload?.arrivalLocation || 0) || 0,
  OrderID: payload?.orderId || payload?.OrderID || "",
  MobileNo:payload?.mobileNumber || payload?.mobileNo || payload?.MobileNo || payload?.phoneNumber || "",
  PNRNumber: payload?.PNRNumber || payload?.pnrNumber || "",
  TransactionID: payload?.transactionId || payload?.TransactionID || "",
});

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

const fetchCityBookingReport = async (payload, reportType) => {
  const queryParams = buildCityBookingReportParams(payload, reportType);
  const response = await apiService.get(CITY_BUS_CONSOLIDATED_REPORT, queryParams, {
    token: "AmxsG7zkJB",
    Accept: "application/json",
  });

  const { rawList, summary } = extractRawList(response);
  return rawList.map((item, idx) =>
    mapCityBusReportItem(item, idx, summary, rawList.length)
  );
};

export const useCityBusReportsStore = create((set) => ({
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
}));
