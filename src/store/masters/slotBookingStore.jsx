import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";

export const useSlotBookingStore = create((set) => ({
    isSlotAdd:false,
  setIsSlotAdd: (isSlotAdd) => {
    set({
      isSlotAdd,
    });
  },

  isSlotEdit:false,
  setIsSlotEdit: (isSlotEdit) => {
    set({
      isSlotEdit,
    });
  },

  slotEditDetails:{},
  setSlotEditDetails: (slotEditDetails) => {
    set({
      slotEditDetails,
    });
  },

  

  // Save Service details
  isSaveSlotDetailsLoading: false,
  saveSlotDetails: async (SlotData, isUpdate = false) => {
    set({ isSaveSlotDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.SLOT.ADD_NEW_SLOT
        : API_ENDPOINTS.MASTERS.SLOT.UPDATE_SLOT_DETAILS;

      const method = isUpdate ? "put" : "post";

      const response = await apiService[method](url, SlotData);

      set({
        SlotDetails: response.data,
        isSaveSlotDetailsLoading: false,
        success: "Slot saved successfully.",
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isSaveSlotDetailsLoading: false });
      throw error;
    }
  },
}));
