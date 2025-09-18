import React, { useEffect } from "react";

import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import { ToastContainer } from "react-toastify";
import useSidebarStore from "../store/sidebarStore";

function AdminLayout({ children }) {
  const { sidebarOpen, setSidebarOpen } = useSidebarStore();

  // Scroll to top when component mounts (after login)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="absolute bg-gray-300 w-80 h-80 rounded-full opacity-30 -top-36 -left-20" />
      <div className="absolute bg-gray-300 w-40 h-40 rounded-full opacity-20 top-40 -right-20 hidden md:block" />
      {/* <div className="absolute bg-gray-300 w-80 h-80 rounded-full opacity-20 top-10 right-80" /> */}
    
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}
      {/* Sidebar */}
      <Sidebar
        role={"Admin"}
        variant="default"
      />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-hidden">
        {/*  Site header */}
        <Header />

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* Dashboard actions */}
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
