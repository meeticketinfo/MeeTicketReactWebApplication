import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
export const FilterStore = create((set) => ({
      StoredFiltes:{},

     setStoredFiltes: (StoredFiltes) => {
    set({ StoredFiltes: StoredFiltes });
  },
  
}));
