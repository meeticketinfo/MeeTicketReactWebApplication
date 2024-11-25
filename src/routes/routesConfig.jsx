// src/routes/index.tsx

//import AdminUsers from "../pages/admin/users/AdminUsers";
//import AdminParks from "../pages/admin/parks/AdminParks";
//import AdminFacilities from "../pages/admin/facilities/AdminFacilities";
//import AdminUsersTable from "../pages/admin/users/AdminUserTable";
//import WorkingDays from "../pages/admin/working_days/WorkingDays";
//import Holidays from "../pages/admin/holidays/Holidays";
import Login from "../auth/login/Login";
//import ServiceVariant from "../pages/admin/service_varient/serviceVarient";
//import EntryScanUsers from "../pages/admin/entry_Scan_users/EntryScanUsers";
//import Payments from "../pages/admin/payments/Payments";
//import Services from "../pages/admin/services/services";
//import AdminBookings from "../pages/admin/bookings/Bookings";
import ProtectedRoute from "./ProtectedRoute";
//import BookTickets from "../pages/admin/BookTickets/BookTickets";
//import GateKeepers from "../pages/park_admin/users/GateKeepers";
//import MyProfile from "../pages/MyProfile/MyProfile";
//import BookingDetails from "../pages/admin/BookTickets/BookingDetails";
//import DepartmentList from "../components/department_management/DepartmentList";
//import Departments from "../pages/admin/departments/Departments";
//import EntityTypeList from "../components/entity_type_management/EntityTypeList";
//import EntityTypes from "../pages/admin/entity_types/EntityTypes";
//import NodalOfficer from "../pages/admin/nodal_officer/NodalOfficer";
//import RTCBookings from "../pages/admin/rtc_bookings/RtcBooking";
//import MetroBookings from "../pages/admin/metro_bookings/Metrobookings";
import NotFound from "../pages/Error/NotFound";
//import EntitiesDetails from "../pages/admin/parks/EntitiesDetails";
import DepartmentCreate from "../modules/departments/pages/DepartmentCreate";
import DepartmentEdit from "../modules/departments/pages/DepartmentEdit";
import DepartmentList from "../modules/departments/pages/DepartmentList";

export const routes = [
  {
    path: "*",
    element: <NotFound />,
  },
  // {
  //   path: "/",
  //   element: <Login />,
  // },
//  { path: "/dashboard", element: <ProtectedRoute element={<Dashboard />} /> },

  // location routes
  // {
  //   path: "/locations",
  //   element: <ProtectedRoute element={<AdminParks />} />,
  // },
  // { path: "/entities/view-details/:id", element: <EntitiesDetails /> },
  // {
  //   path: "/user-management/add",
  //   element: <ProtectedRoute element={<AdminUsers />} />,
  // },
  // {
  //   path: "/bookings",
  //   element: <ProtectedRoute element={<AdminBookings />} />,
  // },

  // Location Admins Routes 
  // {
  //   path: "/entity-admins",
  //   element: <ProtectedRoute element={<AdminUsers />} />,
  // },
  // {
  //   path: "/entity-admins/create",
  //   element: <ProtectedRoute element={<AdminUsers />} />,
  // },
  // {
  //   path: "/entity-admins/edit",
  //   element: <ProtectedRoute element={<AdminUsers />} />,
  // },

  // Facilities routes 
  // {
  //   path: "/facilities",
  //   element: <ProtectedRoute element={<AdminFacilities />} />,
  // },
  // {
  //   path: "/facilities/create",
  //   element: <ProtectedRoute element={<CreateFacilities />} />,
  // },
  // {
  //   path: "/facilities/edit",
  //   element: <ProtectedRoute element={<CreateFacilities />} />,
  // },

  // Service Routes
  // { path: "/service", element: <ProtectedRoute element={<Services />} /> },
  // { path: "/service/create", element: <ProtectedRoute element={<Services />} /> },
  // { path: "/service/edit", element: <ProtectedRoute element={<Services />} /> },

  // Service Variant Routes 
  // {
  //   path: "/service-variant",
  //   element: <ProtectedRoute element={<ServiceVariant />} />,
  // },
  // {
  //   path: "/service-variant/create",
  //   element: <ProtectedRoute element={<ServiceVariant />} />,
  // },
  // {
  //   path: "/service-variant/edit",
  //   element: <ProtectedRoute element={<ServiceVariant />} />,
  // },

  // gate Keepers 
  // {
  //   path: "/gate-keepers",
  //   element: <ProtectedRoute element={<GateKeepers />} />,
  // },
  // {
  //   path: "/gate-keepers/create",
  //   element: <ProtectedRoute element={<GateKeepers />} />,
  // },
  // {
  //   path: "/gate-keepers/edit",
  //   element: <ProtectedRoute element={<GateKeepers />} />,
  // },

  //holidays
  //{ path: "/holidays", element: <ProtectedRoute element={<Holidays />} /> },

  //bookings
  //{ path: "/entity-bookings", element: <BookTickets /> },
  //{ path: "/entity-bookings/view-details/:id", element: <BookingDetails /> },


  // Department routes 
  {
    // path: "/departments",
    path: "/departments",
    element: <ProtectedRoute element={<DepartmentList />} />,
  },
  {
    path: "/departments/create",
    element: <ProtectedRoute element={<DepartmentCreate />} />,
  },
  {
    path: "/departments/edit",
    element: <ProtectedRoute element={<DepartmentEdit />} />,
  },

  // Location Category Routes 
  // {
  //   path: "/location-category",
  //   element: <ProtectedRoute element={<EntityTypes />} />,
  // },  
  // {
  //   path: "/location-category/create",
  //   element: <ProtectedRoute element={<EntityTypes />} />,
  // },
  // {
  //   path: "/location-category/edit",
  //   element: <ProtectedRoute element={<EntityTypes />} />,
  // },

  // nodal Officer Routes 
  // {
  //   path: "/nodal-officer",
  //   element: <ProtectedRoute element={<NodalOfficer />} />,
  // },
  // {
  //   path: "/nodal-officer/create",
  //   element: <ProtectedRoute element={<NodalOfficer />} />,
  // },
  // {
  //   path: "/nodal-officer/edit",
  //   element: <ProtectedRoute element={<NodalOfficer />} />,
  // },
];


// locations//
// bookings //
// facilities//
// gate-keepers
// holidays //
// departments//
// location-category //
// nodal-officer //