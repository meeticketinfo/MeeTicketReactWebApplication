import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";



export const GroupDetailsStore = create((set) => ({

    GroupDetailsEditDetails: null,
    setGroupDetailsEditDetails: (details) => {
        set({ GroupDetailsEditDetails: details });
    },

    allGroupDetails: [],
    isFetchGroupDetailsLoading: false,
    fetchGroupDetails: async () => {
        set({ isFetchGroupDetailsLoading: true });
        try {

            const response = await apiService.get(
                `${API_ENDPOINTS.MASTERS.GROUP_DETAILS.GET__GROUP_DETAILS}`
            );
            set({
                allGroupDetails: response.data,
                isFetchGroupDetailsLoading: false,
            });
        } catch (error) {
            throw error;
        } finally {
            set({ isFetchGroupDetailsLoading: false });
        }
    },

    // Save holiday details (add or update)
    isSaveGroupDetailsLoading: false,
    saveGroupDetails: async (Data, isUpdate = false) => {
        set({ isSaveGroupDetailsLoading: true });
        try {
            const url = isUpdate
                ? API_ENDPOINTS.MASTERS.GROUP_DETAILS.UPDATE_GROUP_DETAILS
                : API_ENDPOINTS.MASTERS.GROUP_DETAILS.ADD_GROUP_DETAILS;
            const method = isUpdate ? "put" : "post";
            const response = await apiService[method](url, Data);
            set({
                isSaveGroupDetailsLoading: false,
            });
            return response;
        } catch (error) {
            throw error;
        } finally {
            set({ isSaveGroupDetailsLoading: false });
        }
    },

}));
