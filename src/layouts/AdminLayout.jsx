import React, { useState } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { ToastContainer } from "react-toastify";

function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="absolute bg-gray-300 w-80 h-80 rounded-full opacity-30 -top-36 -left-20" />
      <div className="absolute bg-gray-300 w-40 h-40 rounded-full opacity-20 top-40 -right-20 hidden md:block" />
      {/* <div className="absolute bg-gray-300 w-80 h-80 rounded-full opacity-20 top-10 right-80" /> */}
      <div className="absolute bg-gray-300 w-48 h-48 rounded-full opacity-25 -bottom-32 left-40" />
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        role={"Admin"}
        variant="default"
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          {/* Dashboard actions */}
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
