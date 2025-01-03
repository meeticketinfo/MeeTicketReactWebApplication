import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePaginationStore = create(
  persist(
    (set) => ({
      activePage: 0,
      setActivePage: (page) => set({ activePage: page }),
      resetPage: () => set({ activePage: 0 }),
    }),
    {
      name: 'pagination-store', // The key used to store data in localStorage
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

export default usePaginationStore;
