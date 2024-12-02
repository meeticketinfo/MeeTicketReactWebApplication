import AdminLayout from "../../../layouts/AdminLayout";

import HolidayCreate from "../../../components/holiday_management/HolidayCreate";
import HolidayList from "../../../components/holiday_management/HolidayList";
import { useRef, useState } from "react";
import BackButton from "../../../components/BackButton";
import RecurringHolidayCreate from "../../../components/holiday_management/RecurringHolidayCreate";

export default function Holidays() {
  const [isHolidayCreateVisible, setIsHolidayCreateVisible] = useState(false);

  const recurringHolidayRef = useRef(null);
  // Function to scroll to RecurringHolidayCreate
  const scrollToRecurringHoliday = () => {
    if (recurringHolidayRef.current) {
      recurringHolidayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

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
            {!isHolidayCreateVisible ? (
              <>
                <button
                  onClick={toggleHolidayCreate}
                  className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                >
                  <span className="max-xs:sr-only">Add Holidays</span>
                </button>
                {/* <button
                  onClick={scrollToRecurringHoliday}
                  className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                >
                  <span className="max-xs:sr-only">Add Recurring Holidays</span>
                </button> */}
              </>
            ) : (
              <BackButton
                label="Back"
                onClick={() => setIsHolidayCreateVisible(false)}
                className="bg-blue-600 hover:bg-blue-700"
              />
            )}
          </div>
        </div>

        {isHolidayCreateVisible ? (
          <HolidayCreate
            setIsHolidayCreateVisible={setIsHolidayCreateVisible}
          />
        ) : (
          <>
            <HolidayList />
            <div >
              <RecurringHolidayCreate />
            </div>
          </>
        )}

        {/* Cards */}

        <div className="grid grid-cols-12 gap-6"></div>
      </div>
    </AdminLayout>
  );
}
