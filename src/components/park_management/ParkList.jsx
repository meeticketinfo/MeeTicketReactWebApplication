import React, { useEffect, useState } from "react";
import AgGridTable from "../tables/AgGridTable";
import { useParkStore } from "../../store/masters/parksStore";
import { LuClipboardEdit } from "react-icons/lu";
import { BsTrash } from "react-icons/bs";
import { PiPark } from "react-icons/pi";
import useAuthStore from "../../store/authStore";
import { useEntityTypesStore } from "../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const ParkList = ({
  setIsParkCreateVisible,
  isParkEditVisible,
  setIsParkEditVisible,
}) => {
   const navigate = useNavigate();
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [filters, setFilters] = useState({
    departmentId: "",
    locationCategoryId: "",
  });

  const [filterednodalLocations, setFilterednodalLocations] = useState([]);
  const [nodalFilters, setNodalFilters] = useState({
    departmentId: "",
    locationCategoryId: "",
  });

  const {
    allParks,
    fetchAllParks,
    isFetchAllParksLoading,
    setCurrentParkEditDetails,
    fetchAllNodalOfficerParks,
    allNodalOfficerParks,
    isFetchAllNodalOfficerParksLoading,
  } = useParkStore();
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
  }, []);
  const role = roleDetails?.name;
  const userId = decodedTokenData?.data?.UserId;
  useEffect(() => {
    if (role === "ROLE_NODALOFFICER") {
      fetchAllNodalOfficerParks(null, null, {}, userId);
    } else {
      fetchAllParks();
    }
  }, []);
  const [isImageLoaded, setIsImageLoaded] = useState(true);

  const handleImageError = () => {
    setIsImageLoaded(false);
  };

  const columnDefs = [
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
      field: "nodalOfficerName",
      headerName: "Nodal Officer Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
       
        return params.data.nodalOfficerName&&params.data.nodalOfficerName !=" "? params.data.nodalOfficerName: "N/A";
      }
    },
    {
      field: "nodalOfficerPhoneNumber",
      headerName: "Nodal Officer Number",
      flex: 1,
      headerClass: "text-blue-v2",
      valueGetter: (params) => {
       
        return params.data.nodalOfficerPhoneNumber? params.data.nodalOfficerPhoneNumber: "N/A";
      }
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
      field: "city",
      headerName: "Area",
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
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <>
          <div
            className={`${
              role === "ROLE_NODALOFFICER" &&
              "flex items-center justify-around py-2"
            }`}
          >
            {/* edit */}
            <button
              className=""
              onClick={() => {
                setCurrentParkEditDetails(params.data);
                setIsParkCreateVisible(true);
                setIsParkEditVisible(true);
              }}
            >
              <span className="">
                <LuClipboardEdit className="text-[24px] text-blue-600 " />
              </span>
            </button>
            {role === "ROLE_NODALOFFICER" && (
              <button
                className=" bg-blue-700 text-white px-[10px] py-[5px] rounded-md shadow-lg text-xs font-medium me-2 leading-none"
                onClick={() => {
                  localStorage.setItem("locationid", params.data.id);
                  navigate("/facility/unified-create");
                }}
              >
                Facilities
              </button>
            )}
          </div>
        </>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ];
  //  filtring esd admin location details
  useEffect(() => {
    setFilteredLocations(allParks);
    setFilterednodalLocations(allNodalOfficerParks);
  }, [allParks, allNodalOfficerParks]);

  useEffect(() => {
    const filtered = allParks?.filter((facility) => {
      const matchesDepartment =
        !filters.departmentId || facility.departmentId === filters.departmentId;
      const matchesLocation =
        !filters.locationCategoryId ||
        facility.locationCategoryId === filters.locationCategoryId;

      return matchesDepartment && matchesLocation;
    });

    setFilteredLocations(filtered);
  }, [filters, allParks]);

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };
  //  filtring nodal officer location details
  useEffect(() => {
    setFilterednodalLocations(allNodalOfficerParks);
  }, [allNodalOfficerParks]);

  useEffect(() => {
    const filtered = allNodalOfficerParks?.filter((facility) => {
      const matchesDepartment =
        !nodalFilters.departmentId ||
        facility.departmentId === nodalFilters.departmentId;
      const matchesLocation =
        !nodalFilters.locationCategoryId ||
        facility.locationCategoryId === nodalFilters.locationCategoryId;

      return matchesDepartment && matchesLocation;
    });

    setFilterednodalLocations(filtered);
  }, [nodalFilters, allNodalOfficerParks]);

  const handleNodalFilterChange = (filterName, value) => {
    setNodalFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };
  return (
    <>
      {role !== "ROLE_NODALOFFICER" ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
            <div>
              <label className="block text-sm font-medium">Department</label>
              <Select
                name="departmentId"
                options={allDepartmentTypes
                  ?.filter((dept) => dept.isActive)
                  .map((dept) => ({
                    value: dept.departmentId,
                    label: dept.departmentName,
                  }))}
                onChange={(selectedOption) =>
                  handleFilterChange(
                    "departmentId",
                    selectedOption?.value || ""
                  )
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
                    color: isFocused ? "#0C3771" : "#6D7072",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Location Category
              </label>
              <Select
                name="locationCategoryId"
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
                    color: isFocused ? "#0C3771" : "#6D7072",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>
          </div>
          <AgGridTable
            rowData={filteredLocations}
            columnDefs={columnDefs}
            isFetchLoading={isFetchAllParksLoading}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
            <div>
              <label className="block text-sm font-medium">Department</label>
              <Select
                name="departmentId"
                options={allDepartmentTypes
                  ?.filter((dept) => dept.isActive)
                  .map((dept) => ({
                    value: dept.departmentId,
                    label: dept.departmentName,
                  }))}
                onChange={(selectedOption) =>
                  handleNodalFilterChange(
                    "departmentId",
                    selectedOption?.value || ""
                  )
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
                    color: isFocused ? "#0C3771" : "#6D7072",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Location Category
              </label>
              <Select
                name="locationCategoryId"
                options={allEntityTypes
                  ?.filter((entity) => entity.isActive)
                  .map((entity) => ({
                    value: entity.entityTypeId,
                    label: entity.entityTypeName,
                  }))}
                onChange={(selectedOption) =>
                  handleNodalFilterChange(
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
                    color: isFocused ? "#0C3771" : "#6D7072",
                    cursor: "pointer",
                  }),
                }}
              />
            </div>
          </div>
          <AgGridTable
            rowData={filterednodalLocations}
            columnDefs={columnDefs}
            isFetchLoading={isFetchAllNodalOfficerParksLoading}
          />
        </>
      )}
    </>
  );
};

export default ParkList;
