import { create } from "zustand";
import apiService from "../../services/apiService";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { toast } from "react-toastify";

export const useSlotBookingStore = create((set) => ({
  isSlotAdd: false,
  setIsSlotAdd: (isSlotAdd) => {
    set({
      isSlotAdd,
    });
  },

  isSlotEdit: false,
  setIsSlotEdit: (isSlotEdit) => {
    set({
      isSlotEdit,
    });
  },

  slotEditDetails: {},
  setSlotEditDetails: (slotEditDetails) => {
    set({
      slotEditDetails,
    });
  },

  // Save Service details
  isSaveSlotDetailsLoading: false,
  saveSlotDetails: async (SlotData, isUpdate = false) => {
    set({ isSaveSlotDetailsLoading: true });
    console.log("isUpdate", isUpdate);
    try {
      const url = !isUpdate
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

  // delete Slot
  DeleteSlotDetailsLoading: false,
  DeleteSlotDetails: async (SlotData) => {
    set({ DeleteSlotDetailsLoading: true });
    try {
      const url = API_ENDPOINTS.MASTERS.SLOT.DELETE_SLOT;

      const response = await apiService.delete(`${url}?slotId=${SlotData}`);
      set({
        DeleteSlotDetailsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ DeleteSlotDetailsLoading: false });
      toast.error(error.response.data.message);
      throw error;
    }
  },

  // get Slots
  getSlotsLoading: false,
  slots: [],
  getSlots: async (subFacilityId) => {
    set({ getSlotsLoading: true });
    try {
      const response = await apiService.get(`${API_ENDPOINTS.MASTERS.SLOT.GET_SLOTS}?subfacilityId=${subFacilityId}`);
      set({
        slots: response?.data || [],
        getSlotsLoading: false,
      });
    } catch (error) {
      set({ getSlotsLoading: false });
      toast.error(error?.message || "Something went wrong while fetching slots");
      throw error;
    }
  },

  // Suspend Slots
  isSuspendSlotsLoading: false,
  suspendSlots: async (suspendData) => {
    set({ isSuspendSlotsLoading: true });
    try {
      const url = API_ENDPOINTS.MASTERS.SLOT.SUSPEND_SLOTS;
      const response = await apiService.post(url, suspendData);
      set({
        isSuspendSlotsLoading: false,
      });
      return { success: true, data: response };
    } catch (error) {
      set({ isSuspendSlotsLoading: false,slots:[] });
      toast.error(error.response?.data?.message || "Failed to suspend slots");
      throw error;
    }
  },
}));
