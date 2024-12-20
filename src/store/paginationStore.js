import {create} from 'zustand';

const usePaginationStore = create((set) => ({
  activePage: 0,
  setActivePage: (page) => set({ activePage: page }),
  resetPage: () => set({ activePage: 0 }),
}));

export default usePaginationStore;