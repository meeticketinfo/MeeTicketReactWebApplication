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

  { path: "/dashboard-detailed-report", element: <ProtectedRoute element={<DashBoardDetailed />} /> },
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
  { path: "/entity-bookings/view-details/:id", element: <BookingDetails /> },
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
];
