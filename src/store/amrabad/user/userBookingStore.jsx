import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";
import { toast } from "react-toastify";

export const useUserBookingStore = create((set) => ({
  // fetch user packages
  GetUserPackages: [],
  isUserPackagesLoading: false,
  // fetch rooms by package id
  GetRoomsByPackageId: [],
  isRoomsByPackageIdLoading: false,
  // fetch package detail
  GetPackageDetail: [],
  isPackageDetailLoading: false,  
  // fetch calendar
  GetCalendar: [],
  isCalendarLoading: false,
  // fetch ticket view details
  GetTicketViewDetails: {},
  isTicketViewDetailsLoading: false,
  // fetch countries
  GetCountries: [],
  isCountriesLoading: false,
  // fetch states
  GetStates: [],
  isStatesLoading: false,
  // fetch user packages
  fetchUserPackages: async () => {
    set({ isUserPackagesLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.USER.GET_USER_PACKAGES}`
      );

      set({
        GetUserPackages: response.data,
        isUserPackagesLoading: false,
      });
    } catch (error) {
      set({
        isUserPackagesLoading: false,
      });
      toast(error.message || "Some thing went wrong");
    }
  },

  // fetch rooms by package id
  fetchRoomsByPackageId: async (packageId, FromDate, ToDate) => {
    const queryParams = new URLSearchParams();
    queryParams.append("packageId", packageId);
    if (FromDate) queryParams.append("FromDate", FromDate);
    if (ToDate) queryParams.append("ToDate", ToDate);
    set({ isRoomsByPackageIdLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.USER.GET_ROOMS_BY_PACKAGE_ID}?${queryParams.toString()}`
      );

      set({
        GetRoomsByPackageId: response.data,
        isRoomsByPackageIdLoading: false,      
      });
    } catch (error) {
      set({
        isRoomsByPackageIdLoading: false,
      });
      toast(error.message || "Some thing went wrong");
    }
  },
  // fetch package detail
  fetchPackageDetail: async (packageId) => {
    set({ isPackageDetailLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.USER.GET_PACKAGE_DETAIL}?packageId=${packageId}`
      );
      set({
        GetPackageDetail: response.data.data,
        isPackageDetailLoading: false,
      });
    } catch (error) {
      set({
        isPackageDetailLoading: false,
      });
      toast(error.message || "Some thing went wrong");
    }
  },

  fetchCalendar: async (packageId, houseId) => {
    set({ isCalendarLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.USER.GET_CALENDAR}?packageId=${packageId}&roomId=${houseId}`
      );
      set({
        GetCalendar: response.data,
        isCalendarLoading: false,
      });
    } catch (error) {
      set({
        isCalendarLoading: false,
      });
      toast(error.message || "Some thing went wrong");
    }
  },

  // fetch ticket view details
  fetchTicketViewDetails: async (bookingId) => {
    set({ isTicketViewDetailsLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.AMRABAD.USER.GET_TICKET_VIEW_DETAILS}/${bookingId}`
      );
      set({
        GetTicketViewDetails: response.data,
        isTicketViewDetailsLoading: false,
      });
    } catch (error) {
      set({
        isTicketViewDetailsLoading: false,
      });
      toast(error.message || "Some thing went wrong");
    }
  },
  // fetch countries
  fetchCountries: async () => {
    set({ isCountriesLoading: true });
    try {
      const response = await apiService.get(API_ENDPOINTS.AMRABAD.MASTERS.GET_COUNTRIES);
      set({
        GetCountries: response.data,
        isCountriesLoading: false,
      });
    } catch (error) {
      set({
        isCountriesLoading: false,
      });
      toast(error.message || "Some thing went wrong");
    } 
  },
  // fetch states
  fetchStates: async ( countryId) => {
    set({ isStatesLoading: true });
    try {
      const response = await apiService.get(API_ENDPOINTS.AMRABAD.MASTERS.GET_STATES + "?countryId=" + countryId);
      set({
        GetStates: response.data,
        isStatesLoading: false,
      });
    } catch (error) {
      set({
        isStatesLoading: false,
      });
      toast(error.message || "Some thing went wrong");
    }
  }
}));
