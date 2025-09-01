import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import DepartmentAbstract from "./monthly_reports/DepartmentAbstract";
import LocationCategoryAbstract from "./monthly_reports/LocationCategoryAbstract";
import DepartmentWiseReport from "./monthly_reports/DepartmentWiseReport";
import LocationCategoryWiseReport from "./monthly_reports/LocationCategoryWiseReport";
import LocationWiseReport from "./monthly_reports/LocationWiseReport";
import { ToastContainer } from "react-toastify";

const MainReport = () => {
  const [activeTab, setActiveTab] = useState(0);

  const ReportTabs = [
    { title: "Department Abstract" },
    { title: "Location Category Abstract" },
    { title: "Department Wise Report" },
    { title: "Location Category Wise Report" },
    { title: "Location Wise Report" },
  ];
  const reportsConfig = {
    0: <DepartmentAbstract />,
    1: <LocationCategoryAbstract />,
    2: <DepartmentWiseReport />,
    3: <LocationCategoryWiseReport />,
    4: <LocationWiseReport />,
  };
  return (
    <AdminLayout>
      <ToastContainer />
      <div className="px-4 py-6 w-full max-w-9xl mx-auto">
        <div className="flex justify-between mb-2 sm:mb-0 w-[100%] mx-auto">
          <div className="flex gap-4 border border-white text-sm w-full font-semibold bg-blue-v2 text-white px-2 py-1.5 rounded-lg shadow-lg transition-colors duration-500 overflow-x-auto scrollbar-hide sm:overflow-visible">
            {ReportTabs.map((tab, index) => (
              <div
                key={tab.title}
                onClick={() => setActiveTab(index)}
                className={`cursor-pointer capitalize px-2 py-1 rounded-md transition-all duration-500 whitespace-nowrap min-w-fit ${
                  activeTab === index
                    ? "bg-white text-blue-v2 font-extrabold  "
                    : "bg-[#4D6586] text-white   "
                }`}
              >
                {tab.title}
              </div>
            ))}
          </div>
        </div>

        <div className="py-2 px-6">{reportsConfig[activeTab]}</div>
      </div>
    </AdminLayout>
  );
};

export default MainReport;
