import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import NodalOfficerCreate from "../../../components/user_management/NodalOfficerCreate";
import NodalOfficerList from "../../../components/user_management/NodalOfficerList";
import AgGridTable from "../../../components/tables/AgGridTable";
import BackButton from "../../../components/BackButton";
import { useNodalOfficerStore } from "../../../store/masters/nodalOfficerStore";
import AgGridTableV2 from "../../../components/tables/AgGridTableV2";
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
  const nodalOfficerColumnDefs = [
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80, // Set minimum width to enforce a narrow column
      maxWidth: 80,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "name",
      headerName: "Location Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "entityTypeName",
      headerName: "Location Category",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "name",
      headerName: "Address",
      flex: 1,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
        const { street1, street2 } = params.data;
        return street1 || street2
          ? `${street1 || ""}, ${street2 || ""}`
          : "N/A";
      },
    },

    {
      field: "state",
      headerName: "State",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "zipCode",
      headerName: "Pincode",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "isActive",
      headerName: "Status",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <span
            className={`${
              params.value
                ? "bg-green-400 text-white shadow-md"
                : "bg-red-400 text-white shadow-md"
            } text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300`}
          >
            {" "}
            {params.value ? "Active" : "Inactive"}
          </span>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ];
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
            <div className="mt-2">
              {isNodalOfficerEditVisible && (
                <AgGridTableV2
                  rowData={allNodalOfficerParks || []}
                  columnDefs={nodalOfficerColumnDefs}
                  isFetchLoading={isFetchAllNodalOfficerParksLoading}
                />
              )}
            </div>
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
