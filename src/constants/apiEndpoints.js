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
      ADD_BOOKINGS: `Transaction/AddBookingDetails`,
      GET_BOOKINGS_BOOKING_ID: `Transaction/GetBookingDetailsByBookingId`,
      GET_ALL_FACILITY_SERVICES: `${API_BASE_URL}Transaction/GetAllParkDetails`,
    },
    USER: {
      GET_USERS: `Master/GetAllAdminUser`,
      UPDATE_USER_DETAILS: `${API_BASE_URL}Master/UpdateAdminUser`,
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
      ADD_NEW_HOLIDAY: `${API_BASE_URL}Master/AddHolidaysList`,
      GET_HOLIDAYS: `${API_BASE_URL}Master/GetAllHolidays`,
      ADD_NEW_RECURRING_HOLIDAY: `${API_BASE_URL}Master/AddRecurringHoliday`,
    },
    MY_PROFILE: {
      GET_PROFILES: `${API_BASE_URL}AccountProfile/GetAccountProfileDetails`,
    },
    ENTITY_TYPE: {
      GET_ENTITY_TYPES: `${API_BASE_URL}Master/GetAllActiveEntitiyTypes`,
      ADD_ENTITY_TYPE: `${API_BASE_URL}Master/AddNewEntityType`,
      UPDATE_ENTITY_TYPE: `${API_BASE_URL}Master/UpdateEntityType`,
    },
    DEPARTMENT_TYPE: {
      GET_DEPARTMENT_TYPES: `${API_BASE_URL}Master/GetAllActiveDepartments`,
      ADD_DEPARTMENT_TYPE: `${API_BASE_URL}Master/AddNewDepartment`,
      UPDATE_DEPARTMENT_TYPE: `${API_BASE_URL}Master/UpdateDepartment`,
    },
    NODAL_OFFICERS :{
      GET_NODAL_OFFICERS: `Master/GetAllServiceVarients`,
      UPDATE_NODAL_OFFICERS_DETAILS: `${API_BASE_URL}Master/UpdateServiceVarients`,
      ADD_NEW_NODAL_OFFICERS: `${API_BASE_URL}Master/AddNewServiceVarient`,
    }
  },
  ENTITIES:{
    DOWNLOAD_FILE:`${API_BASE_URL}Transaction/DownloadQRCodeByParkId`
  },
  DASHBOARD: {
    GET_DASHBOARD_COUNTS: `${API_BASE_URL}DashBoard/GetTotalBookingCount`,
    GET_ALL_BOOKINGS: `${API_BASE_URL}Transaction/GetAllEntityBookingByFilters`,
    PIE_CHARTS: {
      GET_ENTITY_WISE_COUNTS: `${API_BASE_URL}DashBoard/GetEntityWiseTotalBookings`,
    },
  },
};
