import { useEffect, useState } from "react";
import AdminLayout from "../../../layouts/AdminLayout";
import AgGridTable from "../../../components/tables/AgGridTable"; // Adjust import path as needed
import { useBookingsStore } from "../../../store/masters/bookingsStore";
import { FacilityServices } from "../../../components/bookings_management/FacilityServices";
import {
  formatToCurrency,
  getCurrentDate,
} from "../../../utils/TypographyHelper";
import BackButton from "../../../components/BackButton";
import useAuthStore from "../../../store/authStore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useParkStore } from "../../../store/masters/parksStore";
import { useDashboardStore } from "../../../store/dashboard/dashboardStore";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import TransactionQr from "../../../components/bookings_management/TransactionQr";
import Select from "react-select";

export default function AdminBookings() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    allParks,
    fetchAllParks,
    fetchAllNodalOfficerParks,
    allNodalOfficerParks,
    isFetchAllNodalOfficerParksLoading,
  } = useParkStore();
  const {
    allCounts,
    fetchAllDashboardCounts,
    allPieCharts,
    fetchAllEntityWiseCounts,
    fetchAllEntityBookingsByFilters,
    allEntityBookings,
    isFetchEntityBookingsLoading,
    totalEntityBookingRecords,
  } = useDashboardStore();
  const {
    allBookings,
    fetchAllBookings,
    isFetchAllBookingsLoading,
    FirstStepTransactionResponse,
    IsFirstStepTransaction,
    setIsFirstStepTransaction,
    setIsBookingFormVisible,
    isBookingFormVisible,
    setPaymentStatus,
  } = useBookingsStore();
  // console.log("FirstStepTransactionResponse", FirstStepTransactionResponse);
  // const [isBookingFormVisible, setIsBookingFormVisible] = useState(false);
  const { sidebarMenuItems, roleDetails, decodedTokenData } = useAuthStore();
  const role = roleDetails?.name;
  const userId = decodedTokenData?.data?.UserId;
  const isCounterEnabled = decodedTokenData?.data?.IsWebCounter;

  useEffect(() => {
    fetchAllBookings();
    // fetchAllParks();
    if (role === "ROLE_NODALOFFICER") {
      fetchAllNodalOfficerParks(null, null, {}, userId);
    } else {
      fetchAllParks();
    }
  }, []);

  useEffect(() => {
    fetchAllEntityBookingsByFilters(initialValues);
  }, []);

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: "",
    entityId: role === "ROLE_ADMIN" ? decodedTokenData?.data?.ParkId : "",
  };

  const parksToRender =
    role === "ROLE_NODALOFFICER" ? allNodalOfficerParks : allParks;

  const [columnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    {
      field: "transactionId",
      headerName: "Transaction Id",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value && params.value.trim() !== "" ? params.value : "N/A",
    },
    {
      field: "userName",
      headerName: "User Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "parkName",
      headerName: "Location Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "facilityName",
      headerName: "Facility Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "serviceName",
      headerName: "Service Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "serviceVariantName",
      headerName: "Service Variant Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "bookingRegistredDate",
      headerName: "Booking Date",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "amount",
      headerName: "Booking Amount",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <div style={{ display: "flex align-center", gap: "0.5rem" }}>
          <NavLink
            end
            to={`/entity-bookings/view-details/${params.data?.bookingId}`}
            className="bg-gray-100 text-white px-4 py-2 rounded-md hover:bg-gray-200 hover:text-gray-100 transition"
          >
            <span className="text-blue-v2">View Bookings</span>
          </NavLink>
        </div>
      ),
      flex: 1,
      headerClass: "text-blue-v2",
    },
  ]);

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formattedValues = {
        ...values,
        fromDate: values.fromDate ? `${values.fromDate}T00:00:00.000Z` : "",
        toDate: values.toDate ? `${values.toDate}T23:59:00.000Z` : "",
      };
      setSubmitting(true);
      const filters = formattedValues;
      const result = await fetchAllEntityBookingsByFilters(null, null, filters);
      if (result?.data?.status === 200) {
        resetForm();
      } else {
        // Handling a response with an unexpected status code
        toast.error(
          result?.data?.message || "Unexpected response. Please try again."
        );
      }
    } catch (error) {
      // Catching and handling any errors during the API call
      const errorMessage =
        error?.response?.data?.message ||
        "Error creating user. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Bookings
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {!isBookingFormVisible ? (
              role === "ROLE_ADMIN" &&
              isCounterEnabled.toLowerCase() === "true" && (
                <button
                  className="btn bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                  onClick={() => setIsBookingFormVisible(true)} // Show booking form
                >
                  Book Tickets
                </button>
              )
            ) : (
              // <button
              //   className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
              //   onClick={() => setIsBookingFormVisible(false)} // Hide booking form
              // >
              //   Back
              // </button>
              <BackButton
                label="Back"
                onClick={() => {
                  setIsBookingFormVisible(false);
                  setIsFirstStepTransaction(false);
                  setPaymentStatus({});
                  localStorage.removeItem("booking-process-store");
                }}
                className="bg-blue-600 hover:bg-blue-700"
                // disabled={isSubmitting}
              />
            )}
          </div>
        </div>

        {/* Booking Form Section */}
        {/* {isBookingFormVisible && <FacilityServices />} */}

        {/* Table Section - Show only if form is not visible */}
        {!isBookingFormVisible ? (
          <div className="mb-8">
            <div>
              <Formik
                initialValues={initialValues}
                onSubmit={(values, actions) => onSubmit(values, actions)}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
                      {role !== "ROLE_ADMIN" && (
                        // <div>
                        //   <label className="block text-xs font-medium">
                        //     Location
                        //   </label>
                        //   <Field
                        //     as="select"
                        //     name="entityId"
                        //     className={`mt-1 block w-full px-2 py-1 border
                        //     border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                        //   >
                        //     <option value="">Select </option>
                        //     {parksToRender
                        //       ?.filter((park) => park.isActive)
                        //       .map((park) => (
                        //         <option key={park.id} value={park.id}>
                        //           {park.name}
                        //         </option>
                        //       ))}
                        //   </Field>

                        // </div>
                        <div>
                          <label className="block text-xs font-medium">
                            Location
                          </label>
                          <Select
                            name="entityId"
                            options={parksToRender
                              ?.filter((park) => park.isActive)
                              .map((park) => ({
                                value: park.id,
                                label: park.name,
                              }))}
                            onChange={(selectedOption) => {
                              setFieldValue(
                                "entityId",
                                selectedOption?.value || ""
                              );
                            }}
                            className="mt-[4px] text-sm"
                            classNamePrefix="react-select"
                            placeholder="Locations"
                            isClearable
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
                                backgroundColor: isFocused
                                  ? "#F8F8F8"
                                  : "white",
                                color: isFocused ? "#0C3771" : "#6D7072",
                                cursor: "pointer",
                              }),
                            }}
                          />
                        </div>
                      )}
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
                          // min={getCurrentDate()}
                          onChange={(e) => {
                            const fromDateValue = e.target.value;
                            setFieldValue("fromDate", fromDateValue);
                            if (
                              new Date(fromDateValue) > new Date(values.toDate)
                            ) {
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
                          type="date"
                          name="toDate"
                          className={`mt-1 block w-full px-2 py-1 border
    border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                          min={values.fromDate || getCurrentDate()} // Ensure toDate can't be earlier than fromDate
                          onChange={(e) => {
                            const toDateValue = e.target.value;
                            setFieldValue("toDate", toDateValue);
                          }}
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="bg-green-700 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-green-700 hover:border hover:border-green-700 "
                          disabled={isFetchEntityBookingsLoading}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            {/* <AgGridTable
            isFetchLoading={isFetchAllBookingsLoading}
            columnDefs={columnDefs}
            rowData={allBookings || []}
            defaultColDef={{
              sortable: true,
              filter: true,
              resizable: true,
            }}
            pagination={true}
          /> */}
            <AgGridTable
              isFetchLoading={isFetchEntityBookingsLoading}
              rowData={allEntityBookings || []}
              columnDefs={columnDefs}
              // onPageChange={handlePageChange}
              totalRecords={totalEntityBookingRecords}
              enableAdvancedFilter={true}
           
            />
          </div>
        ) : (
          <FacilityServices />
        )}
      </div>
    </AdminLayout>
  );
}
