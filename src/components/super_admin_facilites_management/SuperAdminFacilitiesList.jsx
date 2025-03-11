import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import Tippy from "@tippyjs/react";
import { LuClipboardEdit } from "react-icons/lu";
import { useAdminFacilityStore } from "../../store/masters/SuperAdminFacilitiesStore";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { useEntityTypesStore } from "../../store/masters/entityTypesStore";
import Select from "react-select";

function SuperAdminFacilitiesList({
  setIsFacilityCreateVisible,
  setIsFacilityEditVisible,
}) {
  const {
    AdminFacilitiesDetails,
    fetchAllAdminFacilitiesDetails,
    setCurrentAdminFacilityEditDetails,
  } = useAdminFacilityStore();
  const storedUser = localStorage.getItem("AdminFacilityFilters");
  const userObject = storedUser ? JSON.parse(storedUser) : "";

  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();

  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [filters, setFilters] = useState({
    departmentId: userObject.departmentId,
    locationCategoryId: userObject.locationCategoryId,
  });

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "departmentName",
      headerName: "Department",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "locationCategoryName",
      headerName: "Location Category",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <Tippy
            content="Edit"
            placement="right"
            className=" text-white rounded-lg px-[1px] py-[1px] shadow-lg"
          >
            <button
              className="btn-edit"
              onClick={() => {
                setCurrentAdminFacilityEditDetails(params.data);
                setIsFacilityCreateVisible(true);
                setIsFacilityEditVisible(true);
              }}
            >
              <LuClipboardEdit className="text-[24px] text-[#0C3770] " />
            </button>
          </Tippy>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);

  useEffect(() => {
    fetchAllAdminFacilitiesDetails();
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
  }, []);

  useEffect(() => {
    setFilteredFacilities(AdminFacilitiesDetails);
  }, [AdminFacilitiesDetails]);

  useEffect(() => {
    const filtered = AdminFacilitiesDetails?.filter((facility) => {
      const matchesDepartment =
        !filters.departmentId || facility.departmentId === filters.departmentId;
      const matchesLocation =
        !filters.locationCategoryId ||
        facility.locationCategoryId === filters.locationCategoryId;

      return matchesDepartment && matchesLocation;
    });

    setFilteredFacilities(filtered);
  }, [filters, AdminFacilitiesDetails]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
    localStorage.setItem(
      "AdminFacilityFilters",
      JSON.stringify({ ...filters, [filterName]: value })
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
        <div>
          <label className="block text-sm font-medium">Department</label>
          <Select
            name="departmentId"
            value={
              allDepartmentTypes
                ?.filter((dept) => dept.isActive)
                .map((dept) => ({
                  value: dept.departmentId,
                  label: dept.departmentName,
                }))
                .find((option) => option.value === filters.departmentId) || null // Set the selected value
            }
            options={allDepartmentTypes
              ?.filter((dept) => dept.isActive)
              .map((dept) => ({
                value: dept.departmentId,
                label: dept.departmentName,
              }))}
            onChange={(selectedOption) =>
              handleFilterChange("departmentId", selectedOption?.value || "")
            }
            isClearable
            placeholder="Department"
            className="mt-[4px] text-sm"
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                outline: "none",
                boxShadow: "none",
                borderColor: "#ced4da",
                borderRadius: "6px",
                height: "30px",
                minHeight: "33px",
              }),

              menu: (base) => ({
                ...base,
                // padding: "4px 0",
              }),
              option: (base, { isFocused }) => ({
                ...base,
                fontSize: "0.775rem",
                backgroundColor: isFocused ? "#F8F8F8" : "white",
                color: isFocused ? "#0C3771" : "#000",
                cursor: "pointer",
              }),
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location Category</label>
          <Select
            name="locationCategoryId"
            value={
              allEntityTypes
                ?.filter((dept) => dept.isActive)
                .map((dept) => ({
                  value: dept.entityTypeId,
                  label: dept.entityTypeName,
                }))
                .find(
                  (option) => option.value === filters.locationCategoryId
                ) || null // Set the selected value
            }
            options={allEntityTypes
              ?.filter((entity) => entity.isActive)
              .map((entity) => ({
                value: entity.entityTypeId,
                label: entity.entityTypeName,
              }))}
            onChange={(selectedOption) =>
              handleFilterChange(
                "locationCategoryId",
                selectedOption?.value || ""
              )
            }
            isClearable
            placeholder="Location Category"
            className="mt-[4px] text-sm"
            classNamePrefix="react-select"
            styles={{
              control: (base) => ({
                ...base,
                outline: "none",
                boxShadow: "none",
                borderColor: "#ced4da",
                borderRadius: "6px",
                height: "30px",
                minHeight: "33px",
              }),

              menu: (base) => ({
                ...base,
                // padding: "4px 0",
              }),
              option: (base, { isFocused }) => ({
                ...base,
                fontSize: "0.775rem",
                backgroundColor: isFocused ? "#F8F8F8" : "white",
                color: isFocused ? "#0C3771" : "#000",
                cursor: "pointer",
              }),
            }}
          />
        </div>
      </div>

      <AgGridTable
        ExportName="Master Facilities"
        rowData={filteredFacilities}
        columnDefs={columnDefs}
      />
    </div>
  );
}

export default SuperAdminFacilitiesList;
