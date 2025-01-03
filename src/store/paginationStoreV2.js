import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const usePaginationStoreV2 = create(
  persist(
    (set) => ({
      activePageV2: 0,
      setActivePageV2: (page) => set({ activePageV2: page }),
      resetPage: () => set({ activePageV2: 0 }),
    }),
    {
      name: 'pagination-storeV2', // The key used to store data in localStorage
      getStorage: () => localStorage, // Use localStorage for persistence
    }
  )
);

export default usePaginationStoreV2;
