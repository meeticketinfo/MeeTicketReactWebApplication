import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
// import FilterButton from "../components/DropdownFilter";
import Datepicker from "../components/Datepicker";
import DashboardCard01 from "../partials/dashboard/DashboardCard01";
import DashboardCard07 from "../partials/dashboard/DashboardCard07";
import { IoTicketSharp } from "react-icons/io5";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaChildren } from "react-icons/fa6";
import { HiCurrencyRupee } from "react-icons/hi";
import AgGridTable from "../components/tables/AgGridTable";
import { FaIndianRupeeSign } from "react-icons/fa6";
import dashboardColumnDefs from "../config/agGrid/dashboardColumnDefs";
import { useDashboardStore } from "../store/dashboard/dashboardStore";
import {
  formatToCurrency,
  formatToStandardDate,
  formatToStandardTime,
  getCurrentDate,
} from "../utils/TypographyHelper";
import PieChart from "../config/dashboard/Piecharts";
import { data } from "autoprefixer";
import { useParkStore } from "../store/masters/parksStore";
import AdminLayout from "../layouts/AdminLayout";
import ServerSideAgGridTable from "../components/tables/ServerSideAgGridTable";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pieChartData, setPieChartData] = useState([]);
  const {
    allParks,
    fetchAllParks,
    fetchAllNodalOfficerParks,
    allNodalOfficerParks,
    isFetchAllNodalOfficerParksLoading,
  } = useParkStore();
  const { sidebarMenuItems, roleDetails, logout, decodedTokenData } =
    useAuthStore();
  const role = roleDetails?.name;
  const userId = decodedTokenData?.data?.UserId;

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: "",
    entityId: "",
  };
  // alert("i'm in");
  useEffect(() => {
    fetchAllDashboardCounts(null, null, {}, roleDetails);
    // fetchAllEntityBookingsByFilters(null, null, initialValues);
    fetchAllEntityWiseCounts().then((data) => setPieChartData(data));
    if (role === "ROLE_NODALOFFICER") {
      fetchAllNodalOfficerParks(null, null, {}, userId);
    } else {
      fetchAllParks();
    }
  }, []);

  useEffect(() => {
    fetchAllEntityBookingsByFilters(pageIndex, pageSize, initialValues);
  }, [pageIndex, pageSize]);

  const handlePageChange = (newPageIndex, newPageSize) => {
    setPageIndex(newPageIndex);
    setPageSize(newPageSize);
  };

  const parksToRender =
    role === "ROLE_NODALOFFICER" ? allNodalOfficerParks : allParks;

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

  const onReset = (resetForm) => {
    resetForm();
    fetchAllEntityBookingsByFilters("", "", {
      fromDate: "",
      toDate: "",
      parkId: "",
    });
  };
  const dashboardCards = [
    {
      lableName: "Total Tickets",
      count: allCounts?.totalCountById || "0",
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      lableName: "Total Income",
      count: allCounts?.totalAmount,
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
  ];
  const dashboardCardsCountByRole = [
    {
      lableName: "Total Bookings",
      count: allCounts?.totalBookingsByRole || "0",
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      lableName: "Total Amount",
      count: allCounts?.totalAmountByRole,
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
  ];

  const cardsToDisplay =
    roleDetails?.name === "ROLE_ADMIN"
      ? dashboardCardsCountByRole
      : dashboardCards;
  const [dashboardColumnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      minWidth: 80,
      maxWidth: 80,
      headerClass: "text-blue-v2",
    },
    // {
    //   field: "bookingId",
    //   headerName: "Booking Id",
    //   flex: 1,
    //   headerClass: "text-blue-v2",
    //   valueFormatter: (params) =>
    //     params.value && params.value.trim() !== "" ? params.value : "N/A",
    // },
    {
      field: "transactionId",
      headerName: "Transaction ID",
      flex: 2,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "userPhoneNumber",
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
      field: "modeOfPayment",
      headerName: "mode Of Payment",
      // flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
  ]);

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
        <div className="sm:flex sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
              Dashboard
            </h1>
          </div>

          <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2"></div>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-12 gap-6">
          {cardsToDisplay &&
            cardsToDisplay.map((card, index) => (
              <DashboardCard01
                key={index} // It's important to provide a key when rendering lists
                lableName={card.lableName}
                count={card.count}
                percentageChange={card.percentageChange}
                icon={card.icon}
              />
            ))}
          {roleDetails?.name == "ROLE_SUPERADMIN" && (
            <DashboardCard07>
              <div className="flex">
                <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
                  <PieChart
                    data={allPieCharts}
                    title="Total Booking By Location"
                    angleKey="entityWiseTotalBookings"
                  />
                </div>
                <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
                  <PieChart
                    data={allPieCharts}
                    title="Total Amount By Location"
                    angleKey="entityWiseTotalAmount"
                  />
                </div>
              </div>
            </DashboardCard07>
          )}

          <DashboardCard07 header={true} title="Location Bookings">
            <div className="">
              <div>
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values, actions) => onSubmit(values, actions)}
                >
                  {({ values, setFieldValue }) => (
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3">
                        {(role === "ROLE_SUPERADMIN" ||
                          role === "ROLE_NODALOFFICER") && (
                          <div>
                            <label className="block text-xs font-medium">
                              Location
                            </label>
                            <Field
                              as="select"
                              name="entityId"
                              className={`mt-1 block w-full px-2 py-1 border
                              border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                            >
                              <option value="">Select </option>
                              {parksToRender
                                ?.filter((park) => park.isActive)
                                ?.map((park) => (
                                  <option key={park.id} value={park.id}>
                                    {park.name}
                                  </option>
                                ))}
                            </Field>
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
                                new Date(fromDateValue) >
                                new Date(values.toDate)
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
              <AgGridTable
                isFetchLoading={isFetchEntityBookingsLoading}
                rowData={allEntityBookings || []}
                columnDefs={dashboardColumnDefs}
                onPageChange={handlePageChange}
                totalRecords={totalEntityBookingRecords}
                enableAdvancedFilter={true}
              />
            </div>
          </DashboardCard07>
        </div>
      </div>
    </AdminLayout>
  );
}

export default Dashboard;
