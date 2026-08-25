import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import apiService from "../../../../../services/apiService";
export const useCurrentConsolidateStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // Current ticket view
  CurrentConsolidateData: [],
  isFetchCurrentConsolidateData: false,
  fetchCurrentConsolidateData: async (payload) => {
    set({ isFetchCurrentConsolidateData: true });
    try {
      let dateType = "BOOKING";
      if (payload?.dateType) {
        dateType = payload.dateType;
      } else if (payload?.purchaseOrBooking === "Booking" || payload?.purchaseOrBooking === "JOURNEY") {
        dateType = "JOURNEY";
      } else if (payload?.purchaseOrBooking === "Purchase" || payload?.purchaseOrBooking === "BOOKING") {
        dateType = "BOOKING";
      }

      const formatDateOnly = (dateStr) => {
        if (!dateStr) return "";
        return String(dateStr).split("T")[0];
      };

      const postBody = {
        ReportType: payload?.reportType || "CONSOLIDATED",
        DateType: dateType,
        FromDate: formatDateOnly(payload?.fromDate),
        ToDate: formatDateOnly(payload?.toDate),
        MobileNo: payload?.mobileNumber || payload?.mobileNo || "",
        ServiceTypeID: Number(payload?.serviceTypeID || payload?.typeOfBus || 0) || 0,
        PassengerTypeID: Number(payload?.passengerTypeID || 0) || 0,
        PaymentMode: payload?.paymentMode || "",
        OrderID: payload?.orderId || payload?.OrderID || "",
        TransactionID: payload?.transactionId || payload?.TransactionID || "",
        BookingStatus: Number(payload?.bookingStatus || -1) || -1,
        PNRNumber: payload?.PNRNumber || payload?.pnrNumber || "",
        FromStageID: Number(payload?.fromStageBoardingID || payload?.departureLocation || 0) || 0,
        ToStageID: Number(payload?.toStageBoardingID || payload?.arrivalLocation || 0) || 0,
      };

      const response = await apiService.post(
        API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS.GET_CURRENT_CONSOLIDATED_REPORT,
        postBody,
        {
          token: "AmxsG7zkJB",
        }
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

          reportData = rawList.map((item, idx) => {
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
              sno: item.SNo || idx + 1,
              orderID: item.OrderID || item.orderID || "",
              orderId: item.OrderID || item.orderId || "",
              pnrNumber: item.PNRNumber || item.pnrNumber || "",
              returnPNRNumber:
                item.ReturnPNRNo ||
                item.ReturnPNRNumber ||
                item.returnPNRNumber ||
                "",
              returnPNRNo:
                item.ReturnPNRNo ||
                item.ReturnPNRNumber ||
                item.returnPNRNumber ||
                "",
              departureLocation:
                item.DepartureLocation ||
                item.FromStageName ||
                item.departureLocation ||
                "",
              arrivalLocation:
                item.ArrivalLocation ||
                item.ToStageName ||
                item.arrivalLocation ||
                "",
              mobileNumber:
                item.MobileNumber ||
                item.MobileNo ||
                item.mobileNumber ||
                item.phoneNumber ||
                "",
              phoneNumber:
                item.MobileNumber ||
                item.MobileNo ||
                item.mobileNumber ||
                item.phoneNumber ||
                "",
              busType: item.BusType || item.BusTypeName || item.busType || "",
              seatLayoutType:
                item.SeatLayoutType || item.seatLayoutType || "",
              travelType:
                item.TravelType || item.travelType || item.isReturnType || "",
              isReturnType:
                item.TravelType || item.travelType || item.isReturnType || "",
              mid: item.MID || item.mid || "",
              bookingDate: purchaseDateVal,
              purchaseDate: travelDateVal || purchaseDateVal,
              travelDate: travelDateVal,
              returnDate: returnTravelDateVal,
              returnJourneyTravelDate: returnTravelDateVal,
              ticketQuantity: item.TicketQuantity ?? item.ticketQuantity ?? 0,
              amount: item.TotalAmount ?? item.amount ?? item.totalAmount ?? 0,
              totalAmount:
                item.TotalAmount ?? item.totalAmount ?? item.amount ?? 0,
              grandTotalAmount:
                summary.GrandTotalAmount ?? item.grandTotalAmount ?? 0,
              totalCount: summary.TotalCount ?? rawList.length,
              paymentMode:
                item.PaymentMode ||
                item.paymentMode ||
                item.modeOfPayment ||
                "",
              modeOfPayment:
                item.PaymentMode ||
                item.paymentMode ||
                item.modeOfPayment ||
                "",
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
              refundId: item.PGRefundID || item.refundId || "",
              refundStatus:
                item.RefundStatusName ||
                item.RefundStatus ||
                item.refundStatus ||
                "",
              basicFare: item.BasicFare ?? item.basicFare ?? 0,
              passengerFee: item.TotalPassengerFee ?? item.passengerFee ?? 0,
              totalTollFare: item.TotalTollFare ?? item.totalTollFare ?? 0,
              totalLeviesFee: item.TotalLevies ?? item.totalLeviesFee ?? 0,
              serviceFee: item.TotalCharges ?? item.serviceFee ?? 0,
              serviceTax_GST: item.TotalGSTAmount ?? item.serviceTax_GST ?? 0,
              concessionType:
                item.ConcessionType ||
                item.PassengerType ||
                item.concessionType ||
                "",
              ticketID: item.TicketID || item.BookingID || item.ticketID || "",
              returnJourneyTicketID:
                item.ReturnJourneyTicketID || item.returnJourneyTicketID || "",
              gender: item.Gender || item.gender || "",
            };
          });
        } catch (err) {
          console.error("Error parsing response Data JSON:", err);
          reportData = [];
        }
      } else if (Array.isArray(response?.data)) {
        reportData = response.data;
      } else if (response?.data?.result) {
        reportData = Array.isArray(response.data.result) ? response.data.result : [];
      }
      set({
        CurrentConsolidateData: reportData,
      });
      return { response: reportData };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        CurrentConsolidateData: [],
      });
    } finally {
      set({
        isFetchCurrentConsolidateData: false,
      });
    }
  },
}));
