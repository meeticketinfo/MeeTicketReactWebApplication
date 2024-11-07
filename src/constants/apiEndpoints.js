export const API_BASE_URL =
  "https://meeticketservice-dev-dotnet.azurewebsites.net/api/";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  },
  MASTERS: {
    PARK: {
      GET_PARKS: `Master/GetAllParks`,
      UPDATE_PARK_DETAILS: `${API_BASE_URL}Master/UpdatePark`,
      ADD_NEW_PARK: `${API_BASE_URL}Master/AddNewPark`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
    },
    PARK_ADMIN: {
      GET_PARK_ADMINS: `${API_BASE_URL}Master/GetAllUsersByRoleId?RoleId=901a561a-2c54-4f1f-9a40-5aa8b71e2e71`,
    },
    FACILITY: {
      GET_FACILITIES: `Master/GetAllFacilities`,
      UPDATE_FACILITY_DETAILS: `${API_BASE_URL}Master/UpdateFacilities`,
      ADD_NEW_FACILITY: `${API_BASE_URL}Master/AddNewFacility`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
    },
    BOOKING: {
      GET_BOOKINGS: `Master/GetAllBookings`,
      UPDATE_PARK_DETAILS: `${API_BASE_URL}Master/UpdatePark`,
      ADD_NEW_PARK: `${API_BASE_URL}Master/AddNewPark`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
      GET_ALL_FACILITY_SERVICES: `${API_BASE_URL}Transaction/GetAllParkDetails`,
    },
    USER: {
      GET_USERS: `Master/GetAllAdminUser`,
      UPDATE_PARK_DETAILS: `${API_BASE_URL}Master/UpdatePark`,
      ADD_NEW_USER: `${API_BASE_URL}Master/AddNewAdminUser`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
    },
    GATE_KEEPER: {
      ADD_NEW_GATE_KEEPER: `${API_BASE_URL}Master/AddNewGatekeeper`,
      GET_GATE_KEEPERS: `${API_BASE_URL}Master/GetAllUsersByRoleId?RoleId=901a561a-2c54-4f1f-9a40-5aa8b71e2e76`,
    },
    SCANNED_USER: {
      GET_SCANNED_USERS: `Master/GetAllScanUsers`,
      UPDATE_PARK_DETAILS: `${API_BASE_URL}Master/UpdatePark`,
      ADD_NEW_PARK: `${API_BASE_URL}Master/AddNewPark`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
    },
    SERVICE: {
      GET_SERVICES: `Master/GetAllServices`,
      UPDATE_SERVICE_DETAILS: `${API_BASE_URL}Master/UpdateServices`,
      ADD_NEW_SERVICE: `${API_BASE_URL}Master/AddNewServices`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
    },
    SERVICE_VARIANT: {
      GET_SERVICE_VARIANTS: `Master/GetAllServiceVarients`,
      UPDATE_SERVICE_VARIENT_DETAILS: `${API_BASE_URL}Master/UpdateServiceVarients`,
      ADD_NEW_SERVICE_VARIENT: `${API_BASE_URL}Master/AddNewServiceVarient`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
    },
    PAYMENTS: {
      GET_PAYMENTS: `Master/GetAllPayments`,
      UPDATE_PAYMENTS_DETAILS: `${API_BASE_URL}Master/UpdatePark`,
      ADD_PAYMENTS: `${API_BASE_URL}Master/AddNewPark`,
      DELETE_PAYMENTS: `${API_BASE_URL}Master/DeletePark`,
      GET_PAYMENTS_DETAILS: `${API_BASE_URL}Master/`,
    },
    HOLIDAY: {
      ADD_NEW_HOLIDAY: `Master/AddNewHoliday`,
      GET_HOLIDAYS: `Master/GetAllHolidays`,
    },
  },
};
