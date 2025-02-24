import React, { useState } from 'react'
import AdminLayout from '../../../layouts/AdminLayout'
import SuperAdminFacilitiesList from '../../../components/super_admin_facilites_management/SuperAdminFacilitiesList';
import CreateSuperAdminFacilities from '../../../components/super_admin_facilites_management/CreateSuperAdminFacilities';
import BackButton from '../../../components/BackButton';

function SuperAdminFacilities() {
    const [isFacilityCreateVisible, setIsFacilityCreateVisible] = useState(false);
    const [isFacilityEditVisible, setIsFacilityEditVisible] = useState(false);
  
    // Function to toggle the visibility of FacilityCreate
    const toggleFacilityCreate = () => {
      setIsFacilityCreateVisible((prev) => !prev);
      setIsFacilityEditVisible(false)
    };
  return (
    <AdminLayout>
         <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Master Facilities
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
           
            {!isFacilityCreateVisible ? (
            <button
              onClick={toggleFacilityCreate}
              className="btn-sm bg-gray-900 text-white shadow-sm hover:bg-gray-800 "
            >
              <span className="max-xs:sr-only ">Add Master Facility</span>
            </button>
             ) : (
              <BackButton
                label="Back"
                onClick={() => setIsFacilityCreateVisible(false)}
                className="bg-blue-600 hover:bg-blue-700"
              />
            )}
          </div>
        </div>
        {/* Cards */}
          {isFacilityCreateVisible ? <CreateSuperAdminFacilities setIsFacilityCreateVisible={setIsFacilityCreateVisible} isFacilityEditVisible={isFacilityEditVisible}/> : <SuperAdminFacilitiesList setIsFacilityCreateVisible={setIsFacilityCreateVisible} setIsFacilityEditVisible={setIsFacilityEditVisible}  />}
        
      </div>
      </AdminLayout>
   
  )
}

export default SuperAdminFacilities
