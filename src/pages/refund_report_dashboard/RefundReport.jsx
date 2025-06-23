import React, { useEffect, useState } from "react";
import { getDateRange } from "../../utils/Helper";
import { useParkStore } from "../../store/masters/parksStore";
import { useEntityTypesStore } from "../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../store/masters/departmentTypesStore";
import { Field, Form, Formik } from "formik";
import Select from "react-select";
import AdminLayout from "../../layouts/AdminLayout";
import { Link } from "react-router-dom";
import AgGridTable from "../../components/tables/AgGridTable";

const RefundReport = () => {
  const { fromDate, toDate } = getDateRange("today");
  const { allParks, fetchAllParks } = useParkStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  useEffect(() => {
    fetchAllEntityTypes();
    fetchAllDepartmentTypes();
    fetchAllParks({});
  }, []);
  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",

      maxWidth: "80",
      headerClass: "text-blue-v2",
    },

    {
      field: "travelDate",
      headerName: "Date of Transaction",
      maxWidth: "160",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "N/A",
    },
    {
      headerName: "Actions",
      field: "actions",
      maxWidth: "100",
      //   hide: email === "esdadmin@gmail.com",
      cellRenderer: (params) => {
        return (
          <div className="flex align-center gap-2">
            <>
              <button
                className={`bg-green-400text-white leading-normal px-2 py-1 mt-1.5 rounded-md`}
              >
                Pay Now
              </button>
            </>
          </div>
        );
      },
      flex: 1,
      headerClass: "text-blue-v2",
    },
    {
      field: "utr",
      headerName: "RefundStatus",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value || params.value === " " ? params.value : "N/A",
    },
    {
      field: "noOfCancelTickets",
      minWidth: 100,
      headerName: "Mobile Number of user",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },

    {
      field: "noOfConfirmTickets",
      headerName: "Department",
      maxWidth: "140",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "noOfTickets",
      headerName: "Location Category",
      
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "totalTicketFare",
      headerName: "Location name",
      
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "totalCancelledTicketFare",
      headerName: "Amount",
      maxWidth: "100",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "totalConfirmedTicketFare",
      headerName: "No of Tickets",
      maxWidth: "120",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => `${params.value} ` || "0",
    },
    {
      field: "paytM_CONFIRMED_AMOUNT",
      headerName: "Mode of Transaction",
       maxWidth: "170",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "0",
    },
    {
      field: "verifiedAmount",
      headerName: "Payment mode",
      maxWidth: "130",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "pendingVerifiedAmount",
      headerName: "Order ID",
      Width: "390",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
    {
      field: "settledPaymentAMount",
      headerName: "Booking ID",
      Width: "260",
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value ?? "N/A",
    },
  ]);
  const InitialValues = {
    fromDate: fromDate,
    toDate: toDate,
    departmentId: "",
    entityId: "",
    ParkId: "",
    phoneNumber: "",
  };
  const onSubmit = (values) => {
    console.log("values", values);
  };
  return (
    <>
      <AdminLayout>
        <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
          <div className="sm:flex sm:justify-between sm:items-center mb-2">
            <div className="mb-4 sm:mb-0 ">
              <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
                Refund Reports
              </h1>
            </div>

            <div>
              <Link
                to="/refund-dashboard"
                className="px-6 py-1.5 font-semibold bg-blue-v1 text-white rounded-md"
              >
                Back
              </Link>
            </div>
          </div>
           
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-full ">
              <Formik
                enableReinitialize={true}
                initialValues={InitialValues}
                onSubmit={onSubmit}
              >
                {({ values, setFieldValue, setValues }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3">
                      {/* from Date */}
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
                          className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                          onChange={(e) => {
                            const fromDateValue = e.target.value;
                            setFieldValue("fromDate", fromDateValue);
                            if (
                              new Date(fromDateValue) > new Date(values.toDate)
                            ) {
                              setFieldValue("toDate", fromDateValue);
                            }
                          }}
                        />
                      </div>
                      {/* to date */}
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
                          className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
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
                          onChange={(selectedOption) =>
                            setFieldValue(
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
                              .find(
                                (option) => option.value === values.entityId
                              ) || null // Use values.entityId
                          }
                          options={allEntityTypes
                            ?.filter((entity) => entity.isActive)
                            .map((entity) => ({
                              value: entity.entityTypeId,
                              label: entity.entityTypeName,
                            }))}
                          onChange={(selectedOption) =>
                            setFieldValue(
                              "entityId",
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
                      {/* location */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Location
                        </label>

                        <Select
                          name="ParkId"
                          value={
                            allParks
                              ?.filter(
                                (park) => park.isActive && park.isCounter
                              )
                              .map((park) => ({
                                value: park.id,
                                label: park.name,
                              }))
                              .find(
                                (option) => option.value === values.ParkId
                              ) || null
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
                      {/* mobile number */}
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
                              e.preventDefault(); // Prevent non-numeric characters
                            }
                          }}
                        />
                      </div>
                      {/*Mode of Transaction  */}
                      <div>
                        <label className="block text-sm font-medium">
                          Mode of Transaction
                        </label>
                        <Field
                          as="select"
                          name="typeOfBooking"
                          className={` block w-full px-2 py-1 border border-gray-300
                                   rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                        >
                          <option value="">Select Payment Status</option>
                          <option value="INITIATE">Initiate</option>
                          <option value="INPROCESS">In Process</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="FAILED">Failed</option>
                        </Field>
                      </div>
                      {/* Payment Mode */}
                      <div>
                        <label className="block text-sm font-medium">
                          Payment Mode
                        </label>
                        <Field
                          as="select"
                          name="typeOfBooking"
                          className={` block w-full px-2 py-1 border border-gray-300
                                   rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                        >
                          <option value="">Select Payment Status</option>
                          <option value="INITIATE">Initiate</option>
                          <option value="INPROCESS">In Process</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="FAILED">Failed</option>
                        </Field>
                      </div>
                      <div className="flex gap-2 items-end">
                        <button
                          type="submit"
                          className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                          // disabled={isFetchEntityBookingsLoading}
                        >
                          Search
                        </button>
                        <button
                          type="button"
                          className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                          onClick={() => {
                            const {
                              fromDate: resetFromDate,
                              toDate: resetToDate,
                            } = getDateRange("today");
                            // Reset form values and filters
                            localStorage.removeItem(
                              "UserTransactionReportFilter"
                            );
                            localStorage.setItem("range-filter", "today");
                            localStorage.removeItem("transactionPayload");
                            setValues({
                              fromDate: resetFromDate,
                              toDate: resetToDate,
                              departmentId: "",
                              entityId: "",
                              ParkId: "",
                            });
                            setActiveTab("today");

                            // Reset chart data by clearing relevant stores
                            fetchPaymentTransactionPieChartData({
                              fromDate: resetFromDate,
                              toDate: resetToDate,
                              locationId: "",
                              categoryId: "",
                              departmentId: "",
                              phoneNumber: "",
                            });
                            fetchSuccessButNotConfirmedPieChartData({
                              fromDate: fromDate,
                              toDate: toDate,
                              locationId: "",
                              categoryId: "",
                              departmentId: "",
                              phoneNumber: "",
                            });
                          }}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
          <div className="text-end mb-2 mr-2  ">
            <span className=" px-4 py-2 rounded-md font-semibold  bg-[#E5E7EB] text-blue-v2">Total Count:<span className="text-black"> 10</span></span>
            </div>
          <div>
            <AgGridTable
              ExportName="Refund Report"
              //   rowData={allMetroCumulativeBookingDetailsReports}
              columnDefs={columnDefs}
              isFetchLoading={false}
            />
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default RefundReport;
