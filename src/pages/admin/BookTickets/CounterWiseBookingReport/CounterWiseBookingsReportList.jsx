import React, { useCallback, useEffect, useMemo, useState } from "react";
import AgGridTable from "../../../../components/tables/AgGridTable";
import { Field, Form, Formik } from "formik";
import {
  formatToStandardDate,
  getCurrentDate,
} from "../../../../utils/TypographyHelper";
import { useCounterWiseBookingStore } from "../../../../store/masters/counterWiseBookingStore";
import { NavLink } from "react-router-dom";
import { useEntityTypesStore } from "../../../../store/masters/entityTypesStore";
import Select from "react-select";
import { useDepartmentTypesStore } from "../../../../store/masters/departmentTypesStore";
import useAuthStore from "../../../../store/authStore";
import { useParkStore } from "../../../../store/masters/parksStore";
import ForestDeptDepartmentSync from "../../../../components/common/ForestDeptDepartmentSync";

function CounterWiseBookingsReportList() {
  const { roleDetails } = useAuthStore();

  const role = roleDetails?.name;
  const {
    fetchCounterWiseBookingsReport,
    allCounterWiseBookingsReports,
    setisCounterWiseBooking,
    isCounterWiseBookingsReportsLoading,
  } = useCounterWiseBookingStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const { allParks, fetchAllParks } = useParkStore();
  const [isBookingDate, setIsBookingDate] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [PAGE_LIMIT, setPAGE_LIMIT] = useState(20);
  const savedFilters = JSON.parse(
    localStorage.getItem("counter-wise-booking-report-filters")
  );
  const forestDepartment = allDepartmentTypes?.find(
    (dept) => dept.isActive && dept.departmentName === "Forest Department"
  );
  const forestDepartmentId =
    role === "Role_ForestDeptAdmin" ? forestDepartment?.departmentId : undefined;

  useEffect(() => {
    if (role === "Role_ForestDeptAdmin") {
      if (
        forestDepartmentId === null ||
        forestDepartmentId === undefined ||
        forestDepartmentId === ""
      ) {
        return;
      }
    }
    fetchCounterWiseBookingsReport({
      startDate: savedFilters?.fromDate
        ? savedFilters.fromDate
        : getCurrentDate(),
      endDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
      bookingSource: savedFilters?.typeOfBooking
        ? savedFilters.typeOfBooking
        : "",
      mobileNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : null,
      departmentId:
        role === "Role_ForestDeptAdmin"
          ? forestDepartmentId
          : savedFilters?.departmentId
          ? savedFilters.departmentId
          : null,
      entityTypeId: savedFilters?.entityTypeId
        ? savedFilters.entityTypeId
        : null,
      parkId: savedFilters?.parkId ? savedFilters.parkId : null,
    });
  }, [fetchCounterWiseBookingsReport, forestDepartmentId]);

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllParks();
    if (role === "ROLE_SUPERADMIN") {
      fetchAllDepartmentTypes();
    } else if (role === "Role_ForestDeptAdmin") {
      fetchAllDepartmentTypes();
    }
  }, []);
  const initialValues = {
    fromDate: savedFilters?.fromDate ? savedFilters.fromDate : getCurrentDate(),
    toDate: savedFilters?.toDate ? savedFilters.toDate : getCurrentDate(),
    entityId: savedFilters?.entityId ? savedFilters.entityId : null,
    departmentId: savedFilters?.departmentId ? savedFilters.departmentId : null,
    typeOfBooking: savedFilters?.typeOfBooking
      ? savedFilters.typeOfBooking
      : "",
    phoneNumber: savedFilters?.phoneNumber ? savedFilters.phoneNumber : null,
    parkId: savedFilters?.parkId ? savedFilters.parkId : null,
  };

  const onSubmit = (values) => {
    localStorage.setItem(
      "counter-wise-booking-report-filters",
      JSON.stringify(values)
    );
    setCurrentPage(0);
    fetchCounterWiseBookingsReport({
      startDate: !isBookingDate ? values.fromDate : null,
      endDate: !isBookingDate ? values.toDate : null,
      bookingDateFrom: isBookingDate ? values.fromDate : null,
      bookingDateTo: isBookingDate ? values.toDate : null,
      departmentId: values.departmentId,
      entityTypeId: values.entityId,
      bookingSource: values.typeOfBooking,
      mobileNumber: values.phoneNumber ? values.phoneNumber : null,
      parkId: values.parkId ? values.parkId : null,
    });
  };

  const handlePageClick = (selectedItem) => {
    setCurrentPage(selectedItem.selected);
  };

  const allReportRows = Array.isArray(allCounterWiseBookingsReports)
    ? allCounterWiseBookingsReports
    : [];
  const pageSize = Number(PAGE_LIMIT) || 20;
  const pagedReportRows = allReportRows.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  const isTotalRow = (params) =>
    params?.node?.rowPinned === "bottom" || params?.data?.isTotal;

  const getPagePinnedBottomRowData = useCallback((displayedRows) => {
    const rows = displayedRows || [];
    return [
      {
        isTotal: true,
        paymentTransactionId: "Total",
        totalTicketsBooked: rows.reduce(
          (sum, row) => sum + (Number(row.totalTicketsBooked) || 0),
          0,
        ),
        totaL_AMOUNT: rows.reduce(
          (sum, row) => sum + (Number(row.totaL_AMOUNT) || 0),
          0,
        ),
      },
    ];
  }, []);

  const columnDefs = useMemo(() => [
    {
      headerName: "S.No",
      valueGetter: (params) => {
        if (isTotalRow(params)) return "";
        return currentPage * pageSize + params.node.rowIndex + 1;
      },
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "paymentTransactionId",
      headerName: "Transaction ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "Total";
        return params.value ? params.value : "N/A";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "referencE_ID",
      headerName: "Reference ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "parkName",
      headerName: "Park Name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "departmentName",
      headerName: "Department",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "entityTypeName",
      headerName: "Location category",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "totalTicketsBooked",
      headerName: "Total No Of Tickets",
      maxWidth: 170,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return Number(params.value) || 0;
        return params.value ? params.value : "N/A";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "mid",
      headerName: "MID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return !params.value || params.value.trim() === "" ? "N/A" : params.value;
      },
    },
    {
      field: "purchaseDate",
      headerName: "Purchase Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params) || !params.value) return isTotalRow(params) ? "" : "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      field: "bookinG_DATE",
      headerName: "Booking Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return formatToStandardDate(params.value) || "N/A";
      },
    },
    {
      field: "bookingSource",
      headerName: "Booking Type",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "createD_BY",
      headerName: "Booked By",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "totaL_AMOUNT",
      headerName: "Total Amount",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return Number(params.value) || 0;
        return params.value || "0";
      },
      cellStyle: (params) =>
        isTotalRow(params) ? { fontWeight: "bold" } : null,
    },
    {
      field: "paymentType",
      headerName: "Payment Type",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "CounterName",
      headerName: "Counter Name",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "status",
      headerName: "Payment Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value ? params.value : "N/A";
      },
    },
    {
      field: "resultStatus",
      headerName: "Actual Paytm Status",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (isTotalRow(params)) return "";
        return params.value || "N/A";
      },
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => {
        if (isTotalRow(params)) return "";
        return (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <NavLink
            end
            to={`/entity-bookings/view-details/${params.data.bookingID}`}
            state={{ from: "/counter-wise-booking-details" }}
            onClick={() => {
              setisCounterWiseBooking(true);
            }}
            className="bg-gray-100 text-white px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-100 transition"
          >
            <span className="text-blue-v2"> Booking Details</span>
          </NavLink>
        </div>
        );
      },
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ], [currentPage, pageSize]);
  return (
    <div>
      <Formik initialValues={initialValues} onSubmit={onSubmit}>
        {({ values, setFieldValue, resetForm }) => (
          <Form className="grid grid-cols-1 md:grid-cols-5 gap-3 py-3">
            <ForestDeptDepartmentSync
              role={role}
              forestDepartmentId={forestDepartmentId}
              setFieldValue={setFieldValue}
            />
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Booking/Purchase Date
              </label>
              <select
                onChange={(e) => {
                  setIsBookingDate(e.target.value === "true");
                }}
                name="bookingDate"
                className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
              >
                <option value="false">Purchase Date</option>
                <option value="true">Booking Date</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="fromDate"
                className="block text-xs font-medium text-gray-700"
              >
                From Date
              </label>
              <Field
                type="date"
                name="fromDate"
                className={`mt-1 block w-full px-2 py-1 border
                  border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                onChange={(e) => {
                  const fromDateValue = e.target.value;
                  setFieldValue("fromDate", fromDateValue);
                  if (new Date(fromDateValue) > new Date(values.toDate)) {
                    setFieldValue("toDate", fromDateValue);
                  }
                }}
              />
            </div>
            <div>
              <label
                htmlFor="toDate"
                className="block text-xs font-medium text-gray-700"
              >
                To Date
              </label>
              <Field
                type="date"
                name="toDate"
                className={`mt-1 block w-full px-2 py-1 border
                     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                min={values.fromDate || getCurrentDate()}
                onChange={(e) => {
                  const toDateValue = e.target.value;
                  setFieldValue("toDate", toDateValue);
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Type of Booking
              </label>
              <Select
                name="typeOfBooking"
                options={[
                  { value: "", label: "ALL" },
                  { value: "Counter", label: "Counter" },
                  { value: "MeeTicketApp", label: "Mee TicketApp" },
                ]}
                onChange={(selectedOption) =>
                  setFieldValue("typeOfBooking", selectedOption?.value || "")
                }
                isClearable
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
                  }),
                  option: (base, { isFocused }) => ({
                    ...base,
                    fontSize: "0.775rem",
                    backgroundColor: isFocused ? "#F8F8F8" : "white",
                    color: isFocused ? "#0C3771" : "#000",
                    cursor: "pointer",
                  }),
                }}
                placeholder="Type of Booking"
              />
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-xs font-medium text-gray-700"
              >
                Phone Number
              </label>
              <Field
                type="text"
                maxLength="10"
                name="phoneNumber"
                className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
                placeholder="Enter phone number"
                onKeyPress={(e) => {
                  if (!/^\d$/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            {(role === "ROLE_SUPERADMIN" ||
              role === "Role_ForestDeptAdmin") && (
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Department
                </label>

                <Select
                  name="departmentId"
                  value={
                    allDepartmentTypes
                      ?.filter((dept) => dept.isActive)
                      .map((dept) => ({
                        value: dept.departmentId,
                        label: dept.departmentName,
                      }))
                      .find(
                        (option) =>
                          option.value ===
                          (role === "Role_ForestDeptAdmin"
                            ? forestDepartmentId
                            : values.departmentId)
                      ) || null
                  }
                  options={allDepartmentTypes
                    ?.filter((dept) => dept.isActive)
                    .map((dept) => ({
                      value: dept.departmentId,
                      label: dept.departmentName,
                    }))}
                  onChange={(selectedOption) =>
                    setFieldValue("departmentId", selectedOption?.value || null)
                  }
                  isDisabled={role === "Role_ForestDeptAdmin"}
                  isClearable={role !== "Role_ForestDeptAdmin"}
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
            )}
            <div>
              <label className="block text-xs font-medium text-gray-700">
                Location Category
              </label>

              <Select
                name="entityId"
                value={
                  allEntityTypes
                    ?.filter((dept) => dept.isActive)
                    .map((dept) => ({
                      value: dept.entityTypeId,
                      label: dept.entityTypeName,
                    }))
                    .find((option) => option.value === values.entityId) || null
                }
                options={allEntityTypes
                  ?.filter((entity) => entity.isActive)
                  .map((entity) => ({
                    value: entity.entityTypeId,
                    label: entity.entityTypeName,
                  }))}
                onChange={(selectedOption) =>
                  setFieldValue("entityId", selectedOption?.value || null)
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
              <label className="block text-xs font-medium text-gray-700">
                Location
              </label>

              <Select
                name="parkId"
                value={
                  allParks
                    ?.filter((park) => park.isActive)
                    .map((park) => ({
                      value: park.id,
                      label: park.name,
                    }))
                    .find((option) => option.value === values.parkId) || null
                }
                options={allParks
                  ?.filter((park) => park.isActive)
                  .map((park) => ({
                    value: park.id,
                    label: park.name,
                  }))}
                onChange={(selectedOption) =>
                  setFieldValue("parkId", selectedOption?.value || "")
                }
                isClearable
                placeholder="Location"
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
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
              >
                Search
              </button>
              <button
                type="button"
                className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                onClick={() => {
                  localStorage.removeItem("counter-wise-booking-report-filters");
                  setCurrentPage(0);
                  resetForm({
                    values: {
                      fromDate: getCurrentDate(),
                      toDate: getCurrentDate(),
                      typeOfBooking: "",
                      phoneNumber: "",
                      entityId: null,
                      departmentId: null,
                      parkId: null,
                    },
                  });
                  fetchCounterWiseBookingsReport({
                    startDate: getCurrentDate(),
                    endDate: getCurrentDate(),
                    entityTypeId: null,
                    departmentId: null,
                    bookingSource: "",
                    mobileNumber: null,
                    parkId: null,
                  });
                }}
              >
                Reset
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <AgGridTable
        ExportName="Counter Wise Booking Details"
        isFetchLoading={isCounterWiseBookingsReportsLoading}
        rowData={pagedReportRows}
        columnDefs={columnDefs}
        getPagePinnedBottomRowData={getPagePinnedBottomRowData}
        showPdfExport={true}
        isPagination={false}
        tableHeight={pagedReportRows.length > 10 ? 560 : 330}
        IsReactPaginate={true}
        setPageLimit={setPAGE_LIMIT}
        pageLimit={PAGE_LIMIT}
        handlePageClick={handlePageClick}
        currentPage={currentPage}
        totalCount={allReportRows.length}
        showTotalCount={true}
        SetcurrentPage={setCurrentPage}
      />
    </div>
  );
}

export default CounterWiseBookingsReportList;
