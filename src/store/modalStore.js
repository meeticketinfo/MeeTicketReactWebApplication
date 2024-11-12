import { create } from "zustand";

export const useModalStore = create((set) => ({
  openModalId: null,
  setOpenModalId: (modalId) => set({ openModalId: modalId }),
  closeModal: () => set({ openModalId: null }),
}));
