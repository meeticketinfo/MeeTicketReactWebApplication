import Dashboard from "../pages/Dashboard";
import AdminUsers from "../pages/admin/users/AdminUsers";
import AdminParks from "../pages/admin/parks/AdminParks";
import AdminFacilities from "../pages/admin/facilities/AdminFacilities";
import AdminUsersTable from "../pages/admin/users/AdminUserTable";
import WorkingDays from "../pages/admin/working_days/WorkingDays";
import Holidays from "../pages/admin/holidays/Holidays";
import Login from "../auth/login/Login";
import ServiceVariant from "../pages/admin/service_varient/serviceVarient";
import EntryScanUsers from "../pages/admin/entry_Scan_users/EntryScanUsers";
import Payments from "../pages/admin/payments/Payments";
import Services from "../pages/admin/services/services";
import AdminBookings from "../pages/admin/bookings/Bookings";
import ProtectedRoute from "./ProtectedRoute";
import BookTickets from "../pages/admin/BookTickets/BookTickets";
import GateKeepers from "../pages/park_admin/users/GateKeepers";
import MyProfile from "../pages/MyProfile/MyProfile";
import BookingDetails from "../pages/admin/BookTickets/BookingDetails";
import DepartmentList from "../components/department_management/DepartmentList";
import Departments from "../pages/admin/departments/Departments";
import EntityTypeList from "../components/entity_type_management/EntityTypeList";
import EntityTypes from "../pages/admin/entity_types/EntityTypes";
import NodalOfficer from "../pages/admin/nodal_officer/NodalOfficer";
import RTCBookings from "../pages/admin/rtc_bookings/RtcBooking";
import MetroBookings from "../pages/admin/metro_bookings/Metrobookings";
import NotFound from "../pages/Error/NotFound";
import EntitiesDetails from "../pages/admin/parks/EntitiesDetails";
import ServiceUnifiedCreator from "../components/facilities_management/ServiceUnifiedCreator";
import UnifiedCreate from "../pages/admin/facilities/UnifiedCreate";
import SuperAdminFacilities from "../pages/admin/admin_facilities/SuperAdminFacilities";
import Unauthorized from "../pages/Error/Unauthorized";
import MobileBookingDetails from "../components/bookings_management/MobileBookingDetails";
import DownloadApks from "../components/mobile_apks/DownloadApks";
import SummaryReport from "../components/metro_reports/summary/SummaryReport";
import TrasactionReport from "../components/metro_reports/transaction/TrasactionReport";
import TermsAndConditions from "../components/terms_and_conditions_privacy_policy/termsAndConditions";
import PrivacyPolicy from "../components/terms_and_conditions_privacy_policy/privacyPolicy";
import AuthRoute from "./AuthRoute ";
import TransactionGeneralReport from "../components/metro_reports/transaction/TransactionGeneralReport";
import CompleteBookings from "../pages/admin/BookTickets/CompletedBookings";
import PaymentTransactionReport from "../pages/admin/BookTickets/PaymentTransactionReport";
import Support from "../pages/admin/support/Support";
import MetroBookingDetails from "../components/metro_reports/bookingdetails/MetroBookingDetails";
import MetroPendingTransactionDetails from "../components/metro_reports/pendingTransactions/MetroPendingTransactions";
import FacilityBookings from "../pages/admin/BookTickets/FacilityBookings";
import BankTransactions from "../pages/admin/BookTickets/BankTransactions";
import MetroCumulativeBookings from "../components/metro_reports/cumulativeBookings/MetroCumulativeBookings";
import CustomBookTickets from "../pages/admin/BookTickets/CustomBookTickets";
import GrievanceConsolidateReportList from "../components/grievance/grievance_consolidate/GrievanceConsolidateReportList";
import GrievanceConsolidateReport from "../components/grievance/grievance_consolidate/GrievanceConsolidateReport";
import GrievanceIncident from "../components/grievance/grievance_incident/GrievanceIncident";
import GrievanceIndividualReport from "../components/grievance/grievance_individual/GrievanceIndividualReport";
import BankPaymentReport from "../components/tourism/bank_payment/BankPaymentReport";
import IndividualReport from "../components/tourism/individual/IndividualReport";
import Consolidate_Report from "../components/tourism/consolidate/Consolidate_Report";
import TourismPaymentTransactionReport from "../components/tourism/payment_transaction/TourismPaymentTransactionReport";
import DayPassReport from "../components/rtc/rtc_reports/day_pass/DayPassReport";
import OrdinaryPassReport from "../components/rtc/rtc_reports/ordinary_pass/OrdinaryPassReport";
import MstPassReport from "../components/rtc/rtc_reports/mst_pass/MstPassReport";
import ExpressPassReport from "../components/rtc/rtc_reports/express_pass/ExpressPassReport";
import StudentPass from "../components/rtc/rtc_reports/student_pass/StudentPass";
import PendingPassesReport from "../components/rtc/rtc_reports/pending_passes/PendingPassesReport";
import DashBoardDetailed from "../pages/DashBoardDetailed/DashBoardDetailed";
import PosConfirmation from "../components/bookings_management/PosConfirmation";
import DayWiseBookings from "../pages/admin/BookTickets/DayWiseBookings";
import ApplicationDayWiseBookings from "../pages/admin/BookTickets/ApplicationDayWiseBookings";
import UserTransactionReport from "../components/payments_management/UserTransactionReport";
import UserStatusTransactionReport from "../components/payments_management/UserStatusTransactionReport";
import { PrivacyPolicyMeeticketApp } from "../components/terms_and_conditions_privacy_policy/PrivacyPolicyMeeticketApp";
import MainPackages from "../pages/amrabad/masters/packages/MainPackages";
import HouseCreate from "../pages/amrabad/masters/packages/HouseCreate";
import AmrabadConsolidatedReports from "../pages/amrabad/amrabad_reports/amrabad_consolidated/AmrabadConsolidatedReports";
import AmrabadIndividualReports from "../pages/amrabad/amrabad_reports/amrabad_individual/AmrabadIndividualReports";
import AmrabadPaymentTransactionsReport from "../pages/amrabad/amrabad_reports/amrabad_payment_transactions/AmrabadPaymentTransactionsReport";
import AmrabadConsolidatedBookingDetails from "../pages/amrabad/amrabad_reports/amrabad_consolidated/AmrabadConsolidatedBookingDetails";
import TransactionsDashboard from "../pages/admin/userFailedTransactions/dashboard/MainTransactionsDashboard";
import FailedTransactions from "../pages/admin/userFailedTransactions/reports/FailedTransactions";
import Packages from "../pages/amrabad/user/packages/Packages";
import Houses from "../pages/amrabad/user/houses/Houses";
import AmarabadLogin from "../pages/amrabad/user/amarabadLogin/amarabadLogin";
import AmarabadRegister from "../pages/amrabad/user/amarabadRegister/AmarabadRegister";
import AmrabadProtectRoute from "./AmrabadProtectRoute";
import AmrabadAuthRoute from "./AmrabadAuthRoute";
import AmrabadTest from "../pages/amrabad/user/test/AmrabadTest";

import AmrabadForgetPinMobileNumber from "../pages/amrabad/user/amarabadLogin/AmrabadForgetPinMobileNumber";
import AmrabadResetPin from "../pages/amrabad/user/amarabadLogin/AmrabadResetPin";

import AmarabadRegisterOtp from "../pages/amrabad/user/amarabadRegister/AmarabadRegisterOtp";
import ResetPinOtp from "../pages/amrabad/user/amrabadOtp/ResetPinOtp";
import PackageDetail from "../pages/amrabad/user/packages/PackageDetail";
import MainTotalTransactions from "../pages/admin/users/total_transaction/dashboard/MainTotalTransactions";
import TransactionsOrderTracker from "../pages/admin/userFailedTransactions/reports/TransactionsOrderTracker";
import PosConsolidatedBookingReports from "../pages/admin/BookTickets/pos_reports/PosConsolidatedBookingReports";
import PosIndividualBookingReports from "../pages/admin/BookTickets/pos_reports/PosIndividualBookingReports";
import PosPaymentTransactionsReport from "../pages/admin/BookTickets/pos_reports/PosPaymentTransactionsReport";
import TotalPaymentTransactionReport from "../pages/admin/users/total_payment_transaction-report/TotalPaymentTransactionReport";
import UserReport from "../pages/admin/users/user_report/UserReport";
import UserDetailedReport from "../pages/admin/users/user_detailed_report/UserDetailedReport";
import MainRefundTransactions from "../pages/admin/users/refund_transactions/dashboard/MainRefundTransactions";
import RefundTransactionsReport from "../pages/admin/users/refund_transactions_report/RefundTransactionsReport";
import UserTransactionsOrderTracker from "../pages/admin/users/user_detailed_report/UserTransactionsOrderTracker";
import TotalPaymentTransactionOrderTracker from "../pages/admin/users/total_payment_transaction-report/TotalPaymentTransactionOrderTracker";
import MainTotalFailedTransactions from "../pages/admin/users/total_failed_transaction/dashboard/MainTotalFailedTransactions";
import MainTotalTicketNotGeneratedTransactions from "../pages/admin/users/total_ticket_not_generated_transaction/dashboard/MainTotalTicketNotGeneratedTransactions";
import TotalFailedPaymentTransactionReport from "../pages/admin/users/total_failed_payment_transaction_report/TotalFailedPaymentTransactionReport";
import TotalFailedPaymentTransactionOrderTracker from "../pages/admin/users/total_failed_payment_transaction_report/TotalFailedPaymentTransactionOrderTracker";
import TotalTicketNotGeneratedPaymentTransactionOrderTracker from "../pages/admin/users/total_ticket_not_generated_payment_transaction_report/TotalTicketNotGeneratedPaymentTransactionOrderTracker";
import TotalTicketNotGeneratedPaymentTransactionReport from "../pages/admin/users/total_ticket_not_generated_payment_transaction_report/TotalTicketNotGeneratedPaymentTransactionReport";
import OuterTotalTransactionReport from "../pages/metro_transaction_reports/metro_total_transactions/outer_report/OuterTotalTransactionReport";
import MainTotalTransactionReport from "../pages/metro_transaction_reports/metro_total_transactions/MainTotalTransactionReport";
import MetroTotalReport from "../pages/metro_transaction_reports/metro_total_transactions/MetroTotalReport";
import FailedOtherReason from "../pages/metro_transaction_reports/metro_total_transactions/innerReasonsDashboard/failed_other_reason/FailedOtherReason";
import MetroFailedGateway from "../pages/metro_transaction_reports/metro_total_transactions/innerReasonsDashboard/metro_failed_gateway/MetroFailedGateway";
import MetroNotGenerated from "../pages/metro_transaction_reports/metro_total_transactions/innerReasonsDashboard/metro_not_generated/MetroNotGenerated";
import FailedOtherReasonReport from "../pages/metro_transaction_reports/metro_total_transactions/innerReasonsDashboard/failed_other_reason/FailedOtherReasonReport";
import MetroNotGeneratedReport from "../pages/metro_transaction_reports/metro_total_transactions/innerReasonsDashboard/metro_not_generated/MetroNotGeneratedReport";
import MetroFailedGatewayReport from "../pages/metro_transaction_reports/metro_total_transactions/innerReasonsDashboard/metro_failed_gateway/MetroFailedGatewayReport";
import MainTotalFailedGatewayTransactions from "../pages/admin/users/total_failed_payment_gateway_transaction/dashboard/MainTotalFailedGatewayTransactions";
import TotalFailedGatewayTransactionReport from "../pages/admin/users/total_failed_payment_gateway_transaction/report/TotalFailedGatewayTransactionReport";
import TotalFailedGatewayTransactionOrderTracker from "../pages/admin/users/total_failed_payment_gateway_transaction/report/TotalFailedGatewayTransactionOrderTracker";
import MetroTotalTracker from "../pages/metro_transaction_reports/metro_total_transactions/metro_track_order/MetroTotalTracker";
import MetroUserReport from "../pages/metro_transaction_reports/metro_user/metro_user_report/MetroUserReport";
import MetroUserDetailedReport from "../pages/metro_transaction_reports/metro_user/metro_user_detailed_report/MetroUserDetailedReport";
import MetroUserTransactionsOrderTracker from "../pages/metro_transaction_reports/metro_user/metro_user_detailed_report/MetroUserTransactionsOrderTracker";
import MainMetroRefundTransactions from "../pages/metro_transaction_reports/metro_refunds/dashboard/MainMetroRefundTransactions";
import MetroRefundTransactionsReport from "../pages/metro_transaction_reports/metro_refunds/metro_refund_transactions_report/MetroRefundTransactionsReport";
import BookNow from "../pages/amrabad/user/bookNow/bookNow";
import CheckoutDetails from "../pages/amrabad/user/checkoutDetails/checkoutDetails";
import AmarabadBookingDetails from "../pages/amrabad/user/bookingDetails/bookingDetails";
import ConfirmedDetails from "../pages/amrabad/user/confirmedDetails/confirmedDetails";
import BookingHistory from "../pages/amrabad/user/bookingHistory/BookingHistory";
import AmrabadAvailabilityMain from "../pages/amrabad/amrabad_reports/availabilityReports/amrabadAvailabilityMain";

export const routes = [
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/",
    element: <AuthRoute element={<Login />} />,
  },
  { path: "/dashboard", element: <ProtectedRoute element={<Dashboard />} /> },

  // dashboard detailed report

  {
    path: "/dashboard-detailed-report",
    element: <ProtectedRoute element={<DashBoardDetailed />} />,
  },
  {
    path: "/entities",
    element: <ProtectedRoute element={<AdminParks />} />,
  },
  { path: "/entities/view-details/:id", element: <EntitiesDetails /> },
  {
    path: "/user-management/add",
    element: <ProtectedRoute element={<AdminUsers />} />,
  },
  {
    path: "/bookings",
    element: <ProtectedRoute element={<AdminBookings />} />,
  },
  {
    path: "/transaction-report",
    element: <ProtectedRoute element={<SummaryReport />} />,
  },

  {
    path: "/booking-details",
    element: <ProtectedRoute element={<MetroBookingDetails />} />,
  },

  {
    path: "/pending-transaction-details",
    element: <ProtectedRoute element={<MetroPendingTransactionDetails />} />,
  },

  {
    path: "/transaction-general-report",
    element: <ProtectedRoute element={<TransactionGeneralReport />} />,
  },
  {
    path: "/summary-report",
    element: <ProtectedRoute element={<TrasactionReport />} />,
  },

  {
    path: "/rtc-bookings",
    element: <ProtectedRoute element={<RTCBookings />} />,
  },
  {
    path: "/metro-bookings",
    element: <ProtectedRoute element={<MetroBookings />} />,
  },
  {
    path: "/metro-cumulative-bookings",
    element: <ProtectedRoute element={<MetroCumulativeBookings />} />,
  },
  { path: "/user-wise", element: <ProtectedRoute element={<AdminUsers />} /> },
  {
    path: "/entity-admins",
    element: <ProtectedRoute element={<AdminUsers />} />,
  },
  {
    path: "/facilites",
    element: <ProtectedRoute element={<AdminFacilities />} />,
  },
  { path: "/service", element: <ProtectedRoute element={<Services />} /> },
  {
    path: "/service-varient",
    element: <ProtectedRoute element={<ServiceVariant />} />,
  },
  {
    path: "/facility/unified-create",
    // element: <ProtectedRoute element={<UnifiedCreate />} />,
    element: <UnifiedCreate />,
  },
  {
    path: "/gate-keepers",
    element: <ProtectedRoute element={<GateKeepers />} />,
  },
  { path: "/payments", element: <ProtectedRoute element={<Payments />} /> },
  {
    path: "/working-days",
    element: <ProtectedRoute element={<WorkingDays />} />,
  },
  { path: "/holidays", element: <ProtectedRoute element={<Holidays />} /> },
  { path: "/entity-bookings", element: <BookTickets /> },
  { path: "/book-tickets", element: <CustomBookTickets /> },
  {
    path: "/facility-bookings",
    element: <ProtectedRoute element={<FacilityBookings />} />,
  },
  {
    path: "/day-wise-bookings",
    element: <ProtectedRoute element={<DayWiseBookings />} />,
  },
  {
    path: "/application-day-wise-bookings",
    element: <ProtectedRoute element={<ApplicationDayWiseBookings />} />,
  },
  {
    path: "/confirm-pos",
    element: <ProtectedRoute element={<PosConfirmation />} />,
  },
  {
    path: "/bank-transactions",
    element: <ProtectedRoute element={<BankTransactions />} />,
  },
  {
    path: "/total-transactions-dashboard",
    element: <ProtectedRoute element={<MainTotalTransactions />} />,
  },
  {
    path: "/total-payment-transaction-report",
    element: <ProtectedRoute element={<TotalPaymentTransactionReport />} />,
  },
  {
    path: "/failed-transactions-dashboard",
    element: <ProtectedRoute element={<MainTotalFailedTransactions />} />,
  },
  {
    path: "/total-failed-payment-transaction-order-tracker",
    element: (
      <ProtectedRoute element={<TotalFailedPaymentTransactionOrderTracker />} />
    ),
  },
  {
    path: "/total-failed-payment-transactions-report",
    element: (
      <ProtectedRoute element={<TotalFailedPaymentTransactionReport />} />
    ),
  },
  {
    path: "/failed-gateway-transactions-dashboard",
    element: <ProtectedRoute element={<MainTotalFailedGatewayTransactions />} />,
  },
  {
    path: "/failed-gateway-transactions-report",
    element: <ProtectedRoute element={<TotalFailedGatewayTransactionReport />} />,
  },
  {
    path: "/failed-gateway-transaction-order-tracker",
    element: <ProtectedRoute element={<TotalFailedGatewayTransactionOrderTracker />} />,
  },
  {
    path: "/ticket-not-generated-transactions-dashboard",
    element: (
      <ProtectedRoute element={<MainTotalTicketNotGeneratedTransactions />} />
    ),
  },
  {
    path: "/total-ticket-not-generated-payment-transaction-report",
    element: (
      <ProtectedRoute
        element={<TotalTicketNotGeneratedPaymentTransactionReport />}
      />
    ),
  },
  {
    path: "/total-ticket-not-generated-payment-transaction-order-tracker",
    element: (
      <ProtectedRoute
        element={<TotalTicketNotGeneratedPaymentTransactionOrderTracker />}
      />
    ),
  },
  {
    path: "/user-report",
    element: <ProtectedRoute element={<UserReport />} />,
  },
  {
    path: "/user-detailed-report",
    element: <ProtectedRoute element={<UserDetailedReport />} />,
  },
  {
    path: "/user-transactions-order-tracker",
    element: <ProtectedRoute element={<UserTransactionsOrderTracker />} />,
  },
  {
    path: "/metro-user-report",
    element: <ProtectedRoute element={<MetroUserReport />} />,
  },
  {
    path: "/metro-user-detailed-report",
    element: <ProtectedRoute element={<MetroUserDetailedReport />} />,
  },
   {
    path: "/metro-user-transactions-order-tracker",
    element: <ProtectedRoute element={<MetroUserTransactionsOrderTracker />} />,
  },
  {
    path: "/total-payment-transaction-order-tracker",
    element: (
      <ProtectedRoute element={<TotalPaymentTransactionOrderTracker />} />
    ),
  },
  {
    path: "/refund-transactions",
    element: <ProtectedRoute element={<MainRefundTransactions />} />,
  },
  {
    path: "/refund-transactions-report",
    element: <ProtectedRoute element={<RefundTransactionsReport />} />,
  },
  {
    path: "/transactions-order-tracker",
    element: <ProtectedRoute element={<TransactionsOrderTracker />} />,
  },
  {
    path: "/transactions-dashboard",
    element: <ProtectedRoute element={<TransactionsDashboard />} />,
  },
  {
    path: "/failed-transactions",
    element: <ProtectedRoute element={<FailedTransactions />} />,
  },
  { path: "/entity-bookings/view-details/:id", element: <BookingDetails /> },
  { path: "/amrabad-entity-bookings/view-details/:id", element: <AmrabadConsolidatedBookingDetails /> },
  // -----
  { path: "/completed-bookings", element: <CompleteBookings /> },
  // ------
  { path: "/meeticket-support", element: <Support /> },
  {
    path: "/payment-transaction-report",
    element: <PaymentTransactionReport />,
  },
  { path: "/my-profile", element: <ProtectedRoute element={<MyProfile />} /> },
  {
    path: "/super-admin-facilites",
    element: <ProtectedRoute element={<SuperAdminFacilities />} />,
  },
  {
    path: "/departments",
    element: <ProtectedRoute element={<Departments />} />,
  },
  {
    path: "/entity-types",
    element: <ProtectedRoute element={<EntityTypes />} />,
  },
  {
    path: "/nodal-officer",
    element: <ProtectedRoute element={<NodalOfficer />} />,
  },
  {
    path: "/mobile-bookings",
    element: <MobileBookingDetails />,
  },
  {
    path: "/apks",
    element: <DownloadApks />,
  },
  {
    path: "/terms",
    element: <TermsAndConditions />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/privacy-policy-meeticket-app",
    element: <PrivacyPolicyMeeticketApp />,
  },
  //pos-zoo-park-reports
  {
    path: "/pos-consolidated-booking-reports",
    element: <PosConsolidatedBookingReports />,
  },
  {
    path: "/pos-individual-booking-reports",
    element: <PosIndividualBookingReports />,
  },
  {
    path: "/pos-payment-transactions-reports",
    element: <PosPaymentTransactionsReport />,
  },
  // Grievance
  {
    path: "/Grievance-consolidate",
    element: <ProtectedRoute element={<GrievanceConsolidateReport />} />,
  },
  {
    path: "/Grievance-Incident",
    element: <ProtectedRoute element={<GrievanceIncident />} />,
  },
  {
    path: "/Grievance-individual",
    element: <ProtectedRoute element={<GrievanceIndividualReport />} />,
  },

  // rtc Routs

  {
    path: "/day-pass",
    element: <ProtectedRoute element={<DayPassReport />} />,
  },
  {
    path: "/ordinary-pass",
    element: <ProtectedRoute element={<OrdinaryPassReport />} />,
  },
  {
    path: "/mst-pass",
    element: <ProtectedRoute element={<MstPassReport />} />,
  },
  {
    path: "/express-pass",
    element: <ProtectedRoute element={<ExpressPassReport />} />,
  },
  {
    path: "/student-pass",
    element: <ProtectedRoute element={<StudentPass />} />,
  },
  {
    path: "/pending-pass",
    element: <ProtectedRoute element={<PendingPassesReport />} />,
  },

  // Tourism
  {
    path: "/tourism-individual",
    element: <ProtectedRoute element={<IndividualReport />} />,
  },
  {
    path: "/tourism-consolidate",
    element: <ProtectedRoute element={<Consolidate_Report />} />,
  },
  {
    path: "/tourism-payment-transaction",
    element: <ProtectedRoute element={<TourismPaymentTransactionReport />} />,
  },
  {
    path: "/toursim-bank-payments",
    element: <ProtectedRoute element={<BankPaymentReport />} />,
  },
  {
    path: "/user-transaction",
    element: <ProtectedRoute element={<UserTransactionReport />} />,
  },
  {
    path: "/user-status-transaction",
    element: <ProtectedRoute element={<UserStatusTransactionReport />} />,
  },
  //amarabad-user
  {
    path: "/amarabad/login",
    element: <AmrabadAuthRoute element={<AmarabadLogin />} />,
  },
  {
    path: "/forget-pin-mobile",
    element: <AmrabadForgetPinMobileNumber />,
  },
  {
    path: "/amarabad/register",
    element: <AmrabadAuthRoute  element={<AmarabadRegister />} />,
  },
  {
    path: "/amarabad/register-otp",
    element: <AmarabadRegisterOtp />,
  },
  {
    path: "/amarabad-otp",
    element: <ResetPinOtp />,
  },
  {
    path: "/amarabad-reset-pin",
    element: <AmrabadResetPin />,
  },
  {
    path: "/amarabad",
    element: <Packages />,
  },
  {
    path: "/amarabad/packages",
    element: <Packages />,
  },
  {
    path: "/amarabad/packages/:packageId",
    element: <PackageDetail />,
  },
  {
    path: "/amarabad/houses/:packageId",
    element: <Houses />,
  },
  {
  path: "/amarabad/book-now/:packageId/:houseId",
  element: <AmrabadProtectRoute element={<BookNow />} />,
  },
  {
    path: "/amarabad/checkout-details",
    element: <AmrabadProtectRoute element={<CheckoutDetails />} />,
  },
  {
    path: "/amarabad/booking-details",
    element: <AmrabadProtectRoute element={<AmarabadBookingDetails />} />,
  },
  {
    path: "/amarabad/confirmed-details/:bookingId",
    element: <AmrabadProtectRoute element={<ConfirmedDetails />} />,
  },
  {
    path: "/amarabad/booking-history",
    element: <AmrabadProtectRoute element={<BookingHistory />} />,
  },
  {
    path: "/amarabad/test",
    element: <AmrabadProtectRoute element={<AmrabadTest />} />,
  },
  // amrabad admin routes
  {
    path: "/packages",
    element: <ProtectedRoute element={<MainPackages />} />,
  },
   { 
    path: "/amrabad-packages",
    element: <ProtectedRoute element={<MainPackages/>} />,
  },
  { 
    path: "/amrabad-consolidated-reports",
    element: <ProtectedRoute element={<AmrabadConsolidatedReports/>} />,
  },
    { 
    path: "/amrabad-individual-reports",
    element: <ProtectedRoute element={<AmrabadIndividualReports/>} />,
  },
   { 
    path: "/amrabad-payment-transactions",
    element: <ProtectedRoute element={<AmrabadPaymentTransactionsReport />} />,
  },
  {
    path: "/amrabad-availability-report",
    element: <ProtectedRoute element={<AmrabadAvailabilityMain />} />,
  },
  // metro transaction reports

  {
    path: "/metro-total-transaction",
    element: <ProtectedRoute element={<MainTotalTransactionReport />} />,
  },
  {
    path: "/metro-total-report",
    element: <ProtectedRoute element={<MetroTotalReport />} />,
  },
  {
    path: "/metro-failed-other-reason",
    element: <ProtectedRoute element={<FailedOtherReason />} />,
  },

  {
    path: "/metro-failed-gateway",
    element: <ProtectedRoute element={<MetroFailedGateway />} />,
  },
  {
    path: "/metro-not-generated",
    element: <ProtectedRoute element={<MetroNotGenerated />} />,
  },


   {
    path: "/metro-failed-other-reason-report",
    element: <ProtectedRoute element={<FailedOtherReasonReport />} />,
  },

  {
    path: "/metro-failed-gateway-report",
    element: <ProtectedRoute element={<MetroFailedGatewayReport />} />,
  },
  {
    path: "/metro-not-generated-report",
    element: <ProtectedRoute element={<MetroNotGeneratedReport />} />,
  },
  {
    path: "/metro-refund-transactions",
    element: <ProtectedRoute element={<MainMetroRefundTransactions />} />,
  },
  {
    path: "/metro-refund-transactions-report",
    element: <ProtectedRoute element={<MetroRefundTransactionsReport />} />,
  },
  {
    path: "/metro-total-traker",
    element: <ProtectedRoute element={<MetroTotalTracker />} />,
  },
];
