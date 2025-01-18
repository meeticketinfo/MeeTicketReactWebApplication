import { useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import ServiceList from "../../../components/service_management/serviceList";
import ServiceCreate from "../../../components/service_management/serviceCreate";
import BackButton from "../../../components/BackButton";

export default function Services() {
  const [isServiceCreateVisible, setIsServiceCreateVisible] = useState(false);
  const [isServiceEditVisible, setIsServiceEditVisible] = useState(false);
  // Function to toggle the visibility of ParkCreate
  const toggleServiceCreate = () => {
    setIsServiceCreateVisible((prev) => !prev);
    setIsServiceEditVisible(false)
  };

  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          {/* Dashboard actions */}
          <div className="sm:flex sm:justify-between sm:items-center mb-8">
            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
                Sub Facilities
              </h1>
            </div>
            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
              {/* Add view button */}
              {!isServiceCreateVisible ? (
              <button
              onClick={toggleServiceCreate}
               className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white">
                <span className="max-xs:sr-only" >
               Add Sub Facility
                </span>
              </button>
               ) : (
                <BackButton
                  label="Back"
                  onClick={() => setIsServiceCreateVisible(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                />
              )}
            </div>
          </div>
          {/* Cards */}
          {/* <div className="grid grid-cols-12 gap-6"> */}
          {isServiceCreateVisible ? (
            <ServiceCreate
              setIsServiceCreateVisible={setIsServiceCreateVisible} isServiceEditVisible={isServiceEditVisible} setIsServiceEditVisible={setIsServiceEditVisible}
            />
          ) : (
            <ServiceList setIsServiceCreateVisible={setIsServiceCreateVisible} setIsServiceEditVisible={setIsServiceEditVisible} />
          )}
          {/* </div> */}
        </div>
      </AdminLayout>
    </>
  );
}
