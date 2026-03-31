import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
// import FilterButton from "../components/DropdownFilter";
import Datepicker from "../components/Datepicker";
import DashboardCard01 from "../partials/dashboard/DashboardCard01";
import DashboardCard07 from "../partials/dashboard/DashboardCard07";
import { IoReloadCircle, IoTicketSharp } from "react-icons/io5";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { useDashboardStore } from "../store/dashboard/dashboardStore";
import { formatToCurrency, getCurrentDate } from "../utils/TypographyHelper";
import PieChart from "../config/dashboard/Piecharts";
import { useParkStore } from "../store/masters/parksStore";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";
import CountUp from "react-countup";
import { superballs } from "ldrs";
import Select from "react-select";
import { useEntityTypesStore } from "../store/masters/entityTypesStore";
import useDashboardDetailedStore from "../store/dashboard/DashboardDetailedStore";
import { useDepartmentTypesStore } from "../store/masters/departmentTypesStore";
import { departmentToCategoryMapping } from "../utils/Helper";
import HoverPopup from "../utils/HoverPopup";
import DepartmentTable from "./park_admin/users/department_logins_table/DepartmentTable";
import { useBuspassDashboardStore } from "../components/rtc/dashboard/BuspassDashboard/store/buspassDashboardStore";
import WalkerpassOverallDetails from "../components/walkerPass/WalkerpassOverallDetails";
import WalkerpassMostPopularPassType from "../components/walkerPass/WalkerpassMostPopularPassType";
import WalkerpassPassTypeDistribution from "../components/walkerPass/WalkerpassPassTypeDistribution";
import WalkerpassExpiredPasses from "../components/walkerPass/WalkerpassExpiredPasses";
import WalkerpassFilter from "../components/walkerPass/WalkerpassFilter";
import { useWalkerpassStore } from "../components/walkerPass/store/walkerpassStore";
import WalkerpassCategory from "../components/walkerPass/WalkerpassCategory";
import DashboardViewPoints from "./park_admin/dashboard_components/DashboardViewPoints";
import { FaListAlt } from "react-icons/fa";
import { MdConfirmationNumber, MdErrorOutline, MdPending } from "react-icons/md";

function AdminDashboard() {
  superballs.register();

  const [DashboardDate, setDashboardDate] = useState("");
  // Single state for both dates
  const [dashboardDates, setDashboardDates] = useState({ fromDate: "", toDate: "" });
  const [pieChartData, setPieChartData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const [filters, setFilters] = useState({
    entityTypeId: "",
  });
  const {
    walkerPassDashboard,
    isFetchWalkerpassDashboardLoading,
    fetchWalkerpassDashboard,
  } = useWalkerpassStore();
  const {
    allParks,
    fetchAllParks,
    fetchAllNodalOfficerParks,
    allNodalOfficerParks,
  } = useParkStore();

  const { allEntityTypes, fetchAllEntityTypes } = useEntityTypesStore();
  const { allDepartmentTypes, fetchAllDepartmentTypes } =
    useDepartmentTypesStore();

  const { roleDetails, decodedTokenData } = useAuthStore();

  const role = roleDetails?.name;
  const userId = decodedTokenData?.data?.UserId;
  const parkId = decodedTokenData?.data?.ParkId;
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isBookingDate, setIsBookingDate] = useState(false);
  const [isFacilitiesBookingDate, setIsFacilitiesBookingDate] = useState(false);
  const [activeBookingsTab, setActiveBookingsTab] = useState("graph");
  const [activeAmountTab, setActiveAmountTab] = useState("graph");
  const [bookingSortOrder, setBookingSortOrder] = useState("none");
  const [bookingLocationFilter, setBookingLocationFilter] = useState("");
  const [amountSortOrder, setAmountSortOrder] = useState("none");
  const [locationNameFilter, setLocationNameFilter] = useState("");
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
    isFetchCountsLoading,
    isFetchPieChartsLoading,
    AllDepartmentEntities,
    isFetchDepartmentEntitiesLoading,
    fetchAllDepartmentEntities,
    BotanicalallCounts,
    fetchBotanicalDashboardCounts,
    isFetchBotanicalCountsLoading
  } = useDashboardStore();

  const { setDetailedReportParams } = useDashboardDetailedStore();
  const { fetchBuspassDashboard } = useBuspassDashboardStore();

  const initialValues = {
    fromDate: getCurrentDate(),
    toDate: "",
    entityId: "",
    departmentId: "",
    locationId: "",
  };

  useEffect(() => {
    fetchAllDepartmentTypes();
    const currentDate = getCurrentDate();
    fetchWalkerpassDashboard({ fromDate: "", toDate: "" });
    fetchAllEntityTypes();
    fetchAllDepartmentEntities({
      fromDate: "",
      toDate: "",
      entityId: "",
      locationId: "",
    });
    fetchAllDashboardCounts(roleDetails, {
      fromDate: "",
      toDate: "",
      active: false,
    });
    if (parkId === "a8f9123b-0e6f-41e3-9328-6e72eca950e0") {
      fetchBotanicalDashboardCounts({
        fromDate: "",
        toDate: "",
        active: false,
      });
    }



    fetchAllZooDashBoardCounts(
      {
        DashboardDateFrom: "",
        DashboardDateTo: "",
        bookingDateFrom: "",
        bookingDateTo: "",
      },
      roleDetails,
    )

    if (role === "ROLE_ADMIN" || role === "ROLE_ZOOPARKADMIN") {
      fetchAllZooDashBoardCountsTicketWise({
        fromDate: "",
        toDate: "",
        active: false,
      });
    }
    // fetchAllEntityBookingsByFilters(null, null, initialValues);
    fetchAllEntityWiseCounts({
      fromDate: "",
      toDate: "",
      active: false,
    }).then((data) => setPieChartData(data));
    if (role === "ROLE_NODALOFFICER") {
      fetchAllNodalOfficerParks(null, null, {}, userId);
    } else {
      fetchAllParks();
    }
    fetchAllParks();
  }, []);

  useEffect(() => {
    fetchAllEntityBookingsByFilters(initialValues);
  }, [pageIndex, pageSize]);



  const parksToRender =
    role === "ROLE_NODALOFFICER" ? allNodalOfficerParks : allParks;




  const dashboardCards = [
    {
      isPopup: false,
      isShow: true,
      lableName: "Total Bookings",
      count: allCounts?.totalCountById || "0",
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      isPopup: false,
      isShow: true,
      lableName: "Total Tickets",
      count: allCounts?.totalTickets || "0",
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      isPopup: false,
      isShow: true,
      lableName: "Total Income",
      // count: allCounts?.totalAmount,
      count: allCounts?.totalAmount || "0",
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
  ];
  const dashboardCardsCountByRole = [
    {
      isPopup: false,
      isShow: true,
      lableName: "Total Bookings",
      count: allCounts?.totalBookingsByRole || "0",
      upiCount: allCounts?.upiAmount || "0",
      cashCount: allCounts?.cashAmount || "0",
      percentageChange: 49,
      icon: IoTicketSharp,
    },
    {
      isPopup: true,
      isShow: true,
      lableName: "Total Amount",
      count: allCounts?.totalAmountByRole,
      upiCount: allCounts?.upiAmount || "0",
      cashCount: allCounts?.cashAmount || "0",
      percentageChange: 49,
      icon: FaIndianRupeeSign,
    },
    {
      isPopup: false,
      isShow: parkId === "a8f9123b-0e6f-41e3-9328-6e72eca950e0" ? true : false,
      lableName: "Payment Success Ticket Not Generated",
      count: allCounts?.paymentDoneTicketNotGeneratedCount,
      upiCount: allCounts?.upiAmount || "0",
      cashCount: allCounts?.cashAmount || "0",
      percentageChange: 49,
      icon: IoTicketSharp,
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
      (roleDetails?.name === "ROLE_ZOOPARKADMIN") |
      (roleDetails?.name === "ROLE_COUNTERLOGIN")
      ? dashboardCardsCountByRole
      : dashboardCards;

  const EsdInitialValues = {
    fromDate: "",
    toDate: "",
    entityId: "",
    departmentId: "",
    locationId: "",
  };
  const overAllOnSubmit = (values) => {
    fetchAllDashboardCounts(roleDetails, {
      ...values,
      active: true,
      fromDate: !isBookingDate ? values.fromDate : "",
      toDate: !isBookingDate ? values.toDate : "",
      bookingDateFrom: isBookingDate ? values.fromDate : "",
      bookingDateTo: isBookingDate ? values.toDate : "",
    });

    parkId === "a8f9123b-0e6f-41e3-9328-6e72eca950e0" && fetchBotanicalDashboardCounts({
      ...values,
      active: true,
      fromDate: !isBookingDate ? values.fromDate : "",
      toDate: !isBookingDate ? values.toDate : "",
      bookingDateFrom: isBookingDate ? values.fromDate : "",
      bookingDateTo: isBookingDate ? values.toDate : "",
    });

    fetchAllEntityWiseCounts({
      ...values,
      active: true,
      fromDate: !isBookingDate ? values.fromDate : "",
      toDate: !isBookingDate ? values.toDate : "",
      bookingDateFrom: isBookingDate ? values.fromDate : "",
      bookingDateTo: isBookingDate ? values.toDate : "",
    });
    fetchAllZooDashBoardCountsTicketWise({
      ...values,
      active: true,
      fromDate: !isBookingDate ? values.fromDate : "",
      toDate: !isBookingDate ? values.toDate : "",
      bookingDateFrom: isBookingDate ? values.fromDate : "",
      bookingDateTo: isBookingDate ? values.toDate : "",
    });
    fetchAllDepartmentEntities(values);
  };

  // Function to get filtered location categories based on selected department
  const getFilteredLocationCategories = (selectedDepartmentName) => {
    if (!selectedDepartmentName)
      return allEntityTypes?.filter((entity) => entity.isActive) || [];

    const allowedCategories =
      departmentToCategoryMapping[selectedDepartmentName] || [];

    return (
      allEntityTypes?.filter(
        (entity) =>
          entity.isActive && allowedCategories.includes(entity.entityTypeName),
      ) || []
    );
  };

  // Function to get department name by ID
  const getDepartmentNameById = (departmentId) => {
    const department = allDepartmentTypes?.find(
      (dept) => dept.departmentId === departmentId,
    );
    return department?.departmentName || "";
  };

  // const finalFacilitiesTicket =
  //   roleDetails?.name === "ROLE_NODALOFFICER"
  //     ? allZooDashboard
  //     : allZooDashboard;

  {/* Reusable loader component - add above your return */ }
  const CircleLoader = () => (
    <div className="w-5 h-5 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
  );

  return (
    <>
      {/* Cards */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-full ">
          <Formik initialValues={EsdInitialValues} onSubmit={overAllOnSubmit}>
            {({ values, setFieldValue }) => (
              <Form>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
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
                  {!(
                    roleDetails?.name === "ROLE_ADMIN" ||
                    roleDetails?.name === "ROLE_ZOOPARKADMIN"
                  ) && (
                      <>
                        {roleDetails?.name != "Role_DeptAdmin" && (
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
                                      option.value === values.departmentId,
                                  ) || null
                              }
                              options={allDepartmentTypes
                                ?.filter((dept) => dept.isActive)
                                .map((dept) => ({
                                  value: dept.departmentId,
                                  label: dept.departmentName,
                                }))}
                              onChange={(selectedOption) => {
                                const value = selectedOption?.value || "";
                                setFieldValue("departmentId", value);
                                // Clear location category and location when department changes
                                setFieldValue("entityId", "");
                                setFieldValue("locationId", "");
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
                                }),
                                option: (base, { isFocused }) => ({
                                  ...base,
                                  fontSize: "0.775rem",
                                  backgroundColor: isFocused
                                    ? "#F8F8F8"
                                    : "white",
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
                              getFilteredLocationCategories(
                                getDepartmentNameById(values.departmentId),
                              )
                                .map((entity) => ({
                                  value: entity.entityTypeId,
                                  label: entity.entityTypeName,
                                }))
                                .find(
                                  (option) => option.value === values.entityId,
                                ) || null
                            }
                            options={getFilteredLocationCategories(
                              getDepartmentNameById(values.departmentId),
                            ).map((entity) => ({
                              value: entity.entityTypeId,
                              label: entity.entityTypeName,
                            }))}
                            onChange={(selectedOption) => {
                              const value = selectedOption?.value || "";
                              setFieldValue("entityId", value);
                              // Clear location when location category changes
                              setFieldValue("locationId", "");
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
                            name="locationId"
                            value={
                              parksToRender
                                ?.map((park) => ({
                                  value: park.id,
                                  label: park.name,
                                }))
                                .find(
                                  (option) => option.value === values.locationId,
                                ) || null
                            }
                            options={parksToRender
                              ?.filter((park) => {

                                return (
                                  (park.departmentId == values.departmentId || values.departmentId == "") &&
                                  (park.entityTypeId == values.entityId || values.entityId == "")
                                );
                              })
                              .map((park) => ({
                                value: park.id,
                                label: park.name,
                              }))}
                            onChange={(selectedOption) => {
                              const value = selectedOption?.value || "";
                              setFieldValue("locationId", value);
                            }}
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
                      </>
                    )}
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
        {(parkId != "a8f9123b-0e6f-41e3-9328-6e72eca950e0") && cardsToDisplay &&
          cardsToDisplay.map((card, index) => (

            <>
              {card.isShow && <DashboardCard01
                setIsHovered={setIsHovered}
                isPopup={card.isPopup}
                key={index}
                lableName={card.lableName}
                count={card.count}
                percentageChange={card.percentageChange}
                icon={card.icon}
                isLoading={isFetchCountsLoading}
              />}

              <div className="absolute left-60 top-72">
                <HoverPopup isHovered={isHovered} data={card} />
              </div>
            </>
          ))}

        {(parkId === "a8f9123b-0e6f-41e3-9328-6e72eca950e0") && <div className="col-span-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Booking Summary Card */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">


              <div className="flex flex-col gap-3">
                {/* Total Bookings */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <FaListAlt className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Total Bookings
                    </span>
                  </div>
                  <span className="text-base font-bold text-blue-700">
                    {isFetchBotanicalCountsLoading ? (
                      <CircleLoader />
                    ) : (
                      <CountUp
                        end={BotanicalallCounts?.totalBookingsByRole || 0}
                        duration={2}
                        separator=","
                      />
                    )}
                  </span>
                </div>

                {/* Total Amount */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <FaIndianRupeeSign className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-600">
                      Total Amount
                    </span>
                  </div>
                  <span className="text-base font-bold text-green-700">
                    {isFetchBotanicalCountsLoading ? (
                      <CircleLoader />
                    ) : (
                      <>₹<CountUp end={BotanicalallCounts?.totalAmountByRole || 0} duration={2} separator="," /></>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Issues Card */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">


              <div className="flex flex-col gap-3">
                {/* Ticket Not Generated Count */}
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-100 rounded-lg">
                      <MdConfirmationNumber className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600 block">
                        Ticket Not Generated
                      </span>
                      <span className="text-xs  text-gray-500">
                        Payment success · Count
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-orange-600">
                    {isFetchBotanicalCountsLoading ? (
                      <CircleLoader />
                    ) : (
                      <CountUp
                        end={BotanicalallCounts?.paymentDoneTicketNotGeneratedCount || 0}
                        duration={2}
                        separator=","
                      />
                    )}
                  </span>
                </div>

                {/* Ticket Not Generated Amount */}
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-100 rounded-lg">
                      <FaIndianRupeeSign className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600 block">
                        Ticket Not Generated
                      </span>
                      <span className="text-xs  text-gray-500">
                        Payment success · Amount
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-red-600">
                    {isFetchBotanicalCountsLoading ? (
                      <CircleLoader />
                    ) : (
                      <>₹<CountUp end={BotanicalallCounts?.paymentDoneTicketNotGeneratedAmount || 0} duration={2} separator="," /></>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Pending Summary Card */}
            <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">


              <div className="flex flex-col gap-3">
                {/* Total Bookings with Pending */}
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <FaListAlt className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600 block">
                        Complete Total Bookings
                      </span>
                      <span className="text-xs text-gray-500">Summary</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-blue-700">
                    {isFetchBotanicalCountsLoading ? (
                      <CircleLoader />
                    ) : (
                      <CountUp
                        end={BotanicalallCounts?.totalBookingsWithPending || 0}
                        duration={2}
                        separator=","
                      />
                    )}
                  </span>
                </div>

                {/* Total Amount with Pending */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <FaIndianRupeeSign className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-gray-600 block">
                        Complete Total Amount
                      </span>
                      <span className="text-xs text-gray-500">Summary</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-green-700">
                    {isFetchBotanicalCountsLoading ? (
                      <CircleLoader />
                    ) : (
                      <>₹<CountUp end={BotanicalallCounts?.totalAmountWithPending || 0} duration={2} separator="," /></>
                    )}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>}

        {/* ZOO DASHBOARD */}
        {(roleDetails?.name === "ROLE_ZOOPARKADMIN" ||
          roleDetails?.name === "ROLE_ADMIN") &&
          dashboardCardCountZooTicketWise.map((card, index) => (
            parkId != "a8f9123b-0e6f-41e3-9328-6e72eca950e0" && <div
              key={index}
              className="flex flex-col justify-center col-span-full relative   md:col-span-4  xl:col-span-4 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200"
            >
              <span className="text-xs font-medium absolute top-0 right-0 px-[4px] rounded-es-md rounded-se-md bg-gray-400 text-white">
                Ticket Wise{" "}
              </span>
              <div className="flex items-center">
                <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-gray-400 border  rounded-lg shadow-md shadow-gray-300">
                  <card.icon className="text-3xl font-bold text-white dark:text-gray-100" />
                </div>

                {isFetchZooDashboardTicketWiseLoading ? (
                  <div className="space-y-2 ml-4">
                    {/* Skeleton for count */}
                    <div className="h-6 w-36 bg-gray-100 rounded animate-pulse"></div>
                    {/* Skeleton for label */}
                    <div className="h-4 w-48 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                ) : (
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
                )}
              </div>
            </div>
          ))}
        <div className="col-span-full lg:col-span-6  xl:col-span-6"></div>
        {roleDetails?.name === "ROLE_ZOOPARKADMIN" ||
          roleDetails?.name === "ROLE_ADMIN" ||
          roleDetails?.name === "ROLE_COUNTERLOGIN" ? (
          <>
            <div className="col-span-full ">
              <h1 className=" text-xl font-bold">
                Facilities and Ticket Details
              </h1>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-6 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700">
                    Booking/Purchase Date
                  </label>
                  <select
                    onChange={(e) => setIsFacilitiesBookingDate(e.target.value === "true")}
                    name="bookingDate"
                    className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                  >
                    <option value="false">Purchase Date</option>
                    <option value="true">Booking Date</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fromDate" className="block text-xs font-medium text-gray-700">
                    From Date
                  </label>
                  <input
                    type="date"
                    name="fromDate"
                    className="mt-1 block px-2 py-1 border w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    value={dashboardDates.fromDate}
                    onChange={(e) => setDashboardDates((prev) => ({ ...prev, fromDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label htmlFor="toDate" className="block text-xs font-medium text-gray-700">
                    To Date
                  </label>
                  <input
                    type="date"
                    name="toDate"
                    className="mt-1 block px-2 py-1 border w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    value={dashboardDates.toDate}
                    min={dashboardDates.fromDate}
                    onChange={(e) => setDashboardDates((prev) => ({ ...prev, toDate: e.target.value }))}
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      fetchAllZooDashBoardCounts(
                        {
                          DashboardDateFrom: !isFacilitiesBookingDate ? dashboardDates.fromDate : "",
                          DashboardDateTo: !isFacilitiesBookingDate ? dashboardDates.toDate : "",
                          bookingDateFrom: isFacilitiesBookingDate ? dashboardDates.fromDate : "",
                          bookingDateTo: isFacilitiesBookingDate ? dashboardDates.toDate : "",
                        },
                        roleDetails,
                      );
                    }}
                    className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
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
                  className="flex flex-col col-span-full   md:col-span-4  xl:col-span-4 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200"
                >
                  <div className="flex items-center">
                    <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-gray-400 border  rounded-lg shadow-md shadow-gray-300">
                      <img
                        src={services.service[0].serviceImage}
                        // src={img}
                        className="text-3xl font-bold text-white dark:text-gray-100 w-8 h-8 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><rect width="24" height="24" x="0" y="0" fill="%23f3f4f6" rx="2"/><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V12" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7l10 5 10-5" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                        }}
                        alt={services.service[0]?.serviceName || "Service"}
                      />
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <div
                        // to="/dashboard-detailed-report"
                        className="text-2xl  font-bold leading-none   "
                        onClick={() => {
                          setDetailedReportParams({
                            Date: DashboardDate,
                            ServiceId: services.service[0]?.serviceId,
                            serviceName: services.service[0]?.serviceName,
                          });
                        }}
                      >
                        <CountUp
                          end={services.service[0]?.totalQuantity}
                          duration={2}
                          prefix=""
                          separator=","
                        />
                      </div>
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
                              {Variant.totalQuantitys}
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
              allZooDashboard.service?.map((service, serviceIndex) => (
                <div
                  key={serviceIndex}
                  className="group flex flex-col col-span-full justify-center sm:col-span-4 xl:col-span-4 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200 relative"
                >
                  <div className="flex items-center">
                    <div className="inline-flex flex-shrink-0 justify-center items-center w-12 h-12 text-white bg-gray-400 rounded-lg shadow-md shadow-gray-300">
                      <img
                        src={service.serviceImage}
                        className="text-3xl font-bold text-white dark:text-gray-100 w-8 h-8 object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><rect width="24" height="24" x="0" y="0" fill="%23f3f4f6" rx="2"/><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V12" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7l10 5 10-5" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                        }}
                        alt={service?.serviceName || "Service"}
                      />
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      <div
                        className="text-2xl font-bold leading-none cursor-pointer"
                        onClick={() => {
                          setDetailedReportParams({
                            Date: DashboardDate,
                            ServiceId: service.serviceId,
                            serviceName: service?.serviceName,
                          });
                        }}
                      >
                        <CountUp
                          end={service.totalQuantity}
                          duration={2}
                          prefix=""
                          separator=","
                        />
                      </div>
                      <h1 className="text-sm font-medium">{service.serviceName}</h1>
                    </div>
                  </div>

                  {/* Popup on hover — floats above the card */}
                  {(service.serviceVariants?.length > 0 && parkId === "a8f9123b-0e6f-41e3-9328-6e72eca950e0") && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50
                        invisible opacity-0 group-hover:visible group-hover:opacity-100
                        transition-all duration-200 ease-in-out pointer-events-none">

                      {/* Popup box */}
                      <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-4 py-3 min-w-max">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                          {service.serviceName} Types
                        </p>
                        <div className="flex flex-col gap-1">
                          {service.serviceVariants.map((Variant, variantIndex) => (
                            <div key={variantIndex} className="flex items-center justify-between gap-6">
                              <h3 className="text-sm font-normal text-gray-500">
                                {Variant.serviceVariantName}
                              </h3>
                              <h3 className="text-sm font-bold text-blue-v2">
                                {Variant.totalQuantity}
                              </h3>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Arrow pointing down */}
                      <div className="w-3 h-3 bg-white border-r border-b border-gray-200 
                          rotate-45 mx-auto -mt-[7px] shadow-sm" />
                    </div>
                  )}

                </div>
              ))
            )}
          </>
        ) : null}

        {/* for nodal officer */}


        {roleDetails?.name === "ROLE_NODALOFFICER" && (
          <>
            <div className="col-span-full ">

              <div className="col-span-full ">
                <h1 className=" text-xl font-bold">
                  Facilities and Ticket Details
                </h1>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Booking/Purchase Date
                    </label>
                    <select
                      onChange={(e) => setIsFacilitiesBookingDate(e.target.value === "true")}
                      name="bookingDate"
                      className="mt-1 block w-full px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                    >
                      <option value="false">Purchase Date</option>
                      <option value="true">Booking Date</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="fromDate" className="block text-xs font-medium text-gray-700">
                      From Date
                    </label>
                    <input
                      type="date"
                      name="fromDate"
                      className="mt-1 block px-2 py-1 border w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      value={dashboardDates.fromDate}
                      onChange={(e) => setDashboardDates((prev) => ({ ...prev, fromDate: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label htmlFor="toDate" className="block text-xs font-medium text-gray-700">
                      To Date
                    </label>
                    <input
                      type="date"
                      name="toDate"
                      className="mt-1 block px-2 py-1 border w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
                      value={dashboardDates.toDate}
                      min={dashboardDates.fromDate}
                      onChange={(e) => setDashboardDates((prev) => ({ ...prev, toDate: e.target.value }))}
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        fetchAllZooDashBoardCounts(
                          {
                            DashboardDateFrom: !isFacilitiesBookingDate ? dashboardDates.fromDate : "",
                            DashboardDateTo: !isFacilitiesBookingDate ? dashboardDates.toDate : "",
                            bookingDateFrom: isFacilitiesBookingDate ? dashboardDates.fromDate : "",
                            bookingDateTo: isFacilitiesBookingDate ? dashboardDates.toDate : "",
                          },
                          roleDetails,
                        );
                      }}
                      className="bg-green-700 text-xs text-white rounded-lg px-3 py-1.5 hover:bg-gray-100 hover:text-green-700 border border-green-700 hover:border-green-700"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>


            {!isFetchZooDashboardLoading ? (
              Array.isArray(allZooDashboard) && allZooDashboard?.map((dashboardItem, dashboardIndex) => (
                <>

                  {(dashboardItem?.data.length || dashboardItem?.service.length) != 0 && <div className=" col-span-full font-semibold text-base "><span className="">{dashboardItem.parkName}</span></div>}
                  {/* DATA MAP */}
                  {Array.isArray(dashboardItem?.data) && dashboardItem?.data?.map((services, serviceIndex) => (
                    <div
                      key={`data-${serviceIndex}`}
                      className="flex flex-col col-span-full md:col-span-4 xl:col-span-4 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className="inline-flex justify-center items-center w-12 h-12 bg-gray-400 rounded-lg shadow-md">
                          <img
                            src={services?.service?.[0]?.serviceImage}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><rect width="24" height="24" x="0" y="0" fill="%23f3f4f6" rx="2"/><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V12" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7l10 5 10-5" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                            }}
                            alt={
                              services?.service?.[0]?.serviceName || "Service"
                            }
                          />
                        </div>

                        <div className="ml-3">
                          <div
                            className="text-2xl font-bold leading-none"
                            onClick={() =>
                              setDetailedReportParams({
                                Date: DashboardDate,
                                ServiceId: services?.service?.[0]?.serviceId,
                                serviceName:
                                  services?.service?.[0]?.serviceName,
                              })
                            }
                          >
                            <CountUp
                              end={services?.service?.[0]?.totalQuantity || 0}
                              duration={2}
                              separator=","
                            />
                          </div>

                          <h1 className="text-xs font-medium">
                            {services?.service?.[0]?.serviceName}
                          </h1>

                          <div className="flex gap-2">
                            {Array.isArray(services?.service) && services?.service?.map((variant, variantIndex) => (
                              <div
                                key={variantIndex}
                                className="flex gap-1 items-center"
                              >
                                <h3 className="text-sm text-gray-500">
                                  {variant.serviceVariantName}:
                                </h3>
                                <h3 className="text-base font-semibold text-gray-500">
                                  {variant.totalQuantitys}
                                </h3>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* SERVICE MAP */}
                  {Array.isArray(dashboardItem?.service) && dashboardItem?.service?.map((service, serviceIndex) => (
                    <div
                      key={`service-${serviceIndex}`}
                      className="flex flex-col col-span-full sm:col-span-4 xl:col-span-4 bg-white/30 backdrop-blur-sm shadow-lg shadow-gray-200 rounded-2xl p-4 border-2 border-gray-200"
                    >
                      <div className="flex items-center">
                        <div className="inline-flex justify-center items-center w-12 h-12 bg-gray-400 rounded-lg shadow-md">
                          <img
                            src={service?.serviceImage}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"><rect width="24" height="24" x="0" y="0" fill="%23f3f4f6" rx="2"/><path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 22V12" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M2 7l10 5 10-5" fill="none" stroke="%239ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
                            }}
                            alt={service?.serviceName || "Service"}
                          />
                        </div>

                        <div className="ml-3">
                          <div
                            className="text-2xl font-bold leading-none"
                            onClick={() =>
                              setDetailedReportParams({
                                Date: DashboardDate,
                                ServiceId: service?.serviceId,
                                serviceName: service?.serviceName,
                              })
                            }
                          >
                            <CountUp
                              end={service?.totalQuantity || 0}
                              duration={2}
                              separator=","
                            />
                          </div>

                          <h1 className="text-sm font-medium">
                            {service?.serviceName}
                          </h1>
                        </div>
                      </div>
                    </div>
                  ))}

                </>
              ))
            ) : (
              <div className="px-96 py-20 flex justify-center">
                <l-superballs
                  size="40"
                  speed="1.4"
                  color="black"
                ></l-superballs>
              </div>
            )}
          </>
        )}

        {/* PIE CHART */}
        {(roleDetails?.name == "ROLE_SUPERADMIN" ||
          roleDetails?.name == "Role_DeptAdmin") && (
            <>
              {/* Total Bookings Section */}
              <DashboardCard07>
                <div className="w-full">
                  <h2 className="text-xl font-bold mb-4">Total Bookings</h2>

                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      onClick={() => setActiveBookingsTab("graph")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeBookingsTab === "graph"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Graph View
                    </button>
                    <button
                      onClick={() => setActiveBookingsTab("list")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeBookingsTab === "list"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      List View
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeBookingsTab === "graph" && (
                    <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
                      <PieChart
                        isLoading={isFetchPieChartsLoading}
                        data={allPieCharts}
                        title="Total Bookings"
                        angleKey="entityWiseTotalBookings"
                      />
                    </div>
                  )}

                  {activeBookingsTab === "list" && (
                    <div className="relative">
                      {/* Controls: Location filter and Bookings sort */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-700"></label>
                          <input
                            type="text"
                            value={bookingLocationFilter}
                            onChange={(e) =>
                              setBookingLocationFilter(e.target.value)
                            }
                            placeholder="location name..."
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-700">
                            Sort by:
                          </label>
                          <select
                            className="border w-28 border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={bookingSortOrder}
                            onChange={(e) => setBookingSortOrder(e.target.value)}
                          >
                            <option value="none">None</option>
                            <option value="asc">Low to High</option>
                            <option value="desc">High to Low</option>
                          </select>
                        </div>
                      </div>
                      <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-bold text-[#002352] tracking-wider border-b">
                                S.No
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-[#002352] tracking-wider border-b">
                                Location Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-[#002352] tracking-wider border-b">
                                Bookings
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {isFetchPieChartsLoading ? (
                              <tr>
                                <td
                                  colSpan="3"
                                  className="px-4 py-8 text-center text-gray-500"
                                >
                                  <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                  </div>
                                </td>
                              </tr>
                            ) : allPieCharts && allPieCharts.length > 0 ? (
                              (() => {
                                const filtered = (allPieCharts || []).filter(
                                  (item) => {
                                    const name = (item?.entity || "")
                                      .toString()
                                      .toLowerCase();
                                    return bookingLocationFilter
                                      ? name.includes(
                                        bookingLocationFilter.toLowerCase(),
                                      )
                                      : true;
                                  },
                                );
                                if (filtered.length === 0) {
                                  return (
                                    <tr>
                                      <td
                                        colSpan="3"
                                        className="px-4 py-8 text-center text-gray-500"
                                      >
                                        No data available
                                      </td>
                                    </tr>
                                  );
                                }
                                const sorted =
                                  bookingSortOrder === "none"
                                    ? filtered
                                    : [...filtered].sort((a, b) => {
                                      const av = Number(
                                        a?.entityWiseTotalBookings || 0,
                                      );
                                      const bv = Number(
                                        b?.entityWiseTotalBookings || 0,
                                      );
                                      return bookingSortOrder === "asc"
                                        ? av - bv
                                        : bv - av;
                                    });
                                return sorted.map((item, index) => (
                                  <tr
                                    key={index}
                                    className={
                                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                  >
                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                      {index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                      {item.entity || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                      {item.entityWiseTotalBookings
                                        ? new Intl.NumberFormat("en-IN").format(
                                          item.entityWiseTotalBookings,
                                        )
                                        : "0"}
                                    </td>
                                  </tr>
                                ));
                              })()
                            ) : (
                              <tr>
                                <td
                                  colSpan="3"
                                  className="px-4 py-8 text-center text-gray-500"
                                >
                                  No data available
                                </td>
                              </tr>
                            )}
                          </tbody>
                          {!isFetchPieChartsLoading &&
                            allPieCharts?.length > 0 &&
                            (() => {
                              const filtered = (allPieCharts || []).filter(
                                (item) => {
                                  const name = (item?.entity || "")
                                    .toString()
                                    .toLowerCase();
                                  return bookingLocationFilter
                                    ? name.includes(
                                      bookingLocationFilter.toLowerCase(),
                                    )
                                    : true;
                                },
                              );
                              return filtered.length > 0;
                            })() && (
                              <tfoot className="sticky bottom-0 bg-[#DDF2FF] border-[#DDF2FF] shadow-lg">
                                <tr>
                                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                    {/* Empty S.No column */}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                    Total
                                  </td>
                                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                    {(() => {
                                      const filtered = (
                                        allPieCharts || []
                                      ).filter((item) => {
                                        const name = (item?.entity || "")
                                          .toString()
                                          .toLowerCase();
                                        return bookingLocationFilter
                                          ? name.includes(
                                            bookingLocationFilter.toLowerCase(),
                                          )
                                          : true;
                                      });
                                      const total = filtered.reduce(
                                        (sum, item) =>
                                          sum +
                                          (item.entityWiseTotalBookings || 0),
                                        0,
                                      );
                                      return new Intl.NumberFormat(
                                        "en-IN",
                                      ).format(total);
                                    })()}
                                  </td>
                                </tr>
                              </tfoot>
                            )}
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </DashboardCard07>

              {/* Total Amount Section */}
              <DashboardCard07>
                <div className="w-full">
                  <h2 className="text-xl font-bold mb-4">Total Amount</h2>

                  {/* Tab Navigation */}
                  <div className="flex border-b border-gray-200 mb-4">
                    <button
                      onClick={() => setActiveAmountTab("graph")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeAmountTab === "graph"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Graph View
                    </button>
                    <button
                      onClick={() => setActiveAmountTab("list")}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeAmountTab === "list"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      List View
                    </button>
                  </div>

                  {/* Tab Content */}
                  {activeAmountTab === "graph" && (
                    <div className="flex-1 m-1 rounded-lg overflow-hidden shadow-md">
                      <PieChart
                        isLoading={isFetchPieChartsLoading}
                        data={allPieCharts}
                        title="Total Amount"
                        angleKey="entityWiseTotalAmount"
                      />
                    </div>
                  )}

                  {activeAmountTab === "list" && (
                    <div className="relative">
                      {/* Controls: Location filter and Amount sort */}
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-700"></label>
                          <input
                            type="text"
                            value={locationNameFilter}
                            onChange={(e) =>
                              setLocationNameFilter(e.target.value)
                            }
                            placeholder="location name..."
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-semibold text-gray-700">
                            Sort by:
                          </label>
                          <select
                            className="border border-gray-300 w-28 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={amountSortOrder}
                            onChange={(e) => setAmountSortOrder(e.target.value)}
                          >
                            <option value="none">None</option>
                            <option value="asc">Low to High</option>
                            <option value="desc">High to Low</option>
                          </select>
                        </div>
                      </div>
                      <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                          <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-bold text-[#002352] tracking-wider border-b">
                                S.No
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-[#002352] tracking-wider border-b">
                                Location Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-[#002352] tracking-wider border-b">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {isFetchPieChartsLoading ? (
                              <tr>
                                <td
                                  colSpan="3"
                                  className="px-4 py-8 text-center text-gray-500"
                                >
                                  <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                  </div>
                                </td>
                              </tr>
                            ) : allPieCharts && allPieCharts.length > 0 ? (
                              // Compute filtered and sorted data for display
                              (() => {
                                const filtered = (allPieCharts || []).filter(
                                  (item) => {
                                    const name = (item?.entity || "")
                                      .toString()
                                      .toLowerCase();
                                    return locationNameFilter
                                      ? name.includes(
                                        locationNameFilter.toLowerCase(),
                                      )
                                      : true;
                                  },
                                );
                                if (filtered.length === 0) {
                                  return (
                                    <tr>
                                      <td
                                        colSpan="3"
                                        className="px-4 py-8 text-center text-gray-500"
                                      >
                                        No data available
                                      </td>
                                    </tr>
                                  );
                                }
                                const sorted =
                                  amountSortOrder === "none"
                                    ? filtered
                                    : [...filtered].sort((a, b) => {
                                      const av = Number(
                                        a?.entityWiseTotalAmount || 0,
                                      );
                                      const bv = Number(
                                        b?.entityWiseTotalAmount || 0,
                                      );
                                      return amountSortOrder === "asc"
                                        ? av - bv
                                        : bv - av;
                                    });
                                return sorted.map((item, index) => (
                                  <tr
                                    key={index}
                                    className={
                                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                  >
                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                      {index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                      {item.entity || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">
                                      {item.entityWiseTotalAmount
                                        ? formatToCurrency(
                                          item.entityWiseTotalAmount,
                                          "INR",
                                          "en-IN",
                                        )
                                        : "₹0"}
                                    </td>
                                  </tr>
                                ));
                              })()
                            ) : (
                              <tr>
                                <td
                                  colSpan="3"
                                  className="px-4 py-8 text-center text-gray-500"
                                >
                                  No data available
                                </td>
                              </tr>
                            )}
                          </tbody>
                          {!isFetchPieChartsLoading &&
                            allPieCharts?.length > 0 &&
                            (() => {
                              const filtered = (allPieCharts || []).filter(
                                (item) => {
                                  const name = (item?.entity || "")
                                    .toString()
                                    .toLowerCase();
                                  return locationNameFilter
                                    ? name.includes(
                                      locationNameFilter.toLowerCase(),
                                    )
                                    : true;
                                },
                              );
                              return filtered.length > 0;
                            })() && (
                              <tfoot className="sticky bottom-0 bg-[#DDF2FF] border-[#DDF2FF] shadow-lg">
                                <tr>
                                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                    {/* Empty S.No column */}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                    Total
                                  </td>
                                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                    {(() => {
                                      const filtered = (
                                        allPieCharts || []
                                      ).filter((item) => {
                                        const name = (item?.entity || "")
                                          .toString()
                                          .toLowerCase();
                                        return locationNameFilter
                                          ? name.includes(
                                            locationNameFilter.toLowerCase(),
                                          )
                                          : true;
                                      });
                                      const total = filtered.reduce(
                                        (sum, item) =>
                                          sum + (item.entityWiseTotalAmount || 0),
                                        0,
                                      );
                                      return formatToCurrency(
                                        total,
                                        "INR",
                                        "en-IN",
                                      );
                                    })()}
                                  </td>
                                </tr>
                              </tfoot>
                            )}
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </DashboardCard07>
            </>
          )}
        {role === "Role_DeptAdmin" && (
          <DashboardCard07>
            <DepartmentTable
              AllDepartmentEntities={AllDepartmentEntities}
              isFetchDepartmentEntitiesLoading={
                isFetchDepartmentEntitiesLoading
              }
            />
          </DashboardCard07>
        )}

        {/* <WalkerpassFilter />
            <WalkerpassOverallDetails />
            <WalkerpassCategory />
            <WalkerpassExpiredPasses /> */}
        {/* <WalkerpassRenewalPasses /> */}
        {/* <WalkerpassMostPopularPassType /> */}
        {/* <WalkerpassPassTypeDistribution /> */}
      </div>
      {/* View Points Counts */}
      {roleDetails?.name === "ROLE_ADMIN" &&
        decodedTokenData.data?.ParkId === "100" && <DashboardViewPoints />}
    </>
  );
}

export default AdminDashboard;
