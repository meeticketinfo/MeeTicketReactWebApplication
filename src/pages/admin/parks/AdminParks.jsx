import { useEffect, useState } from "react";
import ParkCreate from "../../../components/park_management/ParkCreate";
import ParkList from "../../../components/park_management/ParkList";
import AdminLayout from "../../../layouts/AdminLayout";
import BackButton from "../../../components/BackButton";


export default function AdminParks() {
  // State to toggle the FacilityCreate component
  const [isParkCreateVisible, setIsParkCreateVisible] = useState(false);
  const [isParkEditVisible, setIsParkEditVisible] = useState(false);

  // Function to toggle the visibility of ParkCreate
  const toggleParkCreate = () => {
    setIsParkCreateVisible((prev) => !prev);
    setIsParkEditVisible(false);
    false;
  };
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Entities
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Add view button */}
            {!isParkCreateVisible ? (
              <button
                onClick={toggleParkCreate}
                className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
              >
                <span className="max-xs:sr-only"> Add Entity </span>
              </button>
            ) : (
              <BackButton
                label="Back"
                onClick={() => setIsParkCreateVisible(false)}
                className="bg-blue-600 hover:bg-blue-700"
              />
            )}
          </div>
        </div>

        {/* Cards */}
        {/* <div className="grid grid-cols-12 gap-6"> */}
        {isParkCreateVisible ? (
          <ParkCreate
            setIsParkCreateVisible={setIsParkCreateVisible}
            isParkEditVisible={isParkEditVisible}
            setIsParkEditVisible={setIsParkEditVisible}
          />
        ) : (
          <ParkList
            setIsParkCreateVisible={setIsParkCreateVisible}
            isParkEditVisible={isParkEditVisible}
            setIsParkEditVisible={setIsParkEditVisible}
          />
        )}
        {/* </div> */}
      </div>
    </AdminLayout>
  );
}
