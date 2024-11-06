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
  { path: "/dashboard", element: <ProtectedRoute element={<Dashboard />} /> },
  {
    path: "/park-management",
    element: <ProtectedRoute element={<AdminParks />} />,
  },
  {
    path: "/user-management/add",
    element: <ProtectedRoute element={<AdminUsers />} />,
  },
  {
    path: "/bookings",
    element: <ProtectedRoute element={<AdminBookings />} />,
  },
  { path: "/user-wise", element: <ProtectedRoute element={<AdminUsers />} /> },
  {
    path: "/park-admin-management",
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
    path: "/entry-scan-users",
    element: <ProtectedRoute element={<EntryScanUsers />} />,
  },
  { path: "/payments", element: <ProtectedRoute element={<Payments />} /> },
  {
    path: "/working-days",
    element: <ProtectedRoute element={<WorkingDays />} />,
  },
  { path: "/holidays", element: <ProtectedRoute element={<Holidays />} /> },
  { path: "/booktickets", element: <BookTickets /> },
];
