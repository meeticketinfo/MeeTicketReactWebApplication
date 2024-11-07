import AdminLayout from "../../../layouts/AdminLayout";

import HolidayCreate from "../../../components/holiday_management/HolidayCreate";
import HolidayList from "../../../components/holiday_management/HolidayList";
import { useState } from "react";

export default function Holidays() {
  const [isHolidayCreateVisible, setIsHolidayCreateVisible] = useState(false);

  // Function to toggle the visibility of HolidayCreate
  const toggleHolidayCreate = () => {
    setIsHolidayCreateVisible((prev) => !prev);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Holidays
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Add view button */}
            <button
              onClick={toggleHolidayCreate}
              className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
            >
              <span className="max-xs:sr-only">
                {!isHolidayCreateVisible ? "Add Holidays" : "Back"}
              </span>
            </button>
          </div>
        </div>

        {isHolidayCreateVisible ? (
          <HolidayCreate
            setIsHolidayCreateVisible={setIsHolidayCreateVisible}
          />
        ) : (
          <HolidayList />
        )}

        {/* Cards */}

        <div className="grid grid-cols-12 gap-6"></div>
      </div>
    </AdminLayout>
  );
}
