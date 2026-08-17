import { create } from "zustand";

import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";
import apiService from "../../../../../services/apiService";
export const useIntercityTicketViewStore = create((set) => ({
  //  -----------------API CALLS------------------------------------------------------

  // Intercity ticket view
  IntercityTicketViewData: [],
  isFetchIntercityTicketViewData: false,
  fetchIntercityTicketViewData: async (paymentTransactionId = "") => {
    set({ isFetchIntercityTicketViewData: true });
    try {
      const method = "get";
      const response = await apiService[method](
        `${API_ENDPOINTS.REPORTS.RTC_REPORTS.INTERCITY_REPORTS.GET_INTERCITY_TICKET_VIEW}/${paymentTransactionId}`
      );
      set({
        IntercityTicketViewData: response.data,
      });
      return { response: response.data };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        IntercityTicketViewData: [],
      });
    } finally {
      set({
        isFetchIntercityTicketViewData: false,
      });
    }
  },

  // Current ticket view (MavenConnect GetBookingsByBookingID)
  fetchCurrentTicketViewData: async (bookingId = "") => {
    set({ isFetchIntercityTicketViewData: true });
    try {
      const response = await apiService.get(
        API_ENDPOINTS.REPORTS.RTC_REPORTS.CURRENT_BOOKINGS_REPORTS.GET_CURRENT_TICKET_VIEW,
        { BookingID: bookingId },
        {
          token: "AmxsG7zkJB",
          Accept: "application/json",
        }
      );

      let rawData = response.data;
      if (typeof rawData === "string") {
        try {
          rawData = JSON.parse(rawData);
        } catch (e) { }
      }

      let inner = rawData?.Data
        ? typeof rawData.Data === "string"
          ? JSON.parse(rawData.Data)
          : rawData.Data
        : rawData;

      let item =
        Array.isArray(inner?.Table) && inner.Table.length > 0
          ? inner.Table[0]
          : Array.isArray(inner) && inner.length > 0
            ? inner[0]
            : inner;

      const totalFare = parseFloat(item?.TotalFare) || 0;
      const seats = [
        {
          seatNumber: "N/A",
          passengers: [
            {
              passengerName: item?.PassengerTypeName || "Passenger",
              phonenumber: item?.PassengerMobileNo || "N/A",
              passengerAge: "N/A",
              passengerGender: "N/A",
            },
          ],
        },
      ];

      const normalized = {
        pnrNumber: item?.PNRNumber,
        trvaelDate: item?.JourneyDate || item?.BookingDateTime || "",
        ticketNumber: item?.PNRNumber,
        busType: item?.ServiceName || item?.ServiceCode || "N/A",
        depo: item?.FromStageName || "N/A",
        dropOffName: item?.ToStageName || item?.ToBoardingName || "N/A",
        serviceNumber: item?.ServiceCode || "N/A",
        arrivelTime: item?.JourneyDateDisplay || "N/A",
        fromStationName: item?.FromStageName || "N/A",
        toStationName: item?.ToStageName || "N/A",
        pickUpName: item?.FromBoardingName || item?.FromStageName || "N/A",
        departureTime: item?.BookingDateDisplay || "N/A",
        ticketStatus: item?.DisplayStatus || item?.BookingStatusName || "PENDING",
        totalNoOfSeats: item?.TotalPassengerCount || (item?.AdultCount || 0) + (item?.ChildCount || 0) || 1,
        seats: seats,
        total: {
          basicFare: totalFare > 0 ? totalFare.toFixed(2) : "0.00",
          reservationFee: "0.00",
          gstSum: "0.00",
          roundOff: "0.00",
          tollSum: "0.00",
          serviceSum: "0.00",
          concessionAmt: (parseFloat(item?.ConcessionPercentage) || 0).toFixed(2),
          flexifare: "0.00",
          confirmAmount: totalFare > 0 ? totalFare.toFixed(2) : "0.00",
        },
        ...item,
      };

      set({
        IntercityTicketViewData: normalized,
      });
      return { response: normalized };
    } catch (error) {
      toast.error(error.message);
      set({
        error: error.message,
        IntercityTicketViewData: [],
      });
    } finally {
      set({
        isFetchIntercityTicketViewData: false,
      });
    }
  },
}));
