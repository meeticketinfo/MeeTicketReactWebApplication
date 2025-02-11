import useAuthStore from "../store/authStore";

/// dev
// export const API_BASE_URL =
//   "https://meeticketdevui.vmaxtechservices.life/parkapi/api/";

// metro dev
// export const METRO_API_BASE_URL =
//   "https://meeticketdevui.vmaxtechservices.life/metroapi/v1.0/";

// METRO UAT
export const METRO_API_BASE_URL =
  "https://uat.meeticket.telangana.gov.in/metrohsmapi/v1/";

//  PARK UAT
export const API_BASE_URL =
  "https://uat.meeticket.telangana.gov.in/parkuatapi/api/";

// METRO PROD
// export const METRO_API_BASE_URL =
// "https://uat.meeticket.telangana.gov.in/metroapiv2/";

// PARK PROD
// export const API_BASE_URL = 
//   "https://uat.meeticket.telangana.gov.in/parkapiv2/api/";

// export const API_BASE_URL ="https://hq78vgwh-7237.inc1.devtunnels.ms/api/"

// testing
// export const API_BASE_URL =
//   "https://3m72k312-7237.inc1.devtunnels.ms/api/";

// metro dev testing
// export const METRO_API_BASE_URL =
//   "https://6phbrdb7-7237.inc1.devtunnels.ms/v1.0/";

// METRO UAT testing
// export const METRO_API_BASE_URL =
//   "https://m7411qx6-7297.inc1.devtunnels.ms/v1/";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  },
  MASTERS: {
    PARK: {
      GET_PARKS: `${API_BASE_URL}Master/GetAllEntities`,
      UPDATE_PARK_DETAILS: `${API_BASE_URL}Master/UpdatePark`,
      UPDATE_NODAL_OFFICER_PARK_DETAILS: `${API_BASE_URL}Master/UpdateLocation`,
      ADD_NEW_PARK: `${API_BASE_URL}Master/AddNewPark`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
      GET_NODAL_OFFICER_ENTITIES: `${API_BASE_URL}NodalOfficer/GetAllParksOfNodalOfficer`,
    },
    PARK_ADMIN: {
      GET_PARK_ADMINS: `${API_BASE_URL}Master/GetAllUsersByRoleId?RoleId=901a561a-2c54-4f1f-9a40-5aa8b71e2e71`,
    },
    FACILITY: {
      GET_FACILITIES: `Master/GetAllFacilities`,
      GET_FACILITIES_NODAL_OFFICER: `NodalOfficer/GetAllFacilities?parkId=`,
      ADMIN_GET_FACILITIES: `${API_BASE_URL}Facilities/GetAllFacilityMasters`,
      ADMIN_ADD_FACILITIES: `${API_BASE_URL}Facilities/CreateMasterFacility`,
      ADMIN_UPDATE_FACILITIES: `${API_BASE_URL}Facilities/UpdateMasterFacilities`,
      FACILITIES_DROPDOWN: `${API_BASE_URL}Facilities/GetFacilitiesDropDown`,
      FACILITIES_DROPDOWN_BY_ID: `${API_BASE_URL}NodalOfficer/GetFacilitiesDropDownByParkId?parkId=`,
      UPDATE_FACILITY_DETAILS: `${API_BASE_URL}Master/UpdateFacilities`,
      UPDATE_FACILITY_DETAILS_NODAL_OFFICER: `${API_BASE_URL}NodalOfficer/UpdateFacilities`,
      ADD_NEW_FACILITY: `${API_BASE_URL}Facilities/CreateNewFacility`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
    },
    UNIFIED_FACILITY: {
      GET_ALL: `${API_BASE_URL}Master/GetFacilitiesWithSubFacilitiesAndTicketTypes`,
      GET_ALL_BY_ID: `${API_BASE_URL}NodalOfficer/GetFacilitiesWithSubFacilitiesAndTicketTypes`,
      CREATE: `${API_BASE_URL}Master/AddFacilityWithSubFacilitiesAndTicketTypes`,
      CREATE_BY_ID: `${API_BASE_URL}NodalOfficer/AddFacilityWithSubFacilitiesAndTicketTypes`,
    },
    BOOKING: {
      GET_BOOKINGS: `${API_BASE_URL}Transaction/v2/GetAllEntityBookingByFilters`,
      FIRST_STEP_TRANSACTION: `${API_BASE_URL}PaymentTransaction/Transaction`,
      GET_PAYMENT_STATUS: `${API_BASE_URL}PaymentTransaction/OrderStatusCall/`,
      ADD_BOOKINGS: `Transaction/AddBookingDetails`,
      // ADD_BOOKINGS: `Transaction/AddBookingDetailsWithLimit`,
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
      UPDATE_GATE_KEEPER: `${API_BASE_URL}Master/UpdateGatekeeper`,
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
      GET_SERVICES: `Master/GetAllServicesById?facilityId=`,
      GET_SERVICES_NODAL_OFFICER: `NodalOfficer/GetAllServices?parkId=`,
      UPDATE_SERVICE_DETAILS: `${API_BASE_URL}Master/UpdateServices`,
      UPDATE_SERVICE_DETAILS_NODAL_OFFICER: `${API_BASE_URL}NodalOfficer/UpdateServices`,
      ADD_NEW_SERVICE: `${API_BASE_URL}Master/AddNewServices`,
      ADD_NEW_SERVICE_NODAL_OFFICER: `${API_BASE_URL}NodalOfficer/AddNewServices`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
    },
    SERVICE_VARIANT: {
      GET_SERVICE_VARIANTS: `Master/GetServiceVariantsByBookingDate`,
      UPDATE_SERVICE_VARIENT_DETAILS: `${API_BASE_URL}Master/UpdateServiceVarients`,
      ADD_NEW_SERVICE_VARIENT: `${API_BASE_URL}Master/AddNewServiceVarient`,
      UPDATE_SERVICE_VARIENT_DETAILS_NODAL_OFFICER: `${API_BASE_URL}NodalOfficer/UpdateServiceVarients`,
      ADD_NEW_SERVICE_VARIENT_NODAL_OFFICER: `${API_BASE_URL}NodalOfficer/AddNewServiceVarient`,
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
      GET_RECURRING_HOLIDAYS: `${API_BASE_URL}Master/GetAllRecurringHolidays`,
    },
    MY_PROFILE: {
      GET_PROFILES: `${API_BASE_URL}AccountProfile/GetAccountProfileDetails`,
    },
    ENTITY_TYPE: {
      GET_ENTITY_TYPES: `${API_BASE_URL}Master/GetAllEntityTypes`,
      ADD_ENTITY_TYPE: `${API_BASE_URL}Master/AddNewEntityType`,
      UPDATE_ENTITY_TYPE: `${API_BASE_URL}Master/UpdateEntityType`,
    },
    DEPARTMENT_TYPE: {
      GET_ACTIVE_DEPARTMENT_TYPES: `${API_BASE_URL}Master/GetAllActiveDepartments`,
      GET_DEPARTMENT_TYPES: `${API_BASE_URL}Master/GetAllDepartments`,
      ADD_DEPARTMENT_TYPE: `${API_BASE_URL}Master/AddNewDepartment`,
      UPDATE_DEPARTMENT_TYPE: `${API_BASE_URL}Master/UpdateDepartment`,
    },
    NODAL_OFFICERS: {
      GET_NODAL_OFFICERS: `${API_BASE_URL}Master/GetAllUsersByRoleId?RoleId=901a561a-2c54-4f1f-9a40-5aa8b71e2e77`,
      GET_ENTITIES: `${API_BASE_URL}NodalOfficer/GetAllParksOfNodalOfficerById`,
      GET_LOCATION_ADMINS: `${API_BASE_URL}Master/GetAllEntityAdminsForNodalOfficer`,
      UPDATE_NODAL_OFFICERS_DETAILS: `${API_BASE_URL}NodalOfficer/UpdateNodalOfficer`,
      ADD_NEW_NODAL_OFFICERS: `${API_BASE_URL}NodalOfficer/AddNewNodalOfficer`,
    },
  },
  REPORTS: {
    BOOKING_REPORTS: {
      GET_COMPLETE_BOOKINGS: `${API_BASE_URL}ParkReport/GetCompletedBookings`,
      GET_TRANSACTION_PAYMENT: `${API_BASE_URL}ParkReport/GetUserWisePaymentDetailsWithStatus`,
    },
    RTC_BOOKINGS: {
      GET_RTC_BOOKINGS: `Master/GetAllFacilities`,
    },
    METRO_BOOKINGS: {
      GET_METRO_BOOKINGS: `Master/GetAllFacilities`,
    },
    METRO_Reports: {
      GET_METRO_SUMMARY: `${METRO_API_BASE_URL}MetroReport/GetTransactionReportResult`,
      GET_METRO_BOOKING_DETAILS: `${METRO_API_BASE_URL}MetroReport/GetBookingDetailsResult`,
      GET_METRO_PENDING_TRANSACTION_DETAILS: `${METRO_API_BASE_URL}MetroReport/GetInprogressorFailedPaymentTxnResult`,
    },
  },
  ENTITIES: {
    DOWNLOAD_FILE: `${API_BASE_URL}Transaction/DownloadQRCodeByParkId`,
  },
  DASHBOARD: {
    GET_DASHBOARD_COUNTS: `${API_BASE_URL}DashBoard/GetTotalBookingCount`,
    GET_METRO_DASHBOARD_COUNT: `${METRO_API_BASE_URL}MetroReport/GetTotalBookingCount`,
    GET_ALL_BOOKINGS: `${API_BASE_URL}Transaction/v2/GetAllEntityBookingByFilters`,
    GET_ALL_PARK_BOOKINGS: `${API_BASE_URL}ParkReport/GetDetailedBookingsSummary`,
    GET_BOOKINGS_BY_ROLE: `${API_BASE_URL}DashBoard/GetTotalBookingCountByRole`,
    PIE_CHARTS: {
      GET_ENTITY_WISE_COUNTS: `${API_BASE_URL}DashBoard/GetEntityWiseTotalBookings`,
    },
    GET_ZOO_PARK_DASHBOARD_COUNTS:  `${API_BASE_URL}ParkReport/GetDashboardZooPark`,
    GET_ZOO_PARK_DASHBOARD_COUNTS_TICKET_WISE:  `${API_BASE_URL}ParkReport/GetZooParkCounts`,
  },
};
