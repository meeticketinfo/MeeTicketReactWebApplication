import React, { useEffect } from "react";
import AdminDashboard from "./AdminDashboard";
import AdminLayout from "../layouts/AdminLayout";
import useAuthStore from "../store/authStore";
import MetroDashboard from "../components/metro_reports/MetroDashboard";

function Dashboard() {
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();
  const RenderContent = () => {
    if (roleDetails?.name === "ROLE_METROADMIN") {
      return <MetroDashboard />;
    } else {
      return <AdminDashboard />;
    }
  };

  useEffect(() => {
    console.log(roleDetails, "roleDetails");

    RenderContent();
  }, [roleDetails]);
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Dashboard
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
        </div>
        {/* admin DashBoard */}
        {roleDetails ? RenderContent() : ""}
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
