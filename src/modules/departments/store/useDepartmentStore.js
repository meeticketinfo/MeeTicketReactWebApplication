import { create } from "zustand";


export const useDepartmentStore = create((set) => ({
  allDepartmentTypes: [],
  isFetchAllDepartmentTypesLoading: false,
  allFacilityServices: {},
  isSaveDepartmentTypeDetailsLoading: false,
  saveDepartmentTypeDetailsError: null,
  DepartmentTypeDetails: {},
  departmentTypeEditDetails: {},
  isFetchCurrentDepartmentTypeDetailsLoading: false,

  setError: (error) => set({ saveDepartmentTypeDetailsError: error }),

  serializeFilters: (filters) =>  
    Object.entries(filters)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&"),

  setDepartmentTypeDetails: (newDepartmentTypeDetails) => {
    set({ DepartmentTypeDetails: newDepartmentTypeDetails });
  },

  setDepartmentTypeEditDetails: (departmentTypeEditDetails) => {
    set({ departmentTypeEditDetails });
  },

}))