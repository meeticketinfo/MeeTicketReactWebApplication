import React, { useState } from "react";
import AdminLayout from "../../../../layouts/AdminLayout";
import FailedTransactionsDashboard from "./FailedTransactionsDashboard";
import { getThisMonthRange, getThisWeekRange, getThisYearRange, getTodayRange } from "../../../../utils/Helper";

const TransactionsDashboard = () => {
  const [activeTab, setActiveTab] = useState("week");
  const [Filter, setFilter] = useState("week");
  const tabs = [
    { label: "Today", value: "today",today: getTodayRange(), },
    { label: "This Week", value: "week",week: getThisWeekRange(), },
    { label: "This Month", value: "month",month: getThisMonthRange(), },
    { label: "This Year", value: "year",year: getThisYearRange(), },
  ];

  return (
    <AdminLayout>
      <div className="px-4  py-8 w-full max-w-9xl mx-auto">
        <div className="flex justify-between mb-4 sm:mb-0">
          <div>
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Transactions Report
            </h1>
          </div>
          <div className="flex rounded-sm overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => 
                  setActiveTab(tab.value)

                }
                className={`px-4 py-1 text-sm font-medium ${
                  activeTab === tab.value
                    ? "bg-blue-900 text-white"
                    : "bg-white text-black border border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <FailedTransactionsDashboard filter={activeTab} />
      </div>
    </AdminLayout>
  );
};

export default TransactionsDashboard;
