// src/routes/index.tsx

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
    element:  <AuthRoute element={<Login />} />,
  },
  { path: "/dashboard", element: <ProtectedRoute element={<Dashboard />} /> },
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
    path: "/summary-report",
    element: <ProtectedRoute element={<SummaryReport />} />,
  },
  {
    path: "/transaction-report",
    element: <ProtectedRoute element={<TrasactionReport/>} />,
  },
  {
    path: "/rtc-bookings",
    element: <ProtectedRoute element={<RTCBookings />} />,
  },
  {
    path: "/metro-bookings",
    element: <ProtectedRoute element={<MetroBookings />} />,
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
  { path: "/entity-bookings/view-details/:id", element: <BookingDetails /> },
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
    element: < TermsAndConditions/>,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
  },
];
