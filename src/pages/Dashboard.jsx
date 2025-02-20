import React, { useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import useAuthStore from "../store/authStore";
import MetroDashboard from "../components/metro_reports/MetroDashboard";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();
  const navigate = useNavigate();

  const role = roleDetails?.name;

  const email = decodedTokenData?.data?.email;
  const RenderContent = () => {
    if (roleDetails?.name === "ROLE_METROADMIN") {
      return <MetroDashboard />;
    } else {
      return <AdminDashboard />;
    }
  };

  useEffect(() => {
    if (
      (role === "ROLE_SUPERADMIN" && email === "supportuser1@meeticket.com") ||
      email === "supportuser2@meeticket.com" ||
      email === "supportuser3@meeticket.com"
    ) {
      setTimeout(() => navigate("/entity-bookings"), 0);
    }
  }, [roleDetails, email]);
  return (
    <AdminLayout>
      <div className="px-4  sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              {!(
                email === "supportuser1@meeticket.com" ||
                email === "supportuser2@meeticket.com" || 
                email === "supportuser3@meeticket.com"
              )
                ? "Dashboard"
                : ""}
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
        </div>
        {/* admin DashBoard */}
        {roleDetails &&
        !(
          email === "supportuser1@meeticket.com" ||
          email === "supportuser2@meeticket.com" ||
          email === "supportuser3@meeticket.com"
        ) ? (
          <RenderContent />
        ) : (
          ""
        )}
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
