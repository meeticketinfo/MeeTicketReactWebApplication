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
import { toast, ToastContainer } from "react-toastify";
import { NavLink } from "react-router-dom";
import TransactionQr from "../../../components/bookings_management/TransactionQr";
import Select from "react-select";
import { useEntityTypesStore } from "../../../store/masters/entityTypesStore";
import { useDepartmentTypesStore } from "../../../store/masters/departmentTypesStore";
import PopupModal from "../../../components/utils/popup_modal/PopupModal";

export default function AdminBookings() {
  const [openModal, setOpenModal] = useState(false);
  const {
    fetchAllEntityBookingsByFilters,
    allEntityBookings,
    isFetchEntityBookingsLoading,
    totalEntityBookingRecords,
  } = useDashboardStore();
  const {
    fetchAllBookings,
    setIsFirstStepTransaction,
    setIsBookingFormVisible,
    isBookingFormVisible,
    setPaymentStatus,
    saveCggDetails,
    isCggLoading
  } = useBookingsStore();

  const [cgg, setCgg] = useState(null);

  
  const {
    allParks,
    fetchAllParks,
    fetchAllNodalOfficerParks,
    allNodalOfficerParks,
    isFetchAllNodalOfficerParksLoading,
  } = useParkStore();

  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();
  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  // const [isBookingFormVisible, setIsBookingFormVisible] = useState(false);
  const {  roleDetails, decodedTokenData } = useAuthStore();
  const role = roleDetails?.name;
  const userId = decodedTokenData?.data?.UserId;

  const isCounterEnabled = decodedTokenData?.data?.IsWebCounter;
  const parkId = decodedTokenData?.data?.ParkId;
  useEffect(() => {
    fetchAllBookings();
    fetchAllDepartmentTypes();
    fetchAllEntityTypes();
    // fetchAllParks();
    if (role === "ROLE_NODALOFFICER") {
      fetchAllNodalOfficerParks(null, null, {}, userId);
    } else {
      fetchAllParks();
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchAllEntityBookingsByFilters(initialValues);
       
        setCgg(res.data.data.data.isCggEnable)

      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
  
    fetchData();
  }, []);
  

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: getCurrentDate(),
    entityTypeId: "",
    departmentId: "",
    entityId:
      role === "ROLE_ADMIN" || role === "ROLE_ZOOPARKADMIN"
        ? decodedTokenData?.data?.ParkId
        : "",
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
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value && params.value.trim() !== "" ? params.value : "N/A",
    },
    {
      field: "userPhoneNumber",
      headerName: "User Mobile Number",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        !params.value || params.value.trim() === "" ? "N/A" : params.value,
    },
    {
      field: "parkName",
      headerName: "Location Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "departmentName",
      headerName: "Department",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "entityTypeName",
      headerName: "Location category",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    
    {
      field: "facilityName",
      headerName: "Facility Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "serviceName",
      headerName: "Sub Facility Name",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "serviceVariantName",
      headerName: "Ticket Type",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "validityDate",
      headerName: "Booking Date",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => ( params.value?? "N/A"),
    },
    {
      field: "amount",
      headerName: "Amount(Per Ticket)",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "totalTicketAmount",
      headerName: "Total Tickets Amount",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        formatToCurrency(params.value, "INR", "en-IN") || "00:00",
    },
    {
      field: "modeOfPayment",
      headerName: "Mode of Payment",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
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
        fromDate: values.fromDate ? `${values.fromDate}` : "",
        toDate: values.toDate ? `${values.toDate}` : "",
        departmentId: values.departmentId,
        entityTypeId: values.entityTypeId,
      };
      setSubmitting(true);
      const filters = formattedValues;
      const result = await fetchAllEntityBookingsByFilters(filters);

     
      if (result?.data?.status === 200) {
        // resetForm();
      } else {
        // Handling a response with an unexpected status code
        toast.error(result?.data?.message);
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

  const handleCggSubmit = async () => {
    const cggPayload = {
      IsCggEnable: cgg,
    };
    const res = await saveCggDetails(cggPayload);

    if (res.data.status === 200) {
      toast.success("CGG Update Sucessfuly..");
      setOpenModal(false);
    } else {
      toast.error("Someting went wrong please try again ");
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-2">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-2xl text-gray-600 dark:text-gray-100 font-bold">
              Individual Booking Details
            </h1>
          </div>
          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
            {!isBookingFormVisible ? (
              <div className="flex gap-2 ">
                {parkId==="100"&&<div className="flex items-center shadow px-2 py-1">
                  <label className="text-sm flex ">
                    <input
                      type="checkbox"
                      checked={cgg}
                      // value={cgg}
                      onChange={(e) => {
                        setCgg(e.target.checked);
                        setOpenModal(true);
                      }}
                      className="sr-only peer "
                    />
                    <div className="relative w-11 h-6 bg-gray-200 rounded-full   peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-v2"></div>
                    <span className="ms-3 text-md font-semibold text-gray-900 ">
                      {cgg ? "CGG ON" : "CGG OFF"}
                    </span>
                  </label>
                </div>}
                {(role === "ROLE_ADMIN" || role === "ROLE_ZOOPARKADMIN") &&
                  isCounterEnabled?.toLowerCase() === "true" && (
                    <button
                      className="btn-sm bg-gray-900 text-gray-100 hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-white"
                      onClick={() => setIsBookingFormVisible(true)} // Show booking form
                    >
                      Book Tickets
                    </button>
                  )}
              </div>
            ) : (
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
                      {role !== "ROLE_ADMIN" &&
                        role !== "ROLE_ZOOPARKADMIN" && (
                          <>
                            <div>
                              <label className="block text-xs font-medium">
                                Location
                              </label>
                              <Select
                                name="entityId"
                                options={parksToRender?.map((park) => ({
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
                            {/* <div>
                        <label className="block text-xs font-medium text-gray-700">
                          Location Category
                        </label>

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
                                (option) =>
                                  option.value === values.locationCategoryId
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
                      </div> */}
                          </>
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
                          name="entityTypeId"
                          value={
                            allEntityTypes
                              ?.filter((dept) => dept.isActive)
                              .map((dept) => ({
                                value: dept.entityTypeId,
                                label: dept.entityTypeName,
                              }))
                              .find(
                                (option) => option.value === values.entityTypeId
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
                              "entityTypeId",
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
                      <div className="flex items-end">
                        <button
                          type="submit"
                          className="bg-green-700 text-xs text-white rounded-lg  px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700 "
                          // disabled={isFetchEntityBookingsLoading}
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            <AgGridTable
              ExportName="Individual Booking Details"
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

        <PopupModal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          // title={"Add Sub-Facility"}
          size="small"
          overlayClassName="bg-gray-800 bg-opacity-60"
          contentClassName="bg-white"
          defaultBodyPadding={true}
        >
          <div className="px-20 py-14">
            <h1 className="text-blue-v1 font-semibold">
              {cgg
                ? "Are you sure want to enable CGG ?"
                : "Are you sure want to disable CGG ?"}
            </h1>
            <div className="flex justify-center gap-6 mt-4">
              <button
                onClick={handleCggSubmit}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-3 py-1 shadow-md rounded-md"
              >
               {isCggLoading ? (
                  <span className="px-8">
                    <l-tailspin
                      size="15"
                      stroke="5"
                      speed="0.9"
                      color="white"
                    ></l-tailspin>
                  </span>
                ) : (
                  "Proceed"
                )}
              </button>
              <button
                onClick={() => {
                  setOpenModal(false);
                }}
                className="bg-blue-v1 hover:bg-blue-v2 text-white px-5 py-1 shadow-md rounded-md"
              >
                Deny
              </button>
            </div>
          </div>
        </PopupModal>
      </div>
    </AdminLayout>
  );
}
