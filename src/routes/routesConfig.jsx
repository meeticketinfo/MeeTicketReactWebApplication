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

export const routes = [
  {
    path: "/",
    element: <Login />,
  },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/park-management", element: <AdminParks /> },
  { path: "/user-management/add", element: <AdminUsers /> },
  { path: "/bookings", element: <AdminBookings /> },
  { path: "/user-wise", element: <AdminUsers /> },
  { path: "/user-management", element: <AdminUsers /> },
  { path: "/facilites", element: <AdminFacilities /> },
  { path: "/service", element: <Services /> },
  { path: "/service-varient", element: <ServiceVariant /> },
  { path: "/entry-scan-users", element: <EntryScanUsers /> },
  { path: "/payments", element: <Payments /> },
  { path: "/working-days", element: <WorkingDays /> },
  { path: "/holidays", element: <Holidays /> },
  { path: "/booktickets", element: <BookTickets /> },
];
