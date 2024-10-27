import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./css/style.css";
import "./charts/ChartjsConfig";
import Dashboard from "./pages/Dashboard";
import AdminUsers from "./pages/admin/users/AdminUsers";
import AdminParks from "./pages/admin/parks/AdminParks";
import AdminFacilities from "./pages/admin/facilities/AdminFacilities";
import WorkingDays from "./pages/admin/working_days/WorkingDays";
import Holidays from "./pages/admin/holidays/Holidays";

function App() {
  const location = useLocation();

  useEffect(() => {
    document.querySelector("html").style.scrollBehavior = "auto";
    window.scroll({ top: 0 });
    document.querySelector("html").style.scrollBehavior = "";
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Dashboard />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/park-management" element={<AdminParks />} />
        <Route exact path="/user-management" element={<AdminUsers />} />
        <Route exact path="/bookings" element={<AdminUsers />} />
        <Route exact path="/user-wise" element={<AdminUsers />} />
        <Route exact path="facilites" element={<AdminFacilities />} />
        <Route exact path="service" element={<AdminParks />} />
        <Route exact path="service-varient" element={<AdminParks />} />
        <Route exact path="entry-scan-users" element={<AdminParks />} />
        <Route exact path="payments" element={<AdminParks />} />
        {/* working days */}
        <Route exact path="/working-days" element={<WorkingDays />} />
        <Route exact path="/holidays" element={<Holidays />} />
      </Routes>
    </>
  );
}

export default App;
