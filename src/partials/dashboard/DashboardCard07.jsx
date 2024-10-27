import React from "react";

function DashboardCard07({ children }) {
  return (
    <div className="col-span-full xl:col-span-12 bg-white dark:bg-gray-800 shadow-sm rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100"></h2>
      </header>
      <div className="p-3">
        {/* Table */}
        <div className="overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}

export default DashboardCard07;