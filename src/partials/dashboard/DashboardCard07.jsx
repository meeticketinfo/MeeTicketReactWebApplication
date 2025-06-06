import React from "react";

function DashboardCard07({ header, title, children }) {
  return (
    <div className="col-span-full xl:col-span-12 bg-white/30 backdrop-blur-sm dark:bg-gray-800 shadow-sm rounded-xl border border-gray-100">
      {/*  */}
      {header ? (
        <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex justify-between">
          <h2 className="font-semibold text-gray-800 dark:text-gray-100">{title}</h2>
          <div>
            
          </div>
        </header>
      ) : (
        ""
      )}
      <div className="p-3 rounded relative">
        {/* Table */}
        <div className="overflow-x-auto">{children}</div>
      </div>
    </div>
  );
}

export default DashboardCard07;