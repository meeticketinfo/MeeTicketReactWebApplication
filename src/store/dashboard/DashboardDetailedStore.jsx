// useDashboardDetailedStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useDashboardDetailedStore = create(
  persist(
    (set) => ({
      detailedReport: {},
      setDetailedReportParams: (params) =>
        set({ detailedReport: params }),
    }),
    {
      name: 'dashboard-detailed-store',
    }
  )
);

export default useDashboardDetailedStore;
