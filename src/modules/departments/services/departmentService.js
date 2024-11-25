
import apiService from "../../../services/apiService";
import { useDepartmentStore } from "../store/useDepartmentStore";


const departmentService = () => {

  const {
    setError,
    setDepartmentTypeDetails,
  } = useDepartmentStore.getState();

  return {
    
    fetchAllDepartmentTypes: async (
      pageIndex = 1,
      pageSize = 10,
      filters = {}
    ) => {
      useDepartmentStore.setState({ isFetchAllDepartmentTypesLoading: true });
      try {
        const query = useDepartmentStore.getState()
          .serializeFilters({
            pageIndex,
            pageSize,
            ...filters
          })
        const response = await apiService.get(
          `${API_ENDPOINTS.MASTERS.DEPARTMENT_TYPE.GET_DEPARTMENT_TYPES}?${query}`
        );
        useDepartmentStore.setState({
          allDepartmentTypes: response.data,
          isFetchAllDepartmentTypesLoading: false,
        });
      } catch (error) {
        setError({ isFetchAllDepartmentTypesLoading: false });
      }
    },

    fetchCurrentDepartmentTypeDetailsByDepartmentTypeId: async (
      DepartmentTypeId
    ) => {
      useDepartmentStore.setState({ isFetchCurrentDepartmentTypeDetailsLoading: true });
      try {
        const response = await apiService.get(
          `${API_ENDPOINTS.MASTERS.DepartmentType.GET_DepartmentTypeS_DepartmentType_ID}/${DepartmentTypeId}`
        );
        // Ensure correct setting of the DepartmentTypeDetails state
        useDepartmentStore.setState({
          isFetchCurrentDepartmentTypeDetailsLoading: false,
        });
        setDepartmentTypeDetails(response.data)
        return { success: true, data: response };
      } catch (error) {
        setError({
          isFetchCurrentDepartmentTypeDetailsLoading: false,
        });
        return { success: false };
      }
    },

    // Save Facility details
    saveDepartmentTypeDetails: async (
      DepartmentTypeDetailsPayload,
      isUpdate = false
    ) => {
      useDepartmentStore.setState({ isSaveDepartmentTypeDetailsLoading: true });
      try {
        const url = isUpdate
          ? API_ENDPOINTS.MASTERS.DEPARTMENT_TYPE.UPDATE_DEPARTMENT_TYPE
          : API_ENDPOINTS.MASTERS.DEPARTMENT_TYPE.ADD_DEPARTMENT_TYPE;
        const method = isUpdate ? "put" : "post";
        let response;
        if (isUpdate) {
          response = await apiService[method](url, DepartmentTypeDetailsPayload);
        } else {
          response = await apiService[method](url, DepartmentTypeDetailsPayload);
        }

        useDepartmentStore.setState({
          // departmentCreateResponse: { response },
          // departmentDetails: response.data,
          isSaveDepartmentTypeDetailsLoading: false,
        });

        return { success: true, data: response };
      } catch (error) {
        useDepartmentStore.setState({
          saveDepartmentTypeDetailsError: error.message,
          isSaveDepartmentTypeDetailsLoading: false,
        });
        throw error;
      }
    },
  }
}
export default departmentService;



