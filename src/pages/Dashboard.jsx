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
import { formatToStandardDate, formatToStandardTime } from "../utils/TypographyHelper";
import PieChart from "../config/dashboard/Piecharts";
import { data } from "autoprefixer";
import { useParkStore } from "../store/masters/parksStore";

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pieChartData, setPieChartData] = useState([]);
  const { allParks, fetchAllParks } = useParkStore();
  const { allCounts, fetchAllDashboardCounts, allPieCharts, fetchAllEntityWiseCounts, fetchAllEntityBookingsByFilters, allEntityBookings, isFetchEntityBookingsLoading } = useDashboardStore();

  const initialValues = {
    fromDate: '',
    toDate: '',
    parkId: '',
  }
  //console.log(allEntityBookings , 'bookingd')
  useEffect(() => {
    fetchAllDashboardCounts();
    fetchAllEntityBookingsByFilters(null, null, initialValues);
    fetchAllParks();
    fetchAllEntityWiseCounts().then(data => setPieChartData(data));
  }, []);

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setSubmitting(true);
      const filters = values
      const result = await fetchAllEntityBookingsByFilters(null, null, filters);
      if (result?.data?.status === 200) {
        resetForm();
      } else {
        // Handling a response with an unexpected status code
        toast.error(result?.data?.message || "Unexpected response. Please try again.");
      }
    } catch (error) {
      // Catching and handling any errors during the API call
      const errorMessage = error?.response?.data?.message || "Error creating user. Please try again.";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = (resetForm) => {
    alert();
    resetForm();
    fetchAllEntityBookingsByFilters("", "", {
      fromDate: '',
      toDate: '',
      parkId: '',
    })
  }
  const dashboardCards = [
    {
      lableName: "Total Tickets",
      count: allCounts?.totalCountById || '0',
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

  const [dashboardColumnDefs] = useState([
    {
      headerName: "S.No",
      valueGetter: "node.rowIndex + 1",
      width: 100,
      headerClass: "text-blue-v2",
    },
    {
      field: "parkName",
      headerName: "Entity Name",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "bookingId",
      headerName: "Booking Id",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "N/A",
    },
    {
      field: "userName",
      headerName: "User",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "0",
    },
    {
      field: "amount",
      headerName: "Total Amount",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) => params.value || "00:00",
    },
    {
      field: "bookingRegistredDate",
      headerName: "Date",
      flex: 1,
      headerClass: "text-blue-v2",
      valueFormatter: (params) =>
        params.value ? (params.value) : "N/A",
    },
  ]);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
            {/* Dashboard actions */}
            <div className="sm:flex sm:justify-between sm:items-center mb-8">
              {/* Left: Title */}
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-600 dark:text-gray-100 font-bold">
                  Dashboard
                </h1>
              </div>

              {/* Right: Actions */}
              <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {/* Datepicker built with flatpickr */}
                {/* <Datepicker align="right" /> */}
              </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-12 gap-6">
              {dashboardCards &&
                dashboardCards.map((card, index) => (
                  <DashboardCard01
                    key={index} // It's important to provide a key when rendering lists
                    lableName={card.lableName}
                    count={card.count}
                    percentageChange={card.percentageChange}
                    icon={card.icon}
                  />
                ))}
              <DashboardCard07>
                <div className="flex">
                  <PieChart data={allPieCharts} title='Total Booking By Entity' angleKey="entityWiseTotalBookings" />
                  <PieChart data={allPieCharts} title='Total Amount By Entity' angleKey="entityWiseTotalAmount" />
                </div>
                <div>
                  <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) =>
                      onSubmit(values, actions)
                    }
                  >
                    <Form>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
                        <div>
                          <label className="block text-sm font-medium">Park</label>
                          <Field
                            as="select"
                            name="parkId"
                            className={"mt-1 block w-full px-2 py-1 border-gray-300"}
                          >
                            <option value="">Select </option>
                            {allParks.map((park) => (
                              <option key={park.id} value={park.id}>
                                {park.name}
                              </option>
                            ))}
                          </Field>
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
                            className="mt-1 block w-full px-2 py-1 border-gray-300"
                            placeholder="Enter date of birth"
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
                            className="mt-1 block w-full px-2 py-1 border-gray-300"
                            placeholder="Enter date of birth"
                          />
                        </div>
                        <div className="flex justify-center p-2">
                          <button
                            type="submit"
                            className="bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                            disabled={isFetchEntityBookingsLoading}
                          >
                            Search
                          </button>
                          {/* <button
                            type="submit"
                            onClick={() => onReset()}
                            className=" bg-blue-v1 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-blue-v1 hover:border hover:border-blue-v1 "
                            disabled={isFetchEntityBookingsLoading}
                          >
                            Reset
                          </button> */}
                        </div>
                      </div>
                    </Form>
                  </Formik>
                </div>
                <AgGridTable
                  rowData={allEntityBookings || []}
                  columnDefs={dashboardColumnDefs}
                />
              </DashboardCard07>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
