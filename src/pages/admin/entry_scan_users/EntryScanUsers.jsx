import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import EntryScanUserList from "../../../components/entry_scan_users_management/entryScanUsersList";

export default function EntryScanUsers() {

  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Dashboard actions */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
                Entry Scan Users
              </h1>
            </div>
            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Add view button */}
             
            </div>
          </div>
          {/* Cards */}
          {/* <div className="grid grid-cols-12 gap-6"> */}
          <EntryScanUserList />
          {/* </div> */}
        </div>
      </AdminLayout>
    </>
  );
}
