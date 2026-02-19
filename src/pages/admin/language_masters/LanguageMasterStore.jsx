import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";



export const FacilityHolidayStore = create((set) => ({

    FacilityHolidayEditDetails: null,
    setCurrentFacilityHolidayEditDetails: (details) => {
        set({ FacilityHolidayEditDetails: details });
      },

    allFacilityHolidays: [],
    isFetchFacilityHolidaysLoading: false,
    fetchFacilityHolidays: async () => {
        set({ isFetchFacilityHolidaysLoading: true });
        try {

            const response = await apiService.get(
                `${API_ENDPOINTS.MASTERS.FACILITY_HOLIDAY.GET__FACILITY_HOLIDAY}`
            );
            set({
                allFacilityHolidays: response.data,
                isFetchFacilityHolidaysLoading: false,
            });
        } catch (error) {
            set({ isFetchFacilityHolidaysLoading: false });
            throw error;
        }finally{
            set({ isFetchFacilityHolidaysLoading: false });
        }
    },

    // Save holiday details (add or update)
    isSaveFacilityHolidayLoading: false,
    saveFacilityHolidayDetails: async (Data, isUpdate = false) => {
        set({ isSaveFacilityHolidayLoading: true });
        try {
            const url = isUpdate
                ? API_ENDPOINTS.MASTERS.FACILITY_HOLIDAY.UPDATE_FACILITY_HOLIDAY
                : API_ENDPOINTS.MASTERS.FACILITY_HOLIDAY.ADD_FACILITY_HOLIDAY;
            const method = isUpdate ? "put" : "post";
            const response = await apiService[method](url, Data);
            set({
                isSaveFacilityHolidayLoading: false,
            });
            return { success: true, data: response };
        } catch (error) {
            set({ isSaveFacilityHolidayLoading: false });
            throw error;
        }finally{
            set({ isSaveFacilityHolidayLoading: false });
        }
    },

}));
