import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import NodalOfficerCreate from "../../../components/user_management/NodalOfficerCreate";
import NodalOfficerList from "../../../components/user_management/NodalOfficerList";
import AgGridTable from "../../../components/tables/AgGridTable";
import BackButton from "../../../components/BackButton";
import { useNodalOfficerStore } from "../../../store/masters/nodalOfficerStore";
import DepartmentAdminList from "../../../components/user_management/DepartmentAdminList";
import DepartmentAdminCreate from "../../../components/user_management/DepartmentAdminCreate";

export default function DepartmentAdmin() {
  // State to toggle the FacilityCreate component
  const [isNodalOfficerCreateVisible, setIsNodalOfficerCreateVisible] =
    useState(false);
  const [isNodalOfficerEditVisible, setIsNodalOfficerEditVisible] =
    useState(false);
  const {
    allNodalOfficerParks,
    isFetchAllNodalOfficerParksLoading,
    fetchAllNodalOfficerParks,
    NodalOfficersEditDetails,
    fetchAllNodalOfficerLocationAdmins,
    isFetchAllNodalOfficerLocaionAdminsLoading,
    allNodalOfficerLocaionAdmins
  } = useNodalOfficerStore();

  useEffect(() => {
    if (isNodalOfficerEditVisible && NodalOfficersEditDetails.id) {
      fetchAllNodalOfficerParks(null, null, {}, NodalOfficersEditDetails.id);
    }
  }, [isNodalOfficerEditVisible, NodalOfficersEditDetails.id]);
  

  // Function to toggle the visibility of NodalOfficerCreate
  const toggleNodalOfficerCreate = () => {
    setIsNodalOfficerCreateVisible((prev) => !prev);
    setIsNodalOfficerEditVisible(false);
  };
  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        {/* Dashboard actions */}
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          {/* Left: Title */}
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Department Admin
            </h1>
          </div>
          {/* Right: Actions */}
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {/* Add view button */}
            {!isNodalOfficerCreateVisible ? (
              <button
                onClick={toggleNodalOfficerCreate}
               className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 rounded-md text-xs sm:text-sm"
              >
                <span > Add Department Admin </span>
              </button>
            ) : (
              <BackButton
                label="Back"
                onClick={() => setIsNodalOfficerCreateVisible(false)}
                className="bg-blue-600 hover:bg-blue-700"
              />
            )}
          </div>
        </div>

        {/* Cards */}
        {/* <div className="grid grid-cols-12 gap-6"> */}
        {isNodalOfficerCreateVisible ? (
          <>
            <DepartmentAdminCreate
              setIsNodalOfficerCreateVisible={setIsNodalOfficerCreateVisible}
              isNodalOfficerEditVisible={isNodalOfficerEditVisible}
              setIsNodalOfficerEditVisible={setIsNodalOfficerEditVisible}
            />
          </>
        ) : (
          <DepartmentAdminList
            setIsNodalOfficerCreateVisible={setIsNodalOfficerCreateVisible}
            isNodalOfficerEditVisible={isNodalOfficerEditVisible}
            setIsNodalOfficerEditVisible={setIsNodalOfficerEditVisible}
          />
        )}
        {/* </div> */}
      </div>
    </AdminLayout>
  );
}
