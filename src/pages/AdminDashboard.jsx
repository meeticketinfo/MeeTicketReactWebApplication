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
import CountUp from "react-countup";
import { superballs } from "ldrs";

function AdminDashboard() {
  superballs.register();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [DashboardDate, setDashboardDate] = useState(getCurrentDate());
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
  const parkId = decodedTokenData?.data?.ParkId;
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
    allZooDashboard,
    fetchAllZooDashBoardCounts,
    isFetchZooDashboardLoading,
    isFetchZooDashboardTicketWiseLoading,
    allZooDashboardTicketWise,
    fetchAllZooDashBoardCountsTicketWise,
  } = useDashboardStore();
  console.log("allZooDashboardTicketWise", allZooDashboardTicketWise);
  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: "",
    entityId: "",
  };

  useEffect(() => {
    fetchAllDashboardCounts(roleDetails);
    fetchAllZooDashBoardCounts(getCurrentDate());

    if (role === "ROLE_ADMIN" || role === "ROLE_ZOOPARKADMIN") {
      fetchAllZooDashBoardCountsTicketWise();
    }
    // fetchAllEntityBookingsByFilters(null, null, initialValues);
    fetchAllEntityWiseCounts().then((data) => setPieChartData(data));
    if (role === "ROLE_NODALOFFICER") {
      fetchAllNodalOfficerParks(null, null, {}, userId);
    } else {
      fetchAllParks();
    }
  }, []);

  useEffect(() => {
    fetchAllEntityBookingsByFilters( initialValues);
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
        fromDate: values.fromDate ? `${values.fromDate}` : "",
        toDate: values.toDate ? `${values.toDate}` : "",
      };
      setSubmitting(true);
      const filters = formattedValues;
      const result = await fetchAllEntityBookingsByFilters(filters);
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
      // count: allCounts?.totalAmount,
      count: allCounts?.totalAmount || "0",
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
  ];
  const dashboardCardsCountByRole = [
    {
      lableName: "Facility Bookings",
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

  const dashboardCardCountZooTicketWise = [
    {
      lableName: "Total Bookings",
      count: allZooDashboardTicketWise?.totalBookingCount || "0",
      ChildCount: allZooDashboardTicketWise?.childCount || "0",
      AdultCount: allZooDashboardTicketWise?.adultCount || "0",
      OthersCount: allZooDashboardTicketWise?.othersCount || "0",
      isCondition: true,
      icon: IoTicketSharp,
    },
  ];

  const cardsToDisplay =
    roleDetails?.name === "ROLE_ADMIN" ||
    roleDetails?.name === "ROLE_ZOOPARKADMIN"
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
    <>
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

        {/* ZOO DASHBOARD */}
        {( roleDetails?.name === "ROLE_ZOOPARKADMIN") &&
          dashboardCardCountZooTicketWise.map((card, index) => (
            <div
              key={index}
              className="flex flex-col justify-center col-span-full relative   md:col-span-4  xl:col-span-3 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200"
            >
              <span className="text-xs font-medium absolute top-0 right-0 px-[4px] rounded-es-md rounded-se-md bg-gray-400 text-white">
                Ticket Wise{" "}
              </span>
              <div className="flex items-center">
                <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-gray-400 border  rounded-lg shadow-md shadow-gray-300">
                  <card.icon className="text-3xl font-bold text-white dark:text-gray-100" />
                </div>
                <div className="flex-shrink-0 ml-3">
                  <span className="text-2xl font-bold leading-none text-gray-600">
                    <CountUp
                      end={card.count}
                      duration={2}
                      prefix=""
                      separator=","
                    />
                  </span>
                  {!card.isCondition && (
                    <h1 className="text-sm font-normal text-gray-500 mt-2">
                      Total Tickets Amount
                    </h1>
                  )}
                  {/* others */}

                  {card.isCondition && (
                    <div className="flex gap-2">
                      {/* adult */}
                      {card.isCondition && (
                        <div className="flex gap-[2px] items-center">
                          <h3 className="text-sm font-normal text-gray-500">
                            Adult:
                          </h3>
                          <h3 className="text-sm  font-semibold text-gray-500">
                            {card.AdultCount}
                          </h3>
                        </div>
                      )}
                      {/* child */}

                      <div className="flex gap-[2px] items-center">
                        <h3 className="text-sm font-normal  text-gray-500">
                          Child:
                        </h3>
                        <h3 className="text-sm font-norm font-semibold text-gray-500">
                          {card.ChildCount}
                        </h3>
                      </div>
                    </div>
                  )}
                  {card.isCondition && (
                    <div className="flex gap-[2px] items-center">
                      <h3 className="text-sm font-normal text-gray-500">
                        Other Tickets:
                      </h3>
                      <h3 className="text-sm font-semibold text-gray-500">
                        {card.OthersCount}
                      </h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        <div className="col-span-full lg:col-span-6  xl:col-span-6"></div>
        {roleDetails?.name === "ROLE_ZOOPARKADMIN" ? (
          <>
            <div className="col-span-full ">
              <h1 className=" text-xl font-bold">
                Facilities and Ticket Details
              </h1>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 ">
                <div>
                  <label
                    htmlFor="fromDate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Search By Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    className={`mt-1 block px-2 py-1 border w-full
               border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm`}
                    // min={getCurrentDate()}
                    value={DashboardDate}
                    onChange={(e) => {
                      setDashboardDate(e.target.value);
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      fetchAllZooDashBoardCounts(DashboardDate);
                    }}
                    className="bg-green-700 text-base text-white rounded-lg hover:py-[3px] px-3 py-1 hover:bg-gray-100 hover:text-green-700 hover:border hover:border-green-700 "
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
            {isFetchZooDashboardLoading ? (
              <div className="px-96 py-20">
                <l-superballs
                  size="40"
                  speed="1.4"
                  color="black"
                ></l-superballs>
              </div>
            ) : (
              allZooDashboard.data?.map((services, serviceIndex, index) => (
                <div
                  key={serviceIndex}
                  className="flex flex-col col-span-full   md:col-span-4  xl:col-span-3 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-gray-400 border  rounded-lg shadow-md shadow-gray-300">
                      <img
                        src={services.service[0].serviceImage}
                        // src={img}
                        className="text-3xl font-bold text-white dark:text-gray-100  w-8"
                      />
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <span className="text-2xl font-bold leading-none text-gray-600">
                        <CountUp
                          end={services.service[0]?.totalBookings}
                          duration={2}
                          prefix=""
                          separator=","
                        />
                      </span>
                      <h1 className="text-xs font-medium">
                        {services.service[0].serviceName}
                      </h1>
                      <div className="flex gap-2">
                        {services.service.map((Variant, variantIndex) => (
                          <div
                            key={variantIndex}
                            className="flex gap-[2px] items-center"
                          >
                            <h3 className="text-sm font-normal text-gray-500">
                              {Variant.serviceVariantName}:
                            </h3>
                            <h3 className="text-base font-semibold text-gray-500">
                              {Variant.totalBooking}
                            </h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isFetchZooDashboardLoading ? (
              <div className="px-96 py-20"></div>
            ) : (
              allZooDashboard.service?.map((service, serviceIndex, index) => (
                <div
                  key={serviceIndex}
                  className="flex flex-col col-span-full  md:col-span-4 justify-center sm:col-span-3 xl:col-span-3 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white  bg-gray-400 rounded-lg shadow-md shadow-gray-300">
                      <img
                        src={service.serviceImage}
                        // src={Aqua}
                        className="text-3xl font-bold text-white dark:text-gray-100 w-8"
                      />
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <span className="text-2xl font-bold leading-none text-gray-600">
                        <CountUp
                          end={service.serviceVariants[0].totalBookings}
                          duration={2}
                          prefix=""
                          separator=","
                        />
                      </span>
                      <h1 className="text-sm font-medium">
                        {service.serviceName}
                      </h1>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        ) : null}

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
    </>
  );
}

export default AdminDashboard;
