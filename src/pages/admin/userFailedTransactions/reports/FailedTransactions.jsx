import { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import AgGridTable from "../../../../components/tables/AgGridTable";
import AdminLayout from "../../../../layouts/AdminLayout";
import {
  formatToCurrency,
  getCurrentDateEndTime,
  getCurrentDateStartTime,
} from "../../../../utils/TypographyHelper";
import { useEntityTypesStore } from "../../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../../store/masters/departmentTypesStore";
import { useParkStore } from "../../../../store/masters/parksStore";
import { userFailureTransaction } from "../../../../store/failedTransaction/failedTransaction";
import { getDateRange } from "../../../../utils/Helper";
const FailedTransactions = () => {
  const UserTransactionReportFilter = JSON.parse(
    localStorage.getItem("transactionPayload")
  );
  const range = localStorage.getItem("range-filter");

  const [FilterData, setFilterData] = useState({});
  const { fromDate, toDate } = getDateRange(range);
  const { allParks, fetchAllParks } = useParkStore();
  const [DepartmentId, setdepartmentId] = useState(UserTransactionReportFilter.departmentId||"");
  const [LocationCatgoryId, setLocationCatgoryId] = useState( UserTransactionReportFilter.categoryId||"");
  console.log("DepartmentId",DepartmentId)
  console.log("LocationCatgoryId",LocationCatgoryId)
  const navigate = useNavigate();
  const {
    failureUserTransactionReport,
    isFetchFailureUserTransactionReport,
    fetchFailureUserTransactionReport,
  } = userFailureTransaction();

  const { mobileNumber, status } = useLocation().state || {};
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      maxWidth: "80",
      headerClass: "text-blue-v2",
    },
    {
      field: "date",
      maxWidth: "180",
      headerName: "Date",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => {
        if (!params.value) return "N/A";
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0"); // Get day and pad with leading zero
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad with leading zero
        const year = date.getFullYear(); // Get year
        const formattedDate = `${day}-${month}-${year}`; // Combine as dd-mm-yyyy
        const formattedTime = date.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
        return `${formattedDate} ${formattedTime}`;
      },
    },
    {
      field: "mobileNumber",
      headerName: "Mobile No.",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "parkName",
      headerName: "Park Name",
      minWidth: "200",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "categoryName",
      headerName: "Location Category",
      maxWidth: "200",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department",
      maxWidth: "200",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "status",
      headerName: "Status",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "bookingId",
      headerName: "Booking ID",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "amount",
      headerName: "Amount",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "resultMsg",
      headerName: "Result Msg",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
  ]);

  // useEffect(() => {
  //   const getParksByResponse = async () => {
  //     try {
  //       const response = await fetchFailureUserTransactionReport({
  //         ...initialValues,
  //         //   mobileNumber,
  //         status,
  //       });

  //       const parks = response?.response
  //         ?.map((item) => ({
  //           id: item.parkId,
  //           name: item.parkName,
  //         }))
  //         .filter(
  //           (item, index, self) =>
  //             index === self.findIndex((t) => t.id === item.id)
  //         );
  //     } catch (error) {
  //       console.error("Failed to fetch user status transaction report", error);
  //     }
  //   };

  //   getParksByResponse();
  // }, []);

  useEffect(() => {
    fetchFailureUserTransactionReport({
      fromDate: fromDate,
      toDate: toDate,
      status: status || "",
      parkId: UserTransactionReportFilter.locationId || "",
      status: "",
    });
  }, []);
  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks();
  }, []);
  const initialValues = {
    fromDate: UserTransactionReportFilter?.fromDate || fromDate,
    toDate: UserTransactionReportFilter?.toDate || toDate,
    status: status || "",
    ParkId: UserTransactionReportFilter?.locationId || "",
    departmentId: UserTransactionReportFilter?.departmentId || "",
    entityId: UserTransactionReportFilter?.categoryId || "",
  };

  const onSubmit = (values) => {
    fetchFailureUserTransactionReport({
      fromDate: values.fromDate,
      toDate: values.toDate,
      parkId: values.ParkId,
      status: values.status || "",
    });
    setFilterData({
      departmentId: departmentId,
      categoryId: entityId,
    });
  };

  const filteredData = failureUserTransactionReport.filter((transaction) => {
    // Check if departmentId or categoryId exists in the filter and compare with transaction data
    const filterByDepartmentId = DepartmentId
      ? transaction.departmentId ===
        (FilterData.departmentId || DepartmentId)
      : true; // If departmentId is not in filter, don't filter by it

    const filterByCategoryId = LocationCatgoryId
      ? transaction.entityTypeId ===
        (FilterData.categoryId || LocationCatgoryId)
      : true; // If categoryId is not in filter, don't filter by it

    return filterByDepartmentId && filterByCategoryId;
  });

  // Set rowData based on the condition
  const rowData = filteredData.length > 0 ? filteredData : [];
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                User Status Transaction Report
              </h1>
            </div>
            <div className="">
              <button
                onClick={() => navigate("/transactions-dashboard")}
                className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white "
              >
                Back
              </button>
            </div>
          </div>
          <div>
            <Formik initialValues={initialValues} onSubmit={onSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="grid grid-cols-1 md:grid-cols-5 gap-4 py-3">
                  <div>
                    <label
                      htmlFor="fromDate"
                      className="block text-xs font-medium text-gray-700"
                    >
                      From Date
                    </label>
                    <Field
                      type="datetime-local"
                      name="fromDate"
                      className={`mt-1 block w-full px-2 py-1 border
                              border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      // min={getCurrentDate()}
                      onChange={(e) => {
                        const fromDateValue = e.target.value;
                        setFieldValue("fromDate", fromDateValue);
                        if (new Date(fromDateValue) > new Date(values.toDate)) {
                          // Automatically update toDate if it's earlier than fromDate
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
                      type="datetime-local"
                      name="toDate"
                      className={`mt-1 block w-full px-2 py-1 border
                                 border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                      // min={values.fromDate || getCurrentDateStartTime()}
                      onChange={(e) => {
                        const toDateValue = e.target.value;
                        setFieldValue("toDate", toDateValue);
                      }}
                    />
                  </div>

                  {/* department */}
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
                            (option) => option.value === values.departmentId
                          ) || null // Set the selected value
                      }
                      options={allDepartmentTypes
                        ?.filter((dept) => dept.isActive)
                        .map((dept) => ({
                          value: dept.departmentId,
                          label: dept.departmentName,
                        }))}
                      onChange={(selectedOption) =>{
                        setFieldValue(
                          "departmentId",
                          selectedOption?.value || ""
                        )
                        setdepartmentId(selectedOption?.value || "")
                      }}
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
                  {/* location category */}
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
                          .find((option) => option.value === values.entityId) ||
                        null // Use values.entityId
                      }
                      options={allEntityTypes
                        ?.filter((entity) => entity.isActive)
                        .map((entity) => ({
                          value: entity.entityTypeId,
                          label: entity.entityTypeName,
                        }))}
                      onChange={(selectedOption) => {
                        setFieldValue("entityId", selectedOption?.value || ""),
                          setLocationCatgoryId(selectedOption?.value || "");
                      }}
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
                  {/* location */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Location
                    </label>

                    <Select
                      name="ParkId"
                      value={
                        allParks
                          ?.filter((park) => park.isActive)
                          .map((park) => ({
                            value: park.id,
                            label: park.name,
                          }))
                          .find((option) => option.value === values.ParkId) ||
                        null
                      }
                      options={allParks
                        ?.filter((park) => park.isActive)
                        .map((park) => ({
                          value: park.id,
                          label: park.name,
                        }))}
                      onChange={(selectedOption) =>
                        setFieldValue("ParkId", selectedOption?.value || "")
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
                    <label
                      htmlFor="mobileNumber"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <Field
                      as="select"
                      name="status"
                      className={`mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    >
                      <option value="">Select Status</option>
                      <option value="CONFIRMED">Success</option>
                      <option value="INPROCESS">In Process</option>
                      <option value="FAILED">Failed</option>
                    </Field>
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                      disabled={isFetchFailureUserTransactionReport}
                    >
                      Search
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
            <AgGridTable
              ExportName="UserStatusTransactionReport"
              rowData={rowData}
              columnDefs={columnDefs}
              isFetchLoading={isFetchFailureUserTransactionReport}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default FailedTransactions;
