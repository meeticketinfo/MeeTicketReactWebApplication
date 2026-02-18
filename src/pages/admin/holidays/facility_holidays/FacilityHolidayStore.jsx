import { create } from "zustand";


export const FacilityHolidayStore = create((set, get) => ({






    // fetchAllHolidays: async (pageIndex = 1, pageSize = 10, filters = {}) => {
    //     set({ isFetchAllHolidaysLoading: true });
    //     try {
    //         const filterString = get().serializeFilters(filters);
    //         const response = await apiService.get(
    //             `${API_ENDPOINTS.MASTERS.HOLIDAY.GET_HOLIDAYS}?PageIndex=${pageIndex}&PageSize=${pageSize}&${filterString}`
    //         );
    //         set({
    //             allHolidays: response.data,
    //             isFetchAllHolidaysLoading: false,
    //         });
    //     } catch (error) {
    //         set({ isFetchAllHolidaysLoading: false });
    //     }
    // },





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
