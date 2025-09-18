import useAuthStore from "../store/authStore";

/// dev park
export const API_BASE_URL =
  "https://meeticketdevui.vmaxtechservices.help/parkapi/api/";

//  PARK UAT
// export const API_BASE_URL =
//   "https://uat.meeticket.telangana.gov.in/parkuatapi/api/";

//  paynow UAT
export const PAYNOW_API_BASE_URL =
  "https://uat.meeticket.telangana.gov.in/parkapi/";

// metro dev
// export const METRO_API_BASE_URL =
//   "https://meeticketdevui.vmaxtechservices.help/metroapi/"; 

// METRO UAT
export const METRO_API_BASE_URL =
  "https://uat.meeticket.telangana.gov.in/metrohsmapi/";
// metroapi UAT
export const METRO_API_Plain_BASE_URL =
  "https://uat.meeticket.telangana.gov.in/metroapi/";

//  Grievance DEV
// export const GRIEVANCE_API_BASE_URL =
//   "https://meeticketdevui.vmaxtechservices.help/meesevaconnectapi/v1/";

//  Grievance UAT
export const GRIEVANCE_API_BASE_URL =
  "https://uat.meeticket.telangana.gov.in/grievanceapi/v1/";

//  TOURSIM DEV
export const TOURISM_API_BASE_URL =
  "https://meeticketdevui.vmaxtechservices.help/webservices/v1/";

//  TOURSIM UAT
// export const TOURISM_API_BASE_URL =
//   "https://meeticketdevui.vmaxtechservices.help/webservices/v1/";

// RTC dev
export const RTC_API_BASE_URL =
  "https://meeticketdevui.vmaxtechservices.help/rtcbuspassapi/v1/";

//RTC Intercity
export const RTC_INTERCITY_API_BASE_URL =
"https://meeticketdevui.vmaxtechservices.help/rtcintercity/v1/";

  // RTC BUS PASS DEV

  export const RTC_BUS_PASS_API_BASE_URL =
  "https://meeticketbuspassdevapi.vmaxtechservices.help/v1/";
  

// METRO PROD
// export const METRO_API_BASE_URL =
// "https://uat.meeticket.telangana.gov.in/metroapiv2/";

// Amarabad dev
export const AMRABAD_API_BASE_URL =
"https://meeticketdevui.vmaxtechservices.help/amrabad/api/";

// PARK PROD
//  PARK UAT testing
// export const API_BASE_URL =
//   "https://uat.meeticket.telangana.gov.in/parkapiv2/api/";

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    AMRABAD:{
      AMRABAD_REGISTER:`${AMRABAD_API_BASE_URL}Authorization/RegisterOTP`,
      AMRABAD_REGISTER_OTP:`${AMRABAD_API_BASE_URL}Authorization/ValidateRegisterOTP`,
      AMRABAD_RESEND_OTP:`${AMRABAD_API_BASE_URL}Authorization/ResendOTP`,
      AMRABAD_LOGIN:`${AMRABAD_API_BASE_URL}Authorization/AmrabadLogin`,
      AMRABAD_DECODE_TOKEN:`${AMRABAD_API_BASE_URL}Authentication/GetDecodedToken`,
      GET_FORGET_PIN_OTP_FROM_MOBILE:`${AMRABAD_API_BASE_URL}Authorization/ForgotPINOTP`,
      VERIFY_FORGET_PIN_OTP_FROM_MOBILE:`${AMRABAD_API_BASE_URL}Authorization/ValidateForgotPINOTP`,
      RESET_PIN:`${AMRABAD_API_BASE_URL}Authorization/ResetPIN`,
     
    }
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
      GET_FACILITIES: `v2/Master/GetAllFacilities`,
      GET_FACILITIES_NODAL_OFFICER: `NodalOfficer/GetAllFacilities?parkId=`,
      ADMIN_GET_FACILITIES: `${API_BASE_URL}Facilities/GetAllFacilityMasters`,
      ADMIN_ADD_FACILITIES: `${API_BASE_URL}Facilities/CreateMasterFacility`,
      ADMIN_UPDATE_FACILITIES: `${API_BASE_URL}Facilities/UpdateMasterFacilities`,
      FACILITIES_DROPDOWN: `${API_BASE_URL}Facilities/GetFacilitiesDropDown`,
      FACILITIES_DROPDOWN_BY_ID: `${API_BASE_URL}NodalOfficer/GetFacilitiesDropDownByParkId?parkId=`,
      UPDATE_FACILITY_DETAILS: `${API_BASE_URL}v2/Master/UpdateFacilities`,
      UPDATE_FACILITY_DETAILS_NODAL_OFFICER: `${API_BASE_URL}v2/NodalOfficer/UpdateFacilities`,
      ADD_NEW_FACILITY: `${API_BASE_URL}Facilities/CreateNewFacility`,
      DELETE_PARK: `${API_BASE_URL}Master/DeletePark`,
      GET_PARK_DETAILS: `${API_BASE_URL}Master/`,
    },
    UNIFIED_FACILITY: {
      GET_ALL: `${API_BASE_URL}v2/Master/GetFacilitiesWithSubFacilitiesAndTicketTypes`,
      GET_ALL_BY_ID: `${API_BASE_URL}v2/NodalOfficer/GetFacilitiesWithSubFacilitiesAndTicketTypes`,
      CREATE: `${API_BASE_URL}Master/AddFacilityWithSubFacilitiesAndTicketTypes`,
      CREATE_BY_ID: `${API_BASE_URL}NodalOfficer/AddFacilityWithSubFacilitiesAndTicketTypes`,
    },
    BOOKING: {
      GET_BOOKINGS: `${API_BASE_URL}Transaction/v2/GetAllEntityBookingByFilters`,
      FIRST_STEP_TRANSACTION: `${API_BASE_URL}v3/PaymentTransaction/Transaction`,
      GET_PAYMENT_STATUS: `${API_BASE_URL}PaymentTransaction/OrderStatusCall/`,
      ADD_BOOKINGS: `Transaction/AddBookingDetails`,
      CGG_TOGGLE: `Master/UpdateZooPArkCggEnable`,
      ADD_CASH_BOOKINGS: `Transaction/AddBookingDetailswithCash`,
      ADD_POS_BOOKINGS: `Transaction/AddBookingDetailsForPOS`,
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
      GET_SERVICE_VARIANTS: `Master/GetAllServiceVarients`,
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
      DELETE_HOLIDAY: `${API_BASE_URL}Master/DeleteHoliday`,
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
    BUS_PASS: {
      GET_ALL_BUS_PASSES: `${RTC_API_BASE_URL}RTCDashboard/GetAllBusPasses`,
    },
  },
  REPORTS: {
    BOOKING_REPORTS: {
      GET_COMPLETE_BOOKINGS: `${API_BASE_URL}ParkReport/GetCompletedBookings`,
      GET_TRANSACTION_PAYMENT: `${API_BASE_URL}ParkReport/GetUserWisePaymentDetailsWithStatus`,
      POST_GENERATE_POS_QR: `${API_BASE_URL}PaymentTransaction/GeneratePOSQr`,
      POST_CHECK_POS_TXS_STATUS: `${API_BASE_URL}PaymentTransaction/CheckPOSTransactionStatus`,
      GET_RE_GENERATE_TICKET: `${API_BASE_URL}Transaction/GenerateTicketFromFailedTransaction`,
      POST_VERIFY_TICKET: `${API_BASE_URL}PaymentTransaction/ToCheckOrderStatusCall`,
      GET_COMPLETED_ZOO_COUNTER_BOOKINGS:`${API_BASE_URL}ParkReport/GetCompletedZooCounterBookings`,
      GET_NEHRU_USER_WISE_PAYMENT_DETAILS:`${API_BASE_URL}ParkReport/GetNehruUserWisePaymentDetails`,
      // VERIFY_TICKET: `${API_BASE_URL}PaymentTransaction/ToCheckOrderStatusCall`,
    },
    RTC_BOOKINGS: {
      GET_RTC_BOOKINGS: `Master/GetAllFacilities`,
    },
    METRO_BOOKINGS: {
      GET_METRO_BOOKINGS: `Master/GetAllFacilities`,
    },
    PARK_Reports: {
      GET_PARK_BANK_TRANSACTION_REPORT: `${API_BASE_URL}ParkReport/GetParkBankTransactionReport`,
    },
    METRO_Reports: {
      GET_METRO_SUMMARY: `${METRO_API_BASE_URL}v1/MetroReport/GetTransactionReportResult`,
      GET_METRO_BOOKING_DETAILS: `${METRO_API_BASE_URL}v1/MetroReport/GetBookingDetailsResult`,
      GET_METRO_PENDING_TRANSACTION_DETAILS: `${METRO_API_BASE_URL}v1/MetroReport/GetInprogressorFailedPaymentTxnResult`,
      GET_CUMULATIVE_METRO_BOOKINGS: `${METRO_API_BASE_URL}v1/MetroReport/GetDateWiseBookingsCumulative`,
      ADD_INITIAT_PAYMENT: `${METRO_API_Plain_BASE_URL}v1/MetroConsolidation/xxx---InititatePayment---xxx`,
      REFRESH_BUTTON: `${METRO_API_Plain_BASE_URL}v1/MetroConsolidation/PaymentInquiry`,
      UPDATE_PAYMENT_SETTLEMENT: `${METRO_API_BASE_URL}v1/PaymentTransaction/UpdateSettlmentPayment`,
      ADD_PAYMENT_SETTLEMENT: `${METRO_API_BASE_URL}v1/PaymentTransaction/AddVerifySettlementAmount`,
    },
    PARK_BANK_PAYMENT: {
      PAYMENT_VERIFY: `${API_BASE_URL}PaymentTransaction/AddVerifySettlementAmount`,
      PAYMENT_INITIAT: `${PAYNOW_API_BASE_URL}v1/ParkConsolidation/InititateParkPayment`,
      PAYMENT_REFRESH: `${PAYNOW_API_BASE_URL}v1/ParkConsolidation/ParkPaymentInquiry`,
    },
    RTC_REPORTS: {
      GET_DAY_PASS: `${RTC_API_BASE_URL}RTCDashboard/GetOneDayPassApplicationDetails`,
      GET_ORDINARY_PASS: `${RTC_API_BASE_URL}RTCDashboard/GetGBTOrdinaryApplicationDetails`,
      GET_MTS_PASS: `${RTC_API_BASE_URL}RTCDashboard/GetGBTMstApplicationDetails`,
      GET_EXPRESS_PASS: `${RTC_API_BASE_URL}RTCDashboard/GetGBTExpressApplicationDetails`,
      GET_STUDENT_PASS: `${RTC_API_BASE_URL}RTCDashboard/GetGBTStudentApplicationDetails`,
      GET_PENDING_PASS: `${RTC_API_BASE_URL}RTCDashboard/GetGBTStudentPendingApplicationDetails`,
      UPDATE_PASS_STATUS: `${RTC_API_BASE_URL}RTCDashboard/updateStudentApplicationStatus`,
      USER_REPORT:{
      GET_BUSSPASS_USER_OUTER_REPORT:`${RTC_API_BASE_URL}RTCDashboard/UserOuterReport`,
      GET_BUSSPASS_USER_INNER_REPORT:`${RTC_API_BASE_URL}RTCDashboard/UserInnerReport`,
      },
      REFUND_TRANSACTIONS_REPORT:{
        GET_REFUND_TRANSACTIONS_REPORT: `${RTC_API_BASE_URL}BusPassDashboard/RefundDashboard`,
        GET_REFUND_TRANSACTIONS_INNER_REPORT: `${RTC_API_BASE_URL}BusPassDashboard/RefundInnerReport`,
        GET_INITIATE_REFUND_BY_ORDER_ID: `${RTC_API_BASE_URL}RTCDashboard/RefundInitiate`,
      },
      RTC_TOTAL_TRANSACTIONS_REPORT:{
        GET_RTC_TRANSACTIONS_BY_REASON: `${RTC_API_BASE_URL}RTCDashboard/TotalTransactionOuterReport`,
        GET_RTC_TOTAL_TRANSACTIONS: `${RTC_API_BASE_URL}RTCDashboard/TotalTransactionInnerReport`,
        GET_RTC_OTHER_REASON_PIE_CHART: `${RTC_API_BASE_URL}RTCDashboard/FailureDueToOtherReasonsReport`,
        GET_RTC_GATEWAY_PIE_CHART: `${RTC_API_BASE_URL}RTCDashboard/FailureFromGatewayReport`,
        GET_RTC_TICKET_NOT_GENERATED_PIE_CHART: `${RTC_API_BASE_URL}RTCDashboard/PaymentSuccessButNotGeneratedReport`,
        GET_RTC_TRACK_ORDER: `${RTC_API_BASE_URL}RTCDashboard/TransactionOrderTrackingReport`,
        GET_BUS_PASS_VERIFY_STATUS: `${RTC_API_BASE_URL}RTCDashboard/OrderStatusCall`,
        GET_BUS_PASS_GENERATE_TICKET_NEW_PASS: `${RTC_BUS_PASS_API_BASE_URL}API/InsertGeneralPassData`,
        GET_BUS_PASS_GENERATE_TICKET_RENEWAL: `${RTC_BUS_PASS_API_BASE_URL}API/RenewalInitiate`,
        GET_BUS_PASS_INITIATE_REFUND: `${RTC_API_BASE_URL}RTCDashboard/RefundInitiate`,
        GET_VIEW_BUS_PASS: `${RTC_BUS_PASS_API_BASE_URL}API/GetTicketDetailsForWeb`,
        GET_BUS_PASS_BOOKING_RECORDS: `${RTC_API_BASE_URL}RTCDashboard/GetBookingDetailsOuterReport`,
      },
      INTERCITY_REPORTS:{
        GET_INTERCITY_PAYMENT_TRANSACTION_REPORT:`${RTC_API_BASE_URL}RTCDashboard/PaymentTransactionsReport`,
        GET_INTERCITY_VERIFY_STATUS:`${RTC_API_BASE_URL}RTCDashboard/VerifyStatus`,
        GET_INTERCITY_REGENERATE_TICKET:`${RTC_API_BASE_URL}RTCDashboard/GenerateTicket`,
        GET_INTERCITY_PAYMENT_TRANSACTION_REFUND:`${RTC_API_BASE_URL}RTCDashboard/InitiateRefund`,

        GET_INTERCITY_TOTAL_TRANSACTIONS:`${RTC_INTERCITY_API_BASE_URL}Reports/GetTotalTransactionOuterReport`,
        GET_INTERCITY_PAYMENTS_SUCCESS_BUT_TICKET_NOT_GENERATED:`${RTC_INTERCITY_API_BASE_URL}Reports/GetPaymentSuccessButNotGeneratedSubCategoryReport`,
        GET_INTERCITY_TOTAL_TRANSACTIONS_REPORT:`${RTC_INTERCITY_API_BASE_URL}Reports/GetTotalTransactionInnerReport`,
        GET_INTERCITY_PAYMENT_FAILED_GATEWAY:`${RTC_INTERCITY_API_BASE_URL}Reports/GetFailureFromGatewaySubCategoryReport`,
        GET_INTERCITY_PAYMENT_FAILED_OTHER_REASONS:`${RTC_INTERCITY_API_BASE_URL}Reports/GetFailureDueToOtherReasons`,
        GET_INTERCITY_TICKET_VIEW:`${RTC_INTERCITY_API_BASE_URL}Bookings/TicketPreview`,
        GET_INTERCITY_INDIVIDUAL_REPORT:`${RTC_INTERCITY_API_BASE_URL}Reports/GetIndividualReport`,
        GET_INTERCITY_CONSOLIDATED_REPORT:`${RTC_INTERCITY_API_BASE_URL}Reports/GetConsolidatedReport`,
        GET_INTERCITY_BUS_TYPES:`${RTC_INTERCITY_API_BASE_URL}MasterDetails/GetAllBusTypes`,
        GET_INTERCITY_SEAT_LAYOUTS:`${RTC_INTERCITY_API_BASE_URL}MasterDetails/GetAllSeatLayoutTypes`,
        
      }
    },
    GRIVEANCE_REPORTS: {
      GET_OVERALL_REPORT: `${GRIEVANCE_API_BASE_URL}GrievanceDashboard/GetTicketDetails`,
      GET_CONSOLIDATE_REPORT: `${GRIEVANCE_API_BASE_URL}GrievanceDashboard/TotalCountsByLocationCategory`,
      GET_INDIVIDUAL_REPORT: `${GRIEVANCE_API_BASE_URL}GrievanceTracking/GetIndividualDetails`,
      POST_COMMENT: `${GRIEVANCE_API_BASE_URL}GrievanceDashboard/AddMessageToWebChat`,
      UpdateStatus: `${GRIEVANCE_API_BASE_URL}GrievanceTracking/UpdateComplaintDetails`,
    },
    TOURISM_REPORTS: {
      GET_TOURISM_CONSOLIDATE_REPORT: `${TOURISM_API_BASE_URL}TourismReports/GetConsolidatedBookingReport`,
      GET_TOURISM_INDIVIDUAL_REPORT: `${TOURISM_API_BASE_URL}TourismReports/GetIndividualBookingsReport`,
      GET_TOURISM_PAYMENT_TRANSACTION_REPORT: `${TOURISM_API_BASE_URL}TourismReports/GetInprogressorFailedPaymentTxnResult`,
      GET_TOURISM_BANK_PAYMENT_REPORT: `${TOURISM_API_BASE_URL}TourismReports/GetBankPaymentsReport`,
    },
      MONTHLY_REPORTS: {
      GET_DEPARTMENT_ABSTRACT_REPORT: `${API_BASE_URL}DashBoard/GetDepartmentParkStats`,
      GET_LOCATION_CATEGORY_ABSTRACTREPORT: `${API_BASE_URL}DashBoard/GetEnityCategoryParkStats`,
      GET_DEPARTMENT_WISE_REPORT: `${API_BASE_URL}DashBoard/GetBookingSummaryByDepartmentStats`,
      GET_LOCATION_CATEGORY_WISE_REPORT: `${API_BASE_URL}DashBoard/GetBookingSummaryByEntityCategoryStats`,
      GET_LOCATION_WISE_REPORT: `${API_BASE_URL}DashBoard/GetLocationwiseBookingSummaryStats`,
    },
    USER_REPORTS: {
      GET_TRANSACTIONS_REPORTS: `${API_BASE_URL}UserTransactions/paymentSummaryReport`,
      GET_STATUS_TRANSACTIONS_REPORTS: `${API_BASE_URL}UserTransactions/paymentDetailedReport`,
    },
    USER_REPORTS: {
      GET_TRANSACTIONS_REPORTS: `${API_BASE_URL}UserTransactions/paymentSummaryReport`,
      GET_STATUS_TRANSACTIONS_REPORTS: `${API_BASE_URL}UserTransactions/paymentDetailedReport`,
      GET_USER_REPORT: `${API_BASE_URL}UserTransactions/GetAllUsers`,
      GET_USER_DETAILED_REPORT: `${API_BASE_URL}UserTransactions/GetUserTransactionReports`,
      GET_REFUND_TRANSACTIONS: `${API_BASE_URL}ParkReport/GetParkRefundSummaryFiltered`,
      GET_REFUND_TRANSACTIONS_REPORT: `${API_BASE_URL}ParkReport/GetParkRefundInnerReport`,
    },
    USER_TRANSACTIONS: {
      GET_PAYMENT_TRANSACTION_DETAILS_BY_STATUS_RESULT: `${API_BASE_URL}v3/AllPaymentTransactionAudit/GetPaymentTransactionDetailsByStatus_V2Result`,
    },
    FAILED_TRANSACTIONS: {
      GET_FAILURE_INNER_REPORTS: `${API_BASE_URL}v3/AllPaymentTransactionAudit/GetFailureDashboardInnerReport`,
    },
  },
  ENTITIES: {
    DOWNLOAD_FILE: `${API_BASE_URL}Transaction/DownloadQRCodeByParkId`,
  },
  DASHBOARD: {
    GET_DASHBOARD_COUNTS: `${API_BASE_URL}v2/DashBoard/GetTotalBookingCount`,
    GET_METRO_DASHBOARD_COUNT: `${METRO_API_BASE_URL}v2/MetroReport/GetTotalBookingCount`,
    GET_ALL_BOOKINGS: `${API_BASE_URL}v3/Transaction/GetAllEntityBookingByFilters`,
    GET_ALL_NEHRU_COUNTER_BOOKINGS: `${API_BASE_URL}v3/Transaction/GetNehruCounterBookings`,
    GET_ALL_Facility_BOOKINGS: `${API_BASE_URL}ParkReport/GetBookingDetailsJSON`,
    GET_ALL_DAY_WISE_BOOKINGS: `${API_BASE_URL}ParkReport/GetFacilityDayWiseBookingSummaryReport`,
    GET_ALL_APPLICATION_WISE_BOOKINGS: `${API_BASE_URL}ParkReport/GetFacilityDayWiseReportWithBookingSource`,
    GET_ALL_DASHBOARD_DETAILED_REPORT: `${API_BASE_URL}ParkReport/GetZooParkDashboardDetails`,
    GET_ALL_PARK_BOOKINGS: `${API_BASE_URL}ParkReport/GetDetailedBookingsSummary`,
    GET_ALL_DEPARTMENT_BOOKINGS: `${API_BASE_URL}DashBoard/GetEnitywisedashBoardCount`,
    GET_BOOKINGS_BY_ROLE: `${API_BASE_URL}v2/DashBoard/GetTotalBookingCountByRole`,
    PIE_CHARTS: {
      GET_ENTITY_WISE_COUNTS: `${API_BASE_URL}v2/DashBoard/GetEntityWiseTotalBookings`,
    },
    GET_ZOO_PARK_DASHBOARD_COUNTS: `${API_BASE_URL}ParkReport/GetDashboardZooPark`,
    GET_ZOO_PARK_DASHBOARD_COUNTS_TICKET_WISE: `${API_BASE_URL}ParkReport/GetZooParkCounts`,
    GET_SALARJUNG_MUSEUM_DASHBOARD_COUNTS: `${API_BASE_URL}DashBoard/GetSalarjungMuseumDashBoardCount`,
  },
  RTC_DASHBOARD: {
    GET_OVER_ALL: `${RTC_API_BASE_URL}RTCDashboard/GetAdminDashboardReports`,
    GET_ALL_PASS_TYPE: `${RTC_API_BASE_URL}RTCDashboard/GetAdminDashboardAllPassesInfo`,
    GET_ALL_DASHBOARD_REPORT: `${RTC_API_BASE_URL}RTCDashboard/GetPassTransactionDetails`,
    GET_ALL_BUSPASSES: `${RTC_API_BASE_URL}RTCDashboard/GetAllBusPasses`,
    GET_BUSPASS_DASHBOARD: `${RTC_API_BASE_URL}BusPassDashboard/GetBusPassDashboard`,
  },
  TOURSIM_DASHBOARD: {
    GET_PACKAGE_CATEGORY_COUNTS: `${TOURISM_API_BASE_URL}TourismReports/GetAllCategories`,
    GET_CATEGORY_WISE_TOTALCOUNTS: `${TOURISM_API_BASE_URL}TourismReports/GetCategoryWiseTotalBookings`,
    GET_PACKAGE_TYPE_WISE_BOOKINGS: `${TOURISM_API_BASE_URL}TourismReports/GetPackageTypeWiseBookingDetails`,
    GET_TRANSACTIONS_REPORTS: `${TOURISM_API_BASE_URL}TourismReports/GetTransactionsReport`,
  },

  AMRABAD:{
    MASTERS:{
       GET_PACKAGES_WITH_ROOMS: `${AMRABAD_API_BASE_URL}Master/GetPackagesWithRooms`,
       ADD_HOUSE:`${AMRABAD_API_BASE_URL}Master/AddNewRoom`,
       UPDATE_HOUSE:`${AMRABAD_API_BASE_URL}Master/UpdateRoom`,
       GET_ALL_PACKAGES:`${AMRABAD_API_BASE_URL}Master/GetAllPackages`,
       ADD_PACKAGE_WITH_ROOM:`${AMRABAD_API_BASE_URL}Master/AddPackageWithRoomsAndImages`,
       UPDATE_PACKAGE:`${AMRABAD_API_BASE_URL}Master/UpdatePackage`,
       GET_PACKAGES:`${AMRABAD_API_BASE_URL}Reports/GetAllPackages`,
       GET_HOUSES:`${AMRABAD_API_BASE_URL}Reports/GetAllRoomsByPackageId`,
       GET_COUNTRIES:`${AMRABAD_API_BASE_URL}Master/GetAllCountries`,
       GET_STATES:`${AMRABAD_API_BASE_URL}Master/GetAllStates`,
    },
    REPORTS:{
    GET_CONSOLIDATED_BOOKING_REPORT:`${AMRABAD_API_BASE_URL}Reports/GetConsolidatedBookingReportResult`,
    GET_INDIVIDUAL_BOOKING_REPORT:`${AMRABAD_API_BASE_URL}Reports/GetIndividualBookingDaywiseReportResult`,
    GET_PAYMENT_TRANSACTION_REPORT:`${AMRABAD_API_BASE_URL}Reports/PaymentTransactionsReport`,
    GET_INITIATE_REFUND:`${AMRABAD_API_BASE_URL}v1/PaymentTransaction/request`,
    GET_AMRABAD_VERIFY_STATUS:`${AMRABAD_API_BASE_URL}v1/PaymentTransaction/CheckOrderTransactionStatus`,
    GET_QR_BOOKING_DETAILS:`${AMRABAD_API_BASE_URL}BookingDetails/GetBookingWithQRDetails`,
    GET_USER_REPORT:`${AMRABAD_API_BASE_URL}Reports/GetAllUserBookingReport`,
    GET_USER_DETAILED_REPORT:`${AMRABAD_API_BASE_URL}Reports/GetAllUserDetailedBookingReport`,
    GET_TRANSACTION_TRACK_ORDER:`${AMRABAD_API_BASE_URL}Reports/GetTransactionTrackingStatusByOrderId`,
    //refund transaction report
    GET_REFUND_TRANSACTION_DASHBOARD:`${AMRABAD_API_BASE_URL}Reports/RefundTransactionsDashboardReport`,
    GET_REFUND_TRANSACTION_REPORT:`${AMRABAD_API_BASE_URL}Reports/RefundTransactionsInnerReport`,
    GET_INITIATE_REFUND:`${AMRABAD_API_BASE_URL}v1/PaymentTransaction/request`,
    AMRABAD_REGENERATE_TICKET:`${AMRABAD_API_BASE_URL}WebBooking/RegenerateTicket`,
    AMRABAD_BOOKINGS:`${AMRABAD_API_BASE_URL}Reports/BookingsReport`,
    AMRABAD_HOUSE_WISE_REPORT:`${AMRABAD_API_BASE_URL}Reports/HousewiseReport`,
    AMRABAD_AVAILABILITY_INNER_REPORTS:`${AMRABAD_API_BASE_URL}Reports/AvailabilityInnerReport`,
    AMRABAD_AVAILABILITY_OUTER_REPORTS:`${AMRABAD_API_BASE_URL}Reports/GetAvailabilityOuterReport`,
    
    // Utility endpoints for filter options
    GET_AMRABAD_PACKAGE_OPTIONS:`${AMRABAD_API_BASE_URL}Master/GetPackageOptions`,
    GET_AMRABAD_HOUSE_OPTIONS:`${AMRABAD_API_BASE_URL}Master/GetHouseOptions`,
    GET_AMRABAD_PAYMENT_MODE_OPTIONS:`${AMRABAD_API_BASE_URL}Master/GetPaymentModeOptions`,
    GET_AMRABAD_BOOKING_SOURCE_OPTIONS:`${AMRABAD_API_BASE_URL}Master/GetBookingSourceOptions`,
    GET_AMRABAD_PAYMENT_STATUS_OPTIONS:`${AMRABAD_API_BASE_URL}Master/GetPaymentStatusOptions`,
    GET_AMRABAD_BOOKING_MODE_OPTIONS:`${AMRABAD_API_BASE_URL}Master/GetBookingModeOptions`,
    },
    DASHBOARD:{
      GET_AMRABAD_DASHBOARD:`${AMRABAD_API_BASE_URL}Reports/GetBookingDashboardSummary`,
      GET_AMRABAD_DASHBOARD_count:`${AMRABAD_API_BASE_URL}DashBoard/Dashboard`,
      GET_AMRABAD_DASHBOARD_BOOKINGS_SUMMARY:`${AMRABAD_API_BASE_URL}DashBoard/GetBookingsSummary`,
      GET_AMRABAD_DASHBOARD_PACKAGES_BY_ID:`${AMRABAD_API_BASE_URL}DashBoard/GetDashboardRoomBookingSummary`,
      GET_AMRABAD_DASHBOARD_BOOKINGS_FULL_SUMMARY:`${AMRABAD_API_BASE_URL}DashBoard/GetDashboardFullSummary`,

    },
    USER:{
      GET_USER_PACKAGES:`${AMRABAD_API_BASE_URL}WebBooking/GetAllPackages`,
      GET_ROOMS_BY_PACKAGE_ID:`${AMRABAD_API_BASE_URL}WebBooking/GetAllPackageRoomsByPackageId`,
      GET_PACKAGE_DETAIL:`${AMRABAD_API_BASE_URL}MobileApplication/GetPackageDetails`,
      GET_CART_ITEMS:`${AMRABAD_API_BASE_URL}WebBooking/GetAllCartDetails`,
      GET_CALENDAR:`${AMRABAD_API_BASE_URL}WebBooking/GetCalendar/30days`,
      GET_USER_BOOKING_HISTORY:`${AMRABAD_API_BASE_URL}WebBooking/GetBookingHistory`,
      ADD_TO_CART:`${AMRABAD_API_BASE_URL}WebBooking/AddToCart`,
      REMOVE_FROM_CART:`${AMRABAD_API_BASE_URL}WebBooking/DeleteCartItem`,
      CLEAR_CART:`${AMRABAD_API_BASE_URL}WebBooking/DeleteAllCartItems`,
      GET_TICKET_VIEW_DETAILS:`${AMRABAD_API_BASE_URL}WebBooking/ViewTicket`,
      INITIATE_TRANSACTION:`${AMRABAD_API_BASE_URL}v1/PaymentTransaction/IntiateTransactionforCard`,
      ORDER_STATUS_CALL:`${AMRABAD_API_BASE_URL}v1/PaymentTransaction/OrderStatusCall`,
      ADD_NEW_BOOKING_DETAILS:`${AMRABAD_API_BASE_URL}WebBooking/AddNewBookingDetails`,
      SAVE_CARD_PAYMENT_TRANSACTIONS:`${AMRABAD_API_BASE_URL}v1/PaymentTransaction/SaveCardPaymentTransactions`,
      CANCEL_TICKET:`${AMRABAD_API_BASE_URL}MobileApplication/CancellationBooking`,
      CANCEL_TICKET_WEB:`${AMRABAD_API_BASE_URL}WebBooking/UpdateBookingCancellation`,
    }
  },
  FAILED_TRANSACTIONS: {
    GET_ALL_PAYMENT_TRANSACTION_PIE_CHART: `${API_BASE_URL}v3/AllPaymentTransactionAudit/GetPaymentTransactionPieChartData`,
    GET_SUCCESS_BUT_NOT_CONFIRMED_PIE_CHART: `${API_BASE_URL}v3/AllPaymentTransactionAudit/GetSuccessButNotConfirmedPieChart`,
    GET_TRANSACTION_TRACKING_STATUS: `${API_BASE_URL}v3/AllPaymentTransactionAudit/GetTransactionTrackingStatusByOrderId-Updated`,
    GET_FAILED_TRANSACTIONS_BY_REASON: `${API_BASE_URL}AdminDashBoardController/GetFailedTransactionsByReasonPercentage`,
    GET_FAILED_TRANSACTIONS_BY_LOCATION: `${API_BASE_URL}AdminDashBoardController/GetFailedTransactionsByLocationPercentage`,
    GET_FAILED_TRANSACTIONS_BY_LOCATION_CATEGORY: `${API_BASE_URL}AdminDashBoardController/GetFailedTransactionsByLocationCategoryPercentage`,
    GET_FAILED_TRANSACTIONS_BY_DEPARTMENT: `${API_BASE_URL}AdminDashBoardController/GetFailedTransactionsByDepartmentPercentage`,
    GET_FAILED_TRANSACTIONS_TREND_GRAPH: `${API_BASE_URL}AdminDashBoardController/GetFailedTransactionsTrendGraph`,
    GET_PAYMENT_TRANSACTION_SUMMARY_PIE_CHART: `${API_BASE_URL}v3/AllPaymentTransactionAudit/GetPaymentTransactionSummaryByFailureDetail_V3`,
    GET_PAYMENT_FAILED_TRANSACTION_SUMMARY_PIE_CHART: `${API_BASE_URL}v3/AllPaymentTransactionAudit/GetFailureDueToOtherReasons_SubCategoryReportResult`,
    GET_TICKET_NOT_GENERATED_TRANSACTION_SUMMARY_PIE_CHART: `${API_BASE_URL}v3/AllPaymentTransactionAudit/GetPaymentSuccessButNotGenerated_SubCategoryReportResult`,

    GET_PAYMENT_FAILED_GATEWAY_TRANSACTION_SUMMARY_PIE_CHART: `${API_BASE_URL}v3/AllPaymentTransactionAudit/GetFailureFromGateway_SubCategoryReportResult`,
    
    INITIATE_REFUND: `${API_BASE_URL}Transaction/InitiateParkRefund`,
  },
  METRO_TRANSACTIONS_REPORT: {
    GET_METRO_TRANSACTIONS_BY_REASON: `${METRO_API_BASE_URL}v1/MetroReport/GetPaymentTotalTransactionSummary`,
    GET_METRO_TOTAL_TRANSACTIONS: `${METRO_API_BASE_URL}v1/MetroReport/GetMetroPaymentTransactionInnerDetails`,
    GET_OTHER_REASON_PIE_CHART: `${METRO_API_BASE_URL}v1/MetroReport/GetFailureDueToOtherReasons_SubCategoryReportResult`,
    GET_GATEWAY_PIE_CHART: `${METRO_API_BASE_URL}v1/MetroReport/GetFailureFromGateway_SubCategoryReportResult`,
    GET_TICKET_NOT_GENERATED_PIE_CHART: `${METRO_API_BASE_URL}v1/MetroReport/GetPaymentSuccessButNotGenerated_SubCategoryReportResult`,
    METRO_USER_TRANSACTIONS_REPORT:{
    GET_METRO_USER_REPORT:`${METRO_API_BASE_URL}v1/BookingDetails/GetAllUsers`,
    GET_USER_TRANSACTION_DETAILS:`${METRO_API_BASE_URL}v1/MetroReport/GetUserTransactionDetails`,
    GET_METRO_TRANSACTION_TRACKING_STATUS: `${METRO_API_BASE_URL}v1/MetroReport/GetMetroTransactionTrackingStatusByOrderId`,
    GET_METRO_REFUND_TRANSACTIONS_REPORT: `${METRO_API_BASE_URL}v1/MetroReport/GetParkRefundSummaryOuterReport`,
    GET_METRO_REFUND_TRANSACTIONS_INNER_REPORT: `${METRO_API_BASE_URL}v1/MetroReport/GetParkRefundInnerReport`,
    }
  },
  AMRABAD_TRANSACTIONS_REPORT:{
    GET_AMRABAD_TRANSACTIONS_BY_REASON: `${AMRABAD_API_BASE_URL}Reports/PaymentTransactionSummaryByFailureDetail`,
    GET_AMRABAD_GATEWAY_PIE_CHART: `${AMRABAD_API_BASE_URL}Reports/GetFailureFromGateway_SubCategoryReportResult`,
    GET_AMRABAD_TICKET_NOT_GENERATED_PIE_CHART: `${AMRABAD_API_BASE_URL}Reports/GetPaymentSuccessButNotGenerated_SubCategoryReportResult`,
    GET_AMRABAD_OTHER_REASON_PIE_CHART: `${AMRABAD_API_BASE_URL}Reports/GetFailureDueToOtherReasons_SubCategoryReportResult`,
    
    //total transaction report
    GET_AMRABAD_TOTAL_TRANSACTION_STATUS:`${AMRABAD_API_BASE_URL}Reports/GetPaymentTransactionDetailsByStatus`,
  },
  INTERCITY:{
  MASTERS:{
  GET_DESTINATION_CITIES:`${RTC_INTERCITY_API_BASE_URL}MasterDetails/GetAllCities`,
  },
  REPORTS:{
   GET_REFUND_TRANSACTION_DASHBOARD:`${RTC_INTERCITY_API_BASE_URL}Reports/RefundDashboard`,
   GET_REFUND_TRANSACTION_INNER_REPORT:`${RTC_INTERCITY_API_BASE_URL}Reports/RefundInnerReport`,
   //user report
   GET_USER_REPORT:`${RTC_INTERCITY_API_BASE_URL}Reports/GetUserOuterReport`,
   GET_USER_DETAILED_REPORT:`${RTC_INTERCITY_API_BASE_URL}Reports/RefundInnerReport`,
   GET_USER_REPORT_TRACK_ORDER:`${RTC_INTERCITY_API_BASE_URL}Reports/GetPaymentTransactionTrackingStatus`,
  // payment transactions
  GET_PAYMENT_TRANSACTION_REPORT:`${RTC_INTERCITY_API_BASE_URL}Reports/GetPaymentTransactionsReport`
  },
  },
};
