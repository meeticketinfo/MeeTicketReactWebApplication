import { create } from "zustand";
import apiService from "../../../services/apiService";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";



export const LanguageMasterStore = create((set) => ({

    LanguageEditDetails: null,
    setLanguageEditDetails: (details) => {
        set({ LanguageEditDetails: details });
    },

    allLanguages: [],
    isFetchLanguagesLoading: false,
    fetchLanguages: async (parkId) => {
        set({ isFetchLanguagesLoading: true });
        try {

            const response = await apiService.get(
                `${API_ENDPOINTS.MASTERS.LANGUAGE.GET__LANGUAGE}?parkId=${parkId}`
            );
            set({
                allLanguages: response.data,
                isFetchLanguagesLoading: false,
            });
        } catch (error) {
            set({ isFetchLanguagesLoading: false, allLanguages: [] });

            throw error;
        } finally {
            set({ isFetchLanguagesLoading: false });
        }
    },

    // Save holiday details (add or update)
    isSaveLanguageLoading: false,
    saveLanguageDetails: async (Data, isUpdate = false) => {
        set({ isSaveLanguageLoading: true });
        try {
            const url = isUpdate
                ? API_ENDPOINTS.MASTERS.LANGUAGE.UPDATE_LANGUAGE
                : API_ENDPOINTS.MASTERS.LANGUAGE.ADD_LANGUAGE;
            const method = isUpdate ? "put" : "post";
            const response = await apiService[method](url, Data);
            set({
                isSaveLanguageLoading: false,
            });
            return response;
        } catch (error) {
            set({ isSaveLanguageLoading: false });
            throw error;
        } finally {
            set({ isSaveLanguageLoading: false });
        }
    },

}));
