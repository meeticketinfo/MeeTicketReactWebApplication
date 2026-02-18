import { create } from "zustand";


export const FacilityHolidayStore = create((set, get) => ({


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
        }
    },





    // Save holiday details (add or update)

    saveFacilityHolidayDetails: async (Data, isUpdate = false) => {
        set({ isSaveFacilityHolidayLoading: true });
        try {
            const url = isUpdate
                ? API_ENDPOINTS.MASTERS.HOLIDAY.UPDATE_HOLIDAY_DETAILS
                : API_ENDPOINTS.MASTERS.HOLIDAY.ADD_NEW_HOLIDAY;
            const method = isUpdate ? "put" : "post";

            const response = await apiService[method](url, Data);
            set({

                isSaveFacilityHolidayLoading: false,
            });
            return { success: true, data: response };
        } catch (error) {
            set({ isSaveFacilityHolidayLoading: false });
            throw error;
        }
    },

}));
