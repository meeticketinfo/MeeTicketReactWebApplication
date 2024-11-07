import { useState } from "react";
import FacilityCreate from "../../../components/facilities_management/facilityCreate";
import FacilityList from "../../../components/facilities_management/facilityList";
import AdminLayout from "../../../layouts/AdminLayout";

export default function AdminFacilities() {
  // State to toggle the FacilityCreate component
  const [isFacilityCreateVisible, setIsFacilityCreateVisible] = useState(false);
  const [isFacilityEditVisible, setIsFacilityEditVisible] = useState(false);

  // Function to toggle the visibility of FacilityCreate
  const toggleFacilityCreate = () => {
    setIsFacilityCreateVisible((prev) => !prev);
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Facilities
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Add view button */}
            <button
              onClick={toggleFacilityCreate}
              className="btn bg-gray-900 text-white shadow-sm hover:bg-gray-800 "
            >
              <span className="max-xs:sr-only ">{!isFacilityCreateVisible ? "Add Facility" : "Back"}</span>
            </button>
          </div>
        </div>

        {/* Cards */}
       
          {isFacilityCreateVisible ? <FacilityCreate setIsFacilityCreateVisible={setIsFacilityCreateVisible} isFacilityEditVisible={isFacilityEditVisible} setIsFacilityEditVisible={setIsFacilityEditVisible}  /> : <FacilityList setIsFacilityCreateVisible={setIsFacilityCreateVisible} setIsFacilityEditVisible={setIsFacilityEditVisible} />}
        
      </div>
    </AdminLayout>
  );
}
