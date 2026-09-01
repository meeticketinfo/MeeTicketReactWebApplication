

// super admin permissions
export const superAdminPermissions = [
  "dashboard",
  "departments",
  "entity-types",
  "entities",
  // "entity-admins",
  // "facility/unified-create",
  "nodal-officer",
  // "department-admin",
  "entity-bookings",
  "super-admin-facilites",
  "transaction-report",
  "completed-bookings",
  "payment-transaction-report",
  "booking-details",
  "pending-transaction-details",
  "bank-transactions",
  "metro-cumulative-bookings",
  "Grievance-consolidate",
  "Grievance-Incident",
  // "Grievance-individual",
  // "tourism-consolidate",
  // "tourism-payment-transaction",
  // "tourism-individual",
  // "toursim-bank-payments",
  "user-transaction",
  "transactions-dashboard",
  "total-transactions-dashboard",
  "user-report",
  "refund-transactions",
  "metro-total-transaction",
  "metro-user-report",
  "metro-user-detailed-report",
  "metro-refund-transactions",
  "bus-pass-user-report",
  "bus-pass-total-transaction",
  "bus-pass-booking-report",
  "bus-pass-refund-report",
  "bus-pass-sales-statement-report",
  "bus-pass-settlement-summary-report",
  "monthly-reports",
  "banner",
  "pos-reports",
  "intercity-settlement-summary-report",
  "intercity-consolidated-report",
  "intercity-individual-report",
  "intercity-total-transaction",
  "intercity-user-report",
  "intercity-refund-report",
  "intercity-payment-transactions",
  "current-consolidated-report",
  "current-individual-report",
  "current-payment-transactions",
  "current-refund-report",
  "android-ios-entries",
];

// ESD TECH
export const EsdTech = [
  "dashboard",
  "Grievance-consolidate",
  "Grievance-Incident",
  "bus-pass-user-report",
  "bus-pass-total-transaction",
  "bus-pass-booking-report",
  "bus-pass-refund-report",
  "bus-pass-settlement-summary-report",
  // "pending-pass",
  "intercity-settlement-summary-report",
  "intercity-consolidated-report",
  "intercity-individual-report",
  "intercity-total-transaction",
  "intercity-user-report",
  "intercity-refund-report",
  "intercity-payment-transactions",
  "current-consolidated-report",
  "current-individual-report",
  "current-payment-transactions",
  "current-refund-report",
];

// department
export const Department = [
  "dashboard",
  "entity-bookings",

  "completed-bookings",
  "payment-transaction-report",
  "total-transactions-dashboard",
  "user-report",
  "refund-transactions",
];

 // park admin permissions
export const parkAdminPermissions = [
  "dashboard",
  //
  // "facilites",
  // "service",
  // "service-varient",
  "gate-keepers",
  "bookings",
  "facility-services",
  "holidays",
 
  "entity-bookings",
  "facility/unified-create",
  "completed-bookings",
  "walkers-pass-report",
  "walkers-pass-summary-report",
  "payment-transaction-report",
  // "Grievance-consolidate",
  "Grievance-Incident",
  // "Grievance-individual",
  // "pos-admin",
  // "facility-holidays",
  "pos-reports",
  // "add-language",
  // "group-details",
];

// custom park admin permissions
export const CustomParkAdminPermissions = [
  "dashboard",
  "gate-keepers",
  "bookings",
  "facility-services",
  "holidays",
  "entity-bookings",
  "facility/unified-create",
  "completed-bookings",
  "payment-transaction-report",
  // "Grievance-consolidate",
  "Grievance-Incident",
  // "Grievance-individual",
  "facility-bookings",
  "application-day-wise-bookings",
  "day-wise-bookings",
  "pos-reports",
];

// botanical garden park admin permissions
export const BotanicalGardenParkAdminPermissions = [
  "dashboard",
  "bookings",
  "facility-services",
  "entity-bookings",
  "completed-bookings",
  "payment-transaction-report",
  "walkers-pass-report",
  "walkers-pass-summary-report",
  "book-tickets",
];



// nodal officer permissions
export const nodalOfficerPermissions = [
  "dashboard",
  "entities",
  "entity-admins",
  "entity-bookings",
  // "Grievance-consolidate",
  "Grievance-Incident",
  // "Grievance-individual",
];

// metro reports
export const MetroReports = [
  "dashboard",
  "summary-report",
  "transaction-report",
  "booking-details",
  "pending-transaction-details",
  "transaction-general-report",
  // "Grievance-consolidate",
  "Grievance-Incident",
];

// nehru zoo park
export const NehruZooPark = [
  "dashboard",
  // "entity-bookings",
  // "completed-bookings",
  // "payment-transaction-report",
  "pos-consolidated-booking-reports",
  "pos-individual-booking-reports",
  "pos-payment-transactions-reports",
  "book-tickets",
  // "Grievance-consolidate",
  "Grievance-Incident",
];

// support admin
export const SupportAdmin = [
  "entity-bookings",
  "completed-bookings",
  "payment-transaction-report",
  "transaction-report",
  "booking-details",
  "pending-transaction-details",
  "Grievance-consolidate",
  "Grievance-Incident",
];
// rtc admin
export const RtcAdmin = [
  "dashboard",
  "bus-pass-user-report",
  "bus-pass-total-transaction",
  "bus-pass-booking-report",
  "bus-pass-refund-report",
  "bus-pass-sales-statement-report",
  "bus-pass-settlement-summary-report",
  // "pending-pass",
  "intercity-settlement-summary-report",
  "intercity-consolidated-report",
  "intercity-individual-report",
  "intercity-total-transaction",
  "intercity-user-report",
  "intercity-refund-report",
  "intercity-payment-transactions",
  "current-consolidated-report",
  "current-individual-report",
  "current-payment-transactions",
  "current-refund-report",
  "add-intercity-cities"
 
];

// toursim
export const Toursim = [
  "dashboard",
  "tourism-consolidate",
  "tourism-payment-transaction",
  "tourism-individual",
  "toursim-bank-payments",
];

// amrabad
export const Amrabad = [
  "dashboard",
  "amrabad-packages",
  "amrabad-booking-reports",
  "amrabad-house-wise-reports",
  "amrabad-payment-transactions",
  "amrabad-availability-report",
  "amrabad-user-report",
  "amrabad-refund-transaction-report",
  "amarabad-total-transaction",
  "pos-reports",
];

export const ROLE_FOREST_DEPT_ADMIN = "Role_ForestDeptAdmin";

export const ForestDeptAdmin = [
  "dashboard",
  // Masters
  "departments",
  "entity-types",
  "nodal-officer",
  "entities",
  "super-admin-facilites",
  // Bookings Reports
  "completed-bookings",
  "entity-bookings",
  // "payment-transaction-report",
  // "bank-transactions",
  "total-transactions-dashboard",
  "refund-transactions",
  // Grievance
  "Grievance-consolidate",
  "Grievance-Incident",
];