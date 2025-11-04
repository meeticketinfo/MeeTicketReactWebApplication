import { create } from "zustand";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import apiService from "../../services/apiService";
 
export const DepartmentAdminStore = create((set) => ({
  departmentAdminEditDetails: {},
  setCurrentDepartmentAdminEditDetails: (departmentAdminEditDetails) => {
    set({
      departmentAdminEditDetails,
    });
  },
  GetDepartmentAdmin: [],
  isSaveDepartmentAdminDetailsLoading: false,
  // Fetch all Bookings
  fetchAllDepartmentAdmin: async (payload) => {
    set({ isFetchAllDepartmentAdminLoading: true });
    try {
      const response = await apiService.get(
        `${API_ENDPOINTS.MASTERS.DEPARTMENT_ADMIN.GET_DEPARTMENT_ADMIN}?fromDateTime=${payload.fromDateTime}&toDateTime=${payload.toDateTime}&mobileNumber=${payload.mobileNumber}&pageSize=${payload.pageSize}&PageNumber=${payload.PageNumber}`
      );
      set({
        allDepartmentAdmin: response.data,
        isFetchAllDepartmentAdminLoading: false,
      });
    } catch (error) {
      console.log("error", error.response.data);
      set({ isFetchAllDepartmentAdminLoading: false, allDepartmentAdmin: [] });
      toast.error(error.response.data);
    }
  },
 
  AddedUser: [],
  isSaveDepartmentAdminDetailsLoading: false,
  savePosUser: async (PosUserData, isUpdate = false) => {
    set({ isSaveDepartmentAdminDetailsLoading: true });
    try {
      const url = isUpdate
        ? API_ENDPOINTS.MASTERS.DEPARTMENT_ADMIN.UPDATE_DEPARTMENT_ADMIN
        : API_ENDPOINTS.MASTERS.DEPARTMENT_ADMIN.ADD_NEW_DEPARTMENT_ADMIN;
      const method = isUpdate ? "put" : "post";
 
      const response = await apiService[method](url, PosUserData);
 
      set({
        AddedUser: response.data,
        isSaveDepartmentAdminDetailsLoading: false,
      });
 
      return { success: true, data: response };
    } catch (error) {
      toast.error(error.response.data);
      set({ isSaveDepartmentAdminDetailsLoading: false });
      throw error;
    }
  },
}));
 
 